---
title: Business Rules
tags: [business-logic, validation]
updated: 2026-10-08
---

# Business Rules

## Data dan Identitas

- Semua entity memiliki primary key stabil.
- Relasi memakai foreign key/domain identifier, bukan hanya label tampilan.
- Nomor dokumen tidak boleh memakai `array.length + 1` tanpa pemeriksaan nomor terbesar atau generator unik.
- Detail historis yang tidak diketahui tetap kosong; jangan dibuat seolah fakta.
- Array runtime kosong adalah data valid.
- Field output turunan tidak otomatis menjadi input form. Saldo, total, due, progress, log transaksi, dan metrik dihitung dari transaksi/relasi server atau ditampilkan read-only sesuai legacy.
- Product memakai foreign key `categoryId`, `subCategoryId`, `unitId`, dan `storeId`; label hasil join hanya untuk output. Item Code aktif harus unik.

## Uang

- Penyimpanan memakai `number` murni.
- Display IDR memakai titik: `Rp 1.000.000`.
- Server menghitung ulang subtotal, diskon, pajak, ongkir, paid, due, refund, dan total.
- Nilai negatif, NaN, pembayaran melebihi tagihan, atau refund yang tidak cocok harus ditolak.

## Finance dan Pajak

- Current balance rekening dihitung dari opening balance dan ledger, bukan input manual setelah account dibuat.
- Transfer antar rekening selalu membentuk debit dan credit berpasangan dengan `transferId` yang sama.
- Income membutuhkan rekening tujuan. Expense yang memiliki nilai paid membutuhkan rekening sumber dan tidak boleh menulis due/total hasil hitung dari UI sebagai kebenaran server.
- Cash Advance berelasi ke `employeeId` dan rekening kas. Outstanding, status, dan sisa tenor dihitung dari advance dan payment history.
- Input Tax memilih Purchase; Output Tax memilih Sales. DPP, VAT, supplier/customer, dan nomor transaksi adalah output sumber, sedangkan metadata faktur pajak adalah input pengguna.
- Balance Sheet tidak boleh mengarang valuasi inventory/fixed asset. Nilai yang belum memiliki sumber ledger dinyatakan nol dengan data-quality note.

## Dokumen Transaksi

- Edit mempertahankan nomor dan identitas dokumen.
- Create menghasilkan ID/nomor baru tanpa menimpa sumber.
- Detail dan print selalu memakai record terpilih.
- Payment/refund hanya mengubah transaksi setelah persistensi sukses.

## Akses dan Permissions

- GET permissions hanya membaca dan melengkapi response di memory.
- Perubahan matrix dilakukan melalui mutation endpoint.
- Role dan page harus divalidasi terhadap daftar domain yang dikenal.

## UI

- Tabel dan filter menggunakan font 14px agar setara dengan sidebar utama.
- Kontrol toolbar tetap `h-9`.
- Modal form memakai grid 12 kolom label 5/input 7 bila bentuk referensi mendukung.
- Tabel lebar scroll di container, bukan melebarkan viewport.
- Ikon aksi mengikuti `app/utils/actionIcons.ts`: Add `plus-circle`, View `eye`, Edit `edit`, Delete/Remove `trash-2`, dan More `more-horizontal`.
- Kode baru memakai aksi semantik pada `SalesActionButton`; ikon saja wajib memiliki label aksesibel. Detail aturan ada di [Standar Ikon](../ICON_STANDARD.md).

## Kualitas Implementasi AI

- Setiap perubahan melalui Check, Implement, First Re-check, Adversarial Re-check, Evidence, dan Progress Sync.
- Setiap menu mengikuti [Backend-Ready Vertical Slice](../BACKEND_READY_VERTICAL_SLICE.md); page hanya composition, composable menjadi pintu frontend, API tipis, dan domain service/repository memegang validasi serta persistence.
- `useApiFetch`/`apiFetch` hanya boundary type untuk menghindari instantiation-depth Nitro; komponen dan page tetap dilarang memanggilnya langsung. Hanya composable domain yang boleh menjadi pintu request UI.
- Klaim progres harus dapat ditunjuk ke kode, flow, data, atau output validasi aktual.
- `implemented, verification pending` tidak boleh ditulis sebagai `verified`; `approved baseline` memerlukan persetujuan pengguna.
- Framework kanonik berada di [Framework Kerja dan Re-check AI](../AI_WORK_QUALITY_FRAMEWORK.md).
