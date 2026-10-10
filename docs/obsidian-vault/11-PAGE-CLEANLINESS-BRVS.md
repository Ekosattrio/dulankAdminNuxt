---
title: BRVS Page Cleanliness
tags: [architecture, brvs, pages, refactor, audit]
updated: 2026-10-09
---

# BRVS Page Cleanliness

Catatan ini menegaskan arti **page bersih** pada Dulank Admin. Acuan lengkap dan kanonik tetap [Backend-Ready Vertical Slice](../BACKEND_READY_VERTICAL_SLICE.md).
Page bersih wajib diperiksa bersama [BRVS UI Decomposition Standard](../UI_DECOMPOSITION_STANDARD.md). Page tipis tidak lulus bila seluruh monolit hanya dipindahkan ke satu Workspace.

## Kondisi Saat Ini

**Belum seluruh `app/pages/` bersih seperti Sales.** Keberadaan composable, API, type, atau JSON tidak otomatis membuat route benar bila page masih memegang UI besar, data domain, kalkulasi, export, atau mutation flow.

Audit statis 2026-10-08 terhadap 188 page menemukan:

- 129 page di atas 150 baris;
- 109 page di atas 200 baris;
- 65 page di atas 300 baris;
- 29 page di atas 400 baris;
- 59 page masih mengandung `alert()` atau `confirm()`.

Jumlah baris adalah alarm audit, bukan satu-satunya penentu. Page pendek tetap gagal bila menyimpan data domain hardcoded atau melewati composable/API.

## Definisi Page Bersih

File `app/pages/<route>.vue` hanya boleh berisi:

1. `definePageMeta()`, `useHead()`, atau `useLegacyPage()`.
2. Import type, domain component, shared component, dan composable.
3. Pemanggilan domain composable/editor composable.
4. State koordinasi ringan: selected ID/record, modal open, active tab, atau route query.
5. Handler tipis yang meneruskan event ke composable.
6. Template pendek yang menyusun komponen dan menghubungkan props/emits.

Contoh bentuk yang diharapkan:

```vue
<script setup lang="ts">
import MenuRecordsTable from '~/components/Pages/menu/MenuRecordsTable.vue'
import MenuEditor from '~/components/Pages/menu/MenuEditor.vue'
import { useMenuPage } from '~/composables/useMenuPage'

useLegacyPage({ title: 'Menu', sweetAlert: false })

const selected = ref<string | null>(null)
const { items, pending, error, refresh, openAdd, openEdit, save, remove } = useMenuPage()
</script>

<template>
  <div class="dulank-page dulank-page-menu">
    <MenuRecordsTable :items="items" @edit="openEdit" @delete="remove" />
    <MenuEditor @submit="save" />
  </div>
</template>
```

## Yang Dilarang di Page

- Array record/domain dummy atau default transaksi faktual.
- Interface/type domain lokal.
- `$fetch()` atau `useFetch()` data domain langsung.
- Kalkulasi bisnis, validasi, normalisasi, dan ID generation.
- Markup tabel, card collection, editor, form, modal, detail, history, atau skeleton yang panjang.
- Serializer CSV/Excel/PDF lokal bila bisa menjadi utility/composable reusable.
- Upload/persistence logic langsung.
- `alert()`, `confirm()`, timeout, atau perubahan state lokal sebagai feedback berhasil.
- Form Add dan Edit yang ditulis terpisah.
- Reimplementasi date range, table, filter, dialog, currency, action icon, print, atau confirmation yang sudah shared.

## Ke Mana Kode Dipindahkan

| Tanggung jawab | Lokasi |
| --- | --- |
| Table, card list, stats, filters UI | `app/components/Pages/<menu>/` |
| Form/editor Add dan Edit | Satu komponen `app/components/Pages/<menu>/<Menu>Form.vue` atau `DocumentForm.vue` |
| Modal detail/history/domain | `app/components/Pages/<menu>/` |
| Fetch, mutation, busy/error/refresh | `app/composables/use<Menu>.ts` |
| Editor state dan preview calculation | `app/composables/use<Menu>Editor.ts` |
| Shared UI lintas menu | `app/components/Common/` atau `app/components/Sales/` |
| Shared frontend helper | `app/utils/` |
| Contract entity/command/query | `server/types/<menu>.ts` |
| HTTP parsing/response | `server/api/<menu>/` |
| Validation, calculation, relation, persistence | `server/utils/<menu>.ts` atau repository setara |
| Source data relasional | `server/data/<menu>.json` dan `bundledData.ts` |

