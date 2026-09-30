// Mock data untuk halaman /checkout (dipindah dari app/pages/checkout.vue)
// Dilayani generic CRUD: server/api/[...mock].ts (catch-all)

export const checkouts = [
  { id: 1, user: 'john.doe@email.com', date: '2025-09-29', amount: 550000, method: 'Kartu Kredit', status: 'Berhasil', voucher: 'DISKON10', deliveryFee: 20000, details: 'Cetak Brosur A4 (500), Kartu Nama (2 box)' },
  { id: 2, user: 'jane.smith@email.com', date: '2025-09-29', amount: 170000, method: 'Transfer Bank', status: 'Berhasil', voucher: '-', deliveryFee: 15000, details: 'Sticker Vinyl Cutting A3+ (10 lembar)' },
  { id: 3, user: 'david.williams@email.com', date: '2025-09-28', amount: 255000, method: 'E-Wallet', status: 'Berhasil', voucher: '-', deliveryFee: 18000, details: 'Buku Yasin Softcover (50 pcs)' },
  { id: 4, user: 'sarah.jones@email.com', date: '2025-09-27', amount: 1200000, method: 'Kartu Kredit', status: 'Gagal', voucher: 'PROMO20', deliveryFee: 0, details: 'Hardbox Souvenir Custom Foil Emas (100 pcs)' },
  { id: 5, user: 'michael.brown@email.com', date: '2025-09-27', amount: 300000, method: 'Virtual Account', status: 'Berhasil', voucher: '-', deliveryFee: 25000, details: 'Spanduk Outdoor Flexi 280g 3x1m (2)' },
  { id: 6, user: 'emily.davis@email.com', date: '2025-09-26', amount: 85000, method: 'E-Wallet', status: 'Berhasil', voucher: 'CUAN5', deliveryFee: 12000, details: 'Print HVS Warna A4 Tugas Akhir (1 jilid)' },
  { id: 7, user: 'chris.wilson@email.com', date: '2025-09-26', amount: 450000, method: 'Transfer Bank', status: 'Berhasil', voucher: '-', deliveryFee: 20000, details: 'Kalender Meja Dudukan Linen (25 pcs)' }
]
