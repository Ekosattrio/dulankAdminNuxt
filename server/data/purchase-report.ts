// Mock data untuk halaman /purchase-report (dipindah dari app/pages/purchase-report.vue)
// Dikonsumsi oleh server/api (catch-all) via mock store.
export const rows = [
  {
    category: "Kertas & Bahan Baku Cetak",
    qty: 50,
    unit: "Rim",
    total: 35000000,
    due: 5000000,
    amount: 30000000,
    percentage: "39.71",
    items: [
      { name: "Art Paper 150gr Plano", qty: 30, cost: 21000000 },
      { name: "HVS 80gr Plano", qty: 20, cost: 14000000 },
    ],
  },
  {
    category: "Tinta & Toner (Ink/Toner)",
    qty: 20,
    unit: "Set",
    total: 22000000,
    due: 2000000,
    amount: 20000000,
    percentage: "26.47",
    items: [
      { name: "Tinta Offset Cyan/Magenta/Yellow/Black", qty: 15, cost: 16500000 },
      { name: "Toner Konica Minolta Cyan", qty: 5, cost: 5500000 },
    ],
  },
  {
    category: "Bahan Sticker & Vinyl",
    qty: 15,
    unit: "Roll",
    total: 16500000,
    due: 3253000,
    amount: 13247000,
    percentage: "17.53",
    items: [
      { name: "Vinyl Ritrama Glossy 1.26m", qty: 10, cost: 11000000 },
      { name: "Sticker Kromo Camel", qty: 5, cost: 5500000 },
    ],
  },
  {
    category: "Bahan Display (Banner/X-Banner)",
    qty: 100,
    unit: "Pcs",
    total: 8000000,
    due: 1000000,
    amount: 7000000,
    percentage: "9.27",
    items: [
      { name: "Stand X-Banner 60x160", qty: 60, cost: 4800000 },
      { name: "Stand Roll Banner 85x200", qty: 40, cost: 3200000 },
    ],
  },
  {
    category: "Material Finishing (Laminasi/Lem)",
    qty: 25,
    unit: "Roll",
    total: 6302500,
    due: 1000000,
    amount: 5302500,
    percentage: "7.02",
    items: [
      { name: "Plastik Laminasi Doff 32mic", qty: 15, cost: 3781500 },
      { name: "Lem Panas Jilid Buku", qty: 10, cost: 2521000 },
    ],
  },
]
