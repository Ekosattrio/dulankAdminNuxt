import type { BannerItem } from '#server/types/banner'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Banner ID is required'
    })
  }

  const allBanners = await readJSON<BannerItem[]>('banners.json', [])
  const newBanners = allBanners.filter(item => item.id !== id)

  if (allBanners.length === newBanners.length) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Banner not found'
    })
  }

  await writeJSON('banners.json', newBanners)

  return createResponse({ id }, 'Banner deleted successfully')
})
