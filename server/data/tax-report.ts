// Mock data untuk halaman /tax-report (dipindah dari app/pages/tax-report.vue)
// Dikonsumsi oleh server/api (catch-all) via mock store.
export const rows = [
  { month: "January", year: "2025", outputTax: 15000000, inputTax: 12000000, carryOver: 0, vatDiff: 3000000 },
  { month: "February", year: "2025", outputTax: 10000000, inputTax: 12000000, carryOver: 0, vatDiff: -2000000 },
  { month: "March", year: "2025", outputTax: 18000000, inputTax: 14000000, carryOver: 2000000, vatDiff: 2000000 },
  { month: "April", year: "2025", outputTax: 12000000, inputTax: 15000000, carryOver: 0, vatDiff: -3000000 },
  { month: "May", year: "2025", outputTax: 20000000, inputTax: 10000000, carryOver: 3000000, vatDiff: 7000000 },
  { month: "June", year: "2025", outputTax: 15000000, inputTax: 18000000, carryOver: 0, vatDiff: -3000000 },
  { month: "July", year: "2025", outputTax: 14000000, inputTax: 14000000, carryOver: 3000000, vatDiff: 3000000 },
  { month: "August", year: "2025", outputTax: 25000000, inputTax: 15000000, carryOver: 3000000, vatDiff: 7000000 },
  { month: "September", year: "2025", outputTax: 12000000, inputTax: 13000000, carryOver: 0, vatDiff: -1000000 },
  { month: "October", year: "2025", outputTax: 22000000, inputTax: 18000000, carryOver: 1000000, vatDiff: 3000000 },
  { month: "November", year: "2025", outputTax: 16000000, inputTax: 20000000, carryOver: 0, vatDiff: -4000000 },
  { month: "December", year: "2025", outputTax: 30000000, inputTax: 22000000, carryOver: 4000000, vatDiff: 4000000 },
]
