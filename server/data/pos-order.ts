// Mock data untuk halaman /pos-order (dipindah dari app/pages/pos-order.vue)
// Dikonsumsi oleh server/api/pos-order.ts

export const orders = [
  {
    id: 1,
    customer: "Joko",
    avatar: "/assets/img/customer/customer1.jpg",
    reference: "PT001",
    date: "24 Dec 2024",
    status: "Complete",
    grandTotal: 100000,
    paid: 100000,
    due: 0,
    paymentStatus: "Paid",
    biller: "Admin",
  },
  {
    id: 2,
    customer: "Carl Evans",
    avatar: "/assets/img/customer/customer2.jpg",
    reference: "PT002",
    date: "23 Dec 2024",
    status: "Pending",
    grandTotal: 350000,
    paid: 150000,
    due: 200000,
    paymentStatus: "Unpaid",
    biller: "Kasir 1",
  },
  {
    id: 3,
    customer: "Minerva",
    avatar: "/assets/img/customer/customer3.jpg",
    reference: "PT003",
    date: "22 Dec 2024",
    status: "Complete",
    grandTotal: 750000,
    paid: 750000,
    due: 0,
    paymentStatus: "Paid",
    biller: "Admin",
  },
]
