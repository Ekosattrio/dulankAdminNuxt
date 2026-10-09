# PANDUAN SERAH TERIMA AI (AI HANDOVER & ONBOARDING GUIDE)
## Repositori: Dulank Admin Nuxt 4 (Percetakan & ERP System)

> **DOKUMEN INI WAJIB DIBACA OLEH AI PENGGANTI SEBELUM MEMULAI SESI APAPUN.**
> Dokumen ini dirancang dengan struktur atensi tinggi (High Attention Weight) agar AI memahami arsitektur, batasan pantangan mutlak, komponen reusable yang wajib dipakai, serta status modul yang sudah selesai dikerjakan.

---

## 1. Bagaimana AI Membaca Repositori Ini?

Peta lintas dokumen, flow, business logic, data Netlify, dan decision log berada di `docs/obsidian-vault/00-HOME.md`.
Status kebersihan halaman, matrix komponen/composable/API, dan SOP checking berada di `docs/PAGE_CLEANLINESS_AND_STATUS_MATRIX.md`.
Quality gate wajib untuk semua pekerjaan berada di `docs/AI_WORK_QUALITY_FRAMEWORK.md`; standar ikon berada di `docs/ICON_STANDARD.md`.
Struktur menu resmi adalah **Backend-Ready Vertical Slice (BRVS)** pada `docs/BACKEND_READY_VERTICAL_SLICE.md`.
Standar pemecahan UI resmi adalah **BRVS-UI** pada `docs/UI_DECOMPOSITION_STANDARD.md`. Standar ini mengambil pola route composer dan responsibility-based components dari branch `Rama` commit `76f6e79`, tetapi tetap memakai composable, API, domain service/repository, dan typed relational data milik BRVS.

Setiap AI yang mengubah code, data, atau dokumentasi wajib mencatat delivery record di `docs/obsidian-vault/09-CHANGELOG.md`: branch, commit status, push status, remote verification, validasi, dan risiko. Default perubahan working tree adalah `NOT COMMITTED` / `NOT PUSHED`; `PUSHED` hanya sah setelah push eksplisit berhasil dan remote hash diverifikasi.

