# Panduan AI untuk Dulank Admin

Panduan ini berlaku untuk seluruh repositori. Pola revisi menu SALES yang sudah disetujui pengguna menjadi acuan pekerjaan berikutnya. Ikuti arahan terbaru pengguna jika cakupan atau kebutuhannya berubah.

## 1. Baca acuan sebelum mengubah halaman

- Baca [docs/STRUCTURE.md](docs/STRUCTURE.md), terutama bagian 20.4 untuk hasil revisi SALES yang disetujui. Bagian sebelumnya juga memuat riwayat implementasi; jangan mengembalikan perilaku lama yang sudah direvisi.
- Gunakan [docs/obsidian-vault/00-HOME.md](docs/obsidian-vault/00-HOME.md) sebagai peta flow, business logic, data/Netlify, status audit, revisi klien, dan decision log. Status kanonik tetap berada di `AI_HANDOVER_GUIDE.md` root.
- Untuk perintah seperti "kerjakan menu <nama-menu>" atau "lanjut ke menu <nama-menu>", baca juga [docs/MENU_IMPLEMENTATION_COMMAND.md](docs/MENU_IMPLEMENTATION_COMMAND.md). Dokumen itu menjelaskan workflow backend-ready, reusable-first, dan kriteria selesai per menu.
- Peta status kebersihan page, matrix komponen/composable/API, dan SOP checking otomatis berada di [docs/PAGE_CLEANLINESS_AND_STATUS_MATRIX.md](docs/PAGE_CLEANLINESS_AND_STATUS_MATRIX.md).
- Untuk setiap perubahan, ikuti [docs/AI_WORK_QUALITY_FRAMEWORK.md](docs/AI_WORK_QUALITY_FRAMEWORK.md): lakukan context check, first re-check, adversarial re-check, validasi berbukti, lalu sinkronkan progres. Status `implemented`, `verified`, dan `approved baseline` tidak boleh dipertukarkan.
- Struktur resmi menu disebut **Backend-Ready Vertical Slice (BRVS)**. Baca [docs/BACKEND_READY_VERTICAL_SLICE.md](docs/BACKEND_READY_VERTICAL_SLICE.md) dan buktikan setiap layer sebelum menyebut menu mengikuti pola Sales.
- Standar resmi pemecahan UI adalah **BRVS-UI** pada [docs/UI_DECOMPOSITION_STANDARD.md](docs/UI_DECOMPOSITION_STANDARD.md). Branch `Rama` commit `76f6e79` hanya menjadi referensi route composer dan pemisahan komponen berdasarkan tanggung jawab; direct fetch, mutation component, legacy runtime, dan backend tipisnya bukan acuan arsitektur Dulank Admin.
- Kerjakan **per menu sesuai permintaan pengguna**. Acuan saat ini mencakup Sales, Invoice, Delivery Note, Sales Return, Quotation, dan Request For Quotation. **POS ditunda** sampai diminta lagi.
- Baca HTML halaman yang bersesuaian di [legacy/static-source/](legacy/static-source/), termasuk script, partial, dan aset yang mengatur interaksinya. Bila pengguna memberi URL referensi, bandingkan juga referensi tersebut. Situs acuannya adalah `https://dulank-admin.netlify.app/<nama-halaman>.html`.
- Sebelum implementasi, petakan kolom tabel, tombol, dropdown, filter, modal, halaman tambah/edit/detail, cetak, dan alur penyimpanan. Jangan menyimpulkan isi form hanya dari nama menu.
- **Kewajiban Modal & Interaksi Penuh:** Seluruh modal (termasuk modal Add/Edit dan sub-modal terkait) WAJIB mengimplementasikan seluruh interaksi, input, submodal, dan fungsinya persis seperti file HTML referensi/Netlify (misal: tabel informasi dinamis, penambahan baris inline, pergantian tipe input/select, submodal data select options). DILARANG menyederhanakan modal menjadi form generik atau satu kolom textarea saja.
- Gunakan halaman SALES yang sudah direvisi sebagai contoh pola kode dan konsistensi UI. Isi, label, dan alur menu lain tetap mengikuti HTML menu tersebut.

## 2. Pertahankan file dan data yang sudah ada

- **Jangan menghapus HTML asli beserta CSS, JavaScript, gambar, font, partial, dan JSON acuannya.** Arsip `legacy/static-source/` tetap menjadi dasar pencocokan tampilan dan flow.
- Pertahankan halaman, route, alias `.html`, data JSON, `server/api/`, `server/types/`, dan utils yang sudah ada. Perubahan implementasi boleh dilakukan sesuai tugas, tanpa menghilangkan fitur atau kontrak lama.
- Saat memecah kode menjadi komponen, pertahankan kompatibilitas pemanggil lama; gunakan adapter bila diperlukan. Jangan menghapus file hanya karena tampak tidak terpakai.
- Jangan menimpa, mengosongkan, atau melakukan seed ulang data pengguna. `data/` adalah penyimpanan runtime; `server/data/` berisi JSON sumber. Keduanya bukan folder yang bisa saling ditimpa otomatis.
- **Dukungan Serverless Netlify (`bundledSources`):** Setiap JSON di `server/data/` wajib memiliki key dengan basename yang sama di `server/utils/bundledData.ts` agar ikut ke Nitro chunk. `readJSON()` hanya memakai bundled source bila file fisik tidak tersedia; JSON fisik yang rusak tetap harus menghasilkan error. Bundled seed menyelesaikan initial read, bukan mutation persistence pada filesystem serverless.
- Array runtime kosong adalah data valid. JSON rusak harus menghasilkan error yang jelas, bukan diam-diam diganti seed. Request GET tidak boleh membuat atau mengubah data.
- Jangan mengisi rincian transaksi lama yang tidak tersedia dengan produk, pembayaran, atau identitas contoh buatan. Pertahankan nilai yang diketahui dan tangani rincian kosong secara eksplisit.
- Jangan mengedit `.nuxt/`, `.output/`, atau `node_modules/` sebagai solusi perubahan source. Jangan membatalkan perubahan pengguna yang sudah ada di working tree.
- Jangan menjalankan proses Git yang mengubah state repositori kecuali pengguna meminta secara eksplisit. Perintah seperti `git add`, `git commit`, `git push`, `git pull`, `git merge`, `git rebase`, `git checkout`, `git switch`, `git reset`, `git restore`, `git clean`, perubahan remote, dan operasi sejenis hanya boleh dilakukan setelah ada instruksi langsung dari pengguna. Pemeriksaan read-only seperti `git status`, `git diff`, `git log`, atau `git show` boleh dipakai untuk memahami kondisi repo.

