import type { BlogTag, BlogTagFormData } from '#server/types/blog'

interface ResponseData {
  success: boolean
  data: BlogTag[]
  message?: string
}

export function useBlogTags() {
  const { data, pending, error, refresh } = useFetch<ResponseData>('/api/blog-tags', {
    key: 'blog-tags-list'
  })

  const tags = computed<BlogTag[]>(() => data.value?.data ?? [])

  const saveTag = async (payload: BlogTagFormData) => {
    const res = await $fetch<{ success: boolean; data: BlogTag; message?: string }>('/api/blog-tags', {
      method: 'POST',
      body: payload
    })
    await refresh()
    return res
  }

  const deleteTag = async (id: string) => {
    const res = await $fetch<{ success: boolean; message?: string }>(`/api/blog-tags/${id}`, {
      method: 'DELETE'
    })
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
