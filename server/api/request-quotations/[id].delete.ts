export default defineEventHandler(async (event) =>
  createResponse(await deleteRequestQuotation(getRouterParam(event, 'id') || ''), 'Request quotation deleted successfully'),
)
