import type { Ref } from 'vue'
import type { PrefixItem, PrefixFormData } from '#server/types/system-settings'

interface ResponseData {
  success: boolean
  data: PrefixItem[]
  message?: string
}

export function usePrefixes(searchQuery?: Ref<string | undefined>) {
  const queryParams = computed(() => {
    if (!searchQuery?.value) return {}
    return { search: searchQuery.value }
  })

  const { data, pending, error, refresh } = useApiFetch<ResponseData>('/api/prefixes', {
    key: 'prefixes-data',
    query: queryParams,
  })

  const prefixes = computed<PrefixItem[]>(() => data.value?.data ?? [])

  const prefixMap = computed<Record<string, string>>(() => {
    const map: Record<string, string> = {}
    for (const item of prefixes.value) {
      map[item.key] = item.prefix
    }
    return map
  })

  const savePrefixes = async (payload: PrefixItem[] | Record<string, string>) => {
    const res = await apiFetch<{ success: boolean; data: PrefixItem[]; message?: string }>('/api/prefixes', {
      method: 'POST',
      body: payload,
    })
    await refresh()
    return res
  }

  const savePrefixItem = async (payload: PrefixFormData) => {
    const res = await apiFetch<{ success: boolean; data: PrefixItem; message?: string }>('/api/prefixes', {
      method: 'POST',
      body: payload,
    })
    await refresh()
    return res
  }

  return {
    prefixes,
    prefixMap,
    pending,
    error,
    refresh,
    savePrefixes,
    savePrefixItem,
  }
}
