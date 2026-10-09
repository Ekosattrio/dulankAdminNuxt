# Standar Ikon Aksi

Dokumen ini adalah acuan ikon UI Dulank Admin. Sumber implementasinya berada di `app/utils/actionIcons.ts`. Nama aksi semantik lebih penting daripada nama glyph agar ikon dapat diganti terpusat tanpa mengedit setiap halaman.

## Kamus Resmi

| Aksi | Feather icon | Pemakaian |
| --- | --- | --- |
| Add | `plus-circle` | Tambah record atau membuka form create. |
| View | `eye` | Membuka detail record. |
| Edit | `edit` | Mengubah record. Gunakan standar `edit` (pad dengan pensil) sesuai legacy. |
| Delete / Remove | `trash-2` | Menghapus record atau baris rincian. |
| More | `more-horizontal` | Membuka kumpulan aksi tambahan. |
| Refresh | `rotate-cw` | Memuat ulang data. |
| Save | `save` | Menyimpan form atau konfigurasi. |
| Print | `printer` | Mencetak dokumen. |
| PDF | `file-text` | Menyimpan hasil cetak sebagai PDF. |
| Import / Upload | `upload` | Mengunggah atau mengimpor data. |
| Export / Download | `download` | Mengunduh atau mengekspor data. |
| Search | `search` | Pencarian. |
| Filter | `filter` | Filter data. |
| Settings | `settings` | Pengaturan record atau modul. |
| Duplicate | `copy` | Menyalin record menjadi record baru. |
| Back | `arrow-left` | Kembali ke tampilan sebelumnya. |
| Close | `x` | Menutup modal/panel. |
| Payment | `dollar-sign` | Membuka aksi pembayaran. |
| History | `clock` | Membuka riwayat. |
| Address | `map-pin` | Membuka atau menambahkan alamat. |

## Cara Pakai

Gunakan aksi semantik pada tombol baris:

```vue
<SalesActionButton action="view" label="View detail" @click="openDetail(item)" />
<SalesActionButton action="edit" label="Edit customer" @click="openEdit(item)" />
<SalesActionButton action="delete" label="Delete customer" @click="openDelete(item)" />
```

Untuk toolbar atau komponen shared:

```ts
import { actionIconSizes, getActionIcon } from '~/utils/actionIcons'
```

`icon="..."` pada `SalesActionButton` dan action `SalesMoreMenu` tetap didukung untuk kompatibilitas. Nilai `edit-2` dinormalisasi menjadi `edit`. Kode baru wajib memakai `action` untuk aksi yang sudah ada di kamus. Raw `icon` hanya boleh dipakai untuk konsep domain yang belum memiliki aksi standar.

## Ukuran dan Susunan

- Aksi baris: Feather 14px di tombol tetap `size-8` (32px).
- Toolbar dan tombol teks: Feather 16px; tombol ikon toolbar `size-9` (36px).
- Navigasi: Feather 16px.
- Tombol close dialog: Feather 20px.
- Urutan aksi CRUD yang tampil sejajar: View, Edit, Delete. Delete selalu terakhir.
- Ikon saja wajib memiliki `title` dan `aria-label` yang menjelaskan aksi dan konteksnya.
- Jangan memakai emoji, SVG manual, font icon, atau library ikon lain untuk aksi yang sudah tersedia di Feather.

## Checklist AI

1. Cari komponen shared sebelum membuat tombol ikon baru.
2. Pilih nama aksi dari `AppActionIcon`, bukan memilih glyph sendiri.
3. Gunakan `SalesActionButton` untuk aksi baris dan `SalesMoreMenu` untuk kumpulan aksi.
4. Pertahankan label aksesibel; ikon tidak menggantikan nama aksi bagi screen reader.
5. Jika aksi baru benar-benar reusable, tambahkan satu kali ke `actionIcons.ts` dan dokumen ini.
6. Re-check halaman lain yang memakai shared component tersebut.

