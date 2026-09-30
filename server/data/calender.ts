// Mock data untuk halaman /calender (dipindah dari app/pages/calender.vue)
// Dikonsumsi oleh server/api (catch-all) via mock store.
export const calendarProducts = [
  {
    id: '1',
    name: 'Kalender Meja Dudukan Linen',
    defaultSize: '210x150 mm (Landscape)',
    sheets: '13 Lembar (1 Cover + 12 Bulan)',
    paper: 'Art Carton 230gr',
    binding: 'Spiral Kawat Hitam',
    active: true,
    image: '/assets/img/products/pos-product-10.png'
  },
  {
    id: '2',
    name: 'Kalender Dinding Spiral',
    defaultSize: '380x530 mm',
    sheets: '7 Lembar (1 Cover + 6 Dwi-Wulan)',
    paper: 'Art Paper 150gr',
    binding: 'Spiral Kawat + Hanger',
    active: true,
    image: '/assets/img/products/pos-product-01.png'
  },
  {
    id: '3',
    name: 'Kalender Dinding Klemseng',
    defaultSize: '380x530 mm',
    sheets: '4 Lembar (Triwulan)',
    paper: 'HVS 80gr',
    binding: 'Jepit Kaleng (Klemseng)',
    active: true,
    image: '/assets/img/products/pos-product-03.png'
  },
  {
    id: '4',
    name: 'Kalender Poster 1 Lembar',
    defaultSize: '460x640 mm',
    sheets: '1 Lembar Plano',
    paper: 'Art Carton 260gr',
    binding: 'Mata Ikan / Bolong Atas',
    active: true,
    image: '/assets/img/products/brosur.png'
  }
]
export const calendarSizes = [
  { id: '1', name: 'Desk Landscape 21x15', widthMm: 210, heightMm: 150, type: 'Meja' },
  { id: '2', name: 'Desk Portrait 15x21', widthMm: 150, heightMm: 210, type: 'Meja' },
  { id: '3', name: 'Wall Standard 38x53', widthMm: 380, heightMm: 530, type: 'Dinding' },
  { id: '4', name: 'Wall Jumbo 46x64', widthMm: 460, heightMm: 640, type: 'Dinding' },
  { id: '5', name: 'Wall Super Jumbo 50x70', widthMm: 500, heightMm: 700, type: 'Dinding' }
]
export const finishings = [
  { id: '1', name: 'Spiral Kawat Ring Hitam / Putih', costPerUnit: 2500 },
  { id: '2', name: 'Jepit Kaleng Seng (Klemseng) 38cm', costPerUnit: 1200 },
  { id: '3', name: 'Jepit Kaleng Seng (Klemseng) 46cm', costPerUnit: 1600 },
  { id: '4', name: 'Mata Ikan (Eyelet) + Tali Gantungan', costPerUnit: 500 },
  { id: '5', name: 'Laminasi Doff Cover Kalender', costPerUnit: 1500 }
]
export const boards = [
  { id: '1', name: 'Hardboard No. 30 Tebal (Dudukan)', price: 3500 },
  { id: '2', name: 'Hardboard No. 40 Standar (Dudukan)', price: 2800 },
  { id: '3', name: 'Linen Wrapping Sheet (Cover Dudukan)', price: 1500 },
  { id: '4', name: 'Kawat Hanger 38cm', price: 800 }
]
export const calendarLogs = [
  { id: '1', date: '04/12/2025', client: 'Bank Mandiri Karawang', desc: 'Kalender Meja 13 Lbr 210x150', qty: 1000, price: 18500000 },
  { id: '2', date: '02/12/2025', client: 'RSUD Karawang', desc: 'Kalender Dinding Spiral 38x53 7 Lbr', qty: 2000, price: 32000000 },
  { id: '3', date: '28/11/2025', client: 'PT Toyota Motor', desc: 'Kalender Meja Hardcover Exclusive', qty: 500, price: 12500000 }
]
