// Mock data untuk halaman /variant (dipindah dari app/pages/variant.vue)
// Dikonsumsi oleh server/api/variant.ts

export const variants = [
  {
    id: "1",
    name: "Size (T-shirts)",
    values: ["S", "M", "L", "XL", "XXL"],
    itemUsed: 4,
    createdOn: "25 May 2023",
    status: "Active",
  },
  {
    id: "2",
    name: "Color",
    values: ["Red", "Black", "White", "Navy"],
    itemUsed: 7,
    createdOn: "24 May 2023",
    status: "Active",
  },
  {
    id: "3",
    name: "Laminasi",
    values: ["Doff", "Glossy", "Non Laminasi"],
    itemUsed: 15,
    createdOn: "23 May 2023",
    status: "Active",
  },
  {
    id: "4",
    name: "Paper Material",
    values: ["Art Paper 150gr", "Art Carton 260gr", "Ivory 300gr", "Kraft 275gr"],
    itemUsed: 22,
    createdOn: "20 May 2023",
    status: "Active",
  },
]
