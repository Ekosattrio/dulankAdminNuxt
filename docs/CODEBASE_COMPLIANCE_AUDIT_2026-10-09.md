# AUDIT KEPATUHAN CODEBASE DAN MASTER TODO

Tanggal audit: 2026-10-09
Update aktif: 2026-10-11
Branch: `main`
Baseline commit sebelum perubahan aktif: `62bbdb8ca7cf3c25e2e4f4d7255d48bfed2c71ca`
Metode: audit statis seluruh source, validasi struktur/JSON/TypeScript/build, serta API/persistence/data safeguard dan browser runtime untuk 51 route Sales/Payment/Sales-adjacent/Webstore/Orders/Workflow/Dashboard Admin/Analytics Dashboard/Subscriptions/Kalkulator Dashboard/Billing/Voucher/Cetak Full Color. Route lain tetap menunggu verifikasi per menu.

Dokumen ini adalah snapshot audit aktual. Bila scorecard lama di `AI_HANDOVER_GUIDE.md` atau `PAGE_CLEANLINESS_AND_STATUS_MATRIX.md` menyebut seluruh route sudah 100% verified, gunakan hasil audit ini sampai code diperbaiki dan evidence baru dicatat.

## Status Kanonik Singkat

Gunakan tabel ini untuk menjawab "sudah atau belum". Implementasi yang tersedia tetapi belum diuji di browser tidak boleh disebut `verified`.

| Kategori | Status aktual | Cakupan |
| --- | --- | --- |
| Validasi source | **SELESAI SECARA STATIS** | `nuxt prepare` dan TypeScript lulus; 766 SFC valid; 143 JSON valid dan bundled. |
| Frontend request boundary | **SELESAI SECARA STATIS** | Direct `$fetch()`/`useFetch()` pada page/component = 0. |
| Feedback dan konfirmasi | **SELESAI SECARA STATIS** | Native `alert()`/`confirm()` pada page/component/composable = 0. |
| Print list/report | **SELESAI SECARA STATIS** | Seluruh list/report memakai shared print; 11 raw print tersisa hanya dokumen/detail khusus yang diaudit. |
| Finance BRVS | **IMPLEMENTED, STATIC VERIFICATION PASSED** | Account, ledger, transfer, cash advance, balance/statement/cash flow/balance sheet, tax, dan integrasi Income/Expense tersedia. |
| Sales, Payment, Orders/Workflow, Webstore | **APPROVED BEHAVIOR BASELINE** | Sales/Payment/Sales-adjacent, tujuh route Webstore/Support Ticket, sembilan route Orders/Job Order, dan enam route master Workflow sudah memiliki evidence arsitektur, API/persistence/data safeguards, desktop, dan 390px 2026-10-10. |
| Peoples, HRM, Content, User Management, Setting, Reports, Calculator, Products & Services | **IMPLEMENTED, VERIFICATION PENDING** | Layer luas tersedia, tetapi decomposition, browser flow, persistence, authorization/integrasi, atau rekonsiliasi belum lengkap. Pengecualian route-scope: `/cetak-full-color` verified 2026-10-11. |
| Dashboard, Promo, Purchases, Paper/Inventory gap | **PARTIAL / BELUM SELESAI BRVS/BRVS-UI** | Dashboard Admin, Analytics Dashboard, Subscriptions, Kalkulator Dashboard, Billing, dan Voucher sudah lulus route-scope BRVS/BRVS-UI; Promo tersisa, Purchases, dan Paper/Inventory masih memiliki workspace monolitik, data lokal, atau audit service/repository yang belum ditutup. |
| Legacy structure validator | **SELESAI** | 8 aset Sticky Kit/Summernote dipulihkan dari salinan internal yang cocok SHA-256 manifest; path validation lulus. |
| Runtime dan deployment | **PARTIAL** | Build dan 51 route Sales/Payment/Sales-adjacent/Webstore/Orders/Workflow/Dashboard Admin/Analytics Dashboard/Subscriptions/Kalkulator Dashboard/Billing/Voucher/Cetak Full Color lulus pada desktop/390px, console, persistence/reload bila relevan, dan safeguard data. Netlify mutation persistence dan 135 route legacy lain belum diverifikasi. |
| Git delivery | **NOT COMMITTED / NOT PUSHED** | Branch `main`; baseline HEAD dan `origin/main` adalah `62bbdb8ca7cf3c25e2e4f4d7255d48bfed2c71ca`; perubahan aktif masih working tree. |

