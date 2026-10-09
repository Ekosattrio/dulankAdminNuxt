import { getBanners } from '~~/server/utils/contentDomainData'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const banners = await getBanners({
    search: query.search as string,
    type: query.type as string,
    status: query.status as string,
  })

  return createResponse(banners, 'Banners fetched successfully')
})
