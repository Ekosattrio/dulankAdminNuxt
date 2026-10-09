import type { Customer, CustomerAccountEntry, CustomerFilterParams, CustomerFormData, CustomerRecord } from '~/types/customer'
import type { CustomerType, CustomerTypeFormData } from '~/types/customer-type'
import type { Supplier, SupplierFormData } from '~/types/supplier'
import type { Store, StoreFormData } from '~~/server/types/store'
import type { CustomerAddress, SupplierAddress, AddressFormData } from '~/types/address'
import { readJSON, writeJSON } from './data'

// ----------------- Customers -----------------

export async function getCustomers(query?: CustomerFilterParams): Promise<{ customers: Customer[]; total: number }> {
  const records = await readJSON<CustomerRecord[]>('customers.json', [])
  const accountEntries = await readJSON<CustomerAccountEntry[]>('customer-account-entries.json', [])

  const balanceByCustomer = accountEntries.reduce((totals, entry) => {
    totals.set(entry.customerId, (totals.get(entry.customerId) || 0) + entry.amount)
    return totals
  }, new Map<string, number>())

  let customers: Customer[] = records
    .filter(customer => customer.status !== 'Archived')
    .map(customer => ({ ...customer, balance: balanceByCustomer.get(customer.customerId) || 0 }))

  if (query?.search) {
    const q = query.search.toLowerCase()
    customers = customers.filter(c =>
      c.customerId.toLowerCase().includes(q) ||
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q)
    )
  }

  if (query?.type && query.type !== 'All' && query.type !== '') {
    customers = customers.filter(c => c.type.toLowerCase() === query.type!.toLowerCase())
  }

  if (query?.startDate || query?.endDate) {
    customers = customers.filter(c => isDateWithinRange(c.dateJoin, query.startDate, query.endDate))
  }

  return { customers, total: customers.length }
}

export async function saveCustomer(body: CustomerFormData): Promise<Customer> {
  if (!body.name || !body.email) {
    throw createError({ statusCode: 400, statusMessage: 'Name and email are required' })
  }

  const customers = await readJSON<CustomerRecord[]>('customers.json', [])
  let resultItem: CustomerRecord

  if (body.id) {
    const idx = customers.findIndex(c => c.id === body.id)
    if (idx !== -1 && customers[idx]) {
      const existing = customers[idx]!
      resultItem = {
        ...existing,
        name: body.name.trim(),
        email: body.email.trim(),
        type: body.type || existing.type,
        phone: body.phone || existing.phone,
      }
      customers[idx] = resultItem
    } else {
      throw createError({ statusCode: 404, statusMessage: 'Customer not found' })
    }
  } else {
    const nextNum = customers.reduce((highest, customer) => {
      const numericId = Number(customer.customerId.replace(/\D/g, ''))
      return Number.isFinite(numericId) ? Math.max(highest, numericId) : highest
    }, 0) + 1
    const newId = `ID${String(nextNum).padStart(6, '0')}`
    resultItem = {
      id: newId,
      customerId: newId,
      name: body.name.trim(),
      email: body.email.trim(),
      type: body.type || 'General',
      phone: body.phone || '-',
      channel: 'Offline',
      dateJoin: new Date().toLocaleDateString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).replace(/\./g, ':'),
      lastSeen: 'Just now',
      status: 'Active',
    }
    customers.unshift(resultItem)
  }

  await writeJSON('customers.json', customers)
  const accountEntries = await readJSON<CustomerAccountEntry[]>('customer-account-entries.json', [])
  const balance = accountEntries
    .filter(entry => entry.customerId === resultItem.customerId)
    .reduce((total, entry) => total + entry.amount, 0)

  return { ...resultItem, balance }
}

export async function archiveCustomer(id: string): Promise<{ id: string; deleted: boolean }> {
  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID required' })

  const customers = await readJSON<CustomerRecord[]>('customers.json', [])
  const index = customers.findIndex(c => c.id === id || c.customerId === id)

  if (index >= 0) {
    customers[index] = { ...customers[index]!, status: 'Archived' }
    await writeJSON('customers.json', customers)
    return { id, deleted: true }
  }

  throw createError({ statusCode: 404, statusMessage: 'Customer not found' })
}