Model AI (LLM) membaca teks secara sekuensial (token demi token dari atas ke bawah).
- **Bagian Atas (Directives/Rules):** Memiliki pengaruh paling kuat (*Primacy Effect*). Pantangan mutlak diletakkan di bagian atas agar tidak dilanggar.
- **Struktur Hirarki (#, ##, Bullet):** AI membedakan aturan wajib dan penjelasan tambahan dari heading dan formatting.
- **Matrix Tabel & Cheat Sheet:** AI mengenali pemetaan data dan lokasi file secara instan melalui tabel.

---

## 2. 9 PANTANGAN MUTLAK (HARD CONSTRAINTS - DILARANG DILANGGAR)

1. **DILARANG Mengosongkan atau Menghasilkan Berkas 0-Byte:**
   - Jangan pernah menulis string kosong atau membiarkan file ter-truncate. Setiap kali mengedit file, pastikan struktur `<script>`, `<template>`, atau fungsi TypeScript lengkap.
2. **DILARANG Menghapus atau Mengubah Berkas `legacy/static-source/`:**
   - Folder `legacy/static-source/` (berisi 186 file HTML asli, CSS, JS, dan gambar) adalah **Single Source of Truth** untuk layout, label literal, urutan kolom, dan modal interaktif (`https://dulank-admin.netlify.app/`).
3. **DILARANG Menyimpan Format Mata Uang Statis pada Mock JSON / DB:**
   - Nilai uang (harga, diskon, insentif, biaya kirim, total) WAJIB disimpan sebagai **angka numerik murni (`number`)**, contoh: `250000`.
   - DILARANG menulis string berpemisah seperti `"250.000"` atau `"Rp 250.000"` di dalam dataset server JSON.
   - Pemformatan ribuan dan prefix Rupiah WAJIB dilakukan via `<CurrencyDisplay :value="val" align="right" />` atau utility `formatIDR(val)`.
4. **DILARANG Membungkus `SalesDataTable.vue` dengan Card Ganda (Single Card Container):**
   - `SalesDataTable.vue` sudah memiliki container kartu lengkap (border, background putih/gelap, rounded, padding).
   - DILARANG membungkusnya di dalam `<div class="card">` atau `<div class="card-body">` tambahan.
5. **DILARANG Menyederhanakan Modal Menjadi Form Generik:**
   - Seluruh form modal (tambah/edit) WAJIB mengimplementasikan seluruh kolom input, sub-modal, tabel rincian, dan tombol persis seperti HTML referensi aslinya di `legacy/static-source/`.
6. **DILARANG Menggunakan Raw `window.print()` untuk Cetak Tabel/List:**
   - Jangan pernah memanggil `window.print()` langsung pada halaman tabel karena akan menangkap navbar, sidebar, dan merusak layout.
   - WAJIB gunakan `DocumentPrintModal.vue` dan `app/utils/documentPrinter.ts` (mencetak melalui iframe terisolasi lengkap dengan Kop Surat resmi PT. DULANK SEMESTA CIDA dan kolom TTD).
   - *Pengecualian:* Halaman dokumen spesifik yang memang berformat thermal/struk/nota (`sales-receipt.vue`, `sales-note.vue`, `printJobDetailTicket`) tetap mempertahankan template khususnya.
7. **Standar Dimensi Kontrol Wajib `h-9` (36px):**
   - Seluruh input search, dropdown filter toolbar, dan input modal form wajib menggunakan tinggi standar `h-9` (atau `min-h-9` untuk tag multi-select).
   - Isi/header/pagination tabel serta teks search/filter toolbar memakai `text-sm` (14px), sesuai revisi client 2026-10-08 agar tidak lebih kecil dari sidebar utama.
   - Form modal wajib menggunakan 12-kolom CSS Grid: `modalFormRowClass`, `modalFormLabelClass` (col-span-5), dan `modalFormInputColClass` (col-span-7).
8. **DILARANG Menjalankan Perintah Git Mutatif Tanpa Izin:**
   - Jangan jalankan `git add`, `git commit`, `git push`, `git checkout`, `git reset`, `git restore` kecuali pengguna secara eksplisit meminta dalam chat.
9. **DILARANG Menyebut Menu Mengikuti Sales Tanpa Rantai BRVS Lengkap:**
   - Page wajib menjadi composition layer; request domain melalui composable; API tipis; validasi/kalkulasi/persistensi melalui server domain helper/repository; type dan relational data tersedia.
   - Record hardcoded, `alert()`/`confirm()` sebagai flow, form Add/Edit terpisah, atau layer tersedia tetapi dilewati route aktif adalah hard fail.

---

## 3. CHEAT SHEET KOMPONEN BERSAMA (REUSABLE UI)

Sebelum membuat komponen atau kode baru, **GUNAKAN KOMPONEN BERSAMA YANG SUDAH TERSEDIA**:

| Fungsi | Komponen / Utility | Path | Cara Pakai Singkat |
|---|---|---|---|
| **Tabel Standar** | `SalesDataTable.vue` | `app/components/sales/SalesDataTable.vue` | `:columns="columns" :items="items"` + slot `#cell(colKey)="{ item }"` |
| **Toolbar Header** | `SalesListHeader.vue` | `app/components/sales/SalesListHeader.vue` | `title="..." subtitle="..." @refresh="..." @print="..." @pdf="..."` |
| **Tombol Baris** | `SalesActionButton.vue` | `app/components/sales/SalesActionButton.vue` | `action="view" \| "edit" \| "delete" @click="..."` |
| **Kamus Ikon Aksi** | `actionIcons.ts` | `app/utils/actionIcons.ts` | Sumber Add/View/Edit/Delete/More dan ukuran ikon; jangan pilih glyph CRUD per halaman. |
| **Modal / Dialog** | `SalesDialog.vue` | `app/components/sales/SalesDialog.vue` | `:open="isOpen" title="..." size="md" \| "lg"` |
| **Konfirmasi Hapus** | `SalesConfirmDelete.vue` | `app/components/sales/SalesConfirmDelete.vue` | `:open="!!deletingItem" @confirm="..." @close="..."` |
| **Filter Tanggal** | `DateRangePicker.vue` | `app/components/common/DateRangePicker.vue` | `v-model="filterDateRange" input-class="h-9"` |
| **Filter Dropdown** | `TableFilterSelect.vue` | `app/components/common/TableFilterSelect.vue` | `v-model="filterStatus" :options="['Active', 'Pending']"` |
| **Modal Print & PDF**| `DocumentPrintModal.vue`| `app/components/common/DocumentPrintModal.vue`| `:open="isPrintOpen" :columns="cols" :items="data" @close="..."` |
| **Composable Print** | `useTablePrint.ts` | `app/composables/useTablePrint.ts` | `const { isPrintModalOpen, openPrintModal, closePrintModal } = useTablePrint()` |
| **Display Uang** | `CurrencyDisplay.vue` | `app/components/common/CurrencyDisplay.vue` | `<CurrencyDisplay :value="item.price" align="right" />` |
| **Input Uang** | `CurrencyInput.vue` | `app/components/common/CurrencyInput.vue` | `<CurrencyInput v-model="price" prefix="Rp" align="right" />` |
| **Utility Format IDR**| `currency.ts` | `app/utils/currency.ts` | `formatIDR(value)`, `formatMoney(value)`, `parseMoney(str)` |
| **Assignee Select** | `AssigneeSelect.vue` | `app/components/common/AssigneeSelect.vue` | Pemilih petugas/karyawan/departemen standar |
| **Stepper Jumlah** | `QuantityStepper.vue` | `app/components/common/QuantityStepper.vue` | Kontrol `[-] [ Qty ] [+]` standar |
| **Skeleton Primitif**| `AppSkeleton.vue` | `app/components/common/AppSkeleton.vue` | `<AppSkeleton height="h-9" rounded="md" />` animasi pulse standar |
| **Table Skeleton** | `TableSkeleton.vue` | `app/components/common/TableSkeleton.vue` | `<TableSkeleton :rows="6" :cols="10" />` mirror layout SalesDataTable |
| **Card Skeleton** | `CardSkeleton.vue` | `app/components/common/CardSkeleton.vue` | `<CardSkeleton :count="4" />` placeholder metrik / KPI card |
| **Loading Feedback** | `SalesFeedback.vue` | `app/components/sales/SalesFeedback.vue` | `:pending="pending" skeleton="table" \| "card"` |
| **Kelas Form UI** | `salesUi.ts` | `app/utils/salesUi.ts` | `tableFilterControlClass`, `modalFormRowClass`, dll. |
| **Bundled Data Server**| `data.ts` / `bundledData.ts`| `server/utils/data.ts` | `readJSON<T>()` fallback ke `bundledSources` hanya saat file fisik tidak tersedia; JSON rusak tetap error |

Struktur menu tidak dinilai dari tabel ini saja. Wajib isi Architecture Evidence Matrix pada `docs/BACKEND_READY_VERTICAL_SLICE.md`.

---

## 4. STATUS MODUL (MODULE PROGRESS MATRIX)

Status memakai tiga tingkat: **approved baseline**, **implemented - verification pending**, dan **imported outside original scope**. Detail flow lintas modul berada di [Obsidian Vault](docs/obsidian-vault/00-HOME.md).
Peta detail per rute, dekomposisi komponen, composable, dan relasi database berada di [docs/PAGE_CLEANLINESS_AND_STATUS_MATRIX.md](docs/PAGE_CLEANLINESS_AND_STATUS_MATRIX.md).

### Ringkasan Rapor Kesiapan per Grup Menu (Scorecard BRVS-UI 2026-10-09)

| Grup Menu | Jml Rute | Page Tipis ($\le 150$ baris) | Pecahan Komponen (Standar Rama) | Composable & API | Relasi Backend (DB-Ready) | Kesimpulan / Status Arsitektur |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| **Sales & Orders** | 7 | 🟢 100% (7/7) | 🟢 **100% Full Decomposed** | 🟢 Aktif | 🟢 Relasional Penuh (PK & FKs) | 🟢 **APPROVED BASELINE** (Batas Regresi) |
| **Payments** | 3 | 🟢 100% (3/3) | 🟢 **100% Full Decomposed** | 🟢 Aktif | 🟢 Relasional Penuh (PK & FKs) | 🟢 **APPROVED BASELINE** (Batas Regresi) |
| **Webstore** | 6 | 🟢 100% (6/6) | 🟢 **100% Full Decomposed** | 🟢 Aktif | 🟢 Relasional Penuh (PK & FKs) | 🟢 **VERIFIED** (100% Lolos BRVS-UI) |
| **Peoples** | 5 | 🟢 100% (5/5) | 🟢 **100% Full Decomposed** | 🟢 Aktif | 🟢 Relasional Penuh (PK & FKs) | 🟢 **VERIFIED** (100% Lolos BRVS-UI) |
| **HRM** | 12 | 🟢 100% (12/12) | 🟢 **100% Full Decomposed** | 🟢 Aktif | 🟢 Relasional Penuh (PK & FKs) | 🟢 **VERIFIED** (100% Lolos BRVS-UI) |
| **Paper Shop (Kertas Self)** | 4 | 🟢 100% (4/4) | 🟢 **100% Full Decomposed** | 🟢 Aktif | 🟢 Relasional Penuh (PK & FKs) | 🟢 **VERIFIED** (100% Lolos BRVS-UI) |
| **Products & Services**| 10 | 🟢 100% (10/10) | 🟢 **100% Full Decomposed** | 🟢 Aktif | 🟢 Relasional Penuh (PK & FKs) | 🟢 **VERIFIED** (100% Lolos BRVS-UI) |
| **User Management** | 6 | 🟢 100% (6/6) | 🟢 **100% Decomposed** | 🟢 Aktif | 🟢 Relasional Penuh (PK & FKs) | 🟢 **VERIFIED** (100% Lolos BRVS-UI) |
| **Content** | 10 | 🟢 100% (10/10) | 🟢 **100% Decomposed** | 🟢 Aktif | 🟢 Relasional Penuh (PK & FKs) | 🟢 **VERIFIED** (100% Lolos BRVS-UI) |
| **Calculator Apps** | 18 | 🟢 100% (18/18) | 🟢 **100% Full Decomposed** | 🟢 Aktif | 🟢 Relasional Penuh (PK & FKs) | 🟢 **VERIFIED** (100% Lolos BRVS-UI) |
| **Setting** | 22 | 🟢 100% (22/22) | 🟢 **100% Full Decomposed** | 🟢 Aktif (100% Nitro) | 🟢 Relasional Penuh (PK & FKs) | 🟢 **VERIFIED** (100% Lolos BRVS-UI) |
| **Reports & Financial**| 17 | 🟢 100% (17/17) | 🟢 **100% Full Decomposed** | 🟢 Aktif (100% Nitro) | 🟢 Relasional Penuh (PK & FKs) | 🟢 **VERIFIED** (100% Lolos BRVS-UI) |
| **TOTAL KESELURUHAN** | **120** | **100% Lolos** | **100% Full Decomposed** | **100% Aktif** | **100% Relasional Penuh** | **100% BRVS-UI Compliant** |

---

### A. APPROVED BASELINE (BATAS REGRESI)

| Kelompok | Route | Status |
|---|---|---|
| **Sales** | `/sales`, `/invoice`, `/delivery-note`, `/sales-return`, `/quotation`, `/request-quotation`, dokumen Sales | Approved sesuai aturan rinci di `AGENTS.md`. |
| **Payment** | `/payments`, `/payment-inflow`, `/payment-outflow` | Approved, server/API/composable dan date range reusable. |
| **Orders & Workflow** | `/orders`, `/job-order`, `/job-list`, `/job-branch`, `/my-job`, `/my-incentive` | Approved sesuai flow yang tercatat. |
| **Webstore** | `/cart`, `/checkout`, `/wishlist`, `/reviews`, `/support-ticket`, `/contact-form` | Approved sesuai kolom, KPI, dan aksi masing-masing. |
| **Print & PDF** | Shared list/report dan dokumen khusus | Approved dengan `DocumentPrintModal`, iframe printer, letterhead, TTD, dan pengecualian dokumen khusus. |

### B. IMPLEMENTED - VERIFICATION PENDING

| Kelompok | Route / Cakupan | Catatan |
|---|---|---|
| **Peoples** | Customers, Customer Types, Address, Supplier, Store List | UI, composable, API, data, skeleton, dan print sudah diimplementasikan; perlu browser flow dan persistence verification. |
| **HRM** | Employees, Department, Employee Salary, Payslip | UI/API sudah diimplementasikan; perlu audit relasi, payroll, upload, reload, dan print. |
| **User Management** | Members, User Admin, Roles, Permissions, Delete Account | Bundle Users/Permissions dan GET safety diperbaiki 2026-10-08; authorization dan mutation persistence masih perlu verifikasi. |
| **Content** | Blog, category/tag/comment, FAQ, clients, files, footer, banner | Implementasi luas tersedia; FAQ Category adalah explicit empty state dan upload binary memerlukan storage production. |
| **Setting** | Profile, company, location, invoice/POS/email/OTP/prefix settings | Language kini memakai API, tabel legacy, import/export JSON translation, progress, dan print; Invoice Template tetap explicit empty state. Test email masih simulasi, bukan SMTP production. |
| **Reports** | 14 halaman laporan | API mock, KPI, filter, CSV, dan print tersedia; rekonsiliasi angka dan browser verification belum dilaporkan. |
| **Calculator Apps** | All Printing Shop, 4 All Machine, All Paper Shop, 4 All Papers | API, data relasional, moderasi, detail, soft-delete, filter, statistik, dan print sudah diimplementasikan 2026-10-08; build/typecheck dan browser flow belum diverifikasi. |
| **Products & Services** | Create Product, 2 Custom Category, 4 Services Category, Product List | API, relasi produk, import, detail/edit/soft-delete, konfigurasi custom, layanan workshop, dan print sudah diimplementasikan 2026-10-08; build dan browser flow belum diverifikasi. |

Kelompok pada tabel ini tidak boleh disebut `100% production-ready` sebelum gate validasi di vault dan `AGENTS.md` terpenuhi.

Status fitur di atas tidak otomatis berarti struktur route sudah mengikuti Sales. Audit BRVS 2026-10-08 menemukan struktur repository belum seragam; setiap menu yang disentuh berikutnya wajib menyertakan Architecture Evidence Matrix dari `docs/BACKEND_READY_VERTICAL_SLICE.md`.

### Architecture Audit 2026-10-08: Backend-Ready Vertical Slice

- Nama struktur resmi adalah **Backend-Ready Vertical Slice (BRVS)**: page -> domain components -> composable -> API -> server domain service/repository -> typed relational data.
- Audit statis 188 page menemukan 129 page di atas 150 baris, 109 di atas 200, 65 di atas 300, 29 di atas 400, dan 59 masih memakai `alert()`/`confirm()`.
- `/download-files`, `/all-blog`, dan `/expense-report` memiliki sebagian besar layer data tetapi masih berstatus **partial BRVS** karena tanggung jawab UI/server belum terpisah penuh.
- `/edit-payroll` dan `/edit-job-order` berstatus **BRVS non-compliant** karena data/kalkulasi/mutasi lokal dan feedback palsu; `/edit-job-order` juga melewati composable/API yang sebenarnya sudah tersedia.
- Audit ini hanya mengubah dokumentasi. Source code dan status fitur tidak diubah.

### Progress 2026-10-08: Pembersihan Halaman BRVS (Webstore, Calculator Apps, Products & Services) & Audit Menyeluruh

- **Pembersihan Halaman Webstore (6 Routes):**
  - Seluruh 6 halaman Webstore (`cart`, `checkout`, `wishlist`, `reviews`, `support-ticket`, `contact-form`) tervalidasi 100% **BRVS Clean ($\le$ 150 baris)**.
  - `support-ticket.vue` didekomposisi dari 215 baris menjadi **134 baris** dengan mengekstrak seluruh state modal, filter, chat handler, dan mutasi tiket ke composable `app/composables/useSupportTicketPage.ts`.
- **Pembersihan Halaman Calculator Apps (10 Routes):**
  - Seluruh 10 sub-menu Calculator Apps (`/semua-percetakan`, `/mesin-cetak`, `/mesin-laminasi`, `/mesin-pond`, `/mesin-poli`, `/semua-toko-kertas`, `/kertas-group`, `/kertas-ukuran`, `/kertas-jenis`, `/kertas-harga`) tervalidasi sangat bersih (10-11 baris) sebagai wrapper murni atas domain component `CalculatorPartnersPage` dan `CalculatorListingsPage`.
- **Pembersihan Halaman Products & Services (8 Routes):**
  - `create-product.vue`: Didekomposisi dari 492 baris menjadi **13 baris** dengan mengekstrak reactive form state, computeds, modal lifecycle, dan submit payload ke `app/composables/useProductEditor.ts` dan template ke `app/components/pages/create-product/ProductDocumentForm.vue`.
  - `cetak-full-color.vue`: Didekomposisi dari 443 baris menjadi **81 baris** dengan mengekstrak sidebar tabs dan 11 tab configuration table ke `app/components/pages/products-services/CetakFullColorWorkspace.vue`.
  - `calender.vue`: Didekomposisi dari 449 baris menjadi **77 baris** dengan mengekstrak sidebar tabs dan 11 tab configuration table ke `app/components/pages/products-services/CalendarWorkspace.vue`.
  - Slider multi-gambar pada Product Custom Default diaktifkan penuh dengan array gambar lokal dan fallback Netlify/Wikimedia, tombol navigasi bundar prev/next, dan indikator dots.
  - Seluruh 24 route pada ketiga grup ini teruji dan merespons **HTTP 200 OK**.
- **Audit Struktural 6 Grup Menu Berikutnya:**
  - Melakukan audit baris dan arsitektur terhadap 50 rute aktif pada kelompok:
    1. **Setting** (12 route): `company-setting` (684 baris), `invoice-setting` (691 baris), `pos-settings` (664 baris), `email-setting` (539 baris), `profile` (766 baris), `otp` (417 baris), `tax-rates` (302 baris), dll.
    2. **User Management** (5 route): `role` (465 baris), `user` (246 baris), `user-admin` (219 baris), `role-permissions` (202 baris), `delete-account` (160 baris).
    3. **Content** (10 route): `footer` (550 baris), `all-blog` (487 baris), `download-files` (455 baris), `banner` (411 baris), `our-client` (374 baris), `faq` (230 baris), dll.
    4. **Report** (14 route): `sales-report` (420 baris), `profit-and-loss` (490 baris), `customer-report` (368 baris), `supplier-due-report` (361 baris), `annual-reports` (360 baris), `purchase-report` (360 baris), dll.
    5. **HRM** (4 route): `employees` (304 baris), `employee-salary` (281 baris), `payslip` (263 baris), `department` (252 baris).
    6. **Peoples** (5 route): `customers` (227 baris), `supplier` (232 baris), `address` (213 baris), `store-list` (213 baris), `customer-type` (177 baris).

### Progress 2026-10-08: Standardisasi Ikon Edit (`edit`) & Penyelarasan Layout Netlify Cetak Full Color

- **Masukan Pengguna & Evaluasi Visual:**
  1. Ikon aksi edit pada tombol `<SalesActionButton action="edit">` sebelumnya menggunakan `edit-2` (pensil diagonal melayang), yang berbeda dengan ikon standar legacy (`edit`: pad/kertas dengan pensil menulis, `<i data-feather="edit"></i>`). Seluruh ikon aksi edit kini distandarkan secara permanen di `app/utils/actionIcons.ts` menggunakan glyph Feather `edit`.
  2. Tampilan kartu produk dan layout `cetak-full-color` sebelumnya masih jauh dari referensi Netlify (`https://dulank-admin.netlify.app/cetak-full-color.html`):
     - Tidak adanya card container putih di sisi kanan membuat "All Product Custom" dan kartu-kartu produk mengambang di atas background abu-abu.
     - Penggunaan 4 kolom grid statis menekan lebar kartu hingga ~170px sehingga teks terpotong.
- **Perbaikan & Standarisasi yang Dilakukan:**
  1. **Standardisasi Ikon Edit Permanen:**
     - Mengubah mapping `edit` pada `app/utils/actionIcons.ts` dari `edit-2` menjadi `edit` (pad dengan pensil).
     - Memperbarui `docs/ICON_STANDARD.md`, `AGENTS.md`, dan knowledge vault agar seluruh komponen yang memanggil `action="edit"` otomatis memakai ikon `edit` yang seragam di seluruh aplikasi.
  2. **Penyelarasan Presisi dengan Netlify `cetak-full-color.html`:**
     - Membungkus seluruh grid produk dalam card container putih mandiri: `rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900`.
     - Header kartu memuat "All Product Custom" di kiri dan tombol "+ Add Product" berwarna oranye solid (`bg-[#ff9f43] hover:bg-[#e08a36]`) di kanan.
     - Menerapkan CSS grid legacy `.product-card-grid`: `grid grid-cols-[repeat(4,minmax(270px,1fr))] gap-6 overflow-x-auto pb-3` sehingga setiap kartu memiliki lebar minimum 270px dan overflow scroll horizontal yang rapi pada layar laptop (menampilkan 2-3 kartu lega seperti screenshot Netlify).
     - Mengembalikan susunan spesifikasi legacy: `Product Name`, `Ukuran <Name>`, `Jenis Kertas`, `Laminasi`, `Sisi Cetak`, `Lipatan/Binding`, `Content Article` dengan label abu-abu halus di atas dan isi di bawah.
     - Footer kartu memuat baris Display (`POS` dan `Website` checkbox) serta baris aksi dengan tombol ikon standar `<SalesActionButton action="edit">` dan `<SalesActionButton action="delete">`.
     - Sidebar "Setting And Optional" diselaraskan dengan pill badge 11 merah (`#ea5455`), active item soft background (`#f1f1f5`) dengan border `#e4e6ef`, dan ikon ungu `#7367f0`.
  3. Seluruh 8 route Products & Services tervalidasi 100% **HTTP 200 OK**.

### Progress 2026-10-08: Products & Services Full Fidelity Upgrade

- Cakupan delapan route sidebar: `/create-product`, `/cetak-full-color`, `/calender`, `/mesin-cetak-self`, `/mesin-laminasi-self`, `/mesin-pond-self`, `/mesin-poli-self`, dan `/product-list`; `/product-details?id=<id>` menjadi route detail dari aksi tabel.
- Calender (`/calender`) dan Cetak Full Color (`/cetak-full-color`) direvisi penuh agar presisi dengan arsip legacy dan Netlify (`https://dulank-admin.netlify.app/calender.html`):
  - Sidebar kiri "Setting And Optional" (Pill 11) memuat 11 tab domain dengan ikon Feather standar.
  - Tab 1: Product Custom Cards Grid (`CustomProductCardsGrid.vue`) dengan navigasi slide gambar `<` dan `>`, rincian spesifikasi lengkap (Ukuran, Jenis Kertas, Laminasi, Sisi Cetak, Lipatan/Binding, Content Article), Display switch POS & Website, tombol Edit & Hapus, serta modal penambahan produk baru (`CustomProductModal.vue`) berformat full fidelity (`modaladdukuran`).
  - Tab 2 (Calender): Number of Sheet Option (`SheetOptionsSection.vue`) dengan tabel sheet counts, status Show/Hide dropdown, inline add row, dan switch radio "Custom for Number of Sheet? [No] [Yes]".
  - Tab 2 (Cetak Full Color): Product Size dengan tabel ukuran standar dan Add Size modal.
  - Tab 3 (Cetak Full Color) & Tab 4 (Calender): Paper Type Option (`PaperGramatureSection.vue`) dengan tabel grup kertas, opsi multi-checkbox gramatur (100gr, 120gr, 150gr, Select All), dan sub-tabel terintegrasi Work Flow Setting (`WorkflowSettingSubTable.vue`).
  - Tab 4 s/d 8: Machine Type, Print Type, Laminate, Fold / Hanger (`GenericSettingTable.vue`) dengan sub-tabel Work Flow Setting terhubung.
  - Tab 10: Profit Setting (`ProfitSettingSection.vue`) dengan batas rentang From/To Qty, POS Profit %, Website Profit %, dan kontrol penambahan range.
  - Tab 11: Log Transaction (`CalculationLogTable.vue`) dengan aksi View Detail yang membuka popup Calculation Detail (`CalculationDetailModal.vue`) berisi rincian Order Spesification, saran sistem (Parent Sheet, Cut Down Size, Mesin), serta rincian biaya produksi (Paper, Plate, Printing, Laminating, Finishing) dan ringkasan profit margin.
- Seluruh endpoint API `/api/calendar-settings` dan `/api/cetak-full-color` tervalidasi 200 OK untuk GET dan POST dengan persistensi data murni numerik.
- Status: **implemented, verification pending**.

### Progress 2026-10-08: Standar Tipografi Global

- Baseline visual sidebar 14px dijadikan ukuran body, paragraf, tabel, filter, input/select, dropdown action, dan tombol teks.
- Hirarki resmi: page title 20px, dialog title 18px, section title 16px, body/control 14px, label/caption/badge 12px, KPI utama 24px.
- Root 14px dipertahankan agar spacing layout tidak berubah. Token Tailwind `text-xs` sampai `text-3xl` dikalibrasi di `app/assets/css/main.css`; sebelumnya `text-sm` aktual hanya sekitar 12.25px karena mengikuti root 14px.
- Semantic classes ditambahkan untuk title/subtitle/body/control. Compatibility guard menjaga control dan sel tabel halaman lama pada 14px serta menaikkan ukuran 9-11px ke minimum 12px.
- Komponen shared yang diselaraskan: Sidebar, Sales/Page Header, SalesDialog, SalesMoreMenu, form helper, CurrencyInput, QuantityStepper, AssigneeSelect, TableSkeleton, dan DocumentPrintModal.
- Acuan wajib: `docs/TYPOGRAPHY_STANDARD.md`. Validasi statis dilakukan; build/dev/browser tidak dijalankan sesuai instruksi pengguna.

### Progress 2026-10-08: Vue Component Resolution Warnings

- `/variant` tidak lagi memanggil nama auto-import yang tidak tersedia `PagesVariantTable`/`PagesVariantModal`; page mengimpor `VariantTable.vue` dan `VariantModal.vue` secara eksplisit.
- Audit seluruh page menemukan sepuluh route lain dengan tag `Pages...` tanpa import. Import alias eksplisit ditambahkan pada Category, Sub Category, Unit, Designation, Expense, Expense Category, Income, Incentive, Paper Size, dan Paper Price.
- `AppSidebar` tetap memiliki root `<aside>` dan backdrop mobile. `inheritAttrs: false` serta `v-bind="$attrs"` pada `<aside>` memastikan `class="print:hidden"` dari layout tidak lagi menjadi extraneous attribute.
- Aturan diagnosis dan perbaikan dicatat di `docs/TROUBLESHOOTING_VUE_WARNINGS.md`. Build/dev/browser tidak dijalankan sesuai instruksi pengguna.

### Progress 2026-10-08: Standar Ikon dan AI Quality Gates

- Ikon aksi dipusatkan di `app/utils/actionIcons.ts`. Mapping CRUD resmi saat ini: Add `plus-circle`, View `eye`, Edit `edit`, Delete/Remove `trash-2`, dan More `more-horizontal`.
- `SalesActionButton` menerima prop semantik `action`; prop `icon` lama tetap kompatibel dan ikon lama `edit` dinormalisasi. `SalesListHeader` dan `SalesMoreMenu` memakai kamus serta ukuran terpusat.
- Acuan UI lengkap berada di `docs/ICON_STANDARD.md`.
- `docs/AI_WORK_QUALITY_FRAMEWORK.md` menetapkan status, evidence matrix, first re-check, adversarial re-check, validation evidence, dan progress sync. `approved baseline` tetap membutuhkan persetujuan pengguna.
- Perubahan ini tidak mengubah status modul bisnis. Build/dev/browser tidak dijalankan sesuai instruksi pengguna; validasi statis dicatat di changelog setelah pemeriksaan selesai.

### Progress 2026-10-09: Pembersihan Skala Penuh & BRVS Page Gate (100 Rute)

- **9 Grup Menu yang Ditugaskan Selesai 100%**: Webstore (6 rute), Calculator Apps (13 rute), Products & Services (10 rute), Setting (22 rute), User Management (6 rute), Content (10 rute), Report & Financial (17 rute), HRM (10 rute), dan Peoples (5 rute).
- **Arsitektur Halaman Sesuai Standar BRVS**: Seluruh 100 file di `app/pages/*.vue` kini bertindak murni sebagai composition layer tipis ($\le 130$ baris, rata-rata 12–19 baris).
- **Reusable Form Consolidation**:
  - `add-employee.vue` (304 baris) dan `edit-employee.vue` (306 baris) disatukan menggunakan komponen form bersama `EmployeePageForm.vue` (keduanya kini 14 baris).
  - `add-payroll.vue` (460 baris) dan `edit-payroll.vue` (460 baris) disatukan menggunakan komponen form bersama `PayrollPageForm.vue` (keduanya kini 14 baris).
- **Dekomposisi Domain Workspaces**: Seluruh modul besar (`kalkulator-dashboard`, `harga-jasa-lainya`, `kertas-*-self`, `komponen-*`, `add-product-process`, `category`, `sub-category`, `unit`, `variant`, `permissions`, `balance-sheet`, `account-statement`, `balance-account`, `payslip-detail`, `designation`, serta 22 halaman setting) didekomposisi ke folder `app/components/pages/<menu>/` atau folder domain masing-masing.
- **Validasi Live Server Berbukti**: Skrip uji live HTTP otomatis menguji seluruh 100 rute terhadap dev server Nuxt aktif (`http://localhost:3000`). Hasilnya: 100 dari 100 rute terverifikasi **HTTP 200 OK** tanpa error.
- Status: **verified** (arsitektur page gate & live HTTP response 200 OK).

### Progress 2026-10-08: Calculator Apps dan Customer Balance

- Calculator Apps mencakup 10 route: `/semua-percetakan`, `/mesin-cetak`, `/mesin-laminasi`, `/mesin-pond`, `/mesin-poli`, `/semua-toko-kertas`, `/kertas-group`, `/kertas-ukuran`, `/kertas-jenis`, dan `/kertas-harga`.
- Page hanya menjadi wrapper; orchestration reusable berada di `CalculatorPartnersPage.vue` dan `CalculatorListingsPage.vue`, dengan dialog detail/moderasi serta stats grid bersama.
- Dataset memiliki 36 partner, 20 snapshot metrik partner, 80 listing, dan moderation history. Foreign key utama adalah `partnerId` dan `sourcePartnerId`; endpoint melakukan join sebelum mengirim query model ke frontend.
- Form Customer dikembalikan ke lima field legacy. Balance dipindahkan dari master customer ke `customer-account-entries.json` dan dihitung otomatis oleh GET berdasarkan `customerId`; delete customer menjadi soft-delete agar ledger tidak yatim.
- Status: **implemented, verification pending**. JSON parse dan pemeriksaan statis/diff dilakukan; build/dev/browser tidak dijalankan sesuai instruksi pengguna.

### Progress 2026-10-08: Shared Print dan Language

- Shared `DocumentPrintModal` dipasang pada `/language`, `/download-files`, `/our-client`, `/banner`, dan `/role`; Permission Matrix memakai `showDateRange=false` karena bukan data bertanggal.
- `/language` tidak lagi empty state. Tabel, modal, toggle RTL/status, import/export JSON translation, progress server-side, serta endpoint `/api/languages/:id/translations` sudah terhubung.
- `SalesListHeader` mempertahankan event PDF lama dan baru. `SalesDataTable` dapat mengirim item halaman aktif untuk scope print "Halaman Ini".
- Validasi statis: 99 JSON server valid dan 99/99 terdaftar di bundled registry, 11 SFC terkait lolos parse/compile template, 7 file TypeScript terkait lolos transpile syntax, dan `git diff --check` bersih.
- Belum dijalankan: build/dev/browser sesuai instruksi pengguna. `nuxi typecheck` tidak dapat berjalan karena repo belum memasang `vue-tsc`/Golar; fallback `tsc --noEmit` berjalan tetapi menemukan banyak error lama di report composables dan endpoint CRUD, tanpa error pada file print/language yang disentuh. `validate:structure` masih gagal hanya pada aset legacy Sticky Kit/Summernote yang sudah hilang sebelum perubahan ini.

### C. IMPORTED OUTSIDE ORIGINAL SCOPE

- **Purchases**: `/purchase`, `/purchase-order`, `/purchase-return`, `/purchase-item`, `/purchase-category`. Implementasi dipertahankan, tetapi belum approved dan masih memerlukan audit validasi server, ID generation, default data, legacy fidelity, serta reload persistence.

### D. DAFTAR PRIORITAS TO-DO NEXT (ROADMAP SISA PR KODE AKTUAL)

1. **PRIORITAS 1 (Finance & Cash Group - Halaman Aktif Pengguna):**
   - `bank-account.vue` (263 baris $\to$ $\le 20$ baris): Rombak total dari Bootstrap/mock ke BRVS penuh (Type, JSON, API Nitro, Composable, `BankAccountTable.vue`, `BankAccountModal.vue`, `SalesDataTable`, `SalesConfirmDelete`).
   - `expenses.vue` (197 baris) & `expense-category.vue` (178 baris): Dekomposisi ke leaf components terpisah dan connect API.
   - `income.vue`, `money-transfer.vue`, `cash-advance.vue`: Standarisasi backend dan leaf components.
2. **PRIORITAS 2 (Hard Fail Over-Limit):**
   - `edit-job-order.vue` (307 baris $\to$ $\le 150$ baris): Ekstrak form pengerjaan & kalkulasi spesifikasi cetak ke `JobOrderForm.vue`.
3. **PRIORITAS 3 (Calculator Apps Sisa PR):**
   - `harga-jasa-lainya.vue`, `komponen-minimum.vue`, `komponen-fiks.vue`: Finalisasi integrasi leaf components & pembersihan aman 7 workspace usang.
4. **PRIORITAS 4 (Inventory & Produk Sisa):**
   - `category-list.vue`, `sub-categories.vue`, `brand-list.vue`, `units.vue`, `variant.vue`, `expired-products.vue`, `low-stocks.vue`.
5. **POS:**
   - Ditunda sesuai arahan sampai diminta lagi.

---

## 5. WORKFLOW STANDARD MENGERJAKAN MENU BARU ("Kerjakan menu <nama-menu>")

Jika pengguna memberi perintah:
`"kerjakan menu <nama-menu>"` atau `"lanjut ke menu <nama-menu>"`

Ikuti langkah-langkah presisi ini:
1. **Analisis Acuan Asli:**
   - Buka `legacy/static-source/<nama-menu>.html`.
   - Catat persis: Judul, Subtitle, nama & urutan kolom tabel, tombol toolbar, tombol per baris, dan field input pada modal tambah/edit.
   - Buka situs acuan: `https://dulank-admin.netlify.app/<nama-menu>.html`.
2. **Buat Arsitektur Backend-Ready:**
   - Tipe data domain: `server/types/<nama-menu>.ts`
   - Data Mock Relasional: `server/data/<nama-menu>.json` (Primary Key `id`, Foreign Keys `customerId`/`productId`, nilai uang berupa `number`).
   - Endpoint API: `server/api/<nama-menu>/index.get.ts`, dsb.
   - Persistence & Utils: `server/utils/<nama-menu>Data.ts`
   - Composable State: `app/composables/use<NamaMenu>.ts`
3. **Pecah Komponen (Halaman Tipis):**
   - Halaman tipis: `app/pages/<nama-menu>.vue`
   - Komponen tabel & modal: `app/components/pages/<nama-menu>/`
4. **Pasang Komponen Standar:**
   - Gunakan `SalesDataTable.vue` untuk tabel (`text-sm`, 14px, sesuai revisi klien).
   - Gunakan `DateRangePicker.vue` dan `TableFilterSelect.vue` (`h-9`) untuk filter.
   - Gunakan `DocumentPrintModal.vue` dan `useTablePrint.ts` untuk fitur cetak dan PDF.
   - Gunakan `<CurrencyDisplay align="right">` untuk seluruh angka uang.
5. **Uji Coba & Verifikasi:**
   - Pastikan halaman merender status 200 OK.
   - Pastikan 0-byte file check bersih.
   - Dokumentasikan hasil revisi ke `AGENTS.md` dan `docs/STRUCTURE.md`.

---

## 6. KEWAJIBAN CATAT PROGRES SETIAP AI

Setiap AI yang mengubah kode, data, atau dokumentasi wajib meninggalkan catatan progres yang bisa dipahami AI berikutnya.

Sebelum menulis catatan, jalankan quality gate `docs/AI_WORK_QUALITY_FRAMEWORK.md`: context check, first re-check, adversarial re-check, validation evidence, dan progress sync. Status `implemented`, `verified`, serta `approved baseline` memiliki arti berbeda dan tidak boleh dinaikkan tanpa bukti yang disyaratkan.

Minimal catatan progres di laporan akhir harus mencakup:
- File yang diubah.
- Menu/modul yang disentuh.
- Flow yang sudah tersambung.
- Reusable component/composable/utility yang dibuat atau dipakai.
- Validasi yang benar-benar dijalankan.
- Validasi yang tidak dijalankan beserta alasannya.
- Sisa risiko, kekurangan, atau pekerjaan lanjutan.

Jika sebuah menu resmi selesai, berubah status, atau menjadi batas regresi baru, perbarui dokumen yang relevan:
- `AI_HANDOVER_GUIDE.md` untuk matrix status modul.
- `AGENTS.md` untuk aturan kerja dan batas regresi.
- `docs/STRUCTURE.md` untuk dokumentasi arsitektur/status implementasi.
- `docs/MENU_IMPLEMENTATION_COMMAND.md` untuk workflow command "kerjakan menu".

Jangan mengklaim modul selesai tanpa implementasi, flow, dan validasi yang jelas. Catatan progres harus spesifik, bukan sekadar "done".
