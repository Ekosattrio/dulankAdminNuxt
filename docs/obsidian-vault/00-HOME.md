---
title: Dulank Admin Knowledge Vault
tags: [dulank, index, architecture]
updated: 2026-10-10
---

# Dulank Admin Knowledge Vault

Vault ini adalah peta pengetahuan proyek, bukan pengganti source code atau dokumen aturan. Mulai audit atau implementasi dari halaman ini.

> **Status terbaru 2026-10-11:** seluruh 186 HTML lokal sudah dipetakan 1:1 dan dibuktikan identik secara konten dengan repository referensi. Sebanyak 50 route pada Sales/dokumen, Payment, Sales-adjacent, Webstore/Support Ticket, sembilan route Orders/Job Order, enam route master Workflow, Dashboard Admin, Analytics Dashboard, Subscriptions, Kalkulator Dashboard, Billing, dan Voucher sudah direkonsiliasi manual serta memiliki evidence API/persistence/data safeguards dan browser desktop/390px. Delapan aset Sticky Kit/Summernote telah dipulihkan dari salinan internal yang hash SHA-256-nya identik dengan manifest; structure validator kini lulus. Seluruh aplikasi belum `verified` karena 136 route legacy lain masih menunggu audit manual/browser dan gap BRVS/BRVS-UI lintas modul tetap terbuka. Gunakan audit pada item 12 sebagai TODO kanonik dan item 13 sebagai matrix parity penuh.

## Jalur Baca

1. [[01-SOURCE-OF-TRUTH]]
2. [[02-ARCHITECTURE]]
3. [[03-APPLICATION-FLOWS]]
4. [[04-BUSINESS-RULES]]
5. [[05-DATA-API-NETLIFY]]
6. [[06-MODULE-STATUS]]
7. [[07-CLIENT-REVISIONS]]
8. [[08-DECISIONS-AND-RISKS]]
9. [[09-CHANGELOG]]
10. [[10-AI-QUALITY-GATES]]
11. [[11-PAGE-CLEANLINESS-BRVS]]
12. [Audit kepatuhan codebase dan master TODO 2026-10-09](../CODEBASE_COMPLIANCE_AUDIT_2026-10-09.md)
13. [Full legacy parity inventory 2026-10-10](../LEGACY_PARITY_AUDIT_2026-10-10.md)

## Modul Audit 2026-10-08

- [[modules/SETTING]]
- [[modules/USER-MANAGEMENT]]
- [[modules/CONTENT]]
- [[modules/REPORTS]]
- [[modules/HRM]]
- [[modules/PEOPLES]]
- [[modules/CALCULATOR-APPS]]
- [[modules/PRODUCTS-SERVICES]]

## Dokumen Kanonik di Luar Vault

- [Aturan AI](../../AGENTS.md)
- [Struktur dan riwayat implementasi](../STRUCTURE.md)
- [Status handover](../../AI_HANDOVER_GUIDE.md)
- [Command implementasi menu](../MENU_IMPLEMENTATION_COMMAND.md)
- [Standar tipografi](../TYPOGRAPHY_STANDARD.md)
- [Standar ikon](../ICON_STANDARD.md)
- [Framework kerja dan re-check AI](../AI_WORK_QUALITY_FRAMEWORK.md)
- [Backend-Ready Vertical Slice](../BACKEND_READY_VERTICAL_SLICE.md)
- [BRVS UI Decomposition Standard](../UI_DECOMPOSITION_STANDARD.md)
- [Troubleshooting warning Vue](../TROUBLESHOOTING_VUE_WARNINGS.md)
- [Matrix status dan kebersihan page](../PAGE_CLEANLINESS_AND_STATUS_MATRIX.md)
- [Audit kepatuhan codebase dan master TODO 2026-10-09](../CODEBASE_COMPLIANCE_AUDIT_2026-10-09.md)
- [Full legacy parity inventory 2026-10-10](../LEGACY_PARITY_AUDIT_2026-10-10.md)
- [Dokumentasi proyek/skripsi](../DOKUMENTASI_SKRIPSI_KACETAK.md)
- [README](../../README.md)
- [Panduan ringkas Claude](../../CLAUDE.md)

## Prinsip Navigasi

- Untuk aturan kerja, `AGENTS.md` menang.
- Untuk status modul terbaru, `AI_HANDOVER_GUIDE.md` root menang.
- Untuk detail arsitektur dan riwayat, `docs/STRUCTURE.md` menang.
- Untuk workflow command, `docs/MENU_IMPLEMENTATION_COMMAND.md` menang.
- Jika catatan vault berbeda dengan kode, kode dan hasil validasi aktual menjadi bukti utama lalu dokumentasi harus diperbarui.
