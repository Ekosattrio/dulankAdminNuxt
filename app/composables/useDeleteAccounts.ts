import type { DeleteAccountRequest } from '#server/types/user-management'

export function useDeleteAccounts(filterParams?: Ref<{ search?: string; sort?: string }>) {
  const query = filterParams
    ? computed(() => ({
        search: filterParams?.value.search || '',
        sort: filterParams?.value.sort || 'newest',
      }))
    : undefined

  const { data, pending, error, refresh } = useApiFetch<{ success: boolean; data: DeleteAccountRequest[] }>(
    '/api/v1/admin/delete-accounts',
    {
      ...(query ? { query } : {}),
      key: 'delete-accounts-list',
    }
  )

  const requests = computed<DeleteAccountRequest[]>(() => data.value?.data || [])

  const deleteRequest = async (id: string) => {
    return await apiFetch<{ success: boolean; data: DeleteAccountRequest }>(`/api/v1/admin/delete-accounts/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    }).then(async (res) => {
      await refresh()
      return res
    })
  }

  return {
    requests,
    pending,
    error,
    refresh,
    deleteRequest,
  }
}
