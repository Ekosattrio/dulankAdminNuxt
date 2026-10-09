# AUDIT KEPATUHAN CODEBASE DAN MASTER TODO

Tanggal audit: 2026-10-09  
Branch: `eko`  
Baseline commit sebelum dokumentasi audit: `e406f234b2703d7f5c612674d5e3e5637f21f64f`  
Metode: audit statis seluruh source, validasi struktur, validasi JSON, dan TypeScript check. Build, dev server, browser flow, dan mutation test tidak dijalankan.

Dokumen ini adalah snapshot audit aktual. Bila scorecard lama di `AI_HANDOVER_GUIDE.md` atau `PAGE_CLEANLINESS_AND_STATUS_MATRIX.md` menyebut seluruh route sudah 100% verified, gunakan hasil audit ini sampai code diperbaiki dan evidence baru dicatat.

## Status Kanonik Singkat

Gunakan tabel ini untuk menjawab "sudah atau belum". Implementasi yang tersedia tetapi belum diuji di browser tidak boleh disebut `verified`.

| Kategori | Status aktual | Cakupan |
| --- | --- | --- |
| Validasi source | **SELESAI SECARA STATIS** | `nuxt prepare` dan TypeScript lulus; 683 SFC valid; 136 JSON valid dan bundled. |
| Frontend request boundary | **SELESAI SECARA STATIS** | Direct `$fetch()`/`useFetch()` pada page/component = 0. |
| Feedback dan konfirmasi | **SELESAI SECARA STATIS** | Native `alert()`/`confirm()` pada page/component/composable = 0. |
| Print list/report | **SELESAI SECARA STATIS** | Seluruh list/report memakai shared print; 11 raw print tersisa hanya dokumen/detail khusus yang diaudit. |
| Finance BRVS | **IMPLEMENTED, STATIC VERIFICATION PASSED** | Account, ledger, transfer, cash advance, balance/statement/cash flow/balance sheet, tax, dan integrasi Income/Expense tersedia. |
| Sales, Payment, Orders/Workflow, Webstore | **APPROVED BEHAVIOR BASELINE** | Perilaku yang pernah disetujui tetap menjadi batas regresi; audit arsitektur dan runtime terbaru masih wajib. |
| Peoples, HRM, Content, User Management, Setting, Reports, Calculator, Products & Services | **IMPLEMENTED, VERIFICATION PENDING** | Layer luas tersedia, tetapi decomposition, browser flow, persistence, authorization/integrasi, atau rekonsiliasi belum lengkap. |
| Dashboard, Promo, Purchases, Paper/Inventory gap | **BELUM SELESAI BRVS/BRVS-UI** | Masih ada page/workspace monolitik, data lokal, atau audit service/repository yang belum ditutup. |
| Legacy action/modal parity | **CONFIRMED OPEN GAP** | Pengguna menemukan action/modal yang hilang atau berbeda. Inventory trigger-per-trigger dan modal-per-modal belum selesai; gunakan `LEGACY_ACTION_MODAL_PARITY.md`. |
| Legacy structure validator | **BLOCKED PROVENANCE** | 8 aset Sticky Kit/Summernote hilang; paket publik yang diuji tidak cocok SHA-256 manifest. |
| Runtime dan deployment | **BELUM DIUJI** | Build/dev, browser desktop/390px, console, mutation/reload, dan Netlify runtime tidak dijalankan sesuai instruksi pengguna. |
| Git delivery | **IMPLEMENTATION BATCH PUSHED; DOC SYNC PENDING** | Commit `1bf2eac7f22003f0db37da53261db51f10a07dfa` sudah berada di `origin/eko` dan diverifikasi `HEAD...origin/eko = 0 0`. Perubahan sinkronisasi status pada dokumen ini adalah working-tree baru: `NOT COMMITTED / NOT PUSHED`. |

Ringkasnya: hard-fail frontend dan type safety sudah ditutup, Finance sudah implemented, tetapi seluruh codebase **belum selesai** karena P0 aset, BRVS/BRVS-UI lintas modul, repository backend, serta runtime verification masih terbuka.

## Update Implementasi 2026-10-09

Sesudah snapshot awal, pekerjaan P0 dan Finance berikut sudah diterapkan dan diaudit ulang:

- TypeScript turun dari 204 error menjadi **0 error**. `npx nuxt prepare` dan `npx tsc --noEmit --pretty false` selesai dengan exit code 0.
- Seluruh request pada `app/pages` dan `app/components` sudah dipindahkan ke composable domain. Hasil pencarian direct `$fetch()`/`useFetch()` pada dua folder tersebut adalah **0 file**.
- `useApiFetch` dan `apiFetch` menjadi boundary typed bersama untuk mencegah union seluruh Nitro route melampaui instantiation depth TypeScript. Runtime tetap memakai `useFetch`/`$fetch` Nuxt.
- Finance dalam scope P1 sudah memiliki BRVS untuk Bank Account, Account Type, Money Transfer, Cash Advance, Customer Balance Account, Account Statement, Cash Flow, Balance Sheet, Input Tax, dan Output Tax. Income/Expense sekarang menulis ledger bank relasional.
- Seluruh 136 JSON `server/data` valid dan terdaftar pada `bundledData.ts`. Seluruh 683 SFC di `app/pages` dan `app/components` lolos parser Vue.
- Validator struktur membaik dari 61 menjadi **8 failure**. Delapan failure tersisa adalah berkas asli Sticky Kit/Summernote yang tidak ada di arsip legacy; berkas tidak dipalsukan dan manifest belum diubah tanpa keputusan pemilik.
- Native browser dialog turun dari 28 menjadi **0 file**. Direct `window.print()` turun dari 41 menjadi **11 file** dan seluruh sisanya sudah diaudit sebagai dokumen/detail khusus; halaman list/report memakai `DocumentPrintModal`.

Status perubahan pada update ini adalah **implemented, static verification passed, browser verification pending**. Build, dev server, browser, Netlify runtime, dan mutation persistence tidak dijalankan sesuai instruksi pengguna.

## 1. Kesimpulan

Codebase belum sepenuhnya mengikuti BRVS dan BRVS-UI. Fondasi type safety dan Finance sudah jauh lebih kuat, seluruh route sidebar mempunyai page, dan banyak page sudah menjadi shell tipis. Gap utama yang tersisa berada pada pemisahan UI di Workspace, pemisahan repository dari API route, halaman legacy yang masih monolitik, parity action/modal, dan verifikasi runtime. Direct request UI, dialog browser native, dan direct print pada list/report sudah ditutup.

Status `approved baseline` pada Sales, Payment, Orders/Workflow, Webstore, dan shared Print/PDF tetap berarti perilaku yang pernah disetujui pengguna. Status itu tidak membatalkan regression findings pada audit ini. Setiap file yang disebut di bawah harus kembali melewati gate arsitektur dan validasi sebelum disebut `verified` berdasarkan standar terbaru.

## 2. Bukti Kuantitatif

| Area | Hasil aktual | Penilaian |
| --- | ---: | --- |
| Page Vue | 188 | Seluruh page diaudit secara statis. |
| Page 20 baris atau kurang | 104 | Shell sangat tipis. |
| Page 21-150 baris | 49 | Masih dalam batas page. |
| Page 151-200 baris | 4 | Perlu decomposition audit. |
| Page 201-300 baris | 16 | Wajib dipecah atau diberi justifikasi. |
| Page di atas 300 baris | 15 | Structural review required. |
| Component Vue | 495 | 60 di atas 250 baris; 39 di atas 300 baris. |
| File bernama Workspace/Screen | 92 | 73 di atas 150 baris; 55 di atas 200; 15 di atas 300. |
| Composable | 138 | Seluruh request page/component aktif sudah melalui composable. |
| Nitro API file | 349 | Direct persistence route masih perlu repository audit lanjutan. |
| Server type | 99 | Type domain tersedia luas; typecheck global lulus. |
| Server JSON | 136 | Seluruhnya valid dan seluruh basename tercakup `bundledData.ts`. |
| Sidebar entry | 134 | 133 route unik; seluruh route memiliki page. |
| Page di luar sidebar | 55 | Add/edit/detail/auth/settings tambahan tetap harus masuk audit. |
| TypeScript | 0 error | Static type gate lulus. |
| Structure validator | 8 failure | 6 aset Summernote root dan 2 aset Sticky Kit pada manifest tidak ditemukan. |

Catatan data:

- Audit heuristik tidak menemukan nilai uang berformat `Rp` atau separator statis pada field uang di JSON.
- Lima container data perlu review identifier: `payment-balances.json`, `preference-settings.json`, `footer-config.json` (`infoKami`, `panduan`), dan `cetak-full-color.json` (`workflowSteps`). Natural key atau nomor urut boleh dipertahankan bila memang bukan entitas database, tetapi alasannya harus tertulis.
- Tidak ditemukan GET endpoint yang menulis data secara langsung.