// ----------------- Customer Types -----------------

export async function getCustomerTypes(query?: { search?: string; status?: string }): Promise<CustomerType[]> {
  const allTypes = await readJSON<CustomerType[]>('customer-types.json', [])
  let filtered = allTypes

  const search = (query?.search || '').toLowerCase().trim()
  const status = query?.status || ''

  if (search) {
    filtered = filtered.filter(item => item.name.toLowerCase().includes(search))
  }

  if (status) {
    filtered = filtered.filter(item => item.status === status)
  }

  return filtered
}

export async function saveCustomerType(body: CustomerTypeFormData): Promise<CustomerType> {
  if (!body || !body.name?.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'Customer type name is required' })
  }

  const allTypes = await readJSON<CustomerType[]>('customer-types.json', [])

  if (body.id) {
    const idx = allTypes.findIndex(t => t.id === body.id)
    if (idx !== -1 && allTypes[idx]) {
      const existing = allTypes[idx]!
      allTypes[idx] = {
        ...existing,
        name: body.name.trim(),
        status: body.status || 'Active',
      }
      await writeJSON('customer-types.json', allTypes)
      return allTypes[idx]!
    }
    throw createError({ statusCode: 404, statusMessage: 'Customer type not found' })
  }

  const newType: CustomerType = {
    id: String(Date.now()),
    name: body.name.trim(),
    status: body.status || 'Active',
  }

  allTypes.unshift(newType)
  await writeJSON('customer-types.json', allTypes)
  return newType
}

export async function deleteCustomerType(id: string): Promise<{ id: string }> {
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Customer type ID required' })

  const allTypes = await readJSON<CustomerType[]>('customer-types.json', [])
  const newTypes = allTypes.filter(t => t.id !== id)

  if (allTypes.length === newTypes.length) {
    throw createError({ statusCode: 404, statusMessage: 'Customer type not found' })
  }

  await writeJSON('customer-types.json', newTypes)
  return { id }
}

// ----------------- Suppliers -----------------

export async function getSuppliers(query?: { search?: string; status?: string }): Promise<Supplier[]> {
  const suppliers = await readJSON<Supplier[]>('suppliers.json', [])
  let filtered = suppliers

  const search = (query?.search || '').toLowerCase().trim()
  const status = query?.status || ''

  if (search) {
    filtered = filtered.filter(item =>
      item.name.toLowerCase().includes(search) ||
      item.email.toLowerCase().includes(search) ||
      (item.picName && item.picName.toLowerCase().includes(search))
    )
  }

  if (status && status !== 'All') {
    filtered = filtered.filter(item => item.status.toLowerCase() === status.toLowerCase())
  }

  return filtered
}

export async function saveSupplier(body: SupplierFormData): Promise<Supplier> {
  if (!body.name || !body.email) {
    throw createError({ statusCode: 400, statusMessage: 'Name and email are required' })
  }

  const suppliers = await readJSON<Supplier[]>('suppliers.json', [])
  let resultItem: Supplier

  if (body.id) {
    const idx = suppliers.findIndex(s => s.id === body.id)
    if (idx !== -1 && suppliers[idx]) {
      const existing = suppliers[idx]!
      resultItem = {
        ...existing,
        name: body.name.trim(),
        email: body.email.trim(),
        contact: body.contact || existing.contact,
        picName: body.picName || existing.picName,
        status: body.status || existing.status,
      }
      suppliers[idx] = resultItem
    } else {
      throw createError({ statusCode: 404, statusMessage: 'Supplier not found' })
    }
  } else {
    const nextNum = suppliers.length + 1
    const newId = `ID${String(nextNum).padStart(4, '0')}`
    resultItem = {
      id: newId,
      supplierId: newId,
      name: body.name.trim(),
      email: body.email.trim(),
      contact: body.contact || '-',
      picName: body.picName || '-',
      status: body.status || 'Active',
      date: new Date().toLocaleDateString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).replace(/\./g, ':'),
    }
    suppliers.unshift(resultItem)
  }

  await writeJSON('suppliers.json', suppliers)
  return resultItem
}

