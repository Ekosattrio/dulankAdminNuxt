import type { FooterLinkItem, FooterLinkFormData } from '#server/types/footer'

export default defineEventHandler(async (event) => {
  const body = await readBody<FooterLinkFormData>(event)

  if (!body || !body.sectionName || !body.linkTitle || !body.url) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Section name, link title, and URL are required'
    })
  }

  const allFooters = await readJSON<FooterLinkItem[]>('footers.json', [])

  if (body.id) {
    const idx = allFooters.findIndex(item => item.id === body.id)
    if (idx !== -1) {
      const current = allFooters[idx]
      if (!current) throw createError({ statusCode: 404, statusMessage: 'Footer link not found' })
      const updated: FooterLinkItem = {
        ...current,
        sectionName: body.sectionName,
        linkTitle: body.linkTitle,
        url: body.url,
        order: body.order !== undefined ? Number(body.order) : current.order,
        status: body.status || current.status || 'Active',
        target: body.target || current.target || '_self'
      }
      allFooters[idx] = updated
      await writeJSON('footers.json', allFooters)
      return createResponse(updated, 'Footer link updated successfully')
    }
  }

  const nextOrder = allFooters.length > 0 ? Math.max(...allFooters.map(f => f.order || 0)) + 1 : 1
  const newFooter: FooterLinkItem = {
    id: `foot-${Date.now()}`,
    sectionName: body.sectionName,
    linkTitle: body.linkTitle,
    url: body.url,
    order: body.order !== undefined ? Number(body.order) : nextOrder,
    status: body.status || 'Active',
    target: body.target || '_self'
  }

  allFooters.push(newFooter)
  await writeJSON('footers.json', allFooters)

  return createResponse(newFooter, 'Footer link created successfully')
})
