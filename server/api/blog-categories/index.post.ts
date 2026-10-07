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
      allCategories[idx] = {
        ...allCategories[idx],
        name: body.name,
        slug: body.slug || slugify(body.name),
        description: body.description ?? allCategories[idx].description,
        postCount: typeof body.postCount === 'number' ? body.postCount : allCategories[idx].postCount,
        status: body.status || allCategories[idx].status,
      }
      writeJSON('blog-categories.json', allCategories)
      return createResponse(allCategories[idx], 'Category updated successfully')
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
