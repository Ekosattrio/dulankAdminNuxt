import type { VoucherCommand } from '#server/types/voucher'
import { updateVoucher } from '#server/utils/vouchers'
export default defineEventHandler(async event => ({ success: true, data: updateVoucher(getRouterParam(event, 'id') || '', await readBody<VoucherCommand>(event)), message: 'Voucher updated successfully' }))
