import type { Sale } from '~/types/sale'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Sale ID is required'
    })
  }

  const allSales = await readJSON<Sale[]>('sales.json', [])
  const newSales = allSales.filter(s => s.id !== id && s.saleNo !== id)

  if (allSales.length === newSales.length) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Sale record not found'
    })
  }

  await writeJSON('sales.json', newSales)

  return createResponse({ id }, 'Sale deleted successfully')
})

