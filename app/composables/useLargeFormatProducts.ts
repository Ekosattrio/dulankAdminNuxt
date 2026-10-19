import type { LargeFormatProduct, LargeFormatFilterParams } from '#server/types/large-format'
import type { Product } from '#server/types/product'

interface ProductsApiResponse {
  success: boolean
  data: Product[]
  meta?: { page: number; limit: number; total: number }
  message?: string
}

/**
 * Data Large Format Digital Printing (kosong, diisi melalui form/API).
 */
const defaultLargeFormatProducts: LargeFormatProduct[] = []


export function useLargeFormatProducts(filterParams?: Ref<LargeFormatFilterParams> | LargeFormatFilterParams) {
  const params = isRef(filterParams) ? filterParams : ref(filterParams || {})

  const localProducts = ref<LargeFormatProduct[]>([...defaultLargeFormatProducts])

  const query = computed(() => ({
    search: params.value.search || undefined,
    category: params.value.category || undefined,
    status: params.value.status || undefined,
    priceType: 'Large Format',
    limit: 100,
  }))

  const { data, pending, error, refresh: fetchRefresh } = useApiFetch<ProductsApiResponse>('/api/v1/admin/products', {
    key: 'large-format-products-list',
    query,
  })

  const products = computed<LargeFormatProduct[]>(() => {
    const apiItems = data.value?.data
    if (apiItems && Array.isArray(apiItems) && apiItems.length > 0) {
      const lfItems = apiItems.filter((p) => p.priceType === 'Large Format')
      if (lfItems.length > 0) {
        return lfItems.map((p) => ({
          id: p.id,
          code: p.code,
          name: p.name,
          categoryId: p.categoryId,
          category: p.category,
          subCategoryId: p.subCategoryId,
          subCategory: p.subCategory,
          unitId: p.unitId,
          unit: p.unit || 'm²',
          price: p.price,
          minPrice: p.minPrice || p.price,
          minOrderQty: p.minOrderQty || 1,
          minLength: p.minLength || 0,
          minWidth: p.minWidth || 0,
          material: p.description || '',
          machineType: p.sellingType || 'Large Format Printer',
          priceType: 'Large Format' as const,
          status: p.status,
          created: p.created,
          createdAt: p.createdAt,
          updatedAt: p.updatedAt,
          description: p.description,
          images: p.images,
        }))
      }
    }
    return localProducts.value
  })

  const refresh = async () => {
    try {
      await fetchRefresh()
    } catch {
      // Fallback tetap aktif jika server offline
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
    return { success: true, message: 'Large format product deleted successfully' }
  }

  const categories = computed(() => {
    const set = new Set<string>()
    for (const p of products.value) {
      if (p.category) set.add(p.category)
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
  }
}

