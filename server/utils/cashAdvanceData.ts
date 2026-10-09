import { createError } from 'h3'
import { readJSON, writeJSON } from './data'
import type { BankAccount, BankAccountLedgerEntry } from '#server/types/bank-account'
import type { CashAdvance, CashAdvanceFormData, CashAdvanceView } from '#server/types/cash-advance'
import type { EmployeeItem } from '#server/types/employee'

const FILE = 'cash-advances.json'
const ACCOUNT_FILE = 'bank-accounts.json'
const LEDGER_FILE = 'bank-account-ledger.json'

function balanceFor(accountId: string, ledger: BankAccountLedgerEntry[]): number {
  return ledger.filter((entry) => entry.bankAccountId === accountId)
    .reduce((sum, entry) => sum + (entry.direction === 'credit' ? entry.amount : -entry.amount), 0)
}

function enrich(item: CashAdvance, employees: EmployeeItem[]): CashAdvanceView {
  const totalPaid = item.payments.reduce((sum, payment) => sum + payment.amount, 0)
  const outstanding = Math.max(0, item.totalCash - totalPaid)
  return {
    ...item,
    employee: employees.find((employee) => employee.id === item.employeeId)?.name ?? 'Unknown Employee',
    installmentAmount: Math.ceil(item.totalCash / item.installmentCount),
    totalPaid,
    outstanding,
    tenorRemain: Math.max(0, item.installmentCount - item.payments.length),
    status: outstanding === 0 ? 'Close' : 'On',
  }
}

function rebuildLedger(item: CashAdvance, ledger: BankAccountLedgerEntry[]): BankAccountLedgerEntry[] {
  const now = new Date().toISOString()
  const clean = ledger.filter((entry) => !(entry.referenceType === 'cash_advance' && entry.referenceId === item.id))
  clean.push({
    id: `bank-ledger-${item.id}-disbursement`, bankAccountId: item.bankAccountId, branchId: '1',
    direction: 'debit', amount: item.totalCash, occurredAt: new Date(item.date).toISOString(),
    referenceType: 'cash_advance', referenceId: item.id, description: `${item.id} - Cash advance for ${item.employeeId}`,
    createdAt: item.createdAt,
  })
  item.payments.forEach((payment) => clean.push({
    id: `bank-ledger-${item.id}-${payment.id}`, bankAccountId: item.bankAccountId, branchId: '1',
    direction: 'credit', amount: payment.amount, occurredAt: new Date(payment.date).toISOString(),
    referenceType: 'cash_advance', referenceId: item.id, description: `${item.id} installment payment`, createdAt: now,
  }))
  return clean
}

export function getCashAdvances(): CashAdvanceView[] {
  const employees = readJSON<EmployeeItem[]>('employees.json', [])
  return readJSON<CashAdvance[]>(FILE, []).map((item) => enrich(item, employees))
}

export function saveCashAdvance(payload: CashAdvanceFormData): CashAdvanceView {
  const items = readJSON<CashAdvance[]>(FILE, [])
  const employees = readJSON<EmployeeItem[]>('employees.json', [])
  const accounts = readJSON<BankAccount[]>(ACCOUNT_FILE, [])
  let ledger = readJSON<BankAccountLedgerEntry[]>(LEDGER_FILE, [])
  const employee = employees.find((item) => item.id === payload.employeeId && item.status === 'Active')
  if (!employee) throw createError({ statusCode: 400, statusMessage: 'Karyawan aktif tidak ditemukan.' })
  const amount = Number(payload.totalCash)
  if (!Number.isFinite(amount) || amount <= 0) throw createError({ statusCode: 400, statusMessage: 'Amount Cash Advance harus lebih besar dari nol.' })
  const date = new Date(payload.date)
  if (Number.isNaN(date.getTime())) throw createError({ statusCode: 400, statusMessage: 'Expense Date tidak valid.' })

  const index = payload.id ? items.findIndex((item) => item.id === payload.id) : -1
  const current = index >= 0 ? items[index] : undefined
  if (payload.id && !current) throw createError({ statusCode: 404, statusMessage: 'Cash Advance tidak ditemukan.' })
  const account = current
    ? accounts.find((item) => item.id === current.bankAccountId)
    : accounts.find((item) => item.bankName === 'Cash Account' && item.status === 'Active')
  if (!account) throw createError({ statusCode: 409, statusMessage: 'Cash Account aktif belum dikonfigurasi.' })
  const paid = current?.payments.reduce((sum, payment) => sum + payment.amount, 0) ?? 0
  if (amount < paid) throw createError({ statusCode: 409, statusMessage: 'Total Cash tidak boleh lebih kecil dari pembayaran yang sudah tercatat.' })

  if (current) ledger = ledger.filter((entry) => !(entry.referenceType === 'cash_advance' && entry.referenceId === current.id))
  if (balanceFor(account.id, ledger) < amount - paid) throw createError({ statusCode: 409, statusMessage: 'Saldo Cash Account tidak mencukupi.' })
  const now = new Date().toISOString()
  const id = current?.id ?? `CA${String(items.length + 1).padStart(3, '0')}`
  const installmentCount = current?.installmentCount ?? 5
  const note = payload.note?.trim() ?? ''
  const history = [...(current?.history ?? [])]
  const historyEntry = {
    id: `cash-advance-history-${Date.now()}`, date: payload.date, amount, installment: Math.ceil(amount / installmentCount),
    period: payload.period, tenorTotal: installmentCount, note, status: (amount === paid ? 'Close' : 'On') as 'On' | 'Close',
  }
  if (!current) history.push(historyEntry)
  else if (current.totalCash !== amount || current.period !== payload.period || current.note !== note) history.push(historyEntry)
  const saved: CashAdvance = {
    id, employeeId: employee.id, bankAccountId: account.id, date: payload.date, totalCash: amount,
    installmentCount, period: payload.period, note, createdAt: current?.createdAt ?? now, updatedAt: now,
    history, payments: current?.payments ?? [],
  }
  if (index >= 0) items[index] = saved
  else items.unshift(saved)
  ledger = rebuildLedger(saved, ledger)
  writeJSON(FILE, items)
  writeJSON(LEDGER_FILE, ledger)
  return enrich(saved, employees)
}

export function deleteCashAdvance(id: string): void {
  const items = readJSON<CashAdvance[]>(FILE, [])
  const item = items.find((entry) => entry.id === id)
  if (!item) throw createError({ statusCode: 404, statusMessage: 'Cash Advance tidak ditemukan.' })
  if (item.payments.length > 0) throw createError({ statusCode: 409, statusMessage: 'Cash Advance dengan pembayaran tidak dapat dihapus.' })
  const ledger = readJSON<BankAccountLedgerEntry[]>(LEDGER_FILE, [])
    .filter((entry) => !(entry.referenceType === 'cash_advance' && entry.referenceId === id))
  writeJSON(FILE, items.filter((entry) => entry.id !== id))
  writeJSON(LEDGER_FILE, ledger)
}

