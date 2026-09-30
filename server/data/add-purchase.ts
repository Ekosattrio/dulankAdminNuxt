// Mock data untuk halaman /add-purchase (dipindah dari app/pages/add-purchase.vue)
// Dikonsumsi oleh server/api (catch-all) via mock store.
export const items = [
  {
    name: 'Tinta Neotex 1Kg Cyan',
    qty: 2,
    unit: 'Kg',
    price: 450000,
    showDropdown: false
  },
  {
    name: 'Kertas Art Paper 150gr',
    qty: 1,
    unit: 'Ream',
    price: 600000,
    showDropdown: false
  }
]
