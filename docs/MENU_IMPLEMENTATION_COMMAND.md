# Command: Kerjakan Menu

Dokumen ini adalah panduan operasional untuk AI/developer saat pengguna memberi perintah seperti:

```text
kerjakan menu <nama-menu>
lanjut ke menu <nama-menu>
bikin menu <nama-menu> dari legacy
samain menu <nama-menu> dengan HTML/Netlify
```

Targetnya bukan hanya membuat tampilan mirip, tetapi membuat menu tersebut **backend-ready**, aman dipakai sebagai sistem nyata, dan tidak perlu dibongkar besar saat data JSON diganti database.

Struktur wajibnya bernama **Backend-Ready Vertical Slice (BRVS)** dan dijelaskan di `docs/BACKEND_READY_VERTICAL_SLICE.md`.
Pemecahan UI wajib mengikuti **BRVS-UI** pada `docs/UI_DECOMPOSITION_STANDARD.md`.

---

## 1. Prinsip Utama

Saat mengerjakan menu, ikuti pola **Sales** dan **Payment** yang sudah disetujui:

- Page harus tipis.
- UI menu dipecah menjadi komponen domain berdasarkan tanggung jawab nyata. Page tipis yang hanya memindahkan semua isi ke satu `*Workspace.vue` belum memenuhi standar.
- Data berasal dari API server, bukan array hardcoded di page.
- Tipe domain berada di `server/types/`.
- Endpoint berada di `server/api/`.
- Validasi, normalisasi, kalkulasi, filter, penomoran, dan persistensi berada di `server/utils/`.
- Fetch dan flow simpan/hapus berada di composable `app/composables/`.
- Fitur umum dibuat reusable jika kemungkinan dipakai menu lain.
- Style umum dibuat reusable jika muncul di lebih dari satu menu. Jangan membuat control yang fungsinya sama tetapi tinggi, radius, warna, spacing, atau focus state berbeda.
- HTML legacy dan referensi Netlify tetap menjadi sumber label, kolom, tombol, flow, modal, dan interaksi.
- Peta flow, business logic, data/Netlify, status audit, dan revisi klien dibaca dari `docs/obsidian-vault/00-HOME.md`; jangan membuat matrix status duplikat.
- Quality gate pekerjaan mengikuti `docs/AI_WORK_QUALITY_FRAMEWORK.md`; implementasi wajib melalui check dan dua tahap re-check sebelum status diperbarui.
- Setiap layer BRVS harus terhubung pada route aktif. Adanya type, composable, API, atau JSON yang tidak dipakai page tidak membuktikan menu mengikuti pola Sales.
- Sebelum implementasi, buat UI Responsibility Map: Header/Actions, Stats, Filters, Table/Grid/List, Form/Editor, Detail/History/Modal, dan Feedback. Workspace hanya orchestrator.

Menu yang selesai harus tetap aman bila nanti backend diganti database. Idealnya perpindahan database cukup mengubah helper/repository server, bukan membongkar page dan komponen.

Setiap perubahan wajib ditutup dengan delivery record: branch, commit status, push status, remote verification, validasi, dan risiko. `PUSHED` hanya sah setelah push eksplisit berhasil dan remote hash diverifikasi.

---

## 2. Command yang Dianggap Sama

Perintah berikut harus dipahami sebagai eksekusi workflow ini:

```text
kerjakan menu sales
lanjut menu payment
sekarang menu purchase
samain menu expense sama legacy
bikin menu customer backend-ready
```

Jika pengguna menyebut URL Netlify, HTML legacy, atau flow tertentu, jadikan itu referensi wajib untuk menu tersebut.

Jika pengguna bilang **jangan build/dev**, jangan jalankan `npm run build` atau `npm run dev`. Jika tidak ada larangan, validasi mengikuti `AGENTS.md`.

Jangan jalankan Git yang mengubah state repo kecuali pengguna meminta eksplisit.

---

## 3. Checklist Sebelum Implementasi

Sebelum mengubah kode:

