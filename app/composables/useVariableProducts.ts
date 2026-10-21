import type { VariableProductItem, VariableProductFilterParams } from '#server/types/variable-product'
import type { Product, ProductVariant } from '#server/types/product'

interface ProductsApiResponse {
  success: boolean
  data: Product[]
  meta?: { page: number; limit: number; total: number }
  message?: string
}

/**
 * Data Variable Products (kosong, diisi melalui form/API).
 */
const defaultVariableProducts: VariableProductItem[] = []


export function useVariableProducts(filterParams?: Ref<VariableProductFilterParams> | VariableProductFilterParams) {
  const params = isRef(filterParams) ? filterParams : ref(filterParams || {})

  const localProducts = ref<VariableProductItem[]>([...defaultVariableProducts])

  const query = computed(() => ({
    search: params.value.search || undefined,
    category: params.value.category || undefined,
    status: params.value.status || undefined,
    productType: 'Variable Product',
    limit: 100,
  }))

  const { data, pending, error, refresh: fetchRefresh } = useApiFetch<ProductsApiResponse>('/api/v1/admin/products', {
    key: 'variable-products-list',
    query,
  })

  const products = computed<VariableProductItem[]>(() => {
    const apiItems = data.value?.data
    if (apiItems && Array.isArray(apiItems) && apiItems.length > 0) {
      const vpItems = apiItems.filter((p) => (p.productType || p.priceType) === 'Variable Product')
      if (vpItems.length > 0) {
        return vpItems.map((p) => {
          const variants: ProductVariant[] = p.variants || []
          const prices = variants.map((v) => v.price).filter((pr) => pr > 0)
          const priceMin = prices.length ? Math.min(...prices) : p.price
          const priceMax = prices.length ? Math.max(...prices) : p.price
          const totalStock = variants.reduce((sum, v) => sum + (v.quantity || 0), 0) || (p.quantity || 0)
          const attributeName = variants[0]?.variation || 'Default Attribute'

          return {
            id: p.id,
            code: p.code,
            name: p.name,
            categoryId: p.categoryId,
            category: p.category,
            subCategoryId: p.subCategoryId,
            subCategory: p.subCategory,
            unitId: p.unitId,
            unit: p.unit || 'Pcs',
            attributeName,
            variants,
            priceMin,
            priceMax,
            totalStock,
            priceType: 'Variable Product' as const,
            status: p.status,
            created: p.created,
            createdAt: p.createdAt,
            updatedAt: p.updatedAt,
            description: p.description,
            images: p.images,
          }
        })
      }
    }
    return localProducts.value
  })

  const refresh = async () => {
    try {
      await fetchRefresh()
    } catch {
      // Fallback tetap aktif
    }
  }

  const deleteProduct = async (id: string) => {
    try {
      await apiFetch(`/api/v1/admin/products/${encodeURIComponent(id)}`, {
        method: 'DELETE',
      })
    } catch {
      // Offline fallback: delete locally
      localProducts.value = localProducts.value.filter((p) => p.id !== id)
    }

    localProducts.value = localProducts.value.filter((p) => p.id !== id)
    await refresh()
    return { success: true, message: 'Variable product deleted successfully' }
  }

  const categories = computed(() => {
    const set = new Set<string>()
    for (const p of products.value) {
      if (p.category) set.add(p.category)
    }
    return Array.from(set).map((name) => ({ label: name, value: name }))
  })

  const attributes = computed(() => {
    const set = new Set<string>()
    for (const p of products.value) {
      if (p.attributeName) set.add(p.attributeName)
    }
    return Array.from(set).map((name) => ({ label: name, value: name }))
  })

  return {
    products,
    pending,
    error,
    refresh,
    deleteProduct,
    categories,
    attributes,
  }
}

