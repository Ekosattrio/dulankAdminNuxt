// Mock data untuk halaman /address (dipindah dari app/pages/address.vue)
// Dikonsumsi oleh server/api/address.ts

export const customerAddresses = [
  {
    id: "ADR00000001",
    entityId: "ID000001",
    name: "Aditya Pratama",
    contact: "+6281234567890",
    province: "DKI Jakarta",
    city: "Jakarta Timur",
    district: "Kramat Jati",
    detail: "Perumahan Jati Asri, Kel. Dukuh",
    otherDetail: "Pagar hitam, depan masjid",
    tag: "Home",
    date: "02/12/2025 8:30",
  },
  {
    id: "ADR00000002",
    entityId: "ID000001",
    name: "Aditya Pratama",
    contact: "021-8091234",
    province: "DKI Jakarta",
    city: "Jakarta Pusat",
    district: "Gambir",
    detail: "Gedung Menara Puas jl. 5, Kel. Cideng",
    otherDetail: "Lobby Utama, Dekat Off",
    tag: "Office",
    date: "05/12/2025 10:15",
  },
  {
    id: "ADR00000003",
    entityId: "ID000002",
    name: "PT Maju Jaya",
    contact: "+6281298765432",
    province: "Jawa Barat",
    city: "Bandung",
    district: "Lengkong",
    detail: "Jl. Asia Afrika No. 108",
    otherDetail: "Gedung Kantor Lantai 3",
    tag: "Office",
    date: "06/12/2025 14:20",
  },
]

export const supplierAddresses = [
  {
    id: "ADR00000101",
    entityId: "SUP00001",
    name: "PT Surya Kencana Paper",
    contact: "+6221-5551234",
    province: "Banten",
    city: "Tangerang",
    district: "Batuceper",
    detail: "Kawasan Industri Batuceper Blok C-5",
    otherDetail: "Gudang Utama No. 8",
    tag: "Warehouse",
    date: "01/11/2025 09:00",
  },
]
