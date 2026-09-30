// Mock data untuk halaman /my-incentive (dipindah dari app/pages/my-incentive.vue)
// Dilayani generic CRUD: server/api/[...mock].ts (catch-all)

export const items = [
  { code: "INC-01", process: "Printing", date: "2025-08-10", qty: 10, amount: 50000, status: "Paid" },
  { code: "INC-02", process: "Cutting", date: "2025-08-12", qty: 8, amount: 24000, status: "Pending" },
  { code: "INC-03", process: "Laminasi", date: "2025-08-14", qty: 15, amount: 75000, status: "Paid" },
  { code: "INC-04", process: "Printing", date: "2025-08-18", qty: 12, amount: 36000, status: "Paid" },
  { code: "INC-05", process: "Cutting", date: "2025-08-20", qty: 5, amount: 15000, status: "Pending" },
]
