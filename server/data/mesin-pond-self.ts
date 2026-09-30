// Mock data untuk halaman /mesin-pond-self (dipindah dari app/pages/mesin-pond-self.vue)
// Dilayani generic CRUD: server/api/[...mock].ts (catch-all)

export const ponds = [
  {
    id: 1,
    name: "PYQ 650",
    maxSize: "650 x 900 mm",
    putusRate: 50,
    putusMinim: 50000,
    kissRate: 100,
    kissMinim: 100000,
    update: "20/12/24 23:12",
    status: "Active",
  },
  {
    id: 2,
    name: "ML900 Platen",
    maxSize: "650 x 900 mm",
    putusRate: 50,
    putusMinim: 50000,
    kissRate: 100,
    kissMinim: 100000,
    update: "20/12/24 23:12",
    status: "Active",
  },
  {
    id: 3,
    name: "PYQ 660 Heavy Duty",
    maxSize: "750 x 1050 mm",
    putusRate: 65,
    putusMinim: 75000,
    kissRate: 120,
    kissMinim: 120000,
    update: "20/12/24 23:12",
    status: "Deactive",
  },
]
