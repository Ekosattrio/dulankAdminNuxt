---
title: Client Revisions
tags: [client, ui, revision]
updated: 2026-10-10
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

## Revisi 3A: Data Literal dan Multiple-Select Cetak Full Color

Permintaan pengguna 2026-10-11: data `/cetak-full-color` harus persis seperti `https://dulank-admin.netlify.app/cetak-full-color.html`, dan `Effective Paper Group` harus dapat diisi dengan beberapa pilihan seperti referensi.

Keputusan implementasi:

- HTML Netlify dibandingkan dengan arsip `legacy/static-source/cetak-full-color.html`; isi domainnya cocok dan arsip lokal dipakai sebagai sumber literal.
- Seluruh sebelas tab memakai data legacy, termasuk lima kartu produk, option tables, workflow, profit, dan sepuluh log transaksi.
- Effective Target tidak lagi berupa chip/teks koma: komponen reusable `ConfigurationMultiSelect.vue` memakai `<select multiple>` dan menyimpan `targets: string[]` melalui API.
- Pilihan `Art Paper` + `Art Carton` diuji sampai reload dan tetap terpilih. Typecheck, build, API/safeguard, browser desktop/390px, serta runtime exception check lulus.

Status: **verified** untuk route `/cetak-full-color`; belum menjadi approved baseline dan persistence serverless Netlify tetap pending.

## Revisi 4: Full Legacy Parity dan Flow Sales/Add Sales

Permintaan pengguna: seluruh halaman harus diaudit terhadap repository asli, seluruh isi/modal/interaksi dipulihkan, dan Sales/Add Sales dikerjakan lebih dahulu setelah inventaris lengkap tersedia.

Keputusan implementasi:

- Seluruh 186 HTML lokal dipetakan ke route Nuxt dan dibandingkan dengan repository asli commit `6123241`; isi ternormalisasi cocok seluruhnya.
- Add Sales mengikuti link asli menuju halaman `/add-sales`; Edit Sale tetap dibuka sebagai modal dari More.
- Add dan Edit tidak memiliki implementasi form terpisah: keduanya memakai `SalesDocumentForm.vue` dan section domain yang sama.
- Voucher, biaya kirim, diskon langsung, total sebelum pajak, PPN, transaction code, dan grand total dihitung ulang di server. Modal Add Customer memakai form Customer lengkap, bukan form generik.
- Matrix penuh berada di `docs/LEGACY_PARITY_AUDIT_2026-10-10.md`; halaman di luar 15 route Sales yang sudah direkonsiliasi tetap berstatus pending sampai review manual dan browser selesai.
- Batch lanjutan mencakup Invoice, Delivery Note, Sales Return, Quotation, dan RFQ beserta route add/edit/detail. Detail selalu berasal dari record terpilih; rincian historis yang tidak tersimpan ditampilkan sebagai unavailable, bukan diisi data contoh.
- Lima dokumen transaksi memakai API adapter tipis dan domain service. Aksi status pada detail, duplicate RFQ, refund Payment-OUT, kalkulasi nilai, dan persistensi diuji pada data sementara.

Status: implementasi dan evidence runtime 15 route Sales lulus pada desktop/390px 2026-10-10. Gate aset P0 kemudian ditutup pada batch Payment; status seluruh aplikasi tetap belum `verified` karena route lain belum direkonsiliasi.

## Revisi 5: Rekonsiliasi Payment dan Penutupan Gate Aset

Permintaan pengguna: lanjutkan pemulihan penuh secara sistematis setelah batch Sales, dengan fidelity legacy, BRVS/BRVS-UI, persistence, dan browser evidence.

Keputusan implementasi:

- `/payments`, `/payment-inflow`, dan `/payment-outflow` direkonsiliasi terhadap HTML lokal: filter tambahan yang tidak ada di legacy dihapus, Balance Summary kembali collapsed secara default, dan page-size selector disembunyikan hanya pada tabel Payment.
- Add/Edit/Payment memakai editor domain dengan amount turunan dari transaction details, status baris reaktif, transfer fields, split payment dinamis, dan history yang dipersistensikan. Detail historis yang tidak tersedia tidak lagi diisi transaksi contoh.
- API Payment Flow menjadi adapter tipis; validasi, total, status, history, CRUD, dan persistensi berada di domain service/repository.
- Delapan aset Sticky Kit/Summernote dipulihkan dari `app/assets/plugins` ke path arsip yang diwajibkan. Setiap file cocok dengan hash manifest; manifest tidak diubah.

Status: 3 route Payment lulus suite API terisolasi, typecheck, dan browser desktop/390px tanpa runtime exception/overflow. Structure validator lulus; 168 route legacy lain tetap pending audit manual/browser.

