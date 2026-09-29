import { languages } from '../data/language'

// GET /api/language — data mock languages
export default defineEventHandler(() => {
  return languages
})
