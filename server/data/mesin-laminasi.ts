// Mock data untuk halaman /mesin-laminasi (dipindah dari app/pages/mesin-laminasi.vue)
// Dikonsumsi oleh server/api/mesin-laminasi.ts

export const laminates = [
  {
    id: 1,
    sumber: "Percetakan Cahaya Abadi",
    lokasi: "Jakarta Barat",
    avatar: "/assets/img/users/user-23.jpg",
    name: "Laminasi Thermal Doff 1 Sisi",
    maxSize: "65 x 100 cm",
    rateCm: 22,
    minim: 220000,
    update: "12/10/24 10:00",
  },
  {
    id: 2,
    sumber: "Sinar Digital Printing",
    lokasi: "Surabaya",
    avatar: "/assets/img/users/user-24.jpg",
    name: "Laminasi Thermal Glossy 1 Sisi",
    maxSize: "65 x 100 cm",
    rateCm: 20,
    minim: 200000,
    update: "12/10/24 11:30",
  },
  {
    id: 3,
    sumber: "Mitra Grafika Gemilang",
    lokasi: "Bandung",
    avatar: "/assets/img/users/user-25.jpg",
    name: "UV Varnish Coating",
    maxSize: "72 x 102 cm",
    rateCm: 12,
    minim: 120000,
    update: "12/10/24 14:15",
  },
  {
    id: 4,
    sumber: "Aneka Surya Offset",
    lokasi: "Semarang",
    avatar: "/assets/img/users/user-26.jpg",
    name: "Spot UV Screen",
    maxSize: "52 x 72 cm",
    rateCm: 35,
    minim: 300000,
    update: "12/10/24 16:00",
  },
]
