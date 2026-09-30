// Mock data untuk halaman /semua-percetakan (dipindah dari app/pages/semua-percetakan.vue)
// Dilayani generic CRUD: server/api/[...mock].ts (catch-all)

export const vendors = [
  {
    id: 1,
    name: "Percetakan Cahaya Abadi",
    avatar: "/assets/img/users/user-23.jpg",
    address: "Jakarta, Jakarta Barat, Palmerah",
    joinDate: "01/05/2025",
    subscribed: true,
    whatsapp: "081234567890",
    counts: { kertas: 150, cetak: 6, laminasi: 3, pond: 5, poli: 9 },
    capabilities: ["Berat Kertas", "Potong Kertas"],
  },
  {
    id: 2,
    name: "Sinar Digital Printing",
    avatar: "/assets/img/users/user-24.jpg",
    address: "Surabaya, Jawa Timur, Gubeng",
    joinDate: "10/03/2025",
    subscribed: true,
    whatsapp: "085678901234",
    counts: { kertas: 98, cetak: 4, laminasi: 2, pond: 3, poli: 7 },
    capabilities: ["Percetakan"],
  },
  {
    id: 3,
    name: "Bandung Offset Cemerlang",
    avatar: "/assets/img/users/user-31.jpg",
    address: "Bandung, Jawa Barat, Asia Afrika",
    joinDate: "28/07/2024",
    subscribed: true,
    whatsapp: "089678901234",
    counts: { kertas: 140, cetak: 6, laminasi: 2, pond: 5, poli: 7 },
    capabilities: ["Berat Kertas", "Pond", "Poli"],
  },
  {
    id: 4,
    name: "Percetakan Utama Selindo",
    avatar: "/assets/img/users/user-31.jpg",
    address: "Jakarta, Jakarta Timur, Jatinegara",
    joinDate: "17/09/2025",
    subscribed: true,
    whatsapp: "081598765432",
    counts: { kertas: 115, cetak: 5, laminasi: 3, pond: 4, poli: 6 },
    capabilities: ["Percetakan"],
  },
]
