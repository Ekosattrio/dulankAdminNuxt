import { deleteCurrencySetting } from '~~/server/utils/settingsDomainData'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const result = await deleteCurrencySetting(id || '')

  return { success: true, message: `Currency setting ${result.id} deleted` }
})
