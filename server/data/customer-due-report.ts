// Mock data untuk halaman /customer-due-report (dipindah dari app/pages/customer-due-report.vue)
// Dikonsumsi oleh server/api (catch-all) via mock store.
export const dues = [
  { name: 'PT. Sinar Abadi', orderDue: 3, amountDue: 12500000, daysDue: '15 Days' },
  { name: 'Universitas Terbuka', orderDue: 1, amountDue: 8200000, daysDue: '5 Days' },
  { name: 'CV. Maju Jaya', orderDue: 5, amountDue: 3450000, daysDue: '0 Days' },
  { name: 'Yayasan Pendidikan Islam', orderDue: 2, amountDue: 4750000, daysDue: '12 Days' },
  { name: 'Resto Sedap Malam', orderDue: 4, amountDue: 2150000, daysDue: '3 Days' }
]
