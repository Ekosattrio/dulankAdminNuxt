import type { AddressFormData } from '~/types/address'
import { saveAddress } from '~~/server/utils/peoplesDomainData'

export default defineEventHandler(async (event) => {
  const body = await readBody<AddressFormData>(event)
  const result = await saveAddress(body)

  return {
    success: true,
    data: result,
    message: body.id ? 'Address successfully updated' : 'Address successfully created',
  }
})
