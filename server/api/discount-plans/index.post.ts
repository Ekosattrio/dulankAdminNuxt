import type { DiscountPlanCommand } from '#server/types/discount-plan'
import { createDiscountPlan } from '#server/utils/discountPlans'
export default defineEventHandler(async event => ({ success: true, data: createDiscountPlan(await readBody<DiscountPlanCommand>(event)), message: 'Discount plan created successfully' }))
