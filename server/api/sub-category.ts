import { subCategories } from '../data/sub-category'

// GET /api/sub-category — data mock subCategories
export default defineEventHandler(() => {
  return subCategories
})
