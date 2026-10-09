---
title: Dulank Admin Knowledge Vault
tags: [dulank, index, architecture]
updated: 2026-10-09
---

# Dulank Admin Knowledge Vault

Vault ini adalah peta pengetahuan proyek, bukan pengganti source code atau dokumen aturan. Mulai audit atau implementasi dari halaman ini.

> **Status terbaru 2026-10-09:** P0 TypeScript, direct-request UI, native browser dialog, dan direct print list/report sudah ditutup; Finance BRVS sudah implemented dan lolos verifikasi statis. Sebelas direct print tersisa telah diaudit sebagai dokumen/detail khusus. Status belum `verified` karena 8 aset legacy belum memiliki sumber dengan hash yang cocok, backlog BRVS-UI lintas menu, serta build/browser/persistence runtime belum diuji. Gunakan audit pada item 12 sebagai TODO kanonik.

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
- [Command lanjutkan TODO](../CONTINUE_TODO_COMMAND.md)
- [Legacy Action and Modal Parity](../LEGACY_ACTION_MODAL_PARITY.md)
- [Standar tipografi](../TYPOGRAPHY_STANDARD.md)
- [Standar ikon](../ICON_STANDARD.md)
- [Framework kerja dan re-check AI](../AI_WORK_QUALITY_FRAMEWORK.md)
- [Backend-Ready Vertical Slice](../BACKEND_READY_VERTICAL_SLICE.md)
- [BRVS UI Decomposition Standard](../UI_DECOMPOSITION_STANDARD.md)
- [Troubleshooting warning Vue](../TROUBLESHOOTING_VUE_WARNINGS.md)
- [Matrix status dan kebersihan page](../PAGE_CLEANLINESS_AND_STATUS_MATRIX.md)
- [Audit kepatuhan codebase dan master TODO 2026-10-09](../CODEBASE_COMPLIANCE_AUDIT_2026-10-09.md)
- [Dokumentasi proyek/skripsi](../DOKUMENTASI_SKRIPSI_KACETAK.md)
- [README](../../README.md)
- [Panduan ringkas Claude](../../CLAUDE.md)

## Prinsip Navigasi

- Untuk aturan kerja, `AGENTS.md` menang.
- Untuk status aktif dan TODO terbaru, `docs/CODEBASE_COMPLIANCE_AUDIT_2026-10-09.md` menang; `AI_HANDOVER_GUIDE.md` adalah ringkasan handover.
- Untuk detail arsitektur dan riwayat, `docs/STRUCTURE.md` menang.
- Untuk command `lanjutkan todo`, `docs/CONTINUE_TODO_COMMAND.md` menang. Setelah scope menu dipilih, workflow `docs/MENU_IMPLEMENTATION_COMMAND.md` berlaku.
- Jika catatan vault berbeda dengan kode, kode dan hasil validasi aktual menjadi bukti utama lalu dokumentasi harus diperbarui.
