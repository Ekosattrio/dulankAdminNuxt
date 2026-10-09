import type { PosSetting } from '#server/types/pos-setting'
import { updatePosSetting } from '~~/server/utils/settingsDomainData'

export default defineEventHandler(async (event) => {
  const body = await readBody<PosSetting>(event)
  const updated = await updatePosSetting(body)

  return createResponse(updated, 'POS settings saved successfully')
})
