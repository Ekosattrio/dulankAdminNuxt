import { provinces } from '../data/province'

// GET /api/province — data mock provinces
export default defineEventHandler(() => {
  return provinces
})
