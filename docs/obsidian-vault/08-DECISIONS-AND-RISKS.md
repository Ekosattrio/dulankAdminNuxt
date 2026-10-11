---
title: Decisions and Risks
tags: [adr, risk]
updated: 2026-10-11
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
- Add Sales memakai halaman `/add-sales` dan Edit Sale memakai modal; keduanya wajib berbagi form domain yang sama.
- Inventaris parity 186 HTML pada `docs/LEGACY_PARITY_AUDIT_2026-10-10.md` bersifat konservatif: static-text match bukan bukti selesai.
- Detail Invoice, Delivery Note, Quotation, dan RFQ wajib memilih record melalui `id/no`; data lama tanpa rincian tersimpan menampilkan empty/unavailable state eksplisit dan tidak boleh diisi produk, alamat, rekening, atau identitas contoh.
- Validasi, kalkulasi, penomoran, status action, dan persistensi lima dokumen transaksi Sales berada di domain service; route Nitro hanya menjadi adapter HTTP.
- Payment Flow menurunkan total/status/history di server; split payment disimpan sebagai entri bertipe dan tidak boleh kembali menjadi dua baris UI semu.
- Sales Dashboard memakai snapshot typed melalui API/service dan komponen berdasarkan tanggung jawab; Sales Report memakai server-side search/date filter, detail legacy penuh, dan shared print/export; Sales Note/Receipt selalu mengambil transaksi terpilih melalui `id/no`.
- View Support Ticket mengikuti legacy dengan navigasi ke `/support-ticket-detail?id=...`; detail, Edit, chat, status, dan delete memakai record serta repository yang sama, bukan state lokal atau modal View.
- Counter workflow Job Order dan total My Incentive diturunkan dari dataset server aktif, bukan konstanta UI. Mutation Orders core memakai domain service/repository yang sama dan mempertahankan array kosong sebagai data valid serta JSON rusak sebagai error.
- Detail dan editor Job Order selalu menyelesaikan relasi dari query `id` atau `orderId`; data teknis lama yang tidak tersimpan tidak diisi contoh. Flow, informasi sebelum/sesudah, assignee, dan incentive disimpan sebagai struktur typed pada Job Order.
- Job Progress memakai dataset relasional tersendiri dengan FK order/job/customer/branch/product/employee, spesifikasi input/output, Qty OK/Rusak, dan timestamp. KPI serta filter berasal dari service; toggle complete dipersistensikan dan tidak lagi mengubah array page.
- Master Workflow memakai strict shared JSON repository, API context typed untuk produk/kategori/nama/template, serta satu editor Add/Edit. Submodal kategori/nama menyimpan master data melalui API; Template mempertahankan inline information dan submodal Data Select.
- Analytics Dashboard memakai satu snapshot typed melalui strict server service; KPI, conversion, performance, browser/country, dan Top Pages tidak boleh kembali menjadi data hardcoded di route page.
- Dashboard Admin mempertahankan seluruh panel legacy dan lima tab transaksi dari snapshot numeric typed. Range chart, dropdown period, dismiss alert, serta urutan kolom khusus Invoice harus tetap interaktif; record tidak boleh kembali di-hardcode pada page.
- Subscriptions tidak memiliki Add, upgrade, atau payment flow pada HTML legacy. Pertahankan empat KPI, filter, kolom/total, serta View/Edit/Delete; data record harus melewati composable/API/service dan uang tetap numerik.
- Kalkulator Dashboard mempertahankan sepuluh nama/angka tabel dan tiga grafik dengan seri yang sama seperti HTML. Category dropdown legacy tetap presentasional karena sumber tidak memberi relasi kategori per user; jangan menggantinya dengan filter Status non-legacy.
- Billing bersifat read-only sesuai HTML legacy: tiga KPI, sebelas kolom, filter Search/Date/Metode/Status, dan footer totals. Jangan menambahkan Action, detail modal, toolbar print, atau mutation yang tidak ada pada referensi.
- Voucher mengikuti dua katalog Product literal yang berbeda pada legacy: toolbar filter memakai Laptop/Lemari, sedangkan form Add/Edit memakai Nike Jordan/Amazon Echo Dot. `Used` adalah output pemakaian dan tidak boleh menjadi input form.
- Delapan aset Sticky Kit/Summernote yang sebelumnya hilang dipulihkan hanya setelah SHA-256 salinan internal terbukti identik dengan `MIGRATION_MANIFEST.json`; manifest tidak diubah.

## Risiko Terbuka

- Netlify Functions memerlukan durable storage untuk mutation persisten.
- Sebanyak 136 route legacy di luar 50 route yang telah direkonsiliasi belum mendapat manual/browser regression test penuh.
- Purchases masuk di luar scope awal dan belum approved.
- Global `validate:structure --check-hashes` membandingkan snapshot pramigrasi sehingga tetap melaporkan banyak source yang sengaja berubah; gate aktif adalah path validation plus hash spesifik delapan aset yang dipulihkan.
- Typecheck, build, dan structure validator saat ini bersih, tetapi Netlify mutation persistence belum terbukti.
- Test email masih simulasi dan harus diberi label demikian sampai SMTP adapter nyata tersedia.

## Decision Gate

Modul baru boleh naik ke approved jika reference fidelity, API validation, persistence/reload, responsive UI, console/API errors, dan dokumentasi validasi semuanya mempunyai bukti.
