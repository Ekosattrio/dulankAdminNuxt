import type { BlogComment, BlogCommentFormData } from '#server/types/blog'

interface ResponseData {
  success: boolean
  data: BlogComment[]
  message?: string
}

interface MutationResponse {
  success: boolean
  data?: BlogComment
  message?: string
}

/**
 * Komentar blog — backend Laravel `/api/v1/admin/blog-comments`.
 * Komentar datang dari pembaca; admin hanya memoderasi (ubah status) dan
 * menghapus — pembuatan manual tidak didukung.
 */
export function useBlogComments() {
  const { data, pending, error, refresh } = useApiFetch<ResponseData>('/api/v1/admin/blog-comments', {
    key: 'blog-comments-list',
    query: { limit: 100 }
  })

  const comments = computed<BlogComment[]>(() => data.value?.data ?? [])

  const saveComment = async (payload: BlogCommentFormData) => {
    if (!payload.id) {
      throw new Error('Komentar dibuat oleh pembaca web; admin hanya memoderasi komentar yang ada.')
    }

    const res = await apiFetch<MutationResponse>(
      `/api/v1/admin/blog-comments/${encodeURIComponent(payload.id)}`,
      { method: 'PUT', body: payload }
    )

    await refresh()
    return res
  }

  const deleteComment = async (id: string) => {
    const res = await apiFetch<{ success: boolean; message?: string }>(
      `/api/v1/admin/blog-comments/${encodeURIComponent(id)}`,
      { method: 'DELETE' }
    )

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