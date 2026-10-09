import type { DeliveryNoteFormData } from '#server/types/delivery-note'
import { saveDeliveryNoteDomain } from '~~/server/utils/salesData'

export default defineEventHandler(async (event) => {
  const body = await readBody<DeliveryNoteFormData>(event)
  const { note, isNew } = await saveDeliveryNoteDomain(body)
  return createResponse(note, isNew ? 'Delivery note created successfully' : 'Delivery note updated successfully')
})
