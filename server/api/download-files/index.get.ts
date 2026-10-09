import type { DownloadFileItem } from '#server/types/download-file'

export default defineEventHandler(async () => {
  const allFiles = await readJSON<DownloadFileItem[]>('download-files.json', [])
  return createResponse(allFiles, 'Download files fetched successfully')
})