## 3. Struktur kode: halaman tipis, komponen terpisah

Proyek menggunakan **Nuxt 4, Vue 3, TypeScript, dan Tailwind CSS 4**. Frontend berada di `app/`; backend tetap di `server/`.

| Lokasi | Tanggung jawab |
| --- | --- |
| `app/pages/<route>.vue` | Metadata halaman, pemanggilan composable, state koordinasi seperlunya, dan penyusunan komponen. |
| `app/components/pages/<menu>/` | Tabel, editor, detail, history, dan bagian dokumen khusus menu. |
| `app/components/sales/` | Komponen UI bersama yang sudah dipakai dan disetujui di SALES. |
| `app/composables/` | Fetch API, state form, validasi, kalkulasi, dan alur simpan/edit/hapus. |
| `app/utils/` | Helper UI dan fungsi frontend yang dapat digunakan kembali. |
| `server/api/`, `server/types/`, `server/utils/` | Endpoint, kontrak data, validasi backend, dan persistensi. |

- Target revisi setiap menu adalah **backend-ready**, bukan sekadar tampilan mirip HTML. Struktur data harus benar untuk kebutuhan sistem nyata: field domain lengkap, relasi/transaksi jelas, tipe di `server/types/`, endpoint di `server/api/`, akses data/validasi di `server/utils/`, dan frontend hanya berkomunikasi lewat composable/API.
- Rantai BRVS wajib adalah `page -> domain component -> domain composable -> Nitro API -> server domain service/repository -> typed relational data`. Keberadaan file pada sebagian layer tidak cukup; route aktif harus benar-benar memakai seluruh layer yang dibutuhkan flow.
- Hindari desain yang memaksa bongkar besar saat pindah dari JSON ke database. API route harus tipis, logika baca/tulis dan validasi berada di utility/domain helper, dan bentuk response stabil (`success`, `data`, `message`, `meta` bila perlu).
- Menu **Sales** dan **Payment** adalah acuan implementasi yang paling aman saat ini untuk pola backend-ready. Jangan menurunkan pola ini menjadi data lokal page, prompt/timeout palsu, atau field contoh yang tidak bersumber dari legacy/API.
- Jika suatu menu membutuhkan fitur umum seperti filter rentang waktu, pencarian, status, payment/refund, atau dokumen cetak, gunakan komponen/composable/utility bersama yang sudah ada atau buat standar reusable baru. Jangan membuat versi khusus per halaman jika fitur itu jelas dipakai banyak menu.
- Gunakan `<script setup lang="ts">`, props/emits bertipe, dan composable domain. Hindari menumpuk tabel, semua modal, dan logika bisnis dalam satu file page.
- Tetap gunakan `useLegacyPage({ title: 'Nama Halaman', sweetAlert: false })` sesuai pola proyek. Saat ini helper tersebut mengatur judul; opsi `styles`/`scripts` lama hanya diterima untuk kompatibilitas, bukan memuat aset legacy.
- Template page memakai pembungkus `dulank-page dulank-page-<nama-route>`. Header/sidebar umum tetap melalui layout; jangan diduplikasi di setiap halaman.
- Data domain dari page wajib melalui composable. Jangan memakai `$fetch()`/`useFetch()` langsung di page; letakkan request, mutation, pending/error, refresh, dan payload mapping di `app/composables/use<Menu>.ts` atau editor composable terkait. Pertahankan bentuk respons API dan gunakan tipe domain dari `#server`.
- Konfigurasi komponen memakai `pathPrefix: false`. Jika ingin nama seperti `PagesSalesTable`, lakukan import alias secara eksplisit; jangan menganggap prefix folder otomatis tersedia.
- Untuk warning component resolution atau extraneous attributes, baca [docs/TROUBLESHOOTING_VUE_WARNINGS.md](docs/TROUBLESHOOTING_VUE_WARNINGS.md). Jangan memasukkan komponen Vue lokal ke `isCustomElement`. Komponen fragment yang menerima `class`/attribute harus memakai `inheritAttrs: false` dan meneruskan `$attrs` ke root yang memang dituju.
- Pisahkan form dokumen yang dipakai tambah/edit menjadi komponen bersama. Jangan membuat dua implementasi form yang kemudian berbeda isinya.
- Baca contoh nyata: [sales.vue](app/pages/sales.vue), [add-quotation.vue](app/pages/add-quotation.vue), [QuotationDocumentForm.vue](app/components/pages/quotation/QuotationDocumentForm.vue), dan [useQuotationDocumentEditor.ts](app/composables/useQuotationDocumentEditor.ts).

### Architecture Gate BRVS

- Page adalah composition layer. Targetnya maksimal 150 baris; di atas 200 baris wajib diaudit/dipecah atau diberi justifikasi, dan di atas 300 baris berstatus `structural review required`. Batas baris adalah alarm, sedangkan pelanggaran tanggung jawab layer adalah hard fail.
- Page tipis tidak cukup. `*Workspace.vue`/`*Screen.vue` juga hanya boleh menjadi orchestrator; dilarang memindahkan seluruh tabel, form, semua modal, export, dan mutation dari page ke satu Workspace besar. Target Workspace maksimal 150 baris; di atas 200 baris wajib decomposition audit dan di atas 300 baris `structural review required`.
- Pecah UI berdasarkan tanggung jawab nyata: Header/Actions, Stats, Filters, Table/Grid/List, Form/Editor sections, Detail/History/Modal, dan Feedback state. Leaf component ditargetkan maksimal 250 baris; di atas 300 baris wajib dipecah atau memiliki justifikasi satu tanggung jawab yang tertulis.
- Dilarang menaruh record hardcoded, type domain lokal, business calculation, serializer export, markup tabel/card/form/modal panjang, atau `alert()`/`confirm()` sebagai flow sukses di page.
- Tabel/list, filter domain kompleks, editor/form, detail, history, stats, dan modal berada di `app/components/pages/<menu>/`. Add dan Edit wajib memakai form/editor yang sama.
- Composable menjadi satu-satunya pintu frontend untuk request domain dan mutation flow. API route menjadi adapter HTTP tipis. Validasi, kalkulasi, relasi, penomoran, serta persistensi berada di domain helper/repository `server/utils/`.
- Setiap laporan progres menu wajib menyertakan Architecture Evidence Matrix dari `docs/BACKEND_READY_VERTICAL_SLICE.md`. Satu gap pada layer wajib membatasi status menjadi `partial BRVS` atau `implemented, architecture verification pending`.
- Setiap laporan progres juga wajib menyertakan UI Responsibility Evidence dari `docs/UI_DECOMPOSITION_STANDARD.md`. HTTP 200, page pendek, atau keberadaan Workspace tidak cukup untuk status `verified`.