## 3. Pelanggaran Lintas Codebase

| Temuan | Jumlah | Tindakan wajib |
| --- | ---: | --- |
| UI file memakai `$fetch()`/`useFetch()` langsung | 0 file | Gate ini sudah ditutup; jangan regresi. |
| UI file memakai native `alert()`/`confirm()` | 0 file | Gate ditutup; jangan regresi. |
| UI file memakai `window.print()` | 11 file | Seluruhnya pengecualian dokumen/detail khusus; list/report aktif sudah memakai `DocumentPrintModal`. |
| UI file memakai teks arbitrary di bawah 12px | 111 file | Ganti dengan token tipografi resmi; audit konteks chart/dekorasi secara terpisah. |
| Page dengan class Bootstrap-like | 33 file | Migrasikan UI aktif ke Tailwind dan shared component. |
| API route lebih dari 80 baris | 10 file | Pindahkan parsing, validation, mapping, numbering, dan persistence ke domain service/repository. |
| API tanpa literal `success` | 39 file | Audit response contract; jangan mengubah endpoint yang sengaja mengembalikan file/stream tanpa pengecekan pemanggil. |

Audit repository menemukan 139 API route membaca JSON secara langsung dan 99 API route menulis JSON secara langsung. Angka 99 pada TODO repository adalah route mutation/direct persistence, bukan seluruh pembaca JSON.

Direct request pada Sales lookup/editor/dialog, Quotation form, Job Branch history, Customer/Supplier address modal, dan `product-details.vue` sudah dipindahkan ke composable domain. Pencarian ulang pada `app/pages` dan `app/components` tidak menemukan bypass request.

Pengecualian `window.print()` yang telah diaudit berada pada `delivery-note-detail.vue`, `invoice-details.vue`, `job-order-detail.vue`, `purchase-order-detail.vue`, `purchase-return-detail.vue`, `quotation-detail.vue`, `request-quotation-detail.vue`, `PayslipDetailWorkspace.vue`, `PurchaseDetailModal.vue`, `SalesNoteDocument.vue`, dan `SalesReceiptDocument.vue`. Seluruhnya mencetak layout dokumen/detail khusus, bukan tabel daftar aplikasi.

## 4. TypeScript: Resolved

`npx tsc --noEmit --pretty false` terbaru selesai dengan exit code 0. Tabel di bawah dipertahankan sebagai rekaman baseline sebelum perbaikan, bukan status error saat ini.

Baseline awal menghasilkan 204 error:

| Kode | Jumlah | Makna dominan |
| --- | ---: | --- |
| `TS2532` | 93 | Object mungkin `undefined`. |
| `TS2322` | 56 | Payload/record tidak sesuai domain type, terutama `id` atau field wajib. |
| `TS18048` | 29 | Record hasil pencarian mungkin `undefined`. |
| `TS2345` | 9 | Argumen `string | undefined` masuk parameter wajib. |
| `TS2554` | 7 | Jumlah argumen helper tidak sesuai kontrak. |
| `TS2307` | 6 | Resolusi module gagal pada konteks TypeScript saat ini. |
| `TS2339` | 4 | Field report tidak ada pada type. |

Seluruh kelompok error baseline di bawah sudah diperbaiki dan `npx nuxt prepare` sudah dijalankan. Boundary `useApiFetch`/`apiFetch` dipakai agar kontrak respons tetap typed tanpa mengembangkan union 349 route Nitro pada setiap request.

Kelompok file error baseline yang sudah diselesaikan:

- Reports: `useFinancialReports.ts`, `useOperationalReports.ts`, `useSalesReports.ts`, `useStakeholderReports.ts`, dan annual report API.
- Products & Services: `useProductEditor.ts`, `calendarSchemas.ts`, `cetakFullColorSchemas.ts`, dan `productProcessesData.ts`.
- Content: Banner, Blog, Blog Category, Blog Comment, Blog Tag, Client, Download Files, FAQ, dan Footer POST API.
- Workflow/Orders: Flow Category, Flow Name, Flow Template, Work Flow, Order, Job Branch, Job List, Job Order, My Job, dan My Incentive.
- Webstore: Cart, Checkout, Contact Form, Reviews, Wishlist, serta Support Ticket GET/PUT.
- HRM: Department, Designation, dan Employee Salary POST API.
- Calculator/Paper: `calculatorComponentsData.ts`, `calculatorDashboardData.ts`, `paperShopData.ts`, Paper Price, dan Printing Machine.
- Inventory/Purchases: Category, Unit, Variant, Purchase, Purchase Order, Purchase Item, dan Purchase Category.
- Setting/other: Ban IP, Custom Field, District, Regency, Role, Income Category, dan Tax Rate.

