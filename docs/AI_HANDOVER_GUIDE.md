# PANDUAN SERAH TERIMA AI (AI HANDOVER & ONBOARDING GUIDE)
## Repositori: Dulank Admin Nuxt 4 (Percetakan & ERP System)

> **DOKUMEN INI WAJIB DIBACA OLEH AI PENGGANTI SEBELUM MEMULAI SESI APAPUN.**
> Dokumen ini dirancang dengan struktur atensi tinggi (High Attention Weight) agar AI memahami arsitektur, batasan pantangan mutlak, komponen reusable yang wajib dipakai, serta status modul yang sudah selesai dikerjakan.

---

## 1. Bagaimana AI Membaca Repositori Ini?

Model AI (LLM) membaca teks secara sekuensial (token demi token dari atas ke bawah).
- **Bagian Atas (Directives/Rules):** Memiliki pengaruh paling kuat (*Primacy Effect*). Pantangan mutlak diletakkan di bagian atas agar tidak dilanggar.
- **Struktur Hirarki (#, ##, Bullet):** AI membedakan aturan wajib dan penjelasan tambahan dari heading dan formatting.
- **Matrix Tabel & Cheat Sheet:** AI mengenali pemetaan data dan lokasi file secara instan melalui tabel.

---

## 2. 8 PANTANGAN MUTLAK (HARD CONSTRAINTS - DILARANG DILANGGAR)

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
   - Form modal wajib menggunakan 12-kolom CSS Grid: `modalFormRowClass`, `modalFormLabelClass` (col-span-5), dan `modalFormInputColClass` (col-span-7).
8. **DILARANG Menjalankan Perintah Git Mutatif Tanpa Izin:**
   - Jangan jalankan `git add`, `git commit`, `git push`, `git checkout`, `git reset`, `git restore` kecuali pengguna secara eksplisit meminta dalam chat.

---

## 3. CHEAT SHEET KOMPONEN BERSAMA (REUSABLE UI)

Sebelum membuat komponen atau kode baru, **GUNAKAN KOMPONEN BERSAMA YANG SUDAH TERSEDIA**:

| Fungsi | Komponen / Utility | Path | Cara Pakai Singkat |
|---|---|---|---|
| **Tabel Standar** | `SalesDataTable.vue` | `app/components/sales/SalesDataTable.vue` | `:columns="columns" :items="items"` + slot `#cell(colKey)="{ item }"` |
| **Toolbar Header** | `SalesListHeader.vue` | `app/components/sales/SalesListHeader.vue` | `title="..." subtitle="..." @refresh="..." @print="..." @pdf="..."` |
| **Tombol Baris** | `SalesActionButton.vue` | `app/components/sales/SalesActionButton.vue` | `icon="eye" \| "trash-2" \| "edit" @click="..."` |
| **Modal / Dialog** | `SalesDialog.vue` | `app/components/sales/SalesDialog.vue` | `:open="isOpen" title="..." size="md" \| "lg"` |
| **Konfirmasi Hapus** | `SalesConfirmDelete.vue` | `app/components/sales/SalesConfirmDelete.vue` | `:open="!!deletingItem" @confirm="..." @close="..."` |
| **Filter Tanggal** | `DateRangePicker.vue` | `app/components/common/DateRangePicker.vue` | `v-model="filterDateRange" input-class="h-9"` |
| **Filter Dropdown** | `TableFilterSelect.vue` | `app/components/common/TableFilterSelect.vue` | `v-model="filterStatus" :options="['Active', 'Pending']"` |
| **Modal Print & PDF**| `DocumentPrintModal.vue`| `app/components/common/DocumentPrintModal.vue`| `:open="isPrintOpen" :columns="cols" :items="data" @close="..."` |
| **Composable Print** | `useTablePrint.ts` | `app/composables/useTablePrint.ts` | `const { isPrintModalOpen, openPrintModal, closePrintModal } = useTablePrint()` |
| **Display Uang** | `CurrencyDisplay.vue` | `app/components/common/CurrencyDisplay.vue` | `<CurrencyDisplay :value="item.price" align="right" />` |
| **Input Uang** | `CurrencyInput.vue` | `app/components/common/CurrencyInput.vue` | `v-model="form.price" class="h-9"` (auto pemisah ribuan) |
| **Icon Standar** | `FeatherIcon.vue` | `app/components/common/FeatherIcon.vue` | `<FeatherIcon name="edit" :size="14" />` |
| **Skeleton Loader**| `TableSkeleton.vue` | `app/components/sales/TableSkeleton.vue` | `<TableSkeleton :cols="8" :rows="5" />` |
| **Alert/Konfirmasi**| `SweetAlert2` helper | `app/utils/alert.ts` | `showSuccessAlert('Berhasil!')`, `showConfirmDialog()` |

---

## 4. MATRIX STATUS MODUL (COMPLETION MATRIX)

### A. MODUL RAMPUNG 100% & PRODUCTION-READY (STATUS: HIJAU)
| Modul | Halaman Route | Fitur Kunci & Standarisasi |
|---|---|---|
| **Sales** | `/sales` | In-memory filtering, tabel 13 kolom, modal Add/Edit Sales multi-item, Print Kop Surat resmi, view payment history. |
| **Invoice** | `/invoice`, `/invoice-details` | Filter tanggal, cetak invoice formal, preview dokumen A4, status pembayaran (Paid/Unpaid/Partial). |
| **Delivery Note** | `/delivery-note`, `/delivery-note-detail` | Surat jalan resmi, checklist item terkirim, cetak delivery note formal. |
| **Sales Return** | `/sales-return` | Retur penjualan, kalkulasi refund, modal tambah/edit retur multi-item, print nota retur resmi. |
| **Quotation** | `/quotation`, `/quotation-detail`, `/add-quotation`, `/edit-quotation` | Penawaran harga lengkap, kalkulasi pajak/diskon, konversi otomatis ke invoice. |
| **Request Quotation**| `/request-quotation` | Form permintaan penawaran, duplikasi ke penerima pilihan. |
| **Payments** | `/payments`, `/payment-inflow`, `/payment-outflow` | Composable `usePayments`, tabel arus kas, modal add inflow/outflow. |
| **Orders** | `/orders` | Filter tanggal, shipping, status pesanan, modal ubah status 12-kolom CSS grid. |
| **Job Orders** | `/job-order` | Layout 2 kolom (sidebar workflow + tabel), modal edit pengerjaan & timeline flow. |
| **Job List** | `/job-list` | Layout 2 kolom (All flow sidebar), modal view detail spesifikasi cetak. |
| **Job Branch** | `/job-branch` | Modal setting info pengerjaan sebelum/sesudah cetak, insentif, history modal. |
| **My Job** | `/my-job` | Card grid pekerjaan aktif, filter priority, modal update status, print tiket SPK teknis. |
| **My Incentive** | `/my-incentive` | 7 kolom literal, tanpa kolom Action, filter tanggal & proses, tfoot total insentif. |
| **Cart** | `/cart` | 4 widget KPI, format uang murni rata kanan, tanpa kolom Action. |
| **Checkout** | `/checkout` | 4 widget KPI, delivery fee & payment rata kanan numerik murni, tanpa kolom Action. |
| **Wishlist** | `/wishlist` | 4 widget KPI, format uang murni rata kanan, tanpa kolom Action. |
| **Reviews** | `/reviews` | Tepat 3 widget KPI proporsional, ikon rating bintang emas, tanpa kolom Action. |
| **Support Ticket**| `/support-ticket` | 4 widget KPI, modal Add Ticket, modal detail & live chat history, kolom Action aktif. |
| **Contact Form** | `/contact-form` | Tepat 5 kolom literal (Name, Email, Phone, Message, Date), tanpa kolom Action. |
| **Purchases** | `/purchase`, `/purchase-order`, `/purchase-return`, `/purchase-item`, `/purchase-category` | 5 sub-menu lengkap, modal multi-item, PO & Retur resmi, KPI stats, cetak Kop Surat resmi. |
| **User Management** | `/user`, `/user-admin`, `/role-permissions`, `/role`, `/delete-account` | 5 sub-menu lengkap, All Members (smooth search), User Admin, Roles master, Permissions Matrix 14 Group & 97 Page hierarki collapsible, Delete Account request. |
| **Customers** | `/customers` | Peoples: 10 kolom literal, modal Add/Edit (Grid 12-kolom), View tab Details & Address, Modal Add Address, filter Type & DateRangePicker, zero-flicker search, Print Kop Surat resmi. |
| **Customer Types** | `/customer-type` | Peoples: Tipe pelanggan (Reguler, Corporate, VIP, dll.), modal Add/Edit (Grid 12-kolom), zero-flicker search, Print Kop Surat resmi. |
| **Address** | `/address` | Peoples: 4 KPI Cards (Total Address, Province, City, Postal Code), Tab Customers & Suppliers dinamis, Modal Add/Edit & View Details, normalisasi field di `address.json`. |
| **Supplier** | `/supplier` | Peoples: Pemasok bahan/kertas, 8 kolom literal, tombol baris "Address" modal & Edit/Delete, modal Add/Edit (Grid 12-kolom), zero-flicker search, Print Kop Surat resmi. |
| **Branch Store** | `/store-list` | Peoples: Cabang gerai fisik & workshop cetak, 7 kolom literal, modal Add/Edit (Grid 12-kolom), filter status, zero-flicker search, Print Kop Surat resmi. |
| **Employees** | `/employees` | HRM: 4 KPI Cards (Total, Active, Inactive, New Joiners), 8 kolom literal, filter DateRangePicker & Department & Status, Modal Add/Edit (Grid 12-kolom), Modal View profil lengkap, zero-flicker search, Print Kop Surat resmi. |
| **Department** | `/department` | HRM: 4 KPI Cards (Total Departments, Total Members, Active, Disabled), 6 kolom literal, modal Add/Edit (Member chips & quick pick, status toggle), export CSV & Print Kop Surat resmi. |
| **Employee Salary** | `/employee-salary` | HRM: 4 KPI Cards (Total, Active Payroll, Total Base, Total Allowance), 8 kolom literal, CurrencyDisplay right align, CurrencyInput, View modal rincian & Edit/Add dynamic allowances, Export CSV & Print Kop Surat resmi. |
| **Payslip** | `/payslip` | HRM: 4 KPI Cards (Total Slips, Paid, Unpaid, Total Disbursed), 12 kolom literal, Add/Edit modal kalkulasi otomatis, Payslip Detail sheet A4, Export CSV & Print Kop Surat resmi. |
| **Content** | `/all-blog`, `/blog-category`, `/blog-tag`, `/blog-comment`, `/faq`, `/faq-category`, `/our-client`, `/download-files`, `/footer`, `/banner` | 10 sub-menu lengkap modern Dulank Nuxt 4, All Blogs dengan 2-kolom Card Grid preview gambar besar, FAQ Questions (`/faq`) halaman tunggal bersih sesuai acuan `faq.html`, FAQ Category (`/faq-category`) placeholder kosong sesuai template asli, Our Client (`/our-client`) 6-kolom draggable card grid bersih dengan SVG resmi & persistensi urutan, Download Files (`/download-files`) Full File Manager 2-kolom persis acuan visual, Footer (`/footer`) Formulir Konfigurasi Footer lengkap persis acuan visual `footer.html`, Banner (`/banner`) Dual Column Card Layout (Main Banner & Product Banner) persis acuan visual `banner.html` dengan Active/Inactive status badge, thumbnail preview 120px, quick edit/delete buttons, modal CRUD dengan upload & preview gambar, serta persistensi JSON. |
| **Print & PDF** | Seluruh modul di atas | Dialog `DocumentPrintModal`, Kop Surat PT. Dulank Semesta Cida, 2 kolom TTD resmi. |

### B. MODUL PENDING / BERIKUTNYA
- **REPORT**: 15 sub-menu laporan (`sales-report`, `purchase-report`, `invoice-report`, `supplier-report`, `customer-report`, dll).
- **SETTING**: ~11 sub-menu pengaturan sistem & toko (`company-setting`, `profile`, `locations`, `invoice-setting`, `system-setting`, dll).
- **POS**: Ditunda sesuai arahan sampai diminta lagi.

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
   - Gunakan `SalesDataTable.vue` untuk tabel (`text-xs`).
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
