import type { DiscountPlanQuery } from '#server/types/discount-plan'
import { listDiscountPlans } from '#server/utils/discountPlans'
export default defineEventHandler(event => ({ success: true, ...listDiscountPlans(getQuery(event) as DiscountPlanQuery) }))
