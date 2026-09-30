// Mock data untuk halaman /job-branch (dipindah dari app/pages/job-branch.vue)
// Dilayani generic CRUD: server/api/[...mock].ts (catch-all)

export const jobs = [
  { id: 1, jobNo: 'JOB-2510000001', branch: 'Dulank Karawang', customer: 'PT Makmur Abadi', product: 'Brosur A5', flowName: 'Cetak Multilith', priority: 'High', status: 'Waiting' },
  { id: 2, jobNo: 'JOB-2510000002', branch: 'Dulank Jakarta', customer: 'PT Makmur Abadi', product: 'Spanduk 3x1', flowName: 'Cetak Outdoor', priority: 'Urgent', status: 'On Process' },
  { id: 3, jobNo: 'JOB-2510000003', branch: 'Dulank Cirebon', customer: 'PT Makmur Abadi', product: 'Kartu Nama', flowName: 'Print A3', priority: 'Reguler', status: 'On Process' },
  { id: 4, jobNo: 'JOB-2510000004', branch: 'Dulank Karawang', customer: 'CV Cahaya Baru', product: 'Kwitansi NCR', flowName: 'Cetak Multilith', priority: 'High', status: 'Waiting' },
  { id: 5, jobNo: 'JOB-2510000005', branch: 'Dulank Karawang', customer: 'CV Cahaya Baru', product: 'Poster Display', flowName: 'Print A3', priority: 'Urgent', status: 'Waiting' }
]
