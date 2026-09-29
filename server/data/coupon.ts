// Mock data untuk halaman /coupon (dipindah dari app/pages/coupon.vue)
// Dikonsumsi oleh server/api/coupon.ts

export const coupons = [
  { id: 1, name: 'Coupons 21', code: 'Christmas', type: 'Fixed', discount: 20000, limit: 40, used: 12, valid: '04 Jan 2026', status: 'Active' },
  { id: 2, name: 'First Offer', code: 'WELCOME10', type: 'Percentage', discount: 10, limit: 100, used: 45, valid: '15 Feb 2026', status: 'Active' },
  { id: 3, name: 'Offer 40', code: 'BULK40', type: 'Fixed', discount: 40000, limit: 25, used: 20, valid: '08 Apr 2026', status: 'Active' },
  { id: 4, name: 'Subscription Discount', code: 'PROSUB', type: 'Percentage', discount: 15, limit: 50, used: 10, valid: '31 Dec 2026', status: 'Active' }
]
