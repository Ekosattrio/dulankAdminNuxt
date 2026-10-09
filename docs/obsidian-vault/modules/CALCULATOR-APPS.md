---
title: Calculator Apps
tags: [module, calculator, marketplace]
updated: 2026-10-08
---

# Calculator Apps

## Route

- Partner: `/semua-percetakan`, `/semua-toko-kertas`.
- Listing mesin: `/mesin-cetak`, `/mesin-laminasi`, `/mesin-pond`, `/mesin-poli`.
- Listing kertas: `/kertas-group`, `/kertas-ukuran`, `/kertas-jenis`, `/kertas-harga`.

## Flow dan Data

- Page tipis memakai `CalculatorPartnersPage.vue` atau `CalculatorListingsPage.vue`.
- Data dipisah menjadi partner, partner metrics, listing, dan moderation history.
- Listing berelasi lewat `sourcePartnerId`; metrics lewat `partnerId`.
- Detail, filter, moderasi, soft-delete, dan Print/PDF memakai komponen bersama.

## Status

**Implemented, verification pending.** Build/typecheck penuh, browser desktop/mobile, persistensi reload, moderasi, detail, delete, dan Print/PDF masih perlu verifikasi.
