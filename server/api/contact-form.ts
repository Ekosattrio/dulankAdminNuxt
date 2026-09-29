import { messages } from '../data/contact-form'

// GET /api/contact-form — data mock messages
export default defineEventHandler(() => {
  return messages
})
