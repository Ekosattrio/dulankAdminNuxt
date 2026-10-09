import type { Ref } from 'vue'
import type { LanguageItem, LanguageFormData, LanguageTranslationDocument } from '#server/types/system-settings'

interface ResponseData {
  success: boolean
  data: LanguageItem[]
  message?: string
}

export function useLanguages(filterQuery?: Ref<{ search?: string; status?: string } | undefined>) {
  const queryParams = computed(() => {
    if (!filterQuery?.value) return {}
    return {
      search: filterQuery.value.search || undefined,
      status: filterQuery.value.status || undefined,
    }
  })

  const { data, pending, error, refresh } = useFetch<ResponseData>('/api/languages', {
    key: 'languages-data',
    query: queryParams,
  })

  const languages = computed<LanguageItem[]>(() => data.value?.data ?? [])

  const saveLanguage = async (payload: LanguageFormData) => {
    const res = await $fetch<{ success: boolean; data: LanguageItem; message?: string }>('/api/languages', {
      method: 'POST',
      body: payload,
    })
    await refresh()
    return res
  }

  const deleteLanguage = async (id: string) => {
    const res = await $fetch<{ success: boolean; data: { id: string }; message?: string }>(`/api/languages/${id}`, {
      method: 'DELETE',
    })
    await refresh()
    return res
  }

  const toggleLanguageStatus = async (item: LanguageItem) => {
    const newStatus = item.status === 'active' ? 'inactive' : 'active'
    return await saveLanguage({
      id: item.id,
      code: item.code,
      name: item.name,
      status: newStatus,
    })
  }

  const toggleRtl = async (item: LanguageItem) => {
    return await saveLanguage({
      id: item.id,
      code: item.code,
      name: item.name,
      rtl: !item.rtl,
    })
  }

  const getTranslations = async (item: LanguageItem) => {
    return await $fetch<{ success: boolean; data: LanguageTranslationDocument }>(
      `/api/languages/${item.id}/translations`,
    )
  }

  const importTranslations = async (item: LanguageItem, translations: Record<string, unknown>) => {
    const response = await $fetch<{ success: boolean; data: LanguageTranslationDocument; message?: string }>(
      `/api/languages/${item.id}/translations`,
      { method: 'POST', body: { translations } },
    )
    await refresh()
    return response
  }

  return {
    languages,
    pending,
    error,
    refresh,
    saveLanguage,
    deleteLanguage,
    toggleLanguageStatus,
    toggleRtl,
    getTranslations,
    importTranslations,
  }
}
