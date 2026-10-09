import type { BlogTagFormData } from '#server/types/blog'
import { saveBlogTag } from '~~/server/utils/blogDomainData'

export default defineEventHandler(async (event) => {
  const body = await readBody<BlogTagFormData>(event)
  const { tag, isNew } = await saveBlogTag(body)

  return createResponse(
    tag,
    isNew ? 'Tag created successfully' : 'Tag updated successfully'
  )
})
