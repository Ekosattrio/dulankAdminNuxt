// Mock data untuk halaman /money-transfer (dipindah dari app/pages/money-transfer.vue)
// Dikonsumsi oleh server/api/money-transfer.ts

export const transfers = [
  {
    id: 1,
    date: "19/11/2025 10:49",
    no: "TF00001",
    fromAccount: "Cash Account Cash Account - 1001",
    toAccount: "Bank BNI 0876543210123 - PT Dulank Semesta Cida",
    amount: 269061,
    description: "Gaji Bulanan Cecep Sudirman",
    createdBy: "Admin",
  },
  {
    id: 2,
    date: "27/11/2025 12:50",
    no: "TF00002",
    fromAccount: "Bank BCA 4567891230 - Cecep Sudirman",
    toAccount: "Cash Account Cash Account - 1001",
    amount: 1772418,
    description: "Pembayaran Invoice Supplier PT Kertas Jaya",
    createdBy: "Admin",
  },
  {
    id: 3,
    date: "05/12/2025 13:19",
    no: "TF00003",
    fromAccount: "Bank Mandiri 1230009876543 - PT Dulank Semesta Cida",
    toAccount: "Cash Account Cash Account - 1001",
    amount: 3084398,
    description: "Biaya Kurir dan Pengiriman",
    createdBy: "Staff",
  },
  {
    id: 4,
    date: "29/12/2025 16:47",
    no: "TF00004",
    fromAccount: "Bank BRI 1020304050607 - Cecep Sudirman",
    toAccount: "Cash Account Cash Account - 1001",
    amount: 2192170,
    description: "Pengembalian Dana Konsumen (Refund)",
    createdBy: "Admin",
  },
]
