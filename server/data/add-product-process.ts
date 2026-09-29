// Mock data untuk halaman /add-product-process (dipindah dari app/pages/add-product-process.vue)
// Dikonsumsi oleh server/api/add-product-process.ts

export const processes = [
  {
    id: 1,
    code: "PROPC-01",
    product: "Lenovo 3rd Generation",
    image: "/assets/img/products/stock-img-01.png",
    processName: "Printing",
    createDate: "2025-09-01",
  },
  {
    id: 2,
    code: "PROPC-02",
    product: "Bold V3.2",
    image: "/assets/img/products/stock-img-06.png",
    processName: "Cutting",
    createDate: "2025-09-02",
  },
  {
    id: 3,
    code: "PROPC-03",
    product: "Nike Jordan Packaging",
    image: "/assets/img/products/stock-img-02.png",
    processName: "Laminating",
    createDate: "2025-09-03",
  },
]
