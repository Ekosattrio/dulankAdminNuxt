import type { DeliveryNote } from '~/types/delivery-note'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Delivery Note ID is required',
    })
  }

  const allNotes = await readSalesData<DeliveryNote>('delivery-notes.json')
  const newNotes = allNotes.filter((n) => n.id !== id && n.dnNo !== id)

  if (allNotes.length === newNotes.length) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Delivery note not found',
    })
  }

  await writeJSON('delivery-notes.json', newNotes)

  return createResponse({ id }, 'Delivery note deleted successfully')
})
