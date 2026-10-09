import type { InvoiceSetting } from '#server/types/invoice-setting'

export default defineEventHandler(async (event) => {
  const body = await readBody<InvoiceSetting>(event)

  if (!body) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Payload invoice configuration is required'
    })
  }

  const updatedSetting: InvoiceSetting = {
    ...body,
    updatedAt: new Date().toISOString()
  }

  await writeJSON('invoice-settings.json', updatedSetting)

  return createResponse(updatedSetting, 'Invoice settings saved successfully')
})
