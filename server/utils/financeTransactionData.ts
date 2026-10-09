import { createError } from 'h3'
import { readJSON, writeJSON } from './data'
import type { BankAccount, BankAccountLedgerEntry } from '#server/types/bank-account'
import type { Expense, ExpenseFilterParams, ExpenseFormData } from '#server/types/expense'
import type { IncomeFilterParams, IncomeFormData, IncomeRecord } from '#server/types/income'

const ACCOUNT_FILE = 'bank-accounts.json'
const LEDGER_FILE = 'bank-account-ledger.json'
const INCOME_FILE = 'incomes.json'
const EXPENSE_FILE = 'expenses.json'

function toOccurredAt(value: string): string {
  const match = value.trim().match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/)
  const date = match
    ? new Date(Date.UTC(Number(match[3]), Number(match[2]) - 1, Number(match[1])))
    : new Date(value)
  if (Number.isNaN(date.getTime())) throw createError({ statusCode: 400, statusMessage: 'Tanggal transaksi tidak valid.' })
  return date.toISOString()
}

function accountLabel(account: BankAccount): string {
  return `${account.bankName} ${account.accountNo}`
}

function resolveAccount(
  accounts: BankAccount[],
  bankAccountId?: string,
  legacyLabel?: string,
  paymentMethod?: string,
): BankAccount | undefined {
  const direct = accounts.find((account) => account.id === bankAccountId)
  if (direct) return direct
  const label = legacyLabel?.toLowerCase() ?? ''
  const legacy = accounts.find((account) => label.includes(account.accountNo.toLowerCase()) || label.includes(account.bankName.toLowerCase()))
  if (legacy) return legacy
  if (paymentMethod?.toLowerCase().includes('cash') || paymentMethod?.toLowerCase().includes('tunai')) {
    return accounts.find((account) => account.bankName === 'Cash Account')
  }
  return undefined
}

function validateAmount(value: unknown, label = 'Amount'): number {
  const amount = Number(value)
  if (!Number.isFinite(amount) || amount < 0) throw createError({ statusCode: 400, statusMessage: `${label} harus berupa angka nol atau lebih.` })
  return amount
}

function nextNumber(prefix: string, records: Array<{ no?: string; noExpense?: string }>): string {
  const max = records.reduce((value, item) => {
    const number = Number((item.no ?? item.noExpense ?? '').match(/\d+/)?.[0] ?? 0)
    return Math.max(value, number)
  }, 0)
  return `${prefix}${String(max + 1).padStart(6, '0')}`
}

function replaceLedgerEntry(
  ledger: BankAccountLedgerEntry[],
  source: 'income' | 'expense',
  sourceId: string,
  entry?: BankAccountLedgerEntry,
) {
  const filtered = ledger.filter((item) => !(item.referenceType === source && item.referenceId === sourceId))
  if (entry) filtered.push(entry)
  return filtered
}

function enrichIncome(record: IncomeRecord, accounts: BankAccount[]): IncomeRecord {
  const account = accounts.find((item) => item.id === record.bankAccountId)
  return { ...record, bankAccount: account ? accountLabel(account) : record.bankAccount ?? '-' }
}

function enrichExpense(record: Expense, accounts: BankAccount[]): Expense {
  const account = accounts.find((item) => item.id === record.bankAccountId)
  return { ...record, bankAccount: account ? accountLabel(account) : record.bankAccount ?? '-' }
}

export function getIncomeRecords(params: IncomeFilterParams = {}): IncomeRecord[] {
  const accounts = readJSON<BankAccount[]>(ACCOUNT_FILE, [])
  const query = params.search?.trim().toLowerCase()
  return readJSON<IncomeRecord[]>(INCOME_FILE, []).map((item) => enrichIncome(item, accounts)).filter((item) => {
    if (params.category && item.category.toLowerCase() !== params.category.toLowerCase()) return false
    return !query || [item.no, item.name, item.notes, item.category].some((value) => value.toLowerCase().includes(query))
  })
}

