---
title: Source of Truth
tags: [governance, documentation]
updated: 2026-10-08
---

# Source of Truth

## Urutan Prioritas

1. Arahan pengguna terbaru.
2. `AGENTS.md` untuk batas regresi, data safety, UI, validasi, dan Git.
3. Source code serta data aktual.
4. `docs/BACKEND_READY_VERTICAL_SLICE.md` untuk architecture gate dan kontrak layer menu.
5. `AI_HANDOVER_GUIDE.md` root untuk status modul.
6. `docs/STRUCTURE.md` untuk arsitektur dan riwayat.
7. `docs/MENU_IMPLEMENTATION_COMMAND.md` untuk eksekusi perintah menu.
8. Vault ini untuk navigasi, flow, keputusan, dan konteks lintas dokumen.

## Aturan Anti-Mismatch

- `docs/AI_HANDOVER_GUIDE.md` hanya compatibility pointer. Matrix status tidak boleh digandakan di sana.
- Status `approved` hanya diberikan pengguna atau dibuktikan oleh flow dan validasi yang dilaporkan.
- Status `implemented, verification pending` berarti kode sudah ada tetapi belum boleh menjadi batas regresi baru.
- Status fitur dan status struktur BRVS adalah dua dimensi berbeda. `implemented` tidak membuktikan page/component/composable/API/service/data sudah terhubung dengan benar.
- Placeholder dan simulasi tidak boleh disebut production-ready.
- Perubahan reusable wajib dicatat pada pemakai lintas modul.
- Dokumen historis di `STRUCTURE.md` tidak otomatis menggambarkan keadaan terbaru; bagian rekonsiliasi terbaru mengalahkan klaim historis yang bertentangan.

## Cakupan Pull Dafa

Target awal adalah Setting, User Management, Content, Reports, HRM, dan Peoples. Pull juga membawa Purchases dan perubahan shared pada Sales, Payment, Orders, Workflow, Webstore, POS, Invoice, Quotation, dan Delivery Note. Perubahan shared yang baik dipertahankan setelah regresinya diperbaiki; Purchases dicatat sebagai imported/outside original scope sampai disetujui.
