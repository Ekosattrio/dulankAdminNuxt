import type { Product, ProductFormData } from '~/types/product'

export default defineEventHandler(async (event) => {
  const body = await readBody<ProductFormData>(event)

  if (!body || !body.name || !body.category) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Product name and category are required'
    })
  }

  const allProducts = await readJSON<Product[]>('products.json', [])

  if (body.id) {
    // Update
    const idx = allProducts.findIndex(p => p.id === body.id)
    if (idx !== -1) {
      allProducts[idx] = {
        ...allProducts[idx],
        code: body.code || allProducts[idx].code,
        name: body.name,
        category: body.category,
        subCategory: body.subCategory || allProducts[idx].subCategory,
        unit: body.unit || allProducts[idx].unit,
        price: Number(body.price) || 0,
        priceType: body.priceType || allProducts[idx].priceType,
        status: body.status || 'Active'
      }
      await writeJSON('products.json', allProducts)
      return createResponse(allProducts[idx], 'Product updated successfully')
    }
  }

  // Create
  const nextNum = String(allProducts.length + 1).padStart(3, '0')
  const code = body.code || `001${nextNum}`
  const now = new Date()
  const dateStr = `Admin : ${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`

  const newProduct: Product = {
    id: String(Date.now()),
    code,
    name: body.name,
    category: body.category,
    subCategory: body.subCategory || 'General',
    unit: body.unit || 'Piece',
    price: Number(body.price) || 0,
    priceType: body.priceType || 'Single Price',
    created: dateStr,
    status: body.status || 'Active'
  }

  allProducts.unshift(newProduct)
  await writeJSON('products.json', allProducts)

  return createResponse(newProduct, 'Product created successfully')
})

