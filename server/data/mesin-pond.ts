// Mock data untuk halaman /mesin-pond (dipindah dari app/pages/mesin-pond.vue)
// Dilayani generic CRUD: server/api/[...mock].ts (catch-all)

export const ponds = [
  {
    id: 1,
    sumber: "Percetakan Cahaya Abadi",
    lokasi: "Jakarta Barat",
    avatar: "/assets/img/users/user-23.jpg",
    name: "Mesin Pond PYQ 650",
    maxSize: "650 x 900 mm",
    putusRate: 50,
    putusMinim: 50000,
    kissRate: 100,
    kissMinim: 100000,
    update: "18/10/24 10:00",
  },
  {
    id: 2,
    sumber: "Sinar Digital Printing",
    lokasi: "Surabaya",
    avatar: "/assets/img/users/user-24.jpg",
    name: "Mesin Pond ML900",
    maxSize: "650 x 900 mm",
    putusRate: 50,
    putusMinim: 50000,
    kissRate: 100,
    kissMinim: 100000,
    update: "18/10/24 11:30",
  },
  {
    id: 3,
    sumber: "Mitra Grafika Gemilang",
    lokasi: "Bandung",
    avatar: "/assets/img/users/user-25.jpg",
    name: "Mesin Pond Automatic TYMB",
    maxSize: "750 x 1050 mm",
    putusRate: 65,
    putusMinim: 75000,
    kissRate: 120,
    kissMinim: 120000,
    update: "18/10/24 14:15",
  },
]
