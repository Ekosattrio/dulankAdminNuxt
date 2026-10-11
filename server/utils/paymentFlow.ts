import { randomUUID } from 'node:crypto'
import type {
  PaymentBalanceEntry,
  PaymentFlowFilterParams,
  PaymentFlowFormData,
  PaymentFlowKind,
  PaymentFlowMethod,
  PaymentFlowRecord,
  PaymentFlowStatus,
  PaymentHistoryEntry,
  PaymentSplitEntry,
  PaymentTransactionDetail,
} from '#server/types/payment-flow'
import { isDateWithinRange } from './dateRange'
import { readPaymentFlowData, writePaymentFlowData } from './paymentFlowData'

export function paymentFlowFilename(kind: PaymentFlowKind) {
  return kind === 'inflow' ? 'payment-inflows.json' : 'payment-outflows.json'
}

export function paymentPrefix(kind: PaymentFlowKind) {
  return kind === 'inflow' ? 'IN' : 'OUT'
}

export function normalizePaymentFlow(kind: PaymentFlowKind, body: PaymentFlowFormData, previous?: PaymentFlowRecord): PaymentFlowRecord {
  const transactionDetails = normalizeTransactionDetails(body.transactionDetails ?? previous?.transactionDetails ?? [])
  const detailsTotal = transactionDetails.reduce((sum, detail) => sum + detail.amount, 0)
  const amount = detailsTotal || Number(body.amount) || 0
  const splitPayments = normalizeSplitPayments(body.splitPayments)
  const paymentAmount = splitPayments.length
    ? splitPayments.reduce((sum, payment) => sum + payment.amount, 0)
    : Number(body.paymentAmount ?? amount) || 0
  if (!body.name?.trim()) throw createError({ statusCode: 400, statusMessage: 'Name is required' })
  if (!body.source?.trim()) throw createError({ statusCode: 400, statusMessage: 'Source is required' })
  if (!Number.isFinite(amount) || amount <= 0) {
    throw createError({ statusCode: 400, statusMessage: 'Amount must be greater than zero' })
  }
  if (!Number.isFinite(paymentAmount) || paymentAmount < 0 || paymentAmount > amount) {
    throw createError({ statusCode: 400, statusMessage: 'Payment amount must be between zero and the amount' })
  }

  const status: PaymentFlowStatus = paymentAmount >= amount ? 'Paid' : paymentAmount > 0 ? 'Partial' : 'Unpaid'
  const method: PaymentFlowMethod = splitPayments[0]?.method || body.method || previous?.method || '-'
  const refNo = body.refNo || previous?.refNo || `${paymentPrefix(kind)}-${randomUUID().slice(0, 8).toUpperCase()}`
  const paymentDate = body.paymentDate || previous?.paymentDate || body.date
  const historyAmount = status === 'Unpaid' ? 0 : paymentAmount
  const adjustedDetails = applyPaymentStatus(transactionDetails, paymentAmount)

  return {
    id: body.id || previous?.id || randomUUID(),
    date: body.date,
    refNo,
    name: body.name.trim(),
    source: body.source,
    amount,
    dueDate: body.dueDate || previous?.dueDate || body.date,
    status,
    method: status === 'Unpaid' ? '-' : method,
    note: body.note ?? previous?.note ?? '',
    paymentDate,
    bankTransfer: body.bankTransfer ?? previous?.bankTransfer,
    transactionDetails: adjustedDetails.length ? adjustedDetails : previous?.transactionDetails,
    splitPayments: splitPayments.length ? splitPayments : undefined,
    payments: buildPaymentHistory(body, previous, paymentDate, method, historyAmount, splitPayments),
  }
}

function normalizeTransactionDetails(details: PaymentTransactionDetail[]): PaymentTransactionDetail[] {
  return details.map((detail) => {
    const amount = Number(detail.amount) || 0
    if (!detail.refNo?.trim() || !detail.source?.trim() || amount <= 0) {
      throw createError({ statusCode: 400, statusMessage: 'Each transaction detail requires a reference, source, and positive amount' })
    }
    return { ...detail, refNo: detail.refNo.trim(), source: detail.source.trim(), amount }
  })
}

function normalizeSplitPayments(entries: PaymentSplitEntry[] | undefined): PaymentSplitEntry[] {
  if (!entries?.length) return []
  return entries.map((entry) => {
    const amount = Number(entry.amount) || 0
    if (amount <= 0) throw createError({ statusCode: 400, statusMessage: 'Each split payment amount must be greater than zero' })
    if (!['Cash', 'Transfer', 'Balance'].includes(entry.method)) {
      throw createError({ statusCode: 400, statusMessage: 'Invalid split payment method' })
    }
    return { id: entry.id || randomUUID(), method: entry.method, amount }
  })
}

