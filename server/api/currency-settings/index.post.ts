import type { CurrencySetting } from '~~/server/types/currency-setting'
import { saveCurrencySetting } from '~~/server/utils/settingsDomainData'

export default defineEventHandler(async (event) => {
  const body = await readBody<Partial<CurrencySetting> & { id?: string }>(event)
  const result = await saveCurrencySetting(body)

  return { success: true, data: result }
})
