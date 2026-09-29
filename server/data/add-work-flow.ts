// Mock data untuk halaman /add-work-flow (dipindah dari app/pages/add-work-flow.vue)
// Dikonsumsi oleh server/api/add-work-flow.ts

export const flowSteps = [
  { id: '1', name: 'Artwork Checking', category: 'Design', selected: true, template: 'Standard Ready Print' },
  { id: '2', name: 'Layout & Imposition', category: 'Design', selected: true, template: 'Preps 8 Imposition' },
  { id: '3', name: 'Plate CTP (Thermal)', category: 'Pracetak', selected: true, template: 'SM52 4 Warna (4 Plat)' },
  { id: '4', name: 'Potong Kertas Plano (Sheeting)', category: 'Pracetak', selected: true, template: 'Potong Ukuran Mesin 37x52' },
  { id: '5', name: 'Cetak Mesin SM 52', category: 'Cetak', selected: true, template: 'SM52 4/0 Full Color' },
  { id: '6', name: 'Cetak Mesin Oliver 58', category: 'Cetak', selected: false, template: '1 Warna Spot' },
  { id: '7', name: 'Laminasi Doff 1 Sisi', category: 'Finishing', selected: false, template: 'Thermal Doff' },
  { id: '8', name: 'Potong Jadi (Final Trimming)', category: 'Finishing', selected: true, template: 'Potong Siku Presisi' },
  { id: '9', name: 'Lipatan Brosur (Folding)', category: 'Finishing', selected: true, template: 'Lipat 2 (Half Fold)' },
  { id: '10', name: 'Sortir & Quality Check', category: 'Finishing', selected: true, template: 'Inspeksi Standar' },
  { id: '11', name: 'Packing & Shrink Wrap', category: 'Finishing', selected: true, template: 'Kardus Dulank' }
]
