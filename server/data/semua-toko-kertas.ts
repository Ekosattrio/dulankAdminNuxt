// Mock data untuk halaman /semua-toko-kertas (dipindah dari app/pages/semua-toko-kertas.vue)
// Dikonsumsi oleh server/api/semua-toko-kertas.ts

export const shops = [
  {
    id: 1,
    name: "Toko Kertasindo",
    avatar: "/assets/img/users/user-23.jpg",
    address: "Jakarta, Jakarta Pusat, Kemayoran",
    joinDate: "15/12/2025",
    subscribed: true,
    counts: { kertas: 117, group: 114, ukuran: 197, jenis: 4 },
  },
  {
    id: 2,
    name: "Toko Paperindo",
    avatar: "/assets/img/users/user-24.jpg",
    address: "Bandung, Jawa Barat",
    joinDate: "15/12/2025",
    subscribed: true,
    counts: { kertas: 92, group: 95, ukuran: 65, jenis: 3 },
  },
  {
    id: 3,
    name: "Surabaya Kertas Utama",
    avatar: "/assets/img/users/user-31.jpg",
    address: "Surabaya, Jawa Timur, Rungkut",
    joinDate: "01/02/2025",
    subscribed: true,
    counts: { kertas: 145, group: 120, ukuran: 210, jenis: 5 },
  },
]
