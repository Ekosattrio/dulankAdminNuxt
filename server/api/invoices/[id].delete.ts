export default defineEventHandler(async (event) =>
  createResponse(await deleteInvoice(getRouterParam(event, 'id') || ''), 'Invoice deleted successfully'),
)
