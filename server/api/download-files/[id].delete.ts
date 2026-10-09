import { deleteDownloadFile } from '~~/server/utils/contentDomainData'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const result = await deleteDownloadFile(id || '')

  return createResponse(result, 'File deleted successfully')
})
