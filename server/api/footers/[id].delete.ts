import type { FooterLinkItem } from '#server/types/footer'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Footer link ID is required'
    })
  }

  const allFooters = await readJSON<FooterLinkItem[]>('footers.json', [])
  const newFooters = allFooters.filter(item => item.id !== id)

  if (allFooters.length === newFooters.length) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Footer link not found'
    })
  }

  await writeJSON('footers.json', newFooters)

  return createResponse({ id }, 'Footer link deleted successfully')
})
