import type { BillingQuery } from '#server/types/billing'
import { listBillings } from '#server/utils/billing'
export default defineEventHandler(event => ({ success: true, ...listBillings(getQuery(event) as BillingQuery) }))
