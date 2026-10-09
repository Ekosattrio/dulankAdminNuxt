---
title: Data API and Netlify
tags: [data, api, netlify, persistence]
updated: 2026-10-08
---

# Data, API, dan Netlify

## Prioritas Baca

1. Jika `data/<file>.json` ada, baca runtime.
2. Jika runtime tidak ada dan `server/data/<file>.json` tersedia, baca source.
3. Jika filesystem source tidak tersedia pada bundle serverless, baca `bundledSources`.
4. Jika file fisik ada tetapi JSON rusak, lempar error. Jangan fallback ke seed.

## Bundle Coverage

`server/utils/bundledData.ts` harus memiliki entry untuk setiap basename JSON di `server/data/`. Alias kompatibilitas boleh ada, misalnya `employee-salaries.json` menunjuk source `employeeSalaries.json`.

Audit 2026-10-08 memperbaiki entry yang hilang untuk `users.json` dan menambahkan source/bundle `permissions.json`.

## Batas Netlify

Bundled JSON menyelesaikan masalah data awal yang kosong saat deploy. Namun filesystem Netlify Functions tidak boleh diperlakukan sebagai database persisten. Mutation yang gagal menulis harus mengembalikan error, bukan sukses palsu.

Untuk persistensi produksi pilih adapter durable seperti PostgreSQL, MySQL, Netlify Blobs, atau service database lain. Kontrak API dan domain helper harus tetap sama ketika adapter diganti.

## Checklist Dataset Baru

- Tambahkan `server/data/<file>.json`.
- Daftarkan import dan key di `bundledData.ts`.
- Pastikan key sama dengan nama yang dibaca endpoint.
- Jangan menyalin source ke runtime pada GET.
- Uji source/bundle coverage secara statis.
- Uji JSON parse seluruh source dan runtime.
