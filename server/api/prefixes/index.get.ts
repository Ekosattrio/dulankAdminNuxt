import { readData } from '~/server/utils/data'
import type { PrefixItem } from '~/types/system-settings'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const search = String(query.search || '').trim().toLowerCase()

  let items = readData<PrefixItem>('prefixes.json')

  if (search) {
    items = items.filter(
      (item) =>
        item.name.toLowerCase().includes(search) ||
        item.key.toLowerCase().includes(search) ||
        item.prefix.toLowerCase().includes(search),
    )
  }

  return {
    success: true,
    data: items,
  }
})
