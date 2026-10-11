import type { VoucherRecord } from '#server/types/voucher'
import { formatMoney } from './currency'

export function formatVoucherDiscount(record: Pick<VoucherRecord, 'type' | 'discount'>) {
  return record.type === 'Percentage' ? `${record.discount}%` : `Rp${formatMoney(record.discount)}`
}
export function formatVoucherDate(value: string) {
  if (!value) return 'Ongoing'
  return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${value}T00:00:00Z`))
}
