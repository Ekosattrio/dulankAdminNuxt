import { defineEventHandler } from 'h3'
import type { FaqCategory } from '~~/server/types/faq'
import { readJSON } from '~~/server/utils/data'

export default defineEventHandler(() => {
  const categories = readJSON<FaqCategory[]>('faq-categories.json', [])
  return {
    success: true,
    data: categories,
  }
})
