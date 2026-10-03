# Command: Kerjakan Menu

Dokumen ini adalah panduan operasional untuk AI/developer saat pengguna memberi perintah seperti:

```text
kerjakan menu <nama-menu>
lanjut ke menu <nama-menu>
bikin menu <nama-menu> dari legacy
samain menu <nama-menu> dengan HTML/Netlify
```

Targetnya bukan hanya membuat tampilan mirip, tetapi membuat menu tersebut **backend-ready**, aman dipakai sebagai sistem nyata, dan tidak perlu dibongkar besar saat data JSON diganti database.

---

## 1. Prinsip Utama

Saat mengerjakan menu, ikuti pola **Sales** dan **Payment** yang sudah disetujui:

- Page harus tipis.
- UI menu dipecah menjadi komponen domain.
- Data berasal dari API server, bukan array hardcoded di page.
- Tipe domain berada di `server/types/`.
- Endpoint berada di `server/api/`.
- Validasi, normalisasi, kalkulasi, filter, penomoran, dan persistensi berada di `server/utils/`.
- Fetch dan flow simpan/hapus berada di composable `app/composables/`.
- Fitur umum dibuat reusable jika kemungkinan dipakai menu lain.
- Style umum dibuat reusable jika muncul di lebih dari satu menu. Jangan membuat control yang fungsinya sama tetapi tinggi, radius, warna, spacing, atau focus state berbeda.
- HTML legacy dan referensi Netlify tetap menjadi sumber label, kolom, tombol, flow, modal, dan interaksi.

Menu yang selesai harus tetap aman bila nanti backend diganti database. Idealnya perpindahan database cukup mengubah helper/repository server, bukan membongkar page dan komponen.

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

Jangan mulai implementasi hanya dari nama menu. Legacy HTML adalah sumber flow.

---

## 4. Struktur File yang Harus Dibuat atau Dipakai

Untuk menu `<menu>`, gunakan pola berikut.

```text
app/pages/<menu>.vue
app/components/pages/<menu>/
app/composables/use<Menu>.ts
server/types/<menu>.ts
server/api/<menu>/
server/utils/<menu>Data.ts
server/utils/<menu>.ts
server/data/<menu>.json
```

Tidak semua menu wajib punya semua file, tetapi jika ada data, mutasi, validasi, atau flow simpan, pisahkan layer-nya dengan pola ini.

Page hanya boleh berisi:

- `useLegacyPage()`
- state koordinasi sederhana
- pemanggilan composable
- handler yang meneruskan event ke composable/API
- penyusunan komponen

Jangan menaruh tabel besar, semua modal, data dummy, dan logika bisnis penuh di satu page.

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

- `app/components/sales/SalesDataTable.vue`
- `app/components/sales/SalesActionButton.vue`
- `app/components/sales/SalesListHeader.vue`
- `app/components/sales/SalesStatusBadge.vue`
- `app/components/sales/SalesMoreMenu.vue`
- `app/components/sales/SalesDialog.vue`
- `app/components/sales/SalesFeedback.vue`
- `app/components/sales/SalesConfirmDelete.vue`
- `app/components/common/DateRangePicker.vue`
- `app/components/common/TableFilterSelect.vue`
- `app/components/common/AssigneeSelect.vue`
- `app/composables/useDateRange.ts`
- `server/utils/dateRange.ts`
- `app/utils/salesUi.ts`

Standar style dan dimensi untuk toolbar tabel dan modal form:

- **Filter & Search Toolbar:**
  - height `h-9` (36px)
  - background putih
  - border abu halus (`border-gray-200`)
  - radius sedang (`rounded-md`)
  - shadow kecil (`shadow-sm`)
  - teks `text-xs font-medium`
  - focus ring primary (`focus:border-primary focus:ring-2 focus:ring-primary/10`)
  - gunakan `TableFilterSelect.vue` untuk dropdown filter dan `DateRangePicker.vue` untuk tanggal.
- **Form Modal:**
  - susun baris dengan CSS Grid 12 kolom murni: Label `col-span-5` (41.7%) dan Input `col-span-7` (58.3%) menggunakan helper `modalFormRowClass`, `modalFormLabelClass`, `modalFormInputColClass`.
  - seluruh input dan select form menggunakan tinggi `h-9` dan kelas `formControlClass`.
  - kontrol multi-select/chip (seperti `AssigneeSelect.vue`) menggunakan tinggi dasar `min-h-9` (36px).

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
   Tabel, editor, detail, history, payment, dan dokumen dipisah ke `app/components/pages/<menu>/`.

9. **Tipiskan page**
   Page menyusun komponen dan menghubungkan event.

10. **Standarkan reusable**
    Jika ada fitur umum, buat/pakai komponen atau utility bersama.

11. **Cek flow**
    Add, edit, view, delete, filter, print, payment/refund, history, dan reload harus masuk akal sesuai menu.

12. **Validasi**
    Jalankan validasi sesuai arahan pengguna dan `AGENTS.md`. Jika pengguna melarang build/dev, jangan jalankan.

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

Jangan mengklaim seluruh aplikasi aman jika hanya satu menu yang diperiksa.

---

## 9. Template Instruksi Internal untuk AI

Saat menerima command `kerjakan menu <menu>`, ikuti instruksi internal ini:

```text
Saya akan mengerjakan menu <menu> dengan pola backend-ready Sales/Payment.
Saya akan membaca AGENTS.md, docs/STRUCTURE.md, HTML legacy, dan referensi URL bila ada.
Saya akan memetakan kolom, filter, tombol, modal, form, detail, print, data, dan validasi server.
Saya akan memisahkan page, komponen, composable, API, types, dan utils.
Jika ada fitur umum, saya akan memakai atau membuat reusable standard.
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
- Hasil validasi dilaporkan jujur.