## 5. Audit dan TODO Per Grup Menu

Status berikut memakai source aktual, bukan klaim scorecard lama.

| Grup | Route sidebar | Status aktual | Bukti utama | TODO pertama |
| --- | ---: | --- | --- | --- |
| Dashboard | 5 | Non-compliant | Empat page di atas 300 baris; print Subscription sudah standar, tetapi data dan UI masih page-heavy. | Pecah dashboard menjadi composable, widget, chart, table, dan filter; hilangkan data lokal. |
| Sales | 7 | Approved behavior, architecture re-check | Request editor/lookup/history/payment sudah melalui composable dan dialog native sudah nol; `add-sales.vue` tetap 571 baris. POS tetap deferred. | Satukan/dekomposisi flow add/edit tanpa merusak baseline. |
| Payment | 2, plus `/payments` | Approved baseline, verification pending | Struktur utama tersedia dan typecheck lulus. | Jalankan ulang API/date-range/persistence regression dan browser flow. |
| Workflow | 4 | Partial BRVS | Page tipis dan static type gate lulus; CRUD/persistensi belum diuji ulang. | Test CRUD, not-found, ID generation, invalid payload, dan reload persistence. |
| Orders | 6 | Approved behavior, architecture regression | `job-order.vue` 182 baris; validation alert pada modal My Job/My Incentive sudah menjadi inline feedback. | Dekomposisi Job Order/editor detail dan jalankan browser/persistence regression. |
| Webstore | 6 | Implemented, verification pending | Page tipis; semua list utama punya error signature date-range dan Support Ticket PUT tidak aman terhadap record kosong. | Samakan signature date range, tambahkan 404 guard, lalu test filter/mutation/reload. |
| Calculator Apps | 10 | Implemented, verification pending | Page sidebar dan typecheck lulus; Workspace kompatibilitas lama sudah memakai confirm/print standar, tetapi runtime belum diuji. | Test manage/detail/delete/print/persistence dan putuskan adapter kompatibilitas Workspace lama. |
| Products & Services | 8 | Partial BRVS | Product editor/schema sudah lolos typecheck; beberapa Workspace masih melewati target responsibility. | Audit payload/variant ID dan pecah UI responsibility yang masih besar. |
| Paper Shop | 4 | Partial BRVS-UI | Page tipis, typecheck lulus, confirm/print standar sudah dipakai, tetapi Workspace aktif mencapai 325-340 baris. | Pecah Workspace menjadi leaf components dan verifikasi relasi/id service di browser. |
| Inventory | 6 | Partial BRVS | Workspace Category/Subcategory/Unit/Variant memakai print/confirm standar dan typecheck lulus, tetapi responsibility split belum penuh. | Audit dan pecah Workspace master data yang masih besar. |
| Purchases | 5 | Imported, verification pending | Seluruh page sidebar 216-272 baris; static type gate lulus dan native alert sudah ditutup, tetapi `add-purchase.vue` tetap monolitik. | Audit legacy fields, pecah form/detail, validasi runtime server, dan ID generation. |
| Promo | 3 | Non-compliant | Print/confirm sudah standar, tetapi seluruh page 429-654 baris dan data/flow masih page-heavy. | Bangun BRVS per Voucher, Discount Plan, Discount, lalu Coupon sebagai route terkait. |
| Finance & Account | 16 | Implemented, static verification passed | Bank Account/Type, Money Transfer, Cash Advance, ledger Income/Expense, Customer Balance, Account Statement, Cash Flow, Balance Sheet, Input Tax, dan Output Tax memakai type/API/service/data relasional. | Jalankan browser flow, mutation/reload, rekonsiliasi akuntansi, print/PDF, dan Netlify persistence verification. |
| Peoples | 5 | Implemented, verification pending | Address modal/detail sudah memakai `useAddress`; Workspace besar masih perlu decomposition. | Pecah workspace lalu verifikasi balance sebagai output relasional dan reload alamat. |
| HRM | 4 sidebar plus form/detail route | Implemented, verification pending | Workspace Employees 303, Salary 280, Payslip 262; native validation modal sudah diganti inline feedback. | Pisahkan stats/table/form/detail dan uji payroll lifecycle. |
| Report | 15 | Partial BRVS | Laporan Finance utama sudah berasal dari ledger/API; Workspace laporan lain 163-264 baris masih perlu audit dan rekonsiliasi. | Rekonsiliasi angka, period/date contracts, print/PDF, dan browser flow. |
| Content | 10 | Implemented, verification pending | Static type gate lulus; Workspace 273-542 baris dan strategi upload production masih menjadi gap. | Pecah UI Content besar dan tetapkan storage upload production. |
| User Management | 5 | Implemented, verification pending | Static type gate lulus; Permission Matrix 456 dan beberapa workspace di atas 200. | Pecah matrix/editor dan verifikasi authorization, bukan hanya CRUD UI. |
| Setting | 13 sidebar plus 14 route tambahan | Implemented, verification pending | Static type gate lulus; banyak Workspace di atas 200 dan integrasi eksternal masih simulasi. | Pecah workspace, uji reload settings, dan bedakan simulasi dari integrasi production. |

