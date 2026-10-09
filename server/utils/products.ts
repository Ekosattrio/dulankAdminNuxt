import type { Category } from '../types/category'
import type { Product, ProductFormData, ProductImportRow } from '../types/product'
import type { Store } from '../types/store'
import type { SubCategory } from '../types/sub-category'
import type { Unit } from '../types/unit'
import { readJSON, writeJSON } from './data'

interface ProductRelations {
  categories: Category[]
  subCategories: SubCategory[]
  units: Unit[]
  stores: Store[]
}

function relations(): ProductRelations {
  return {
    categories: readJSON<Category[]>('categories.json', []),
    subCategories: readJSON<SubCategory[]>('sub-categories.json', []),
    units: readJSON<Unit[]>('units.json', []),
    stores: readJSON<Store[]>('stores.json', []),
  }
}

function resolveRelations(input: Partial<ProductFormData> & Partial<Product>, refs: ProductRelations) {
  const category = refs.categories.find(item => item.id === input.categoryId) || refs.categories.find(item => item.name === input.category)
  const subCategory = refs.subCategories.find(item => item.id === input.subCategoryId) || refs.subCategories.find(item => item.name === input.subCategory && (!category || item.categoryId === category.id))
  const unit = refs.units.find(item => item.id === input.unitId) || refs.units.find(item => item.name === input.unit)
  const store = refs.stores.find(item => item.id === input.storeId) || refs.stores.find(item => item.storeName === input.store)
  if (!category) throw new Error(`Category '${input.category || input.categoryId || ''}' tidak ditemukan`)
  if (!subCategory) throw new Error(`Sub Category '${input.subCategory || input.subCategoryId || ''}' tidak ditemukan`)
  if (subCategory.categoryId && subCategory.categoryId !== category.id) throw new Error('Sub Category tidak berelasi dengan Category terpilih')
  if (!unit) throw new Error(`Unit '${input.unit || input.unitId || ''}' tidak ditemukan`)
  if (!store) throw new Error(`Store '${input.store || input.storeId || ''}' tidak ditemukan`)
  return { category, subCategory, unit, store }
}

function hydrate(record: Product, refs: ProductRelations): Product {
  const category = refs.categories.find(item => item.id === record.categoryId) || refs.categories.find(item => item.name === record.category)
  const subCategory = refs.subCategories.find(item => item.id === record.subCategoryId) || refs.subCategories.find(item => item.name === record.subCategory)
  const unit = refs.units.find(item => item.id === record.unitId) || refs.units.find(item => item.name === record.unit)
  const store = refs.stores.find(item => item.id === record.storeId) || refs.stores.find(item => item.storeName === record.store)
  return {
    ...record,
    categoryId: category?.id || record.categoryId || '', category: category?.name || record.category,
    subCategoryId: subCategory?.id || record.subCategoryId || '', subCategory: subCategory?.name || record.subCategory,
    unitId: unit?.id || record.unitId || '', unit: unit?.name || record.unit,
    storeId: store?.id || record.storeId || '', store: store?.storeName || record.store,
  }
}

export function listProducts() {
  const refs = relations()
  return readJSON<Product[]>('products.json', []).filter(item => !item.archivedAt).map(item => hydrate(item, refs))
}

export function getProduct(id: string) {
  return listProducts().find(item => item.id === id || item.code === id)
}

function numeric(value: unknown, label: string, minimum = 0) {
  const result = Number(value ?? 0)
  if (!Number.isFinite(result) || result < minimum) throw new Error(`${label} harus berupa angka minimal ${minimum}`)
  return result
}

export function saveProduct(input: ProductFormData) {
  if (!input.name?.trim()) throw new Error('Product Name wajib diisi')
  const refs = relations()
  const relation = resolveRelations(input, refs)
  const records = readJSON<Product[]>('products.json', [])
  const now = new Date().toISOString()
  const requestedCode = input.code?.trim()
  if (requestedCode && records.some(item => item.code === requestedCode && item.id !== input.id && !item.archivedAt)) {
    throw new Error(`Item Code '${requestedCode}' sudah digunakan produk lain`)
  }
  const values = {
    name: input.name.trim(), categoryId: relation.category.id, category: relation.category.name,
    subCategoryId: relation.subCategory.id, subCategory: relation.subCategory.name,
    unitId: relation.unit.id, unit: relation.unit.name, storeId: relation.store.id, store: relation.store.storeName,
    price: numeric(input.price, 'Price'), quantity: numeric(input.quantity, 'Quantity'),
    minOrderQty: numeric(input.minOrderQty ?? 1, 'Minimum Order Qty', 1), discountValue: numeric(input.discountValue, 'Discount Value'),
    quantityAlert: numeric(input.quantityAlert, 'Quantity Alert'), minPrice: numeric(input.minPrice, 'Minimal Price'),
    druckPrice: numeric(input.druckPrice, 'Druck Price'), minLength: numeric(input.minLength, 'Minimal Length'), minWidth: numeric(input.minWidth, 'Minimal Width'),
    priceType: input.priceType, sellingType: input.sellingType || input.priceType, description: input.description || '',
    discountType: input.discountType || 'Percentage', taxType: input.taxType || 'Exclusive', images: input.images || [], variants: input.variants || [],
    status: input.status || 'Active' as const,
  }

  if (input.id) {
    const index = records.findIndex(item => item.id === input.id && !item.archivedAt)
    if (index < 0) throw new Error('Product tidak ditemukan')
    records[index] = { ...records[index]!, ...values, code: requestedCode || records[index]!.code, updatedAt: now }
    writeJSON('products.json', records)
    return hydrate(records[index]!, refs)
  }

  const nextId = records.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0) + 1
  const nextCode = records.reduce((max, item) => Math.max(max, Number(item.code) || 0), 1000) + 1
  const newProduct: Product = {
    id: String(nextId), code: requestedCode || String(nextCode).padStart(6, '0'), ...values,
    created: `Admin : ${new Intl.DateTimeFormat('en-GB', { dateStyle: 'short', timeStyle: 'short' }).format(new Date())}`,
    createdAt: now, updatedAt: now,
  }
  records.unshift(newProduct)
  writeJSON('products.json', records)
  return hydrate(newProduct, refs)
}

export function archiveProduct(id: string) {
  const records = readJSON<Product[]>('products.json', [])
  const index = records.findIndex(item => item.id === id && !item.archivedAt)
  if (index < 0) throw new Error('Product tidak ditemukan')
  records[index] = { ...records[index]!, archivedAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
  writeJSON('products.json', records)
  return records[index]!
}

export function importProducts(rows: ProductImportRow[]) {
  if (!Array.isArray(rows) || !rows.length) throw new Error('File import tidak memiliki baris produk')
  if (rows.length > 500) throw new Error('Maksimal 500 produk per import')
  const refs = relations()
  const existingCodes = new Set(readJSON<Product[]>('products.json', []).filter(item => !item.archivedAt).map(item => item.code))
  const importCodes = new Set<string>()
  rows.forEach((row, index) => {
    if (!row.name?.trim()) throw new Error(`Baris ${index + 1}: Product Name wajib diisi`)
    resolveRelations(row, refs)
    numeric(row.price, `Baris ${index + 1}: Price`)
    const code = row.code?.trim()
    if (code && (existingCodes.has(code) || importCodes.has(code))) {
      throw new Error(`Baris ${index + 1}: Item Code '${code}' sudah digunakan`)
    }
    if (code) importCodes.add(code)
  })
  return rows.map(row => saveProduct({ ...row, status: 'Active' }))
}
