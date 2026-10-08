import { readData, writeData } from '~/server/utils/data'
import type { Regency, Province } from '~/server/types/location'

export default defineEventHandler(async (event) => {
  const body = await readBody<Partial<Regency>>(event)
  const items = readData<Regency>('regencies.json')
  const provinces = readData<Province>('provinces.json')

  const nowFormatted = new Date().toISOString().slice(0, 10)

  // Resolve province name or ID if only one is provided
  let provinceId = body.provinceId || ''
  let provinceName = body.province || ''

  if (provinceId && !provinceName) {
    const matchedProv = provinces.find((p) => p.id === provinceId)
    if (matchedProv) provinceName = matchedProv.name
  } else if (provinceName && !provinceId) {
    const matchedProv = provinces.find((p) => p.name.toLowerCase() === provinceName.toLowerCase())
    if (matchedProv) provinceId = matchedProv.id
  }

  if (body.id) {
    const index = items.findIndex((r) => String(r.id) === String(body.id))
    if (index !== -1) {
      items[index] = {
        ...items[index],
        ...body,
        province: provinceName || items[index].province,
        provinceId: provinceId || items[index].provinceId,
      } as Regency
      writeData('regencies.json', items)
      return { success: true, data: items[index], message: 'Regency updated successfully' }
    }
  }

  const nextNum = items.length + 1
  const newRegency: Regency = {
    id: body.id || `reg-${nextNum}`,
    provinceId: provinceId || 'prov-1',
    province: provinceName || 'DKI Jakarta',
    name: body.name || '',
    type: body.type || 'Kota',
    added: body.added || nowFormatted,
    createdBy: body.createdBy || 'Admin',
    avatar: body.avatar || '/assets/img/users/user-30.jpg',
    status: body.status || 'Active'
  }

  items.unshift(newRegency)
  writeData('regencies.json', items)

  return {
    success: true,
    data: newRegency,
    message: 'Regency created successfully'
  }
})
