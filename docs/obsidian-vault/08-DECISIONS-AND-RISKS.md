---
title: Decisions and Risks
tags: [adr, risk]
updated: 2026-10-08
---

# Decisions and Risks

## Keputusan Aktif

- Rupiah menggunakan separator titik.
- Tabel/filter menggunakan 14px sesuai revisi klien.
- Bundled source hanya fallback ketika file tidak tersedia, bukan ketika JSON rusak.
- Write failure harus terlihat sebagai error API.
- GET tidak melakukan mutasi.
- Dokumen status hanya memiliki satu matrix kanonik di root `AI_HANDOVER_GUIDE.md`.
- Komponen baru dipertahankan dan path lama dipulihkan untuk kompatibilitas/migration manifest.

## Risiko Terbuka

- Netlify Functions memerlukan durable storage untuk mutation persisten.
- Kelompok hasil pull serta Calculator Apps dan Products & Services belum mendapat browser regression test penuh.
- Purchases masuk di luar scope awal dan belum approved.
- Legacy archive masih memiliki file vendor yang hilang menurut migration manifest.
- Typecheck seluruh proyek belum dinyatakan bersih.
- Test email masih simulasi dan harus diberi label demikian sampai SMTP adapter nyata tersedia.

## Decision Gate

Modul baru boleh naik ke approved jika reference fidelity, API validation, persistence/reload, responsive UI, console/API errors, dan dokumentasi validasi semuanya mempunyai bukti.
