// Mock data untuk halaman /cart (dipindah dari app/pages/cart.vue)
// Dikonsumsi oleh server/api/cart.ts

export const carts = [
  {
    id: 1,
    product: 'Brosur Full Color A4 Art Paper 150g',
    image: '/assets/img/products/stock-img-01.png',
    user: 'ekosatrio@gmail.com',
    category: 'Brochure',
    price: 25000,
    qty: 100,
    totalPrice: 2500000,
    date: '24/04/2025',
    status: 'Active'
  },
  {
    id: 2,
    product: 'Custom Box Packaging Ivory 300g',
    image: '/assets/img/products/stock-img-06.png',
    user: 'budi.santoso@yahoo.com',
    category: 'Packaging',
    price: 18000,
    qty: 140,
    totalPrice: 2520000,
    date: '24/04/2025',
    status: 'Active'
  },
  {
    id: 3,
    product: 'Flyer DL Lipat 3 Full Color',
    image: '/assets/img/products/stock-img-02.png',
    user: 'linda.wijaya@gmail.com',
    category: 'Flyer',
    price: 3200,
    qty: 780,
    totalPrice: 2496000,
    date: '24/04/2025',
    status: 'Checkout'
  },
  {
    id: 4,
    product: 'Buku Agenda Custom Hardcover',
    image: '/assets/img/products/stock-img-03.png',
    user: 'rudi.printing@corp.id',
    category: 'Stationery',
    price: 55000,
    qty: 450,
    totalPrice: 24750000,
    date: '24/04/2025',
    status: 'Active'
  },
  {
    id: 5,
    product: 'Kartu Nama Foil Emas Box Plastik',
    image: '/assets/img/products/stock-img-04.png',
    user: 'sarah.j@outlook.com',
    category: 'Stationery',
    price: 65000,
    qty: 10,
    totalPrice: 650000,
    date: '23/04/2025',
    status: 'Delete'
  }
]
