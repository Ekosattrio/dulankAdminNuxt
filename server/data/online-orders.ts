// Mock data untuk halaman /online-orders (dipindah dari app/pages/online-orders.vue)
// Dilayani generic CRUD: server/api/[...mock].ts (catch-all)

export const orders = [
  {
    id: 1,
    customer: "Joko Widodo",
    avatar: "/assets/img/customer/customer1.jpg",
    reference: "ONL001",
    date: "24 Dec 2024",
    status: "Complete",
    grandTotal: 450000,
    paid: 450000,
    due: 0,
    paymentStatus: "Paid",
    biller: "Webstore",
  },
  {
    id: 2,
    customer: "Carl Evans",
    avatar: "/assets/img/customer/customer2.jpg",
    reference: "ONL002",
    date: "23 Dec 2024",
    status: "Pending",
    grandTotal: 1250000,
    paid: 500000,
    due: 750000,
    paymentStatus: "Unpaid",
    biller: "Marketplace",
  },
  {
    id: 3,
    customer: "Minerva Davis",
    avatar: "/assets/img/customer/customer3.jpg",
    reference: "ONL003",
    date: "22 Dec 2024",
    status: "Complete",
    grandTotal: 890000,
    paid: 890000,
    due: 0,
    paymentStatus: "Paid",
    biller: "Webstore",
  },
]
