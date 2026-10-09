---
title: Application Flows
tags: [flow, frontend, api]
updated: 2026-10-08
---

# Application Flows

## List Page

```text
route dibuka
  -> composable melakukan GET
  -> pending menampilkan skeleton
  -> API membaca runtime, source, atau bundled seed
  -> response mengisi tabel dan KPI
  -> search/filter client atau query server mempersempit hasil
  -> print memakai data terfilter
```

GET tidak boleh membuat file, mengisi seed runtime, atau mengubah data.

## Create dan Edit

```text
open editor
  -> create memakai default UI yang netral
  -> edit memuat seluruh record terpilih
  -> validasi frontend
  -> POST/PUT
  -> validasi dan kalkulasi ulang di server
  -> persistensi berhasil
  -> API success
  -> refresh data dan feedback berhasil
```

Input harus tetap terbuka ketika request gagal. Busy state mencegah submit ganda.

## Delete

```text
pilih record -> confirm dialog -> DELETE by id -> persist -> refresh
```

Record yang tidak ditemukan menghasilkan 404. Delete tidak boleh menghapus berdasarkan posisi array.

## Sales dan Payment

Sales, Invoice, Delivery Note, Sales Return, Quotation, RFQ, Payments, Inflow, dan Outflow tetap menjadi referensi alur transaksi. Payment memakai `startDate/endDate`, validasi nominal server, record terpilih, dan persistence yang harus benar-benar berhasil.

## Orders dan Workflow

Order menjadi sumber pekerjaan. Job Order memetakan flow, Job List merinci spesifikasi, Job Branch menetapkan cabang/petugas/insentif, My Job memperbarui progres, dan My Incentive merekap hasil pekerjaan.

## Webstore

Cart, Checkout, Wishlist, Reviews, Support Ticket, dan Contact Form membaca data API. Support Ticket memiliki mutasi dan percakapan; halaman tabel lain mengikuti aksi yang memang tersedia di referensi.

## Print

Tabel memakai `DocumentPrintModal`. Dokumen transaksi khusus mempertahankan template masing-masing. Raw `window.print()` hanya untuk halaman dokumen khusus yang telah dikecualikan.
