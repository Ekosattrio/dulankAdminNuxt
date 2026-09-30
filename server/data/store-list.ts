// Mock data untuk halaman /store-list (dipindah dari app/pages/store-list.vue)
// Dilayani generic CRUD: server/api/[...mock].ts (catch-all)

export const stores = [
  {
    id: 1,
    storeName: "Kacetak Pusat Karawang Barat",
    userName: "Thomas21",
    address: "Karawang Barat Kab. Karawang",
    phone: "+62 812 6354 7758",
    email: "thomas@example.com",
    status: "Active",
  },
  {
    id: 2,
    storeName: "Kacetak Cabang Bandung",
    userName: "Cras56",
    address: "Jl. Soekarno Hatta No. 120, Bandung",
    phone: "+62 813 6358 6901",
    email: "rasmussen@example.com",
    status: "Active",
  },
  {
    id: 3,
    storeName: "Workshop Packaging Cikarang",
    userName: "FredJ25",
    address: "Kawasan Industri Jababeka, Cikarang",
    phone: "+62 815 8769 4357",
    email: "john@example.com",
    status: "Active",
  },
  {
    id: 4,
    storeName: "Digital Copy Outlet Jakarta",
    userName: "James524",
    address: "Jl. Percetakan Negara No. 45, Jakarta",
    phone: "+62 816 4163 5098",
    email: "james@example.com",
    status: "Active",
  },
  {
    id: 5,
    storeName: "Gudang Kertas Cikampek",
    userName: "Alex99",
    address: "Jl. Raya Cikampek Timur No. 8",
    phone: "+62 818 9012 3456",
    email: "alex@example.com",
    status: "Inactive",
  },
]
