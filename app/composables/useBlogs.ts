import type { Blog, BlogFormData } from '#server/types/blog'

interface ResponseData {
  success: boolean
  data: Blog[]
  message?: string
}

export function useBlogs() {
  const { data, pending, error, refresh } = useApiFetch<ResponseData>('/api/blogs', {
    key: 'blogs-list'
  })

  const blogs = computed<Blog[]>(() => data.value?.data ?? [])

  const saveBlog = async (payload: BlogFormData, id?: string) => {
    const res = await apiFetch<{ success: boolean; data: Blog; message?: string }>(
      id ? `/api/blogs/${id}` : '/api/blogs',
      {
        method: id ? 'PUT' : 'POST',
        body: payload
      }
    )
    await refresh()
    return res
  }

  const deleteBlog = async (id: string) => {
    const res = await apiFetch<{ success: boolean; message?: string }>(`/api/blogs/${id}`, {
      method: 'DELETE'
    })
    await refresh()
    return res
  }

  return {
    blogs,
    pending,
    error,
    refresh,
    saveBlog,
    deleteBlog
  }
}