export function saveIncomeRecord(payload: IncomeFormData): IncomeRecord {
  const records = readJSON<IncomeRecord[]>(INCOME_FILE, [])
  const accounts = readJSON<BankAccount[]>(ACCOUNT_FILE, [])
  let ledger = readJSON<BankAccountLedgerEntry[]>(LEDGER_FILE, [])
  const account = resolveAccount(accounts, payload.bankAccountId, payload.bankAccount, payload.paymentMethod)
  const amount = validateAmount(payload.amount)
  if (!payload.name?.trim()) throw createError({ statusCode: 400, statusMessage: 'Nama Customer / Penyetor wajib diisi.' })
  if (!payload.category?.trim()) throw createError({ statusCode: 400, statusMessage: 'Kategori pemasukan wajib diisi.' })
  if (!account) throw createError({ statusCode: 400, statusMessage: 'Rekening tujuan wajib dipilih.' })
  if (account.status !== 'Active') throw createError({ statusCode: 400, statusMessage: 'Rekening tujuan harus aktif.' })

  const index = payload.id ? records.findIndex((item) => item.id === payload.id) : -1
  const current = index >= 0 ? records[index] : undefined
  if (payload.id && !current) throw createError({ statusCode: 404, statusMessage: 'Income record tidak ditemukan.' })
  const now = new Date().toISOString()
  const saved: IncomeRecord = {
    id: current?.id ?? `income-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    no: current?.no ?? payload.no ?? nextNumber('IN', records),
    date: payload.date,
    name: payload.name.trim(),
    category: payload.category.trim(),
    notes: payload.notes?.trim() ?? '',
    amount,
    paymentMethod: payload.paymentMethod ?? 'Transfer Bank',
    bankAccountId: account.id,
    bankAccount: accountLabel(account),
    isCancelled: Boolean(payload.isCancelled),
  }
  if (index >= 0) records[index] = saved
  else records.unshift(saved)

  ledger = replaceLedgerEntry(ledger, 'income', saved.id, saved.isCancelled ? undefined : {
    id: `bank-ledger-income-${saved.id}`,
    bankAccountId: account.id,
    branchId: account.branchId,
    direction: 'credit',
    amount,
    occurredAt: toOccurredAt(saved.date),
    referenceType: 'income',
    referenceId: saved.id,
    description: `${saved.no} - ${saved.notes || saved.name}`,
    createdAt: now,
  })
  writeJSON(INCOME_FILE, records)
  writeJSON(LEDGER_FILE, ledger)
  return saved
}

export function deleteIncomeRecord(id: string): void {
  const records = readJSON<IncomeRecord[]>(INCOME_FILE, [])
  if (!records.some((item) => item.id === id)) throw createError({ statusCode: 404, statusMessage: 'Income record tidak ditemukan.' })
  const ledger = replaceLedgerEntry(readJSON<BankAccountLedgerEntry[]>(LEDGER_FILE, []), 'income', id)
  writeJSON(INCOME_FILE, records.filter((item) => item.id !== id))
  writeJSON(LEDGER_FILE, ledger)
}

export function getExpenseRecords(params: ExpenseFilterParams = {}): Expense[] {
  const accounts = readJSON<BankAccount[]>(ACCOUNT_FILE, [])
  const query = params.search?.trim().toLowerCase()
  return readJSON<Expense[]>(EXPENSE_FILE, []).map((item) => enrichExpense(item, accounts)).filter((item) => {
    if (params.status && item.status.toLowerCase() !== params.status.toLowerCase()) return false
    if (params.category && item.category.toLowerCase() !== params.category.toLowerCase()) return false
    return !query || [item.noExpense, item.name, item.category, item.description].some((value) => value.toLowerCase().includes(query))
  })
}

export function saveExpenseRecord(payload: ExpenseFormData): Expense {
  const records = readJSON<Expense[]>(EXPENSE_FILE, [])
  const accounts = readJSON<BankAccount[]>(ACCOUNT_FILE, [])
  let ledger = readJSON<BankAccountLedgerEntry[]>(LEDGER_FILE, [])
  const amount = validateAmount(payload.amount)
  const paid = validateAmount(payload.paid, 'Paid')
  if (paid > amount) throw createError({ statusCode: 400, statusMessage: 'Paid tidak boleh melebihi Amount.' })
  if (!payload.name?.trim()) throw createError({ statusCode: 400, statusMessage: 'Vendor / Penerima wajib diisi.' })
  if (!payload.category?.trim()) throw createError({ statusCode: 400, statusMessage: 'Expense Category wajib diisi.' })
  const account = paid > 0 ? resolveAccount(accounts, payload.bankAccountId, undefined, payload.paymentMethod) : undefined
  if (paid > 0 && !account) throw createError({ statusCode: 400, statusMessage: 'Rekening pembayaran wajib dipilih.' })
  if (account && account.status !== 'Active') throw createError({ statusCode: 400, statusMessage: 'Rekening pembayaran harus aktif.' })

  const index = payload.id ? records.findIndex((item) => item.id === payload.id) : -1
  const current = index >= 0 ? records[index] : undefined
  if (payload.id && !current) throw createError({ statusCode: 404, statusMessage: 'Expense tidak ditemukan.' })
  const due = amount - paid
  const status = payload.status === 'Canceled' ? 'Canceled' : due === 0 ? 'Paid' : paid > 0 ? 'Partial' : 'Unpaid'
  const now = new Date().toISOString()
  const saved: Expense = {
    id: current?.id ?? `expense-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    noExpense: current?.noExpense ?? payload.noExpense ?? nextNumber('EX', records),
    date: payload.date,
    category: payload.category.trim(),
    name: payload.name.trim(),
    status,
    amount,
    paid,
    due,
    description: payload.description?.trim() ?? '',
    paymentMethod: paid > 0 ? payload.paymentMethod ?? 'Transfer Bank' : '-',
    bankAccountId: account?.id,
    bankAccount: account ? accountLabel(account) : '-',
  }
  if (index >= 0) records[index] = saved
  else records.unshift(saved)

  ledger = replaceLedgerEntry(ledger, 'expense', saved.id, paid === 0 || status === 'Canceled' || !account ? undefined : {
    id: `bank-ledger-expense-${saved.id}`,
    bankAccountId: account.id,
    branchId: account.branchId,
    direction: 'debit',
    amount: paid,
    occurredAt: toOccurredAt(saved.date),
    referenceType: 'expense',
    referenceId: saved.id,
    description: `${saved.noExpense} - ${saved.description || saved.name}`,
    createdAt: now,
  })
  writeJSON(EXPENSE_FILE, records)
  writeJSON(LEDGER_FILE, ledger)
  return saved
}

export function deleteExpenseRecord(id: string): void {
  const records = readJSON<Expense[]>(EXPENSE_FILE, [])
  if (!records.some((item) => item.id === id)) throw createError({ statusCode: 404, statusMessage: 'Expense tidak ditemukan.' })
  const ledger = replaceLedgerEntry(readJSON<BankAccountLedgerEntry[]>(LEDGER_FILE, []), 'expense', id)
  writeJSON(EXPENSE_FILE, records.filter((item) => item.id !== id))
  writeJSON(LEDGER_FILE, ledger)
}

