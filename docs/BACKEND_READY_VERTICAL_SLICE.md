# Backend-Ready Vertical Slice (BRVS)

**Backend-Ready Vertical Slice (BRVS)** adalah nama resmi struktur menu Dulank Admin yang mengikuti pola Sales. Satu menu dibangun sebagai satu alur vertikal lengkap dari route sampai persistence, bukan sebagai halaman Vue besar yang kebetulan memiliki tampilan dan endpoint.

Dokumen ini adalah aturan struktur kanonik. Jika contoh lama di dokumen lain membolehkan `useFetch()` langsung di page atau logika domain besar di page, aturan BRVS ini yang berlaku.

Standar pemecahan UI yang melengkapi BRVS adalah [BRVS UI Decomposition Standard](UI_DECOMPOSITION_STANDARD.md). Page tipis tidak boleh dicapai dengan memindahkan monolit ke satu `*Workspace.vue`.

## 1. Rantai Wajib

```text
Route Page
  -> Domain Components
  -> Domain Composable / Editor Composable
  -> Nitro API
  -> Server Domain Service / Repository
  -> Typed Relational Data Source
  -> API Response
  -> Composable Refresh
  -> UI State
```

Shared component, composable, dan utility menjadi lapisan lintas vertical slice:

```text
app/components/Common/ + app/components/Sales/
app/composables/shared-or-cross-domain
app/utils/
server/utils/shared
```

Sebuah menu tidak boleh disebut **BRVS-compliant** hanya karena salah satu layer tersedia. Seluruh layer yang dibutuhkan flow harus terhubung dan dipakai oleh route aktif.

## 2. Kontrak Setiap Layer

### 2.1 Route Page: Composition Only

Lokasi: `app/pages/<route>.vue`.

Page hanya boleh:

- memanggil `useLegacyPage()` atau metadata route;
- memanggil domain composable/editor composable;
- menyimpan state koordinasi ringan seperti selected ID, modal open, atau active tab;
- menyusun domain/shared components;
- meneruskan props dan event;
- menentukan konfigurasi route-level yang sangat kecil.

Page dilarang:

- mendefinisikan interface/type domain lokal;
- menyimpan array record dummy atau default transaksi faktual;
- memanggil `$fetch()`/`useFetch()` langsung untuk data domain;
- berisi kalkulasi bisnis, validasi domain, penomoran, atau normalisasi payload;
- berisi markup tabel, card collection, form, modal, print document, atau skeleton yang panjang;
- membuat serializer CSV/Excel/PDF sendiri jika pola tersebut dapat direuse;
- memakai `alert()`, `confirm()`, timeout, atau perubahan state lokal sebagai bukti sukses;
- menduplikasi form Add dan Edit.

**Budget page:** target maksimal 150 baris. Page di atas 200 baris wajib dipecah atau diberi alasan arsitektural tertulis pada audit. Page di atas 300 baris otomatis **structural review required** dan tidak boleh diklaim BRVS-compliant sebelum tanggung jawabnya diperiksa. Jumlah baris adalah alarm, bukan satu-satunya penentu; satu pelanggaran hard rule tetap gagal meskipun page pendek.

### 2.2 Domain Components

Lokasi: `app/components/Pages/<menu>/`.

Pisahkan berdasarkan tanggung jawab nyata:

- `<Menu>RecordsTable.vue` atau domain card/list;
- `<Menu>Form.vue` / `<Menu>Editor.vue` yang dipakai Add dan Edit;
- `<Menu>DetailModal.vue`;
- `<Menu>HistoryModal.vue`;
- `<Menu>Stats.vue`;
- `<Menu>Filters.vue` bila toolbar domain kompleks;
- subform atau section dokumen yang memang besar.

Komponen menerima typed props dan mengirim typed emits. Komponen domain boleh mengelola interaction state yang murni presentasional, tetapi tidak boleh melakukan persistence atau mengarang data server.

Komponen masuk `app/components/Common/` atau `app/components/Sales/` hanya jika benar-benar reusable lintas menu. Jangan memindahkan komponen domain ke common hanya untuk mengosongkan page.

UI wajib dipecah menurut tanggung jawab nyata: Header/Actions, Stats, Filters, Table/Grid/List, Form/Editor, Detail/History/Modal, dan Feedback. `*Workspace.vue` atau `*Screen.vue` bersifat opsional dan hanya boleh menjadi orchestrator.

**Budget UI:** target Workspace/Screen maksimal 150 baris dan leaf component maksimal 250 baris. Workspace di atas 200 baris wajib decomposition audit; Workspace atau leaf component di atas 300 baris wajib structural review atau justifikasi satu tanggung jawab yang terdokumentasi. Page 12-19 baris dengan Workspace 300+ baris belum membuktikan UI terdekomposisi.

### 2.3 Domain Composable

