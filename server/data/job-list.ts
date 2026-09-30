// Mock data untuk halaman /job-list (dipindah dari app/pages/job-list.vue)
// Dikonsumsi oleh server/api/job-list.ts

export const flowCategories = [
  { name: 'Design', count: 252 },
  { name: 'Cetak SM 52', count: 15 },
  { name: 'Potong Sisir', count: 210 },
  { name: 'Cetak Outdoor', count: 56 },
  { name: 'Cetak A3+', count: 125 },
  { name: 'Cetak Multilith', count: 137 },
  { name: 'Finishing Komplit', count: 255 },
  { name: 'Sablon Kaos', count: 5 },
  { name: 'Laminating', count: 25 }
]

export const jobs = [
  { id: 1, jobOrderNo: 'JO-000000001', salesDate: '25/12/2025', customer: 'PT Makmur Abadi', product: 'Brosur A5', flow: 'Design', flowType: 'In-House', assignee: 'Bejo', dateComplete: '15/02/2026' },
  { id: 2, jobOrderNo: 'JO-000000002', salesDate: '25/12/2025', customer: 'PT Makmur Abadi', product: 'Brosur A5', flow: 'Cetak SM 52', flowType: 'Outsource', assignee: 'Nurdin', dateComplete: '16/02/2026' },
  { id: 3, jobOrderNo: 'JO-000000003', salesDate: '25/12/2025', customer: 'PT Makmur Abadi', product: 'Brosur A5', flow: 'Potong Sisir', flowType: 'In-House', assignee: 'Rapli', dateComplete: '17/02/2026' },
  { id: 4, jobOrderNo: 'JO-000000004', salesDate: '24/12/2025', customer: 'CV Cahaya Baru', product: 'Spanduk 3x1', flow: 'Cetak Outdoor', flowType: 'In-House', assignee: 'Dani', dateComplete: '18/02/2026' },
  { id: 5, jobOrderNo: 'JO-000000005', salesDate: '23/12/2025', customer: 'Toko Digital Jaya', product: 'Poster A3+', flow: 'Cetak A3+', flowType: 'In-House', assignee: 'Adul', dateComplete: '19/02/2026' }
]
