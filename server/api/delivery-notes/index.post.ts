import type { DeliveryNoteFormData } from '#server/types/delivery-note'

export default defineEventHandler(async (event) =>
  createResponse(await saveDeliveryNote(await readBody<DeliveryNoteFormData>(event)), 'Delivery note saved successfully'),
)