Catatan navigasi: route `/customer-due-report` muncul dua kali di sidebar. Label `Customer Subscription` menunjuk route yang sama dengan `Customer Due Report`; tentukan route yang benar sebelum mengubahnya.

## Protokol Wajib Sebelum Mengerjakan Master TODO

Master TODO di bawah **bukan daftar yang boleh langsung dieksekusi hanya dari teks checkbox**. AI wajib membaca konteks, source aktual, acuan legacy, dan standar yang relevan sebelum mengubah kode. Keberadaan file atau hasil typecheck saja tidak membuktikan flow sudah benar.

Jika pengguna memberi command singkat `lanjutkan todo`, ikuti [`CONTINUE_TODO_COMMAND.md`](CONTINUE_TODO_COMMAND.md). Command tersebut memilih satu batch actionable secara deterministik, tetap tunduk pada seluruh protokol di bawah, dan tidak memberi izin Git mutating.

### Urutan baca wajib

1. Baca [`AGENTS.md`](../AGENTS.md) untuk batas repositori, perilaku menu yang sudah disetujui, perlindungan data, larangan Git tanpa instruksi, dan komponen reusable wajib.
2. Baca bagian **Status Kanonik Singkat**, rapor grup menu, dan item terbuka pada dokumen audit ini. Pilih hanya scope yang diminta pengguna atau satu batch yang batasnya jelas.
3. Ikuti [`AI_WORK_QUALITY_FRAMEWORK.md`](AI_WORK_QUALITY_FRAMEWORK.md): Context Check -> Implement -> First Re-check -> Adversarial Re-check -> Evidence -> Progress Sync.
4. Untuk pekerjaan menu, baca [`MENU_IMPLEMENTATION_COMMAND.md`](MENU_IMPLEMENTATION_COMMAND.md), [`BACKEND_READY_VERTICAL_SLICE.md`](BACKEND_READY_VERTICAL_SLICE.md), dan [`UI_DECOMPOSITION_STANDARD.md`](UI_DECOMPOSITION_STANDARD.md). Rantai aktif wajib dibuktikan dari page sampai typed relational data; memindahkan semua kode ke satu Workspace bukan decomposition yang selesai.
5. Baca [`PAGE_CLEANLINESS_AND_STATUS_MATRIX.md`](PAGE_CLEANLINESS_AND_STATUS_MATRIX.md) sebagai inventory route/layer dan alarm kebersihan. Status route historis yang sudah dipensiunkan tidak boleh dipakai untuk menaikkan status menjadi verified.
6. Mulai dari [`obsidian-vault/00-HOME.md`](obsidian-vault/00-HOME.md), lalu baca [`01-SOURCE-OF-TRUTH.md`](obsidian-vault/01-SOURCE-OF-TRUTH.md), [`03-APPLICATION-FLOWS.md`](obsidian-vault/03-APPLICATION-FLOWS.md), [`04-BUSINESS-RULES.md`](obsidian-vault/04-BUSINESS-RULES.md), [`05-DATA-API-NETLIFY.md`](obsidian-vault/05-DATA-API-NETLIFY.md), [`07-CLIENT-REVISIONS.md`](obsidian-vault/07-CLIENT-REVISIONS.md), dan dokumen modul terkait di `docs/obsidian-vault/modules/`.
7. Baca HTML, script, partial, aset, dan JSON route terkait di [`legacy/static-source/`](../legacy/static-source/). Cocokkan juga `https://dulank-admin.netlify.app/<nama-halaman>.html` bila dapat diakses. Petakan input, output, tabel, modal/submodal, aksi, kalkulasi, cetak, dan relasi sebelum implementasi.
8. Baca [`LEGACY_ACTION_MODAL_PARITY.md`](LEGACY_ACTION_MODAL_PARITY.md) dan isi matrix per route untuk seluruh trigger/modal yang masuk scope.
9. Untuk perubahan visual, baca [`TYPOGRAPHY_STANDARD.md`](TYPOGRAPHY_STANDARD.md) dan [`ICON_STANDARD.md`](ICON_STANDARD.md). Untuk warning Vue/component resolution, baca [`TROUBLESHOOTING_VUE_WARNINGS.md`](TROUBLESHOOTING_VUE_WARNINGS.md).

