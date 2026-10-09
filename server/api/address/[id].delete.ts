import { deleteAddress } from '~~/server/utils/peoplesDomainData'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const result = await deleteAddress(id || '')

  return { success: true, message: `Address ${result.id} deleted successfully` }
})
