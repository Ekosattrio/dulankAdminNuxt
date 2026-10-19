import type { DownloadFileItem, DownloadFileFormData } from '#server/types/download-file'

interface ResponseData {
  success: boolean
  data: DownloadFileItem[]
  message?: string
}

interface MutationResponse {
  success: boolean
  data?: DownloadFileItem
  message?: string
}

/**
 * File unduhan — backend Laravel `/api/v1/admin/download-files`.
 * Penanda favorit/pinned bersifat lokal (kolom tidak ada di backend).
 */
export function useDownloadFiles() {
  const { data, pending, error, refresh } = useApiFetch<ResponseData>('/api/v1/admin/download-files', {
    key: 'download-files-list'
  })

  const files = computed<DownloadFileItem[]>(() => data.value?.data ?? [])

  const saveFile = async (payload: DownloadFileFormData & { isFavorite?: boolean; isPinned?: boolean }) => {
    const { id, isFavorite, isPinned, ...body } = payload
    void id
    void isFavorite
    void isPinned

    const res = await apiFetch<MutationResponse>('/api/v1/admin/download-files', {
      method: 'POST',
      body
    })

    await refresh()
    return res
  }

  const deleteFile = async (id: string) => {
    const res = await apiFetch<{ success: boolean; message?: string }>(
      `/api/v1/admin/download-files/${encodeURIComponent(id)}`,
      { method: 'DELETE' }
    )

    await refresh()
    return res
  }

  const toggleFavorite = async (item: DownloadFileItem) => {
    const idx = files.value.findIndex(entry => entry.id === item.id)
    if (idx === -1) return

    files.value[idx] = { ...files.value[idx]!, isFavorite: !item.isFavorite }
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