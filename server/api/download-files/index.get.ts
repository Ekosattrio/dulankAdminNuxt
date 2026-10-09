import { getDownloadFiles } from '~~/server/utils/contentDomainData'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const files = await getDownloadFiles({
    search: query.search as string,
    category: query.category as string,
    fileType: query.fileType as string,
  })

  return createResponse(files, 'Download files fetched successfully')
})
