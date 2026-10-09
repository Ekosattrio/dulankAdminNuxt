# BRVS UI Decomposition Standard

Dokumen ini adalah aturan kanonik untuk memecah UI Dulank Admin tanpa mengorbankan backend-ready flow. Nama pendek standarnya adalah **BRVS-UI**.

BRVS-UI menggabungkan dua hal:

1. **UI decomposition:** route page tipis, komponen dinamai berdasarkan tanggung jawab visual/domain, dan tidak ada satu file `*Workspace.vue` yang menampung seluruh halaman.
2. **Backend-Ready Vertical Slice:** seluruh data dan mutation tetap mengikuti `page -> composable -> API -> server domain service/repository -> typed relational data`.

## 1. Referensi Rama yang Dipakai

Referensi UI decomposition dipin pada:

- Repository: `https://github.com/noosabaktee/dulank-nuxt.git`
- Branch: `Rama`
- Commit yang diaudit: `76f6e79acd4744429dce0fc25ec878bd5977daeb`
- Tanggal audit: 2026-10-09

Hal yang diadopsi dari referensi tersebut:

- page menjadi route composer;
- satu folder komponen per route/domain;
- komponen diberi nama sesuai tanggung jawab nyata, misalnya Header, Filters, Table, Grid, Form, Detail, dan Modal;
- props dan emits menjadi kontrak antarkomponen;
- layout dan bagian UI besar tidak ditumpuk di page.

Hal yang **tidak** diadopsi:

- `$fetch()` atau `useFetch()` langsung dari page/component;
- mutation langsung dari komponen presentational;
- legacy CSS/JavaScript sebagai pemilik business logic;
- generic JSON writer tanpa domain validation/repository;
- type domain lokal yang berbeda dari kontrak server;
- pemindahan page monolitik menjadi satu `*Workspace.vue` monolitik.

Referensi Rama hanya menjadi patokan **cara memecah UI**. Sales/Payment dan BRVS tetap menjadi patokan data, API, validasi, relasi, serta persistence.

## 2. Struktur Wajib

```text
app/pages/<route>.vue
  -> use<Menu>Page() / use<Menu>()
  -> <Menu>Screen.vue atau komposisi komponen langsung
       -> <Menu>Header.vue
       -> <Menu>Stats.vue
       -> <Menu>Filters.vue
       -> <Menu>RecordsTable.vue / <Menu>Grid.vue
       -> <Menu>Form.vue / <Menu>Editor.vue
       -> <Menu>DetailModal.vue
       -> <Menu>HistoryModal.vue
       -> shared components

app/composables/use<Menu>.ts
  -> server/api/<menu>/
  -> server/utils/<menu>.ts
  -> server/data/<menu>.json atau database adapter
```

`<Menu>Screen.vue` atau `<Menu>Workspace.vue` bersifat opsional. Jika dipakai, file tersebut hanya menjadi orchestrator UI, bukan tempat memindahkan seluruh isi page lama.

## 3. Batas Tanggung Jawab UI

| Layer | Boleh | Dilarang |
| --- | --- | --- |
| Page | Metadata, composable, state koordinasi ringan, compose components | Markup tabel/form/modal panjang, request langsung, business logic |
| Screen/Workspace | Susunan section, props, emits, state tampilan ringan | Seluruh tabel + form + modal + mutation dalam satu file |
| Table/Grid | Render collection, selection emit, sorting UI | Persistence, mengarang record, dialog besar |
| Filters | Kontrol filter dan typed emits | Fetch domain langsung atau menyimpan data utama |
| Form/Editor UI | Input, section form, validation presentation | Kalkulasi otoritatif atau write JSON/API langsung |
| Modal/Detail | Presentasi dialog dan event close/submit | Menjadi repository atau sumber data palsu |
| Composable | Fetch, mutation, pending/error, mapping command, refresh | DOM/layout besar |
| Server service | Validasi, relasi, kalkulasi, persistence | UI concern |

## 4. Budget dan Architecture Gate

Jumlah baris adalah alarm, bukan satu-satunya bukti kualitas.

- **Page:** target 12-80 baris, maksimum normal 150 baris.
- **Screen/Workspace orchestrator:** target maksimum 150 baris.
- **Page atau Workspace 201-300 baris:** decomposition audit wajib.
- **Page atau Workspace di atas 300 baris:** `structural review required` dan tidak boleh berstatus BRVS-UI compliant.
- **Leaf/domain component:** target maksimum 250 baris.
- **Leaf component di atas 300 baris:** wajib dipecah atau diberi justifikasi tertulis berdasarkan satu tanggung jawab yang memang tidak dapat dipisah.

Hard fail meskipun jumlah baris kecil:

- satu Workspace memuat stats, filter, table, form, modal, export, dan mutation sekaligus;
- page tipis hanya karena seluruh monolit dipindahkan ke satu komponen;
- component memanggil API untuk persistence tanpa domain composable;
- `alert()`, `confirm()`, atau timeout menjadi bukti aksi berhasil;
- Add/Edit memiliki form atau kalkulasi terpisah;
- komponen bernama generik tidak menunjukkan tanggung jawabnya;
- status `verified` diberikan hanya karena route HTTP 200 atau page pendek.

