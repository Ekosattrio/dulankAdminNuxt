// Mock data untuk halaman /user-admin (dipindah dari app/pages/user-admin.vue)
// Dilayani generic CRUD: server/api/[...mock].ts (catch-all)

export const admins = [
  {
    id: "U001",
    name: "Budi Santoso",
    email: "budi.santoso@email.com",
    role: "Admin",
    stores: ["Toko Pusat", "Toko Cabang 1"],
    status: "Active",
  },
  {
    id: "U002",
    name: "Siti Aminah",
    email: "siti.aminah@email.com",
    role: "Manager",
    stores: ["Toko Cabang 2"],
    status: "Active",
  },
  {
    id: "U003",
    name: "Ahmad Fauzi",
    email: "ahmad.fauzi@email.com",
    role: "Supervisor",
    stores: ["Toko Pusat", "Toko Cabang 1", "Toko Cabang 3"],
    status: "Active",
  },
  {
    id: "U004",
    name: "Diana Putri",
    email: "diana.putri@email.com",
    role: "Staff",
    stores: ["Toko Cabang 2"],
    status: "Inactive",
  },
]