Lokasi: `app/composables/use<Menu>.ts` dan, bila form kompleks, `use<Menu>Editor.ts`.

Composable wajib menjadi satu-satunya pintu frontend untuk:

- fetch data domain;
- pending/error/refresh;
- filter/query state yang dipakai lintas komponen;
- create/update/delete dan busy guard;
- pemetaan payload command;
- feedback yang menunggu response API;
- reload setelah mutasi sukses.

Perhitungan preview boleh ada di editor composable. Perhitungan otoritatif yang memengaruhi data tersimpan tetap dihitung ulang di server.

### 2.4 Domain Types

Lokasi: `server/types/<menu>.ts`.

Pisahkan bila diperlukan:

- entity/persistence model;
- create/update command;
- query/filter params;
- hydrated query model atau summary;
- nested line/item type.

Vue page tidak boleh membuat ulang interface yang sudah menjadi bagian kontrak server.

### 2.5 Nitro API: Thin HTTP Adapter

Lokasi: `server/api/<menu>/`.

API hanya menangani:

- query/path/body parsing;
- pemanggilan domain service/repository;
- pemetaan error ke status HTTP;
- response stabil `success`, `data`, `message`, dan `meta` bila perlu.

Filter kompleks, kalkulasi, ID generation, relasi, dan persistensi tidak boleh menumpuk di endpoint.

### 2.6 Server Domain Service / Repository

Lokasi: `server/utils/<menu>.ts`, `<menu>Data.ts`, atau repository yang setara.

Layer ini wajib memiliki:

- read/write terpusat;
- validasi domain dan foreign key;
- normalisasi command;
- kalkulasi otoritatif;
- ID/nomor dokumen yang aman;
- filter/query dan hydration relation;
- create/update/delete/soft-delete;
- perlindungan integritas data.

Migrasi JSON ke database harus cukup mengganti layer repository/service, bukan membongkar page dan komponen.

### 2.7 Data Source

Lokasi source: `server/data/<menu>.json`; runtime tetap mengikuti `server/utils/data.ts` dan kebijakan `data/`.

- memiliki primary key stabil;
- foreign key nyata, bukan label sebagai pengganti relasi;
- angka uang disimpan sebagai `number`;
- timestamp dan status lifecycle jelas;
- basename terdaftar di `server/utils/bundledData.ts`;
- GET tidak menulis atau melakukan seed runtime;
- JSON rusak menghasilkan error, bukan diganti diam-diam.

Data JSON adalah adapter sementara. Struktur harus siap dipetakan ke database relasional.

## 3. Add dan Edit Wajib Satu Implementasi

Route Add dan Edit boleh berbeda, tetapi form dan logic tidak boleh diduplikasi:

```text
add-<menu>.vue  ----\
                      -> <Menu>DocumentForm.vue -> use<Menu>Editor.ts
edit-<menu>.vue ----/
```

Create memakai default netral. Edit mengambil `id` route/query, memuat record server, dan mengisi form yang sama. Submit keduanya melewati composable dan API. Halaman `edit-payroll.vue` tidak boleh memiliki salinan form/kalkulasi yang berbeda dari `add-payroll.vue`.

## 4. Shared-First, Bukan Shared-Forced

Urutan keputusan:

1. Cari reusable yang sudah ada.
2. Jika fungsi sama dan kontraknya cocok, gunakan reusable tersebut.
3. Jika dipakai minimal dua menu dengan bentuk stabil, pindahkan ke shared layer.
4. Jika hanya milik satu domain, tetap di `components/Pages/<menu>/` atau composable domain.
5. Jangan membuat versi lokal untuk date range, table, action icon, currency, print, confirmation, feedback, atau dialog jika standar shared sudah ada.

## 5. Hard Fail Architecture Gate

Menu dinyatakan **BRVS non-compliant** bila salah satu kondisi berikut ada pada route aktif:

- record domain hardcoded di page;
- `alert()`/`confirm()` atau feedback timer menggantikan persistence;
- page memanggil API domain langsung;
- Add/Edit tidak memakai form/editor yang sama;
- mutasi hanya mengubah state lokal;
- endpoint memuat seluruh business rule dan persistence tanpa domain helper;
- tipe domain didefinisikan ulang di page;
- output turunan dijadikan input hanya untuk memudahkan dummy;
- komponen/shared layer yang tersedia dibuat ulang secara lokal;
- UI memakai composable/API lama tetapi route baru melewatinya dengan implementasi lokal.
- page dibuat tipis dengan memindahkan seluruh tanggung jawab ke satu Workspace/Screen monolitik;
- Workspace memegang table/grid, form, semua modal, export, dan mutation flow sekaligus;
- status verified diberikan hanya dari jumlah baris page atau HTTP 200 tanpa audit child components dan persistence.

## 6. Architecture Evidence Matrix

