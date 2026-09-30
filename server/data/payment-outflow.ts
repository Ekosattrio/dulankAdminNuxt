// Mock data untuk halaman /payment-outflow (dipindah dari app/pages/payment-outflow.vue)
// Dilayani generic CRUD: server/api/[...mock].ts (catch-all)

export const outflows = [
  {
    id: 1,
    date: "01/02/2026",
    refNo: "PAY-001",
    name: "Seluruh Staff",
    source: "Payroll",
    amount: 45000000,
    status: "Paid",
    method: "Transfer",
    note: "Gaji Bulanan Januari",
  },
  {
    id: 2,
    date: "04/02/2026",
    refNo: "EXP-101",
    name: "PLN Persero",
    source: "Expense",
    amount: 1450000,
    status: "Paid",
    method: "Transfer",
    note: "Tagihan Listrik Pabrik",
  },
  {
    id: 3,
    date: "06/02/2026",
    refNo: "ADV-011",
    name: "Rian (Kurir)",
    source: "Advance",
    amount: 300000,
    status: "Paid",
    method: "Cash",
    note: "Uang Jalan Pengiriman Jabodetabek",
  },
  {
    id: 4,
    date: "10/02/2026",
    refNo: "PUR-301",
    name: "PT. Surya Paper",
    source: "Purchase",
    amount: 18500000,
    status: "Paid",
    method: "Transfer",
    note: "Pelunasan Kertas Art Paper",
  },
]
