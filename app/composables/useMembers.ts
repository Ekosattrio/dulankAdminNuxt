import type { MemberUser } from '#server/types/user-management'

export interface MemberFilterParams {
  search?: string
  status?: string
  startDate?: string
  endDate?: string
}

export function useMembers(filterParams?: Ref<MemberFilterParams>) {
  const query = filterParams
    ? computed(() => ({
        search: filterParams?.value.search || '',
        status: filterParams?.value.status || '',
        startDate: filterParams?.value.startDate || '',
        endDate: filterParams?.value.endDate || '',
      }))
    : undefined

  const { data, pending, error, refresh } = useFetch<{ success: boolean; data: MemberUser[] }>('/api/users', {
    ...(query ? { query } : {}),
    key: 'user-members-list',
  })

  const members = computed<MemberUser[]>(() => data.value?.data || [])

  const saveMember = async (payload: Partial<MemberUser>) => {
    return await $fetch<{ success: boolean; data: MemberUser; message: string }>('/api/users', {
      method: 'POST',
      body: payload,
    }).then(async (res) => {
      await refresh()
      return res
    })
  }

  const deleteMember = async (id: string) => {
    return await $fetch<{ success: boolean; data: MemberUser; message: string }>(`/api/users/${id}`, {
      method: 'DELETE',
    }).then(async (res) => {
      await refresh()
      return res
    })
  }

  return {
    members,
    pending,
    error,
    refresh,
    saveMember,
    deleteMember,
  }
}
