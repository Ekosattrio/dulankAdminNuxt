import type { Product, ProductFormData } from '#server/types/product'

export default defineEventHandler(async (event) => {
  const body = await readBody<ProductFormData>(event)

  if (!body || !body.name || !body.category) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Product name and category are required',
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
        status: body.status || allProducts[idx].status || 'Active',
        store: body.store ?? allProducts[idx].store,
        sellingType: body.sellingType ?? allProducts[idx].sellingType,
        description: body.description ?? allProducts[idx].description,
        quantity: body.quantity !== undefined ? Number(body.quantity) : allProducts[idx].quantity,
        minOrderQty: body.minOrderQty !== undefined ? Number(body.minOrderQty) : allProducts[idx].minOrderQty,
        discountType: body.discountType ?? allProducts[idx].discountType,
        discountValue: body.discountValue !== undefined ? Number(body.discountValue) : allProducts[idx].discountValue,
        taxType: body.taxType ?? allProducts[idx].taxType,
        quantityAlert: body.quantityAlert !== undefined ? Number(body.quantityAlert) : allProducts[idx].quantityAlert,
        minPrice: body.minPrice !== undefined ? Number(body.minPrice) : allProducts[idx].minPrice,
        druckPrice: body.druckPrice !== undefined ? Number(body.druckPrice) : allProducts[idx].druckPrice,
        minLength: body.minLength !== undefined ? Number(body.minLength) : allProducts[idx].minLength,
        minWidth: body.minWidth !== undefined ? Number(body.minWidth) : allProducts[idx].minWidth,
        images: body.images ?? allProducts[idx].images,
        variants: body.variants ?? allProducts[idx].variants,
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
    priceType: body.priceType || 'Single Product',
    created: dateStr,
    status: body.status || 'Active',
    store: body.store || 'Main Store',
    sellingType: body.sellingType || 'Single Price',
    description: body.description || '',
    quantity: Number(body.quantity) || 0,
    minOrderQty: Number(body.minOrderQty) || 1,
    discountType: body.discountType || 'Percentage',
    discountValue: Number(body.discountValue) || 0,
    taxType: body.taxType || 'Exclusive',
    quantityAlert: Number(body.quantityAlert) || 10,
    minPrice: Number(body.minPrice) || 0,
    druckPrice: Number(body.druckPrice) || 0,
    minLength: Number(body.minLength) || 0,
    minWidth: Number(body.minWidth) || 0,
    images: body.images || [],
    variants: body.variants || [],
  }

  allProducts.unshift(newProduct)
  await writeJSON('products.json', allProducts)

  return createResponse(newProduct, 'Product created successfully')
})
