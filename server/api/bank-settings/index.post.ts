import type { BankSetting } from '~~/server/types/bank-setting'
import { saveBankSetting } from '~~/server/utils/settingsDomainData'

export default defineEventHandler(async (event) => {
  const body = await readBody<Partial<BankSetting> & { id?: string }>(event)
  const result = await saveBankSetting(body)

  return { success: true, data: result }
})
