// Mock data untuk halaman /supplier-due-report (dipindah dari app/pages/supplier-due-report.vue)
// Dikonsumsi oleh server/api (catch-all) via mock store.
export const dues = [
  { name: "PT Kertas Jaya", purchasesDue: 2, amountDue: 7500000, daysDue: "14 Days" },
  { name: "Global Inkindo", purchasesDue: 1, amountDue: 850000, daysDue: "4 Days" },
  { name: "PT Duta Grafika", purchasesDue: 3, amountDue: 2500000, daysDue: "8 Days" },
  { name: "Indo Material", purchasesDue: 1, amountDue: 1950000, daysDue: "1 Day" },
]
