// Mock data untuk halaman /bank-settings-list (dipindah dari app/pages/bank-settings-list.vue)
// Dikonsumsi oleh server/api/bank-settings-list.ts

export const accounts = [
  { id: 1, bankName: 'Bank BCA', accountNo: '**** **** 1982', holderName: 'PT Kacetak Digital', branch: 'Jakarta', isDefault: true, createdOn: '12 Jul 2023' },
  { id: 2, bankName: 'Bank Mandiri', accountNo: '**** **** 1796', holderName: 'PT Kacetak Digital', branch: 'Bandung', isDefault: false, createdOn: '17 Aug 2023' },
  { id: 3, bankName: 'Bank BNI', accountNo: '**** **** 1832', holderName: 'PT Kacetak Digital', branch: 'Surabaya', isDefault: false, createdOn: '08 Sep 2023' }
]
