// Mock data untuk halaman /mesin-poli (dipindah dari app/pages/mesin-poli.vue)
// Dilayani generic CRUD: server/api/[...mock].ts (catch-all)

export const polis = [
  {
    id: 1,
    sumber: "Percetakan Cahaya Abadi",
    lokasi: "Jakarta Barat",
    avatar: "/assets/img/users/user-23.jpg",
    name: "Poly Emas Standard (Gold Foil)",
    maxSize: "30×20 cm",
    rateCm: 25,
    minim: 250000,
    update: "14/10/24 10:00",
  },
  {
    id: 2,
    sumber: "Sinar Digital Printing",
    lokasi: "Surabaya",
    avatar: "/assets/img/users/user-24.jpg",
    name: "Poly Perak (Silver Foil)",
    maxSize: "30×20 cm",
    rateCm: 22,
    minim: 220000,
    update: "14/10/24 11:30",
  },
  {
    id: 3,
    sumber: "Mitra Grafika Gemilang",
    lokasi: "Bandung",
    avatar: "/assets/img/users/user-25.jpg",
    name: "Hologram Hot Stamp Foil",
    maxSize: "25×15 cm",
    rateCm: 40,
    minim: 350000,
    update: "14/10/24 14:15",
  },
]
