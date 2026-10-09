import type { DownloadFileItem } from '#server/types/download-file'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'File ID is required'
    })
  }

  const allFiles = await readJSON<DownloadFileItem[]>('download-files.json', [])
  const newFiles = allFiles.filter(item => item.id !== id)

  if (allFiles.length === newFiles.length) {
    throw createError({
      statusCode: 404,
      statusMessage: 'File not found'
    })
  }

  await writeJSON('download-files.json', newFiles)

  return createResponse({ id }, 'File deleted successfully')
})
