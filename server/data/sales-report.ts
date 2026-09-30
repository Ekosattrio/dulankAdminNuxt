// Mock data untuk halaman /sales-report (dipindah dari app/pages/sales-report.vue)
// Dikonsumsi oleh server/api (catch-all) via mock store.
export const rows = [
  {
    category: "Cetak Offset",
    soldQty: 10500,
    unit: "Lembar",
    totalSales: 130000000,
    due: 15000000,
    amount: 115000000,
    percentage: "27.02",
    products: [
      { name: "Brosur Full Color A4", qty: 6500, revenue: 65000000 },
      { name: "Buku Agenda Custom", qty: 4000, revenue: 50000000 },
    ],
  },
  {
    category: "Digital Print A3+",
    soldQty: 15400,
    unit: "Lembar",
    totalSales: 110000000,
    due: 5000000,
    amount: 105000000,
    percentage: "22.87",
    products: [
      { name: "Sticker Vinyl Ritrama", qty: 8400, revenue: 58800000 },
      { name: "Poster Art Carton 260gr", qty: 7000, revenue: 46200000 },
    ],
  },
  {
    category: "Large Format / Banner",
    soldQty: 8200,
    unit: "Meter",
    totalSales: 125000000,
    due: 10000000,
    amount: 115000000,
    percentage: "25.99",
    products: [
      { name: "Banner Flexi China 280gr", qty: 5200, revenue: 65000000 },
      { name: "Banner Flexi Korea 440gr", qty: 3000, revenue: 50000000 },
    ],
  },
  {
    category: "Merchandise & Sablon",
    soldQty: 4200,
    unit: "Pcs",
    totalSales: 66000000,
    due: 4500000,
    amount: 61500000,
    percentage: "13.72",
    products: [
      { name: "Mug Custom Digital", qty: 2200, revenue: 33000000 },
      { name: "Kaos Sablon DTF", qty: 2000, revenue: 28500000 },
    ],
  },
  {
    category: "Finishing & Jilid",
    soldQty: 1200,
    unit: "Buku",
    totalSales: 50002000,
    due: 4065000,
    amount: 45937000,
    percentage: "10.40",
    products: [
      { name: "Hardcover Skripsi", qty: 700, revenue: 28000000 },
      { name: "Jilid Spiral Kawat", qty: 500, revenue: 17937000 },
    ],
  },
]
