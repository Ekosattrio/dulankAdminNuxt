---
title: Client Revisions
tags: [client, ui, revision]
updated: 2026-10-08
---

# Client Revisions

## Revisi 1: Tipografi Sidebar, Tabel, dan Filter

Catatan klien:

> Ukuran font sidebar menu sama ukuran font pada tabel berbeda, yang di dalam tabel lebih kecil, baik isi tabel atau teks pada button filter.

Keputusan implementasi:

- Sidebar utama menjadi patokan visual 14px.
- `SalesDataTable` header, body, dan pagination memakai `text-sm`.
- Search, page-size, `TableFilterSelect`, dan trigger `DateRangePicker` memakai `text-sm`.
- Tinggi kontrol tetap `h-9` agar densitas layout tidak berubah.
- Tabel dokumen yang memakai `salesDocumentTable` mengikuti 14px, kecuali template cetak khusus dengan ukuran kertas sendiri.

Status: diterapkan pada shared components 2026-10-08. Pemeriksaan browser belum dijalankan karena pengguna melarang dev/build pada sesi ini.

## Revisi 1.1: Hirarki Tipografi Seluruh Aplikasi

Permintaan pengguna: seluruh font dibuat konsisten dengan keterbacaan sidebar, tetapi judul, subjudul, paragraf, label, dan KPI tetap memiliki hirarki yang jelas.

Keputusan implementasi:

- Sidebar, body/paragraf, tabel, input/select, filter, dropdown action, dan tombol teks memakai baseline 14px.
- Judul halaman 20px, dialog 18px, section/panel 16px, caption/label/helper/badge 12px, dan KPI utama 24px.
- Teks bermakna tidak boleh lebih kecil dari 12px.
- Root 14px dipertahankan agar spacing/layout lama tidak berubah. Token font Tailwind dikalibrasi di `main.css`, karena sebelumnya `text-sm` berbasis root 14px hanya tampil sekitar 12.25px.
- Semantic typography classes ditambahkan dan dipakai pada shared header/dialog. Form helper, submenu sidebar, currency input, quantity stepper, assignee select, table skeleton, More menu, dan dialog Print/PDF diselaraskan.
- Acuan lengkap berada di `docs/TYPOGRAPHY_STANDARD.md`.

Status: diterapkan secara pusat 2026-10-08; browser desktop/mobile belum diverifikasi sesuai larangan dev/build pengguna.

## Revisi 2: Terapkan Dialog Print/PDF ke Halaman Lain

Permintaan pengguna: dialog "Cetak & Ekspor Dokumen Laporan" yang sudah dipakai Invoice Report diterapkan juga ke halaman lain yang relevan.

Keputusan implementasi:

- Tetap memakai `DocumentPrintModal.vue`, `useTablePrint.ts`, dan iframe `documentPrinter.ts`; tidak dibuat versi modal per menu.
- Integrasi ditambahkan ke Language, Download Files, Our Client, Banner, dan Permission Matrix.
- Permission Matrix tidak menampilkan rentang tanggal karena domainnya tidak memiliki tanggal transaksi; opsi dokumen, orientasi, Print, dan PDF tetap sama.
- `SalesListHeader` mendukung event PDF standar dan kompatibilitas event lama.

Status: diterapkan 2026-10-08; browser verification belum dijalankan sesuai instruksi pengguna.

## Revisi 3: Standardisasi Ikon Edit (`edit`) & Penyelarasan Layout Netlify Cetak Full Color

Catatan klien & masukan visual:

> Lu liat perbedaan dari ss yang gw kasih masih jauh nih link nya https://dulank-admin.netlify.app/cetak-full-color.html dan juga itu icon action edit nya ga sama benerin jadikan kek yang lain dan standarisasi untuk seterusnya itu icon.

Akar masalah yang ditemukan:

1. Mapping `edit` pada `app/utils/actionIcons.ts` sebelumnya terkonfigurasi ke `edit-2` (pensil miring melayang), padahal di template legacy dan seluruh tabel admin standar ikon yang dipakai adalah `edit` (pad/kertas dengan pensil menulis, `<i data-feather="edit"></i>`).
2. Sisi kanan halaman tidak dibungkus card container putih, sehingga grid dan judul tampak mengambang di atas background halaman abu-abu.
3. Grid kartu produk dipaksa 4 kolom statis tanpa `min-width: 270px` dan `overflow-x: auto` seperti legacy CSS `.product-card-grid`, sehingga saat dibuka di layar laptop kartu tertekan hingga sempit dan teks terpotong.
4. Spesifikasi kartu sempat diubah menjadi key-value 1-baris yang menyimpang dari susunan legacy.

Keputusan implementasi & standardisasi:

- Mapping `edit` pada `actionIcons.ts` distandarkan secara permanen ke `edit` (glyph Feather `edit`), dan aturan di `ICON_STANDARD.md` serta `AGENTS.md` diperbarui.
- Seluruh grid produk pada `CustomProductCardsGrid.vue` dibungkus dalam card container putih mandiri: `rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900`.
- Menerapkan CSS grid legacy `.product-card-grid`: `grid grid-cols-[repeat(4,minmax(270px,1fr))] gap-6 overflow-x-auto pb-3` dengan kartu `min-w-[270px]`.
- Menyusun ulang spesifikasi kartu persis seperti legacy: `Product Name`, `Ukuran <Name>`, `Jenis Kertas`, `Laminasi`, `Sisi Cetak`, `Lipatan/Binding`, `Content Article` dengan label abu-abu halus di atas dan isi di bawah.
- Footer kartu memuat baris Display (`POS` dan `Website` checkbox) serta baris aksi dengan tombol ikon standar `<SalesActionButton action="edit">` dan `<SalesActionButton action="delete">`.
- Sidebar "Setting And Optional" diselaraskan dengan pill badge 11 merah (`#ea5455`), active item soft background (`#f1f1f5`) dengan border `#e4e6ef`, dan ikon ungu `#7367f0`.

Status: diterapkan dan tervalidasi 200 OK pada 8 route terkait 2026-10-08.

## Cara Mencatat Revisi Berikutnya

Setiap revisi harus berisi kutipan/inti permintaan, keputusan visual atau flow, file shared yang terpengaruh, halaman sampel, tanggal, dan status verifikasi.
