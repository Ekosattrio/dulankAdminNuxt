import type { SupplierFormData } from '~/types/supplier'
import { saveSupplier } from '~~/server/utils/peoplesDomainData'

export default defineEventHandler(async (event) => {
  const body = await readBody<SupplierFormData>(event)
  const result = await saveSupplier(body)

  return createResponse(result, { message: body.id ? 'Supplier updated' : 'Supplier created' })
})
