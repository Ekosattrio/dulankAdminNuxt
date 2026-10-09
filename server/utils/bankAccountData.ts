import { createError } from 'h3'
import { readJSON, writeJSON } from './data'
import type { Store } from '#server/types/store'
import type {
  BankAccount,
  BankAccountFilterParams,
  BankAccountFormData,
  BankAccountLedgerEntry,
  BankAccountType,
  BankAccountTypeFormData,
  BankAccountTypeView,
  BankAccountView,
} from '#server/types/bank-account'

const ACCOUNT_FILE = 'bank-accounts.json'
const TYPE_FILE = 'bank-account-types.json'
const LEDGER_FILE = 'bank-account-ledger.json'
const STORE_FILE = 'stores.json'

function requiredText(value: unknown, label: string): string {
  const text = typeof value === 'string' ? value.trim() : ''
  if (!text) {
    throw createError({ statusCode: 400, statusMessage: `${label} wajib diisi.` })
  }
  return text
}

function formatCreatedDate(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date)
}

function createId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function validateMoney(value: unknown): number {
  const amount = Number(value)
  if (!Number.isFinite(amount) || amount < 0) {
    throw createError({ statusCode: 400, statusMessage: 'Opening Balance harus berupa angka nol atau lebih.' })
  }
  return amount
}

function validateDescription(value: unknown): string {
  const description = typeof value === 'string' ? value.trim() : ''
  const words = description ? description.split(/\s+/).length : 0
  if (words > 60) {
    throw createError({ statusCode: 400, statusMessage: 'Description maksimal 60 kata.' })
  }
  return description
}

function accountBalance(accountId: string, entries: BankAccountLedgerEntry[]): number {
  return entries
    .filter((entry) => entry.bankAccountId === accountId)
    .reduce((total, entry) => total + (entry.direction === 'credit' ? entry.amount : -entry.amount), 0)
}

export function getBankAccountList(params: BankAccountFilterParams = {}) {
  const accounts = readJSON<BankAccount[]>(ACCOUNT_FILE, [])
  const accountTypes = readJSON<BankAccountType[]>(TYPE_FILE, [])
  const ledger = readJSON<BankAccountLedgerEntry[]>(LEDGER_FILE, [])
  const stores = readJSON<Store[]>(STORE_FILE, [])
  const typeNames = new Map(accountTypes.map((item) => [item.id, item.name]))
  const branchNames = new Map(stores.map((item) => [item.id, item.storeName]))

  const allItems: BankAccountView[] = accounts.map((account) => ({
    ...account,
    accountTypeName: typeNames.get(account.accountTypeId) ?? 'Unknown Type',
    branchName: branchNames.get(account.branchId) ?? 'Unknown Branch',
    currentBalance: accountBalance(account.id, ledger),
  }))

  const query = params.search?.trim().toLowerCase()
  const items = allItems.filter((item) => {
    if (params.status && item.status !== params.status) return false
    if (params.accountTypeId && item.accountTypeId !== params.accountTypeId) return false
    if (!query) return true
    return [item.accountName, item.bankName, item.accountNo, item.accountTypeName, item.ifsc]
      .some((value) => value.toLowerCase().includes(query))
  })

  return {
    items,
    stats: {
      total: allItems.length,
      active: allItems.filter((item) => item.status === 'Active').length,
      inactive: allItems.filter((item) => item.status === 'Inactive').length,
      totalBalance: allItems.reduce((total, item) => total + item.currentBalance, 0),
    },
  }
}

export function getBankAccountTypes(): BankAccountTypeView[] {
  const types = readJSON<BankAccountType[]>(TYPE_FILE, [])
  const accounts = readJSON<BankAccount[]>(ACCOUNT_FILE, [])
  return types.map((type) => ({
    ...type,
    createdDate: formatCreatedDate(type.createdAt),
    accountCount: accounts.filter((account) => account.accountTypeId === type.id).length,
  }))
}

