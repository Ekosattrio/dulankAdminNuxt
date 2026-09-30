// Mock data untuk halaman /designation (dipindah dari app/pages/designation.vue)
// Dilayani generic CRUD: server/api/[...mock].ts (catch-all)

export const designations = [
  {
    id: "DS01",
    name: "Designer",
    members: ["user-08.jpg", "user-13.jpg", "user-09.jpg", "user-11.jpg"],
    createdOn: "13 August 2023",
    totalMembers: 4,
    status: "Active",
  },
  {
    id: "DS02",
    name: "Database administrator",
    members: ["user-11.jpg", "user-07.jpg", "user-02.jpg", "user-11.jpg"],
    createdOn: "24 August 2023",
    totalMembers: 4,
    status: "Active",
  },
  {
    id: "DS03",
    name: "Curator",
    members: ["user-05.jpg", "user-06.jpg", "user-12.jpg"],
    createdOn: "07 September 2023",
    totalMembers: 3,
    status: "Active",
  },
  {
    id: "DS04",
    name: "System Administrator",
    members: ["user-01.jpg", "user-03.jpg"],
    createdOn: "21 September 2023",
    totalMembers: 2,
    status: "Active",
  },
  {
    id: "DS05",
    name: "Administrative Officer",
    members: ["user-04.jpg", "user-10.jpg", "user-13.jpg"],
    createdOn: "15 October 2023",
    totalMembers: 3,
    status: "Active",
  },
]
