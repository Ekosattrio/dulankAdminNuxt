import type { FooterConfig } from '#server/types/footer'
import { saveFooterConfig } from '~~/server/utils/contentDomainData'

export default defineEventHandler(async (event) => {
  const body = await readBody<FooterConfig>(event)
  const saved = await saveFooterConfig(body)

  return createResponse(saved, 'Pengaturan footer berhasil disimpan')
})
