import { readJSON, writeJSON } from './data'
import type {
  PaperGroup,
  PaperGroupFilterParams,
  PaperGroupFormData,
  PaperSize,
  PaperSizeFilterParams,
  PaperSizeFormData,
  PaperItem,
  PaperItemFilterParams,
  PaperItemFormData,
  PaperPrice,
  PaperPriceFilterParams,
  PaperPriceFormData
} from '#server/types/paper-shop'

const PAPER_GROUPS_FILE = 'paper-groups-self.json'
const PAPER_SIZES_FILE = 'paper-sizes.json'
const PAPER_ITEMS_FILE = 'paper-items-self.json'
const PAPER_PRICES_FILE = 'paper-prices.json'

function nowTimestamp(): string {
  const d = new Date()
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  return `${day}/${month}/${year} ${hours}:${minutes}`
}

// ----------------------------------------------------
// 1. PAPER GROUPS
// ----------------------------------------------------
export function getPaperGroups(params?: PaperGroupFilterParams): {
  groups: PaperGroup[]
  stats: { total: number; active: number; deactive: number }
} {
  const all = readJSON<PaperGroup[]>(PAPER_GROUPS_FILE, [])
  let filtered = [...all]

  if (params?.status && params.status !== 'All') {
    filtered = filtered.filter((g) => g.status.toLowerCase() === params.status?.toLowerCase())
  }

  if (params?.search) {
    const q = params.search.toLowerCase().trim()
    filtered = filtered.filter(
      (g) => g.name.toLowerCase().includes(q) || g.merk.toLowerCase().includes(q)
    )
  }

  const stats = {
    total: all.length,
    active: all.filter((g) => g.status === 'Active').length,
    deactive: all.filter((g) => g.status === 'Deactive').length
  }

  return { groups: filtered, stats }
}

export function savePaperGroup(payload: PaperGroupFormData): PaperGroup {
  const all = readJSON<PaperGroup[]>(PAPER_GROUPS_FILE, [])

  if (payload.id) {
    const idx = all.findIndex((g) => String(g.id) === String(payload.id))
    if (idx !== -1) {
      const current = all[idx]
      if (!current) throw createError({ statusCode: 404, statusMessage: 'Paper group not found' })
      const updated: PaperGroup = {
        ...current,
        name: payload.name.trim(),
        merk: payload.merk.trim(),
        priceType: payload.priceType || 'Yes',
        status: payload.status || 'Active',
        update: nowTimestamp()
      }
      all[idx] = updated
      writeJSON(PAPER_GROUPS_FILE, all)
      return updated
    }
  }

  const nextId = all.length > 0 ? String(Math.max(...all.map((g) => Number(g.id) || 0)) + 1) : '1'
  const newGroup: PaperGroup = {
    id: nextId,
    name: payload.name.trim(),
    merk: payload.merk.trim(),
    priceType: payload.priceType || 'Yes',
    status: payload.status || 'Active',
    update: nowTimestamp()
  }

  all.unshift(newGroup)
  writeJSON(PAPER_GROUPS_FILE, all)
  return newGroup
}

export function deletePaperGroup(id: string): boolean {
  const all = readJSON<PaperGroup[]>(PAPER_GROUPS_FILE, [])
  const filtered = all.filter((g) => String(g.id) !== String(id))
  if (filtered.length !== all.length) {
    writeJSON(PAPER_GROUPS_FILE, filtered)
    return true
  }
  return false
}

// ----------------------------------------------------
// 2. PAPER SIZES
// ----------------------------------------------------
export function getPaperSizes(params?: PaperSizeFilterParams): {
  sizes: PaperSize[]
  stats: { total: number; active: number; deactive: number }
} {
  const all = readJSON<PaperSize[]>(PAPER_SIZES_FILE, [])
  let filtered = [...all]

  if (params?.status && params.status !== 'All') {
    filtered = filtered.filter((s) => s.status.toLowerCase() === params.status?.toLowerCase())
  }

  if (params?.search) {
    const q = params.search.toLowerCase().trim()
    filtered = filtered.filter(
      (s) => s.name.toLowerCase().includes(q) || s.dimension.toLowerCase().includes(q)
    )
  }

  const stats = {
    total: all.length,
    active: all.filter((s) => s.status === 'Active').length,
    deactive: all.filter((s) => s.status === 'Deactive' || (s.status as string) === 'Inactive').length
  }

  return { sizes: filtered, stats }
}

