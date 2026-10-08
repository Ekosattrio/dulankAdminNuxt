import { readData, writeData } from '~/server/utils/data'
import type { PrefixItem, PrefixFormData } from '~/types/system-settings'

export default defineEventHandler(async (event) => {
  const body = await readBody<PrefixFormData | PrefixItem[] | Record<string, string>>(event)
  const items = readData<PrefixItem>('prefixes.json')
  const now = new Date().toISOString().split('T')[0]

  // Case 1: Body is an Array of PrefixItem
  if (Array.isArray(body)) {
    const updatedList: PrefixItem[] = body.map((item, idx) => ({
      ...item,
      id: item.id || `PRF-${String(idx + 1).padStart(2, '0')}`,
      updatedAt: now,
    }))
    writeData('prefixes.json', updatedList)
    return {
      success: true,
      data: updatedList,
      message: 'Semua prefix transaksi berhasil disimpan.',
    }
  }

  // Case 2: Body is a single PrefixItem/PrefixFormData with 'key' or 'id'
  if (body && typeof body === 'object' && ('key' in body || 'prefix' in body)) {
    const single = body as PrefixFormData
    if (single.id) {
      const idx = items.findIndex((p) => p.id === single.id)
      if (idx !== -1 && items[idx]) {
        const existing = items[idx]!
        const updatedItem: PrefixItem = {
          ...existing,
          ...single,
          id: existing.id,
          key: single.key || existing.key,
          name: single.name || existing.name,
          prefix: single.prefix || existing.prefix,
          updatedAt: now,
        }
        items[idx] = updatedItem
        writeData('prefixes.json', items)
        return {
          success: true,
          data: updatedItem,
          message: `Prefix '${updatedItem.name}' berhasil diperbarui.`,
        }
      }
    }

    if (single.key) {
      const idx = items.findIndex((p) => p.key === single.key)
      if (idx !== -1 && items[idx]) {
        const existing = items[idx]!
        const updatedItem: PrefixItem = {
          ...existing,
          ...single,
          id: existing.id,
          key: existing.key,
          name: single.name || existing.name,
          prefix: single.prefix || existing.prefix,
          updatedAt: now,
        }
        items[idx] = updatedItem
        writeData('prefixes.json', items)
        return {
          success: true,
          data: updatedItem,
          message: `Prefix '${updatedItem.name}' berhasil diperbarui.`,
        }
      }
    }

    // Add new prefix item
    const nextId = `PRF-${String(items.length + 1).padStart(2, '0')}`
    const prefixVal = single.prefix || ''
    const newItem: PrefixItem = {
      id: nextId,
      key: single.key || `custom_${Date.now()}`,
      name: single.name || single.key || 'Custom Prefix',
      prefix: prefixVal,
      format: single.format || `${prefixVal}{YYYY}{MM}-{SEQ:4}`,
      sample: single.sample || `${prefixVal}0001`,
      description: single.description || '',
      updatedAt: now,
    }
    items.push(newItem)
    writeData('prefixes.json', items)
    return {
      success: true,
      data: newItem,
      message: `Prefix '${newItem.name}' berhasil ditambahkan.`,
    }
  }

  // Case 3: Body is a key-value map like { invoice: "INV-", sales_order: "SO-" }
  if (body && typeof body === 'object') {
    const map = body as Record<string, string>
    items.forEach((item) => {
      const val = map[item.key]
      if (val !== undefined) {
        item.prefix = val
        item.updatedAt = now
      }
    })
    writeData('prefixes.json', items)
    return {
      success: true,
      data: items,
      message: 'Prefix dokumen berhasil diperbarui.',
    }
  }

  return {
    success: true,
    data: items,
  }
})