## Page Budget

- `<= 150` baris: target normal, tetap harus lulus responsibility check.
- `151-200` baris: review ringan.
- `> 200` baris: wajib decomposition audit atau justifikasi arsitektural.
- `> 300` baris: otomatis `structural review required`.

Justifikasi hanya valid untuk composition yang memang banyak. Banyak markup atau business logic bukan justifikasi.

Budget lanjutan setelah page:

- Workspace/Screen orchestrator target maksimal 150 baris;
- Workspace di atas 200 baris wajib decomposition audit;
- Workspace atau leaf component di atas 300 baris wajib structural review atau justifikasi satu tanggung jawab;
- audit wajib membuka child components, bukan berhenti pada line count page.

## Audit Page yang Sedang Diperiksa

| Page | Temuan | Status BRVS |
| --- | --- | --- |
| `sales.vue` | 139 baris; menyusun komponen domain dan memakai `useSalesPage()`. | Acuan page bersih. |
| `download-files.vue` | 455 baris; enam domain component dan composable sudah ada, tetapi filter, toast, mutation orchestration, toolbar, skeleton, serta markup tetap banyak di page. | Partial BRVS, belum bersih. |
| `all-blog.vue` | 487 baris; composable/API/data tersedia, tetapi filter, card grid, export CSV, empty/error state, dan action UI masih di page. | Partial BRVS, belum bersih. |
| `expense-report.vue` | 319 baris; composable/API/type/data tersedia, tetapi tidak memiliki komponen domain dan export/table orchestration masih di page. | Partial BRVS, belum bersih. |
| `edit-payroll.vue` | 460 baris; form, data contoh, dan kalkulasi lokal; save memakai `alert()` tanpa persistence. | BRVS non-compliant. |
| `edit-job-order.vue` | 288 baris; record/workflow hardcoded, mutation lokal, `confirm()`/`alert()`, dan melewati `useJobOrders()`/API existing. | BRVS non-compliant. |

## Gate untuk AI

Sebelum menyebut page bersih, AI wajib menjawab dengan bukti:

- Apakah page hanya composition dan state koordinasi ringan?
- Apakah domain UI sudah berada di `components/Pages/<menu>/`?
- Apakah Header/Actions, Stats, Filters, Table/Grid/List, Form/Editor, Detail/History/Modal, dan Feedback sudah dipisah menurut tanggung jawab?
- Apakah Workspace/Screen hanya orchestrator, bukan salinan page monolitik?
- Apakah seluruh request/mutation melewati domain composable?
- Apakah Add/Edit memakai form dan editor composable yang sama?
- Apakah API hanya adapter HTTP tipis?
- Apakah server service/repository memegang business rules dan persistence?
- Apakah tidak ada hardcoded record, `alert()`, `confirm()`, atau sukses palsu?
- Apakah Architecture Evidence Matrix BRVS lengkap?

Jika satu jawaban masih “tidak”, statusnya bukan page bersih dan bukan BRVS verified.

## Strategi Perbaikan

Perbaiki per menu, bukan refactor seluruh repository sekaligus:

1. Bekukan expected behavior dari legacy/Netlify.
2. Tandai logic/UI/data yang salah tempat.
3. Sambungkan layer existing yang saat ini dilewati.
4. Pecah UI besar menjadi responsibility components; jangan memindahkannya utuh ke satu Workspace.
5. Pindahkan request/mutation/editor state ke composable.
6. Tipiskan API dan pindahkan domain logic ke server helper/repository.
7. Uji Add/Edit/View/Delete/filter/print/reload sesuai scope.
8. Perbarui status BRVS berdasarkan evidence, bukan jumlah file.
9. Catat commit status dan push status di changelog; default perubahan working tree adalah `NOT COMMITTED` / `NOT PUSHED`.

