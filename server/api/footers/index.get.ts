import { getFooters } from '~~/server/utils/contentDomainData'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const footers = await getFooters({
    section: query.section as string,
    status: query.status as string,
  })

  return createResponse(footers, 'Footer links fetched successfully')
})
