import type { VoucherQuery } from '#server/types/voucher'
import { listVouchers } from '#server/utils/vouchers'
export default defineEventHandler(event => ({ success: true, ...listVouchers(getQuery(event) as VoucherQuery) }))
