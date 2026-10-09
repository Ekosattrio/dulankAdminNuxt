import { deleteSupportTicket } from '~~/server/utils/webstoreDomainData'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  await deleteSupportTicket(id || '')

  return {
    success: true,
    message: 'Support ticket deleted successfully',
  }
})
