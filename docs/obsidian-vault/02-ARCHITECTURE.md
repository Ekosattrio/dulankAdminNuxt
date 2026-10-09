---
title: Architecture
tags: [nuxt, backend-ready, layers]
updated: 2026-10-09
---

# Architecture

Nama resmi struktur menu adalah **Backend-Ready Vertical Slice (BRVS)**. Kontrak ketat, architecture gate, dan audit aktual berada di [Backend-Ready Vertical Slice](../BACKEND_READY_VERTICAL_SLICE.md).

Untuk aturan praktis agar file `app/pages/*.vue` benar-benar hanya menjadi composition layer, baca [[11-PAGE-CLEANLINESS-BRVS]].
Untuk pemecahan UI sampai level Workspace dan child component, baca [BRVS UI Decomposition Standard](../UI_DECOMPOSITION_STANDARD.md).

## Stack

- Nuxt 4, Vue 3, TypeScript, Tailwind CSS 4.
- Frontend aktif di `app/`.
- Nitro API, types, domain helpers, dan source JSON di `server/`.
- Runtime JSON lokal di `data/`.
- Referensi permanen di `legacy/static-source/`.

## Dependency Flow

```text
Page
  -> domain component
  -> composable
  -> Nitro API
  -> domain validation/repository helper
  -> runtime data or database adapter
```

Page mengoordinasikan route dan dialog. Komponen menangani presentasi serta input. Composable menangani request dan state. API menjaga kontrak HTTP. Utility server menjaga validasi, kalkulasi, penomoran, dan persistensi.

Pola route composer dan responsibility-based components pada branch `Rama` commit `76f6e79` menjadi referensi decomposition UI. Direct fetch dari page/component, legacy runtime sebagai business logic, serta generic JSON writer dari referensi tersebut tidak menjadi acuan backend Dulank Admin.

Keberadaan file saja tidak cukup: route aktif harus memakai rantai tersebut. Page tidak boleh memanggil request domain langsung, menyimpan record hardcoded, memuat form/table/modal besar, atau memakai `alert()`/`confirm()` sebagai flow sukses. API harus tipis dan meneruskan domain logic ke server service/repository.

## Page Budget

- Target: maksimal 150 baris.
- Di atas 200 baris: decomposition audit atau justifikasi wajib.
- Di atas 300 baris: `structural review required`.
- Pelanggaran tanggung jawab layer tetap hard fail berapa pun jumlah barisnya.

## UI Decomposition Budget

- Workspace/Screen hanya orchestrator, target maksimal 150 baris.
- Workspace di atas 200 baris wajib decomposition audit.
- Workspace atau leaf component di atas 300 baris memerlukan structural review atau justifikasi satu tanggung jawab.
- Page pendek dengan satu Workspace monolitik belum lulus BRVS-UI.
- Evidence harus memetakan Header/Actions, Stats, Filters, Table/Grid/List, Form/Editor, Detail/History/Modal, dan Feedback.

## Response Contract

```ts
{
  success: boolean
  data: T
  message?: string
  meta?: Record<string, unknown>
}
```

Error harus memakai status HTTP yang sesuai dan tidak boleh menghasilkan feedback sukses jika persistensi gagal.

## Shared UI

- `SalesDataTable`: tabel, pencarian, sorting, pagination, scroll.
- `SalesDialog`: shell modal responsif dan busy guard.
- `SalesFeedback`: loading/skeleton/error/retry.
- `DateRangePicker` dan `TableFilterSelect`: filter toolbar `h-9`, font 14px.
- `CurrencyInput`/`CurrencyDisplay`: angka murni dengan format Rupiah bertitik.
- `DocumentPrintModal` dan `documentPrinter`: print/PDF terisolasi.

Detail lengkap tetap di [STRUCTURE.md](../STRUCTURE.md).
