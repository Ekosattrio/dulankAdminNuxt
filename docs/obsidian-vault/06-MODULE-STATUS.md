---
title: Module Status Model
tags: [status, progress]
updated: 2026-10-11
---

# Module Status

Status aktual dan kanonik berada di [AI_HANDOVER_GUIDE.md](../../AI_HANDOVER_GUIDE.md). Catatan ini mendefinisikan arti status agar klaim konsisten.

Quality gate dan evidence minimum untuk perubahan status berada di [Framework Kerja dan Re-check AI](../AI_WORK_QUALITY_FRAMEWORK.md). `Approved Baseline` hanya ditetapkan setelah persetujuan pengguna.

Status fitur di halaman ini tidak otomatis membuktikan kepatuhan struktur. Status BRVS dinilai terpisah menggunakan [Backend-Ready Vertical Slice](../BACKEND_READY_VERTICAL_SLICE.md) dan Architecture Evidence Matrix per menu.

Audit source terbaru dan master TODO lintas seluruh 188 page berada di [CODEBASE_COMPLIANCE_AUDIT_2026-10-09.md](../CODEBASE_COMPLIANCE_AUDIT_2026-10-09.md); inventaris parity 186 HTML berada di [LEGACY_PARITY_AUDIT_2026-10-10.md](../LEGACY_PARITY_AUDIT_2026-10-10.md). TypeScript, direct-request UI, native browser dialog, direct print list/report, dan structure validator sudah hijau. Sebanyak 51 route legacy pada Sales/dokumen, Payment, Sales-adjacent, Webstore/Support Ticket, sembilan route Orders/Job Order, enam route master Workflow, Dashboard Admin, Analytics Dashboard, Subscriptions, Kalkulator Dashboard, Billing, Voucher, dan Cetak Full Color telah melewati source, API/persistence/data safeguards, serta browser desktop/390px sampai 2026-10-11. Status seluruh aplikasi tetap dibatasi oleh BRVS/BRVS-UI tersisa dan verifikasi 135 route legacy lain.

Tidak ada modul yang boleh dinaikkan menjadi `verified` hanya berdasarkan label lama di route matrix. Ringkasan status aktif ada pada bagian **Status Kanonik Singkat** di audit tersebut.

## Approved Behavior Baseline

Status ini berarti flow/perilaku pernah disetujui pengguna sebagai batas regresi. Status ini bukan klaim bahwa audit BRVS terbaru, browser flow, atau persistence runtime sudah lulus.

- Sales group. Add Sales route terpisah dan Edit modal berbagi form BRVS; Invoice, Delivery Note, Sales Return, Quotation, dan RFQ memakai selected-record details serta domain service. Evidence route-scope 2026-10-10 lulus.
- Payment group. Payments/Inflow/Outflow memakai composable, API tipis, domain service, split payment persisten, status turunan server, dan evidence browser desktop/390px 2026-10-10.
- Sales-adjacent group. Sales Dashboard/Report/Note/Receipt memakai route tipis, domain component/composable, API/service, selected-record documents, dan evidence desktop/390px 2026-10-10.
- Orders/Workflow group. Sembilan route Orders/Job Order plus enam route master Workflow memakai selected relational context, service/repository dengan derived stats, mutation persisten, shared Add/Edit editor, dan evidence desktop/390px.
- Dashboard Admin dan Analytics Dashboard memakai snapshot typed/bundled, API/service strict, composable tunggal per route, serta responsibility components terpisah dan sudah lulus desktop/390px.
- Subscriptions memakai aggregate snapshot legacy serta record relasional typed/bundled, filter server, update/delete persisten, komponen responsibility terpisah, dan sudah lulus desktop/390px.
- Kalkulator Dashboard memakai sepuluh record dan seri chart legacy typed/bundled; tabel, View/Edit/Delete, collapse, print, persistence, strict malformed-data guard, dan desktop/390px sudah lulus.
- Billing memakai tiga KPI dan sepuluh record legacy typed/bundled, relasi transaksi/pengguna, uang numerik, filter server, footer totals, strict malformed-data guard, serta browser desktop/390px; tidak ada action/modal/print karena HTML legacy tidak memilikinya.
- Voucher memakai empat record legacy typed/bundled, relasi store/product/creator, diskon numerik, filter server lengkap, pilihan Product list/modal yang sesuai konteks legacy, shared Add/Edit form penuh, CRUD/reload, print/collapse, strict malformed-data guard, serta browser desktop/390px.
- Cetak Full Color memakai data literal sebelas tab, typed schema v2, Effective Target multiple-select persisten, API/domain service strict, log output-only, dan browser desktop/390px. Statusnya verified pada route-scope, bukan approved baseline.
- Webstore group. Cart, Checkout, Wishlist, Reviews, Contact Form, Support Ticket list/detail memakai server filters/stats, selected-record lifecycle, persistence/reload, dan evidence desktop/390px 2026-10-10.
- Print/PDF shared flow.

## Implemented, Verification Pending

- Peoples.
- HRM.
- User Management.
- Content.
- Setting.
- Reports.
- Calculator Apps.
- Products & Services selain `/cetak-full-color` yang telah verified secara route-scope.
- Finance & Account: Bank Account/Type, Money Transfer, Cash Advance, Income/Expense ledger, Customer Balance, Account Statement, Cash Flow, Balance Sheet, Input Tax, dan Output Tax.

Kode dan data kelompok tersebut sudah luas, tetapi status belum menjadi approved baseline sampai validasi struktur, browser flow, Netlify read, mutation persistence target, rekonsiliasi Finance, dan referensi klien selesai diperiksa.

## Imported Outside Original Scope

- Purchases.

Implementasi Purchases dipertahankan sebagai pekerjaan masuk, tetapi perlu audit validasi server, ID generation, dummy/default domain, visual legacy, dan flow reload sebelum disetujui.

## Deferred

- POS tetap ditunda sebagai pekerjaan fitur. Perubahan shared loading yang sudah masuk tidak mengubah status tersebut.
- Inventory/Product yang belum tercakup Products & Services, Finance tersisa, serta Promo Discount Plan/Discount/Coupon mengikuti matrix kanonik.
