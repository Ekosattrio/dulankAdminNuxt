import type { BannerFormData } from '#server/types/banner'
import { saveBanner } from '~~/server/utils/contentDomainData'

export default defineEventHandler(async (event) => {
  const body = await readBody<BannerFormData>(event)
  const banner = await saveBanner(body)

  return createResponse(
    banner,
    body?.id ? 'Banner updated successfully' : 'Banner created successfully'
  )
})