export async function deleteSupplier(id: string): Promise<{ id: string }> {
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Supplier ID required' })

  const suppliers = await readJSON<Supplier[]>('suppliers.json', [])
  const newSuppliers = suppliers.filter(s => s.id !== id && s.supplierId !== id)

  if (suppliers.length === newSuppliers.length) {
    throw createError({ statusCode: 404, statusMessage: 'Supplier not found' })
  }

  await writeJSON('suppliers.json', newSuppliers)
  return { id }
}

// ----------------- Stores -----------------

export async function getStores(query?: { search?: string; status?: string }): Promise<Store[]> {
  const allStores = await readJSON<Store[]>('stores.json', [])
  let filtered = allStores

  const search = (query?.search || '').toLowerCase().trim()
  const status = query?.status || ''

  if (search) {
    filtered = filtered.filter(item =>
      item.storeName.toLowerCase().includes(search) ||
      (item.userName && item.userName.toLowerCase().includes(search)) ||
      (item.email && item.email.toLowerCase().includes(search))
    )
  }

  if (status && status !== 'All') {
    filtered = filtered.filter(item => item.status.toLowerCase() === status.toLowerCase())
  }

  return filtered
}

export async function saveStore(body: StoreFormData): Promise<Store> {
  if (!body || !body.storeName?.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'Store name is required' })
  }

  const allStores = await readJSON<Store[]>('stores.json', [])

  if (body.id) {
    const idx = allStores.findIndex(s => s.id === body.id)
    if (idx !== -1 && allStores[idx]) {
      const existing = allStores[idx]!
      allStores[idx] = {
        ...existing,
        storeName: body.storeName.trim(),
        userName: body.userName || existing.userName,
        address: body.address || existing.address,
        phone: body.phone || existing.phone,
        email: body.email || existing.email,
        status: body.status || 'Active',
      }
      await writeJSON('stores.json', allStores)
      return allStores[idx]!
    }
    throw createError({ statusCode: 404, statusMessage: 'Store not found' })
  }

  const newStore: Store = {
    id: String(Date.now()),
    storeName: body.storeName.trim(),
    userName: body.userName || 'Admin',
    address: body.address || '',
    phone: body.phone || '',
    email: body.email || '',
    status: body.status || 'Active',
  }

  allStores.unshift(newStore)
  await writeJSON('stores.json', allStores)
  return newStore
}

export async function deleteStore(id: string): Promise<{ id: string }> {
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Store ID required' })

  const allStores = await readJSON<Store[]>('stores.json', [])
  const newStores = allStores.filter(s => s.id !== id)

  if (allStores.length === newStores.length) {
    throw createError({ statusCode: 404, statusMessage: 'Store not found' })
  }

  await writeJSON('stores.json', newStores)
  return { id }
}

// ----------------- Addresses -----------------

export interface AddressContainer {
  stats: { totalAddress: number; totalProvince: number; totalCity: number; totalPosCode: number }
  customers: CustomerAddress[]
  suppliers: SupplierAddress[]
}

export async function getAddresses(type?: string): Promise<AddressContainer> {
  const fileData = await readJSON<AddressContainer>('address.json', {
    stats: { totalAddress: 0, totalProvince: 0, totalCity: 0, totalPosCode: 0 },
    customers: [],
    suppliers: [],
  })

  return fileData
}

