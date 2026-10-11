export default defineEventHandler(async (event) =>
  createResponse(await deleteQuotation(getRouterParam(event, 'id') || ''), 'Quotation deleted successfully'),
)
