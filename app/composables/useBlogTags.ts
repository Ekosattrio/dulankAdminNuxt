import type { BlogTag, BlogTagFormData } from '#server/types/blog'

interface ResponseData {
  success: boolean
  data: BlogTag[]
  message?: string
}

interface MutationResponse {
  success: boolean
  data?: BlogTag
  message?: string
}

/**
 * Tag blog — backend Laravel `/api/v1/admin/blog-tags`.
 * Backend hanya menyediakan buat + hapus (tanpa ubah); `id` diabaikan
 * pada simpan agar perilaku seragam dengan sebelumnya.
 */
export function useBlogTags() {
  const { data, pending, error, refresh } = useApiFetch<ResponseData>('/api/v1/admin/blog-tags', {
    key: 'blog-tags-list',
    query: { limit: 100 }
  })

  const tags = computed<BlogTag[]>(() => data.value?.data ?? [])

  const saveTag = async (payload: BlogTagFormData) => {
    const { id, ...body } = payload
    void id

    const res = await apiFetch<MutationResponse>('/api/v1/admin/blog-tags', {
      method: 'POST',
      body
    })

    await refresh()
    return res
  }

  const deleteTag = async (id: string) => {
    const res = await apiFetch<{ success: boolean; message?: string }>(
      `/api/v1/admin/blog-tags/${encodeURIComponent(id)}`,
      { method: 'DELETE' }
    )

    await refresh()
    return res
  }

  return {
    tags,
    pending,
    error,
    refresh,
    saveTag,
    deleteTag
  }
}