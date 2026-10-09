import type { SubCategory, SubCategoryFormData } from '~/types/sub-category'
import type { Category } from '~/types/category'

export default defineEventHandler(async (event) => {
  const body = await readBody<SubCategoryFormData>(event)

  if (!body || !body.name || !body.category) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Sub category name and category are required'
    })
  }

  const allSub = await readJSON<SubCategory[]>('sub-categories.json', [])
  const allCategories = await readJSON<Category[]>('categories.json', [])

  const matchedCat = allCategories.find(c => c.id === body.categoryId) || allCategories.find(c => c.name === body.category)
  if (!matchedCat) {
    throw createError({ statusCode: 400, statusMessage: 'Category relation not found' })
  }
  const catCode = body.categoryCode || matchedCat?.code || 'CAT-GEN'

  if (body.id) {
    // Update
    const idx = allSub.findIndex(s => s.id === body.id)
    if (idx !== -1) {
      const current = allSub[idx]!
      const updated: SubCategory = {
        ...current,
        name: body.name,
        categoryId: matchedCat.id,
        category: matchedCat.name,
        categoryCode: catCode,
        description: body.description || current.description,
        status: body.status || 'Active'
      }
      allSub[idx] = updated
      await writeJSON('sub-categories.json', allSub)
      return createResponse(updated, 'Sub category updated successfully')
    }
  }

  // Create
  const newSub: SubCategory = {
    id: String(allSub.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0) + 1),
    categoryId: matchedCat.id,
    name: body.name,
    category: matchedCat.name,
    categoryCode: catCode,
    description: body.description || '',
    itemUsed: 0,
    createdBy: 'Admin',
    status: body.status || 'Active'
  }

  allSub.unshift(newSub)
  await writeJSON('sub-categories.json', allSub)

  return createResponse(newSub, 'Sub category created successfully')
})

