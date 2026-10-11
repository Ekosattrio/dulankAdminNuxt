---
title: Products and Services
tags: [module, products, services, printing]
updated: 2026-10-11
---

# Products & Services

## Halaman

- Create/Edit Product: `/create-product` dengan query `id` untuk edit.
- Custom Category: `/cetak-full-color`, `/calender`.
- Services Category: `/mesin-cetak-self`, `/mesin-laminasi-self`, `/mesin-pond-self`, `/mesin-poli-self`.
- Product List: `/product-list`; detail record: `/product-details?id=<id>`.

## Product Flow

1. Product List membaca `/api/products` melalui `useProducts()`.
2. Add/Edit memakai form legacy yang sama dan mengirim `ProductFormData` ke API.
3. Server memvalidasi relasi Category, Sub Category, Unit, Store, angka non-negatif, serta Item Code unik.
4. Response Product mengandung foreign key dan label hasil join untuk tampilan.
5. Delete mengarsipkan record. Import CSV/JSON memvalidasi seluruh baris sebelum menyimpan.

Relasi utama: `categoryId`, `subCategoryId`, `unitId`, `storeId`. Harga, quantity, minimum, diskon, dan nilai cetak disimpan sebagai angka murni.

## Custom Category

- Cetak Full Color dan Calender merefleksikan 11 tab domain secara presisi sesuai referensi `calender.html` dan `cetak-full-color.html`:
  - Panel kiri "Setting And Optional" (Pill 11) menampilkan 11 tab konfigurasi.
  - Tab 1: Product Custom Cards Grid (`CustomProductCardsGrid.vue`) dengan slider gambar prev/next, rincian spesifikasi, switch POS & Website, serta modal Add/Edit (`CustomProductModal.vue`) berformat full fidelity (`modaladdukuran`).
  - Tab 2 (Calender): Number of Sheet Option (`SheetOptionsSection.vue`) dengan tabel status Show/Hide dan radio switch "Custom for Number of Sheet? [No] [Yes]".
  - Tab 3 (Cetak) / Tab 4 (Calender): Paper Type Option (`PaperGramatureSection.vue`) dengan tabel multi-checkbox gramatur (100gr, 120gr, 150gr, Select All) dan Work Flow Setting (`WorkflowSettingSubTable.vue`).
  - Tab lainnya: Machine Type, Print Type, Laminate, Fold / Hanger, Components, Workflow Steps memakai `GenericSettingTable.vue`.
  - Tab 10: Profit Setting (`ProfitSettingSection.vue`) dengan pengaturan margin POS % dan Website %.
  - Tab 11: Log Transaction (`CalculationLogTable.vue`) dengan Calculation Detail modal (`CalculationDetailModal.vue`) memuat Order Specification, System Suggestion, dan breakdown Detail Cost produksi.
- Seluruh mutasi konfigurasi tervalidasi via API `/api/calendar-settings` dan `/api/cetak-full-color`.
- Rekonsiliasi khusus `/cetak-full-color` 2026-10-11 mengganti fixture generik dengan data literal legacy untuk seluruh sebelas tab. Semua Effective Target memakai array dan multiple-select nyata; Paper Group terbukti menyimpan lebih dari satu opsi dan mempertahankannya setelah reload.
- Konfigurasi Cetak Full Color memakai typed schema v2, API adapter tipis, dan domain service strict. Seed deploy berada di `server/data/`; runtime lama dinormalisasi tanpa write pada GET dan Log Transaction tidak dapat ditimpa melalui POST konfigurasi.

## Services Flow

- Empat route memakai `WorkshopServicePage.vue`, `WorkshopServiceModal.vue`, dan `useWorkshopServices.ts`.
- Modal Printing bercabang untuk Offset, Digital Print, dan Large Format.
- Modal Laminate, Die Cutting, dan Hot Print mempertahankan ukuran, harga satuan/minimum, serta variasi teknik legacy.
- Detail, Edit, soft-delete, filter status, feedback API, dan `DocumentPrintModal` memakai record server terpilih.
- Dataset `workshop-services.json` memiliki `storeId`, kategori domain, angka murni, status, timestamp, dan `archivedAt`.

## Status

**Mixed per route.** `/cetak-full-color` berstatus **verified** berdasarkan typecheck, build, API/persistence/safeguard, browser desktop/390px, dan zero runtime exception. Rute Products & Services lain tetap **implemented, verification pending** sampai evidence masing-masing lengkap. Netlify durable mutation persistence belum diverifikasi.
