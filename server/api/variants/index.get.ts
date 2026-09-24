import type { Variant } from '~/types/variant'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const search = (query.search as string || '').toLowerCase().trim()
  const status = query.status as string || ''

  const allVariants = await readJSON<Variant[]>('variants.json', [])

  let filtered = allVariants

  if (search) {
    filtered = filtered.filter(item =>
      item.name.toLowerCase().includes(search) ||
      item.values.toLowerCase().includes(search)
    )
  }

  if (status) {
    filtered = filtered.filter(item => item.status === status)
  }

  return createResponse(filtered, 'Variants fetched successfully')
})

