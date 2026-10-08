import type { PosSetting } from '#server/types/pos-setting'

export default defineEventHandler(async (event) => {
  const body = await readBody<PosSetting>(event)

  if (!body) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Payload POS configuration is required'
    })
  }

  const updatedSetting: PosSetting = {
    ...body,
    updatedAt: new Date().toISOString()
  }

  await writeJSON('pos-settings.json', updatedSetting)

  return createResponse(updatedSetting, 'POS settings saved successfully')
})
