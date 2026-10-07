import { defineEventHandler, readBody } from 'h3'
import type { Supplier, SupplierFormData } from '~/types/supplier'

export default defineEventHandler(async (event) => {
  const body = await readBody<SupplierFormData>(event)

  if (!body.name || !body.email) {
    return { success: false, message: 'Name and email are required' }
  }

  const suppliers = readJSON<Supplier[]>('suppliers.json', [])
  let resultItem: Supplier

  if (body.id) {
    const idx = suppliers.findIndex(s => s.id === body.id)
    if (idx !== -1 && suppliers[idx]) {
      const existing = suppliers[idx]!
      resultItem = {
        ...existing,
        name: body.name,
        email: body.email,
        contact: body.contact || existing.contact,
        picName: body.picName || existing.picName,
        status: body.status || existing.status
      }
      suppliers[idx] = resultItem
    } else {
      return { success: false, message: 'Supplier not found' }
    }
  } else {
    const nextNum = suppliers.length + 1
    const newId = `ID${String(nextNum).padStart(4, '0')}`
    resultItem = {
      id: newId,
      supplierId: newId,
      name: body.name,
      email: body.email,
      contact: body.contact || '-',
      picName: body.picName || '-',
      status: body.status || 'Active',
      date: new Date().toLocaleDateString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).replace(/\./g, ':')
    }
    suppliers.unshift(resultItem)
  }

  writeJSON('suppliers.json', suppliers)
  return createResponse(resultItem, { message: body.id ? 'Supplier updated' : 'Supplier created' })
})

