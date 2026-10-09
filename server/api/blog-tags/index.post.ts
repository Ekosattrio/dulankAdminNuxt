import type { BlogTag, BlogTagFormData } from '~/server/types/blog'

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

export default defineEventHandler(async (event) => {
  const body = await readBody<BlogTagFormData>(event)

  if (!body || !body.name) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Tag name is required',
    })
  }

  const allTags = readJSON<BlogTag[]>('blog-tags.json', [])

  if (body.id) {
    // Update
    const idx = allTags.findIndex(t => String(t.id) === String(body.id))
    if (idx !== -1) {
      const current = allTags[idx]
      if (!current) throw createError({ statusCode: 404, statusMessage: 'Tag not found' })
      const updated: BlogTag = {
        ...current,
        name: body.name,
        slug: body.slug || slugify(body.name),
        description: body.description ?? current.description,
        taggedPosts: typeof body.taggedPosts === 'number' ? body.taggedPosts : current.taggedPosts,
      }
      allTags[idx] = updated
      writeJSON('blog-tags.json', allTags)
      return createResponse(updated, 'Tag updated successfully')
    }
  }

  // Create
  const newTag: BlogTag = {
    id: String(Date.now()),
    name: body.name,
    slug: body.slug || slugify(body.name),
    description: body.description || '',
    taggedPosts: typeof body.taggedPosts === 'number' ? body.taggedPosts : 0,
    createdDate: new Date().toISOString().slice(0, 10),
  }

  allTags.unshift(newTag)
  writeJSON('blog-tags.json', allTags)

  return createResponse(newTag, 'Tag created successfully')
})
