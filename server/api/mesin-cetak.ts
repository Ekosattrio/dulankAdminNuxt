import { machines } from '../data/mesin-cetak'

// GET /api/mesin-cetak — data mock machines
export default defineEventHandler(() => {
  return machines
})
