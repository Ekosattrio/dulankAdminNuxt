import type { Variant, VariantFormData } from '~/types/variant'

export default defineEventHandler(async (event) => {
  const body = await readBody<VariantFormData>(event)

  if (!body || !body.name || !body.values) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Variant name and values are required'
    })
  }

  const allVariants = await readJSON<Variant[]>('variants.json', [])

  if (body.id) {
    // Update
    const idx = allVariants.findIndex(v => v.id === body.id)
    if (idx !== -1) {
      const current = allVariants[idx]
      if (!current) throw createError({ statusCode: 404, statusMessage: 'Variant not found' })
      const updated: Variant = {
        ...current,
        name: body.name,
        values: body.values,
        status: body.status || 'Active'
      }
      allVariants[idx] = updated
      await writeJSON('variants.json', allVariants)
      return createResponse(updated, 'Variant updated successfully')
    }
  }

  // Create
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const now = new Date()
  const dateStr = `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`

  const newVariant: Variant = {
    id: String(Date.now()),
    name: body.name,
    values: body.values,
    itemUsed: 0,
    createdOn: dateStr,
    status: body.status || 'Active'
  }

  allVariants.unshift(newVariant)
  await writeJSON('variants.json', allVariants)

  return createResponse(newVariant, 'Variant created successfully')
})

