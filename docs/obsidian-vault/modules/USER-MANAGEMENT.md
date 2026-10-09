---
title: User Management Module
tags: [module, user-management, permissions]
status: verification-pending
updated: 2026-10-08
---

# User Management

## Routes

`/user`, `/user-admin`, `/role-permissions`, `/role`, `/delete-account`.

## Flow dan Logic

- Members mengelola identitas pelanggan/member.
- User Admin mengelola akun admin/staf, role, store assignment, dan status.
- Roles mengelola master role.
- Role Permissions memetakan page ke role dan action.
- Delete Account menampilkan permintaan penghapusan dan menghapus record terpilih sesuai flow yang tersedia.

GET permissions hanya membentuk response di memory. Persistensi matrix hanya melalui POST. Role baru harus memperoleh default permission deterministik tanpa side effect GET.

## Netlify

`users.json` dan `permissions.json` telah masuk bundled source. Mutation produksi tetap memerlukan storage durable.

## Verification Gate

Uji create/edit/delete/reload, uniqueness email/ID, role deletion yang masih dipakai, permission matrix lintas role, dan authorization aktual sebelum production.
