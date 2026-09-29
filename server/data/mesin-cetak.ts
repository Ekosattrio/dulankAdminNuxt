// Mock data untuk halaman /mesin-cetak (dipindah dari app/pages/mesin-cetak.vue)
// Dikonsumsi oleh server/api/mesin-cetak.ts

export const machines = [
  {
    id: 1,
    sumber: "Percetakan Cahaya Abadi",
    lokasi: "Jakarta Barat, Jakarta",
    avatar: "/assets/img/users/user-23.jpg",
    name: "Heidelberg Speedmaster SM 74",
    colors: 4,
    minim: 350000,
    druck: 85,
    update: "15/09/24 10:30",
  },
  {
    id: 2,
    sumber: "Sinar Digital Printing",
    lokasi: "Surabaya, Jawa Timur",
    avatar: "/assets/img/users/user-24.jpg",
    name: "Komori Lithrone L-528",
    colors: 5,
    minim: 420000,
    druck: 95,
    update: "22/09/24 15:45",
  },
  {
    id: 3,
    sumber: "Mitra Grafika Gemilang",
    lokasi: "Bandung, Jawa Barat",
    avatar: "/assets/img/users/user-25.jpg",
    name: "Heidelberg GTO 52",
    colors: 2,
    minim: 180000,
    druck: 60,
    update: "28/09/24 11:15",
  },
  {
    id: 4,
    sumber: "Aneka Surya Offset",
    lokasi: "Semarang, Jawa Tengah",
    avatar: "/assets/img/users/user-26.jpg",
    name: "Ryobi 524 HE",
    colors: 4,
    minim: 280000,
    druck: 75,
    update: "05/10/24 09:20",
  },
]
