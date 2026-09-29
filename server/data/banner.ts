// Mock data untuk halaman /banner (dipindah dari app/pages/banner.vue)
// Dikonsumsi oleh server/api/banner.ts

export const mainBanners = [
  {
    id: 'm1',
    src: 'https://percetakan-dulank.netlify.app/images/brosur.jpg',
    title: 'Promo Utama 1',
    desc: 'Diskon besar-besaran cetak brosur A4 & A5',
    start: '2024-11-01T08:00',
    end: '2024-12-31T23:59',
    created: '2024-11-01T08:00'
  },
  {
    id: 'm2',
    src: 'https://percetakan-dulank.netlify.app/images/yasin.jpg',
    title: 'Promo Utama 2',
    desc: 'Penawaran terbatas cetak buku Yasin hard cover',
    start: '2024-11-05T08:00',
    end: '2024-12-25T23:59',
    created: '2024-11-05T08:00'
  }
]

export const productBanners = [
  {
    id: 'p1',
    src: 'https://percetakan-dulank.netlify.app/images/yasin.jpg',
    title: 'Produk Pilihan',
    desc: 'Koleksi blangko dan cover terlengkap',
    start: '2024-11-10T08:00',
    end: '2024-12-20T23:59',
    created: '2024-11-10T08:00'
  },
  {
    id: 'p2',
    src: 'https://percetakan-dulank.netlify.app/images/kaos.jpg',
    title: 'Diskon Sablon Kaos',
    desc: 'Hemat biaya cetak sablon DTF lusinan',
    start: '2024-11-15T08:00',
    end: '2024-12-15T23:59',
    created: '2024-11-15T08:00'
  }
]
