import type { Sale } from '#server/types/sale'
interface Voucher {
  code: string
  type: 'Fixed' | 'Percentage'
  discount: number
  limit: number
  used: number
  startDate: string
  endDate: string
  status: string
  allProducts: boolean
  oncePerCustomer: boolean
}
export function salesVoucherDiscount(code: string, subtotal: number, customer: string, saleId?: string) {
  const voucher = readSalesData<Voucher>('sales-vouchers.json').find(
    (v) => v.code.toLowerCase() === code.trim().toLowerCase(),
  )
  const today = new Date().toISOString().slice(0, 10)
  if (!voucher || voucher.status !== 'Active')
    throw createError({ statusCode: 400, statusMessage: 'Voucher not found or inactive' })
  if (today < voucher.startDate || today > voucher.endDate)
    throw createError({ statusCode: 400, statusMessage: 'Voucher is outside its validity period' })
  const usedSales = readSalesData<Sale>('sales.json').filter(
    (s) => s.id !== saleId && s.document?.voucher?.toLowerCase() === code.trim().toLowerCase(),
  )
  if (
    (voucher.limit > 0 && voucher.used + usedSales.length >= voucher.limit) ||
    (voucher.oncePerCustomer && usedSales.some((s) => s.customer === customer))
  )
    throw createError({ statusCode: 400, statusMessage: 'Voucher usage limit reached' })
  if (!voucher.allProducts)
    throw createError({
      statusCode: 400,
      statusMessage: 'No eligible products are configured for this voucher',
    })
  return Math.min(
    subtotal,
    voucher.type === 'Percentage' ? Math.round((subtotal * voucher.discount) / 100) : voucher.discount,
  )
}
