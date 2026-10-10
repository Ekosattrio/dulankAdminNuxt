---
title: HRM Module
tags: [module, hrm]
status: verification-pending
updated: 2026-10-08
---

# HRM

## Routes

`/employees`, `/department`, `/employee-salary`, `/payslip`.

## Flow dan Logic

- Employee menyimpan profil, department, kontak, join data, status, avatar, dan photo ID.
- Department menyimpan nama, member assignment, dan status.
- Employee Salary menyimpan salary rate, overtime rate, allowance, dan status payroll.
- Payslip menghitung salary, allowance, overtime, deduction, dan net pay sebagai angka murni.
- View/Edit harus memakai employee atau payslip terpilih.
- Print payslip memakai template detail khusus yang ditetapkan.

## Compatibility

Komponen baru berada di `app/components/Pages/`. Path komponen lama dipertahankan agar migration manifest dan pemanggil lama tidak rusak.

## Verification Gate

Uji employee relationship, upload persistence, department member consistency, perhitungan payroll, periode payslip, delete protection, reload, dan print.
