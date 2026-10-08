import { readData, writeData } from '~/server/utils/data'
import type { Province } from '~/server/types/location'

export default defineEventHandler(async (event) => {
  const body = await readBody<Partial<Province>>(event)
  const items = readData<Province>('provinces.json')

  const nowFormatted = new Date().toISOString().slice(0, 10)

  if (body.id) {
    const index = items.findIndex((p) => String(p.id) === String(body.id))
    if (index !== -1) {
      items[index] = {
        ...items[index],
        ...body,
      } as Province
      writeData('provinces.json', items)
      return { success: true, data: items[index], message: 'Province updated successfully' }
    }
  }

  const nextNum = items.length + 1
  const newProvince: Province = {
    id: body.id || `prov-${nextNum}`,
    name: body.name || '',
    code: body.code || '',
    added: body.added || nowFormatted,
    createdBy: body.createdBy || 'Admin',
    avatar: body.avatar || '/assets/img/users/user-30.jpg',
    status: body.status || 'Active'
  }

  items.unshift(newProvince)
  writeData('provinces.json', items)

  return {
    success: true,
    data: newProvince,
    message: 'Province created successfully'
  }
})
