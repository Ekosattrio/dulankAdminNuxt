// Mock data untuk halaman /purchase-category (dipindah dari app/pages/purchase-category.vue)
// Dikonsumsi oleh server/api (catch-all) via mock store.
export const categories = [
  { id: 1, name: "Kertas & Bahan Baku Cetak", created: "Admin, 02/01/2026, 08:00", status: "Active" },
  { id: 2, name: "Tinta & Toner", created: "Admin, 02/01/2026, 08:15", status: "Active" },
  { id: 3, name: "Bahan Finishing & Jilid", created: "Admin, 02/01/2026, 08:30", status: "Active" },
  { id: 4, name: "Sparepart Mesin", created: "Admin, 02/01/2026, 08:45", status: "Active" },
  { id: 5, name: "Packaging & Kemasan", created: "Admin, 02/01/2026, 09:00", status: "Deactive" },
]
