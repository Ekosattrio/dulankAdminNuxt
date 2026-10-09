import { createError } from 'h3'
import { isDateWithinRange } from './dateRange'
import { readJSON, writeJSON } from './data'
import type { BankAccount, BankAccountLedgerEntry } from '#server/types/bank-account'
import type { MoneyTransfer, MoneyTransferFilterParams, MoneyTransferFormData, MoneyTransferView } from '#server/types/money-transfer'

const TRANSFER_FILE = 'money-transfers.json'
const ACCOUNT_FILE = 'bank-accounts.json'
const LEDGER_FILE = 'bank-account-ledger.json'

function accountLabel(account: BankAccount): string {
  return `${account.bankName} ${account.accountNo} - ${account.accountName}`
}

function formatDate(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  const pad = (part: number) => String(part).padStart(2, '0')
  return `${pad(date.getUTCDate())}/${pad(date.getUTCMonth() + 1)}/${date.getUTCFullYear()} ${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}`
}

function enrich(transfer: MoneyTransfer, accounts: BankAccount[]): MoneyTransferView {
  const from = accounts.find((account) => account.id === transfer.fromAccountId)
  const to = accounts.find((account) => account.id === transfer.toAccountId)
  return {
    ...transfer,
    date: formatDate(transfer.occurredAt),
    fromAccount: from ? accountLabel(from) : 'Unknown Account',
    toAccount: to ? accountLabel(to) : 'Unknown Account',
  }
}

function balanceFor(accountId: string, ledger: BankAccountLedgerEntry[]): number {
  return ledger
    .filter((entry) => entry.bankAccountId === accountId)
    .reduce((sum, entry) => sum + (entry.direction === 'credit' ? entry.amount : -entry.amount), 0)
}

function nextNumber(transfers: MoneyTransfer[]): string {
  const max = transfers.reduce((value, item) => Math.max(value, Number(item.no.match(/\d+/)?.[0] ?? 0)), 0)
  return `TF${String(max + 1).padStart(5, '0')}`
}

export function getMoneyTransfers(params: MoneyTransferFilterParams = {}): MoneyTransferView[] {
  const accounts = readJSON<BankAccount[]>(ACCOUNT_FILE, [])
  const query = params.search?.trim().toLowerCase()
  return readJSON<MoneyTransfer[]>(TRANSFER_FILE, [])
    .filter((item) => !item.deletedAt)
    .map((item) => enrich(item, accounts))
    .filter((item) => {
      if (!isDateWithinRange(item.occurredAt.slice(0, 10), params.startDate, params.endDate)) return false
      if (!query) return true
      return [item.no, item.fromAccount, item.toAccount, item.description, item.createdBy]
        .some((value) => value.toLowerCase().includes(query))
    })
    .sort((a, b) => b.occurredAt.localeCompare(a.occurredAt))
}

export function saveMoneyTransfer(payload: MoneyTransferFormData): MoneyTransferView {
  const transfers = readJSON<MoneyTransfer[]>(TRANSFER_FILE, [])
  const accounts = readJSON<BankAccount[]>(ACCOUNT_FILE, [])
  let ledger = readJSON<BankAccountLedgerEntry[]>(LEDGER_FILE, [])
  const from = accounts.find((account) => account.id === payload.fromAccountId)
  const to = accounts.find((account) => account.id === payload.toAccountId)
  const amount = Number(payload.amount)
  const occurredAt = new Date(payload.occurredAt)

  if (!from || !to) throw createError({ statusCode: 400, statusMessage: 'Rekening asal atau tujuan tidak ditemukan.' })
  if (from.id === to.id) throw createError({ statusCode: 400, statusMessage: 'Rekening asal dan tujuan harus berbeda.' })
  if (from.status !== 'Active' || to.status !== 'Active') {
    throw createError({ statusCode: 400, statusMessage: 'Transfer hanya dapat memakai rekening aktif.' })
  }
  if (!Number.isFinite(amount) || amount <= 0) {
    throw createError({ statusCode: 400, statusMessage: 'Amount harus lebih besar dari nol.' })
  }
  if (Number.isNaN(occurredAt.getTime())) {
    throw createError({ statusCode: 400, statusMessage: 'Tanggal transfer tidak valid.' })
  }

  const index = payload.id ? transfers.findIndex((item) => item.id === payload.id && !item.deletedAt) : -1
  const current = index >= 0 ? transfers[index] : undefined
  if (payload.id && !current) throw createError({ statusCode: 404, statusMessage: 'Money Transfer tidak ditemukan.' })

  if (current) ledger = ledger.filter((entry) => !(entry.referenceType === 'transfer' && entry.referenceId === current.id))
  if (balanceFor(from.id, ledger) < amount) {
    throw createError({ statusCode: 409, statusMessage: 'Saldo rekening asal tidak mencukupi.' })
  }

  const now = new Date().toISOString()
  const id = current?.id ?? `money-transfer-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  const saved: MoneyTransfer = {
    id,
    no: current?.no ?? nextNumber(transfers),
    branchId: payload.branchId?.trim() || from.branchId,
    fromAccountId: from.id,
    toAccountId: to.id,
    amount,
    description: payload.description?.trim() ?? '',
    occurredAt: occurredAt.toISOString(),
    createdById: current?.createdById ?? 'system-admin',
    createdBy: current?.createdBy ?? 'Admin',
    createdAt: current?.createdAt ?? now,
    updatedAt: now,
  }
  if (index >= 0) transfers[index] = saved
  else transfers.unshift(saved)

  const common = {
    branchId: saved.branchId,
    amount: saved.amount,
    occurredAt: saved.occurredAt,
    referenceType: 'transfer' as const,
    referenceId: saved.id,
    createdAt: now,
  }
  ledger.push(
    {
      ...common,
      id: `bank-ledger-${saved.id}-debit`,
      bankAccountId: from.id,
      direction: 'debit',
      description: `Transfer ${saved.no} to ${to.bankName}`,
    },
    {
      ...common,
      id: `bank-ledger-${saved.id}-credit`,
      bankAccountId: to.id,
      direction: 'credit',
      description: `Transfer ${saved.no} from ${from.bankName}`,
    },
  )
  writeJSON(TRANSFER_FILE, transfers)
  writeJSON(LEDGER_FILE, ledger)
  return enrich(saved, accounts)
}

export function deleteMoneyTransfer(id: string): void {
  const transfers = readJSON<MoneyTransfer[]>(TRANSFER_FILE, [])
  const index = transfers.findIndex((item) => item.id === id && !item.deletedAt)
  const current = index >= 0 ? transfers[index] : undefined
  if (!current) throw createError({ statusCode: 404, statusMessage: 'Money Transfer tidak ditemukan.' })
  const now = new Date().toISOString()
  transfers[index] = { ...current, deletedAt: now, updatedAt: now }
  const ledger = readJSON<BankAccountLedgerEntry[]>(LEDGER_FILE, [])
    .filter((entry) => !(entry.referenceType === 'transfer' && entry.referenceId === id))
  writeJSON(TRANSFER_FILE, transfers)
  writeJSON(LEDGER_FILE, ledger)
}

