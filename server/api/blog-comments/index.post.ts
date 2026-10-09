import type { BlogComment, BlogCommentFormData } from '~/server/types/blog'

export default defineEventHandler(async (event) => {
  const body = await readBody<BlogCommentFormData>(event)

  if (!body || !body.commentBody || !body.commenterName) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Commenter name and comment body are required',
    })
  }

  const allComments = readJSON<BlogComment[]>('blog-comments.json', [])

  if (body.id) {
    // Update
    const idx = allComments.findIndex(c => String(c.id) === String(body.id))
    if (idx !== -1) {
      const current = allComments[idx]
      if (!current) throw createError({ statusCode: 404, statusMessage: 'Comment not found' })
      const updated: BlogComment = {
        ...current,
        blogTitle: body.blogTitle || current.blogTitle,
        commenterName: body.commenterName,
        email: body.email || current.email,
        commentBody: body.commentBody,
        rating: typeof body.rating === 'number' ? body.rating : current.rating,
        status: body.status || current.status,
      }
      allComments[idx] = updated
      writeJSON('blog-comments.json', allComments)
      return createResponse(updated, 'Comment updated successfully')
    }
  }

  // Create
  const newComment: BlogComment = {
    id: String(Date.now()),
    blogId: body.blogId,
    blogTitle: body.blogTitle || 'Untitled Blog',
    commenterName: body.commenterName,
    email: body.email || '',
    commentBody: body.commentBody,
    rating: typeof body.rating === 'number' ? body.rating : 5,
    createdDate: new Date().toISOString().slice(0, 10),
    status: body.status || 'Pending',
  }

  allComments.unshift(newComment)
  writeJSON('blog-comments.json', allComments)

  return createResponse(newComment, 'Comment created successfully')
})
