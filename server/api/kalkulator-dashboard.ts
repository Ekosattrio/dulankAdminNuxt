import { tableData } from '../data/kalkulator-dashboard'

// GET /api/kalkulator-dashboard — data mock tableData
export default defineEventHandler(() => {
  return tableData
})