### Catatan Perubahan dan Status Git Wajib

- Setiap AI yang mengubah code, data, atau dokumentasi wajib memperbarui `docs/obsidian-vault/09-CHANGELOG.md`. Perubahan keputusan/status arsitektur atau modul juga wajib disinkronkan ke `AI_HANDOVER_GUIDE.md` dan matrix terkait.
- Setiap catatan perubahan wajib memuat branch, commit status, push status, validasi yang dijalankan/tidak dijalankan, dan risiko tersisa.
- Nilai push yang sah hanya `NOT PUSHED`, `PUSHED`, atau `UNKNOWN`. Default setelah edit adalah `NOT COMMITTED` dan `NOT PUSHED`.
- `PUSHED` hanya boleh ditulis setelah ada instruksi eksplisit pengguna, `git push` benar-benar berhasil, dan remote ref diverifikasi ke hash commit yang dimaksud. Working tree yang belum dikomit selalu `NOT PUSHED` untuk perubahan tersebut.
- Pencatatan status Git tidak memberi izin menjalankan Git mutating. Larangan pada bagian 2 tetap berlaku.

## 4. Tampilan mengikuti HTML, implementasi memakai Tailwind

- Cocokkan susunan halaman, label literal, urutan kolom, letak tombol, isi dropdown, bidang form, dan alur interaksi dengan HTML. Jangan mengganti form dokumen lengkap dengan modal CRUD generik.
- Pertahankan apakah suatu aksi membuka modal atau berpindah ke halaman tersendiri. Cocokkan juga detail isi modal, bukan hanya judulnya.
- Gunakan Tailwind dan komponen Vue untuk UI aktif. Jangan mengaktifkan Bootstrap/jQuery atau script legacy untuk mengambil alih DOM yang dikelola Vue.
- Gunakan [salesUi.ts](app/utils/salesUi.ts) untuk kelas field, label, tombol, dan tabel dokumen. Pastikan direktori sumber kelas Tailwind tercakup dalam `app/assets/css/main.css`.
- Pertahankan font tema proyek. Sesuai revisi klien 2026-10-08, teks header/body/footer tabel menggunakan `text-sm` (14px), setara menu utama sidebar. Jangan membuat ukuran atau warna teks daftar berbeda per halaman.
- Baca [docs/TYPOGRAPHY_STANDARD.md](docs/TYPOGRAPHY_STANDARD.md) sebelum membuat atau mengubah UI. Skala resmi: judul halaman 20px, judul dialog 18px, judul section 16px, body/sidebar/tabel/control/tombol 14px, label/caption/helper/badge 12px, dan KPI utama 24px. Teks bermakna dilarang lebih kecil dari 12px.
- Root proyek tetap 14px untuk menjaga skala layout lama; token `text-xs` sampai `text-3xl` dikalibrasi di `main.css` agar ukuran aktual sesuai standar. Jangan mengubah root ke 16px atau menambah ukuran arbitrary untuk mengakali token.
- Gunakan semantic class `app-page-title`, `app-page-subtitle`, `app-dialog-title`, `app-section-title`, `app-body-text`, `app-supporting-text`, dan `app-control-text` bila perannya sesuai. Jangan memakai judul halaman untuk heading card/panel yang padat.
- Untuk filter, search, page-size, dropdown, dan control kecil di toolbar tabel, gunakan gaya light modern yang konsisten: tinggi `h-9`, background putih, border abu halus, radius sedang, shadow kecil, teks `text-sm`, focus ring primary, dan spacing rapat. Jika style ini dipakai lebih dari satu tempat, pindahkan ke shared class/helper, bukan ditulis ulang berbeda per komponen.
- Jika ada fungsi atau style yang sama berulang di beberapa menu, buat standar reusable di `app/components/common/`, `app/components/sales/`, `app/composables/`, `app/utils/`, atau `server/utils/` sesuai cakupannya. Jangan membiarkan variasi kecil tumbuh per halaman untuk fitur yang sama.
- Tabel lebar harus bisa di-scroll di dalam wadahnya. Halaman dan modal tidak boleh melebar keluar viewport. Periksa desktop dan layar kecil, termasuk lebar 390px.

Gunakan komponen bersama berikut sebelum membuat variasi baru:

| Komponen | Standar yang dipertahankan |
| --- | --- |
| [SalesDataTable.vue](app/components/sales/SalesDataTable.vue) | Font `text-sm` (14px), warna teks konsisten, header, spacing, sorting, pencarian, pagination, dan scroll tabel. |
| [SalesActionButton.vue](app/components/sales/SalesActionButton.vue) | Ikon Feather 14px untuk aksi baris, gunakan prop semantik `action="view|edit|delete|..."`, tooltip/label aksesibel, serta state disabled. |
| [SalesListHeader.vue](app/components/sales/SalesListHeader.vue) | Susunan judul dan tombol toolbar; ikon toolbar konsisten. |
| [SalesStatusBadge.vue](app/components/sales/SalesStatusBadge.vue) | Tampilan status yang seragam, dengan arti status domain tetap dipertahankan. |
| [SalesMoreMenu.vue](app/components/sales/SalesMoreMenu.vue) | Dropdown aksi yang tidak terpotong oleh wadah scroll tabel. |
| [SalesDialog.vue](app/components/sales/SalesDialog.vue) | Modal, Escape, judul aksesibel, pengamanan saat busy, dan ukuran dokumen yang responsif. |
| [SalesFeedback.vue](app/components/sales/SalesFeedback.vue) | Loading, error, feedback hasil, dan retry. |
| [SalesConfirmDelete.vue](app/components/sales/SalesConfirmDelete.vue) | Konfirmasi sebelum penghapusan record. |
| [DateRangePicker.vue](app/components/common/DateRangePicker.vue) | Pemilih rentang tanggal standar toolbar (`h-9`, preset tanggal, kustom tanggal). |
| [TableFilterSelect.vue](app/components/common/TableFilterSelect.vue) | Dropdown filter standar toolbar tabel (`h-9`, `text-sm`, border abu halus, light modern). |
| [AssigneeSelect.vue](app/components/common/AssigneeSelect.vue) | Pemilih assignee standar modal (`min-h-9`, radio Employees/Department, chips badge, floating dropdown). |
| [QuantityStepper.vue](app/components/common/QuantityStepper.vue) | Kontrol stepper kuantitas numerik standar (`[-] [ 2 ] [+]`) dengan tombol Feather icon, min/max/step bounding, mode compact tabel dan full form. |
| [ImageUploadGrid.vue](app/components/common/ImageUploadGrid.vue) | Komponen pengunggah gambar multi-file standar dengan area drag-and-drop, thumbnail preview, hover delete badge, dan validasi berkas. |
| [AppSkeleton.vue](app/components/common/AppSkeleton.vue) | Primitif skeleton loader teranimasi pulse dengan bentuk dan ukuran fleksibel (rounded, circle, text line). |
| [TableSkeleton.vue](app/components/common/TableSkeleton.vue) | Skeleton loader tabel terstruktur penuh yang meniru layout `SalesDataTable` (toolbar filter, search `h-9`, header, baris data, dan pagination). |
| [CardSkeleton.vue](app/components/common/CardSkeleton.vue) | Skeleton loader metrik KPI / stat widget standar. |
| [CurrencyInput.vue](app/components/common/CurrencyInput.vue) | Input mata uang / separator ribuan realtime (`h-9`), prefix 'Rp' opsional, justifikasi kanan (`align="right"`) atau kiri (`align="left"`), v-model angka murni. |
| [CurrencyDisplay.vue](app/components/common/CurrencyDisplay.vue) | Display mata uang / separator ribuan standar (`Rp 10.000`), format monospaced tabular-nums, justifikasi kanan (`align="right"`) atau kiri (`align="left"`). |
| [currency.ts](app/utils/currency.ts) | Utility pemformat & parser uang: `formatMoney()`, `formatIDR()`, `parseMoney()`, dan helper alignment `currencyAlignClass()`. |
| [actionIcons.ts](app/utils/actionIcons.ts) | Kamus tunggal ikon aksi dan ukuran ikon. Ikuti [docs/ICON_STANDARD.md](docs/ICON_STANDARD.md); kode baru tidak memilih glyph CRUD sendiri. |
| [salesUi.ts](app/utils/salesUi.ts) | Helper kelas UI bersama: `tableFilterControlClass`, `formControlClass`, `modalFormRowClass`, `modalFormLabelClass`, `modalFormInputColClass`, re-export currency utils. |

### Standarisasi Dimensi (Height, Width, dan Grid Form)

- **Tinggi Kontrol Toolbar & Form:** Seluruh kontrol input, select filter toolbar tabel, search bar, dan input form modal harus menggunakan tinggi standar `h-9` (36px). Untuk kontrol tag / multi-select (seperti `AssigneeSelect`), gunakan tinggi dasar `min-h-9` (36px) agar sejajar dengan kontrol lainnya.
- **Tipografi Kontrol:** Teks input, select, search, dropdown action, dan tombol berlabel memakai `text-sm` (14px aktual). Label/helper boleh `text-xs` (12px). Jangan menurunkan isi control ke 9-11px.
- **Standar Filter Toolbar:** Gunakan `TableFilterSelect.vue` atau kelas `tableFilterControlClass` untuk seluruh dropdown filter pada slot `#filters`. Gunakan `DateRangePicker.vue` untuk filter tanggal. Jangan membuat input teks lokal atau kelas `salesField` tanpa `h-9`.
- **Standar Grid 12 Kolom Modal:** Pada form modal, susun baris dengan CSS Grid 12 kolom murni:
  - Baris: `grid grid-cols-12 items-center gap-3 sm:gap-4` (`items-start` untuk field multiline/tags) atau helper `modalFormRowClass`.
  - Label: `col-span-5 text-xs font-semibold text-gray-700 dark:text-gray-300` atau helper `modalFormLabelClass`.
  - Input: `col-span-7` atau helper `modalFormInputColClass`.
- **Aturan Single Card Container (No Double Card Nesting):** `SalesDataTable.vue` sudah memiliki container card mandiri lengkap dengan border, rounded corner, dan background. DILARANG membungkus `SalesDataTable.vue` di dalam card pembungkus tambahan (`<div class="card">...</div>` atau sejenisnya) karena akan menyebabkan tampilan kartu bertumpuk/bersarang ganda yang merusak estetika dan konsistensi layout. Gunakan `SalesDataTable` langsung di tingkat container layout halaman.
- **Kewajiban Relasional Dummy Data (Database Migration Ready):** Seluruh dataset dummy pada mock JSON server WAJIB memiliki struktur relasional yang komprehensif: Primary Key `id`, serta Foreign Keys penaut antar entitas (`orderId`, `jobOrderId`, `customerId`, `branchId`, `productId`, `employeeId`), rincian spesifikasi input/output teknis pengerjaan, kuantitas OK (`qtyOk`), kuantitas rusak (`qtyRusak`), dan timestamp. Hal ini mutlak diperlukan sebagai acuan skema perancangan database relasional (PostgreSQL/MySQL) di masa mendatang.
- **Kewajiban Format Uang & Penyimpanan Numerik Murni:** Nilai uang (harga, diskon, insentif, biaya, total) di seluruh dataset JSON / database DILARANG ditulis/disimpan sebagai string berpemisah statis seperti `"2.000"` atau `"Rp 2.000"`. Seluruh nilai uang WAJIB disimpan sebagai **angka numerik murni** (`number`, cth: `2000`). Pemformatan separator ribuan bertitik (`1.000.000` / `Rp 1.000.000`) dan prefix WAJIB dijalankan secara dinamis melalui utility (`formatMoney`, `formatIDR`) atau komponen bersama (`<CurrencyDisplay>`, `<CurrencyInput>`) dengan opsi justifikasi kanan (`align="right"`) untuk kolom tabel & kalkulasi, maupun kiri (`align="left"`) jika diperlukan.
- **Kewajiban Input/Output Domain:** Field yang tampil sebagai output tabel/detail belum tentu boleh menjadi input Add/Edit. Saldo, total, due, status pembayaran, jumlah katalog, progress, dan nilai turunan lain WAJIB dihitung dari transaksi/ledger/relasi di server. Cocokkan field form secara literal dengan HTML legacy; jangan menambahkan input hanya untuk memudahkan pengisian dummy.

