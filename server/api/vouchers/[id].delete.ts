import { deleteVoucher } from '#server/utils/vouchers'
export default defineEventHandler(event => ({ success: true, data: deleteVoucher(getRouterParam(event, 'id') || ''), message: 'Voucher deleted successfully' }))
