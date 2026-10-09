import type { BlogCategory, BlogCategoryFormData } from '~/server/types/blog'

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

export default defineEventHandler(async (event) => {
  const body = await readBody<BlogCategoryFormData>(event)

  if (!body || !body.name) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Category name is required',
    })
  }

  const allCategories = readJSON<BlogCategory[]>('blog-categories.json', [])

  if (body.id) {
    // Update
    const idx = allCategories.findIndex(c => String(c.id) === String(body.id))
    if (idx !== -1) {
      const current = allCategories[idx]
      if (!current) throw createError({ statusCode: 404, statusMessage: 'Category not found' })
      const updated: BlogCategory = {
        ...current,
        name: body.name,
        slug: body.slug || slugify(body.name),
        description: body.description ?? current.description,
        postCount: typeof body.postCount === 'number' ? body.postCount : current.postCount,
        status: body.status || current.status,
      }
      allCategories[idx] = updated
      writeJSON('blog-categories.json', allCategories)
      return createResponse(updated, 'Category updated successfully')
    }
  }

  // Create
  const newCategory: BlogCategory = {
    id: String(Date.now()),
    name: body.name,
    slug: body.slug || slugify(body.name),
    description: body.description || '',
    postCount: typeof body.postCount === 'number' ? body.postCount : 0,
    status: body.status || 'Active',
    createdDate: new Date().toISOString().slice(0, 10),
  }

  allCategories.unshift(newCategory)
  writeJSON('blog-categories.json', allCategories)

  return createResponse(newCategory, 'Category created successfully')
})