Standarisasi berarti komponen dan gaya konsisten; **nama serta urutan kolom tetap mengikuti domain masing-masing**. Jangan mengganti `Sales Channel` atau `Quotation Channel` menjadi `Channel`. Jangan mencampur emoji, ikon dari library lain, dan Feather untuk fungsi setara.

### Standarisasi Ikon Aksi

- Gunakan `app/utils/actionIcons.ts` sebagai sumber nama glyph dan ukuran. Mapping utama: Add `plus-circle`, View `eye`, Edit `edit`, Delete/Remove `trash-2`, dan More `more-horizontal`.
- Kode baru memakai `<SalesActionButton action="...">`; prop raw `icon` hanya untuk kompatibilitas atau ikon domain yang belum ada di kamus.
- Aksi ikon saja wajib memiliki `label` yang menjadi `title` dan `aria-label`. Urutan CRUD sejajar adalah View, Edit, Delete; Delete diletakkan terakhir.
- Ikuti [docs/ICON_STANDARD.md](docs/ICON_STANDARD.md). Jangan membuat SVG manual, emoji, atau mengambil ikon dari library lain untuk aksi yang sudah distandarkan.

## 5. Perilaku SALES yang sudah disetujui

Gunakan daftar ini sebagai batas regresi saat mengubah kode bersama:

- **Sales:** kolom More berada paling awal, sebelum No Sales. Menu berisi Sale Detail, Edit Sale, Show Payments, Sales Receipt, Sales Note, Create Invoice, Create Delivery Note, dan Delete Sale. Tombol **Delete Sales History** dan **Cancel Transaction History** tetap tersedia dan membuka riwayat. Add/Edit berupa modal dengan customer, Shipping/Pickup, PO, item, voucher, biaya kirim, pajak, notes, dan total; alamat Shipping/Pickup tidak saling menimpa.
- **Invoice:** daftar memiliki aksi lihat/hapus sesuai HTML. Tidak ada tombol Edit atau Create Invoice di header daftar. **Create Invoice tetap tersedia melalui More Sales**, dengan transaksi sumber terisi.
- **Delivery Note:** Add/Edit memakai modal berbentuk dokumen, mencakup perusahaan, customer/Ship To, nomor/tanggal DN, PO, Shipping BY, Reference, status, pilihan No Sales, barang, packing, berat, serta Receive By, Security / Check, Driver, dan Issued By. Edit harus memuat rincian record yang dipilih.
- **Sales Return:** tabel memakai standar bersama. Modal berisi customer, No Sales, rincian produk dengan Qty/Qty Return/Unit/Price/Amount/Description, Notes, dan Grand Total. Detail serta Payment-OUT memakai data refund yang tersimpan, termasuk rekening/referensi.
- **Quotation:** label kolom adalah **Quotation Channel**. Add/Edit berupa **halaman dokumen terpisah**, dengan metadata, customer/pengiriman, produk/MOQ/order, Term & Condition, biaya, pajak, dan tanda tangan. Total dihitung serta divalidasi di backend.
- **Request For Quotation:** form mencakup metadata, Description/Quantity/Unit/ETA, Due Date, Payment Term, daftar **Quotation requested to**, dan penandatangan. **Duplicate Request for Quotation** membuka pilihan penerima **To:** lebih dulu. Submit membuat ID/nomor baru dan menyalin rincian ke penerima pilihan; sumber tetap utuh.
- **Sales Note/Receipt:** dokumen dan hasil cetak harus berasal dari transaksi yang dipilih melalui `id`, bukan data contoh tetap.

Rincian kolom lengkap ada di komponen `*RecordsTable.vue` masing-masing menu dan HTML acuannya. Halaman lain yang belum direvisi tidak otomatis menjadi contoh yang benar hanya karena sudah ada di repo.

## 5.1 Perilaku PAYMENT yang sudah disetujui

Gunakan daftar ini sebagai batas regresi untuk Payment:

- **Payments:** daftar memakai data server/API, tipe di `server/types/payment.ts`, composable `usePayments()`, dan komponen `PaymentRecordsTable.vue`. Kolom mengikuti HTML: Date Payment, Ref No, Name, Type, Payment Method, Amount (IDR), Status, dan Create. Filter tanggal memakai rentang waktu standar, bukan input teks lokal.
- **Payment Inflow:** daftar memakai data server/API, tipe di `server/types/payment-flow.ts`, composable `usePaymentFlow('inflow')`, komponen flow Payment, dan data balance. Aksi View, Payment, Edit, dan Delete terhubung ke record yang dipilih.
- **Payment Outflow:** struktur sama dengan Inflow, memakai `usePaymentFlow('outflow')`, data outflow, bank transfer, payment history, detail transaksi, dan validasi simpan/hapus di server.
- **Rentang waktu Payment:** gunakan `DateRangePicker.vue`, `useDateRange.ts`, dan `server/utils/dateRange.ts`. Query API memakai `startDate` dan `endDate`; data legacy `DD/MM/YYYY` difilter di server. Komponen ini adalah standar reusable untuk halaman lain yang punya fitur pemilih rentang waktu.
- Data Payment tidak boleh kembali menjadi array hardcoded di page. Jika detail lama tidak tersedia, tampilkan keadaan kosong/known value secara eksplisit; jangan mengarang transaksi, rekening, customer, atau pembayaran contoh.

