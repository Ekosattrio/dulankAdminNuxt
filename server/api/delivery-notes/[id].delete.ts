export default defineEventHandler(async (event) =>
  createResponse(await deleteDeliveryNote(getRouterParam(event, 'id') || ''), 'Delivery note deleted successfully'),
)
