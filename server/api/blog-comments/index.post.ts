import type { BlogCommentFormData } from '#server/types/blog'
import { saveBlogComment } from '~~/server/utils/blogDomainData'

export default defineEventHandler(async (event) => {
  const body = await readBody<BlogCommentFormData>(event)
  const { comment, isNew } = await saveBlogComment(body)

  return createResponse(
    comment,
    isNew ? 'Comment created successfully' : 'Comment updated successfully'
  )
})
