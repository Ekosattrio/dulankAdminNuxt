---
title: Peoples Module
tags: [module, peoples]
status: verification-pending
updated: 2026-10-08
---

# Peoples

## Routes

`/customers`, `/customer-type`, `/address`, `/supplier`, `/store-list`.

## Flow dan Logic

- Customer memiliki type, identity/contact, balance, dan address relation.
- Customer Type menjadi master klasifikasi dan tidak boleh diganti label bebas pada tiap customer.
- Address menyimpan owner type/id serta province/regency/district/postal relation.
- Supplier menyimpan identity/contact dan address relation.
- Store List menyimpan branch/store identity, manager/user, contact, dan status.

## Data Rule

Customer, Supplier, Address, dan Store membutuhkan ID stabil. Tampilan nama tidak menggantikan foreign key. Balance disimpan number dan ditampilkan format IDR.

## Compatibility

Komponen baru berada di `app/components/Pages/`; path view modal lama dipulihkan untuk kompatibilitas.

## Verification Gate

Uji add/edit/view/delete/reload, address owner relation, cascading location, duplicate identity/contact, filter tanggal/type/status, dan print.
