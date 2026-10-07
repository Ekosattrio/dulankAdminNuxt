import type { BlogComment, BlogCommentFormData } from '#server/types/blog'

interface ResponseData {
  success: boolean
  data: BlogComment[]
  message?: string
}

export function useBlogComments() {
  const { data, pending, error, refresh } = useFetch<ResponseData>('/api/blog-comments', {
    key: 'blog-comments-list'
  })

  const comments = computed<BlogComment[]>(() => data.value?.data ?? [])

  const saveComment = async (payload: BlogCommentFormData) => {
    const res = await $fetch<{ success: boolean; data: BlogComment; message?: string }>('/api/blog-comments', {
      method: 'POST',
      body: payload
    })
    await refresh()
    return res
  }

  const deleteComment = async (id: string) => {
    const res = await $fetch<{ success: boolean; message?: string }>(`/api/blog-comments/${id}`, {
      method: 'DELETE'
    })
    await refresh()
    return res
  }

  return {
    comments,
    pending,
    error,
    refresh,
    saveComment,
    deleteComment
  }
}
