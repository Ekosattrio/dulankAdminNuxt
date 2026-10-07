import { defineEventHandler, readBody } from 'h3'
import type { CustomerAddress, SupplierAddress, AddressFormData } from '~/types/address'

export default defineEventHandler(async (event) => {
  const body = await readBody<AddressFormData>(event)

  if (!body.customerId || !body.name) {
    return {
      success: false,
      message: 'ID and Name are required'
    }
  }

  const fileData = readJSON<{
    stats: { totalAddress: number; totalProvince: number; totalCity: number; totalPosCode: number }
    customers: CustomerAddress[]
    suppliers: SupplierAddress[]
  }>('address.json', {
    stats: { totalAddress: 0, totalProvince: 0, totalCity: 0, totalPosCode: 0 },
    customers: [],
    suppliers: []
  })

  const isSupplier = body.type === 'supplier' ||
    body.customerId.toLowerCase().startsWith('sup') ||
    (body.id && (body.id.startsWith('SUP') || fileData.suppliers.some(s => s.id === body.id)))

  if (isSupplier) {
    let targetSupplier: SupplierAddress

    if (body.id) {
      const idx = fileData.suppliers.findIndex(s => s.id === body.id)
      if (idx !== -1 && fileData.suppliers[idx]) {
        const existing = fileData.suppliers[idx]!
        targetSupplier = {
          ...existing,
          user: body.name,
          name: body.name,
          phone: body.contact || existing.phone,
          contact: body.contact || existing.phone,
          fullAddress: body.detailAddress || existing.fullAddress,
          detailAddress: body.detailAddress || existing.fullAddress,
          province: body.province || existing.province,
          city: body.city || existing.city,
          district: body.district || existing.district,
          otherDetail: body.otherDetail || existing.otherDetail || '',
          status: body.status || existing.status
        }
        fileData.suppliers[idx] = targetSupplier
      } else {
        return { success: false, message: 'Supplier address not found' }
      }
    } else {
      const nextNum = fileData.suppliers.length + 1
      const newId = `SUP${String(nextNum).padStart(5, '0')}`
      targetSupplier = {
        id: newId,
        userId: body.customerId || `supplier${nextNum}@dulank.com`,
        supplierId: body.customerId || newId,
        user: body.name,
        name: body.name,
        phone: body.contact || '',
        contact: body.contact || '',
        fullAddress: body.detailAddress || '',
        detailAddress: body.detailAddress || '',
        province: body.province || '',
        city: body.city || '',
        district: body.district || '',
        otherDetail: body.otherDetail || '',
        postalCode: '12345',
        channel: 'Direct',
        dateAdded: new Date().toISOString().slice(0, 10),
        date: new Date().toLocaleDateString('id-ID', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }).replace(/\./g, ':'),
        status: body.status || 'Active'
      }
      fileData.suppliers.unshift(targetSupplier)
      fileData.stats.totalAddress++
    }

    writeJSON('address.json', fileData)
    return {
      success: true,
      data: targetSupplier,
      message: body.id ? 'Supplier address successfully updated' : 'Supplier address successfully created'
    }
  }

  // Customer Address handling
  let targetCustomer: CustomerAddress

  if (body.id) {
    const idx = fileData.customers.findIndex(c => c.id === body.id)
    if (idx !== -1 && fileData.customers[idx]) {
      const existing = fileData.customers[idx]!
      targetCustomer = {
        ...existing,
        name: body.name,
        contact: body.contact || existing.contact,
        province: body.province || existing.province,
        city: body.city || existing.city,
        district: body.district || existing.district,
        detailAddress: body.detailAddress || existing.detailAddress,
        otherDetail: body.otherDetail || existing.otherDetail,
        status: body.status || existing.status
      }
      fileData.customers[idx] = targetCustomer
    } else {
      return { success: false, message: 'Customer address not found' }
    }
  } else {
    const nextNum = fileData.customers.length + 1
    const newId = `ADR${String(nextNum).padStart(8, '0')}`
    targetCustomer = {
      id: newId,
      customerId: body.customerId.split('/')[0]?.trim() || `ID${String(nextNum).padStart(6, '0')}`,
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
    fileData.customers.unshift(targetCustomer)
    fileData.stats.totalAddress++
  }

  writeJSON('address.json', fileData)

  return {
    success: true,
    data: targetCustomer,
    message: body.id ? 'Address successfully updated' : 'Address successfully created'
  }
})
