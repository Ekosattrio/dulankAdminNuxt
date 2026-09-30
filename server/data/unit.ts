// Mock data untuk halaman /unit (dipindah dari app/pages/unit.vue)
// Dilayani generic CRUD: server/api/[...mock].ts (catch-all)

export const units = [
  { id: "1", name: "Meter", shortName: "m", itemUsed: 14, createdOn: "25 May 2023", status: "Active" },
  { id: "2", name: "Box", shortName: "bx", itemUsed: 8, createdOn: "24 May 2023", status: "Active" },
  { id: "3", name: "Rim", shortName: "rm", itemUsed: 12, createdOn: "23 May 2023", status: "Active" },
  { id: "4", name: "Piece", shortName: "pcs", itemUsed: 35, createdOn: "22 May 2023", status: "Active" },
  { id: "5", name: "Buku", shortName: "bk", itemUsed: 10, createdOn: "21 May 2023", status: "Active" },
  { id: "6", name: "Lembar", shortName: "lbr", itemUsed: 40, createdOn: "20 May 2023", status: "Active" },
  { id: "7", name: "Kilogram", shortName: "kg", itemUsed: 5, createdOn: "18 May 2023", status: "Active" },
]
