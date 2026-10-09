import type { CustomerFormData } from '~/types/customer'
import { saveCustomer } from '~~/server/utils/peoplesDomainData'

export default defineEventHandler(async (event) => {
  const body = await readBody<CustomerFormData>(event)
  const result = await saveCustomer(body)

  return createResponse(result, body.id ? 'Customer updated' : 'Customer created')
})