## 5.2 Perilaku ORDERS Group yang sudah disetujui

Gunakan daftar ini sebagai batas regresi untuk grup menu Orders:

- **Orders (`/orders`):** tabel daftar pesanan dilengkapi filter tanggal `DateRangePicker.vue`, status, dan shipping method. Modal status pesanan (`OrderStatusModal.vue`) menggunakan CSS Grid 12 kolom untuk update status.
- **Job Orders (`/job-order`):** layout 2 kolom dengan sidebar kategori workflow (Design, Pracetak, Cetak, Finishing) dan counter badge job aktif. Modal View Flow menampilkan rincian pesanan dan timeline tahapan workflow. Modal Edit memuat data pengerjaan pesanan.
- **Job List (`/job-list`):** layout 2 kolom dengan sidebar All Flow dan filter jenis pekerjaan. Modal View Detail memuat Order Information dan rincian spesifikasi teknis pengerjaan cetak/finishing serta kuantitas OK / Rusak.
- **Job Branch (`/job-branch`):** modal Setting Job Branch (`JobBranchSettingModal.vue`) mencakup konfigurasi cabang, prioritas, status pengerjaan, editor dinamis spesifikasi sebelum cetak (`infoList`) dan sesudah cetak (`afterInfoList`), pemilih petugas penanggung jawab (`AssigneeSelect.vue`), serta besaran dan satuan insentif per job. Modal History (`JobBranchHistoryModal.vue`) menampilkan log riwayat cabang penyelesaian.
- **My Incentive (`/my-incentive`):** tabel riwayat insentif karyawan dengan 7 kolom literal (Date, Job Title, Flow Name, Incentive, Unit, Qty, Amount), tanpa kolom Action atau tombol Add sesuai referensi Netlify, widget KPI proporsional (Total Count & Amount), filter tanggal DateRangePicker, filter Name Of Process (Printing, Cutting), dan footer akumulatif total Amount.

## 5.3 Perilaku WEBSTORE yang sudah disetujui

Gunakan daftar ini sebagai batas regresi untuk grup menu Webstore (`https://percetakan-dulank.netlify.app/`):

- **Cart (`/cart`):** tabel daftar keranjang pelanggan dengan filter tanggal `DateRangePicker.vue`, filter Category dan Status (`TableFilterSelect.vue`). Format uang Price dan Total Price menggunakan `<CurrencyDisplay align="right">` dari angka murni. 4 widget KPI: Total Cart Amount, Total Cart Active, Total Cart Checkout, Total Cart Delete. Tanpa kolom Action.
- **Checkout (`/checkout`):** tabel transaksi checkout dengan filter tanggal, Metode, dan Status. Kolom Payment dan Delivery fee berformat mata uang rata kanan numerik murni. 4 widget KPI: Total Checkout, Total Revenue, Total Success, Total Failed. Tanpa kolom Action.
- **Wishlist (`/wishlist`):** tabel daftar wishlist dengan 4 widget KPI (Amount, Active, Checkout, Delete), filter Category dan Status, kolom Price dan Total Price berformat numerik murni rata kanan. Tanpa kolom Action.
- **Reviews (`/reviews`):** tabel ulasan pelanggan dengan 3 widget KPI proporsional (Total Review, Total Product, Total Publish), filter tanggal dan Rating (1-5), kolom Rating berikon bintang emas, Title, Review, dan badge Status. Tanpa kolom Action.
- **Contact Form (`/contact-form`):** tabel formulir kontak dengan widget Total Contact, filter tanggal, 5 kolom literal (Name, Email, Phone, Message, Date) tanpa kolom Action sesuai template referensi Netlify.

## 5.4 Perilaku PEOPLES Group yang sudah disetujui

Gunakan daftar ini sebagai batas regresi untuk grup menu Peoples:

- **Customers (`/customers`):** tabel daftar pelanggan 10 kolom literal (Customer ID, Name, Email, Customer Type, Balance IDR rata kanan numerik murni, Contact No, Join Channel, Date Join, Last Seen, Action). Form Add/Edit hanya berisi Customer ID (disabled), Customer Type, Customer Name, Email, dan Contact Number seperti legacy; **Balance dan Join Channel bukan input form**. Balance dihitung dari `customer-account-entries.json` berdasarkan `customerId`, sedangkan create dari admin memakai channel sistem `Offline`. Aksi per baris mencakup tombol `+ Address`, View, Edit, dan Delete; alamat tetap berelasi lewat `customerId`.
- **Customer Types (`/customer-type`):** tabel tipe klasifikasi pelanggan (Reguler, Corporate, VIP, Reseller, dll.), modal Add/Edit (12-kolom CSS Grid), TableSkeleton loader, dialog konfirmasi hapus `SalesConfirmDelete`, dan cetak/PDF via `DocumentPrintModal.vue`.
- **Address (`/address`):** tabel master alamat relasional dengan 4 widget KPI (Total Address, Total Province, Total City, Total Pos Code), Tab navigasi Customers dan Suppliers, modal Add/Edit (12-kolom CSS Grid), modal View Detail, TableSkeleton loader, dan cetak/PDF via `DocumentPrintModal.vue`.
- **Supplier (`/supplier`):** tabel rekanan pemasok bahan & kertas 8 kolom literal (ID Supplier, Supplier Name, Email, Contact, PIC Name, Status, Date, Action). Aksi per baris mencakup: tombol `+ Address` modal pemasok, Edit, dan Delete `SalesConfirmDelete`. Modal Add/Edit (12-kolom CSS Grid), modal Add Address pemasok, TableSkeleton loader, dan cetak/PDF via `DocumentPrintModal.vue`.
- **Branch Store (`/store-list`):** tabel gerai cabang fisik & workshop cetak 7 kolom literal (Store Name, Manager / User, Address, Phone, Email, Status, Action). Aksi baris Edit dan Delete `SalesConfirmDelete`. Modal Add/Edit (12-kolom CSS Grid), filter status, TableSkeleton loader, dan cetak/PDF via `DocumentPrintModal.vue`.