## Revisi 6: Rekonsiliasi Sales-Adjacent

Permintaan pengguna: lanjutkan seluruh pemulihan aplikasi sampai selesai setelah baseline Sales dan Payment.

Keputusan implementasi:

- `/sales-dashboard` mempertahankan konten dan dialog legacy, tetapi page monolitik dipecah menjadi komponen Header, KPI, Best Seller, Transactions, Analytics, Countries, dan Dialogs yang mengambil snapshot typed melalui composable/API/service.
- `/sales-report` hanya memakai filter Search dan Date seperti legacy. Delapan KPI, kolom, urutan record yang disetujui, detail `Print Outdoor` 10 baris, serta PDF/Print dipertahankan.
- `/sales-note` dan `/sales-receipt` selalu berasal dari transaksi Sales terpilih melalui query `id/no`, bukan record contoh tetap.

Status: empat route lulus suite API/data safeguard dan browser desktop/390px tanpa runtime exception/overflow. Total evidence manual/runtime menjadi 22/186 route; 164 route lain tetap pending.

## Revisi 7: Rekonsiliasi Webstore dan Support Ticket

Permintaan pengguna: lanjutkan pemulihan seluruh aplikasi tanpa berhenti pada batch Sales-adjacent.

Keputusan implementasi:

- Cart, Checkout, Wishlist, Reviews, dan Contact Form mempertahankan approved behavior berupa KPI/filter/kolom literal tanpa kolom Action.
- View Support Ticket mengikuti link legacy ke halaman `/support-ticket-detail?id=...`, bukan modal.
- Add/Edit memakai satu editor berisi image, Customer Name, Email, Phone, Address, City, Country, dan Descriptions maksimum 60 karakter. Detail, chat, status, dan delete memakai record terpilih dan persistence yang sama.

Status: tujuh route lulus API/persistence/data-safeguard dan browser desktop/390px. Total evidence manual/runtime menjadi 29/186 route; 157 route lain tetap pending.

## Revisi 8: Rekonsiliasi Enam Route Inti Orders

Permintaan pengguna: lanjutkan seluruh pemulihan aplikasi sampai selesai setelah Webstore/Support Ticket.

Keputusan implementasi:

- `/orders`, `/job-order`, `/job-list`, `/job-branch`, `/my-job`, dan `/my-incentive` memakai data terpilih dan mutation melalui composable/API/domain service, bukan record atau counter lokal tetap.
- Workflow counter, flow count, dan total incentive diturunkan server dari dataset aktif. Nested information Job Branch, assignee, incentive, serta Qty OK/Rusak divalidasi sebelum persistence.
- `job-order.vue` menjadi composer 113 baris. Modal Setting Job Branch dipecah menjadi editor information dan assignment fields berdasarkan tanggung jawab.
- Tombol Detail/Add/Edit pada Orders membawa ID transaksi sumber ke route mandiri agar batch lanjutan dapat memuat record yang sama.

Status: enam route lulus API/persistence/data-safeguard dan browser desktop/390px. Total evidence manual/runtime menjadi 35/186 route; 151 route lain tetap pending. `/job-order-detail` dan `/edit-job-order` belum termasuk evidence ini.

## Revisi 9: Job Order Detail dan Editor Terpilih

Permintaan pengguna: lanjutkan semua pemulihan setelah enam route inti Orders selesai.

Keputusan implementasi:

- Aksi Orders mengirim `orderId`; server menyelesaikan Order sumber ke Job Order terkait. Aksi dari Job Order dapat memakai `id` langsung.
- Detail dan editor tidak lagi menampilkan Sales/customer/produk/spesifikasi contoh tetap. Hanya nilai tersimpan yang tampil; rincian kosong ditandai eksplisit.
- Work Flow Default mendukung Add, Arrange, Remove, tipe In-House/Branch Store/Outsource, informasi dinamis sebelum/sesudah flow, Assignee, dan Incentive numerik beserta unit.
- Save melakukan validasi server dan kembali ke detail record tersimpan. Grid mobile memakai explicit single-column track agar viewport 390px tidak melebar.

Status: dua route lulus API persistence/validation, typecheck, build, dan browser desktop/390px. Total evidence manual/runtime menjadi 37/186 route; 149 route lain tetap pending.

## Revisi 10: Rekonsiliasi Job Progress

Permintaan pengguna: lanjutkan seluruh pemulihan setelah Job Order Detail dan editor mandiri selesai.

Keputusan implementasi:

- `/job-progress` memakai dataset relasional tersendiri dengan ID dan FK order/job/customer/branch/product/employee, spesifikasi input/output, Qty OK/Rusak, serta timestamp.
- Empat KPI dan filter Date/Job Proses dihitung oleh domain service dari data aktif. Aksi Complete/Pending memakai record terpilih dan tersimpan melalui API, bukan mutasi array lokal.
- Label tabel legacy termasuk `Complete by` dan `Time`, Print/PDF bersama, status badge, serta tampilan desktop/390px dipertahankan.
- Page monolitik 249 baris menjadi composer tipis dengan Stats, RecordsTable, composable, API adapter, service, type, dan JSON yang terpisah sesuai BRVS/BRVS-UI.

Status: route lulus API persistence/filter/stats/validation/data safeguards, typecheck, build, dan browser desktop/390px. Total evidence manual/runtime menjadi 38/186 route; 148 route lain tetap pending.

## Revisi 11: Rekonsiliasi Master Workflow

Permintaan pengguna: lanjutkan semua pemulihan setelah Job Progress selesai.

Keputusan implementasi:

- Empat list master Workflow mempertahankan filter, kolom, modal, dan aksi legacy; Edit Work Flow tetap membuka halaman tersendiri.
- Modal Flow Name tetap lengkap dengan Assignee, Category, Type, dan Incentive. Flow Template tetap memiliki baris information dinamis, pilihan Input/Select Type, serta submodal Data Select.
- Add/Edit Work Flow memakai form yang sama. Product Picker, Flow Catalog, dan Arrange Panel dipisah; submodal Add Flow Category/Name menyimpan ke master API dan langsung masuk context editor.
- Repository category/name/template/workflow memakai strict shared JSON. Context editor dan catalog legacy bertipe serta bundled; validasi server menolak incentive negatif, unit/type tidak sah, select tanpa opsi, dan step duplikat/tidak lengkap.

Status: enam route lulus API CRUD/persistence/validation/data safeguards, typecheck, build, dan browser desktop/390px. Total evidence manual/runtime menjadi 44/186 route; 142 route lain tetap pending.

## Revisi 12: Rekonsiliasi Analytics Dashboard

Permintaan pengguna: lanjutkan seluruh pemulihan setelah Master Workflow selesai.

Keputusan implementasi:

- `/analytics-dashboard` mempertahankan KPI, conversion View Details, Performance, Session By Browser, Sessions by Country, dan Top Pages beserta label/kolom legacy; tombol Refresh yang tidak ada pada referensi dihapus.
- Angka dashboard dipindahkan dari record hardcoded page ke snapshot JSON numeric yang typed, bundled, dibaca strict oleh service, disajikan API tipis, dan diakses hanya melalui composable domain.
- Page 645 baris menjadi composer 9 baris; KPI, Conversion, Performance, serta Traffic/Top Pages dipisah berdasarkan tanggung jawab.
- Malformed JSON harus menghasilkan error eksplisit. Browser test mencakup modal detail, desktop/390px, horizontal overflow, dan runtime exception.

Status: route lulus API/data safeguard, typecheck, build, dan browser desktop/390px. Total evidence manual/runtime menjadi 45/186 route; 141 route lain tetap pending.

## Revisi 13: Rekonsiliasi Dashboard Admin

Permintaan pengguna: lanjutkan seluruh pemulihan Dashboard setelah Analytics selesai.

Keputusan implementasi:

- Route `/` memulihkan seluruh section `index.html`: low-stock alert, dua grup metric, Sales & Purchase, Overall Information, tiga product/sales panels, Sales Statics, lima tab Recent Transactions, Top Customers, Top Categories, dan Order Statistics.
- Interaksi range chart, dropdown period/year, dismiss alert, serta tab `Sale/Puchase/Quotation/Expense/Invoice` bekerja pada state Vue. Tab Invoice mempertahankan urutan `Customer`, `Due Date`, `Status`, `Amount`.
- Data uang dan metric menjadi angka murni di snapshot typed/bundled; page tidak lagi menyimpan record hardcoded.
- Page 345 baris menjadi composer 9 baris dan UI dipecah menjadi sembilan responsibility components.

Status: route lulus API/data safeguard, typecheck, build, dan browser desktop/390px. Total evidence manual/runtime menjadi 46/186 route; 140 route lain tetap pending.

## Revisi 14: Rekonsiliasi Subscriptions

Permintaan pengguna: lanjutkan seluruh pemulihan setelah Dashboard Admin selesai.

Keputusan implementasi:

- `/subscriptions` mempertahankan empat KPI, toolbar, filter, sembilan kolom tabel, footer Total, serta View/Edit/Delete. Flow Add, upgrade, dan payment tidak ditambahkan karena tidak ada pada `subscriptions.html`.
- Data lokal page dipindahkan ke JSON typed/bundled dengan amount numeric, `subscriberId`, ISO date, dan timestamps. Filter search/date/plan/payment/status berjalan di service; Edit/Delete tersimpan melalui API.
- Page 960 baris menjadi composer 9 baris; Stats, Records Table, Detail Dialog, Edit Form, dan Workspace dipisah berdasarkan tanggung jawab dan memakai komponen shared.
- API test memakai cwd sementara dan mencakup filter, edit/reload, delete/reload, invalid payload, 404, serta malformed JSON. Browser test mencakup modal/action/filter/print dan viewport desktop/390px.

Status: route lulus API/persistence/data safeguard, typecheck, build, structure validator, dan browser desktop/390px. Total evidence manual/runtime menjadi 47/186 route; 139 route lain tetap pending.

## Revisi 15: Rekonsiliasi Kalkulator Dashboard

Permintaan pengguna: lanjutkan seluruh pemulihan setelah Subscriptions selesai.

Keputusan implementasi:

- Memulihkan sepuluh nama/angka/status persis dari tabel legacy dan seri grafik `Aug 26` sampai `Sep 1`; record contoh yang berbeda dihapus dari seed sumber.
- Memperbaiki prop/slot `SalesDataTable` yang sebelumnya membuat tabel kosong, menghapus filter Status non-legacy, dan mengaktifkan PDF/Print/Refresh/Collapse serta View/Edit/Delete.
- Dataset memakai relasi user/employee/department dan timestamp typed. Service strict menolak malformed JSON, usage di luar 0-100, angka negatif, status tidak sah, dan ID yang tidak ada.
- Category dropdown mempertahankan opsi literal legacy tetapi tidak dipakai sebagai filter domain karena HTML tidak memberi kategori pada record user.

Status: route lulus API/persistence/data safeguard, typecheck, build, dan browser desktop/390px. Total evidence manual/runtime menjadi 48/186 route; 138 route lain tetap pending.

## Revisi 16: Rekonsiliasi Billing

Permintaan pengguna: lanjutkan seluruh pemulihan setelah Kalkulator Dashboard selesai.

Keputusan implementasi:

- `/billing` mempertahankan tiga KPI, Search, Date, Metode, Status, sebelas kolom literal, sepuluh record, dan footer total dari `billing.html`.
- Action, modal detail, serta toolbar PDF/Print/Refresh/Collapse lama pada implementasi Nuxt dihapus karena tidak terdapat pada HTML referensi.
- Data menjadi JSON typed/bundled dengan PK, relasi transaksi/pengguna, timestamp, dan seluruh nilai uang numeric. Service strict menangani search/date/method/status dan menolak JSON rusak.
- Page 318 baris menjadi composer 9 baris; workspace, stats, dan records table dipisah serta memakai komponen shared tanpa double-card.

Status: route lulus exact snapshot/filter/empty/malformed API test, typecheck, build, structure validator, dan browser desktop/390px tanpa overflow/exception. Total evidence manual/runtime menjadi 49/186 route; 137 route lain tetap pending.

## Revisi 17: Rekonsiliasi Voucher

Tanggal: 2026-10-11.

- `/voucher` mempertahankan judul `Coupons`, subtitle `Manage Your Coupons`, empat record, sembilan kolom, Add New Coupons, PDF/Print/Refresh/Collapse, search, serta filter Date/Store/Product/Name/Type/Report dari HTML legacy.
- Opsi Product toolbar tetap `Laptop` dan `Lemari`, sedangkan pilihan Product pada modal tetap `Nike Jordan` dan `Amazon Echo Dot`; kedua konteks legacy tidak disatukan secara keliru.
- Add dan Edit memakai satu `VoucherFormDialog.vue` lengkap: Name, Code, Type, Discount, Limit, Start Date, End Date, All Products, Once Per Customer, Product, dan Status. `Used` tetap output transaksi, bukan input admin.
- Data memakai tipe dan JSON bundled relasional dengan `storeId`, `createdByEmployeeId`, `productIds`, angka discount/limit/used murni, serta timestamp. API tipis mendelegasikan validasi, uniqueness, filter, CRUD, dan persistence ke service.

Status: typecheck, production build, API CRUD/reload/validation/malformed-data, audit generator, serta browser desktop/390px tanpa overflow/exception lulus. Total evidence manual/runtime menjadi 50/186 route; 136 route lain tetap pending.

## Cara Mencatat Revisi Berikutnya

Setiap revisi harus berisi kutipan/inti permintaan, keputusan visual atau flow, file shared yang terpengaruh, halaman sampel, tanggal, dan status verifikasi.
