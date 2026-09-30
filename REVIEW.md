# REVIEW — Analisis Gap: Legacy HTML → Nuxt 3

**Branch:** `review` · **Tanggal:** 2026-09-29 · **Status:** analisis gap, belum ada perbaikan kode

> ## UPDATE — Refactor Nuxt 4 (branch `refactor/nuxt4`, selesai 2026-09-29)
>
> Dokumen ini adalah analisis gap. Refactor ke Nuxt 4 sudah dieksekusi di branch `refactor/nuxt4` (7 commit step-by-step):
>
> | Step | Isi | Status |
> |---|---|---|
> | 1 | Upgrade Nuxt 4.5.2, vue 3.5.43, vue-router 5.3.1, pinia 4, tailwind module 7-beta | ✅ |
> | 2 | Struktur `app/` (git mv, history aman), `server/` + `shared/`, alias `.html` tetap jalan | ✅ |
> | 3 | Tailwind v4 CSS-first (`@theme` + `@custom-variant dark`), `tailwind.config.ts` dihapus | ✅ |
> | 4 | Komponen auto-import ber-prefix path (`Common/Forms/Tables/Dashboard/App…`), plugin feather global dihapus | ✅ |
> | 5 | 147 interface dipisah ke `shared/types/` (18 file per domain, auto-import, konflik nama di-rename) | ✅ |
> | 6 | Composables `usePrint`/`useModal`, audit 100% `<script setup lang="ts">`, script `typecheck` | ✅ |
> | 7 | Verifikasi: build, typecheck (0 unresolved name), dev server — `/`, `/sales.html`, `/api/health` 200 | ✅ |
>
> **Gap yang teratasi oleh refactor ini:** struktur direktori, auto-import komponen, pemisahan interface, Tailwind v4.
> **Tetap backlog (dari dokumen ini):** date picker P0, rich-text editor P0, migrasi tabel inline → `<TablesDataTable/>` P1, unifikasi modal (`useModal`), live search & NumberInput perluasan, theme customizer UI.
> **Utang baru tercatat:** ~103 error TS pra-eksisting (TS2322/TS2532); typecheck debt.
>
> ---

Proyek ini adalah migrasi admin template statis (Bootstrap 5 + jQuery + DataTables) ke Nuxt 3 + Tailwind CSS. Dokumen ini membandingkan **186 file `*.html` legacy di root** dengan **186 file `pages/*.vue`**, memetakan fitur yang berhasil diport, yang hilang, dan yang berubah perilaku.

---

## 1. Ringkasan eksekutif

- ✅ **Cakupan halaman lengkap**: semua 186 halaman legacy punya pasangan `.vue` (1:1), termasuk alias rute `.html` via hook `pages:extend` di `nuxt.config.ts`.
- ✅ **Arsitektur membaik drastis**: 130.701 baris HTML legacy (boilerplate header/sidebar/modal digandakan di tiap halaman) → 58.103 baris Vue, dengan layout bersama (`layouts/`) dan komponen reusable (`DataTable`, `BaseModal`, `FeatherIcon`, live-search).
- 🔴 **Gap terbesar: input tanggal.** 174/186 halaman legacy pakai datetimepicker (format `DD-MM-YYYY`); hanya 19 halaman Nuxt yang pakai `type="date"` native (format `YYYY-MM-DD`, bertabrakan dengan `formatDate` yang menampilkan `DD/MM/YYYY`).
- 🔴 **Gap besar: rich-text editor.** 86 halaman legacy pakai Summernote; di Nuxt hanya `<textarea>` polos (33 halaman) tanpa editor.
- 🟠 **Gap sedang: DataTable/pagination.** 109 halaman legacy pakai jQuery DataTables (`table datanew`: pagination, page-size 10/25/50/100, "Showing X to Y of Z"); hanya 7 halaman Nuxt pakai komponen `<DataTable>` — ~125 halaman lainnya render tabel inline **tanpa pagination** (search live saja).
- 🟠 **Gap sedang: modal.** 16 halaman kehilangan seluruh modal yang ada di legacy; 70 halaman Nuxt tidak punya modal sama sekali (sebagian memang halaman form/detail yang wajar, sebagian tidak).
- 🟡 **Gap kecil tapi nyata**: select2/live-search parsial (23 → ~10 halaman), number separator (56 → 6), UI theme-customizer hilang (state ada, UI tidak), loader hilang (186 → 4), atribut `data-bs-toggle` mati di 33 halaman Nuxt (Bootstrap JS tidak di-load).

---

## 2. Metodologi

Analisis dilakukan dengan skrip scan statis (grep/regex) atas kedua set file:

| Sinyal | Legacy | Nuxt |
|---|---|---|
| Modal trigger (`data-bs-toggle="modal"`) | 1.485 | — |
| Modal dialog (`class="modal ..."`) | 1.627 | 799 (`class="modal fade show d-block"` inline) + 109 `BaseModal` + 2 `ConfirmModal` |
| Tabel (`<table>`) | 316 | 160 |
| Init jQuery DataTables | 27 (109 halaman `table datanew`) | 7 (`<DataTable>`) |
| Init select2 | 10 halaman | 0 (pakai `<select>` native, 249 kemunculan) |
| datetimepicker | 174 halaman | 19 halaman `type="date"` |
| Summernote | 86 halaman | 0 |
| window.print() | 17 halaman | 112 halaman |
| Init Chart.js | 2 halaman | 0 (chart SVG manual) |
| Modal confirm (Swal.fire / confirm) | 6 halaman | `ConfirmModal` 2 halaman + `confirm()` manual 78 halaman |
| File yang di-include liveSearch.js | 23 halaman | komponen live-search 10 halaman |
| easy-number-separator | 56 halaman | `NumberInput` 6 halaman |
| Loader/markup loading | 186 halaman | 4 halaman |

Catatan metodologi: hitungan legacy over-count karena tiap halaman meng-embed seluruh asset & modal; perbandingan di atas dipakai sebagai sinyal, bukan ukuran mutlak. Setiap klaim berikut diverifikasi manual pada file sampel.

---

## 3. Yang sudah terpindahkan dengan baik (parity)

| Fitur | Legacy | Nuxt | Catatan |
|---|---|---|---|
| Navigasi sidebar & highlight rute aktif | script.js auto-highlight URL | `AppSidebar.vue` (`isChildActive`/`isParentActive`, termasuk kecocokan `path.html`) | ✅ baik |
| Dark mode + persistensi | script.js ("DarkMode with LocalStorage") | `stores/theme.ts` (attribut `data-layout-mode` + localStorage `theme`) | ✅ baik |
| Sidebar collapse & mobile | script.js (Sidebar Toggle) | `stores/theme.ts` + `AppSidebar` | ✅ baik |
| Print / PDF | 17 halaman `window.print()` (tombol "Pdf" = label dekoratif, tanpa PDF nyata) | 112 halaman `window.print()` | ✅ justru lebih luas; tombol PDF juga tetap dekoratif (parity) |
| Rupiah/number/date formatting | easy-number-separator + inline JS | `useFormatters()` (`formatRupiah`, `parseNumber`, `formatDate`) | ✅ terpusat |
| Kalkulasi profit mesin/perset/kertas | script.js + tabel harga | `useProfitCalculation()` dipakai halaman mesin-*/kertas-*/kalkulator-dashboard | ✅ terpusat |
| Search tabel live | DataTables search | filter `computed` inline per halaman | ⚠️ tanpa pagination (lihat §4.3) |
| Area/donut chart dashboard | Chart.min.js (2 halaman) | SVG manual (sales-dashboard, cash-flow, kalkulator-dashboard) | 🟡 parity fungsional dasar, visual beda |

---

## 4. Gap fungsional utama

### 4.1 🔴 Date picker — gap terluas (174 → 19 halaman)

- **Legacy**: `.datetimepicker` di 174 halaman; inisialisasi global di `assets/js/script.js:280` (bootstrap-datetimepicker, format tampil `DD-MM-YYYY`, value teks).
- **Nuxt**: 19 halaman pakai `<input type="date">` native (format `YYYY-MM-DD`). Halaman lain tanpa kontrol tanggal sama sekali atau input teks bebas.
- **Bentrok format**: `useFormatters.formatDate()` menampilkan `DD/MM/YYYY` (mis. `15/01/2023` di data mock), sedangkan `type="date"` memakai standar ISO — data mock dan input tidak konsisten (contoh: `pages/add-employee.vue` menyimpan `new Date().toISOString().split('T')[0]`).
- **Rekomendasi**: buat komponen `DateInput.vue` (wrapper date picker konsisten `DD/MM/YYYY` + parse via `parseDate`) dan ganti seluruh `type="date"` + input teks tanggal.

### 4.2 🔴 Rich-text editor hilang (86 → 0 halaman)

- 86 halaman legacy (add-quotation, all-blog, appearance, faq, dst.) pakai Summernote untuk deskripsi/isi konten.
- Nuxt hanya `<textarea>` polos (33 halaman). Tidak ada editor WYSIWYG.
- **Rekomendasi**: komponen `RichTextEditor.vue` (TipTap atau sejenisnya) — hindari meng-import summernote jQuery ke Nuxt.