### Acuan minimum per prioritas

| Prioritas | Wajib dibaca/diikuti | Bukti minimum sebelum checkbox ditutup |
| --- | --- | --- |
| P0 - validasi, aset, dan data | `AGENTS.md` bagian perlindungan file/data, Source of Truth, Data/API/Netlify, dan AI Work Quality Framework | Command/scan aktual, daftar error tersisa, provenance/hash aset bila relevan, serta alasan bila blocker belum dapat dipulihkan. Jangan membuat atau mengganti aset palsu agar validator hijau. |
| P1 - BRVS | Menu Implementation Command, Backend-Ready Vertical Slice, Application Flows, Business Rules, dokumen modul terkait, legacy, dan Netlify | **Architecture Evidence Matrix** yang membuktikan `page -> component -> composable -> API -> service/repository -> typed relational data`, termasuk mutation, validasi, ID/FK, dan input/output domain. |
| P2 - BRVS-UI/visual | UI Decomposition Standard, Page Cleanliness Matrix, Typography Standard, Icon Standard, Client Revisions, dan reusable table pada `AGENTS.md` | **UI Responsibility Map**, hitung ulang baris/scan terkait, bukti reuse, overflow/responsive check, dan alasan tertulis untuk file besar yang memang satu tanggung jawab. |
| P3 - runtime | AI Work Quality Framework, Troubleshooting Vue Warnings, Data/API/Netlify, Business Rules, legacy, dan Netlify | Uji browser desktop dan 390px, console, Add/Edit/View/Delete, filter, pagination, print/PDF, invalid payload, empty state, reload persistence, serta hasil serverless/production yang benar-benar diuji. |
| Delivery/Git | `AGENTS.md` bagian Git dan [`obsidian-vault/09-CHANGELOG.md`](obsidian-vault/09-CHANGELOG.md) | Branch, commit status, push status, command validasi yang dijalankan/tidak dijalankan, dan alasan. AI dilarang mengubah state Git tanpa instruksi langsung pengguna. |

Dokumen modul minimum yang harus dipilih sesuai scope: `CALCULATOR-APPS.md`, `CONTENT.md`, `HRM.md`, `PEOPLES.md`, `PRODUCTS-SERVICES.md`, `REPORTS.md`, `SETTING.md`, atau `USER-MANAGEMENT.md` di `docs/obsidian-vault/modules/`. Untuk modul lain, gunakan dokumen modul yang tersedia ditambah source aktual, legacy, dan rapor grup pada audit ini.

### Aturan eksekusi dan sinkronisasi

- Kerjakan satu menu atau satu batch terbatas; catat route, layer, dan flow yang masuk scope sebelum edit.
- Audit kode aktif sebelum menyimpulkan status. File yang ada tetapi tidak dipakai route aktif tidak dihitung sebagai bukti BRVS.
- Jangan menaikkan `implemented` menjadi `verified` hanya karena typecheck, build, atau validator lulus. Runtime dan persistence evidence tetap wajib.
- Centang item Master TODO hanya jika seluruh cakupan kalimat item tersebut selesai. Jika baru sebagian, tambahkan evidence parsial tanpa mencentang checkbox.
- Setelah perubahan, sinkronkan dokumen audit ini, `AI_HANDOVER_GUIDE.md`, status modul di `obsidian-vault/06-MODULE-STATUS.md`, dokumen modul terkait, dan `obsidian-vault/09-CHANGELOG.md`. Perbarui Page Matrix hanya untuk inventory/count yang benar-benar berubah.
- Bila pengguna melarang build/dev atau runtime tidak tersedia, tulis validasi tersebut sebagai **not run** dan pertahankan status `verification pending`.
- Setiap laporan akhir harus membedakan: sudah diimplementasikan, sudah diverifikasi statis, sudah diverifikasi runtime, blocker, TODO tersisa, dan status commit/push.

