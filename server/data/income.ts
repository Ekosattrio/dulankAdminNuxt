// Mock data untuk halaman /income (dipindah dari app/pages/income.vue)
// Dilayani generic CRUD: server/api/[...mock].ts (catch-all)

export const incomes = [
  { id: 1, date: '01/11/2025', no: 'IN000001', name: 'Budi Santoso', category: 'Penjualan Jasa Cetak', notes: 'Pembayaran lunas cetak brosur 1000 pcs.', amount: 1000000, paymentMethod: 'Transfer Bank', bankAccount: 'Mandiri 1320009982282' },
  { id: 2, date: '03/11/2025', no: 'IN000002', name: 'Siti Nurhaliza', category: 'Biaya Pengiriman', notes: 'Pemasukan biaya kirim pesanan urgent.', amount: 150000, paymentMethod: 'Tunai / Cash', bankAccount: '-' },
  { id: 3, date: '05/11/2025', no: 'IN000003', name: 'Ahmad Wijaya', category: 'Jasa Desain', notes: 'Pembayaran desain kartu nama & logo.', amount: 350000, paymentMethod: 'Transfer Bank', bankAccount: 'BCA 8830129841' },
  { id: 4, date: '07/11/2025', no: 'IN000004', name: 'Rina Puspita', category: 'Penjualan Limbah Kertas', notes: 'Penjualan kertas scrap bulan Oktober.', amount: 600000, paymentMethod: 'Tunai / Cash', bankAccount: '-' },
  { id: 5, date: '09/11/2025', no: 'IN000005', name: 'Hendra Kusuma', category: 'Penjualan Jasa Cetak', notes: 'Pelunasan cetak banner outdoor.', amount: 880000, paymentMethod: 'Transfer Bank', bankAccount: 'BCA 8830129841' },
  { id: 6, date: '30/11/2025', no: 'IN000012', name: 'Lina Wijaya', category: 'Penjualan Plat Offset Bekas', notes: 'Penjualan 20 kg plat bekas.', amount: 180000, paymentMethod: 'Tunai / Cash', bankAccount: '-' },
  { id: 7, date: '03/12/2025', no: 'IN000013', name: 'Syahrul Ramadan', category: 'Biaya Pengiriman', notes: 'Biaya handling pengiriman ekspres.', amount: 220000, paymentMethod: 'Transfer Bank', bankAccount: 'Mandiri 1320009982282' },
  { id: 8, date: '06/12/2025', no: 'IN000014', name: 'Dina Melati', category: 'Penjualan Jasa Cetak', notes: 'Pelunasan cetak kartu nama.', amount: 100000, paymentMethod: 'QRIS', bankAccount: 'BCA QRIS' },
  { id: 9, date: '09/12/2025', no: 'IN000015', name: 'Tono Setiawan', category: 'Jasa Desain', notes: 'Revisi desain klien lama.', amount: 400000, paymentMethod: 'Transfer Bank', bankAccount: 'BCA 8830129841' },
  { id: 10, date: '12/12/2025', no: 'IN000016', name: 'Ani Kusuma', category: 'Penjualan Limbah Kertas', notes: 'Penjualan trimming HVS.', amount: 850000, paymentMethod: 'Tunai / Cash', bankAccount: '-' },
  { id: 11, date: '15/12/2025', no: 'IN000017', name: 'Arif Handoko', category: 'Penjualan Jasa Cetak', notes: 'Pelunasan invoice cetak nota NCR.', amount: 680000, paymentMethod: 'Transfer Bank', bankAccount: 'Mandiri 1320009982282' },
  { id: 12, date: '18/12/2025', no: 'IN000018', name: 'Retno Kumala', category: 'Penjualan Plat Offset Bekas', notes: '-', amount: 250000, paymentMethod: 'Tunai / Cash', bankAccount: '-' },
  { id: 13, date: '21/12/2025', no: 'IN000019', name: 'Bambang Sutejo', category: 'Biaya Pengiriman', notes: 'Pemasukan biaya kirim melalui jasa ojek online.', amount: 110000, paymentMethod: 'Tunai / Cash', bankAccount: '-' },
  { id: 14, date: '24/12/2025', no: 'IN000020', name: 'Diana Sefti', category: 'Jasa Desain', notes: 'Pembayaran desain kalender 2026.', amount: 1150000, paymentMethod: 'Transfer Bank', bankAccount: 'BCA 8830129841' }
]
