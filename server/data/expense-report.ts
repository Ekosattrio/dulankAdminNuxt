// Mock data untuk halaman /expense-report (dipindah dari app/pages/expense-report.vue)
// Dikonsumsi oleh server/api (catch-all) via mock store.
export const rows = [
  { category: "Bahan Baku Percetakan", count: 18, amount: 45500000, percentage: "38.41" },
  { category: "Gaji Karyawan & Operator", count: 1, amount: 32000000, percentage: "27.02" },
  { category: "Sewa Gedung / Ruko", count: 1, amount: 12000000, percentage: "10.13" },
  { category: "Utilitas (Listrik & Air)", count: 4, amount: 7200000, percentage: "6.08" },
  { category: "Pemeliharaan Mesin", count: 3, amount: 5800000, percentage: "4.89" },
  { category: "Pemasaran & Iklan Digital", count: 6, amount: 4500000, percentage: "3.80" },
  { category: "Logistik & Pengiriman", count: 25, amount: 3750000, percentage: "3.17" },
  { category: "Perlengkapan Kantor (ATK)", count: 12, amount: 2850000, percentage: "2.41" },
  { category: "Biaya Keamanan & Kebersihan", count: 2, amount: 2500000, percentage: "2.11" },
  { category: "Biaya Tak Terduga", count: 5, amount: 2350000, percentage: "1.98" },
]