1. Baca `AGENTS.md`.
2. Baca `docs/STRUCTURE.md`, terutama bagian backend-ready, Sales, dan Payment.
3. Temukan file page aktif di `app/pages/<route>.vue`.
4. Baca HTML legacy terkait di `legacy/static-source/<nama-menu>.html`.
5. Jika ada URL referensi, bandingkan dengan halaman Netlify.
6. Petakan semua kebutuhan menu:
   - kolom tabel
   - filter
   - pencarian
   - tombol toolbar
   - tombol row/action/more
   - modal
   - halaman tambah/edit/detail
   - print/export/cetak
   - history
   - payment/refund bila ada
   - data apa saja yang harus tersimpan
   - validasi server yang dibutuhkan
   - fitur reusable yang terlihat
7. Untuk dataset/API baru, pastikan basename JSON di `server/data/` terdaftar di `server/utils/bundledData.ts` dan GET tidak melakukan write.
8. Isi Architecture Evidence Matrix BRVS dan tandai setiap layer sebagai `missing`, `present-unused`, `present-wrong-responsibility`, atau `connected`.

Jangan mulai implementasi hanya dari nama menu. Legacy HTML adalah sumber flow.

---

## 4. Struktur File yang Harus Dibuat atau Dipakai

Untuk menu `<menu>`, gunakan pola berikut.

```text
app/pages/<menu>.vue
app/components/Pages/<menu>/
app/composables/use<Menu>.ts
server/types/<menu>.ts
server/api/<menu>/
server/utils/<menu>Data.ts
server/utils/<menu>.ts
server/data/<menu>.json
```

Untuk menu yang membaca atau mengubah data domain, layer page, domain component, composable, type, API, server helper/repository, dan data source bersifat wajib. Layer hanya boleh `N/A` bila flow memang tidak membutuhkannya dan alasannya dicatat.

Page hanya boleh berisi:

- `useLegacyPage()`
- state koordinasi sederhana
- pemanggilan composable
- handler yang meneruskan event ke composable/API
- penyusunan komponen

Jangan menaruh tabel/card collection, form/modal, data dummy, serializer export, dan logika bisnis di page. Target page maksimal 150 baris; page di atas 200 baris wajib dipecah atau dijustifikasi, dan page di atas 300 baris otomatis memerlukan structural review.

---

## 5. Standar Backend-Ready

Menu dianggap backend-ready jika memenuhi aturan ini:

- Semua field domain ditulis di `server/types/`, termasuk field detail/modal/cetak yang tidak tampil di tabel.
- GET membaca data tanpa membuat, menimpa, atau seed ulang runtime data.
- POST/PUT/DELETE melakukan validasi server.
- Response API stabil: `success`, `data`, `message`, dan `meta` bila perlu.
- Error server jelas dan tidak diam-diam mengganti data rusak dengan seed.
- Frontend menunggu hasil API sebelum menampilkan feedback sukses.
- Edit memuat data record tersimpan, bukan form kosong atau data contoh.
- Detail/print memakai `id` record yang dipilih.
- Data lama yang kurang detail ditangani sebagai kosong/known value, bukan diisi data palsu.
- Runtime `data/` tidak ditimpa otomatis oleh `server/data/`.
- Mutasi harus mudah dipindahkan ke database dengan mengubah `server/utils/` atau repository server.
- Pisahkan **input command** dari **output/query model**. Kolom output seperti balance, due, total, progress, jumlah relasi, dan status hasil kalkulasi tidak otomatis menjadi field Add/Edit.
- Nilai turunan harus dihitung server-side dari relasi atau ledger. Contoh: form Customer tidak menerima balance; balance adalah penjumlahan account entries berdasarkan `customerId`.
- Dummy JSON harus menjadi dataset domain yang dapat dimigrasikan: primary key stabil, foreign key valid, timestamp, nilai uang numerik, dan sumber nilai agregat yang dapat ditelusuri.

---

## 6. Reusable First

Jika menemukan pola yang dipakai lebih dari satu menu, buat standar reusable.

Contoh fitur reusable:

- light modern table controls
- date range picker
- search/filter table
- status badge
- action button
- more menu
- confirm delete
- feedback loading/error
- dialog/modal shell
- document form
- print helper
- currency/date formatter
- payment/refund utility
- server date filtering
- server ID/document number generator

