import { faqs } from '../data/faq'

// GET /api/faq — data mock faqs
export default defineEventHandler(() => {
  return faqs
})