Ringkasnya: hard-fail frontend, type safety, dan P0 aset sudah ditutup; Finance sudah implemented. Seluruh codebase **belum selesai** karena BRVS/BRVS-UI lintas modul, repository backend, Netlify mutation persistence, serta runtime verification masih terbuka.

## Update Implementasi 2026-10-09

Sesudah snapshot awal, pekerjaan P0 dan Finance berikut sudah diterapkan dan diaudit ulang:

- TypeScript turun dari 204 error menjadi **0 error**. `npx nuxt prepare` dan `npx tsc --noEmit --pretty false` selesai dengan exit code 0.
- Seluruh request pada `app/pages` dan `app/components` sudah dipindahkan ke composable domain. Hasil pencarian direct `$fetch()`/`useFetch()` pada dua folder tersebut adalah **0 file**.
- `useApiFetch` dan `apiFetch` menjadi boundary typed bersama untuk mencegah union seluruh Nitro route melampaui instantiation depth TypeScript. Runtime tetap memakai `useFetch`/`$fetch` Nuxt.
- Finance dalam scope P1 sudah memiliki BRVS untuk Bank Account, Account Type, Money Transfer, Cash Advance, Customer Balance Account, Account Statement, Cash Flow, Balance Sheet, Input Tax, dan Output Tax. Income/Expense sekarang menulis ledger bank relasional.
- Seluruh 141 JSON `server/data` valid dan terdaftar pada `bundledData.ts`. Seluruh 755 SFC di `app/pages` dan `app/components` (760 SFC total di `app`) lolos parser Vue.
- Validator struktur membaik dari 61 menjadi **0 failure**. Delapan berkas Sticky Kit/Summernote dipulihkan dari salinan internal `app/assets/plugins` setelah SHA-256 masing-masing terbukti identik dengan manifest; manifest tidak diubah.
- Payment/Payment Inflow/Payment Outflow direkonsiliasi ulang: filter non-legacy dihapus, Balance Summary kembali collapsed, split payment menjadi dinamis/persisten, dan total/status/history diturunkan di server. Suite API dan browser desktop/390px lulus.
- Sales Dashboard/Report/Note/Receipt direkonsiliasi ulang: dashboard monolitik dipecah ke BRVS/BRVS-UI, laporan memakai API filter dan detail legacy, sedangkan note/receipt mengambil transaksi terpilih. Suite API serta browser desktop/390px lulus.
- Webstore direkonsiliasi ulang: lima list read-only memakai filter/stats server dan pola tabel approved; Support Ticket View kembali bernavigasi ke detail terpilih, sedangkan Add/Edit/chat/status/delete tersimpan melalui service/repository. Suite API dan browser desktop/390px lulus.
- Enam route inti Orders direkonsiliasi ulang: counter/totals berasal dari data server, mutation modal persisten, nested Job Branch tervalidasi, page Job Order dipecah, dan suite API/browser desktop/390px lulus. Detail/editor Job Order mandiri masih menjadi scope berikutnya.
- `/job-order-detail` dan `/edit-job-order` direkonsiliasi ulang: record hardcoded dihapus, relasi Order–Job Order diselesaikan server, workflow/assignee/incentive dinamis dipersistensikan, dan kedua page turun menjadi 16/32 baris. API serta browser desktop/390px lulus.
- `/job-progress` direkonsiliasi ulang: array/mutation lokal dihapus, relasi dan spesifikasi menjadi dataset typed/bundled, stats/filter/toggle berada di service, serta table/print memakai komponen bersama. API empty/malformed safeguard dan browser desktop/390px lulus.
- Enam route master Workflow direkonsiliasi ulang: list memakai filter/print bersama; data category/name/template/workflow memakai strict repository; Add/Edit berbagi editor 78 baris dengan Product Picker, Flow Catalog, dan Arrange Panel; submodal master menyimpan melalui API. Suite API serta browser desktop/390px lulus.
- `/analytics-dashboard` direkonsiliasi ulang: page 645 baris menjadi composer 9 baris; KPI/conversion/performance/traffic/Top Pages memakai snapshot typed, strict service, composable, dan responsibility components. Suite data safeguard serta browser desktop/390px lulus.
- Dashboard Admin `/` direkonsiliasi ulang: page 345 baris menjadi composer 9 baris dan seluruh panel legacy—metrics, chart/overview, product lists, Sales Statics, lima tab Recent Transactions, customers/categories/order heatmap—dipulihkan melalui snapshot typed dan sembilan responsibility components. Suite data safeguard serta browser desktop/390px lulus.
- `/subscriptions` direkonsiliasi ulang: page 960 baris menjadi composer 9 baris; empat KPI, filter/kolom/footer total, View/Edit/Delete, dan print dipulihkan tanpa menambah flow non-legacy. Data relasional typed/bundled, filter server, PUT/DELETE persisten, safeguard malformed JSON, dan browser desktop/390px lulus.
- `/kalkulator-dashboard` direkonsiliasi ulang: tabel yang sebelumnya tidak merender karena prop/slot salah kini memuat sepuluh record legacy; metric/chart series typed, PDF/Print/Refresh/Collapse, View/Edit/Delete, strict validation/persistence, malformed JSON, dan browser desktop/390px lulus.
- `/billing` direkonsiliasi ulang: tiga KPI dan sepuluh baris ledger legacy, filter server, nilai uang/total numerik, typed relational bundled data, malformed JSON safeguard, serta browser desktop/390px lulus tanpa menambah action/modal/print yang tidak ada pada referensi.
- `/voucher` direkonsiliasi ulang: page 654 baris menjadi composer 9 baris; empat record dan semua filter/field/toggle legacy memakai typed relational bundled data, composable/API/service, shared Add/Edit form, CRUD/reload strict, print/collapse, serta browser desktop/390px. Opsi Product toolbar dan modal dipisah sesuai referensi.
- `/cetak-full-color` direkonsiliasi ulang: lima kartu, sebelas tab, seluruh option/workflow/profit, dan sepuluh log memakai data literal legacy. Effective targets memakai real multiple-select dan array persisten; API tipis memakai strict domain service, log output-only, GET tanpa write, serta browser desktop/390px lulus.
- Native browser dialog turun dari 28 menjadi **0 file**. Direct `window.print()` turun dari 41 menjadi **11 file** dan seluruh sisanya sudah diaudit sebagai dokumen/detail khusus; halaman list/report memakai `DocumentPrintModal`.

