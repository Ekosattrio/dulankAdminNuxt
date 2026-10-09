import { randomUUID } from 'node:crypto'
import type { PaymentFlowFormData, PaymentFlowMethod, PaymentFlowRecord, PaymentFlowStatus } from '#server/types/payment-flow'

export function paymentFlowFilename(kind: 'inflow' | 'outflow') {
  return kind === 'inflow' ? 'payment-inflows.json' : 'payment-outflows.json'
}

export function paymentPrefix(kind: 'inflow' | 'outflow') {
  return kind === 'inflow' ? 'IN' : 'OUT'
}

export function normalizePaymentFlow(kind: 'inflow' | 'outflow', body: PaymentFlowFormData, previous?: PaymentFlowRecord): PaymentFlowRecord {
  const amount = Number(body.amount) || 0
  const paymentAmount = Number(body.paymentAmount ?? amount) || 0
  if (!body.name?.trim()) throw createError({ statusCode: 400, statusMessage: 'Name is required' })
  if (!body.source?.trim()) throw createError({ statusCode: 400, statusMessage: 'Source is required' })
  if (!Number.isFinite(amount) || amount <= 0) {
    throw createError({ statusCode: 400, statusMessage: 'Amount must be greater than zero' })
  }
  if (!Number.isFinite(paymentAmount) || paymentAmount < 0 || paymentAmount > amount) {
    throw createError({ statusCode: 400, statusMessage: 'Payment amount must be between zero and the amount' })
  }

  const status: PaymentFlowStatus = body.status || (paymentAmount >= amount ? 'Paid' : paymentAmount > 0 ? 'Partial' : 'Unpaid')
  const method: PaymentFlowMethod = body.method || previous?.method || '-'
  const refNo = body.refNo || previous?.refNo || `${paymentPrefix(kind)}-${randomUUID().slice(0, 8).toUpperCase()}`
  const paymentDate = body.paymentDate || previous?.paymentDate || body.date
  const historyAmount = status === 'Unpaid' ? 0 : paymentAmount

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
    transactionDetails: body.transactionDetails ?? previous?.transactionDetails ?? defaultTransactionDetails(kind),
    payments:
      historyAmount > 0
        ? [
            {
              id: previous?.payments?.[0]?.id || randomUUID(),
              amount: historyAmount,
              datePayment: `${paymentDate}, 15:45`,
              method,
              fromAccount: body.bankTransfer?.fromBankAccount,
              toAccount:
                body.bankTransfer?.toBankWallet || body.bankTransfer?.toAccountName
                  ? [body.bankTransfer?.toBankWallet, body.bankTransfer?.toAccountNumber, body.bankTransfer?.toAccountName]
                      .filter(Boolean)
                      .join(' / ')
                  : previous?.payments?.[0]?.toAccount,
              createdPayment: previous?.payments?.[0]?.createdPayment || 'Sales Staff : 26/02/2026, 15:45',
            },
            ...(previous?.payments?.slice(1) || []),
          ]
        : previous?.payments || [],
  }
}

export function defaultTransactionDetails(kind: 'inflow' | 'outflow') {
  return kind === 'inflow'
    ? [
        { refNo: 'INC-00002', source: 'Purchase', amount: 750000, status: 'Paid' as const },
        { refNo: 'INV-00524', source: 'Purchase', amount: 1250000, status: 'Paid' as const },
        { refNo: 'INV-00789', source: 'Purchase', amount: 250000, status: 'Partial' as const },
      ]
    : [
        { refNo: 'INC-00002', source: 'Purchase', amount: 3250000, status: 'Paid' as const },
        { refNo: 'INV-00524', source: 'Purchase', amount: 1250000, status: 'Paid' as const },
        { refNo: 'INV-00789', source: 'Purchase', amount: 750000, status: 'Partial' as const },
      ]
}
