// Mock data untuk halaman /balance-account (dipindah dari app/pages/balance-account.vue)
// Dikonsumsi oleh server/api (catch-all) via mock store.
export const customers = [
  { id: 1, code: "ID000001", name: "Aditya Pratama", type: "Corporate", balance: 1500000 },
  { id: 2, code: "ID000006", name: "Fitri Handayani", type: "General", balance: 350000 },
  { id: 3, code: "ID000007", name: "Guntur Saputra", type: "Reseller", balance: 257000 },
  { id: 4, code: "ID000008", name: "Hana Pertiwi", type: "VIP", balance: 1200000 },
  { id: 5, code: "ID000013", name: "Maya Indah", type: "General", balance: 580000 },
]
