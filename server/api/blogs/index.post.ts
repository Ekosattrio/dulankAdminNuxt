import type { Blog, BlogFormData } from '~/server/types/blog'

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

export default defineEventHandler(async (event) => {
  const body = await readBody<BlogFormData>(event)

  if (!body || !body.title) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Blog title is required',
    })
  }

  const allBlogs = readJSON<Blog[]>('blogs.json', [])

  const tags = Array.isArray(body.tags)
    ? body.tags
    : typeof body.tags === 'string'
      ? body.tags.split(',').map(t => t.trim()).filter(Boolean)
      : []

  if (body.id) {
    // Update existing
    const idx = allBlogs.findIndex(b => String(b.id) === String(body.id))
    if (idx !== -1) {
      const current = allBlogs[idx]
      if (!current) throw createError({ statusCode: 404, statusMessage: 'Blog not found' })
      const updated: Blog = {
        ...current,
        title: body.title,
        slug: body.slug || slugify(body.title),
        category: body.category || current.category,
        tags: tags.length ? tags : current.tags,
        author: body.author || current.author,
        status: body.status || current.status,
        image: body.image || current.image,
        excerpt: body.excerpt ?? current.excerpt,
        content: body.content ?? current.content,
        publishedAt: body.publishedAt || current.publishedAt,
      }
      allBlogs[idx] = updated
      writeJSON('blogs.json', allBlogs)
      return createResponse(updated, 'Blog updated successfully')
    }
  }

  // Create new
  const newBlog: Blog = {
    id: String(Date.now()),
    title: body.title,
    slug: body.slug || slugify(body.title),
    category: body.category || 'General',
    tags,
    author: body.author || 'Admin',
    publishedAt: body.publishedAt || new Date().toISOString().slice(0, 10),
    status: body.status || 'Active',
    viewsCount: 0,
    commentsCount: 0,
    image: body.image || 'https://images.unsplash.com/photo-1556742049-0a67e55722ee?w=800&auto=format&fit=crop&q=60',
    excerpt: body.excerpt || '',
    content: body.content || '',
  }

  allBlogs.unshift(newBlog)
  writeJSON('blogs.json', allBlogs)

  return createResponse(newBlog, 'Blog created successfully')
})
