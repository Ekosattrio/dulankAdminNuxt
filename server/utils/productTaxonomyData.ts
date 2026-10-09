import type { Category, CategoryFormData } from '~/types/category'
import type { SubCategory, SubCategoryFormData } from '~/types/sub-category'
import type { Unit, UnitFormData } from '~/types/unit'
import type { Variant, VariantFormData } from '~/types/variant'
import { readJSON, writeJSON } from './data'

// ----------------- Categories -----------------

export async function getCategories(query?: { search?: string; status?: string }): Promise<Category[]> {
  const allCategories = await readJSON<Category[]>('categories.json', [])
  let filtered = allCategories

  const search = (query?.search || '').toLowerCase().trim()
  const status = query?.status || ''

  if (search) {
    filtered = filtered.filter(item =>
      item.name.toLowerCase().includes(search) ||
      item.code.toLowerCase().includes(search)
    )
  }

  if (status) {
    filtered = filtered.filter(item => item.status === status)
  }

  return filtered
}

export async function saveCategory(body: CategoryFormData): Promise<{ category: Category; isNew: boolean }> {
  if (!body || !body.name?.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Category name is required',
    })
  }

  const allCategories = await readJSON<Category[]>('categories.json', [])

  if (body.id) {
    const idx = allCategories.findIndex(c => c.id === body.id)
    if (idx !== -1) {
      const current = allCategories[idx]
      if (!current) throw createError({ statusCode: 404, statusMessage: 'Category not found' })
      const updated: Category = {
        ...current,
        name: body.name.trim(),
        code: body.code?.trim() || current.code,
        status: body.status || 'Active',
      }
      allCategories[idx] = updated
      await writeJSON('categories.json', allCategories)
      return { category: updated, isNew: false }
    }
  }

  const codePrefix = 'CAT-' + body.name.trim().substring(0, 2).toUpperCase()
  const randomSuffix = String(Math.floor(10 + Math.random() * 90))
  const newCategory: Category = {
    id: String(Date.now()),
    name: body.name.trim(),
    code: body.code?.trim() || `${codePrefix}${randomSuffix}`,
    createdDate: new Date().toLocaleDateString('id-ID'),
    createdBy: 'Admin',
    status: body.status || 'Active',
  }

  allCategories.unshift(newCategory)
  await writeJSON('categories.json', allCategories)
  return { category: newCategory, isNew: true }
}

export async function deleteCategory(id: string): Promise<{ id: string }> {
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Category ID is required' })
  }

  const allCategories = await readJSON<Category[]>('categories.json', [])
  const newCategories = allCategories.filter(c => c.id !== id)

  if (allCategories.length === newCategories.length) {
    throw createError({ statusCode: 404, statusMessage: 'Category not found' })
  }

  await writeJSON('categories.json', newCategories)
  return { id }
}

// ----------------- Sub-Categories -----------------

export async function getSubCategories(query?: { search?: string; category?: string; status?: string }): Promise<SubCategory[]> {
  const allSub = await readJSON<SubCategory[]>('sub-categories.json', [])
  let filtered = allSub

  const search = (query?.search || '').toLowerCase().trim()
  const category = query?.category || ''
  const status = query?.status || ''

  if (search) {
    filtered = filtered.filter(item =>
      item.name.toLowerCase().includes(search) ||
      (item.category && item.category.toLowerCase().includes(search)) ||
      (item.categoryCode && item.categoryCode.toLowerCase().includes(search))
    )
  }

  if (category) {
    filtered = filtered.filter(item => item.category === category || item.categoryId === category)
  }

  if (status) {
    filtered = filtered.filter(item => item.status === status)
  }

  return filtered
}

export async function saveSubCategory(body: SubCategoryFormData): Promise<{ subCategory: SubCategory; isNew: boolean }> {
  if (!body || !body.name?.trim() || !body.category?.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Sub category name and category are required',
    })
  }

  const allSub = await readJSON<SubCategory[]>('sub-categories.json', [])
  const allCategories = await readJSON<Category[]>('categories.json', [])

  const matchedCat = allCategories.find(c => c.id === body.categoryId) || allCategories.find(c => c.name === body.category)
  if (!matchedCat) {
    throw createError({ statusCode: 400, statusMessage: 'Category relation not found' })
  }
  const catCode = body.categoryCode || matchedCat.code || 'CAT-GEN'

  if (body.id) {
    const idx = allSub.findIndex(s => s.id === body.id)
    if (idx !== -1) {
      const current = allSub[idx]!
      const updated: SubCategory = {
        ...current,
        name: body.name.trim(),
        categoryId: matchedCat.id,
        category: matchedCat.name,
        categoryCode: catCode,
        description: body.description?.trim() || current.description,
        status: body.status || 'Active',
      }
      allSub[idx] = updated
      await writeJSON('sub-categories.json', allSub)
      return { subCategory: updated, isNew: false }
    }
  }

  const newSub: SubCategory = {
    id: String(allSub.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0) + 1),
    categoryId: matchedCat.id,
    name: body.name.trim(),
    category: matchedCat.name,
    categoryCode: catCode,
    description: body.description?.trim() || '',
    itemUsed: 0,
    createdBy: 'Admin',
    status: body.status || 'Active',
  }

  allSub.unshift(newSub)
  await writeJSON('sub-categories.json', allSub)
  return { subCategory: newSub, isNew: true }
}

