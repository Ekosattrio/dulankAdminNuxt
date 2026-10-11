import type { DiscountPlanCustomerSegmentCommand } from '#server/types/discount-plan'
import { createDiscountPlanCustomerSegment } from '#server/utils/discountPlans'
export default defineEventHandler(async event => ({ success: true, data: createDiscountPlanCustomerSegment(await readBody<DiscountPlanCustomerSegmentCommand>(event)), message: 'Customer created successfully' }))
