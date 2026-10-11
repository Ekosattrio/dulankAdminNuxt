import { deleteDiscountPlan } from '#server/utils/discountPlans'
export default defineEventHandler(event => ({ success: true, data: deleteDiscountPlan(getRouterParam(event, 'id') || ''), message: 'Discount plan deleted successfully' }))
