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

  const { data, pending, error, refresh } = useApiFetch<{
    success: boolean
    data: { group: string; values: Record<string, string> }
  }>('/api/v1/admin/settings/prefixes', {
    key: 'prefixes-data',
    query: queryParams,
  })

  const normalizePrefix = (value: unknown): string => {
    if (value === null || value === undefined) return ''
    if (typeof value === 'string') return value
    if (typeof value === 'object') {
      const candidate = (value as Record<string, unknown>).prefix
      return typeof candidate === 'string' ? candidate : ''
    }
    return String(value)
  }

  const prefixes = computed<PrefixItem[]>(() =>
    Object.entries(data.value?.data?.values ?? {}).map(([key, prefix]) => ({
      id: key,
      key,
      name: key,
      prefix: normalizePrefix(prefix),
    })),
  )

  const prefixMap = computed<Record<string, string>>(() => {
    const map: Record<string, string> = {}
    for (const item of prefixes.value) {
      map[item.key] = item.prefix
    }
    return map
  })

  const savePrefixes = async (payload: PrefixItem[] | Record<string, string>) => {
    const body: Record<string, string> = Array.isArray(payload)
      ? Object.fromEntries(payload.map(item => [item.key, item.prefix]))
      : payload

    const res = await apiFetch<{ success: boolean; data: { group: string; values: Record<string, string> }; message?: string }>(
      '/api/v1/admin/settings/prefixes',
      { method: 'PUT', body },
    )
    await refresh()
    return res
  }

  const savePrefixItem = async (payload: PrefixFormData) => {
    const res = await apiFetch<{ success: boolean; data: { group: string; values: Record<string, string> }; message?: string }>(
      '/api/v1/admin/settings/prefixes',
      { method: 'PUT', body: { [payload.key]: payload.prefix } },
    )
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
