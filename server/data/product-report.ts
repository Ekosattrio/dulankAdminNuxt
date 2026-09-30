// Mock data untuk halaman /product-report (dipindah dari app/pages/product-report.vue)
// Dikonsumsi oleh server/api (catch-all) via mock store.
export const products = [
  {
    product: "Banner Outdoor 280gr",
    category: "Large Format",
    order: 1250,
    unit: "Meter",
    amount: 31250000,
    percentage: "25.15",
  },
  { product: "Buku Kenangan Hardcover", category: "Offset", order: 250, unit: "Pcs", amount: 30000000, percentage: "24.14" },
  { product: "Brosur A4 HVS 80gr", category: "Digital Print", order: 45, unit: "Rim", amount: 15750000, percentage: "12.68" },
  {
    product: "Stiker Vinyl Ritrama",
    category: "Digital Print",
    order: 120,
    unit: "Lembar",
    amount: 14400000,
    percentage: "11.59",
  },
  { product: "Kartu Nama Laminating", category: "Digital Print", order: 400, unit: "Box", amount: 14000000, percentage: "11.27" },
  { product: "Kaos DTF Custom", category: "Apparel", order: 120, unit: "Pcs", amount: 10200000, percentage: "8.21" },
  { product: "Banner Indoor Albatros", category: "Large Format", order: 65, unit: "Meter", amount: 4225000, percentage: "3.40" },
  {
    product: "Poster A3+ Art Carton",
    category: "Digital Print",
    order: 350,
    unit: "Lembar",
    amount: 2625000,
    percentage: "2.11",
  },
  { product: "Pin Peniti 58mm", category: "Merchandise", order: 250, unit: "Pcs", amount: 1250000, percentage: "1.01" },
  { product: "ID Card PVC", category: "Digital Print", order: 55, unit: "Pcs", amount: 550000, percentage: "0.44" },
]
