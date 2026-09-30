// Mock data untuk halaman /kertas-jenis (dipindah dari app/pages/kertas-jenis.vue)
// Dilayani generic CRUD: server/api/[...mock].ts (catch-all)

export const paperTypes = [
  { id: 1, sumber: 'Percetakan Cepat', lokasi: 'Surabaya, Jawa Timur', avatar: '/assets/img/users/user-23.jpg', group: 'HVS Putih', merk: 'Sinar Dunia', ukuran: '21x29.7', satuan: 'cm', gramatur: 80, update: '09/01/2025 10:15' },
  { id: 2, sumber: 'Media Jaya Printing', lokasi: 'Bandung, Jawa Barat', avatar: '/assets/img/users/user-24.jpg', group: 'Art Paper', merk: 'Pindo Deli', ukuran: '65x100', satuan: 'cm', gramatur: 150, update: '09/01/2025 10:45' },
  { id: 3, sumber: 'Toko Kertas Makmur', lokasi: 'Jakarta Utara, Jakarta', avatar: '/assets/img/users/user-25.jpg', group: 'Art Carton', merk: 'Golden Coin', ukuran: '79x109', satuan: 'cm', gramatur: 260, update: '09/02/2025 11:20' },
  { id: 4, sumber: 'Gudang Grafika Utama', lokasi: 'Semarang, Jawa Tengah', avatar: '/assets/img/users/user-26.jpg', group: 'Ivory', merk: 'Sinar Mas', ukuran: '65x90', satuan: 'cm', gramatur: 310, update: '09/03/2025 14:10' }
]
