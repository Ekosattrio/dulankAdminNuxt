// Mock data untuk halaman /kertas-harga (dipindah dari app/pages/kertas-harga.vue)
// Dilayani generic CRUD: server/api/[...mock].ts (catch-all)

export const prices = [
  { id: 1, sumber: 'Percetakan Cepat', lokasi: 'Surabaya, Jawa Timur', avatar: '/assets/img/users/user-23.jpg', nama: 'A4', group: 'HVS Putih', merk: 'Sinar Dunia', ukuran: '21x29.7 cm', satuan: 'rim', gramatur: 80, minOrder: '1 rim', kelipatan: '1 rim', harga: 52000, update: '09/01/2025 10:15' },
  { id: 2, sumber: 'Media Jaya Printing', lokasi: 'Bandung, Jawa Barat', avatar: '/assets/img/users/user-24.jpg', nama: 'Plano 65x100', group: 'Art Paper', merk: 'Pindo Deli', ukuran: '65x100 cm', satuan: 'lembar', gramatur: 150, minOrder: '10 lembar', kelipatan: '10 lembar', harga: 2400, update: '09/01/2025 10:45' },
  { id: 3, sumber: 'Toko Kertas Makmur', lokasi: 'Jakarta Utara, Jakarta', avatar: '/assets/img/users/user-25.jpg', nama: 'Plano 79x109', group: 'Art Carton', merk: 'Golden Coin', ukuran: '79x109 cm', satuan: 'lembar', gramatur: 260, minOrder: '5 lembar', kelipatan: '5 lembar', harga: 4800, update: '09/02/2025 11:20' }
]