function applyPaymentStatus(details: PaymentTransactionDetail[], paymentAmount: number): PaymentTransactionDetail[] {
  const rows = details.map((detail) => ({ ...detail, status: 'Paid' as PaymentFlowStatus }))
  const total = rows.reduce((sum, detail) => sum + detail.amount, 0)
  let remaining = Math.max(0, total - paymentAmount)
  for (let index = rows.length - 1; index >= 0 && remaining > 0; index -= 1) {
    const row = rows[index]
    if (!row) continue
    row.status = 'Partial'
    remaining = Math.max(0, remaining - row.amount)
  }
  return rows
}

function buildPaymentHistory(
  body: PaymentFlowFormData,
  previous: PaymentFlowRecord | undefined,
  paymentDate: string,
  method: PaymentFlowMethod,
  historyAmount: number,
  splitPayments: PaymentSplitEntry[],
): PaymentHistoryEntry[] {
  if (historyAmount <= 0) return previous?.payments || []
  const createdPayment = `Admin : ${new Date().toISOString()}`
  if (splitPayments.length) {
    return splitPayments.map((entry) => ({
      id: entry.id,
      amount: entry.amount,
      datePayment: paymentDate,
      method: entry.method,
      createdPayment,
    }))
  }
  return [
    {
      id: previous?.payments?.[0]?.id || randomUUID(),
      amount: historyAmount,
      datePayment: paymentDate,
      method,
      fromAccount: body.bankTransfer?.fromBankAccount,
      toAccount:
        body.bankTransfer?.toBankWallet || body.bankTransfer?.toAccountName
          ? [body.bankTransfer?.toBankWallet, body.bankTransfer?.toAccountNumber, body.bankTransfer?.toAccountName]
              .filter(Boolean)
              .join(' / ')
          : previous?.payments?.[0]?.toAccount,
      createdPayment: previous?.payments?.[0]?.createdPayment || createdPayment,
    },
    ...(previous?.payments?.slice(1) || []),
  ]
}

export function listPaymentFlows(kind: PaymentFlowKind, filters: PaymentFlowFilterParams = {}) {
  const search = filters.search?.toLowerCase().trim() || ''
  let records = readPaymentFlowData<PaymentFlowRecord>(paymentFlowFilename(kind))
  if (search) {
    records = records.filter((item) =>
      [item.refNo, item.name, item.source, item.note].some((value) => value?.toLowerCase().includes(search)),
    )
  }
  if (filters.date) records = records.filter((item) => item.date.toLowerCase().includes(filters.date!.toLowerCase()))
  if (filters.startDate || filters.endDate) {
    records = records.filter((item) => isDateWithinRange(item.date, filters.startDate || '', filters.endDate || ''))
  }
  if (filters.source) records = records.filter((item) => item.source === filters.source)
  if (filters.status) records = records.filter((item) => item.status === filters.status)
  return records
}

export function getPaymentBalances() {
  return readPaymentFlowData<PaymentBalanceEntry>('payment-balances.json')
}

export function savePaymentFlow(kind: PaymentFlowKind, body: PaymentFlowFormData) {
  const filename = paymentFlowFilename(kind)
  const records = readPaymentFlowData<PaymentFlowRecord>(filename)
  if (body.id) {
    const index = records.findIndex((record) => record.id === body.id)
    if (index === -1) throw createError({ statusCode: 404, statusMessage: `Payment ${kind} not found` })
    const current = records[index]
    if (!current) throw createError({ statusCode: 404, statusMessage: `Payment ${kind} not found` })
    const updated = normalizePaymentFlow(kind, body, current)
    records[index] = updated
    writePaymentFlowData(filename, records)
    return updated
  }
  const created = normalizePaymentFlow(kind, body)
  records.unshift(created)
  writePaymentFlowData(filename, records)
  return created
}

export function deletePaymentFlow(kind: PaymentFlowKind, id: string) {
  if (!id) throw createError({ statusCode: 400, statusMessage: `Payment ${kind} ID is required` })
  const filename = paymentFlowFilename(kind)
  const records = readPaymentFlowData<PaymentFlowRecord>(filename)
  const next = records.filter((record) => record.id !== id && record.refNo !== id)
  if (next.length === records.length) throw createError({ statusCode: 404, statusMessage: `Payment ${kind} not found` })
  writePaymentFlowData(filename, next)
  return { id }
}
