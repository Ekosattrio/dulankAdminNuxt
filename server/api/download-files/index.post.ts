import type { DownloadFileFormData } from '#server/types/download-file'
import { saveDownloadFile } from '~~/server/utils/contentDomainData'

export default defineEventHandler(async (event) => {
  const body = await readBody<DownloadFileFormData & { isFavorite?: boolean; isPinned?: boolean }>(event)
  const file = await saveDownloadFile(body)

  return createResponse(
    file,
    body?.id ? 'File updated successfully' : 'File created successfully'
  )
})
