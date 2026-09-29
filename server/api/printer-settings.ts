import { printers } from '../data/printer-settings'

// GET /api/printer-settings — data mock printers
export default defineEventHandler(() => {
  return printers
})
