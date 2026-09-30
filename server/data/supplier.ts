// Mock data untuk halaman /supplier (dipindah dari app/pages/supplier.vue)
// Dilayani generic CRUD: server/api/[...mock].ts (catch-all)

export const suppliers = [
  {
    id: 1,
    code: "ID0001",
    name: "PT Kertas Jaya Makmur",
    email: "info@kertasjaya.co.id",
    contact: "+6221-8091234",
    picName: "Budi Santoso",
    status: "Active",
    date: "05/12/2025 9:15",
  },
  {
    id: 2,
    code: "ID0002",
    name: "CV Kimia Prima Terang",
    email: "sales@kimiaprima.com",
    contact: "+6281233445566",
    picName: "Siti Nurhaliza",
    status: "Active",
    date: "08/12/2025 10:30",
  },
  {
    id: 3,
    code: "ID0003",
    name: "UD Sukses Makmur Kertas",
    email: "ud.sukses@gmail.com",
    contact: "031-5566778",
    picName: "Ahmad Wijaya",
    status: "Active",
    date: "11/12/2025 14:45",
  },
  {
    id: 4,
    code: "ID0004",
    name: "Global Inkindo Pratama",
    email: "admin@globalinkindo.id",
    contact: "+6281122334455",
    picName: "Dewi Handayani",
    status: "Active",
    date: "14/12/2025 11:20",
  },
]