Status aktif bersifat per route: 51 route sudah memiliki static/API/browser evidence, sedangkan route lain tetap **implemented atau partial, verification pending**. Build dan browser lokal sudah dijalankan untuk batch tervalidasi; Netlify runtime dan durable mutation persistence belum diuji.

## 1. Kesimpulan

Codebase belum sepenuhnya mengikuti BRVS dan BRVS-UI. Fondasi type safety dan Finance sudah jauh lebih kuat, seluruh route sidebar mempunyai page, dan banyak page sudah menjadi shell tipis. Gap utama yang tersisa berada pada pemisahan UI di Workspace, pemisahan repository dari API route, halaman legacy yang masih monolitik, dan verifikasi runtime. Direct request UI, dialog browser native, dan direct print pada list/report sudah ditutup.

Status `approved baseline` pada Sales, Payment, Orders/Workflow, Webstore, dan shared Print/PDF tetap berarti perilaku yang pernah disetujui pengguna. Status itu tidak membatalkan regression findings pada audit ini. Setiap file yang disebut di bawah harus kembali melewati gate arsitektur dan validasi sebelum disebut `verified` berdasarkan standar terbaru.

## 2. Bukti Kuantitatif

| Area | Hasil aktual | Penilaian |
| --- | ---: | --- |
| Page Vue | 188 | Seluruh page diaudit secara statis. |
| Page 20 baris atau kurang | 114 | Shell sangat tipis; Billing, Voucher, Dashboard Admin, Sales Dashboard, Analytics Dashboard, dan Subscriptions masing-masing 9 baris. |
| Page 21-150 baris | 55 | Masih dalam batas page; `edit-job-order.vue` 32 baris dan `job-progress.vue` menjadi page composer. |
| Page 151-200 baris | 2 | Perlu decomposition audit. |
| Page 201-300 baris | 10 | Wajib dipecah atau diberi justifikasi. |
| Page di atas 300 baris | 7 | Structural review required. |
| Component Vue | 578 | Decomposition lintas modul lain tetap menjadi backlog. |
| File bernama Workspace/Screen | 100 | Audit ukuran Workspace tetap menjadi backlog lintas modul. |
| Composable | 153 | Seluruh request page/component aktif sudah melalui composable. |
| Nitro API file | 375 | Direct persistence route masih perlu repository audit lanjutan. |
| Server type | 106 | Type domain tersedia luas; typecheck global lulus. |
| Server JSON | 143 | Seluruhnya valid dan seluruh basename tercakup `bundledData.ts`. |
| Sidebar entry | 134 | 133 route unik; seluruh route memiliki page. |
| Page di luar sidebar | 55 | Add/edit/detail/auth/settings tambahan tetap harus masuk audit. |
| TypeScript | 0 error | Static type gate lulus. |
| Structure validator | 0 failure | Seluruh path manifest tersedia; 8 aset yang dipulihkan cocok dengan SHA-256 manifest. |