Reusable yang sudah ada harus dipakai dulu:

- `app/components/Sales/SalesDataTable.vue`
- `app/components/Sales/SalesActionButton.vue`
- `app/components/Sales/SalesListHeader.vue`
- `app/components/Sales/SalesStatusBadge.vue`
- `app/components/Sales/SalesMoreMenu.vue`
- `app/components/Sales/SalesDialog.vue`
- `app/components/Sales/SalesFeedback.vue`
- `app/components/Sales/SalesConfirmDelete.vue`
- `app/components/Common/DateRangePicker.vue`
- `app/components/Common/TableFilterSelect.vue`
- `app/components/Common/AssigneeSelect.vue`
- `app/composables/useDateRange.ts`
- `server/utils/dateRange.ts`
- `app/utils/salesUi.ts`
- `app/utils/actionIcons.ts`

Standar style dan dimensi untuk toolbar tabel dan modal form:

- **Baca standar tipografi:** `docs/TYPOGRAPHY_STANDARD.md`. Gunakan hirarki resmi 20px page title, 18px dialog title, 16px section title, 14px body/control/table/sidebar, 12px label/caption/badge, dan 24px KPI. Jangan membuat ukuran arbitrary jika token resmi tersedia.
- **Baca standar ikon:** `docs/ICON_STANDARD.md`. Gunakan aksi semantik `action="view|edit|delete|add|..."` pada `SalesActionButton`; jangan memilih ulang glyph CRUD per halaman.

- **Filter & Search Toolbar:**
  - height `h-9` (36px)
  - background putih
  - border abu halus (`border-gray-200`)
  - radius sedang (`rounded-md`)
  - shadow kecil (`shadow-sm`)
  - teks `text-sm font-medium` (14px, sama dengan menu utama sidebar sesuai revisi klien)
  - focus ring primary (`focus:border-primary focus:ring-2 focus:ring-primary/10`)
  - gunakan `TableFilterSelect.vue` untuk dropdown filter dan `DateRangePicker.vue` untuk tanggal.
- **Form Modal:**
  - susun baris dengan CSS Grid 12 kolom murni: Label `col-span-5` (41.7%) dan Input `col-span-7` (58.3%) menggunakan helper `modalFormRowClass`, `modalFormLabelClass`, `modalFormInputColClass`.
  - seluruh input dan select form menggunakan tinggi `h-9` dan kelas `formControlClass`.
  - kontrol multi-select/chip (seperti `AssigneeSelect.vue`) menggunakan tinggi dasar `min-h-9` (36px).
  - teks input/select/tombol memakai `text-sm` (14px); label dan helper memakai `text-xs` (12px), tidak lebih kecil.

Jika style ini dibutuhkan menu lain, jadikan shared class/helper agar Sales, Payment, dan menu berikutnya tetap satu rasa.

Jangan membuat versi khusus per halaman bila fungsi dan bentuknya sama.

---

## 7. Alur Implementasi Wajib

Gunakan urutan ini saat mengeksekusi menu:

1. **Audit legacy**
   Baca HTML, script inline, partial, aset terkait, dan URL Netlify bila diberikan.

2. **Tulis peta menu**
   Catat kolom, filter, tombol, modal, form, detail, print, dan data yang dibutuhkan.

3. **Rancang kontrak data**
   Buat atau perbarui `server/types/<menu>.ts` berdasarkan kebutuhan nyata menu.

4. **Siapkan data sumber**
   Buat/perbarui JSON sumber di `server/data/` tanpa menimpa runtime `data/`.

5. **Buat utility server**
   Pindahkan baca/tulis/filter/validasi/kalkulasi ke `server/utils/`.

6. **Buat endpoint**
   Implementasikan API GET/POST/PUT/DELETE sesuai flow menu.

7. **Buat composable**
   Fetch data dan mutasi dari frontend lewat `app/composables/use<Menu>.ts`.

8. **Pecah UI ke komponen**
   Tabel, editor, detail, history, payment, dan dokumen dipisah ke `app/components/Pages/<menu>/`.

