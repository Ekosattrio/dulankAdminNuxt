// Mock data untuk halaman /expense-category (dipindah dari app/pages/expense-category.vue)
// Dikonsumsi oleh server/api (catch-all) via mock store.
export const categories = [
  {
    id: 1,
    code: "EXC001",
    name: "Bahan Baku Utama",
    description: "Pembelian kertas, tinta, dan bahan cetak lainnya.",
    used: 25,
    status: "Active",
    created: "01/01/2026",
  },
  {
    id: 2,
    code: "EXC002",
    name: "Biaya Gaji & Upah",
    description: "Pengeluaran rutin untuk gaji karyawan dan upah lembur.",
    used: 12,
    status: "Active",
    created: "03/01/2026",
  },
  {
    id: 3,
    code: "EXC003",
    name: "Perawatan Mesin",
    description: "Biaya service berkala dan perbaikan mendadak mesin cetak (Offset, Digital, Sablon).",
    used: 5,
    status: "Active",
    created: "05/01/2026",
  },
  {
    id: 4,
    code: "EXC004",
    name: "Biaya Listrik & Air",
    description: "Tagihan utilitas operasional kantor dan workshop.",
    used: 8,
    status: "Active",
    created: "07/01/2026",
  },
  {
    id: 5,
    code: "EXC005",
    name: "Transportasi & Kurir",
    description: "BBM kendaraan armada dan biaya jasa kurir ekspedisi.",
    used: 19,
    status: "Active",
    created: "10/01/2026",
  },
]