export function saveBankAccount(payload: BankAccountFormData): BankAccountView {
  const accounts = readJSON<BankAccount[]>(ACCOUNT_FILE, [])
  const types = readJSON<BankAccountType[]>(TYPE_FILE, [])
  const stores = readJSON<Store[]>(STORE_FILE, [])
  const ledger = readJSON<BankAccountLedgerEntry[]>(LEDGER_FILE, [])
  const accountName = requiredText(payload.accountName, 'Account Holder Name')
  const bankName = requiredText(payload.bankName, 'Bank Name')
  const accountNo = requiredText(payload.accountNo, 'Account No')
  const accountTypeId = requiredText(payload.accountTypeId, 'Type')
  const branchId = payload.branchId?.trim() || stores[0]?.id
  const openingBalance = validateMoney(payload.openingBalance)
  const ifsc = requiredText(payload.ifsc, 'IFSC')
  const description = validateDescription(payload.description)
  const accountType = types.find((item) => item.id === accountTypeId)

  if (!accountType) {
    throw createError({ statusCode: 400, statusMessage: 'Account Type tidak ditemukan.' })
  }
  if (!branchId || !stores.some((store) => store.id === branchId)) {
    throw createError({ statusCode: 400, statusMessage: 'Branch rekening tidak ditemukan.' })
  }
  if (accounts.some((item) => item.accountNo.toLowerCase() === accountNo.toLowerCase() && item.id !== payload.id)) {
    throw createError({ statusCode: 409, statusMessage: 'Account No sudah digunakan.' })
  }

  const now = new Date().toISOString()
  const index = payload.id ? accounts.findIndex((item) => item.id === payload.id) : -1
  const current = index >= 0 ? accounts[index] : undefined
  if (payload.id && !current) {
    throw createError({ statusCode: 404, statusMessage: 'Bank Account tidak ditemukan.' })
  }

  const saved: BankAccount = {
    id: current?.id ?? createId('bank-account'),
    branchId,
    accountTypeId,
    accountName,
    bankName,
    accountNo,
    openingBalance,
    ifsc,
    description,
    status: payload.status ?? current?.status ?? 'Active',
    createdAt: current?.createdAt ?? now,
    updatedAt: now,
  }

  if (index >= 0) accounts[index] = saved
  else accounts.unshift(saved)

  const openingIndex = ledger.findIndex(
    (entry) => entry.bankAccountId === saved.id && entry.referenceType === 'opening_balance',
  )
  const openingEntry: BankAccountLedgerEntry = {
    id: openingIndex >= 0 && ledger[openingIndex] ? ledger[openingIndex].id : createId('bank-ledger-opening'),
    bankAccountId: saved.id,
    branchId: saved.branchId,
    direction: 'credit',
    amount: saved.openingBalance,
    occurredAt: saved.createdAt,
    referenceType: 'opening_balance',
    referenceId: saved.id,
    description: 'Opening balance',
    createdAt: openingIndex >= 0 && ledger[openingIndex] ? ledger[openingIndex].createdAt : now,
  }
  if (openingIndex >= 0) ledger[openingIndex] = openingEntry
  else ledger.unshift(openingEntry)

  writeJSON(ACCOUNT_FILE, accounts)
  writeJSON(LEDGER_FILE, ledger)

  return {
    ...saved,
    accountTypeName: accountType.name,
    branchName: stores.find((store) => store.id === branchId)?.storeName ?? 'Unknown Branch',
    currentBalance: accountBalance(saved.id, ledger),
  }
}

export function deleteBankAccount(id: string): void {
  const accounts = readJSON<BankAccount[]>(ACCOUNT_FILE, [])
  const ledger = readJSON<BankAccountLedgerEntry[]>(LEDGER_FILE, [])
  const account = accounts.find((item) => item.id === id)
  if (!account) throw createError({ statusCode: 404, statusMessage: 'Bank Account tidak ditemukan.' })

  const transactionalEntries = ledger.filter(
    (entry) => entry.bankAccountId === id && entry.referenceType !== 'opening_balance',
  )
  if (transactionalEntries.length > 0) {
    throw createError({
      statusCode: 409,
      statusMessage: 'Bank Account sudah memiliki transaksi. Nonaktifkan rekening sebagai pengganti hapus.',
    })
  }

  writeJSON(ACCOUNT_FILE, accounts.filter((item) => item.id !== id))
  writeJSON(LEDGER_FILE, ledger.filter((entry) => entry.bankAccountId !== id))
}

export function saveBankAccountType(payload: BankAccountTypeFormData): BankAccountTypeView {
  const types = readJSON<BankAccountType[]>(TYPE_FILE, [])
  const accounts = readJSON<BankAccount[]>(ACCOUNT_FILE, [])
  const name = requiredText(payload.name, 'Name')
  if (types.some((item) => item.name.toLowerCase() === name.toLowerCase() && item.id !== payload.id)) {
    throw createError({ statusCode: 409, statusMessage: 'Nama Account Type sudah digunakan.' })
  }

  const index = payload.id ? types.findIndex((item) => item.id === payload.id) : -1
  const current = index >= 0 ? types[index] : undefined
  if (payload.id && !current) {
    throw createError({ statusCode: 404, statusMessage: 'Account Type tidak ditemukan.' })
  }
  const now = new Date().toISOString()
  const saved: BankAccountType = {
    id: current?.id ?? createId('bank-account-type'),
    name,
    status: payload.status ?? current?.status ?? 'Active',
    createdAt: current?.createdAt ?? now,
    updatedAt: now,
  }
  if (index >= 0) types[index] = saved
  else types.unshift(saved)
  writeJSON(TYPE_FILE, types)

  return {
    ...saved,
    createdDate: formatCreatedDate(saved.createdAt),
    accountCount: accounts.filter((account) => account.accountTypeId === saved.id).length,
  }
}

export function deleteBankAccountType(id: string): void {
  const types = readJSON<BankAccountType[]>(TYPE_FILE, [])
  const accounts = readJSON<BankAccount[]>(ACCOUNT_FILE, [])
  if (!types.some((item) => item.id === id)) {
    throw createError({ statusCode: 404, statusMessage: 'Account Type tidak ditemukan.' })
  }
  if (accounts.some((account) => account.accountTypeId === id)) {
    throw createError({ statusCode: 409, statusMessage: 'Account Type masih digunakan oleh Bank Account.' })
  }
  writeJSON(TYPE_FILE, types.filter((item) => item.id !== id))
}