## 5. Cara Kerja Wajib untuk AI

### Gate 1 - Petakan Sebelum Edit

1. Baca legacy/Netlify, BRVS, matrix status, dan reusable existing.
2. Catat page, Workspace, child components, composable, API, service, type, serta data yang aktif.
3. Tandai setiap layer sebagai `connected`, `present-unused`, `wrong-responsibility`, atau `missing`.

### Gate 2 - Buat Responsibility Map

Sebelum menulis kode, buat daftar komponen berdasarkan tanggung jawab nyata:

```text
Route composer
Header/actions
Stats/KPI
Filters/search
Table/grid/list
Form/editor sections
Detail/history/modal
Feedback/loading/empty/error
```

Jangan membuat `Workspace` sebagai jawaban otomatis. Buat hanya bila benar-benar diperlukan sebagai orchestrator.

### Gate 3 - Petakan Data Flow

Untuk setiap View/Add/Edit/Delete/Print/Import:

```text
UI event
  -> typed emit
  -> page controller/composable
  -> API
  -> domain service/repository
  -> persistence
  -> stable response
  -> refresh
  -> UI feedback
```

### Gate 4 - Implementasi

- gunakan explicit import karena `pathPrefix: false`;
- gunakan shared component sebelum membuat variasi baru;
- gunakan form yang sama untuk Add/Edit;
- pertahankan label, urutan, modal, dan flow legacy;
- jangan mengubah schema backend hanya agar UI lebih mudah dibuat.

### Gate 5 - Re-check Anti-Monolith

Periksa page dan seluruh child component, bukan hanya jumlah baris page:

- apakah satu file memegang lebih dari satu tanggung jawab besar;
- apakah markup hanya berpindah dari page ke Workspace;
- apakah data/mutation melewati composable;
- apakah API tipis dan domain helper benar-benar dipakai;
- apakah loading/error/empty/busy dan reload persistence terbukti.

### Gate 6 - Evidence dan Progress Sync

Setiap menu yang diubah wajib memiliki UI Responsibility Evidence dan Architecture Evidence BRVS.

| Evidence | Path | Result |
| --- | --- | --- |
| Route composer | `app/pages/...` | pass/gap |
| UI orchestrator | `app/components/pages/.../*Screen.vue` | pass/gap/N/A |
| Responsibility split | Header/Filters/Table/Form/Modal paths | pass/gap |
| Frontend application | `app/composables/...` | pass/gap |
| HTTP/domain/data | API + service + type + data | pass/gap |
| Persistence proof | request/reload | pass/not run/fail |
| Validation | commands/browser | pass/not run/fail |

Satu `gap` membatasi status menjadi `partial BRVS-UI` atau `implemented, verification pending`.

## 6. Catatan Perubahan dan Status Push Wajib

Setiap AI yang mengubah code, data, atau dokumentasi wajib mencatat perubahan di:

1. `docs/obsidian-vault/09-CHANGELOG.md`;
2. `AI_HANDOVER_GUIDE.md` bila keputusan/status arsitektur atau modul berubah;
3. matrix/status modul terkait bila evidence-nya berubah.

Gunakan format minimum berikut:

```text
Date:
Actor:
Scope:
Changed files:
Behavior/architecture changed:
Validation run:
Validation not run:
Feature/BRVS status:
Git branch:
Commit status: NOT COMMITTED | COMMITTED <hash>
Push status: NOT PUSHED | PUSHED | UNKNOWN
Remote verification: N/A | <remote>/<branch> = <hash>
Remaining risks:
```

Aturan status Git:

- default setelah edit adalah `NOT COMMITTED` dan `NOT PUSHED`;
- `COMMITTED` hanya boleh dicatat bila commit benar-benar dibuat;
- `PUSHED` hanya boleh dicatat setelah pengguna meminta push, `git push` berhasil, dan remote ref diverifikasi;
- commit lokal yang kebetulan sama dengan remote tidak membuktikan perubahan working tree sudah dipush;
- bila tidak boleh memeriksa remote, gunakan `UNKNOWN`, bukan menebak;
- AI dilarang menjalankan add/commit/push tanpa instruksi eksplisit pengguna.

## 7. Keputusan untuk Existing Workspace

File `*Workspace.vue` existing tidak otomatis salah, tetapi wajib diaudit sampai child component. Workspace besar yang masih memuat CRUD, table, modal, export, dan local success flow tidak boleh disebut selesai hanya karena page wrapper sudah 12-19 baris.

Contoh kandidat structural review saat standar ini dibuat:

- `KomponenMinimumWorkspace.vue`;
- `KertasJenisSelfWorkspace.vue`;
- `KertasGroupSelfWorkspace.vue`;
- `HargaJasaLainyaWorkspace.vue`.

Daftar tersebut adalah temuan audit, bukan instruksi untuk mengubahnya tanpa scope pengguna.
