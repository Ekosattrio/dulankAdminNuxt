import type {
  Blog,
  BlogFormData,
  BlogCategory,
  BlogCategoryFormData,
  BlogComment,
  BlogCommentFormData,
  BlogTag,
  BlogTagFormData,
} from '#server/types/blog'
import { readJSON, writeJSON } from './data'

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

// ----------------- Blogs -----------------

export async function getBlogs(query?: { search?: string; status?: string; category?: string }): Promise<Blog[]> {
  const allBlogs = await readJSON<Blog[]>('blogs.json', [])
  let filtered = allBlogs

  const search = (query?.search || '').toLowerCase().trim()
  const status = query?.status || ''
  const category = query?.category || ''

  if (search) {
    filtered = filtered.filter(item =>
      item.title.toLowerCase().includes(search) ||
      item.category.toLowerCase().includes(search) ||
      (item.tags && item.tags.some(t => t.toLowerCase().includes(search))) ||
      (item.author && item.author.toLowerCase().includes(search))
    )
  }

  if (status && status !== 'All') {
    filtered = filtered.filter(item => item.status.toLowerCase() === status.toLowerCase())
  }

  if (category && category !== 'All') {
    filtered = filtered.filter(item => item.category.toLowerCase() === category.toLowerCase())
  }

  return filtered
}

export async function saveBlog(body: BlogFormData): Promise<{ blog: Blog; isNew: boolean }> {
  if (!body || !body.title?.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'Blog title is required' })
  }

  const allBlogs = await readJSON<Blog[]>('blogs.json', [])

  const tags = Array.isArray(body.tags)
    ? body.tags
    : typeof body.tags === 'string'
      ? (body.tags as string).split(',').map(t => t.trim()).filter(Boolean)
      : []

  if (body.id) {
    const idx = allBlogs.findIndex(b => String(b.id) === String(body.id))
    if (idx !== -1) {
      const current = allBlogs[idx]
      if (!current) throw createError({ statusCode: 404, statusMessage: 'Blog not found' })
      const updated: Blog = {
        ...current,
        title: body.title.trim(),
        slug: body.slug?.trim() || slugify(body.title),
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
      await writeJSON('blogs.json', allBlogs)
      return { blog: updated, isNew: false }
    }
  }

  const newBlog: Blog = {
    id: String(Date.now()),
    title: body.title.trim(),
    slug: body.slug?.trim() || slugify(body.title),
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
  await writeJSON('blogs.json', allBlogs)
  return { blog: newBlog, isNew: true }
}

export async function deleteBlog(id: string): Promise<{ id: string }> {
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Blog ID is required' })
  }

  const allBlogs = await readJSON<Blog[]>('blogs.json', [])
  const newBlogs = allBlogs.filter(b => String(b.id) !== String(id))

  if (allBlogs.length === newBlogs.length) {
    throw createError({ statusCode: 404, statusMessage: 'Blog not found' })
  }

  await writeJSON('blogs.json', newBlogs)
  return { id }
}

// ----------------- Blog Categories -----------------

export async function getBlogCategories(query?: { search?: string; status?: string }): Promise<BlogCategory[]> {
  const allCategories = await readJSON<BlogCategory[]>('blog-categories.json', [])
  let filtered = allCategories

  const search = (query?.search || '').toLowerCase().trim()
  const status = query?.status || ''

  if (search) {
    filtered = filtered.filter(item =>
      item.name.toLowerCase().includes(search) ||
      item.slug.toLowerCase().includes(search)
    )
  }

  if (status && status !== 'All') {
    filtered = filtered.filter(item => item.status.toLowerCase() === status.toLowerCase())
  }

  return filtered
}

export async function saveBlogCategory(body: BlogCategoryFormData): Promise<{ category: BlogCategory; isNew: boolean }> {
  if (!body || !body.name?.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'Category name is required' })
  }

  const allCategories = await readJSON<BlogCategory[]>('blog-categories.json', [])

  if (body.id) {
    const idx = allCategories.findIndex(c => String(c.id) === String(body.id))
    if (idx !== -1) {
      const current = allCategories[idx]
      if (!current) throw createError({ statusCode: 404, statusMessage: 'Category not found' })
      const updated: BlogCategory = {
        ...current,
        name: body.name.trim(),
        slug: body.slug?.trim() || slugify(body.name),
        description: body.description ?? current.description,
        postCount: typeof body.postCount === 'number' ? body.postCount : current.postCount,
        status: body.status || current.status,
      }
      allCategories[idx] = updated
      await writeJSON('blog-categories.json', allCategories)
      return { category: updated, isNew: false }
    }
  }

  const newCategory: BlogCategory = {
    id: String(Date.now()),
    name: body.name.trim(),
    slug: body.slug?.trim() || slugify(body.name),
    description: body.description || '',
    postCount: typeof body.postCount === 'number' ? body.postCount : 0,
    status: body.status || 'Active',
    createdDate: new Date().toISOString().slice(0, 10),
  }

  allCategories.unshift(newCategory)
  await writeJSON('blog-categories.json', allCategories)
  return { category: newCategory, isNew: true }
}

export async function deleteBlogCategory(id: string): Promise<{ id: string }> {
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Category ID is required' })
  }

  const allCategories = await readJSON<BlogCategory[]>('blog-categories.json', [])
  const newCategories = allCategories.filter(c => String(c.id) !== String(id))

  if (allCategories.length === newCategories.length) {
    throw createError({ statusCode: 404, statusMessage: 'Category not found' })
  }

  await writeJSON('blog-categories.json', newCategories)
  return { id }
}

