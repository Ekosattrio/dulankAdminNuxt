import { getFooterConfig } from '~~/server/utils/contentDomainData'

export default defineEventHandler(async () => {
  const config = await getFooterConfig()
  return createResponse(config, 'Footer config retrieved successfully')
})
