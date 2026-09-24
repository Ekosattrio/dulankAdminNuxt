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

  const matchedCat = allCategories.find(c => c.name === body.category)
  const catCode = body.categoryCode || matchedCat?.code || 'CAT-GEN'

  if (body.id) {
    // Update
    const idx = allSub.findIndex(s => s.id === body.id)
    if (idx !== -1) {
      allSub[idx] = {
        ...allSub[idx],
        name: body.name,
        category: body.category,
        categoryCode: catCode,
        description: body.description || allSub[idx].description,
        status: body.status || 'Active'
      }
      await writeJSON('sub-categories.json', allSub)
      return createResponse(allSub[idx], 'Sub category updated successfully')
    }
  }

  // Create
  const newSub: SubCategory = {
    id: String(Date.now()),
    name: body.name,
    category: body.category,
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