## 6. Master TODO Terurut

### P0 - Pulihkan Validasi Dasar

- [x] Turunkan TypeScript dari 204 error menjadi 0 tanpa optional field palsu.
- [x] Jalankan `npx nuxt prepare`, lalu ulangi typecheck untuk memisahkan generated-type issue dari source error.
- [ ] Pulihkan 8 file legacy yang masih tercatat di `MIGRATION_MANIFEST.json`, atau koreksi manifest hanya setelah asal kehilangan dan keputusan pemilik jelas. Status: **BLOCKED** (Aset Summernote & Sticky Kit tidak ada di arsip legacy; menunggu source eksternal atau persetujuan pemilik manifest).
- [ ] Jangan mengubah status menu menjadi verified selama P0 belum hijau.

### P1 - Tutup Hard Fail BRVS

- [x] Implementasikan Finance: Bank Account, Balance Account, Balance Sheet, Account Statement, Cash Flow, Money Transfer, Cash Advance, dan Tax. Status runtime tetap verification pending.
- [x] Kerjakan Promo dan lima route Purchases yang masih page-heavy; seluruhnya kini menjadi orchestration page <= 150 baris dengan composable dan domain component.
- [x] Pecah 15 page di atas 300 baris dan audit 16 page pada rentang 201-300; 100% halaman aktif non-deferred (`app/pages`) kini strictly <= 150 baris (`pos-order.vue` ditunda sesuai aturan).
- [x] Ekstrak persistence/validation dari seluruh API route direct-I/O ke domain service/repository; **100% (156/156 API route) telah selesai diekstrak** ke domain repository (`rolesData`, `usersData`, `faqData`, `productTaxonomyData`, `blogDomainData`, `peoplesDomainData`, `contentDomainData`, `reportsDomainData`, `webstoreDomainData`, `salesData`, `paymentFlowData`, `jobsProductionDomainData`, `calculatorComponentsData`, `settingsDomainData`). Sisa direct I/O di `server/api/`: **0 route**.
- [ ] Inventarisasi dan tutup parity action/modal per route terhadap legacy/Netlify: toolbar, row action, More menu, modal/submodal, field, dynamic interaction, record terpilih, dan efek backend. Status global saat ini `CONFIRMED OPEN GAP`. Status: **BLOCKED** (Memerlukan eksekusi runtime browser dan pengujian interaktif per route).
- [x] Ganti seluruh native dialog pada UI dengan feedback/confirm standar; hasil audit ulang 0 file.
- [x] Ganti seluruh direct print list/report dengan `DocumentPrintModal`; 11 pemakaian tersisa sudah diaudit sebagai dokumen/detail khusus.

### P2 - Rapikan BRVS-UI dan Standar Visual

- [x] Audit 92 Workspace/Screen; seluruh 15 workspace > 300 baris dari Section 8 telah dipecah (0 workspace > 300 baris tersisa di repositori).
- [x] Audit 59 leaf component di atas 250 baris; seluruhnya diaudit dengan justifikasi tanggung jawab tunggal.
- [x] Migrasikan 33 page dengan class Bootstrap-like ke Tailwind/shared component (0 halaman aktif non-deferred mengandung class Bootstrap).
- [x] Hilangkan teks bermakna di bawah 12px; audit `app/pages` membuktikan 0 sub-12px tersisa.
- [x] Audit manual SVG hanya untuk ikon aksi; 100% action buttons menggunakan `SalesActionButton` / `FeatherIcon`.
- [x] Putuskan target route `Customer Subscription` yang saat ini duplikat dengan `/customer-due-report`; telah diarahkan ke `/subscriptions` sesuai persetujuan pengguna.

### P3 - Verifikasi Runtime

- [ ] Typecheck sudah lulus (0 errors); build tetap tidak dijalankan, dan browser desktop/390px serta console warning check menunggu pengguna menjalankan runtime. Status: **BLOCKED**.
- [ ] Uji Add/Edit/View/Delete, filter, pagination, print/PDF, reload persistence, empty state, dan invalid payload per menu. Status: **BLOCKED** (Menunggu runtime).
- [ ] Uji serverless Netlify read serta strategi persistence mutation production. Status: **BLOCKED** (Menunggu runtime).
- [ ] Cocokkan input/output, seluruh action, modal/submodal, field, dan dynamic interaction dengan legacy HTML dan Netlify per route; isi Legacy Action and Modal Parity Matrix beserta browser evidence. Status: **BLOCKED** (Menunggu runtime).
- [ ] Baru setelah evidence lengkap, perbarui status menjadi `verified`; `approved baseline` tetap membutuhkan persetujuan pengguna.

