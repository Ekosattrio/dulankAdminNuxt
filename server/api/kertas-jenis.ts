import { paperTypes } from '../data/kertas-jenis'

// GET /api/kertas-jenis — data mock paperTypes
export default defineEventHandler(() => {
  return paperTypes
})
