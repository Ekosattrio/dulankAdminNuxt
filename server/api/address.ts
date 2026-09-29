import { customerAddresses, supplierAddresses } from '../data/address'

// GET /api/address — data mock: customerAddresses, supplierAddresses
export default defineEventHandler(() => {
  return { customerAddresses, supplierAddresses }
})
