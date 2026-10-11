import type { DiscountPlanCommand } from '#server/types/discount-plan'
import { updateDiscountPlan } from '#server/utils/discountPlans'
export default defineEventHandler(async event => ({ success: true, data: updateDiscountPlan(getRouterParam(event, 'id') || '', await readBody<DiscountPlanCommand>(event)), message: 'Discount plan updated successfully' }))
