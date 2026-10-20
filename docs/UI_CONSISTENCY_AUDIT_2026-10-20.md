# Audit konsistensi tampilan — 2026-10-20

Status: **implemented, browser verification pending**. Scope hanya presentasi frontend; bukan rekonsiliasi fitur/backend atau persetujuan baseline baru.

## Scope dan hasil

- Audit source seluruh 191 page dan 628 komponen Vue. Tidak berarti seluruh route telah dilihat di browser.
- Layout `app/layouts/default.vue` tetap menjadi sumber padding luar. Hapus padding tambahan dan pembatas `max-w-7xl` dari 31 route: all-blog, banner, blog-category, blog-comment, blog-tag, cart, checkout, contact-form, customer-due-report, customer-report, delete-account, download-files, faq-category, faq, footer, invoice-template, my-incentive, my-job, our-client, profit-and-loss, purchase-report, reviews, role-permissions, role, sales-report, supplier-due-report, support-ticket, tax-report, user-admin, user, wishlist. Padding tambahan workspace Department, Employees, EmployeeSalary juga dihapus.
- `.inventory-master-page` tidak lagi menambah padding di atas padding layout. Berlaku pada Category, Sub Category, Unit, Variant.
- `app-stat-card` dipakai ulang oleh Cart, Checkout, ContactForm, MyIncentive, Reviews, SupportTicket, Wishlist. Grid responsif, jarak ke tabel, padding/border/radius, warna dark mode, dan tipografi nilai KPI disamakan. Nominal panjang dibatasi lebar card dan dapat membungkus.
- `SalesDialog` dan kelompok aksi form di pemakainya mempertahankan urutan tombol dan rata kanan, dengan wrapping pada layar sempit. POS tidak diedit.
- `app/assets/css/legacy-ui.css` menyediakan presentasi Tailwind untuk markup lama yang masih aktif: page header, card, grid form 12 kolom, field, button, tabel scroll, overlay/dialog, dan footer. Footer `.modal-footer`, `.modal-footer-btn`, `.modal-action-footer` memakai flex, wrap, justify-end, dan gap seragam. Tidak memuat Bootstrap/jQuery/aset legacy.
- Tombol tutup lama memperoleh label aksesibel dan simbol tutup; ikon refresh lama menggunakan FeatherIcon. Field, teks, binding, urutan tombol, handler, kondisi tampil, request, tipe domain, API, dan data tidak diganti.
- Teks isi tabel Contact Form, Reviews, Checkout, Support Ticket, serta total My Incentive mengikuti `text-sm`; badge voucher tetap memakai skala badge.

## Check 1 — expected vs implementation

| Area | Expected | Evidence | Result |
| --- | --- | --- | --- |
| Padding | Padding luar hanya dari layout | Root class seluruh page; tiga workspace HRM; `.inventory-master-page` | Static pass; browser pending |
| Card | Grid dan jarak KPI konsisten | Tujuh `*StatsWidgets.vue`; `.app-stat-card` | Static pass; browser pending |
| Modal | Cancel/Save rata kanan dan dapat wrap | `SalesDialog.vue`, kelompok aksi inline, footer legacy | Static pass; browser pending |
| Form lama | Grid/field/button memiliki style aktif | `legacy-ui.css` diimpor `main.css` | Build pass; browser pending |
| Konten | Tidak berubah | Perbandingan AST 179 file Vue berubah terhadap Git HEAD: script, teks, interpolasi, directive, atribut selain class/aria-label; normalisasi hanya penggantian ikon refresh | Pass |

## Check 2 — pencarian regresi

- Audit ulang page root: tidak ada padding luar eksplisit/pembatas `max-w-7xl` tersisa pada root `.dulank-page`.
- Parser dan compiler template seluruh 819 SFC tidak menghasilkan error.
- Memeriksa pemakai bersama lintas Sales, Inventory, HRM, Settings, Reports, dan Webstore melalui source.
- Memperbaiki specificity tombol utama agar background primary mengalahkan `.btn`; mempertahankan field/tombol 36px pada root 14px; textarea tetap multiline.
- Memeriksa wrapping kelompok aksi, pilihan appearance, dan nominal KPI panjang. Hasil visual desktop/390px belum dapat dibuktikan.
- Tidak ada perubahan pada script/composable/server/data atau file POS; tidak ada file terlacak dihapus.

## Architecture dan UI responsibility evidence

| Layer | Bukti / batas |
| --- | --- |
| Page | Hanya class presentasi root yang diubah; komposisi dan koordinasi state tetap |
| Domain components | Stats, tabel, dan dialog mempertahankan props/emits/handler; perubahan class/ikon/label aksesibel |
| Shared UI | `SalesDialog.vue`, `.app-stat-card`, stylesheet presentasi legacy yang dipakai lintas menu |
| Composable / API / service / typed data | Tidak diedit; tidak diaudit ulang end-to-end pada pekerjaan styling ini |
| BRVS / BRVS-UI | Tidak menaikkan status arsitektur modul; tidak memindahkan business logic atau membuat Workspace baru |

## Validasi dan batas

- `npm.cmd run build`: pass, build produksi selesai dengan exit 0 melalui `cmd.exe /d /c` (wrapper PowerShell awal mengembalikan exit 1 saat warning native diarahkan ke log meski bundling selesai). Dua deklarasi tinggi Inventory setelah build client diperiksa terpisah menggunakan compiler Tailwind.
- `npm.cmd run validate:structure`: pass, 1.220 file asli, 0 failure; tanpa pemeriksaan hash.
- Parse/compile 819 SFC: pass.
- Kompilasi stylesheet akhir dengan `@tailwindcss/node`: pass, termasuk dua deklarasi tinggi kontrol Inventory 36px yang ditambahkan setelah build client.
- Inspeksi CSS hasil build: footer legacy memiliki display:flex, justify-content:flex-end, flex-wrap:wrap; field 36px; textarea auto; tombol primary dan kolom responsif terkompilasi.
- Pemeriksaan konten/script/binding file Vue yang diubah: pass.
- `git diff --check`: pass.
- `npm.cmd run typecheck`: gagal pada error existing `app/composables/useLanguages.ts:45` (TS2769, string status tidak sesuai union `active | inactive`); file tersebut tidak berubah.
- `test:sales`: tidak dijalankan; script tidak tersedia pada package.json saat ini.
- Browser desktop/390px/dark mode dan interaksi modal: belum dijalankan. Inventory browser computer-use kosong; upaya membuat tab `iab` menghasilkan `Browser is not available: iab`. Tidak mengklaim seluruh halaman konsisten secara visual atau seluruh flow terverifikasi.
- Arsip `legacy/static-source/` tidak tersedia pada checkout ini; konten dipertahankan terhadap source awal Git HEAD, tanpa klaim pencocokan ulang semua HTML/Netlify.

Delivery: branch `Rama`, **NOT COMMITTED**, **NOT PUSHED**; remote verification tidak dijalankan. Next check: visual desktop/390px/dark mode pada halaman berubah dan modal Inventory/Settings/Sales setelah browser tersedia.
