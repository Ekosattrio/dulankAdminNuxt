import { deleteContactForm } from '~~/server/utils/webstoreDomainData'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const result = await deleteContactForm(id || '')

  return {
    success: true,
    data: result,
    message: 'Contact form message deleted successfully',
  }
})
