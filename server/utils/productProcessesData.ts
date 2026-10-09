import { readJSON, writeJSON } from './data'
import type {
  ProductProcessItem,
  ProductProcessFormData,
  ProductProcessFilterParams
} from '#server/types/product-process'

const FILE_NAME = 'product-processes.json'

export function getProductProcessList(params?: ProductProcessFilterParams): {
  items: ProductProcessItem[]
  stats: {
    totalProduct: number
    totalProcess: number
    active: number
    deactive: number
  }
} {
  const all = readJSON<ProductProcessItem[]>(FILE_NAME, [])
  let filtered = [...all]

  if (params?.status && params.status !== 'All') {
    filtered = filtered.filter((i) => i.status.toLowerCase() === params.status?.toLowerCase())
  }
  if (params?.processName && params.processName !== 'All') {
    filtered = filtered.filter((i) => i.processName.toLowerCase() === params.processName?.toLowerCase())
  }
  if (params?.search) {
    const q = params.search.toLowerCase().trim()
    filtered = filtered.filter(
      (i) =>
        i.code.toLowerCase().includes(q) ||
        i.product.toLowerCase().includes(q) ||
        i.processName.toLowerCase().includes(q)
    )
  }

  // Count distinct products
  const distinctProductIds = new Set(all.map((i) => i.productId || i.product))

  const stats = {
    totalProduct: distinctProductIds.size,
    totalProcess: all.length,
    active: all.filter((i) => i.status === 'Active').length,
    deactive: all.filter((i) => i.status === 'Deactive').length
  }

  return { items: filtered, stats }
}

export function saveProductProcessItem(payload: ProductProcessFormData): ProductProcessItem {
  const all = readJSON<ProductProcessItem[]>(FILE_NAME, [])
  const products = readJSON<Array<{ id: string; name: string }>>('products.json', [])
  const linkedProd = products.find((p) => String(p.id) === String(payload.productId))
  const productName = linkedProd ? linkedProd.name : (payload.product || 'Unknown Product')

  if (payload.id) {
    const idx = all.findIndex((i) => String(i.id) === String(payload.id))
    if (idx !== -1) {
      const current = all[idx]
      if (!current) throw createError({ statusCode: 404, statusMessage: 'Product process not found' })
      const updated: ProductProcessItem = {
        ...current,
        productId: String(payload.productId),
        product: productName,
        processName: payload.processName.trim(),
        status: payload.status || current.status || 'Active',
        updatedAt: new Date().toISOString()
      }
      all[idx] = updated
      writeJSON(FILE_NAME, all)
      return updated
    }
  }

  const newId = String(Date.now())
  const seq = String(all.length + 1).padStart(2, '0')
  const newItem: ProductProcessItem = {
    id: newId,
    productId: String(payload.productId),
    code: `PROPC-${seq}`,
    product: productName,
    image: payload.image || '/assets/img/products/stock-img-01.png',
    processName: payload.processName.trim(),
    createDate: new Date().toISOString().slice(0, 10),
    status: payload.status || 'Active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  all.unshift(newItem)
  writeJSON(FILE_NAME, all)
  return newItem
}

export function deleteProductProcessItem(id: string): boolean {
  const all = readJSON<ProductProcessItem[]>(FILE_NAME, [])
  const filtered = all.filter((i) => String(i.id) !== String(id))
  if (filtered.length !== all.length) {
    writeJSON(FILE_NAME, filtered)
    return true
  }
  return false
}