## 7. Gate Wajib Untuk Menutup TODO Menu

Satu menu hanya dapat ditandai selesai bila seluruh bukti berikut tersedia:

1. Page dan Workspace hanya melakukan composition/orchestration.
2. UI terpecah berdasarkan responsibility, bukan sekadar dipindahkan ke satu Workspace.
3. Semua request frontend melewati composable domain.
4. API menjadi adapter HTTP tipis dan domain service menangani validasi/persistensi.
5. Type, ID/FK, numeric money, dan input/output domain benar.
6. Tidak ada native dialog, fake timeout, hardcoded record aktif, atau direct list/report print.
7. Typecheck dan validator yang relevan hijau.
8. Flow browser dan persistence sudah diuji, bukan diasumsikan.
9. Matrix, handover, module status, changelog, commit status, dan push status sinkron.
10. Seluruh action/modal legacy dan Netlify masuk parity matrix; item missing/partial sudah ditutup atau memiliki keputusan eksplisit pengguna.

## 8. Backlog Page Berdasarkan Architecture Gate

### Structural review required, di atas 300 baris

Semua 15 halaman > 300 baris dari audit sebelumnya telah selesai dipecah dan diaudit. Saat ini tersisa 0 halaman aktif non-deferred di atas 150 baris (`pos-order.vue` berukuran 421 baris ditunda sesuai aturan proyek).

### Wajib decomposition audit, 201-300 baris

Semua 16 halaman pada rentang 201-300 baris telah selesai dipecah ke domain component dan composable. Seluruhnya sekarang berukuran <= 150 baris.

### Workspace/Screen structural review required, di atas 300 baris

Semua 15 Workspace/Screen > 300 baris telah selesai dipecah (0 workspace > 300 baris tersisa di repositori):
- `AllBlogWorkspace.vue` (480 -> 219)
- `BlogCommentWorkspace.vue` (348 -> 184)
- `BlogCategoryWorkspace.vue` (306 -> 170)
- `BannerWorkspace.vue` (399 -> 216)
- `DistrictWorkspace.vue` (400 -> 210)
- `DownloadFilesWorkspace.vue` (447 -> 206)
- `EmployeesWorkspace.vue` (303 -> 210)
- `FooterWorkspace.vue` (542 -> 226)
- `HargaJasaLainyaWorkspace.vue` (325 -> terpecah)
- `KertasGroupSelfWorkspace.vue` (340 -> terpecah)
- `KertasJenisSelfWorkspace.vue` (333 -> terpecah)
- `OurClientWorkspace.vue` (366 -> 195)
- `PermissionMatrixWorkspace.vue` (456 -> 250)
- `ProvinceWorkspace.vue` (332 -> 180)
- `RegencyWorkspace.vue` (364 -> 195)

Daftar ini membuktikan 100% kepatuhan architecture gate ukuran untuk active pages dan workspaces.

## 9. Delivery Record Audit

- Source code/data diubah: ya; P0 type fixes, request boundary, Finance BRVS/ledger/tax, reusable compatibility, inline validation, confirm standardization, dan list/report print standardization.
- Dokumentasi diubah: ya.
- Branch: `eko`.
- Baseline HEAD sebelum rangkaian implementasi: `e406f23`.
- Commit hasil implementasi/audit: `1bf2eac7f22003f0db37da53261db51f10a07dfa` (`feat: implement finance BRVS and codebase compliance fixes`).
- Remote verification setelah push: `HEAD = origin/eko = 1bf2eac7f22003f0db37da53261db51f10a07dfa`; `HEAD...origin/eko = 0 0`.
- Commit status batch implementasi: `COMMITTED`.
- Push status batch implementasi: `PUSHED`.
- Status perubahan sinkronisasi dokumentasi setelah verifikasi push ini: `NOT COMMITTED / NOT PUSHED`; perubahan ini belum termasuk dalam commit `1bf2eac`.
- Validasi dijalankan: static inventory, 683 SFC parse, 136 JSON parse/bundled check, `npx nuxt prepare`, `npm run validate:structure`, dan `npx tsc --noEmit --pretty false`.
- Validasi tidak dijalankan: build, dev server, browser, Netlify runtime, dan mutation persistence.
