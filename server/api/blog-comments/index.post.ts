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
      allComments[idx] = {
        ...allComments[idx],
        blogTitle: body.blogTitle || allComments[idx].blogTitle,
        commenterName: body.commenterName,
        email: body.email || allComments[idx].email,
        commentBody: body.commentBody,
        rating: typeof body.rating === 'number' ? body.rating : allComments[idx].rating,
        status: body.status || allComments[idx].status,
      }
      writeJSON('blog-comments.json', allComments)
      return createResponse(allComments[idx], 'Comment updated successfully')
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
