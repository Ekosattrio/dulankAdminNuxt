// Mock data untuk halaman /bank-account (dipindah dari app/pages/bank-account.vue)
// Dikonsumsi oleh server/api (catch-all) via mock store.
export const accounts = [
  { id: 1, accountName: 'PT Dulank Semesta Cida', bankName: 'Bank Mandiri', accountNo: '1230009876543', balance: 5500000, status: 'Active' },
  { id: 2, accountName: 'Cecep Sudirman', bankName: 'Bank BCA', accountNo: '4567891230', balance: 2100000, status: 'Active' },
  { id: 3, accountName: 'PT Dulank Semesta Cida', bankName: 'Bank BNI', accountNo: '876543210123', balance: 8250000, status: 'Active' },
  { id: 4, accountName: 'Cecep Sudirman', bankName: 'Bank BRI', accountNo: '1020304050607', balance: 2000000, status: 'Closed' }
]
