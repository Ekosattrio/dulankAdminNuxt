import type { BannerItem } from '#server/types/banner'

export default defineEventHandler(async () => {
  const allBanners = await readJSON<BannerItem[]>('banners.json', [])
  return createResponse(allBanners, 'Banners fetched successfully')
})
