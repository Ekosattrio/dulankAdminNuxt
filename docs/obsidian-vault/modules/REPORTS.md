---
title: Reports Module
tags: [module, reports, analytics]
status: verification-pending
updated: 2026-10-08
---

# Reports

## Routes

Sales, Best Seller, Purchase, Invoice, Supplier, Supplier Due, Customer, Customer Due, Product, Expense, Income, Tax, Profit and Loss, dan Annual Reports.

## Flow dan Logic

- API GET membaca dataset laporan dan menerapkan filter domain/tanggal yang tersedia.
- Composable mengambil snapshot data; pencarian tabel dilakukan in-memory agar tidak memicu request per ketikan.
- KPI harus diturunkan dari data terfilter atau definisi periode yang dinyatakan, bukan angka terpisah yang mudah berbeda.
- Breakdown modal harus berasal dari record/group yang dipilih.
- CSV/Print/PDF harus memakai cakupan filter yang sama dengan UI.
- Profit and Loss menjaga urutan Revenue -> COGS -> Gross Profit -> Operating Expenses -> EBT -> Net Profit.
- Tax menghitung output, input, compensation, dan net payable/overpayment dari angka murni.

## Batas

Dataset saat ini mock JSON. Ini backend-shaped, tetapi bukan bukti integrasi ledger/database produksi atau akurasi akuntansi final.

## Verification Gate

Rekonsiliasi KPI dengan tabel, filter periode, total/footer, CSV, print, empty state, dan kalkulasi akuntansi harus diuji.
