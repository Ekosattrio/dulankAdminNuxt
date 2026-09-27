# Panduan AI untuk Dulank Admin

Panduan ini berlaku untuk seluruh repositori. Pola revisi menu SALES yang sudah disetujui pengguna menjadi acuan pekerjaan berikutnya. Ikuti arahan terbaru pengguna jika cakupan atau kebutuhannya berubah.

## 1. Baca acuan sebelum mengubah halaman

- Baca [docs/STRUCTURE.md](docs/STRUCTURE.md), terutama bagian 20.4 untuk hasil revisi SALES yang disetujui. Bagian sebelumnya juga memuat riwayat implementasi; jangan mengembalikan perilaku lama yang sudah direvisi.
- Kerjakan **per menu sesuai permintaan pengguna**. Acuan saat ini mencakup Sales, Invoice, Delivery Note, Sales Return, Quotation, dan Request For Quotation. **POS ditunda** sampai diminta lagi.
- Baca HTML halaman yang bersesuaian di [legacy/static-source/](legacy/static-source/), termasuk script, partial, dan aset yang mengatur interaksinya. Bila pengguna memberi URL referensi, bandingkan juga referensi tersebut. Situs acuannya adalah `https://dulank-admin.netlify.app/<nama-halaman>.html`.
- Sebelum implementasi, petakan kolom tabel, tombol, dropdown, filter, modal, halaman tambah/edit/detail, cetak, dan alur penyimpanan. Jangan menyimpulkan isi form hanya dari nama menu.
- Gunakan halaman SALES yang sudah direvisi sebagai contoh pola kode dan konsistensi UI. Isi, label, dan alur menu lain tetap mengikuti HTML menu tersebut.

## 2. Pertahankan file dan data yang sudah ada

- **Jangan menghapus HTML asli beserta CSS, JavaScript, gambar, font, partial, dan JSON acuannya.** Arsip `legacy/static-source/` tetap menjadi dasar pencocokan tampilan dan flow.
- Pertahankan halaman, route, alias `.html`, data JSON, `server/api/`, `server/types/`, dan utils yang sudah ada. Perubahan implementasi boleh dilakukan sesuai tugas, tanpa menghilangkan fitur atau kontrak lama.
- Saat memecah kode menjadi komponen, pertahankan kompatibilitas pemanggil lama; gunakan adapter bila diperlukan. Jangan menghapus file hanya karena tampak tidak terpakai.
- Jangan menimpa, mengosongkan, atau melakukan seed ulang data pengguna. `data/` adalah penyimpanan runtime; `server/data/` berisi JSON sumber. Keduanya bukan folder yang bisa saling ditimpa otomatis.
- Array runtime kosong adalah data valid. JSON rusak harus menghasilkan error yang jelas, bukan diam-diam diganti seed. Request GET tidak boleh membuat atau mengubah data.
- Jangan mengisi rincian transaksi lama yang tidak tersedia dengan produk, pembayaran, atau identitas contoh buatan. Pertahankan nilai yang diketahui dan tangani rincian kosong secara eksplisit.
- Jangan mengedit `.nuxt/`, `.output/`, atau `node_modules/` sebagai solusi perubahan source. Jangan membatalkan perubahan pengguna yang sudah ada di working tree.

## 3. Struktur kode: halaman tipis, komponen terpisah

Proyek menggunakan **Nuxt 4, Vue 3, TypeScript, dan Tailwind CSS 4**. Frontend berada di `app/`; backend tetap di `server/`.

| Lokasi | Tanggung jawab |
| --- | --- |
| `app/pages/<route>.vue` | Metadata halaman, pemanggilan composable, state koordinasi seperlunya, dan penyusunan komponen. |
| `app/components/pages/<menu>/` | Tabel, editor, detail, history, dan bagian dokumen khusus menu. |
| `app/components/sales/` | Komponen UI bersama yang sudah dipakai dan disetujui di SALES. |
| `app/composables/` | Fetch API, state form, validasi, kalkulasi, dan alur simpan/edit/hapus. |
| `app/utils/` | Helper UI dan fungsi frontend yang dapat digunakan kembali. |
| `server/api/`, `server/types/`, `server/utils/` | Endpoint, kontrak data, validasi backend, dan persistensi. |

