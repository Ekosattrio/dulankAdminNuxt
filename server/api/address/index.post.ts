import { defineEventHandler, readBody } from 'h3'
import type { CustomerAddress, AddressFormData } from '~/types/address'

export default defineEventHandler(async (event) => {
  const body = await readBody<AddressFormData>(event)

  if (!body.customerId || !body.name) {
    return {
      success: false,
      message: 'Customer ID and Name are required'
    }
  }

  const fileData = readJSON<{
    stats: { totalAddress: number; totalProvince: number; totalCity: number; totalPosCode: number }
    customers: CustomerAddress[]
    suppliers: any[]
  }>('address.json')

  let targetItem: CustomerAddress

  if (body.id) {
    // Edit existing
    const idx = fileData.customers.findIndex(c => c.id === body.id)
    if (idx !== -1) {
      fileData.customers[idx] = {
        ...fileData.customers[idx],
        name: body.name,
        contact: body.contact || fileData.customers[idx].contact,
        province: body.province || fileData.customers[idx].province,
        city: body.city || fileData.customers[idx].city,
        district: body.district || fileData.customers[idx].district,
        detailAddress: body.detailAddress || fileData.customers[idx].detailAddress,
        otherDetail: body.otherDetail || fileData.customers[idx].otherDetail,
        status: body.status || fileData.customers[idx].status
      }
      targetItem = fileData.customers[idx]
    } else {
      return { success: false, message: 'Address not found' }
    }
  } else {
    // Add new
    const nextNum = fileData.customers.length + 1
    const newId = `ADR${String(nextNum).padStart(8, '0')}`
    targetItem = {
      id: newId,
      customerId: body.customerId.split('/')[0].trim() || `ID${String(nextNum).padStart(6, '0')}`,
      name: body.name,
      contact: body.contact || '',
      province: body.province || '',
      city: body.city || '',
      district: body.district || '',
      detailAddress: body.detailAddress || '',
      otherDetail: body.otherDetail || '',
      status: body.status || 'Home',
      date: new Date().toLocaleDateString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).replace(/\./g, ':')
    }
    fileData.customers.unshift(targetItem)
    fileData.stats.totalAddress++
  }

  writeJSON('address.json', fileData)

  return {
    success: true,
    data: targetItem,
    message: body.id ? 'Address successfully updated' : 'Address successfully created'
  }
})