export async function getFilteredAddresses(query?: { search?: string; status?: string }): Promise<{
  stats: { totalAddress: number; totalProvince: number; totalCity: number; totalPosCode: number }
  customers: CustomerAddress[]
  suppliers: SupplierAddress[]
  totalCustomers: number
  totalSuppliers: number
}> {
  const addressData = await readJSON<AddressContainer>('address.json', {
    stats: { totalAddress: 0, totalProvince: 0, totalCity: 0, totalPosCode: 0 },
    customers: [],
    suppliers: [],
  })

  const stats = addressData.stats
  let customers: CustomerAddress[] = [...(addressData.customers || [])]
  let suppliers: SupplierAddress[] = (addressData.suppliers || []).map(s => ({
    ...s,
    supplierId: s.supplierId || s.userId || s.id,
    name: s.name || s.user,
    contact: s.contact || s.phone,
    detailAddress: s.detailAddress || s.fullAddress,
    date: s.date || s.dateAdded,
  }))

  if (query?.search) {
    const q = query.search.toLowerCase()
    customers = customers.filter(c =>
      c.id.toLowerCase().includes(q) ||
      c.customerId.toLowerCase().includes(q) ||
      c.name.toLowerCase().includes(q) ||
      c.contact.toLowerCase().includes(q) ||
      c.province.toLowerCase().includes(q) ||
      c.city.toLowerCase().includes(q) ||
      c.district.toLowerCase().includes(q) ||
      c.detailAddress.toLowerCase().includes(q) ||
      c.otherDetail.toLowerCase().includes(q)
    )

    suppliers = suppliers.filter(s =>
      s.userId.toLowerCase().includes(q) ||
      s.user.toLowerCase().includes(q) ||
      s.phone.toLowerCase().includes(q) ||
      s.fullAddress.toLowerCase().includes(q) ||
      s.city.toLowerCase().includes(q) ||
      s.district.toLowerCase().includes(q) ||
      s.province.toLowerCase().includes(q)
    )
  }

  if (query?.status && query.status !== 'All' && query.status !== '') {
    const s = query.status.toLowerCase()
    customers = customers.filter(c => c.status.toLowerCase() === s)
    suppliers = suppliers.filter(supp => supp.status.toLowerCase() === s)
  }

  return {
    stats,
    customers,
    suppliers,
    totalCustomers: customers.length,
    totalSuppliers: suppliers.length,
  }
}

export async function saveAddress(body: AddressFormData): Promise<CustomerAddress | SupplierAddress> {
  if (!body.customerId || !body.name) {
    throw createError({ statusCode: 400, statusMessage: 'ID and Name are required' })
  }

  const fileData = await readJSON<AddressContainer>('address.json', {
    stats: { totalAddress: 0, totalProvince: 0, totalCity: 0, totalPosCode: 0 },
    customers: [],
    suppliers: [],
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
          status: body.status || existing.status,
        }
        fileData.suppliers[idx] = targetSupplier
      } else {
        throw createError({ statusCode: 404, statusMessage: 'Supplier address not found' })
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
          minute: '2-digit',
        }).replace(/\./g, ':'),
        status: body.status || 'Active',
      }
      fileData.suppliers.unshift(targetSupplier)
      fileData.stats.totalAddress++
    }

    await writeJSON('address.json', fileData)
    return targetSupplier
  }

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
        status: body.status || existing.status,
      }
      fileData.customers[idx] = targetCustomer
    } else {
      throw createError({ statusCode: 404, statusMessage: 'Customer address not found' })
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
        minute: '2-digit',
      }).replace(/\./g, ':'),
    }
    fileData.customers.unshift(targetCustomer)
    fileData.stats.totalAddress++
  }

  await writeJSON('address.json', fileData)
  return targetCustomer
}

export async function deleteAddress(id: string): Promise<{ id: string }> {
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Address ID required' })

  const fileData = await readJSON<AddressContainer>('address.json', {
    stats: { totalAddress: 0, totalProvince: 0, totalCity: 0, totalPosCode: 0 },
    customers: [],
    suppliers: [],
  })

  const initialCustLen = fileData.customers.length
  const initialSupLen = fileData.suppliers.length

  fileData.customers = fileData.customers.filter(c => c.id !== id)
  fileData.suppliers = fileData.suppliers.filter(s => s.id !== id)

  if (fileData.customers.length === initialCustLen && fileData.suppliers.length === initialSupLen) {
    throw createError({ statusCode: 404, statusMessage: 'Address not found' })
  }

  fileData.stats.totalAddress = Math.max(0, fileData.stats.totalAddress - 1)
  await writeJSON('address.json', fileData)
  return { id }
}
