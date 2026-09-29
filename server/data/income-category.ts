// Mock data untuk halaman /income-category (dipindah dari app/pages/income-category.vue)
// Dikonsumsi oleh server/api/income-category.ts

export const categories = [
  { id: 1, no: 'INC001', name: 'Penjualan Jasa Cetak', description: 'Pemasukan dari layanan cetak utama (Offset, Digital, Large Format).', status: 'Active', created: '25/11/2025 15:45, Admin' },
  { id: 2, no: 'INC002', name: 'Penjualan Limbah Kertas', description: 'Pendapatan dari penjualan sisa potongan atau limbah kertas produksi ke pengepul.', status: 'Active', created: '25/11/2025 15:50, Admin' },
  { id: 3, no: 'INC003', name: 'Jasa Desain', description: 'Pemasukan dari layanan desain grafis terpisah atau layout dokumen.', status: 'Active', created: '26/11/2025 09:10, Budi' },
  { id: 4, no: 'INC004', name: 'Penjualan Plat Offset Bekas', description: 'Pendapatan dari penjualan plat cetak offset yang sudah tidak terpakai (bekas) ke pengepul.', status: 'Active', created: '26/11/2025 10:30, Admin' }
]
