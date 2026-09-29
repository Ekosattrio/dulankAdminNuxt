// Mock data untuk halaman /mesin-poli-self (dipindah dari app/pages/mesin-poli-self.vue)
// Dikonsumsi oleh server/api/mesin-poli-self.ts

export const polis = [
  {
    id: 1,
    name: "Poly Emas Standard (Gold)",
    maxSize: "30×15 cm",
    rateCm: 20,
    minim: 200000,
    update: "20/12/24 23:12",
    status: "Active",
  },
  {
    id: 2,
    name: "Poly Perak (Silver)",
    maxSize: "30×15 cm",
    rateCm: 18,
    minim: 180000,
    update: "20/12/24 23:12",
    status: "Active",
  },
  {
    id: 3,
    name: "Hologram Hot Stamp",
    maxSize: "30×15 cm",
    rateCm: 35,
    minim: 300000,
    update: "20/12/24 23:12",
    status: "Deactive",
  },
  {
    id: 4,
    name: "Rose Gold Metallic",
    maxSize: "30×20 cm",
    rateCm: 28,
    minim: 250000,
    update: "22/12/24 14:00",
    status: "Active",
  },
]