### 4.3 🟠 Tabel: pagination & fitur DataTable hilang di ~125 halaman

- Legacy: 109 halaman `table datanew` → jQuery DataTables (pagination 10/25/50/100, sort, search, "Showing X to Y of Z", kolom aksi).
- Nuxt: hanya 7 halaman pakai `<DataTable>` (delivery-note, invoice, job-order, quotation, request-quotation, sales, work-flow). ~125 halaman memakai `<table>` inline: search live ada, **semua baris dirender tanpa pagination** (contoh diverifikasi: bank-account, expenses, account-statement).
- `employees.vue` bahkan sudah tidak berbentuk tabel — diganti card grid (redesign, bukan gap, tapi perlu dikonfirmasi ke stakeholder).
- `DataTable` komponen sudah emit `print`/`export-pdf`/`export-excel` tapi tidak ada satu pun halaman yang menangani export — tombol "PDF"/"Excel" di header hanya `window.print()`.
- **Rekomendasi**: migrasi bertahap tabel inline → `<DataTable>` (dimulai dari halaman dengan data terbanyak: payment-inflow, customer-report, sales-report, purchase, dll).

### 4.4 🟠 Modal hilang di 16 halaman

Halaman dengan modal di legacy tapi **nol referensi modal di Nuxt** (angka = jumlah dialog `class="modal` di legacy):

| Halaman | Dialog legacy | Halaman | Dialog legacy |
|---|---|---|---|
| calender | 28 | mesin-cetak | 14 |
| create-product | 32 | cart | 14 |
| add-work-flow | 14 | edit-work-flow | 14 |
| wishlist | 14 | kertas-group / -harga / -jenis / -ukuran | 7 tiap |
| mesin-laminasi / -poli / -pond | 7 tiap | support-ticket | 7 |

Catatan: untuk `kertas-*` & `mesin-*`, halaman non-`-self` di Nuxt tampil read-only; interaksi modal dipertahankan di varian `-self` (22 ref modal di `kertas-ukuran-self.vue` dll) — **bukan** gap penuh, tapi duplikasi antar varian perlu diaudit. `calender.vue` (331 baris, 9 tab tabbed settings) dan `create-product.vue` adalah kasus nyata fitur modal yang hilang.

### 4.5 🟠 Pola modal tidak konsisten — 3 implementasi berbeda

1. `class="modal fade show d-block"` inline dengan `v-if` (799 kemunculan) — meniru markup Bootstrap 5 modal secara manual;
2. `BaseModal.vue` (109) — komponen reusable tapi styling/API-nya harus sejalan dengan pola #1 agar tidak ada dua tampilan;
3. `ConfirmModal.vue` — hanya dipakai 2 halaman (kalkulator-dashboard, subscriptions); 78 halaman lain memakai `confirm()` browser untuk hapus.

Tidak ada `v-model`/protocol bersama untuk buka-tutup modal; tiap halaman mendefinisikan variabel sendiri (`isAddModalOpen`, `showEditModal`, `customerModalVisible`, dst — 369 kemunculan).

### 4.6 🟠 Searchable select & live search parsial (23 → ~10 halaman)

- Legacy: select2 (searchable select) di 10 halaman + `liveSearch.js` di 23 halaman (customer/product/employee/company search: add-purchase, add-sales, sales, purchase, orders, balance-account, dst).
- Nuxt: komponen `CustomerLiveSearch`/`ProductLiveSearch`/`EmployeeLiveSearch` hanya di ~10 halaman (add-quotation, edit-quotation, pos, add-payroll, cash-advance, employee-salary, incentive, add-work-flow, add-employee, edit-employee). Halaman seperti add-purchase, add-sales, sales, purchase, balance-account, delivery-note, job-list, orders, quotation, request-quotation, sales-return **kehilangan live search**.
- Select lainnya memakai `<select>` native tanpa search.

### 4.7 🟡 Number-input separator parsial (56 → 6 halaman)

- Legacy: `easy-number-separator.js` di 56 halaman (format ribuan otomatis saat mengetik).
- Nuxt: `NumberInput.vue` hanya di 6 halaman (add-payroll, edit-payroll, cash-advance, create-product, employee-salary, incentive). Halaman kertas-harga/mesin/harga jasa pakai input teks polos.
- Sebagian input sudah diformat lewat `formatRupiah` di tampilan, tapi input mentah belum konsisten.

### 4.8 🟡 Theme customizer tidak ada UI-nya