export async function deleteSubCategory(id: string): Promise<{ id: string }> {
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Sub-Category ID is required' })
  }

  const allSub = await readJSON<SubCategory[]>('sub-categories.json', [])
  const newSub = allSub.filter(s => s.id !== id)

  if (allSub.length === newSub.length) {
    throw createError({ statusCode: 404, statusMessage: 'Sub category not found' })
  }

  await writeJSON('sub-categories.json', newSub)
  return { id }
}

// ----------------- Units -----------------

export async function getUnits(query?: { search?: string; status?: string }): Promise<Unit[]> {
  const allUnits = await readJSON<Unit[]>('units.json', [])
  let filtered = allUnits

  const search = (query?.search || '').toLowerCase().trim()
  const status = query?.status || ''

  if (search) {
    filtered = filtered.filter(item =>
      item.name.toLowerCase().includes(search) ||
      item.shortName.toLowerCase().includes(search)
    )
  }

  if (status) {
    filtered = filtered.filter(item => item.status === status)
  }

  return filtered
}

export async function saveUnit(body: UnitFormData): Promise<{ unit: Unit; isNew: boolean }> {
  if (!body || !body.name?.trim() || !body.shortName?.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Unit name and short name are required',
    })
  }

  const allUnits = await readJSON<Unit[]>('units.json', [])

  if (body.id) {
    const idx = allUnits.findIndex(u => u.id === body.id)
    if (idx !== -1) {
      const current = allUnits[idx]
      if (!current) throw createError({ statusCode: 404, statusMessage: 'Unit not found' })
      const updated: Unit = {
        ...current,
        name: body.name.trim(),
        shortName: body.shortName.trim(),
        status: body.status || 'Active',
      }
      allUnits[idx] = updated
      await writeJSON('units.json', allUnits)
      return { unit: updated, isNew: false }
    }
  }

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const now = new Date()
  const dateStr = `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`

  const newUnit: Unit = {
    id: String(Date.now()),
    name: body.name.trim(),
    shortName: body.shortName.trim(),
    itemUsed: 0,
    createdOn: dateStr,
    status: body.status || 'Active',
  }

  allUnits.unshift(newUnit)
  await writeJSON('units.json', allUnits)
  return { unit: newUnit, isNew: true }
}

export async function deleteUnit(id: string): Promise<{ id: string }> {
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Unit ID is required' })
  }

  const allUnits = await readJSON<Unit[]>('units.json', [])
  const newUnits = allUnits.filter(u => u.id !== id)

  if (allUnits.length === newUnits.length) {
    throw createError({ statusCode: 404, statusMessage: 'Unit not found' })
  }

  await writeJSON('units.json', newUnits)
  return { id }
}

// ----------------- Variants -----------------

export async function getVariants(query?: { search?: string; status?: string }): Promise<Variant[]> {
  const allVariants = await readJSON<Variant[]>('variants.json', [])
  let filtered = allVariants

  const search = (query?.search || '').toLowerCase().trim()
  const status = query?.status || ''

  if (search) {
    filtered = filtered.filter(item =>
      item.name.toLowerCase().includes(search) ||
      item.values.toLowerCase().includes(search)
    )
  }

  if (status) {
    filtered = filtered.filter(item => item.status === status)
  }

  return filtered
}

export async function saveVariant(body: VariantFormData): Promise<{ variant: Variant; isNew: boolean }> {
  if (!body || !body.name?.trim() || !body.values?.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Variant name and values are required',
    })
  }

  const allVariants = await readJSON<Variant[]>('variants.json', [])

  if (body.id) {
    const idx = allVariants.findIndex(v => v.id === body.id)
    if (idx !== -1) {
      const current = allVariants[idx]
      if (!current) throw createError({ statusCode: 404, statusMessage: 'Variant not found' })
      const updated: Variant = {
        ...current,
        name: body.name.trim(),
        values: body.values.trim(),
        status: body.status || 'Active',
      }
      allVariants[idx] = updated
      await writeJSON('variants.json', allVariants)
      return { variant: updated, isNew: false }
    }
  }

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const now = new Date()
  const dateStr = `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`

  const newVariant: Variant = {
    id: String(Date.now()),
    name: body.name.trim(),
    values: body.values.trim(),
    itemUsed: 0,
    createdOn: dateStr,
    status: body.status || 'Active',
  }

  allVariants.unshift(newVariant)
  await writeJSON('variants.json', allVariants)
  return { variant: newVariant, isNew: true }
}

export async function deleteVariant(id: string): Promise<{ id: string }> {
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Variant ID is required' })
  }

  const allVariants = await readJSON<Variant[]>('variants.json', [])
  const newVariants = allVariants.filter(v => v.id !== id)

  if (allVariants.length === newVariants.length) {
    throw createError({ statusCode: 404, statusMessage: 'Variant not found' })
  }

  await writeJSON('variants.json', newVariants)
  return { id }
}
