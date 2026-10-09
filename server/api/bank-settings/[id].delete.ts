import { deleteBankSetting } from '~~/server/utils/settingsDomainData'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const result = await deleteBankSetting(id || '')

  return { success: true, message: `Bank setting ${result.id} deleted` }
})