9. **Tipiskan page**
    Page menyusun komponen dan menghubungkan event. Pindahkan tabel/card grid, editor, modal, filter domain kompleks, skeleton, dan export logic ke domain component/composable.

10. **Standarkan reusable**
    Jika ada fitur umum, buat/pakai komponen atau utility bersama.

11. **First re-check**
    Baca ulang file akhir dan cocokkan dengan peta legacy: Add, edit, view, delete, filter, print, payment/refund, history, relasi, serta reload.

12. **Adversarial re-check**
    Asumsikan implementasi masih salah. Cari dummy lokal, sukses palsu, output yang dijadikan input, foreign key rusak, uang string, GET yang menulis, duplikasi reusable, warning Vue, dan dampak perubahan shared component.

13. **Validasi**
    Jalankan validasi sesuai arahan pengguna dan `AGENTS.md`. Jika pengguna melarang build/dev, jangan jalankan.

14. **Catat evidence dan progres**
    Catat file yang berubah, flow yang selesai, reusable yang dibuat/dipakai, Architecture Evidence Matrix BRVS, hasil kedua re-check, validasi yang dijalankan, dan sisa risiko. Jika menu menjadi selesai atau statusnya berubah, perbarui dokumen progres yang relevan tanpa melampaui bukti.

---

## 8. Pola Jawaban Saat Selesai

Laporan akhir harus menyebut:

- Menu yang dikerjakan.
- File penting yang berubah.
- Fitur/flow yang sudah terhubung.
- Reusable baru yang dibuat atau dipakai.
- Validasi yang benar-benar dijalankan.
- Validasi yang tidak dijalankan dan alasannya.
- Kekurangan yang masih tersisa, jika ada.
- Perubahan status/progres menu jika ada, serta dokumen progres yang ikut diperbarui.
- Hasil first re-check dan adversarial re-check, termasuk gap yang belum ditutup.

Jangan mengklaim seluruh aplikasi aman jika hanya satu menu yang diperiksa.

---

## 9. Template Instruksi Internal untuk AI

Saat menerima command `kerjakan menu <menu>`, ikuti instruksi internal ini:

```text
Saya akan mengerjakan menu <menu> dengan pola backend-ready Sales/Payment.
Saya akan membaca AGENTS.md, docs/STRUCTURE.md, HTML legacy, dan referensi URL bila ada.
Saya akan memetakan kolom, filter, tombol, modal, form, detail, print, data, dan validasi server.
Saya akan memisahkan page, komponen, composable, API, types, dan utils.
Saya akan membuktikan rantai BRVS page -> component -> composable -> API -> server domain helper/repository -> data.
Jika ada fitur umum, saya akan memakai atau membuat reusable standard.
Saya akan melakukan first re-check terhadap acuan dan adversarial re-check terhadap bug/regresi.
Saya hanya akan menaikkan status sesuai evidence yang benar-benar tersedia.
Saya tidak akan menjalankan Git yang mengubah repo tanpa instruksi eksplisit.
Saya akan menghormati larangan build/dev bila pengguna menyebutkannya.
```

---

## 10. Kriteria Selesai

Satu menu baru boleh disebut selesai jika:

- Tampilan dan flow utama cocok dengan legacy/Netlify.
- Data berasal dari server API.
- Add/Edit/Delete atau flow mutasi yang tersedia benar-benar tersimpan.
- Reload menampilkan data terbaru.
- Filter/search/tanggal bekerja.
- Tombol row menjalankan aksi record yang dipilih.
- Validasi server menjaga data penting.
- Tidak ada data palsu untuk detail yang tidak diketahui.
- Komponen reusable dipakai untuk pola umum.
- Page tetap tipis dan mudah dibaca.
- Architecture Evidence Matrix BRVS tidak memiliki layer wajib yang missing, unused, atau menanggung tanggung jawab layer lain.
- Hasil validasi dilaporkan jujur.
- Dua tahap re-check sudah dilakukan dan evidence matrix tidak memiliki gap in-scope yang disembunyikan.