- Legacy: `theme-script.js` + panel settings (layout box/horizontal/modern, RTL, gaya header) yang bisa dibuka user.
- Nuxt: `stores/theme.ts` menyimpan `layoutStyle`, `direction`, `isCustomizerOpen`, `isMobileSidebarOpen` — **tidak ada komponen UI yang membaca/menulis state ini** (grep: nol pemakaian di components/pages).
- `direction` RTL didukung CSS (`[dir="rtl"]` di main.css) tapi tidak ada toggle.

### 4.9 🟡 Atribut Bootstrap mati di halaman Nuxt

- `data-bs-toggle="tooltip"` (dan `data-bs-*` lain) masih ada di 33 halaman Nuxt, tapi Bootstrap JS tidak di-load — tooltip/dropdown tidak berfungsi. Class legacy lainnya (`form-control`, `col-6`, `login-wrapper`) pada beberapa halaman (mis. `signin.vue`) tidak memiliki CSS karena `assets/css/style.css`/`bootstrap.css` tidak di-register.

### 4.10 🟡 Lain-lain

- **Loader**: markup loader ada di 186 halaman legacy, hanya 4 halaman Nuxt punya indikator loading.
- **script.js (2.981 baris)**: perilaku yang belum diport — sidebar slimscroll/sticky, card fullscreen/close, tooltips, counter/animasi angka, countdown, clipboard, chat behavior, "Toggle freeze days input based on action type" (logika workflow; 'freeze' hanya muncul di 4 halaman Nuxt).
- **Summernote/moment/datatable assets**: `assets/` berisi bundle legacy (bootstrap.css, style.css, jQuery, DataTables, select2, dsb.) yang **tidak di-load sama sekali** — jangan dijadikan solusi; port fitur, bukan asset.

---

## 5. Gap teknis / arsitektur

| # | Temuan | Dampak |
|---|---|---|
| 1 | Tiga pola modal berbeda (inline bootstrap-class, BaseModal, ConfirmModal) | Konsistensi UI & biaya perawatan |
| 2 | 125 tabel inline tanpa pagination vs komponen DataTable | Performa render (semua baris) + UX (tidak ada "entries per page") |
| 3 | `useFormatters()` jarang dipakai halaman baru (banyak string harga hardcoded, mis. `index.vue` "Rp48.988.078") | Inconsistensi format & sulit ubah |
| 4 | State theme customizer tanpa konsumen | Dead code / fitur hilang |
| 5 | Peta rute `.html` alias (hook `pages:extend`) | Jangan dihapus — legacy links & sidebar depend on it (lihat AGENTS.md) |
| 6 | File legacy root (186 `*.html`) & `components/*.html` masih tracked | Sumber referensi migrasi; jangan diedit (lihat AGENTS.md) |
| 7 | Nama `-self`/`-bekup` menimbulkan duplikasi halaman (mis. kertas-* vs kertas-*-self; cetak-full-colorbekup = re-export) | Audit mana yang jadi sumber kebenaran |

---

## 6. Masalah kualitas data (bukan gap migrasi, tapi harus disadari)

- Semua data adalah **mock hardcoded** di `<script setup>` (employees, customers, sales, dll.). Tidak ada layer API/store data — setiap integrasi backend akan menyentuh hampir semua halaman.
- ID data mock tidak unik/terstruktur (contoh: semua employee pakai pola "ST00x") — tidak ada "source of truth" untuk referensi antar halaman.
- Bahasa campur (label Inggris, field bisnis Indonesia) — belum ada i18n (modul i18n tidak terpasang; `locales/en/common.json` tidak terpakai).

---

## 7. Prioritas rekomendasi

1. **P0 — DateInput**: komponen date picker konsisten + migrasi 174 halaman (gap terluas, bentrok format).
2. **P0 — RichTextEditor**: komponen editor untuk 33+ halaman textarea (quotation/blog/faq).
3. **P1 — DataTable migration**: ganti tabel inline tanpa pagination; implementasikan handler export-pdf/export-excel yang sudah di-emit komponen.
4. **P1 — Modal unifikasi**: satu pola modal (BaseModal), port modal yang hilang di 16 halaman (prioritas create-product, calender, add-/edit-work-flow).
5. **P2 — Live search & NumberInput** perluasan ke halaman yang di legacy memakainya.
6. **P2 — Theme customizer UI** (state sudah siap) atau hapus state mati.
7. **P2 — Bersihkan atribut mati** (`data-bs-*`, class legacy) dan standardisasi via `useFormatters`.

---

## 8. Cara memverifikasi ulang

Analisis ini statis (grep). Untuk konfirmasi perilaku:
```bash
npm run dev   # bandingkan halaman legacy .html (alias rute) vs .vue secara visual, mis. /calender.html vs /calender
```
File pendukung scan ada di `/tmp/legacy2.txt`, `/tmp/nuxt2.txt` (format `nama|modal|...|baris`).