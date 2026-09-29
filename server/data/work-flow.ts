// Mock data untuk halaman /work-flow (dipindah dari app/pages/work-flow.vue)
// Dikonsumsi oleh server/api/work-flow.ts

export const workflows = [
  {
    id: "1",
    no: "JAP-0001",
    category: "Offset",
    product: "Brosur A5",
    workflowSteps: "Artwork, Plat CTP, Cetak SM52, Potong, Lipat, Sortir, Packing",
  },
  {
    id: "2",
    no: "JAP-0002",
    category: "Large Format",
    product: "Spanduk Banner",
    workflowSteps: "Design, Output Film, Cetak Outdoor, Potong, Selongsong, Packing",
  },
  {
    id: "3",
    no: "JAP-0003",
    category: "Digital A3+",
    product: "Kartu Nama",
    workflowSteps: "Design, Cetak Xerox, Potong, Laminasi, Sortir, Packing",
  },
  {
    id: "4",
    no: "JAP-0004",
    category: "Sablon",
    product: "Kaos Distro",
    workflowSteps: "Artwork, Klise, Sortir, Lipat, Packing",
  },
  {
    id: "5",
    no: "JAP-0005",
    category: "Offset",
    product: "Buku Yasin",
    workflowSteps: "Design, Plat CTP, Cetak Oliver52, Susun Komplit, Lem, Potong, Packing",
  },
  {
    id: "6",
    no: "JAP-0006",
    category: "Large Format",
    product: "Poster Display",
    workflowSteps: "Artwork, Output Film, Cetak Indoor, Potong, Laminasi, Roll",
  },
]
