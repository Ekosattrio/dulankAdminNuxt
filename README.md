# Dulank Admin Nuxt

Admin menggunakan Nuxt 4 dan Tailwind CSS 4. Struktur frontend mengikuti direktori `app/`, dengan backend tetap di `server/`.

Untuk pengembangan bersama AI, baca [AGENTS.md](AGENTS.md): pola halaman dan komponen, pencocokan HTML, standar UI, perlindungan data, serta validasi mengikuti revisi SALES yang sudah disetujui.

```text
app/                   Frontend: pages, components, layouts, composables, stores, locales
docs/                  Panduan struktur dan dokumentasi proyek
legacy/static-source/  HTML asli beserta aset, JSON, dan partial referensi
public/                Aset yang diakses langsung oleh browser
scripts/               Script validasi dan bantuan pengembangan
server/                API, data JSON, types, dan utils backend
data/                  Lokasi penyimpanan runtime yang sudah digunakan aplikasi
```

Jalankan dari root proyek:

```sh
npm install
npm run dev
```

Build produksi dan pemeriksaan struktur:

```sh
npm run build
npm run validate:structure
npm run validate:structure -- --check-hashes
```

Opsi `--check-hashes` membandingkan file dengan snapshot setelah penataan struktur. Perubahan isi pada pengembangan berikutnya akan dilaporkan sebagai perbedaan; validasi tidak mengembalikan atau menghapus file.

Seluruh 186 halaman berada di `app/pages/`. HTML acuannya berada di `legacy/static-source/` dengan nama yang sama. URL halaman dan alias `.html` tetap tersedia. HTML referensi dapat disajikan dengan `legacy/static-source/` sebagai document root agar path aset relatifnya tetap sesuai.

API, data JSON, types, dan utils dipertahankan. `server/utils/data.ts` masih memakai `data/` sebagai penyimpanan runtime; JSON di `server/data/` tidak ditimpa atau disalin otomatis. Endpoint blog yang masih kosong sebelum migrasi tetap memerlukan implementasi.

Lihat [panduan struktur](docs/STRUCTURE.md), [dokumentasi proyek](docs/DOKUMENTASI_SKRIPSI_KACETAK.md), dan [inventaris pemindahan file](MIGRATION_MANIFEST.json).
