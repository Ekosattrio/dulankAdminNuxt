---
title: Module Status Model
tags: [status, progress]
updated: 2026-10-09
---

# Module Status

Status aktual dan kanonik berada di [AI_HANDOVER_GUIDE.md](../../AI_HANDOVER_GUIDE.md). Catatan ini mendefinisikan arti status agar klaim konsisten.

Quality gate dan evidence minimum untuk perubahan status berada di [Framework Kerja dan Re-check AI](../AI_WORK_QUALITY_FRAMEWORK.md). `Approved Baseline` hanya ditetapkan setelah persetujuan pengguna.

Status fitur di halaman ini tidak otomatis membuktikan kepatuhan struktur. Status BRVS dinilai terpisah menggunakan [Backend-Ready Vertical Slice](../BACKEND_READY_VERTICAL_SLICE.md) dan Architecture Evidence Matrix per menu.

Audit source terbaru dan master TODO lintas seluruh 188 page berada di [CODEBASE_COMPLIANCE_AUDIT_2026-10-09.md](../CODEBASE_COMPLIANCE_AUDIT_2026-10-09.md). TypeScript, direct-request UI, native browser dialog, dan direct print list/report sudah ditutup; status tetap dibatasi oleh 8 aset legacy yang belum memiliki sumber hash cocok, BRVS/BRVS-UI tersisa, serta browser dan persistence verification.

Tidak ada modul yang boleh dinaikkan menjadi `verified` hanya berdasarkan label lama di route matrix. Ringkasan status aktif ada pada bagian **Status Kanonik Singkat** di audit tersebut.

## Approved Behavior Baseline

Status ini berarti flow/perilaku pernah disetujui pengguna sebagai batas regresi. Status ini bukan klaim bahwa audit BRVS terbaru, browser flow, atau persistence runtime sudah lulus.

- Sales group.
- Payment group.
- Orders/Workflow group.
- Webstore group.
- Print/PDF shared flow.

## Implemented, Verification Pending

- Peoples.
- HRM.
- User Management.
- Content.
- Setting.
- Reports.
- Calculator Apps.
- Products & Services.
- Finance & Account: Bank Account/Type, Money Transfer, Cash Advance, Income/Expense ledger, Customer Balance, Account Statement, Cash Flow, Balance Sheet, Input Tax, dan Output Tax.

Kode dan data kelompok tersebut sudah luas, tetapi status belum menjadi approved baseline sampai validasi struktur, browser flow, Netlify read, mutation persistence target, rekonsiliasi Finance, dan referensi klien selesai diperiksa.

## Imported Outside Original Scope

- Purchases.

Implementasi Purchases dipertahankan sebagai pekerjaan masuk, tetapi perlu audit validasi server, ID generation, dummy/default domain, visual legacy, dan flow reload sebelum disetujui.

## Deferred

- POS tetap ditunda sebagai pekerjaan fitur. Perubahan shared loading yang sudah masuk tidak mengubah status tersebut.
- Inventory/Product yang belum tercakup Products & Services, Finance tersisa, dan Promo tersisa mengikuti matrix kanonik.
