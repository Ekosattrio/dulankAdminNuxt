import type { WorkshopService, WorkshopServiceCategory, WorkshopServiceFormData } from '#server/types/workshop-service'

interface ServiceResponse<T> { success: boolean; data: T; message?: string }

export function useWorkshopServices(category: WorkshopServiceCategory) {
  const { data, pending, error, refresh } = useFetch<ServiceResponse<WorkshopService[]>>('/api/workshop-services', {
    key: `workshop-services-${category}`,
    query: { category },
  })
  const services = computed(() => data.value?.data ?? [])

  async function saveService(payload: WorkshopServiceFormData) {
    const response = await $fetch<ServiceResponse<WorkshopService>>('/api/workshop-services', { method: 'POST', body: payload })
    await refresh()
    return response
  }

  async function deleteService(id: string) {
    const response = await $fetch<ServiceResponse<WorkshopService>>(`/api/workshop-services/${id}`, { method: 'DELETE' })
    await refresh()
    return response
  }

  return { services, pending, error, refresh, saveService, deleteService }
}
