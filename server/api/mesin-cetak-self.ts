import { machines } from '../data/mesin-cetak-self'

// GET /api/mesin-cetak-self — data mock machines
export default defineEventHandler(() => {
  return machines
})
