import type { PaperGroup, PaperGroupFormData, PaperGroupFilterParams } from '#server/types/paper-shop'

interface ResponseData {
  success: boolean
  data: PaperGroup[]
  stats: {
    total: number
    active: number
    deactive: number
  }
}

export function usePaperGroupsSelf(filterParams?: Ref<PaperGroupFilterParams> | PaperGroupFilterParams) {
  const params = isRef(filterParams) ? filterParams : ref(filterParams || {})

  const { data, pending, error, refresh } = useFetch<ResponseData>('/api/paper-groups', {
    key: 'paper-groups-self-list',
    query: params
  })

  const groups = computed<PaperGroup[]>(() => data.value?.data ?? [])
  const stats = computed(() => data.value?.stats ?? { total: 0, active: 0, deactive: 0 })

  const saveGroup = async (payload: PaperGroupFormData) => {
    const res = await $fetch<{ success: boolean; data: PaperGroup; message?: string }>('/api/paper-groups', {
      method: 'POST',
      body: payload
    })
    await refresh()
    return res
  }

  const deleteGroup = async (id: string) => {
    const res = await $fetch<{ success: boolean; message?: string }>(`/api/paper-groups/${id}`, {
      method: 'DELETE'
    })
    await refresh()
    return res
  }

  return {
    groups,
    stats,
    pending,
    error,
    refresh,
    saveGroup,
    deleteGroup
  }
}

