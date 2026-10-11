import type { VoucherCommand } from '#server/types/voucher'
import { createVoucher } from '#server/utils/vouchers'
export default defineEventHandler(async event => ({ success: true, data: createVoucher(await readBody<VoucherCommand>(event)), message: 'Voucher created successfully' }))
