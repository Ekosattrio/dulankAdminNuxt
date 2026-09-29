// Mock data untuk halaman /job-progress (dipindah dari app/pages/job-progress.vue)
// Dikonsumsi oleh server/api/job-progress.ts

export const progressList = [
  {
    id: 1,
    progressCode: 'PROG-001',
    product: 'Kartu Nama',
    description: 'Kartu Nama 90x55mm, Art Carton 310gr, Laminasi Glossy 2 Sisi',
    process: 'Printing',
    completedBy: 'Eko Satrio',
    time: '2025-10-01 09:30',
    note: 'Selesai cetak, kualitas baik.',
    isCompleted: true
  },
  {
    id: 2,
    progressCode: 'PROG-002',
    product: 'Kartu Nama',
    description: 'Kartu Nama 90x55mm, Art Carton 310gr, Laminasi Glossy 2 Sisi',
    process: 'Cutting',
    completedBy: 'Desman Dwi',
    time: '2025-10-01 11:45',
    note: 'Sudah di potong, siap laminasi.',
    isCompleted: true
  },
  {
    id: 3,
    progressCode: 'PROG-003',
    product: 'Flyer',
    description: 'Flyer A5, Art Carton 260gr, Laminasi Doff 1 Sisi',
    process: 'Printing',
    completedBy: '',
    time: '',
    note: '',
    isCompleted: false
  },
  {
    id: 4,
    progressCode: 'PROG-004',
    product: 'Flyer',
    description: 'Flyer A5, Art Carton 260gr, Laminasi Doff 1 Sisi',
    process: 'Cutting',
    completedBy: 'Adi Nugroho',
    time: '',
    note: 'Sedang proses potong, antrian panjang.',
    isCompleted: false
  },
  {
    id: 5,
    progressCode: 'PROG-005',
    product: 'Banner',
    description: 'Spanduk Flexi 280gr, Ukuran 3x1 Meter, Mata Ayam di Setiap Sudut',
    process: 'Printing',
    completedBy: 'Eko Satrio',
    time: '2025-09-30 18:00',
    note: 'Hasil cetak oke, warna sesuai.',
    isCompleted: true
  }
]
