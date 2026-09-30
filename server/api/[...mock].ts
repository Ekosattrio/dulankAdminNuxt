// Endpoint CRUD generik untuk resource mock (single-array).
// Menangani GET + semua mutasi dalam satu route dinamis:
//   GET    /api/<slug>           — list koleksi (seed awal dari server/data)
//   POST   /api/<slug>           — buat item baru (id otomatis bila tidak ada)
//   PUT    /api/<slug>           — batch sync seluruh koleksi (dipakai useMockSync)
//   PUT    /api/<slug>/<id>      — update item
//   DELETE /api/<slug>/<id>      — hapus item
// Resource multi-array (address, banner, job-list, pos, sales-dashboard)
// dilayani file statis read-only; /api/health juga file statis.
export default defineEventHandler(async (event) => {
  const method = getMethod(event)
  const segments = (getRouterParam(event, 'mock') || '').split('/').filter(Boolean)
  const slug = segments[0]
  if (!slug || !isMockResource(slug)) {
    throw createError({ statusCode: 404, statusMessage: `Resource mock tidak dikenal: ${slug}` })
  }

  const collection = useMockCollection(slug)
  const id = segments[1]

  if (method === 'GET') {
    const cols = useMockCollections(slug)
    const keys = Object.keys(cols)
    return keys.length === 1 ? cols[keys[0]!] : cols
  }

  if (method === 'POST' && !id) {
    const body = await readBody(event)
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      throw createError({ statusCode: 400, statusMessage: 'Body harus berupa objek item' })
    }
    const item: Record<string, unknown> = { id: body.id ?? String(Date.now()), ...body }
    collection.push(item)
    return item
  }

  if (method === 'PUT') {
    const body = await readBody(event)
    if (!id) {
      // batch sync: ganti seluruh koleksi (pola useMockSync di halaman)
      if (!Array.isArray(body)) {
        throw createError({ statusCode: 400, statusMessage: 'Batch PUT membutuhkan array' })
      }
      collection.splice(0, collection.length, ...body)
      return { ok: true, count: collection.length }
    }
    const idx = collection.findIndex((x) => String((x as { id?: unknown })?.id) === id)
    if (idx === -1) {
      throw createError({ statusCode: 404, statusMessage: `Item ${id} tidak ditemukan` })
    }
    const updated: Record<string, unknown> = { ...(body ?? {}), id: (body as { id?: unknown })?.id ?? id }
    collection[idx] = updated
    return updated
  }

  if (method === 'DELETE' && id) {
    const idx = collection.findIndex((x) => String((x as { id?: unknown })?.id) === id)
    if (idx === -1) {
      throw createError({ statusCode: 404, statusMessage: `Item ${id} tidak ditemukan` })
    }
    collection.splice(idx, 1)
    return { ok: true }
  }

  throw createError({ statusCode: 405, statusMessage: 'Method tidak didukung' })
})