Catatan data:

- Audit heuristik tidak menemukan nilai uang berformat `Rp` atau separator statis pada field uang di JSON.
- Empat container data masih perlu review identifier: `payment-balances.json`, `preference-settings.json`, dan `footer-config.json` (`infoKami`, `panduan`). `cetak-full-color.json.workflowSteps` kini memiliki ID stabil selain nomor urut tampilan.
- Tidak ditemukan GET endpoint yang menulis data secara langsung.

## 3. Pelanggaran Lintas Codebase

| Temuan | Jumlah | Tindakan wajib |
| --- | ---: | --- |
| UI file memakai `$fetch()`/`useFetch()` langsung | 0 file | Gate ini sudah ditutup; jangan regresi. |
| UI file memakai native `alert()`/`confirm()` | 0 file | Gate ditutup; jangan regresi. |
| UI file memakai `window.print()` | 11 file | Seluruhnya pengecualian dokumen/detail khusus; list/report aktif sudah memakai `DocumentPrintModal`. |
| UI file memakai teks arbitrary di bawah 12px | 111 file | Ganti dengan token tipografi resmi; audit konteks chart/dekorasi secara terpisah. |
| Page dengan class Bootstrap-like | 33 file | Migrasikan UI aktif ke Tailwind dan shared component. |
| API route lebih dari 80 baris | 9 file | Pindahkan parsing, validation, mapping, numbering, dan persistence ke domain service/repository. |
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
| Dashboard | 5 | Route-scope runtimes passed | Dashboard Admin, Analytics Dashboard, Subscriptions, Kalkulator Dashboard, dan Billing memakai typed/bundled data, composable/API/service, responsibility components, serta lulus malformed-data dan browser desktop/390px. | Pertahankan lima baseline Dashboard; lanjutkan Promo sesuai urutan audit. |
| Sales | 7 | Approved behavior; primary slice evidence passed | Add Sales route terpisah/Edit modal memakai form bersama. Lima dokumen transaksi, Sales Dashboard/Report/Note/Receipt memakai domain component/composable, API tipis/service, selected-record data, dan browser desktop/390px. POS tetap deferred. | Pertahankan baseline sambil melanjutkan grup berikutnya. |
| Payment | 2, plus `/payments` | Approved behavior; route-scope runtime passed | Tiga route memakai composable, API tipis, domain service/repository, date-range, selected-record flow, split payment persisten, dan server-derived totals/statuses. Suite API, typecheck, serta browser desktop/390px lulus. | Netlify mutation persistence dan audit integrasi lintas ledger tetap pending. |
| Workflow | 6 | Route-scope runtime passed | Empat list/master route plus Add/Edit memakai composable/API/service, strict JSON, typed editor context, nested template/step validation, persisted submodal masters, dan browser desktop/390px. | Netlify durable mutation persistence tetap pending. |
| Orders | 9 | Route-scope runtime passed | Enam route inti, selected-record `/job-order-detail`/`edit-job-order`, serta relational `/job-progress` memakai composable/API/service; mutations persisten dan desktop/390px lulus. | Deployment persistence tetap pending. |
| Webstore | 6 plus detail | Approved behavior; route-scope runtime passed | Lima list read-only memakai stats/filter API dan shared table/currency/date UI. Support Ticket Add/Edit/detail/chat/status/delete memakai selected record, API tipis, service/repository, validation, persistence/reload, dan 404 guard. Desktop/390px lulus. | Netlify durable mutation persistence tetap pending. |
| Calculator Apps | 10 | Implemented, verification pending | Page sidebar dan typecheck lulus; Workspace kompatibilitas lama sudah memakai confirm/print standar, tetapi runtime belum diuji. | Test manage/detail/delete/print/persistence dan putuskan adapter kompatibilitas Workspace lama. |
| Products & Services | 8 | Mixed; `/cetak-full-color` BRVS verified | Cetak Full Color memiliki page composer, responsibility sections, composable, API tipis, domain service, typed data, dan evidence browser. Route lain masih memiliki gap per-menu. | Pertahankan evidence Cetak Full Color; audit payload/variant ID dan pecah UI responsibility route lain yang masih besar. |
| Paper Shop | 4 | Partial BRVS-UI | Page tipis, typecheck lulus, confirm/print standar sudah dipakai, tetapi Workspace aktif mencapai 325-340 baris. | Pecah Workspace menjadi leaf components dan verifikasi relasi/id service di browser. |
| Inventory | 6 | Partial BRVS | Workspace Category/Subcategory/Unit/Variant memakai print/confirm standar dan typecheck lulus, tetapi responsibility split belum penuh. | Audit dan pecah Workspace master data yang masih besar. |
| Purchases | 5 | Imported, verification pending | Seluruh page sidebar 216-272 baris; static type gate lulus dan native alert sudah ditutup, tetapi `add-purchase.vue` tetap monolitik. | Audit legacy fields, pecah form/detail, validasi runtime server, dan ID generation. |
| Promo | 3 | Partial; Voucher runtime passed | Voucher sudah memakai typed relational bundled data, composable/API/service, shared full Add/Edit form, strict CRUD safeguards, serta browser desktop/390px. Discount Plan, Discount, dan Coupon masih page-heavy. | Lanjutkan BRVS per Discount Plan, Discount, lalu Coupon. |
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

