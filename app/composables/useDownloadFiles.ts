import type { DownloadFileItem, DownloadFileFormData } from '#server/types/download-file'

interface ResponseData {
  success: boolean
  data: DownloadFileItem[]
  message?: string
}

export function useDownloadFiles() {
  const { data, pending, error, refresh } = useFetch<ResponseData>('/api/download-files', {
    key: 'download-files-list'
  })

  const files = computed<DownloadFileItem[]>(() => data.value?.data ?? [])

  const saveFile = async (payload: DownloadFileFormData & { isFavorite?: boolean; isPinned?: boolean }) => {
    const res = await $fetch<{ success: boolean; data: DownloadFileItem; message?: string }>('/api/download-files', {
      method: 'POST',
      body: payload
    })
    await refresh()
    return res
  }

  const deleteFile = async (id: string) => {
    const res = await $fetch<{ success: boolean; message?: string }>(`/api/download-files/${id}`, {
      method: 'DELETE'
    })
    await refresh()
    return res
  }

  const toggleFavorite = async (item: DownloadFileItem) => {
    return await saveFile({
      id: item.id,
      name: item.name,
      category: item.category,
      size: item.size,
      fileType: item.fileType,
      isFavorite: !item.isFavorite,
      isPinned: item.isPinned
    })
  }

  return {
    files,
    pending,
    error,
    refresh,
    saveFile,
    deleteFile,
    toggleFavorite
  }
}
