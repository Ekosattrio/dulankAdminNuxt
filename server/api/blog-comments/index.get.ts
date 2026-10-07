import type { BlogComment } from '~/server/types/blog'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const search = (query.search as string || '').toLowerCase().trim()
  const status = query.status as string || ''

  const allComments = readJSON<BlogComment[]>('blog-comments.json', [])

  let filtered = allComments

  if (search) {
    filtered = filtered.filter(item =>
      item.blogTitle.toLowerCase().includes(search) ||
      item.commenterName.toLowerCase().includes(search) ||
      item.email.toLowerCase().includes(search) ||
      item.commentBody.toLowerCase().includes(search)
    )
  }

  if (status && status !== 'All') {
    filtered = filtered.filter(item => item.status.toLowerCase() === status.toLowerCase())
  }

  return createResponse(filtered, 'Blog comments fetched successfully')
})
