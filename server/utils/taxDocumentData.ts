import { createError } from 'h3'
import { isDateWithinRange } from './dateRange'
import { readJSON, writeJSON } from './data'
import type { Purchase } from '#server/types/purchase'
import type { Sale } from '#server/types/sale'
import type { InputTaxDocument, InputTaxFormData, InputTaxView, OutputTaxDocument, OutputTaxFormData, OutputTaxView } from '#server/types/tax-document'

const INPUT_FILE = 'input-tax-documents.json'
const OUTPUT_FILE = 'output-tax-documents.json'

function validDate(value: string, label: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) throw createError({ statusCode: 400, statusMessage: `${label} tidak valid.` })
  return value.slice(0, 10)
}

export function getInputTaxes(params: { search?: string; credited?: string; startDate?: string; endDate?: string } = {}): InputTaxView[] {
  const purchases = readJSON<Purchase[]>('purchases.json', [])
  const query = params.search?.trim().toLowerCase()
  return readJSON<InputTaxDocument[]>(INPUT_FILE, []).map((document) => {
    const purchase = purchases.find((item) => item.id === document.purchaseId)
    if (!purchase) return null
    const vat = Number(purchase.tax || 0)
    return { ...document, purchaseNo: purchase.noPurchase, supplierName: purchase.supplier, dpp: Math.max(0, purchase.amount - vat), vat }
  }).filter((item): item is InputTaxView => Boolean(item)).filter((item) => {
    if (params.credited && item.credited !== params.credited) return false
    if (!isDateWithinRange(item.invoiceDate, params.startDate, params.endDate)) return false
    return !query || [item.purchaseNo, item.fakturNo, item.supplierName].some((value) => value.toLowerCase().includes(query))
  })
}

export function saveInputTax(payload: InputTaxFormData): InputTaxView {
  const documents = readJSON<InputTaxDocument[]>(INPUT_FILE, [])
  const purchases = readJSON<Purchase[]>('purchases.json', [])
  const index = documents.findIndex((item) => item.id === payload.id)
  const current = index >= 0 ? documents[index] : undefined
  if (!current) throw createError({ statusCode: 404, statusMessage: 'Input Tax tidak ditemukan.' })
  const fakturNo = payload.fakturNo?.trim()
  if (!fakturNo) throw createError({ statusCode: 400, statusMessage: 'Supplier Faktur No. wajib diisi.' })
  if (documents.some((item) => item.id !== current.id && item.fakturNo.toLowerCase() === fakturNo.toLowerCase())) {
    throw createError({ statusCode: 409, statusMessage: 'Supplier Faktur No. sudah digunakan.' })
  }
  const saved: InputTaxDocument = { ...current, invoiceDate: validDate(payload.invoiceDate, 'Date e-tax Invoice'), fakturNo, credited: payload.credited, updatedAt: new Date().toISOString() }
  documents[index] = saved
  writeJSON(INPUT_FILE, documents)
  const purchase = purchases.find((item) => item.id === saved.purchaseId)
  if (!purchase) throw createError({ statusCode: 409, statusMessage: 'Purchase sumber tidak ditemukan.' })
  const vat = Number(purchase.tax || 0)
  return { ...saved, purchaseNo: purchase.noPurchase, supplierName: purchase.supplier, dpp: Math.max(0, purchase.amount - vat), vat }
}

export function getOutputTaxes(params: { search?: string; txCode?: string; startDate?: string; endDate?: string } = {}): OutputTaxView[] {
  const sales = readJSON<Sale[]>('sales.json', [])
  const query = params.search?.trim().toLowerCase()
  return readJSON<OutputTaxDocument[]>(OUTPUT_FILE, []).filter((item) => !item.deletedAt).map((document) => {
    const sale = sales.find((item) => item.id === document.saleId)
    if (!sale) return null
    return { ...document, salesNo: sale.saleNo, customerName: sale.customer, dpp: Math.max(0, sale.total - sale.tax), vat: sale.tax, total: sale.total }
  }).filter((item): item is OutputTaxView => Boolean(item)).filter((item) => {
    if (params.txCode && item.txCode !== params.txCode) return false
    if (!isDateWithinRange(item.etaxDate, params.startDate, params.endDate)) return false
    return !query || [item.salesNo, item.etaxNumber, item.customerName].some((value) => value.toLowerCase().includes(query))
  })
}

export function saveOutputTax(payload: OutputTaxFormData): OutputTaxView {
  const documents = readJSON<OutputTaxDocument[]>(OUTPUT_FILE, [])
  const sales = readJSON<Sale[]>('sales.json', [])
  const index = documents.findIndex((item) => item.id === payload.id && !item.deletedAt)
  const current = index >= 0 ? documents[index] : undefined
  if (!current) throw createError({ statusCode: 404, statusMessage: 'Output Tax tidak ditemukan.' })
  const etaxNumber = payload.etaxNumber?.trim()
  if (!etaxNumber) throw createError({ statusCode: 400, statusMessage: 'E-tax Invoice Number wajib diisi.' })
  if (documents.some((item) => item.id !== current.id && !item.deletedAt && item.etaxNumber.toLowerCase() === etaxNumber.toLowerCase())) {
    throw createError({ statusCode: 409, statusMessage: 'E-tax Invoice Number sudah digunakan.' })
  }
  const saved: OutputTaxDocument = { ...current, etaxDate: validDate(payload.etaxDate, 'E-Tax Date'), etaxNumber, txCode: payload.txCode, status: payload.status, updatedAt: new Date().toISOString() }
  documents[index] = saved
  writeJSON(OUTPUT_FILE, documents)
  const sale = sales.find((item) => item.id === saved.saleId)
  if (!sale) throw createError({ statusCode: 409, statusMessage: 'Sales sumber tidak ditemukan.' })
  return { ...saved, salesNo: sale.saleNo, customerName: sale.customer, dpp: Math.max(0, sale.total - sale.tax), vat: sale.tax, total: sale.total }
}

export function deleteOutputTax(id: string): void {
  const documents = readJSON<OutputTaxDocument[]>(OUTPUT_FILE, [])
  const index = documents.findIndex((item) => item.id === id && !item.deletedAt)
  const current = index >= 0 ? documents[index] : undefined
  if (!current) throw createError({ statusCode: 404, statusMessage: 'Output Tax tidak ditemukan.' })
  const now = new Date().toISOString()
  documents[index] = { ...current, status: 'Cancelled', deletedAt: now, updatedAt: now }
  writeJSON(OUTPUT_FILE, documents)
}