- Gunakan `<script setup lang="ts">`, props/emits bertipe, dan composable domain. Hindari menumpuk tabel, semua modal, dan logika bisnis dalam satu file page.
- Tetap gunakan `useLegacyPage({ title: 'Nama Halaman', sweetAlert: false })` sesuai pola proyek. Saat ini helper tersebut mengatur judul; opsi `styles`/`scripts` lama hanya diterima untuk kompatibilitas, bukan memuat aset legacy.
- Template page memakai pembungkus `dulank-page dulank-page-<nama-route>`. Header/sidebar umum tetap melalui layout; jangan diduplikasi di setiap halaman.
- Gunakan `useFetch` atau composable data yang sudah tersedia. Pertahankan bentuk respons API dan gunakan tipe domain; impor tipe server melalui `import type` dengan alias `#server` bila diperlukan.
- Konfigurasi komponen memakai `pathPrefix: false`. Jika ingin nama seperti `PagesSalesTable`, lakukan import alias secara eksplisit; jangan menganggap prefix folder otomatis tersedia.
- Pisahkan form dokumen yang dipakai tambah/edit menjadi komponen bersama. Jangan membuat dua implementasi form yang kemudian berbeda isinya.
- Baca contoh nyata: [sales.vue](app/pages/sales.vue), [add-quotation.vue](app/pages/add-quotation.vue), [QuotationDocumentForm.vue](app/components/pages/quotation/QuotationDocumentForm.vue), dan [useQuotationDocumentEditor.ts](app/composables/useQuotationDocumentEditor.ts).

## 4. Tampilan mengikuti HTML, implementasi memakai Tailwind

- Cocokkan susunan halaman, label literal, urutan kolom, letak tombol, isi dropdown, bidang form, dan alur interaksi dengan HTML. Jangan mengganti form dokumen lengkap dengan modal CRUD generik.
- Pertahankan apakah suatu aksi membuka modal atau berpindah ke halaman tersendiri. Cocokkan juga detail isi modal, bukan hanya judulnya.
- Gunakan Tailwind dan komponen Vue untuk UI aktif. Jangan mengaktifkan Bootstrap/jQuery atau script legacy untuk mengambil alih DOM yang dikelola Vue.
- Gunakan [salesUi.ts](app/utils/salesUi.ts) untuk kelas field, label, tombol, dan tabel dokumen. Pastikan direktori sumber kelas Tailwind tercakup dalam `app/assets/css/main.css`.
- Pertahankan font tema proyek. Ukuran teks tabel mengikuti tabel Sales Return yang disetujui, yaitu kelas `text-xs` pada komponen bersama. Jangan membuat ukuran atau warna teks berbeda per halaman.
- Tabel lebar harus bisa di-scroll di dalam wadahnya. Halaman dan modal tidak boleh melebar keluar viewport. Periksa desktop dan layar kecil, termasuk lebar 390px.

Gunakan komponen bersama berikut sebelum membuat variasi baru:

| Komponen | Standar yang dipertahankan |
| --- | --- |
| [SalesDataTable.vue](app/components/sales/SalesDataTable.vue) | Font `text-xs`, warna teks konsisten, header, spacing, sorting, pencarian, pagination, dan scroll tabel. |
| [SalesActionButton.vue](app/components/sales/SalesActionButton.vue) | Ikon Feather 14px untuk aksi baris, tooltip/label aksesibel, serta state disabled. |
| [SalesListHeader.vue](app/components/sales/SalesListHeader.vue) | Susunan judul dan tombol toolbar; ikon toolbar konsisten. |
| [SalesStatusBadge.vue](app/components/sales/SalesStatusBadge.vue) | Tampilan status yang seragam, dengan arti status domain tetap dipertahankan. |
| [SalesMoreMenu.vue](app/components/sales/SalesMoreMenu.vue) | Dropdown aksi yang tidak terpotong oleh wadah scroll tabel. |
| [SalesDialog.vue](app/components/sales/SalesDialog.vue) | Modal, Escape, judul aksesibel, pengamanan saat busy, dan ukuran dokumen yang responsif. |
| [SalesFeedback.vue](app/components/sales/SalesFeedback.vue) | Loading, error, feedback hasil, dan retry. |
| [SalesConfirmDelete.vue](app/components/sales/SalesConfirmDelete.vue) | Konfirmasi sebelum penghapusan record. |

Standarisasi berarti komponen dan gaya konsisten; **nama serta urutan kolom tetap mengikuti domain masing-masing**. Jangan mengganti `Sales Channel` atau `Quotation Channel` menjadi `Channel`. Jangan mencampur emoji, ikon dari library lain, dan Feather untuk fungsi setara.

## 5. Perilaku SALES yang sudah disetujui

Gunakan daftar ini sebagai batas regresi saat mengubah kode bersama:

