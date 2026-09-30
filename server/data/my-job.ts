// Mock data untuk halaman /my-job (dipindah dari app/pages/my-job.vue)
// Dilayani generic CRUD: server/api/[...mock].ts (catch-all)

export const jobs = [
  {
    id: 1,
    flowName: "Mesin SM52 4 Warna",
    priority: "High",
    product: "Brosur A5",
    title: "Brosur Penawaran Bisnis",
    description: "Brosur Full Color A4 (210x297 mm), Art paper 150gr, Tanpa Laminasi, Tanpa Lipatan",
    status: "Waiting",
  },
  {
    id: 2,
    flowName: "Mesin SM52 4 Warna",
    priority: "Urgent",
    product: "Brosur A5",
    title: "Flyer Diskon Merdeka",
    description: "Brosur Full Color A5, Art carton 210gr, Laminasi Doff 2 Sisi, 1 Lipatan",
    status: "On Process",
  },
  {
    id: 3,
    flowName: "Mesin Pond Putus",
    priority: "Normal",
    product: "Hang Tag Baju",
    title: "Hangtag Vintage Distro",
    description: "Ivory 300gr, Die-cut Custom Shape + Hole 3mm, Foil Gold 1 Sisi",
    status: "Waiting",
  },
  {
    id: 4,
    flowName: "Digital A3+ Konica",
    priority: "High",
    product: "Sticker Kromo",
    title: "Label Botol Minuman",
    description: "Sticker Cromo A3+, Kiss Cut Pola Bulat 5cm, 20 Lembar",
    status: "On Process",
  },
]