### Urutan baca wajib

1. Baca [`AGENTS.md`](../AGENTS.md) untuk batas repositori, perilaku menu yang sudah disetujui, perlindungan data, larangan Git tanpa instruksi, dan komponen reusable wajib.
2. Baca bagian **Status Kanonik Singkat**, rapor grup menu, dan item terbuka pada dokumen audit ini. Pilih hanya scope yang diminta pengguna atau satu batch yang batasnya jelas.
3. Ikuti [`AI_WORK_QUALITY_FRAMEWORK.md`](AI_WORK_QUALITY_FRAMEWORK.md): Context Check -> Implement -> First Re-check -> Adversarial Re-check -> Evidence -> Progress Sync.
4. Untuk pekerjaan menu, baca [`MENU_IMPLEMENTATION_COMMAND.md`](MENU_IMPLEMENTATION_COMMAND.md), [`BACKEND_READY_VERTICAL_SLICE.md`](BACKEND_READY_VERTICAL_SLICE.md), dan [`UI_DECOMPOSITION_STANDARD.md`](UI_DECOMPOSITION_STANDARD.md). Rantai aktif wajib dibuktikan dari page sampai typed relational data; memindahkan semua kode ke satu Workspace bukan decomposition yang selesai.
5. Baca [`PAGE_CLEANLINESS_AND_STATUS_MATRIX.md`](PAGE_CLEANLINESS_AND_STATUS_MATRIX.md) sebagai inventory route/layer dan alarm kebersihan. Status route historis yang sudah dipensiunkan tidak boleh dipakai untuk menaikkan status menjadi verified.
6. Mulai dari [`obsidian-vault/00-HOME.md`](obsidian-vault/00-HOME.md), lalu baca [`01-SOURCE-OF-TRUTH.md`](obsidian-vault/01-SOURCE-OF-TRUTH.md), [`03-APPLICATION-FLOWS.md`](obsidian-vault/03-APPLICATION-FLOWS.md), [`04-BUSINESS-RULES.md`](obsidian-vault/04-BUSINESS-RULES.md), [`05-DATA-API-NETLIFY.md`](obsidian-vault/05-DATA-API-NETLIFY.md), [`07-CLIENT-REVISIONS.md`](obsidian-vault/07-CLIENT-REVISIONS.md), dan dokumen modul terkait di `docs/obsidian-vault/modules/`.
7. Baca HTML, script, partial, aset, dan JSON route terkait di [`legacy/static-source/`](../legacy/static-source/). Cocokkan juga `https://dulank-admin.netlify.app/<nama-halaman>.html` bila dapat diakses. Petakan input, output, tabel, modal/submodal, aksi, kalkulasi, cetak, dan relasi sebelum implementasi.
8. Untuk perubahan visual, baca [`TYPOGRAPHY_STANDARD.md`](TYPOGRAPHY_STANDARD.md) dan [`ICON_STANDARD.md`](ICON_STANDARD.md). Untuk warning Vue/component resolution, baca [`TROUBLESHOOTING_VUE_WARNINGS.md`](TROUBLESHOOTING_VUE_WARNINGS.md).

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
- [x] Pulihkan 8 file legacy yang masih tercatat di `MIGRATION_MANIFEST.json`, atau koreksi manifest hanya setelah asal kehilangan dan keputusan pemilik jelas. File dipulihkan dari salinan internal yang hash-nya identik; manifest tidak diubah.
- [x] Jangan mengubah status menu menjadi verified selama P0 belum hijau. P0 kini hijau; status aplikasi tetap konservatif karena gate per-route belum selesai.

