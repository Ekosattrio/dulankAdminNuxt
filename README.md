# Dulank Admin Nuxt

Admin menggunakan Nuxt 4 dan Tailwind CSS 4. Struktur frontend mengikuti direktori `app/`, dengan backend tetap di `server/`.

Untuk pengembangan bersama AI, baca [AGENTS.md](AGENTS.md): pola halaman dan komponen, pencocokan HTML, standar UI, perlindungan data, serta validasi mengikuti revisi SALES yang sudah disetujui. Struktur menu resminya adalah [Backend-Ready Vertical Slice](docs/BACKEND_READY_VERTICAL_SLICE.md). Indeks dokumentasi lintas modul tersedia di [Obsidian vault](docs/obsidian-vault/00-HOME.md).

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

API, data JSON, types, dan utils dipertahankan. `server/utils/data.ts` memakai `data/` sebagai penyimpanan runtime lokal; JSON di `server/data/` tidak ditimpa atau disalin otomatis. Registry bundled membantu initial read saat deployment serverless, tetapi filesystem Netlify bukan penyimpanan mutasi permanen. Produksi membutuhkan database atau storage durable.

Lihat [panduan struktur](docs/STRUCTURE.md), [standar BRVS](docs/BACKEND_READY_VERTICAL_SLICE.md), [workflow implementasi menu](docs/MENU_IMPLEMENTATION_COMMAND.md), [status handover](AI_HANDOVER_GUIDE.md), [dokumentasi proyek](docs/DOKUMENTASI_SKRIPSI_KACETAK.md), dan [inventaris pemindahan file](MIGRATION_MANIFEST.json).