// ----------------- Blog Comments -----------------

export async function getBlogComments(query?: { search?: string; status?: string }): Promise<BlogComment[]> {
  const allComments = await readJSON<BlogComment[]>('blog-comments.json', [])
  let filtered = allComments

  const search = (query?.search || '').toLowerCase().trim()
  const status = query?.status || ''

  if (search) {
    filtered = filtered.filter(item =>
      item.commenterName.toLowerCase().includes(search) ||
      item.commentBody.toLowerCase().includes(search) ||
      (item.blogTitle && item.blogTitle.toLowerCase().includes(search))
    )
  }

  if (status && status !== 'All') {
    filtered = filtered.filter(item => item.status.toLowerCase() === status.toLowerCase())
  }

  return filtered
}

export async function saveBlogComment(body: BlogCommentFormData): Promise<{ comment: BlogComment; isNew: boolean }> {
  if (!body || !body.commentBody?.trim() || !body.commenterName?.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Commenter name and comment body are required',
    })
  }

  const allComments = await readJSON<BlogComment[]>('blog-comments.json', [])

  if (body.id) {
    const idx = allComments.findIndex(c => String(c.id) === String(body.id))
    if (idx !== -1) {
      const current = allComments[idx]
      if (!current) throw createError({ statusCode: 404, statusMessage: 'Comment not found' })
      const updated: BlogComment = {
        ...current,
        blogTitle: body.blogTitle || current.blogTitle,
        commenterName: body.commenterName.trim(),
        email: body.email || current.email,
        commentBody: body.commentBody.trim(),
        rating: typeof body.rating === 'number' ? body.rating : current.rating,
        status: body.status || current.status,
      }
      allComments[idx] = updated
      await writeJSON('blog-comments.json', allComments)
      return { comment: updated, isNew: false }
    }
  }

  const newComment: BlogComment = {
    id: String(Date.now()),
    blogId: body.blogId,
    blogTitle: body.blogTitle || 'Untitled Blog',
    commenterName: body.commenterName.trim(),
    email: body.email || '',
    commentBody: body.commentBody.trim(),
    rating: typeof body.rating === 'number' ? body.rating : 5,
    createdDate: new Date().toISOString().slice(0, 10),
    status: body.status || 'Pending',
  }

  allComments.unshift(newComment)
  await writeJSON('blog-comments.json', allComments)
  return { comment: newComment, isNew: true }
}

export async function deleteBlogComment(id: string): Promise<{ id: string }> {
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Comment ID is required' })
  }

  const allComments = await readJSON<BlogComment[]>('blog-comments.json', [])
  const newComments = allComments.filter(c => String(c.id) !== String(id))

  if (allComments.length === newComments.length) {
    throw createError({ statusCode: 404, statusMessage: 'Comment not found' })
  }

  await writeJSON('blog-comments.json', newComments)
  return { id }
}

// ----------------- Blog Tags -----------------

export async function getBlogTags(query?: { search?: string }): Promise<BlogTag[]> {
  const allTags = await readJSON<BlogTag[]>('blog-tags.json', [])
  let filtered = allTags

  const search = (query?.search || '').toLowerCase().trim()
  if (search) {
    filtered = filtered.filter(item =>
      item.name.toLowerCase().includes(search) ||
      item.slug.toLowerCase().includes(search)
    )
  }

  return filtered
}

export async function saveBlogTag(body: BlogTagFormData): Promise<{ tag: BlogTag; isNew: boolean }> {
  if (!body || !body.name?.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'Tag name is required' })
  }

  const allTags = await readJSON<BlogTag[]>('blog-tags.json', [])

  if (body.id) {
    const idx = allTags.findIndex(t => String(t.id) === String(body.id))
    if (idx !== -1) {
      const current = allTags[idx]
      if (!current) throw createError({ statusCode: 404, statusMessage: 'Tag not found' })
      const updated: BlogTag = {
        ...current,
        name: body.name.trim(),
        slug: body.slug?.trim() || slugify(body.name),
        description: body.description ?? current.description,
        taggedPosts: typeof body.taggedPosts === 'number' ? body.taggedPosts : current.taggedPosts,
      }
      allTags[idx] = updated
      await writeJSON('blog-tags.json', allTags)
      return { tag: updated, isNew: false }
    }
  }

  const newTag: BlogTag = {
    id: String(Date.now()),
    name: body.name.trim(),
    slug: body.slug?.trim() || slugify(body.name),
    description: body.description || '',
    taggedPosts: typeof body.taggedPosts === 'number' ? body.taggedPosts : 0,
    createdDate: new Date().toISOString().slice(0, 10),
  }

  allTags.unshift(newTag)
  await writeJSON('blog-tags.json', allTags)
  return { tag: newTag, isNew: true }
}

export async function deleteBlogTag(id: string): Promise<{ id: string }> {
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Tag ID is required' })
  }

  const allTags = await readJSON<BlogTag[]>('blog-tags.json', [])
  const newTags = allTags.filter(t => String(t.id) !== String(id))

  if (allTags.length === newTags.length) {
    throw createError({ statusCode: 404, statusMessage: 'Tag not found' })
  }

  await writeJSON('blog-tags.json', newTags)
  return { id }
}

