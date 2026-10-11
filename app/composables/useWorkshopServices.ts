import type { WorkshopService, WorkshopServiceCategory, WorkshopServiceFormData } from '#server/types/workshop-service'

interface ServiceResponse<T> {
  success: boolean
  data: T
  message?: string
}

/**
 * Layanan workshop (cetak/laminasi/potong) — backend Laravel
 * `/api/v1/admin/workshop-services`. Filter kategori memakai nama kategori.
 */
export function useWorkshopServices(category: WorkshopServiceCategory) {
  const query = computed(() => ({
    category,
    limit: 100
  }))

  const { data, pending, error, refresh } = useApiFetch<ServiceResponse<WorkshopService[]>>(
    '/api/v1/admin/workshop-services',
    {
      key: `workshop-services-${category}`,
      query
    }
  )

  const services = computed(() => data.value?.data ?? [])

  async function saveService(payload: WorkshopServiceFormData) {
    const { id, ...body } = payload

    const response = await apiFetch<ServiceResponse<WorkshopService>>(
      id ? `/api/v1/admin/workshop-services/${encodeURIComponent(id)}` : '/api/v1/admin/workshop-services',
      { method: id ? 'PUT' : 'POST', body }
    )

    await refresh()
    return response
  }

  async function deleteService(id: string) {
    const response = await apiFetch<ServiceResponse<WorkshopService>>(
      `/api/v1/admin/workshop-services/${encodeURIComponent(id)}`,
      { method: 'DELETE' }
    )

    await refresh()
    return response
  }

  return { services, pending, error, refresh, saveService, deleteService }
}