### P1 - Tutup Hard Fail BRVS

- [x] Implementasikan Finance: Bank Account, Balance Account, Balance Sheet, Account Statement, Cash Flow, Money Transfer, Cash Advance, dan Tax. Status runtime tetap verification pending.
- [ ] Kerjakan tiga route Promo tersisa dan lima route Purchases yang masih page-heavy; Voucher sudah lulus.
- [ ] Pecah 7 page di atas 300 baris dan audit 10 page pada rentang 201-300; `add-sales.vue` sudah turun dari 571 menjadi 12 baris, `sales-dashboard.vue` dari 964 menjadi 9 baris, dan `voucher.vue` dari 654 menjadi 9 baris.
- [x] Pindahkan seluruh 11 direct request UI ke composable domain; hasil audit ulang 0 file.
- [ ] Ekstrak persistence/validation dari 99 API route direct-I/O ke domain service/repository.
- [x] Ganti seluruh native dialog pada UI dengan feedback/confirm standar; hasil audit ulang 0 file.
- [x] Ganti seluruh direct print list/report dengan `DocumentPrintModal`; 11 pemakaian tersisa sudah diaudit sebagai dokumen/detail khusus.

### P2 - Rapikan BRVS-UI dan Standar Visual

- [ ] Audit 100 Workspace/Screen; pecah 54 file di atas 200 baris berdasarkan Header, Stats, Filters, Table, Form, Detail, dan Feedback.
- [ ] Audit 58 component di atas 250 baris; pecah 36 file di atas 300 atau tulis justifikasi satu tanggung jawab.
- [ ] Migrasikan 33 page dengan class Bootstrap-like ke Tailwind/shared component.
- [ ] Hilangkan teks bermakna di bawah 12px pada 111 file; chart label dekoratif harus diberi pengecualian tertulis.
- [ ] Audit manual SVG hanya untuk ikon aksi; chart/diagram domain boleh tetap SVG.
- [ ] Putuskan target route `Customer Subscription` yang saat ini duplikat.