export function savePaperSize(payload: PaperSizeFormData): PaperSize {
  const all = readJSON<PaperSize[]>(PAPER_SIZES_FILE, [])
  const dimensionStr = payload.dimension || `${payload.length} x ${payload.width}`

  if (payload.id) {
    const idx = all.findIndex((s) => String(s.id) === String(payload.id))
    if (idx !== -1) {
      const current = all[idx]
      if (!current) throw createError({ statusCode: 404, statusMessage: 'Paper size not found' })
      const updated: PaperSize = {
        ...current,
        name: payload.name.trim(),
        dimension: dimensionStr,
        length: Number(payload.length) || 0,
        width: Number(payload.width) || 0,
        unit: payload.unit || 'cm',
        status: payload.status || 'Active',
        update: nowTimestamp()
      }
      all[idx] = updated
      writeJSON(PAPER_SIZES_FILE, all)
      return updated
    }
  }

  const nextId = all.length > 0 ? String(Math.max(...all.map((s) => Number(s.id) || 0)) + 1) : '1'
  const newSize: PaperSize = {
    id: nextId,
    name: payload.name.trim(),
    dimension: dimensionStr,
    length: Number(payload.length) || 0,
    width: Number(payload.width) || 0,
    unit: payload.unit || 'cm',
    status: payload.status || 'Active',
    update: nowTimestamp()
  }

  all.unshift(newSize)
  writeJSON(PAPER_SIZES_FILE, all)
  return newSize
}

export function deletePaperSize(id: string): boolean {
  const all = readJSON<PaperSize[]>(PAPER_SIZES_FILE, [])
  const filtered = all.filter((s) => String(s.id) !== String(id))
  if (filtered.length !== all.length) {
    writeJSON(PAPER_SIZES_FILE, filtered)
    return true
  }
  return false
}

// ----------------------------------------------------
// 3. PAPER ITEMS (JENIS KERTAS / LIST)
// ----------------------------------------------------
export function getPaperItems(params?: PaperItemFilterParams): {
  items: PaperItem[]
  stats: { total: number; totalGroups: number; active: number; deactive: number }
} {
  const all = readJSON<PaperItem[]>(PAPER_ITEMS_FILE, [])
  const groups = readJSON<PaperGroup[]>(PAPER_GROUPS_FILE, [])

  let filtered = [...all]

  if (params?.status && params.status !== 'All') {
    filtered = filtered.filter((i) => i.status.toLowerCase() === params.status?.toLowerCase())
  }

  if (params?.groupId && params.groupId !== 'All') {
    filtered = filtered.filter((i) => String(i.groupId) === String(params.groupId))
  }

  if (params?.search) {
    const q = params.search.toLowerCase().trim()
    filtered = filtered.filter(
      (i) =>
        i.name.toLowerCase().includes(q) ||
        i.merk.toLowerCase().includes(q) ||
        String(i.gsm).includes(q) ||
        i.paperSize.toLowerCase().includes(q)
    )
  }

  const stats = {
    total: all.length,
    totalGroups: groups.length,
    active: all.filter((i) => i.status === 'Active').length,
    deactive: all.filter((i) => i.status === 'Deactive' || (i.status as string) === 'Inactive').length
  }

  return { items: filtered, stats }
}

export function savePaperItem(payload: PaperItemFormData): PaperItem {
  const all = readJSON<PaperItem[]>(PAPER_ITEMS_FILE, [])

  if (payload.id) {
    const idx = all.findIndex((i) => String(i.id) === String(payload.id))
    if (idx !== -1) {
      const current = all[idx]
      if (!current) throw createError({ statusCode: 404, statusMessage: 'Paper item not found' })
      const updated: PaperItem = {
        ...current,
        groupId: String(payload.groupId || ''),
        sizeId: payload.sizeId ? String(payload.sizeId) : undefined,
        name: payload.name.trim(),
        merk: payload.merk.trim(),
        price: Number(payload.price) || 0,
        priceType: payload.priceType || 'Group',
        unitPrice: payload.unitPrice || 'Kg',
        gsm: Number(payload.gsm) || 0,
        paperSize: payload.paperSize || '',
        stock: Number(payload.stock) || 0,
        unitStock: payload.unitStock || 'Lembar',
        status: payload.status || 'Active',
        update: nowTimestamp()
      }
      all[idx] = updated
      writeJSON(PAPER_ITEMS_FILE, all)
      return updated
    }
  }

  const nextId = all.length > 0 ? String(Math.max(...all.map((i) => Number(i.id) || 0)) + 1) : '1'
  const newItem: PaperItem = {
    id: nextId,
    groupId: String(payload.groupId || ''),
    sizeId: payload.sizeId ? String(payload.sizeId) : undefined,
    name: payload.name.trim(),
    merk: payload.merk.trim(),
    price: Number(payload.price) || 0,
    priceType: payload.priceType || 'Group',
    unitPrice: payload.unitPrice || 'Kg',
    gsm: Number(payload.gsm) || 0,
    paperSize: payload.paperSize || '',
    stock: Number(payload.stock) || 0,
    unitStock: payload.unitStock || 'Lembar',
    status: payload.status || 'Active',
    update: nowTimestamp()
  }

  all.unshift(newItem)
  writeJSON(PAPER_ITEMS_FILE, all)
  return newItem
}

