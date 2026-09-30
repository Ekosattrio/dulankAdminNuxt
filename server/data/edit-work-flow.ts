// Mock data untuk halaman /edit-work-flow (dipindah dari app/pages/edit-work-flow.vue)
// Dilayani generic CRUD: server/api/[...mock].ts (catch-all)

export const flowSteps = [
  { id: "1", name: "Artwork Checking", category: "Design", selected: true, template: "Standard Ready Print" },
  { id: "2", name: "Layout & Imposition", category: "Design", selected: true, template: "Preps 8 Imposition" },
  { id: "3", name: "Plate CTP (Thermal)", category: "Pracetak", selected: true, template: "SM52 4 Warna (4 Plat)" },
  {
    id: "4",
    name: "Potong Kertas Plano (Sheeting)",
    category: "Pracetak",
    selected: true,
    template: "Potong Ukuran Mesin 37x52",
  },
  { id: "5", name: "Cetak Mesin SM 52", category: "Cetak", selected: true, template: "SM52 4/0 Full Color" },
  { id: "6", name: "Potong Jadi (Final Trimming)", category: "Finishing", selected: true, template: "Potong Siku Presisi" },
  { id: "7", name: "Lipatan Brosur (Folding)", category: "Finishing", selected: true, template: "Lipat 2 (Half Fold)" },
  { id: "8", name: "Sortir & Quality Check", category: "Finishing", selected: true, template: "Inspeksi Standar" },
  { id: "9", name: "Packing & Shrink Wrap", category: "Finishing", selected: true, template: "Kardus Dulank" },
]
