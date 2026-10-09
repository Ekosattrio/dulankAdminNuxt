import { updateSupportTicket } from '~~/server/utils/webstoreDomainData'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  const ticket = await updateSupportTicket(id || '', body)

  return {
    success: true,
    data: ticket,
    message: 'Support ticket updated successfully',
  }
})
