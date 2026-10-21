/** Upload data-URL previews before sending a persisted image URL to a domain API. */
export function useImageUpload() {
  async function persistImage(value: string | null | undefined, folder: string): Promise<string | null | undefined> {
    if (!value?.startsWith('data:')) return value
    const match = value.match(/^data:(image\/(?:jpeg|png|webp));base64,(.+)$/)
    if (!match) throw new Error('Gunakan gambar JPG, PNG, atau WebP.')
    const bytes = Uint8Array.from(atob(match[2]!), character => character.charCodeAt(0))
    if (bytes.byteLength > 4 * 1024 * 1024) throw new Error('Ukuran gambar maksimal 4 MB.')
    const body = new FormData()
    body.append('file', new Blob([bytes], { type: match[1] }), `photo.${match[1]!.split('/')[1]}`)
    body.append('folder', folder)
    const response = await apiFetch<{ data: { url: string } }>('/api/v1/admin/uploads/image', { method: 'POST', body })
    return response.data.url
  }
  return { persistImage }
}
