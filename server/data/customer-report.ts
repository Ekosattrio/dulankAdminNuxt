// Mock data untuk halaman /customer-report (dipindah dari app/pages/customer-report.vue)
// Dikonsumsi oleh server/api (catch-all) via mock store.
export const customers = [
  { name: 'CV. Maju Jaya', totalOrder: 45, amount: 67500000, avgLeadTime: '3 Days' },
  { name: 'Toko Berkah', totalOrder: 38, amount: 12400000, avgLeadTime: '2 Days' },
  { name: 'Bpk. Heru', totalOrder: 12, amount: 4500000, avgLeadTime: '1 Days' },
  { name: 'PT. Sinar Abadi', totalOrder: 30, amount: 85000000, avgLeadTime: '5 Days' },
  { name: 'Universitas Terbuka', totalOrder: 15, amount: 42000000, avgLeadTime: '7 Days' },
  { name: 'Yayasan Pendidikan Islam', totalOrder: 22, amount: 18750000, avgLeadTime: '4 Days' },
  { name: 'Resto Sedap Malam', totalOrder: 55, amount: 9350000, avgLeadTime: '2 Days' }
]
