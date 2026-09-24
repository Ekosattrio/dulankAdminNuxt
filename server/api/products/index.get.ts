import type { Product } from '~/types/product'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const search = (query.search as string || '').toLowerCase().trim()
  const category = (query.category as string || '').trim()
  const status = query.status as string || ''

  const allProducts = await readJSON<Product[]>('products.json', [])

  let filtered = allProducts

  if (search) {
    filtered = filtered.filter(item =>
      item.name.toLowerCase().includes(search) ||
      item.code.toLowerCase().includes(search) ||
      item.subCategory.toLowerCase().includes(search)
    )
  }

  if (category) {
    filtered = filtered.filter(item => item.category === category)
  }

  if (status) {
    filtered = filtered.filter(item => item.status === status)
  }

  return createResponse(filtered, 'Products fetched successfully')
})

