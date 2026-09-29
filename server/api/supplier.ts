import { suppliers } from '../data/supplier'

// GET /api/supplier — data mock suppliers
export default defineEventHandler(() => {
  return suppliers
})
