---
title: AI Quality Gates
tags: [ai, workflow, verification, progress]
updated: 2026-10-09
---

# AI Quality Gates

Acuan kanonik: [Framework Kerja dan Re-check AI](../AI_WORK_QUALITY_FRAMEWORK.md).
Architecture gate kanonik: [Backend-Ready Vertical Slice](../BACKEND_READY_VERTICAL_SLICE.md).
Checklist khusus page tipis: [[11-PAGE-CLEANLINESS-BRVS]].
Standar pemecahan UI: [BRVS UI Decomposition Standard](../UI_DECOMPOSITION_STANDARD.md).

## Loop Wajib

1. **Check:** baca aturan, status, legacy/Netlify, existing code, dan reusable.
2. **Implement:** telusuri vertical slice UI sampai persistence dan kembali ke UI.
3. **Re-check 1:** cocokkan hasil akhir dengan expected behavior.
4. **Re-check 2:** cari kegagalan, dummy lokal, mismatch data, duplikasi reusable, dan regresi shared component.
5. **Evidence:** catat validasi aktual dan batasnya.
6. **Progress sync:** samakan handover, status, changelog, dan laporan akhir dengan bukti.
7. **Delivery record:** catat branch, commit status, push status, remote verification, dan risiko.

Setiap menu wajib menyertakan Architecture Evidence Matrix. Layer yang filenya tersedia tetapi tidak dipakai route ditandai `present-unused`, bukan `pass`.
Setiap menu juga wajib menyertakan UI Responsibility Map. Page 12-19 baris dengan Workspace 300+ baris bukan decomposition yang lulus.

## Aturan Klaim

- `implemented` bukan `verified`.
- `partial BRVS` bukan struktur seperti Sales.
- `verified` bukan `approved baseline`.
- Build, parse SFC, browser, dan persistence test membuktikan hal yang berbeda.
- Larangan build/dev harus dihormati dan dicatat sebagai batas verifikasi.
- Status modul kanonik tetap berada di `AI_HANDOVER_GUIDE.md`.
- Default perubahan working tree adalah `NOT COMMITTED` / `NOT PUSHED`.
- `PUSHED` hanya boleh diklaim setelah push berhasil dan remote ref diverifikasi.

## Dokumen Pendamping

- [Standar Ikon](../ICON_STANDARD.md)
- [Standar Tipografi](../TYPOGRAPHY_STANDARD.md)
- [[06-MODULE-STATUS]]
- [[09-CHANGELOG]]
