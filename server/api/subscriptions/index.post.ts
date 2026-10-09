import { saveSubscription } from '../../utils/subscriptionData'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  if (!body || !body.subscriber) {
    throw createError({ statusCode: 400, statusMessage: 'Subscriber name is required' })
  }

  const saved = await saveSubscription(body)
  return {
    success: true,
    data: saved,
    message: 'Subscription saved successfully'
  }
})

