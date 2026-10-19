import type { Product, ProductFormData, ProductFilterParams, ProductImportRow } from '#server/types/product'

interface ResponseData {
  success: boolean
  data: Product[]
  meta?: { page: number; limit: number; total: number }
  message?: string
}

interface MutationResponse {
  success: boolean
  data?: Product | Product[]
  message?: string
}

/**
 * Produk & master katalog — backend Laravel `/api/v1/admin/products`.
 * Kontrak resource backend dibuat identik dengan tipe admin (`Product`),
 * payload tulis juga menerima key camelCase yang sama.
 */
export function useProducts(filterParams?: Ref<ProductFilterParams> | ProductFilterParams) {
  const params = isRef(filterParams) ? filterParams : ref(filterParams || {})

  const query = computed(() => ({
    search: params.value.search || undefined,
    category: params.value.category || undefined,
    status: params.value.status || undefined,
    limit: 100
  }))

  const { data, pending, error, refresh } = useApiFetch<ResponseData>('/api/v1/admin/products', {
    key: 'products-list',
    query
  })

  const products = computed<Product[]>(() => data.value?.data ?? [])

  const saveProduct = async (payload: ProductFormData) => {
    const { id, ...body } = payload

    const res = await apiFetch<MutationResponse>(
      id ? `/api/v1/admin/products/${encodeURIComponent(id)}` : '/api/v1/admin/products',
      {
        method: id ? 'PUT' : 'POST',
        body
      }
    )

    await refresh()
    return res
  }

  const deleteProduct = async (id: string) => {
    const res = await apiFetch<{ success: boolean; message?: string }>(
      `/api/v1/admin/products/${encodeURIComponent(id)}`,
      { method: 'DELETE' }
    )

    await refresh()
    return res
  }

  /**
   * Backend tidak memiliki endpoint import massal; impor dipetakan menjadi
   * urutan pembuatan produk (POST) agar data benar-benar tersimpan.
   */
  const importProducts = async (rows: ProductImportRow[]) => {
    const created: Product[] = []
    let failure = ''

    for (const row of rows) {
      try {
        const res = await apiFetch<MutationResponse>('/api/v1/admin/products', {
          method: 'POST',
          body: {
            code: row.code || undefined,
            name: row.name,
            category: row.category || undefined,
            subCategory: row.subCategory || undefined,
            unit: row.unit || undefined,
            price: row.price,
            priceType: row.priceType
          }
        })

        if (res.data && !Array.isArray(res.data)) {
          created.push(res.data)
        }
      } catch (error: unknown) {
        failure = (error as { data?: { message?: string } })?.data?.message ?? 'Import gagal.'
        break
      }
    }

    await refresh()

    return {
      success: created.length > 0,
      data: created,
      message: failure || `${created.length} produk berhasil diimpor.`
    }
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