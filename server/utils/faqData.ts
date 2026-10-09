import type { FaqItem, FaqFormData, FaqCategory, FaqCategoryFormData } from '#server/types/faq'
import { readJSON, writeJSON } from './data'

const FAQS_FILE = 'faqs.json'
const FAQ_CATEGORIES_FILE = 'faq-categories.json'

// === FAQ ITEMS ===

export async function getFaqs(filter?: { search?: string; category?: string; status?: string }): Promise<FaqItem[]> {
  const all = await readJSON<FaqItem[]>(FAQS_FILE, [])
  let list = Array.isArray(all) ? all : []

  if (filter?.search) {
    const q = filter.search.toLowerCase().trim()
    list = list.filter(item =>
      item.question.toLowerCase().includes(q) ||
      item.answer.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    )
  }

  if (filter?.category && filter.category !== 'All') {
    list = list.filter(item => item.category === filter.category)
  }

  if (filter?.status && filter.status !== 'All') {
    list = list.filter(item => item.status === filter.status)
  }

  return list
}

export async function saveFaq(payload: FaqFormData): Promise<{ faq: FaqItem; isNew: boolean }> {
  if (!payload || !payload.question?.trim() || !payload.answer?.trim() || !payload.category?.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Question, answer, and category are required'
    })
  }

  const allFaqs = await readJSON<FaqItem[]>(FAQS_FILE, [])
  const list = Array.isArray(allFaqs) ? allFaqs : []

  if (payload.id) {
    const idx = list.findIndex(item => item.id === payload.id)
    if (idx !== -1) {
      const current = list[idx]
      if (!current) throw createError({ statusCode: 404, statusMessage: 'FAQ not found' })
      const updated: FaqItem = {
        ...current,
        question: payload.question.trim(),
        category: payload.category.trim(),
        answer: payload.answer.trim(),
        status: payload.status || current.status || 'Active',
        order: payload.order !== undefined ? Number(payload.order) : current.order
      }
      list[idx] = updated
      await writeJSON(FAQS_FILE, list)
      return { faq: updated, isNew: false }
    }
  }

  const nextOrder = list.length > 0 ? Math.max(...list.map(f => f.order || 0)) + 1 : 1
  const newFaq: FaqItem = {
    id: `faq-${Date.now()}`,
    question: payload.question.trim(),
    category: payload.category.trim(),
    answer: payload.answer.trim(),
    status: payload.status || 'Active',
    order: payload.order !== undefined ? Number(payload.order) : nextOrder,
    createdDate: new Date().toISOString().slice(0, 10)
  }

  list.push(newFaq)
  await writeJSON(FAQS_FILE, list)
  return { faq: newFaq, isNew: true }
}

export async function deleteFaq(id: string): Promise<FaqItem> {
  const allFaqs = await readJSON<FaqItem[]>(FAQS_FILE, [])
  const list = Array.isArray(allFaqs) ? allFaqs : []
  const idx = list.findIndex(item => item.id === id)

  if (idx === -1) {
    throw createError({
      statusCode: 404,
      statusMessage: 'FAQ not found'
    })
  }

  const removed = list.splice(idx, 1)[0]
  if (!removed) throw createError({ statusCode: 404, statusMessage: 'FAQ not found' })
  await writeJSON(FAQS_FILE, list)
  return removed
}

// === FAQ CATEGORIES ===

export async function getFaqCategories(filter?: { search?: string; status?: string }): Promise<FaqCategory[]> {
  const all = await readJSON<FaqCategory[]>(FAQ_CATEGORIES_FILE, [])
  let list = Array.isArray(all) ? all : []

  if (filter?.search) {
    const q = filter.search.toLowerCase().trim()
    list = list.filter(item =>
      item.name.toLowerCase().includes(q) ||
      (item.description && item.description.toLowerCase().includes(q))
    )
  }

  if (filter?.status && filter.status !== 'All') {
    list = list.filter(item => item.status === filter.status)
  }

  return list
}

export async function saveFaqCategory(payload: FaqCategoryFormData): Promise<{ category: FaqCategory; isNew: boolean }> {
  if (!payload.name?.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Category name is required'
    })
  }

  const categories = await readJSON<FaqCategory[]>(FAQ_CATEGORIES_FILE, [])
  const list = Array.isArray(categories) ? categories : []
  const slug = payload.slug?.trim() || payload.name.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')

  if (payload.id) {
    const idx = list.findIndex(c => c.id === payload.id)
    if (idx === -1) {
      throw createError({ statusCode: 404, statusMessage: 'Category not found' })
    }
    const current = list[idx]
    if (!current) throw createError({ statusCode: 404, statusMessage: 'Category not found' })

    const updated: FaqCategory = {
      ...current,
      name: payload.name.trim(),
      slug,
      description: payload.description?.trim() || '',
      status: payload.status || 'Active'
    }
    list[idx] = updated
    await writeJSON(FAQ_CATEGORIES_FILE, list)
    return { category: updated, isNew: false }
  } else {
    const newCategory: FaqCategory = {
      id: `faq-cat-${Date.now()}`,
      name: payload.name.trim(),
      slug,
      description: payload.description?.trim() || '',
      status: payload.status || 'Active',
      createdDate: new Date().toISOString().slice(0, 10),
      questionsCount: 0
    }
    list.push(newCategory)
    await writeJSON(FAQ_CATEGORIES_FILE, list)
    return { category: newCategory, isNew: true }
  }
}

export async function deleteFaqCategory(id: string): Promise<FaqCategory> {
  const categories = await readJSON<FaqCategory[]>(FAQ_CATEGORIES_FILE, [])
  const list = Array.isArray(categories) ? categories : []
  const idx = list.findIndex(c => c.id === id)

  if (idx === -1) {
    throw createError({ statusCode: 404, statusMessage: 'Category not found' })
  }

  const removed = list.splice(idx, 1)[0]
  if (!removed) throw createError({ statusCode: 404, statusMessage: 'Category not found' })
  await writeJSON(FAQ_CATEGORIES_FILE, list)
  return removed
}
