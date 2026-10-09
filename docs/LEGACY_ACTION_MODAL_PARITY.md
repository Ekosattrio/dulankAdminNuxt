# Legacy Action and Modal Parity

Status global: **CONFIRMED OPEN GAP - ROUTE INVENTORY PENDING**  
Tanggal pencatatan: 2026-10-09

Pengguna telah menemukan action dan modal pada aplikasi aktif yang belum tersedia atau belum sama dengan legacy. Sampai audit per route selesai, keberadaan page, komponen, composable, API, atau hasil typecheck **tidak boleh** dipakai untuk mengklaim parity lengkap.

## 1. Mengapa Gap Ini Masih Ada

Audit sebelumnya terutama menutup type safety, request boundary, native dialog, reusable print, BRVS, dan ukuran file. Pemeriksaan tersebut membuktikan struktur tertentu, tetapi tidak secara otomatis membuktikan seluruh interaksi legacy telah dipindahkan.

Gap dapat muncul ketika:

- page legacy diimpor atau dipecah tanpa inventory setiap toolbar action, row action, dropdown More, dan bulk action;
- modal disederhanakan menjadi form generik sehingga submodal, dynamic rows, mode input/select, atau pilihan data terkait hilang;
- tombol sudah tampil tetapi belum memakai record terpilih, route, composable, mutation, atau response backend yang benar;
- Add dan Edit memakai implementasi berbeda lalu field atau perilakunya menyimpang;
- typecheck lulus walaupun suatu tombol tidak membuka apa pun atau flow belum lengkap;
- status `implemented` disalahartikan sebagai parity/runtime verified.

Penjelasan ini bukan alasan untuk mempertahankan gap. Ini adalah defect class yang harus diaudit dan ditutup per menu.

## 2. Sumber Kebenaran

Gunakan urutan berikut:

1. Arahan terbaru pengguna dan approved behavior yang tertulis di `AGENTS.md`.
2. HTML, JavaScript, partial, aset, dan JSON terkait di `legacy/static-source/`.
3. Halaman `https://dulank-admin.netlify.app/<nama-halaman>.html` dan referensi Netlify lain yang diberikan pengguna.
4. Business rules, application flows, dan keputusan pada Obsidian vault.
5. Kode aktif untuk menentukan gap implementasi, bukan untuk menebak perilaku yang seharusnya.

Jika legacy dan Netlify berbeda, catat kedua perilaku dan minta keputusan pengguna. Jangan memilih diam-diam.

## 3. Cakupan Audit Wajib Per Route

Setiap route harus menginventarisasi:

- tombol header, toolbar, row action, icon action, More/dropdown, bulk action, tab, link, dan navigasi;
- Add, Edit, View, Detail, Delete/Confirm, History, Payment/Refund, Print/PDF/Export, Import, Duplicate, dan action domain khusus;
- modal, drawer, halaman terpisah, confirm dialog, submodal selector, nested modal, dan flow kembali;
- seluruh field, label, urutan, tipe control, opsi, default, disabled/read-only, conditional field, dynamic row, dan validasi;
- input versus output turunan: saldo, total, due, progress, status pembayaran, atau nilai relasional tidak boleh menjadi input bebas;
- record terpilih dan `id` yang diteruskan ke detail/edit/delete; tidak boleh memakai data hardcoded atau record pertama;
- mutation backend, response, feedback sukses/gagal, refresh list, reload persistence, empty state, dan not-found;
- Escape, close, busy guard, focus/accessibility, overflow, desktop, dan lebar 390px.

## 4. Legacy Action and Modal Parity Matrix

Untuk setiap menu yang diaudit, isi matrix berikut di dokumen modul terkait atau tambahkan subsection route pada dokumen ini:

| Route | Trigger legacy/Netlify | Target/flow yang diharapkan | Field/subflow wajib | Implementasi aktif | Backend effect | Status | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `/contoh` | `Edit` pada row terpilih | Modal Edit | Seluruh field literal dan submodal terkait | Belum diaudit | PUT record berdasarkan `id` | `NOT AUDITED` | Legacy, source, browser |

Status yang diizinkan:

- `NOT AUDITED`
- `MISSING`
- `PARTIAL`
- `IMPLEMENTED, STATIC VERIFICATION PENDING`
- `IMPLEMENTED, RUNTIME VERIFICATION PENDING`
- `RUNTIME VERIFIED`
- `APPROVED BASELINE`

Jangan memakai `PASS` atau `VERIFIED` tanpa evidence trigger-per-trigger dan modal-per-modal.

## 5. Gate Penyelesaian

Parity menu hanya dapat ditutup bila:

1. Semua action legacy/Netlify sudah masuk matrix, termasuk action yang sengaja tidak dipertahankan beserta keputusan pengguna.
2. Setiap trigger membuka target yang benar dan menggunakan record terpilih.
3. Modal/submodal memiliki input, output, dynamic interaction, validasi, dan urutan yang sesuai.
4. Add/Edit berbagi form/editor bila domainnya sama dan tidak mengalami field drift.
5. Mutation benar-benar melalui composable/API/service dan bertahan setelah reload.
6. Error, empty, busy, cancel, close, dan not-found diuji.
7. Desktop dan 390px diuji tanpa overflow/overlap.
8. Dokumen modul, audit kanonik, handover, matrix status, dan changelog disinkronkan.
9. Persetujuan pengguna dicatat sebelum status menjadi `APPROVED BASELINE`.

## 6. Command Lanjutan

Command berikut dapat dipakai:

```text
lanjutkan todo parity action modal
audit action modal menu <nama-menu>
samakan seluruh action dan modal menu <nama-menu> dengan legacy
```

AI wajib mengerjakan satu menu atau satu kelompok route terkait per batch. Jangan menandai TODO global selesai setelah hanya memperbaiki satu tombol atau satu modal.
