import type { DiscountPlanCommand, DiscountPlanCustomerSegment, DiscountPlanMeta, DiscountPlanQuery, DiscountPlanView } from '#server/types/discount-plan'

interface ListResponse { success: boolean; data: DiscountPlanView[]; meta: DiscountPlanMeta }
const emptyMeta: DiscountPlanMeta = { filterCustomerSegments: [], formCustomerSegments: [] }

export function useDiscountPlans(query: Ref<DiscountPlanQuery>) {
  const { data, pending, error, refresh } = useApiFetch<ListResponse>('/api/discount-plans', { key: 'discount-plan-list', query })
  async function createPlan(command: DiscountPlanCommand) {
    const response = await apiFetch<{ success: boolean; data: DiscountPlanView; message: string }>('/api/discount-plans', { method: 'POST', body: command })
    await refresh(); return response
  }
  async function updatePlan(id: string, command: DiscountPlanCommand) {
    const response = await apiFetch<{ success: boolean; data: DiscountPlanView; message: string }>(`/api/discount-plans/${id}`, { method: 'PUT', body: command })
    await refresh(); return response
  }
  async function deletePlan(id: string) {
    const response = await apiFetch<{ success: boolean; data: DiscountPlanView; message: string }>(`/api/discount-plans/${id}`, { method: 'DELETE' })
    await refresh(); return response
  }
  async function createCustomer(name: string) {
    const response = await apiFetch<{ success: boolean; data: DiscountPlanCustomerSegment; message: string }>('/api/discount-plans/customer-segments', { method: 'POST', body: { name } })
    await refresh(); return response
  }
  return { plans: computed(() => data.value?.data ?? []), meta: computed(() => data.value?.meta ?? emptyMeta), pending, error, refresh, createPlan, updatePlan, deletePlan, createCustomer }
}
