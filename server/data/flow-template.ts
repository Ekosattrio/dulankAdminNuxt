// Mock data untuk halaman /flow-template (dipindah dari app/pages/flow-template.vue)
// Dikonsumsi oleh server/api/flow-template.ts

export const templates = [
  {
    id: 1,
    code: 'FT-0001',
    name: 'SPK Heidelberg SM52 4 Warna',
    information: 'Project Name, Kertas, Sisi Cetak, Panjang Kertas, Lebar Kertas, Kater/Model, Jumlah Plat, Jumlah Bahan, Jumlah Insit, Jumlah Butuh, Ada Contoh, Acc Warna, Keterangan'
  },
  {
    id: 2,
    code: 'FT-0002',
    name: 'SPK Cetak Outdoor',
    information: 'Project Name, Bahan/Media, Lebar Bahan, Panjang Cetak, Lebar Cetak, Jumlah Order, Finishing Mata Ayam, Sambung Media, Sisa Bahan, Keterangan'
  },
  {
    id: 3,
    code: 'FT-0003',
    name: 'SPK Cetak Indoor',
    information: 'Project Name, Bahan/Media, Resolusi Cetak, Panjang Cetak, Lebar Cetak, Jumlah Order, Laminasi Dingin, Cutting Pola, Ada Contoh, Keterangan'
  },
  {
    id: 4,
    code: 'FT-0004',
    name: 'SPK Cetak Digital A3',
    information: 'Project Name, Jenis Kertas, Sisi Cetak, Jumlah Klik/Lembar, Jenis Mesin, Potong Jadi, Garis Lipat, Laminasi, Keterangan'
  },
  {
    id: 5,
    code: 'FT-0005',
    name: 'SPK Proses Laminating',
    information: 'Project Name, Jenis Laminasi, Sisi Laminasi, Jumlah Lembar, Lebar Bahan, Suhu Mesin, Kecepatan, Keterangan'
  }
]
