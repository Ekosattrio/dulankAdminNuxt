import type { FooterLinkFormData } from '#server/types/footer'
import { saveFooterLink } from '~~/server/utils/contentDomainData'

export default defineEventHandler(async (event) => {
  const body = await readBody<FooterLinkFormData>(event)
  const result = await saveFooterLink(body)

  return createResponse(
    result,
    body?.id ? 'Footer link updated successfully' : 'Footer link created successfully'
  )
})
