# Dokumentasi Proyek Kacetak / Dulank Admin

## Ringkasan

Dulank Admin adalah aplikasi administrasi percetakan dan ERP berbasis Nuxt 4, Vue 3, TypeScript, Tailwind CSS 4, dan Nitro API. Sistem mencakup penjualan, pembayaran, order produksi, webstore, people/HRM, content, settings, reports, dan kelompok domain lain yang masih bertahap.

Dokumen ini menjadi pintu masuk akademik/proyek. Detail operasional tidak diduplikasi agar tidak bertentangan:

- [Aturan kerja dan batas regresi](../AGENTS.md)
- [Arsitektur dan riwayat teknis](STRUCTURE.md)
- [Status modul terkini](../AI_HANDOVER_GUIDE.md)
- [Workflow implementasi menu](MENU_IMPLEMENTATION_COMMAND.md)
- [Knowledge Vault](obsidian-vault/00-HOME.md)

## Tujuan Sistem

- Mengelola transaksi dan dokumen percetakan secara terhubung.
- Memisahkan presentasi, state frontend, API, business logic, dan persistensi.
- Menyediakan struktur yang dapat dipindahkan dari JSON mock ke database tanpa membongkar UI.
- Mempertahankan legacy HTML sebagai sumber verifikasi label, kolom, modal, dan flow.
- Menyediakan laporan serta dokumen cetak yang konsisten.

## Arsitektur

```text
Nuxt Page -> Domain Component -> Composable -> Nitro API
           -> Server Domain/Repository -> Runtime JSON / Database Adapter
```

Frontend berada di `app/`, backend di `server/`, runtime lokal di `data/`, source seed di `server/data/`, dan referensi asli di `legacy/static-source/`.

## Prinsip Data

- Primary key dan relasi harus eksplisit.
- Nilai uang disimpan sebagai number.
- GET tidak melakukan mutasi.
- JSON rusak menghasilkan error dan tidak diganti seed.
- Feedback sukses hanya muncul setelah persistensi berhasil.
- Netlify memakai bundled source untuk data awal; mutation produksi memerlukan durable storage.

## Alur Utama

1. Pengguna membuka daftar dan frontend mengambil data melalui composable/API.
2. API membaca runtime atau source/bundled seed tanpa memodifikasi data.
3. Filter dan pencarian mempersempit tampilan.
4. Create/Edit mengirim payload ke server untuk divalidasi dan dihitung ulang.
5. Server menyimpan data lalu mengembalikan response stabil.
6. Frontend refresh dan menampilkan feedback hasil API.
7. Print/PDF memakai data record atau hasil filter yang dipilih.

Rincian per modul dan business rules tersedia di [Application Flows](obsidian-vault/03-APPLICATION-FLOWS.md), [Business Rules](obsidian-vault/04-BUSINESS-RULES.md), dan folder [modules](obsidian-vault/modules/).

## Status dan Validasi

Status tidak disimpulkan dari keberadaan page. Gunakan matrix kanonik pada [AI_HANDOVER_GUIDE.md](../AI_HANDOVER_GUIDE.md). Modul hanya disebut approved setelah flow, persistensi/reload, responsive UI, console/API errors, serta referensi legacy/Netlify diperiksa dan hasilnya dicatat.

## Revisi Klien

Catatan revisi klien dipusatkan di [CLIENT REVISIONS](obsidian-vault/07-CLIENT-REVISIONS.md). Revisi pertama menetapkan font tabel, isi tabel, search, dan filter 14px agar konsisten dengan menu sidebar utama, dengan tinggi kontrol tetap 36px.