## 5.5 Perilaku HRM Group yang sudah disetujui

Gunakan daftar ini sebagai batas regresi untuk grup menu HRM:

- **Employees (`/employees`):** tabel master karyawan percetakan dengan 4 widget KPI (Total Employee, Active, Inactive/Resign, New Joiners), filter toolbar pencarian realtime, `DateRangePicker.vue` (Join date), filter Department, dan filter Status. Tabel 8 kolom literal (Employee ID, Name, Department, Alamat, Phone, Join, Status, Action). Aksi baris: View (Modal detail profil, darurat, akun), Edit (Modal form 12-kolom CSS Grid), Delete (`SalesConfirmDelete`). Dilengkapi `TableSkeleton.vue` loader dan dialog cetak/PDF resmi `DocumentPrintModal.vue` dengan Kop Surat PT Dulank Semesta Cida.

## 5.6 Implementasi CALCULATOR APPS (verification pending)

- **Struktur menu:** All Printing Shop (`/semua-percetakan`), All Machine: Offset (`/mesin-cetak`), Laminate (`/mesin-laminasi`), Die Cutting (`/mesin-pond`), Hot Print (`/mesin-poli`), All Paper Shop (`/semua-toko-kertas`), dan All Papers: Paper Group (`/kertas-group`), Paper Size (`/kertas-ukuran`), Paper Type (`/kertas-jenis`), Paper Price (`/kertas-harga`).
- Seluruh route memakai API, `useCalculatorMarketplace.ts`, komponen reusable di `app/components/pages/calculator/`, `SalesDataTable`, filter standar, detail, moderasi, soft-delete, dan `DocumentPrintModal`; tidak boleh kembali ke array hardcoded page, `alert`, atau raw `window.print()`.
- Data dipisah menjadi partner, partner metrics, listing, dan moderation history. Relasi listing memakai `sourcePartnerId`; metrics memakai `partnerId`; uang disimpan numerik murni.
- Modal manage mempertahankan field legacy: Tindakan, Durasi Bekukan kondisional, Notifikasi, dan Pesan. Submit wajib tersimpan melalui API dan riwayat moderasi.
- Status masih **implemented, verification pending** sampai build/typecheck serta flow browser desktop/mobile, reload persistensi, print/PDF, manage, detail, dan delete selesai diuji.

## 5.7 Implementasi PRODUCTS & SERVICES (verification pending)

- **Struktur menu:** Create Product (`/create-product`), Custom Category: Cetak Full Color (`/cetak-full-color`) dan Calender (`/calender`), Services Category: Printing (`/mesin-cetak-self`), Laminate (`/mesin-laminasi-self`), Die Cutting (`/mesin-pond-self`), Hot Print (`/mesin-poli-self`), serta Product List (`/product-list`).
- Product List mempertahankan kolom legacy: Item Code, Product, Category, Sub Category, Unit, Price (IDR), Price Type, Created, dan Action. View/Edit/Delete harus memakai record terpilih; delete memakai soft-delete dan Import Product harus benar-benar memvalidasi serta menyimpan CSV/JSON melalui API.
- Product wajib berelasi dengan `categoryId`, `subCategoryId`, `unitId`, dan `storeId`. Label relasi boleh dikirim sebagai output terhidrasi, tetapi foreign key menjadi identitas utamanya. Item Code tidak boleh duplikat. Uang dan kuantitas disimpan sebagai angka murni.
- Create/Edit Product tetap mengikuti field legacy lengkap. Quick-add Category, Sub Category, dan Unit memakai endpoint master terkait. Edit dibuka dengan query `id`, memuat record tersimpan, dan menyimpan melalui `useProducts()`/API, bukan state lokal page.
- Cetak Full Color dan Calender mempertahankan tab konfigurasi domain masing-masing, data server/API, biaya numerik, profit tier, toggle display, log transaksi sebagai output, serta tombol simpan nyata. Log transaksi tidak boleh diperlakukan sebagai form master bebas.
- Empat halaman Services Category memakai `WorkshopServicePage.vue`, `WorkshopServiceModal.vue`, `useWorkshopServices.ts`, dan `workshop-services.json`. Field modal bercabang sesuai legacy Offset/Digital Print/Large Format, Laminate, Pond, dan Poli; aksi detail, edit, soft-delete, filter, dan `DocumentPrintModal` terhubung ke data API.
- Status masih **implemented, verification pending** sampai build/typecheck bersih untuk cakupan, flow browser desktop/mobile, add/edit/reload/import/detail/delete, seluruh tab konfigurasi, dan Print/PDF selesai diuji.

## 5.8 Perilaku PRINT & PDF EXPORT yang sudah disetujui

Gunakan standar ini untuk fitur cetak (Print) dan ekspor PDF di seluruh repositori:

- **Isolasi Cetak Iframe (`app/utils/documentPrinter.ts`):** Cetak tabel/laporan dijalankan melalui iframe terisolasi (`printDocument()`) agar tidak bocor elemen UI Nuxt (sidebar, navbar, tombol, dark mode background).
- **Kop Surat Resmi (Letterhead):** Laporan cetak menyertakan Kop Surat resmi PT. DULANK SEMESTA CIDA (Logo, Alamat Jl. Arif Rahman Hakim Karawang, Kontak, Email, dan garis ganda pembatas resmi kop).
- **Kolom Tanda Tangan (TTD):** Menyertakan tanggal terformat ("Karawang, [Tanggal]") dan 2 kolom tanda tangan: "Dibuat Oleh" (Staff Administrasi) dan "Mengetahui" (Manager Operasional).
- **Dialog Opsi Cetak (`DocumentPrintModal.vue`):** Tombol Print (printer) dan PDF (file-text) di toolbar header (`SalesListHeader.vue`) membuka modal dialog opsi cetak:
  - **Cakupan Data:** Pilihan antara "Semua Data Terfilter", "Halaman Ini Saja (Current Page)", atau "Rentang Tanggal Khusus" (`DateRangePicker.vue`).
  - **Opsi Dokumen:** Toggle sertakan Kop Surat, Kolom TTD, Waktu/Tanggal Cetak, serta orientasi kertas A4 (Landscape/Portrait).
  - **Pengecualian Kolom:** Kolom 'actions' / 'action' otomatis diabaikan saat dicetak. Format mata uang diformat rata kanan dengan pemformat Rupiah `formatIDR()`.
  - Untuk master/configuration tanpa field tanggal, tetap gunakan modal yang sama dengan `:show-date-range="false"`; jangan membuat dialog cetak khusus hanya untuk menghapus pilihan tanggal.
  - Integrasi aktif selain laporan/transaksi mencakup Language, Download Files, Our Client, Banner, dan Permission Matrix. Data print harus berasal dari data API/state terfilter halaman.