Setiap AI yang mengerjakan menu wajib mengisi bukti berikut sebelum menyebutnya mengikuti pola Sales:

| Layer | Path yang dipakai | Evidence flow | Result |
| --- | --- | --- | --- |
| Route composition | `app/pages/...` | Hanya compose/state ringan | pass/gap |
| UI responsibility split | `app/components/Pages/...` | Header/filter/table/form/modal terpisah sesuai tanggung jawab | pass/gap/N/A |
| Domain UI | `app/components/Pages/...` | Table/form/detail/modal | pass/gap/N/A |
| Frontend application | `app/composables/...` | Fetch/mutation/editor | pass/gap |
| Contract | `server/types/...` | Entity/command/query | pass/gap |
| HTTP adapter | `server/api/...` | Endpoint aktif | pass/gap |
| Domain server | `server/utils/...` | Validation/calculation/repository | pass/gap |
| Data | `server/data/...` + bundled registry | PK/FK/numeric/timestamp | pass/gap |
| Shared | common/sales/utils | Reusable existing dipakai | pass/gap/N/A |
| Persistence proof | request/reload test | Data tetap setelah reload | pass/not run/fail |

Satu `gap` pada layer wajib membuat status maksimal **partial BRVS** atau **implemented, architecture verification pending**.

## 7. Status Struktur

- **BRVS non-compliant:** route masih monolitik, lokal, palsu, atau melewati layer wajib.
- **Partial BRVS:** beberapa layer benar, tetapi page/server masih menanggung tanggung jawab layer lain.
- **BRVS implemented, verification pending:** seluruh layer tersedia dan terhubung secara statis; runtime/reload belum lengkap diuji.
- **BRVS verified:** architecture evidence lengkap dan flow runtime/reload dalam scope lulus.
- **Approved baseline:** hanya setelah persetujuan pengguna; bukan keputusan otomatis AI.

Status BRVS menilai struktur. Status fitur menilai kelengkapan flow. Keduanya harus dilaporkan terpisah.

## 8. Snapshot Audit 2026-10-08

Audit statis terhadap 188 file `app/pages/*.vue` menemukan indikator berikut:

- 129 page di atas 150 baris;
- 109 page di atas 200 baris;
- 65 page di atas 300 baris;
- 29 page di atas 400 baris;
- 59 page masih mengandung `alert()` atau `confirm()`;
- 111 page tidak memiliki import eksplisit dari `app/components/Pages/`.

Angka tersebut adalah indikator audit, bukan vonis otomatis karena auto-import dan bentuk route dapat berbeda. Namun hasilnya membuktikan bahwa struktur seluruh repo **belum** seragam seperti Sales.

| Route yang diperiksa | Temuan | Status struktur |
| --- | --- | --- |
| `/sales` | 139 baris; compose komponen domain, `useSalesPage()`, shared UI, API/data flow. | Acuan BRVS. |
| `/download-files` | 455 baris; type, composable, API, data, dan enam domain component tersedia, tetapi filter, mutation orchestration, toast, toolbar, skeleton, dan banyak markup tetap di page. | Partial BRVS. |
| `/all-blog` | 487 baris; type/composable/API/data tersedia, tetapi filter, card grid, export CSV, empty/error state, dan action UI menumpuk di page. | Partial BRVS. |
| `/expense-report` | 319 baris; composable/API/type/data dan shared UI tersedia, tetapi belum ada komponen domain dan kalkulasi/filter server masih berada langsung di endpoint. | Partial BRVS. |
| `/edit-payroll` | 460 baris; form dan perhitungan lokal, nilai contoh hardcoded, submit memakai `alert()` lalu redirect, tanpa persistence route aktif. | BRVS non-compliant. |
| `/edit-job-order` | 288 baris; array job/workflow hardcoded, mutasi lokal, `confirm()`/`alert()`, dan tidak memakai `useJobOrders()`/API yang sudah ada. | BRVS non-compliant. |

Audit ini tidak mengubah source code atau status fitur. Refactor dilakukan per menu saat pengguna memerintahkannya, dengan menjaga flow legacy dan perubahan pengguna yang sudah ada.

## 9. Checklist Singkat AI

Sebelum edit:

- petakan seluruh layer existing;
- tandai layer `missing`, `present-unused`, `present-wrong-responsibility`, atau `connected`;
- cari route Add/Edit pasangan dan reusable existing.

Sebelum selesai:

- page hanya composition;
- Workspace/Screen hanya orchestrator dan child component sudah dipetakan;
- tidak ada data domain atau sukses palsu di page;
- form Add/Edit satu sumber;
- composable adalah pintu frontend;
- API tipis;
- server service/repository memegang domain logic;
- type/data/bundled source lengkap;
- evidence matrix dan batas validasi dicatat.
- changelog mencatat commit status dan push status sesuai bukti remote.
