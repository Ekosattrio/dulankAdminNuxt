import type { Product } from '~/types/product'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Product ID is required'
    })
  }

  const allProducts = await readJSON<Product[]>('products.json', [])
  const newProducts = allProducts.filter(p => p.id !== id)

  if (allProducts.length === newProducts.length) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Product not found'
    })
  }

  await writeJSON('products.json', newProducts)

  return createResponse({ id }, 'Product deleted successfully')
})

