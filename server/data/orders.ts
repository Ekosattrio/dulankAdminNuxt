// Mock data untuk halaman /orders (dipindah dari app/pages/orders.vue)
// Dilayani generic CRUD: server/api/[...mock].ts (catch-all)

export const orders = [
  {
    id: 1,
    orderNo: "ORD-2510000001",
    customer: "PT Makmur Abadi",
    date: "10/09/2025",
    status: "Complete",
    statusBy: "Admin",
    salesChannel: "Quotation",
    shipping: "Courier",
  },
  {
    id: 2,
    orderNo: "ORD-2510000002",
    customer: "Toko Digital Jaya",
    date: "10/09/2025",
    status: "Processing",
    statusBy: "System",
    salesChannel: "Website",
    shipping: "Express",
  },
  {
    id: 3,
    orderNo: "ORD-2510000003",
    customer: "Klinik Sehat",
    date: "09/09/2025",
    status: "Waiting",
    statusBy: "Admin",
    salesChannel: "Quotation",
    shipping: "Pickup",
  },
  {
    id: 4,
    orderNo: "ORD-2510000004",
    customer: "Sdr. Andri",
    date: "08/09/2025",
    status: "Cancel",
    statusBy: "User",
    salesChannel: "Website",
    shipping: "Courier",
  },
]
