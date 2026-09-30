// Mock data untuk halaman /department (dipindah dari app/pages/department.vue)
// Dilayani generic CRUD: server/api/[...mock].ts (catch-all)

export const departments = [
  {
    id: "D01",
    name: "Produksi",
    members: ["Budi", "Dedi", "Hendra", "Fajar"],
    totalMembers: 4,
    createdDate: "01/01/2023",
    status: "Active",
  },
  {
    id: "D02",
    name: "Administrasi",
    members: ["Siti", "Larasati"],
    totalMembers: 2,
    createdDate: "01/01/2023",
    status: "Active",
  },
  {
    id: "D03",
    name: "Desain",
    members: ["Agus", "Andi"],
    totalMembers: 2,
    createdDate: "01/01/2023",
    status: "Active",
  },
  {
    id: "D04",
    name: "Marketing",
    members: ["Rina", "Maya"],
    totalMembers: 2,
    createdDate: "01/01/2023",
    status: "Active",
  },
  {
    id: "D05",
    name: "Research & Development",
    members: [],
    totalMembers: 0,
    createdDate: "10/02/2026",
    status: "Disable",
  },
]