- **Sales:** kolom More berada paling awal, sebelum No Sales. Menu berisi Sale Detail, Edit Sale, Show Payments, Sales Receipt, Sales Note, Create Invoice, Create Delivery Note, dan Delete Sale. Tombol **Delete Sales History** dan **Cancel Transaction History** tetap tersedia dan membuka riwayat. Add/Edit berupa modal dengan customer, Shipping/Pickup, PO, item, voucher, biaya kirim, pajak, notes, dan total; alamat Shipping/Pickup tidak saling menimpa.
- **Invoice:** daftar memiliki aksi lihat/hapus sesuai HTML. Tidak ada tombol Edit atau Create Invoice di header daftar. **Create Invoice tetap tersedia melalui More Sales**, dengan transaksi sumber terisi.
- **Delivery Note:** Add/Edit memakai modal berbentuk dokumen, mencakup perusahaan, customer/Ship To, nomor/tanggal DN, PO, Shipping BY, Reference, status, pilihan No Sales, barang, packing, berat, serta Receive By, Security / Check, Driver, dan Issued By. Edit harus memuat rincian record yang dipilih.
- **Sales Return:** tabel memakai standar bersama. Modal berisi customer, No Sales, rincian produk dengan Qty/Qty Return/Unit/Price/Amount/Description, Notes, dan Grand Total. Detail serta Payment-OUT memakai data refund yang tersimpan, termasuk rekening/referensi.
- **Quotation:** label kolom adalah **Quotation Channel**. Add/Edit berupa **halaman dokumen terpisah**, dengan metadata, customer/pengiriman, produk/MOQ/order, Term & Condition, biaya, pajak, dan tanda tangan. Total dihitung serta divalidasi di backend.
- **Request For Quotation:** form mencakup metadata, Description/Quantity/Unit/ETA, Due Date, Payment Term, daftar **Quotation requested to**, dan penandatangan. **Duplicate Request for Quotation** membuka pilihan penerima **To:** lebih dulu. Submit membuat ID/nomor baru dan menyalin rincian ke penerima pilihan; sumber tetap utuh.
- **Sales Note/Receipt:** dokumen dan hasil cetak harus berasal dari transaksi yang dipilih melalui `id`, bukan data contoh tetap.

Rincian kolom lengkap ada di komponen `*RecordsTable.vue` masing-masing menu dan HTML acuannya. Halaman lain yang belum direvisi tidak otomatis menjadi contoh yang benar hanya karena sudah ada di repo.

## 6. Semua tombol harus menjalankan flow yang benar

- Hubungkan aksi dengan record yang dipilih. Uji More, view, add, edit, delete, history, pembayaran, duplicate, dan print yang tersedia di menu tersebut.
- Edit memuat seluruh field dan item tersimpan. Menyimpan lalu membuka ulang atau reload harus menampilkan perubahan yang sama.
- API sukses menjadi dasar feedback berhasil. Jangan memakai timeout, toast, atau perubahan state lokal sebagai pengganti penyimpanan nyata.
- Saat request berjalan, cegah submit ganda. Saat gagal, tampilkan error dan pertahankan input pengguna agar dapat diperbaiki atau dicoba ulang.
- Validasi input dan perhitungan di server, termasuk kuantitas, nilai pembayaran/refund, dan total. Validasi frontend membantu pengguna tetapi tidak menggantikan validasi backend.
- Jangan menghilangkan fitur lama ketika memindahkan markup, mengganti tabel, atau menyesuaikan style.

## 7. Validasi sebelum menyatakan selesai

Untuk perubahan fitur SALES atau komponen/backend yang digunakannya, jalankan dari root proyek:

```sh
npm run build
npm run test:sales
npm run validate:structure
```

- `test:sales` membutuhkan hasil build dan menjalankan Nitro dalam direktori sementara. Pengujian create/update/delete/refund harus menggunakan data terisolasi, **bukan data runtime pengguna**.
- Lakukan pemeriksaan browser sesuai perubahan: bandingkan label/urutan kolom dengan HTML, buka modal, jalankan alur terkait, periksa persistensi setelah reload, serta desktop/mobile. Build sukses saja belum membuktikan tampilan dan flow sudah benar.
- Perubahan komponen bersama perlu diperiksa pada halaman pemakainya, bukan hanya satu route. Periksa juga error console dan kegagalan API.
- Jalankan pemeriksaan tipe bila relevan. Jika ditemukan error lama di luar cakupan, bedakan dari error baru dan laporkan batas validasi dengan jujur; jangan mengklaim seluruh typecheck bersih hanya karena build lulus.
- `MIGRATION_MANIFEST.json` adalah snapshot migrasi. Jangan mengembalikan fitur atau memperbarui seluruh hash hanya agar pemeriksaan snapshot cocok. Pertahankan keberadaan file dan keutuhan arsip/data yang dilindungi.
- Untuk perubahan dokumentasi saja, cukup periksa isi, tautan lokal, dan diff; tidak perlu menjalankan build aplikasi.

Laporan akhir harus menyebut perubahan yang selesai, pemeriksaan yang benar-benar dijalankan, serta kekurangan yang masih ada. Jangan menyatakan semua halaman atau semua flow sudah sesuai HTML jika yang diperiksa hanya sebagian.
