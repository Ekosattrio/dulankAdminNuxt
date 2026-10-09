import type { Product, ProductFormData, ProductFilterParams, ProductImportRow } from '#server/types/product'

interface ResponseData {
  success: boolean
  data: Product[]
  message?: string
}

export function useProducts(filterParams?: Ref<ProductFilterParams> | ProductFilterParams) {
  const params = isRef(filterParams) ? filterParams : ref(filterParams || {})

  const { data, pending, error, refresh } = useFetch<ResponseData>('/api/products', {
    key: 'products-list',
    query: params
  })

  const products = computed<Product[]>(() => data.value?.data ?? [])

  const saveProduct = async (payload: ProductFormData) => {
    const res = await $fetch<{ success: boolean; data: Product; message?: string }>('/api/products', {
      method: 'POST',
      body: payload
    })
    await refresh()
    return res
  }

  const deleteProduct = async (id: string) => {
    const res = await $fetch<{ success: boolean; message?: string }>(`/api/products/${id}`, {
      method: 'DELETE'
    })
    await refresh()
    return res
  }

  const importProducts = async (rows: ProductImportRow[]) => {
    const res = await $fetch<{ success: boolean; data: Product[]; message?: string }>('/api/products/import', {
      method: 'POST',
      body: { rows }
    })
    await refresh()
    return res
  }

  return {
    products,
    pending,
    error,
    refresh,
    saveProduct,
    deleteProduct,
    importProducts
  }
}
