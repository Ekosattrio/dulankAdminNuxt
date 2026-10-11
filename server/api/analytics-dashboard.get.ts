import { getAnalyticsDashboard } from '#server/utils/analyticsDashboard'

export default defineEventHandler(() => createResponse(getAnalyticsDashboard()))
