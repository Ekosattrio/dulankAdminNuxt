import { getFlowSummaries } from '#server/utils/jobList'

export default defineEventHandler(() => {
  const flows = getFlowSummaries()
  return createResponse(flows)
})
