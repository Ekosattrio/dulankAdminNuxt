// Mock data untuk halaman /bank-settings-grid (dipindah dari app/pages/bank-settings-grid.vue)
// Dikonsumsi oleh server/api/bank-settings-grid.ts

export const accounts = [
  { id: 1, bankName: 'Bank BCA', accountNo: '**** **** 1982', holderName: 'PT Kacetak Digital', branch: 'Jakarta', isDefault: true },
  { id: 2, bankName: 'Bank Mandiri', accountNo: '**** **** 1796', holderName: 'PT Kacetak Digital', branch: 'Bandung', isDefault: false },
  { id: 3, bankName: 'Bank BNI', accountNo: '**** **** 1832', holderName: 'PT Kacetak Digital', branch: 'Surabaya', isDefault: false }
]
