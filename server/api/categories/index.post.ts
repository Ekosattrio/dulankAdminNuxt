import type { Category, CategoryFormData } from '~/types/category'

export default defineEventHandler(async (event) => {
  const body = await readBody<CategoryFormData>(event)

  if (!body || !body.name) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Category name is required'
    })
  }

  const allCategories = await readJSON<Category[]>('categories.json', [])

  if (body.id) {
    // Update
    const idx = allCategories.findIndex(c => c.id === body.id)
    if (idx !== -1) {
      const current = allCategories[idx]
      if (!current) throw createError({ statusCode: 404, statusMessage: 'Category not found' })
      const updated: Category = {
        ...current,
        name: body.name,
        code: body.code || current.code,
        status: body.status || 'Active'
      }
      allCategories[idx] = updated
      await writeJSON('categories.json', allCategories)
      return createResponse(updated, 'Category updated successfully')
    }
  }

  // Create
  const codePrefix = 'CAT-' + body.name.substring(0, 2).toUpperCase()
  const randomSuffix = String(Math.floor(10 + Math.random() * 90))
  const newCategory: Category = {
    id: String(Date.now()),
    name: body.name,
    code: body.code || `${codePrefix}${randomSuffix}`,
    createdDate: new Date().toLocaleDateString('id-ID'),
    createdBy: 'Admin',
    status: body.status || 'Active'
  }

  allCategories.unshift(newCategory)
  await writeJSON('categories.json', allCategories)

  return createResponse(newCategory, 'Category created successfully')
})

