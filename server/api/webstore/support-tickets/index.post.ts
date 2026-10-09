import { createSupportTicket } from '~~/server/utils/webstoreDomainData'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const newTicket = await createSupportTicket(body)

  return {
    success: true,
    data: newTicket,
    message: 'Support ticket successfully created',
  }
})
