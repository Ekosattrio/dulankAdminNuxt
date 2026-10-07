import type { FooterLinkItem } from '#server/types/footer'

export default defineEventHandler(async () => {
  const allFooters = await readJSON<FooterLinkItem[]>('footers.json', [])
  return createResponse(allFooters, 'Footer links fetched successfully')
})
