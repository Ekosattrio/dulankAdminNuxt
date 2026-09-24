import type { CustomerType, CustomerTypeFormData } from '~/types/customer-type'

export default defineEventHandler(async (event) => {
  const body = await readBody<CustomerTypeFormData>(event)

  if (!body || !body.name) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Customer type name is required'
    })
  }

  const allTypes = await readJSON<CustomerType[]>('customer-types.json', [])

  if (body.id) {
    // Update
    const idx = allTypes.findIndex(t => t.id === body.id)
    if (idx !== -1) {
      allTypes[idx] = {
        ...allTypes[idx],
        name: body.name,
        status: body.status || 'Active'
      }
      await writeJSON('customer-types.json', allTypes)
      return createResponse(allTypes[idx], 'Customer type updated successfully')
    }
  }

  // Create
  const newType: CustomerType = {
    id: String(Date.now()),
    name: body.name,
    status: body.status || 'Active'
  }

  allTypes.unshift(newType)
  await writeJSON('customer-types.json', allTypes)

  return createResponse(newType, 'Customer type created successfully')
})

