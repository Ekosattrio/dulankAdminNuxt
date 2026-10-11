export default defineEventHandler(async (event) =>
  createResponse(await deleteSalesReturn(Number(getRouterParam(event, 'id'))), 'Sales return deleted successfully'),
)