### P3 - Verifikasi Runtime

- [ ] Typecheck dan build sudah lulus. Browser desktop/390px serta console check sudah lulus untuk 51 route Sales/Payment/Sales-adjacent/Webstore/Orders/Workflow/Dashboard Admin/Analytics Dashboard/Subscriptions/Kalkulator Dashboard/Billing/Voucher/Cetak Full Color; 135 route lain masih menunggu verifikasi runtime per menu.
- [ ] Uji Add/Edit/View/Delete, filter, pagination, print/PDF, reload persistence, empty state, dan invalid payload per menu.
- [ ] Uji serverless Netlify read serta strategi persistence mutation production.
- [ ] Cocokkan input/output/modal dengan legacy HTML dan Netlify per route.
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

## 8. Backlog Page Berdasarkan Architecture Gate

### Structural review required, di atas 300 baris

| Page | Baris | Grup/flow |
| --- | ---: | --- |
| `discount.vue` | 605 | Promo |
| `ticket-list.vue` | 563 | Webstore/support related route |
| `discount-plan.vue` | 429 | Promo |
| `pos-order.vue` | 420 | POS deferred related route |
| `online-orders.vue` | 416 | Orders related route |
| `add-purchase.vue` | 363 | Purchases related route |
| `coupon.vue` | 351 | Promo related route |

### Wajib decomposition audit, 201-300 baris

`purchase.vue` (272), `purchase-item.vue` (238), `expenses.vue` (230), `income.vue` (228), `purchase-order-detail.vue` (223), `purchase-category.vue` (220), `purchase-order.vue` (220), `purchase-return.vue` (216), `purchase-return-detail.vue` (216), dan `expense-category.vue` (209).

### Melewati target page, 151-200 baris

`ticket-detail.vue` (192) dan `incentive.vue` (152).

### Workspace/Screen structural review required, di atas 300 baris

`FooterWorkspace.vue` (542), `AllBlogWorkspace.vue` (480), `PermissionMatrixWorkspace.vue` (456), `DownloadFilesWorkspace.vue` (447), `DistrictWorkspace.vue` (400), `BannerWorkspace.vue` (399), `OurClientWorkspace.vue` (366), `RegencyWorkspace.vue` (364), `BlogCommentWorkspace.vue` (348), `KertasGroupSelfWorkspace.vue` (340), `KertasJenisSelfWorkspace.vue` (333), `ProvinceWorkspace.vue` (332), `HargaJasaLainyaWorkspace.vue` (325), `BlogCategoryWorkspace.vue` (306), dan `EmployeesWorkspace.vue` (303).

Daftar ini hanya gate berdasarkan ukuran. File di bawah ambang tetap gagal bila mengandung business logic, persistence, record hardcoded, atau beberapa tanggung jawab UI sekaligus.

## 9. Delivery Record Audit

- Source code/data diubah: ya; termasuk P0 type fixes, Finance, Sales/Payment, Sales Dashboard/Report/Note/Receipt, Webstore/Support Ticket, Orders/Workflow, Dashboard Admin, Analytics Dashboard, Subscriptions, Kalkulator Dashboard, Billing, dan Voucher.
- Dokumentasi diubah: ya.
- Branch: `main`.
- Baseline HEAD sebelum edit: `62bbdb8ca7cf3c25e2e4f4d7255d48bfed2c71ca`.
- Upstream: `origin/main`; working tree saat ini belum tercakup remote.
- Commit status audit ini: `NOT COMMITTED`.
- Push status audit ini: `NOT PUSHED`.
- Validasi dijalankan: full legacy inventory; typecheck; production build; structure validator; Sales, Payment, Sales-adjacent, Webstore, Orders, Workflow, Dashboard Admin, Analytics Dashboard, Subscriptions, Kalkulator Dashboard, Billing, dan Voucher API suites; browser desktop/390px; empty/invalid runtime-data safeguards; `git diff --check` pada batch terdahulu.
- Validasi belum dijalankan: 135 route legacy lain, deployment Netlify, dan durable mutation persistence production.