- **Pengecualian Dokumen Khusus (Template Khusus dari HTML Asli):**
  - Halaman dokumen spesifik tetap mempertahankan template khususnya: **Sales Receipt** (`sales-receipt.vue` format thermal struk 80mm), **Sales Note** (`sales-note.vue` format nota penjualan), **SPK My Job / Job Order Ticket** (`printJobDetailTicket` format SPK produksi), **Invoice Details** (`invoice-details.html`), **Delivery Note Detail** (`delivery-note-detail.html`), **Quotation Detail** (`quotation-detail.html`), **Request Quotation Detail** (`request-quotation-detail.html`), dan **Payslip Detail** (`payslip-detail.html`).
  - Layout default Nuxt (`app/layouts/default.vue`) dan `app/assets/css/main.css` telah diproteksi dengan `@media print` (`print:hidden`, `print:ms-0`, `print:p-0`, `print:w-full`) sehingga dokumen khusus yang dicetak via browser tidak mengalami pergeseran margin 260px atau bocornya header/sidebar.

- Hubungkan aksi dengan record yang dipilih. Uji More, view, add, edit, delete, history, pembayaran, duplicate, dan print yang tersedia di menu tersebut.
- Edit memuat seluruh field dan item tersimpan. Menyimpan lalu membuka ulang atau reload harus menampilkan perubahan yang sama.
- API sukses menjadi dasar feedback berhasil. Jangan memakai timeout, toast, atau perubahan state lokal sebagai pengganti penyimpanan nyata.
- Saat request berjalan, cegah submit ganda. Saat gagal, tampilkan error dan pertahankan input pengguna agar dapat diperbaiki atau dicoba ulang.
- Validasi input dan perhitungan di server, termasuk kuantitas, nilai pembayaran/refund, dan total. Validasi frontend membantu pengguna tetapi tidak menggantikan validasi backend.
- Jangan menghilangkan fitur lama ketika memindahkan markup, mengganti tabel, atau menyesuaikan style.

## 7. Validasi sebelum menyatakan selesai

Untuk perubahan fitur SALES atau komponen/backend yang digunakannya, jalankan dari root proyek:

```sh
npm run build
npm run test:sales
npm run validate:structure
```

- `test:sales` membutuhkan hasil build dan menjalankan Nitro dalam direktori sementara. Pengujian create/update/delete/refund harus menggunakan data terisolasi, **bukan data runtime pengguna**.
- Lakukan pemeriksaan browser sesuai perubahan: bandingkan label/urutan kolom dengan HTML, buka modal, jalankan alur terkait, periksa persistensi setelah reload, serta desktop/mobile. Build sukses saja belum membuktikan tampilan dan flow sudah benar.
- Perubahan komponen bersama perlu diperiksa pada halaman pemakainya, bukan hanya satu route. Periksa juga error console dan kegagalan API.
- Jalankan pemeriksaan tipe bila relevan. Jika ditemukan error lama di luar cakupan, bedakan dari error baru dan laporkan batas validasi dengan jujur; jangan mengklaim seluruh typecheck bersih hanya karena build lulus.
- `MIGRATION_MANIFEST.json` adalah snapshot migrasi. Jangan mengembalikan fitur atau memperbarui seluruh hash hanya agar pemeriksaan snapshot cocok. Pertahankan keberadaan file dan keutuhan arsip/data yang dilindungi.
- Untuk perubahan dokumentasi saja, cukup periksa isi, tautan lokal, dan diff; tidak perlu menjalankan build aplikasi.

Laporan akhir harus menyebut perubahan yang selesai, pemeriksaan yang benar-benar dijalankan, serta kekurangan yang masih ada. Jangan menyatakan semua halaman atau semua flow sudah sesuai HTML jika yang diperiksa hanya sebagian.

## 8. Catatan progres dan perubahan

- Setiap pekerjaan wajib melalui siklus Check -> Implement -> Re-check 1 -> Re-check 2 -> Evidence -> Progress Sync pada `docs/AI_WORK_QUALITY_FRAMEWORK.md`. Re-check kedua harus mencari kegagalan dan regresi secara sengaja, bukan mengulang pembacaan pertama.
- Setiap AI yang mengubah kode atau dokumentasi wajib mencatat progres pekerjaannya dengan jelas di laporan akhir: file yang berubah, fitur/flow yang disentuh, reusable yang dibuat/dipakai, validasi yang dijalankan, validasi yang tidak dijalankan, dan sisa risiko.
- Jika pekerjaan menyelesaikan atau mengubah status sebuah menu/modul, perbarui dokumen progres yang relevan (`AI_HANDOVER_GUIDE.md`, `docs/STRUCTURE.md`, `docs/MENU_IMPLEMENTATION_COMMAND.md`, atau bagian perilaku menu di `AGENTS.md`) agar AI berikutnya tidak mengulang audit dari nol.
- Catatan progres harus jujur dan spesifik. Jangan menulis "semua sudah selesai" bila yang dicek hanya sebagian flow. Sebutkan route/menu dan tanggal kerja bila relevan.
- Jangan memperbarui progress matrix hanya untuk mengklaim selesai; status "selesai" harus berdasarkan implementasi yang benar-benar ada, flow yang terhubung, dan validasi yang dilaporkan.
- `approved baseline` hanya boleh dicatat setelah persetujuan pengguna. Jika runtime/build/browser tidak dijalankan karena larangan pengguna, gunakan `implemented, verification pending` dan tulis pemeriksaan yang masih dibutuhkan.
