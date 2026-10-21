interface MasterOptions {
  stores: { id: string | number; store_name: string; status: string }[]
  managers?: { id: string | number; name: string }[]
  roles?: { id: string | number; name: string }[]
}

export function useMasterOptions() {
  const { data, pending, error, refresh } = useApiFetch<{ success: boolean; data: MasterOptions }>('/api/v1/admin/master-options', { key: 'master-options' })
  return {
    stores: computed(() => data.value?.data.stores ?? []),
    managers: computed(() => data.value?.data.managers ?? []),
    roles: computed(() => data.value?.data.roles ?? []),
    pending, error, refresh,
  }
}
