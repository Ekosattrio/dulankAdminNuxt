# Standar Tipografi Dulank Admin

Dokumen ini adalah acuan ukuran teks seluruh UI aktif Nuxt. Referensi visual utamanya adalah menu sidebar utama yang terbaca pada **14px**. Konsistensi tidak berarti semua teks berukuran sama; ukuran mengikuti fungsi dan hirarki informasi.

## Skala Resmi

Root proyek tetap `14px` agar dimensi layout lama tidak berubah. Token Tailwind dikalibrasi di `app/assets/css/main.css` supaya ukuran teks aktual tetap sesuai tabel berikut.

| Peran | Utility / Class | Ukuran aktual | Weight umum |
| --- | --- | ---: | ---: |
| Judul halaman | `text-xl` / `app-page-title` | 20px | 700 |
| Judul dialog/modal | `text-lg` / `app-dialog-title` | 18px | 700 |
| Judul section/panel | `text-base` / `app-section-title` | 16px | 600-700 |
| Body, paragraf, sidebar, tabel, input, select, tombol | `text-sm` / `app-body-text` | 14px | 400-600 |
| Label, caption, metadata, helper, badge | `text-xs` / `app-supporting-text` | 12px | 400-600 |
| Nilai KPI utama | `text-2xl` | 24px | 700 |
| Nilai dashboard yang benar-benar dominan | `text-3xl` | 30px | 700 |

## Aturan Pemakaian

- Menu utama dan submenu sidebar, isi/header/pagination tabel, filter, search, input, select, dropdown action, serta tombol teks memakai 14px.
- Subtitle halaman adalah penjelasan utama di bawah judul, sehingga tetap 14px dengan warna sekunder.
- Label form, caption, timestamp, helper, badge, dan metadata boleh 12px.
- Teks bermakna tidak boleh lebih kecil dari 12px. `9px`, `10px`, dan `11px` hanya boleh untuk artefak visual non-esensial; pada `.dulank-page` ukuran lama tersebut otomatis dinaikkan ke 12px.
- Judul card/panel biasa tidak boleh memakai ukuran judul halaman. Gunakan 16px.
- `text-2xl` dan `text-3xl` hanya untuk angka KPI/dashboard atau dokumen yang memang membutuhkan penekanan, bukan label control.
- Jangan membuat ukuran arbitrer seperti `text-[13px]` atau `text-[15px]` bila salah satu token resmi sudah mewakili perannya.
- Jangan mengecilkan seluruh container dengan `text-xs` jika di dalamnya ada input, tombol, tabel, atau paragraf utama. Beri ukuran kecil hanya pada caption/label yang memang membutuhkannya.
- Ikon tidak menentukan ukuran teks. Label tombol tetap 14px walaupun ikon 14-16px.
- Template cetak khusus boleh memiliki skala `pt` sendiri sesuai ukuran kertas, tetapi UI dialog pengaturannya tetap mengikuti standar aplikasi.

## Sumber Implementasi

- Token ukuran dan semantic classes: `app/assets/css/main.css`.
- Form/filter/table helper: `app/utils/salesUi.ts`.
- Header halaman: `SalesListHeader.vue` dan `PageHeader.vue`.
- Judul dialog: `SalesDialog.vue`.
- Baseline navigasi: `AppSidebar.vue`.

## Checklist AI

1. Tentukan dulu peran teks: page title, dialog title, section title, body/control, caption, atau KPI.
2. Gunakan token/class resmi; jangan menyalin ukuran acak dari halaman lama.
3. Pastikan teks tabel, toolbar, input, tombol, dan menu terbaca pada 14px aktual.
4. Pastikan caption paling kecil tetap 12px.
5. Periksa desktop dan lebar 390px agar pembesaran teks tidak menyebabkan overlap atau tombol terpotong.
6. Bila komponen reusable menjadi sumber ketidakkonsistenan, perbaiki komponen pusatnya dan periksa seluruh pemakai.

## Status Verifikasi

Standar diterapkan pada token global dan komponen shared pada 2026-10-08. Pemeriksaan statis dilakukan; browser visual desktop/mobile belum dijalankan karena instruksi pengguna melarang dev/build pada sesi ini.
