import { defineEventHandler, getRouterParam } from 'h3'
import type { CustomerAddress } from '~/types/address'

export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    return { success: false, message: 'Address ID required' }
  }

  const fileData = readJSON<{
    stats: { totalAddress: number; totalProvince: number; totalCity: number; totalPosCode: number }
    customers: CustomerAddress[]
    suppliers: any[]
  }>('address.json')

  const initialLength = fileData.customers.length
  fileData.customers = fileData.customers.filter(c => c.id !== id)

  if (fileData.customers.length < initialLength) {
    fileData.stats.totalAddress = Math.max(0, fileData.stats.totalAddress - 1)
    writeJSON('address.json', fileData)
    return { success: true, message: `Address ${id} deleted successfully` }
  }

  return { success: false, message: `Address ${id} not found` }
})