export function deletePaperItem(id: string): boolean {
  const all = readJSON<PaperItem[]>(PAPER_ITEMS_FILE, [])
  const filtered = all.filter((i) => String(i.id) !== String(id))
  if (filtered.length !== all.length) {
    writeJSON(PAPER_ITEMS_FILE, filtered)
    return true
  }
  return false
}

// ----------------------------------------------------
// 4. PAPER PRICES (HARGA KERTAS)
// ----------------------------------------------------
export function getPaperPrices(params?: PaperPriceFilterParams): {
  prices: PaperPrice[]
  stats: { total: number; totalGroups: number; active: number; deactive: number }
} {
  const all = readJSON<PaperPrice[]>(PAPER_PRICES_FILE, [])
  const groups = readJSON<PaperGroup[]>(PAPER_GROUPS_FILE, [])

  let filtered = [...all]

  if (params?.status && params.status !== 'All') {
    filtered = filtered.filter((p) => p.status.toLowerCase() === params.status?.toLowerCase())
  }

  if (params?.group && params.group !== 'All') {
    filtered = filtered.filter((p) => p.group.toLowerCase() === params.group?.toLowerCase())
  }

  if (params?.search) {
    const q = params.search.toLowerCase().trim()
    filtered = filtered.filter(
      (p) =>
        p.nama.toLowerCase().includes(q) ||
        p.group.toLowerCase().includes(q) ||
        p.merk.toLowerCase().includes(q) ||
        p.ukuran.toLowerCase().includes(q)
    )
  }

  const stats = {
    total: all.length,
    totalGroups: groups.length,
    active: all.filter((p) => p.status === 'Active').length,
    deactive: all.filter((p) => p.status === 'Deactive' || (p.status as string) === 'Inactive').length
  }

  return { prices: filtered, stats }
}

export function savePaperPrice(payload: PaperPriceFormData): PaperPrice {
  const all = readJSON<PaperPrice[]>(PAPER_PRICES_FILE, [])

  if (payload.id) {
    const idx = all.findIndex((p) => String(p.id) === String(payload.id))
    if (idx !== -1) {
      const current = all[idx]
      if (!current) throw createError({ statusCode: 404, statusMessage: 'Paper price not found' })
      const updated: PaperPrice = {
        ...current,
        paperId: payload.paperId ? String(payload.paperId) : current.paperId,
        groupId: payload.groupId ? String(payload.groupId) : current.groupId,
        nama: payload.nama.trim(),
        group: payload.group.trim(),
        merk: payload.merk.trim(),
        ukuran: payload.ukuran.trim(),
        satuan: payload.satuan.trim(),
        gramatur: Number(payload.gramatur) || 0,
        minOrder: payload.minOrder || '1 rim',
        kelipatan: payload.kelipatan || '1 rim',
        harga: Number(payload.harga) || 0,
        status: payload.status || 'Active',
        update: nowTimestamp()
      }
      all[idx] = updated
      writeJSON(PAPER_PRICES_FILE, all)
      return updated
    }
  }

  const nextId = all.length > 0 ? String(Math.max(...all.map((p) => Number(p.id) || 0)) + 1) : '1'
  const newPrice: PaperPrice = {
    id: nextId,
    paperId: payload.paperId ? String(payload.paperId) : undefined,
    groupId: payload.groupId ? String(payload.groupId) : undefined,
    nama: payload.nama.trim(),
    group: payload.group.trim(),
    merk: payload.merk.trim(),
    ukuran: payload.ukuran.trim(),
    satuan: payload.satuan.trim(),
    gramatur: Number(payload.gramatur) || 0,
    minOrder: payload.minOrder || '1 rim',
    kelipatan: payload.kelipatan || '1 rim',
    harga: Number(payload.harga) || 0,
    status: payload.status || 'Active',
    update: nowTimestamp()
  }

  all.unshift(newPrice)
  writeJSON(PAPER_PRICES_FILE, all)
  return newPrice
}

export function deletePaperPrice(id: string): boolean {
  const all = readJSON<PaperPrice[]>(PAPER_PRICES_FILE, [])
  const filtered = all.filter((p) => String(p.id) !== String(id))
  if (filtered.length !== all.length) {
    writeJSON(PAPER_PRICES_FILE, filtered)
    return true
  }
  return false
}

