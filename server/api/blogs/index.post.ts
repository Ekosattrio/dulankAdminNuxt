import type { BlogFormData } from '#server/types/blog'
import { saveBlog } from '~~/server/utils/blogDomainData'

export default defineEventHandler(async (event) => {
  const body = await readBody<BlogFormData>(event)
  const { blog, isNew } = await saveBlog(body)

  return createResponse(
    blog,
    isNew ? 'Blog created successfully' : 'Blog updated successfully'
  )
})
