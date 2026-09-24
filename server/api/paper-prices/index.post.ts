import { readData, writeData } from '~/server/utils/data'
import type { PaperPrice } from '~/types/paper-price'

export default defineEventHandler(async (event) => {
  const body = await readBody<Partial<PaperPrice>>(event)
  const items = readData<PaperPrice>('paper-prices.json')

  const nowFormatted = new Date().toLocaleString('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).replace(/\./g, ':')

  if (body.id) {
    const index = items.findIndex((p) => String(p.id) === String(body.id))
    if (index !== -1) {
      items[index] = {
        ...items[index],
        ...body,
        gramatur: Number(body.gramatur ?? items[index].gramatur),
        harga: Number(body.harga ?? items[index].harga),
        update: nowFormatted
      } as PaperPrice
      writeData('paper-prices.json', items)
      return { success: true, data: items[index], message: 'Paper price updated successfully' }
    }
  }

  const newPrice: PaperPrice = {
    id: Date.now().toString(),
    nama: body.nama || '',
    group: body.group || 'HVS Putih',
    merk: body.merk || '-',
    ukuran: body.ukuran || '-',
    satuan: body.satuan || 'lembar',
    gramatur: Number(body.gramatur || 80),
    minOrder: body.minOrder || '1 lembar',
    kelipatan: body.kelipatan || '1 lembar',
    harga: Number(body.harga || 0),
    update: nowFormatted,
    status: body.status || 'Active'
  }

  items.unshift(newPrice)
  writeData('paper-prices.json', items)

  return {
    success: true,
    data: newPrice,
    message: 'Paper price created successfully'
  }
})

