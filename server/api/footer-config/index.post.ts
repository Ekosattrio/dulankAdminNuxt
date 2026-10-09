import type { FooterConfig } from '#server/types/footer'

export default defineEventHandler(async (event) => {
  const body = await readBody<FooterConfig>(event)

  if (!body) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Payload configuration is required'
    })
  }

  await writeJSON('footer-config.json', body)

  return createResponse(body, 'Pengaturan footer berhasil disimpan')
})
