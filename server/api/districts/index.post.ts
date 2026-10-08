import { readData, writeData } from '~/server/utils/data'
import type { District, Province, Regency } from '~/server/types/location'

export default defineEventHandler(async (event) => {
  const body = await readBody<Partial<District>>(event)
  const items = readData<District>('districts.json')
  const provinces = readData<Province>('provinces.json')
  const regencies = readData<Regency>('regencies.json')

  const nowFormatted = new Date().toISOString().slice(0, 10)

  let provinceId = body.provinceId || ''
  let provinceName = body.province || ''
  let regencyId = body.regencyId || ''
  let regencyName = body.regency || ''

  // Infer / match province if missing
  if (provinceId && !provinceName) {
    const matchedProv = provinces.find((p) => p.id === provinceId)
    if (matchedProv) provinceName = matchedProv.name
  } else if (provinceName && !provinceId) {
    const matchedProv = provinces.find((p) => p.name.toLowerCase() === provinceName.toLowerCase())
    if (matchedProv) provinceId = matchedProv.id
  }

  // Infer / match regency if missing
  if (regencyId && !regencyName) {
    const matchedReg = regencies.find((r) => r.id === regencyId)
    if (matchedReg) {
      regencyName = matchedReg.name
      if (!provinceName) provinceName = matchedReg.province
      if (!provinceId) provinceId = matchedReg.provinceId
    }
  } else if (regencyName && !regencyId) {
    const matchedReg = regencies.find((r) => r.name.toLowerCase() === regencyName.toLowerCase())
    if (matchedReg) {
      regencyId = matchedReg.id
      if (!provinceName) provinceName = matchedReg.province
      if (!provinceId) provinceId = matchedReg.provinceId
    }
  }

  if (body.id) {
    const index = items.findIndex((d) => String(d.id) === String(body.id))
    if (index !== -1) {
      items[index] = {
        ...items[index],
        ...body,
        province: provinceName || items[index].province,
        provinceId: provinceId || items[index].provinceId,
        regency: regencyName || items[index].regency,
        regencyId: regencyId || items[index].regencyId,
      } as District
      writeData('districts.json', items)
      return { success: true, data: items[index], message: 'District updated successfully' }
    }
  }

  const nextNum = items.length + 1
  const newDistrict: District = {
    id: body.id || `dist-${nextNum}`,
    provinceId: provinceId || 'prov-1',
    province: provinceName || 'DKI Jakarta',
    regencyId: regencyId || 'reg-1',
    regency: regencyName || 'Jakarta Selatan',
    name: body.name || '',
    postalCode: body.postalCode || '',
    added: body.added || nowFormatted,
    createdBy: body.createdBy || 'Admin',
    avatar: body.avatar || '/assets/img/users/user-30.jpg',
    status: body.status || 'Active'
  }

  items.unshift(newDistrict)
  writeData('districts.json', items)

  return {
    success: true,
    data: newDistrict,
    message: 'District created successfully'
  }
})
