import { defineEventHandler, readBody, createError } from 'h3'
import type { FaqCategory, FaqCategoryFormData } from '~~/server/types/faq'
import { readJSON, writeJSON } from '~~/server/utils/data'

export default defineEventHandler(async (event) => {
  const body = await readBody<FaqCategoryFormData>(event)

  if (!body.name?.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Category name is required',
    })
  }

  const categories = readJSON<FaqCategory[]>('faq-categories.json', [])
  const slug = body.slug?.trim() || body.name.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')

  if (body.id) {
    // Edit existing category
    const index = categories.findIndex(c => c.id === body.id)
    if (index === -1) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Category not found',
      })
    }

    const current = categories[index]
    if (!current) {
      throw createError({ statusCode: 404, statusMessage: 'Category not found' })
    }
    const updatedCategory: FaqCategory = {
      ...current,
      name: body.name.trim(),
      slug,
      description: body.description?.trim() || '',
      status: body.status || 'Active',
    }

    categories[index] = updatedCategory
    writeJSON('faq-categories.json', categories)

    return {
      success: true,
      message: 'FAQ Category updated successfully',
      data: updatedCategory,
    }
  } else {
    // Create new category
    const newCategory: FaqCategory = {
      id: `faq-cat-${Date.now()}`,
      name: body.name.trim(),
      slug,
      description: body.description?.trim() || '',
      questionsCount: 0,
      status: body.status || 'Active',
      createdDate: new Date().toISOString().slice(0, 10),
    }

    categories.push(newCategory)
    writeJSON('faq-categories.json', categories)

    return {
      success: true,
      message: 'FAQ Category created successfully',
      data: newCategory,
    }
  }
})
