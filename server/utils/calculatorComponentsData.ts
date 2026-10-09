import { readJSON, writeJSON } from './data'
import type {
  JasaLainItem,
  JasaLainFormData,
  KomponenMinimumItem,
  KomponenMinimumFormData,
  KomponenFiksItem,
  KomponenFiksFormData
} from '#server/types/calculator-components'

const JASA_LAIN_FILE = 'calculator-jasa-lain.json'
const KOMPONEN_MINIMUM_FILE = 'calculator-komponen-minimum.json'
const KOMPONEN_FIKS_FILE = 'calculator-komponen-fiks.json'

function nowTimestamp(): string {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

// ----------------------------------------------------
// 1. JASA LAIN
// ----------------------------------------------------
export function getJasaLainList(params?: { search?: string; status?: string; unit?: string }): {
  items: JasaLainItem[]
  stats: { total: number; active: number; deactive: number }
} {
  const all = readJSON<JasaLainItem[]>(JASA_LAIN_FILE, [])
  let filtered = [...all]

  if (params?.status && params.status !== 'All') {
    filtered = filtered.filter((i) => i.status.toLowerCase() === params.status?.toLowerCase())
  }
  if (params?.unit && params.unit !== 'All') {
    filtered = filtered.filter((i) => i.satuan.toLowerCase() === params.unit?.toLowerCase())
  }
  if (params?.search) {
    const q = params.search.toLowerCase().trim()
    filtered = filtered.filter((i) => i.name.toLowerCase().includes(q))
  }

  const stats = {
    total: all.length,
    active: all.filter((i) => i.status === 'Active').length,
    deactive: all.filter((i) => i.status === 'Deactive').length
  }

  return { items: filtered, stats }
}

export function saveJasaLainItem(payload: JasaLainFormData): JasaLainItem {
  const all = readJSON<JasaLainItem[]>(JASA_LAIN_FILE, [])

  if (payload.id) {
    const idx = all.findIndex((i) => String(i.id) === String(payload.id))
    if (idx !== -1) {
      const current = all[idx]
      if (!current) throw createError({ statusCode: 404, statusMessage: 'Service component not found' })
      const updated: JasaLainItem = {
        ...current,
        name: payload.name.trim(),
        harga: Number(payload.harga) || 0,
        minimHarga: Number(payload.minimHarga) || 0,
        satuan: payload.satuan.trim(),
        status: payload.status || current.status || 'Active',
        updatedAt: nowTimestamp()
      }
      all[idx] = updated
      writeJSON(JASA_LAIN_FILE, all)
      return updated
    }
  }

  const newItem: JasaLainItem = {
    id: String(Date.now()),
    name: payload.name.trim(),
    harga: Number(payload.harga) || 0,
    minimHarga: Number(payload.minimHarga) || 0,
    satuan: payload.satuan.trim(),
    status: payload.status || 'Active',
    updatedAt: nowTimestamp()
  }

  all.unshift(newItem)
  writeJSON(JASA_LAIN_FILE, all)
  return newItem
}

export function deleteJasaLainItem(id: string): boolean {
  const all = readJSON<JasaLainItem[]>(JASA_LAIN_FILE, [])
  const filtered = all.filter((i) => String(i.id) !== String(id))
  if (filtered.length !== all.length) {
    writeJSON(JASA_LAIN_FILE, filtered)
    return true
  }
  return false
}

// ----------------------------------------------------
// 2. KOMPONEN MINIMUM
// ----------------------------------------------------
export function getKomponenMinimumList(params?: { search?: string; status?: string }): {
  items: KomponenMinimumItem[]
  stats: { total: number; active: number; deactive: number }
} {
  const all = readJSON<KomponenMinimumItem[]>(KOMPONEN_MINIMUM_FILE, [])
  let filtered = [...all]

  if (params?.status && params.status !== 'All') {
    filtered = filtered.filter((i) => i.status.toLowerCase() === params.status?.toLowerCase())
  }
  if (params?.search) {
    const q = params.search.toLowerCase().trim()
    filtered = filtered.filter((i) => i.name.toLowerCase().includes(q))
  }

  const stats = {
    total: all.length,
    active: all.filter((i) => i.status === 'Active').length,
    deactive: all.filter((i) => i.status === 'Deactive').length
  }

  return { items: filtered, stats }
}

export function saveKomponenMinimumItem(payload: KomponenMinimumFormData): KomponenMinimumItem {
  const all = readJSON<KomponenMinimumItem[]>(KOMPONEN_MINIMUM_FILE, [])

  if (payload.id) {
    const idx = all.findIndex((i) => String(i.id) === String(payload.id))
    if (idx !== -1) {
      const current = all[idx]
      if (!current) throw createError({ statusCode: 404, statusMessage: 'Minimum component not found' })
      const updated: KomponenMinimumItem = {
        ...current,
        name: payload.name.trim(),
        rate: Number(payload.rate) || 0,
        minim: Number(payload.minim) || 0,
        unit: payload.unit.trim(),
        used: payload.used !== undefined ? payload.used : current.used,
        status: payload.status || current.status || 'Active',
        update: nowTimestamp()
      }
      all[idx] = updated
      writeJSON(KOMPONEN_MINIMUM_FILE, all)
      return updated
    }
  }

  const newItem: KomponenMinimumItem = {
    id: String(Date.now()),
    name: payload.name.trim(),
    rate: Number(payload.rate) || 0,
    minim: Number(payload.minim) || 0,
    unit: payload.unit.trim(),
    used: payload.used || 0,
    status: payload.status || 'Active',
    update: nowTimestamp()
  }

  all.unshift(newItem)
  writeJSON(KOMPONEN_MINIMUM_FILE, all)
  return newItem
}

export function deleteKomponenMinimumItem(id: string): boolean {
  const all = readJSON<KomponenMinimumItem[]>(KOMPONEN_MINIMUM_FILE, [])
  const filtered = all.filter((i) => String(i.id) !== String(id))
  if (filtered.length !== all.length) {
    writeJSON(KOMPONEN_MINIMUM_FILE, filtered)
    return true
  }
  return false
}

// ----------------------------------------------------
// 3. KOMPONEN FIKS
// ----------------------------------------------------
export function getKomponenFiksList(params?: { search?: string; status?: string }): {
  items: KomponenFiksItem[]
  stats: { total: number; active: number; deactive: number }
} {
  const all = readJSON<KomponenFiksItem[]>(KOMPONEN_FIKS_FILE, [])
  let filtered = [...all]

  if (params?.status && params.status !== 'All') {
    filtered = filtered.filter((i) => i.status.toLowerCase() === params.status?.toLowerCase())
  }
  if (params?.search) {
    const q = params.search.toLowerCase().trim()
    filtered = filtered.filter((i) => i.name.toLowerCase().includes(q))
  }

  const stats = {
    total: all.length,
    active: all.filter((i) => i.status === 'Active').length,
    deactive: all.filter((i) => i.status === 'Deactive').length
  }

  return { items: filtered, stats }
}

export function saveKomponenFiksItem(payload: KomponenFiksFormData): KomponenFiksItem {
  const all = readJSON<KomponenFiksItem[]>(KOMPONEN_FIKS_FILE, [])

  if (payload.id) {
    const idx = all.findIndex((i) => String(i.id) === String(payload.id))
    if (idx !== -1) {
      const current = all[idx]
      if (!current) throw createError({ statusCode: 404, statusMessage: 'Fixed component not found' })
      const updated: KomponenFiksItem = {
        ...current,
        name: payload.name.trim(),
        value: Number(payload.value) || 0,
        unit: payload.unit.trim(),
        used: payload.used !== undefined ? payload.used : current.used,
        status: payload.status || current.status || 'Active',
        update: nowTimestamp()
      }
      all[idx] = updated
      writeJSON(KOMPONEN_FIKS_FILE, all)
      return updated
    }
  }

  const newItem: KomponenFiksItem = {
    id: String(Date.now()),
    name: payload.name.trim(),
    value: Number(payload.value) || 0,
    unit: payload.unit.trim(),
    used: payload.used || 0,
    status: payload.status || 'Active',
    update: nowTimestamp()
  }

  all.unshift(newItem)
  writeJSON(KOMPONEN_FIKS_FILE, all)
  return newItem
}

export function deleteKomponenFiksItem(id: string): boolean {
  const all = readJSON<KomponenFiksItem[]>(KOMPONEN_FIKS_FILE, [])
  const filtered = all.filter((i) => String(i.id) !== String(id))
  if (filtered.length !== all.length) {
    writeJSON(KOMPONEN_FIKS_FILE, filtered)
    return true
  }
  return false
}

// ----------------------------------------------------
// 4. CETAK FULL COLOR CONFIG
// ----------------------------------------------------
export function getCetakFullColorConfig() {
  return readJSON<import('#server/types/cetak-full-color').CetakFullColorConfig>('cetak-full-color.json')
}

export function saveCetakFullColorConfig(body: Partial<import('#server/types/cetak-full-color').CetakFullColorConfig>) {
  type CetakFullColorConfig = import('#server/types/cetak-full-color').CetakFullColorConfig
  const current = readJSON<CetakFullColorConfig>('cetak-full-color.json')

  const updated: CetakFullColorConfig = {
    ...current,
    ...body,
    logTransactions: current.logTransactions,
  }

  const requiredArrays: Array<keyof CetakFullColorConfig> = [
    'products', 'sizes', 'papers', 'machines', 'laminates', 'folds', 'printSides',
    'components', 'workflowSteps', 'profitTiers', 'logTransactions'
  ]
  for (const key of requiredArrays) {
    if (!Array.isArray(updated[key])) throw createError({ statusCode: 400, statusMessage: `${key} must be an array` })
  }
  for (const tier of updated.profitTiers) {
    if (tier.minQty < 0 || tier.maxQty < tier.minQty || tier.profitPosPercent < 0 || tier.profitWebstorePercent < 0) {
      throw createError({ statusCode: 400, statusMessage: 'Invalid profit tier range or percentage' })
    }
  }
  const money = [
    ...updated.papers.map(item => item.pricePlano),
    ...updated.machines.flatMap(item => [item.plateCost, item.runChargeMin]),
    ...updated.laminates.map(item => item.costPerSide),
    ...updated.folds.map(item => item.costPer1000),
    ...updated.logTransactions.flatMap(item => [item.totalCost, item.sellingPrice]),
  ]
  if (money.some(value => !Number.isFinite(value) || value < 0)) {
    throw createError({ statusCode: 400, statusMessage: 'Monetary values must be non-negative numbers' })
  }

  writeJSON('cetak-full-color.json', updated)
  return updated
}


