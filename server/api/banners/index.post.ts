import type { BannerItem, BannerFormData } from '#server/types/banner'

export default defineEventHandler(async (event) => {
  const body = await readBody<BannerFormData>(event)

  if (!body) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Payload is required'
    })
  }

  const title = body.title || 'Untitled Banner'
  const img = body.imageUrl || body.src || 'https://percetakan-dulank.netlify.app/images/brosur.jpg'
  const type = body.type || (body.position?.toLowerCase().includes('product') ? 'product' : 'main')
  const position = body.position || (type === 'product' ? 'Product Promo' : 'Main Slider')
  const desc = body.description || body.desc || ''
  const start = body.start || body.startDate || new Date().toISOString()
  const end = body.end || body.endDate || new Date(Date.now() + 30 * 86400000).toISOString()

  const allBanners = await readJSON<BannerItem[]>('banners.json', [])

  if (body.id) {
    const idx = allBanners.findIndex(item => item.id === body.id)
    if (idx !== -1) {
      const current = allBanners[idx]
      if (!current) throw createError({ statusCode: 404, statusMessage: 'Banner not found' })
      const updated: BannerItem = {
        ...current,
        title,
        imageUrl: img,
        src: img,
        type,
        position,
        description: desc,
        desc,
        start,
        end,
        startDate: start.slice(0, 10),
        endDate: end.slice(0, 10),
        status: body.status || current.status || 'Inactive',
        order: body.order !== undefined ? Number(body.order) : current.order,
        redirectUrl: body.redirectUrl ?? current.redirectUrl ?? '#'
      }
      allBanners[idx] = updated
      await writeJSON('banners.json', allBanners)
      return createResponse(updated, 'Banner updated successfully')
    }
  }

  const nextOrder = allBanners.length > 0 ? Math.max(...allBanners.map(b => b.order || 0)) + 1 : 1
  const newBanner: BannerItem = {
    id: body.id || (type === 'main' ? `m${Date.now()}` : `p${Date.now()}`),
    title,
    imageUrl: img,
    src: img,
    type,
    position,
    description: desc,
    desc,
    start,
    end,
    startDate: start.slice(0, 10),
    endDate: end.slice(0, 10),
    status: body.status || 'Inactive',
    order: body.order !== undefined ? Number(body.order) : nextOrder,
    redirectUrl: body.redirectUrl || '#'
  }

  allBanners.push(newBanner)
  await writeJSON('banners.json', allBanners)

  return createResponse(newBanner, 'Banner created successfully')
})
