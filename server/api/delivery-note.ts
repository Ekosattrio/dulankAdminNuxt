import { deliveryNotes } from '../data/delivery-note'

// GET /api/delivery-note — data mock deliveryNotes
export default defineEventHandler(() => {
  return deliveryNotes
})
