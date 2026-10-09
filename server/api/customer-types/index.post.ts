import type { CustomerTypeFormData } from '~/types/customer-type'
import { saveCustomerType } from '~~/server/utils/peoplesDomainData'

export default defineEventHandler(async (event) => {
  const body = await readBody<CustomerTypeFormData>(event)
  const result = await saveCustomerType(body)

  return createResponse(
    result,
    body.id ? 'Customer type updated successfully' : 'Customer type created successfully'
  )
})
