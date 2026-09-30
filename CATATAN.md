# CATATAN.md — Panduan Refactor Halaman untuk Junior Dev

> Dokumen ini adalah **peta kerja refactor "Legacy → Modern Nuxt"** untuk developer yang melanjutkan.
> Status: **186 halaman total — 61 halaman masih markup legacy (belum dikonversi), sisanya sudah modern.**
> Bacaan pendamping: `AGENTS.md` (konvensi kode) & `REVIEW.md` (analisis gap awal).

---

## 1. Daftar Halaman Yang BELUM Dikonversi (prioritas kerja)

Halaman berikut **masih memakai markup Bootstrap legacy** (`page-wrapper`, `ti ti-*`, `form-control`, `table datanew`, `modal fade`, dll.) — belum memakai blueprint modern. Klik untuk membuka file:

<details>
<summary>📄 61 halaman — belum dikonversi (klik untuk daftar)</summary>

- [account-statement.vue](app/pages/account-statement.vue) (117 baris)
- [add-product-process.vue](app/pages/add-product-process.vue) (242)
- [add-sales.vue](app/pages/add-sales.vue) (534)
- [address.vue](app/pages/address.vue) (324)
- [appearance.vue](app/pages/appearance.vue) (178)
- [balance-account.vue](app/pages/balance-account.vue) (196)
- [balance-sheet.vue](app/pages/balance-sheet.vue) (190)
- [ban-ip-address.vue](app/pages/ban-ip-address.vue) (252)
- [bank-account.vue](app/pages/bank-account.vue) (239)
- [best-seller.vue](app/pages/best-seller.vue) (151)
- [billing.vue](app/pages/billing.vue) (253)
- [blog-comment.vue](app/pages/blog-comment.vue) (147)
- [blog-tag.vue](app/pages/blog-tag.vue) (308)
- [company-setting.vue](app/pages/company-setting.vue) (197)
- [custom-field.vue](app/pages/custom-field.vue) (361)
- [delete-account.vue](app/pages/delete-account.vue) (144)
- [district.vue](app/pages/district.vue) (271)
- [download-files.vue](app/pages/download-files.vue) (275)
- [edit-job-order.vue](app/pages/edit-job-order.vue) (239)
- [email-setting.vue](app/pages/email-setting.vue) (275)
- [footer.vue](app/pages/footer.vue) (272)
- [gdpr-settings.vue](app/pages/gdpr-settings.vue) (170)
- [harga-jasa-lainya.vue](app/pages/harga-jasa-lainya.vue) (305)
- [income-category.vue](app/pages/income-category.vue) (289)
- [input-tax.vue](app/pages/input-tax.vue) (230)
- [invoice-report.vue](app/pages/invoice-report.vue) (198)
- [invoice-setting.vue](app/pages/invoice-setting.vue) (187)
- [job-progress.vue](app/pages/job-progress.vue) (159)
- [komponen-fiks.vue](app/pages/komponen-fiks.vue) (240)
- [komponen-minimum.vue](app/pages/komponen-minimum.vue) (251)
- [language.vue](app/pages/language.vue) (265)
- [localization.vue](app/pages/localization.vue) (373)
- [mesin-cetak-self.vue](app/pages/mesin-cetak-self.vue) (329)
- [mesin-laminasi-self.vue](app/pages/mesin-laminasi-self.vue) (312)
- [mesin-poli-self.vue](app/pages/mesin-poli-self.vue) (301)
- [mesin-pond-self.vue](app/pages/mesin-pond-self.vue) (318)
- [otp.vue](app/pages/otp.vue) (132)
- [our-client.vue](app/pages/our-client.vue) (200)
- [output-tax.vue](app/pages/output-tax.vue) (285)
- [payment-gateway.vue](app/pages/payment-gateway.vue) (183)
- [permissions.vue](app/pages/permissions.vue) (187)
- [pos-order.vue](app/pages/pos-order.vue) (320)
- [pos-settings.vue](app/pages/pos-settings.vue) (139)
- [preference.vue](app/pages/preference.vue) (81)
- [prefixes.vue](app/pages/prefixes.vue) (133)
- [printer-settings.vue](app/pages/printer-settings.vue) (205)
- [product-report.vue](app/pages/product-report.vue) (132)
- [profile.vue](app/pages/profile.vue) (183)
- [province.vue](app/pages/province.vue) (238)
- [regency.vue](app/pages/regency.vue) (268)
- [role-permissions.vue](app/pages/role-permissions.vue) (186)
- [role.vue](app/pages/role.vue) (206)
- [security-settings.vue](app/pages/security-settings.vue) (363)
- [semua-percetakan.vue](app/pages/semua-percetakan.vue) (420)
- [semua-toko-kertas.vue](app/pages/semua-toko-kertas.vue) (391)
- [sms-gateway.vue](app/pages/sms-gateway.vue) (166)
- [social-authentication.vue](app/pages/social-authentication.vue) (334)
- [storage-settings.vue](app/pages/storage-settings.vue) (188)
- [support-ticket-detail.vue](app/pages/support-ticket-detail.vue) (165)
- [system-setting.vue](app/pages/system-setting.vue) (344)
- [ticket-detail.vue](app/pages/ticket-detail.vue) (165)

</details>

**Urutan yang disarankan** (dari yang paling sering dilihat/ringan menuju berat):

| Fase | Halaman | Alasan |
|---|---|---|
| 1 — Ringan & settings | `preference`, `pos-settings`, `prefixes`, `otp`, `product-report`, `invoice-report`, `balance-account`, `balance-sheet`, `account-statement`, `best-seller`, `gdpr-settings`, `input-tax` | <150 baris, pola list sederhana |
| 2 — Settings (grup) | `company-setting`, `email-setting`, `invoice-setting`, `printer-settings`, `language`, `localization`, `security-settings`, `storage-settings`, `system-setting`, `payment-gateway`, `sms-gateway`, `social-authentication`, `permissions`, `role`, `role-permissions` | pola form/settings berulang |
| 3 — Master data | `district`, `province`, `regency`, `bank-account`, `income-category`, `blog-comment`, `blog-tag`, `our-client`, `custom-field`, `delete-account`, `download-files`, `billing` | list + modal |
| 4 — Bisnis utama | `address`, `add-sales`, `edit-job-order`, `pos-order`, `job-progress`, `bank-account`, keuangan: `balance-account`, `output-tax` — plus `harga-jasa-lainya`, `komponen-fiks`, `komponen-minimum` (domain cetak) | halaman besar/gemuk |
| 5 — Mesin self & direktori | `mesin-cetak-self`, `mesin-laminasi-self`, `mesin-pond-self`, `mesin-poli-self`, `semua-percetakan`, `semua-toko-kertas`, `support-ticket-detail`, `ticket-detail` | ada kalkulasi/CRUD atau tabel besar |
| 6 — Sisa | `add-product-process`, `appearance`, `ban-ip-address`, `profile`, `footer`, `custom-field`, `role` | penyelesaian akhir |

---

## 2. Halaman yang SUDAH Modern (jangan dikerjakan ulang)

~125 halaman sudah memakai blueprint modern (`CommonPageHeader` + komponen `Common*`/`Forms*`/`Tables*`).

Terdapat beberapa halaman **ber-Tailwind tanpa `CommonPageHeader`** — ini **bukan prioritas konversi**, hanya perlu pengecekan kecil bila ada sisa marker minor (icon font `feather-*`/`ti ti-*` yang tampil kosong):

- Dashboard besar (sudah Tailwind manual): [index.vue](app/pages/index.vue), [pos.vue](app/pages/pos.vue), [sales-dashboard.vue](app/pages/sales-dashboard.vue), [analytics-dashboard.vue](app/pages/analytics-dashboard.vue), [kalkulator-dashboard.vue](app/pages/kalkulator-dashboard.vue), [subscriptions.vue](app/pages/subscriptions.vue), [cash-flow.vue](app/pages/cash-flow.vue)
- Halaman auth (layout `auth`): [signin.vue](app/pages/signin.vue), [forgot-password.vue](app/pages/forgot-password.vue)
- Halaman detail/cetak (print document, sengaja tanpa header list): [invoice-details.vue](app/pages/invoice-details.vue), [quotation-detail.vue](app/pages/quotation-detail.vue), [request-quotation-detail.vue](app/pages/request-quotation-detail.vue), [job-order-detail.vue](app/pages/job-order-detail.vue), [delivery-note-detail.vue](app/pages/delivery-note-detail.vue), [payslip-detail.vue](app/pages/payslip-detail.vue), [sales-note.vue](app/pages/sales-note.vue), [sales-receipt.vue](app/pages/sales-receipt.vue), [profit-and-loss.vue](app/pages/profit-and-loss.vue), [my-job.vue](app/pages/my-job.vue), [blank.vue](app/pages/blank.vue), [cetak-full-colorbekup.vue](app/pages/cetak-full-colorbekup.vue)

---

## 3. Blueprint Konversi (pola yang WAJIB diikuti)

Setiap halaman legacy dikonversi ke struktur berikut:

```html
<!-- 1. Header -->
<CommonPageHeader title="..." subtitle="...">
  <template #actions>
    <!-- tombol ikon (pdf/printer/refresh) + tombol Add (bg-primary) -->
  </template>
</CommonPageHeader>

<!-- 2. Stat cards (bila ada KPI) -->
<CommonStatCard label="..." :value="..." icon="..." tone="..." />

<!-- 3. Kartu tabel -->
<div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
  <!-- Toolbar: <CommonSearchFilter v-model="searchQuery" /> + <CommonFilterSelect v-model="..." :options="..." /> -->
  <!-- Tabel Tailwind: thead bg-gray-50, tbody divide-y, sel px-4 py-3 whitespace-nowrap -->
  <!-- Badge status: <CommonStatusPill :status="..." /> — aksi: <CommonRowActions :item="item" show-view @view @edit @delete> + slot #extra -->
</div>

<!-- 4. Modal -->
<CommonBaseModal v-model="..." :title="..." maxWidth="sm|md|lg|xl|2xl">
  <form @submit.prevent="..."> <CommonFormField label="..."> <input .../> </CommonFormField> <CommonModalFooter @cancel="..." /> </form>
</CommonBaseModal>
```

### Komponen yang tersedia (auto-import, nama = path + file)
| Komponen | Dipakai untuk |
|---|---|
| `CommonFeatherIcon` | semua ikon (jangan pakai `ti ti-*`/`feather-*` — mati) |
| `CommonPageHeader` / `CommonSearchFilter` / `CommonFilterSelect` / `CommonStatusPill` / `CommonRowActions` / `CommonFormField` / `CommonModalFooter` / `CommonToggleSwitch` / `CommonStatCard` / `CommonBaseModal` / `CommonConfirmModal` | pola halaman list/form |
| `FormsNumberInput` / `FormsAddressCascader` / `Forms*LiveSearch` / `TablesDataTable` | input khusus & tabel canggih |

### ⚠️ ATURAN PENTING (pelajaran dari proses refactor)

1. **Script <script setup lang="ts"> WAJIB diambil VERBATIM dari versi lama**, lalu di-`diff` terhadap `git show HEAD:app/pages/<file>` — **jangan menebak ulang handler** (pengalaman: `crudForm.id`, `saveItem`, `form.gsm`, `viewItem` vs `viewDetail`, dll. sering berbeda & ketahuan baru saat typecheck).
2. **`useMockSync('slug', dataRef)` harus BERADA DI DALAM `<script>`** — banyak halaman hasil migrasi data punya baris sync yang nyasar di luar `</script>`; pindahkan ke dalam saat mengonversi.
3. **Data mock JANGAN dikembalikan ke halaman** — data sudah di `server/data/*.ts`, halaman memakai `useFetch('/api/<slug>')` + `useMockSync`. Lihat `AGENTS.md` → "Data & API layer".
4. **Perilaku aneh legacy tetap dipertahankan** selama tidak berubah: `alert()`, `prompt()`, `confirm()` untuk view/update, `deleteX(idx)` berbasis index, select-inline-per-baris, dsb. Refactor template, bukan logika.
5. **Dropdown Bootstrap (`data-bs-toggle="dropdown"`) TIDAK berfungsi** (Bootstrap JS tidak di-load) → ganti dengan `<CommonFilterSelect>` atau select native bergaya Tailwind.
6. **Halaman `-self` & `-bekup` jangan dihapus/rename** — sidebar menautkan `-self`; `-bekup` = backup (re-export). Lihat AGENTS.md.
7. **JANGAN sentuh**: 186 file `*.html` di root, `app/components/{sidebar,header,bekup}.html` — referensi legacy.
8. Gunakan `<script setup lang="ts">` + **interface di `shared/types/`** (bukan inline di halaman).

---

## 4. Ritual Verifikasi (wajib setiap batch)

```bash
npx nuxi prepare                  # regenerate auto-import/types (penting setelah pindah file)
npm run typecheck                 # baseline ±99 error (semua TS2322/2532 adalah utang pra-eksisting mock-literal — JANGAN diperbaiki massal)
npm run build                     # gate utama (template error/komponen tak ter-resolve tertangkap di sini)
# smoke test dev:
npm run dev
curl -s localhost:3000/<page> | grep -c "<data-atau-text-penting>"   # pastikan SSR merender data
```

- Setelah edit template, **selalu cek `git diff` script vs HEAD** dan **typecheck** sebelum commit.
- Commit per batch (±3 halaman) dengan pesan berformat:
  `refactor(legacy→modern): <nama halaman> — ringkasan; Progress legacy→modern: X halaman`

---

## 5. Status Keluarga (yang sudah tuntas)

| Keluarga | Status |
|---|---|
| purchase* (9), kertas* (8), mesin-cetak/laminasi/pond/poli vendor (4), flow* (4), report* (10), payments/payment-in/out (3) | ✅ selesai |
| bank-settings*, customers, expenses, voucher, sales-return, ticket/support-ticket, user* , orders* , job-branch/job-list/my-job, banner/coupon/cart/wishlist/checkout/reviews/contact-form, faq/blog-*, discount/discount-plan, unit/category/sub-category/variant/designation/department | ✅ selesai |
| **mesin-*-self (4), semua-percetakan, semua-toko-kertas, harga-jasa-lainya, komponen-*** | ⏳ di daftar belum dikonversi (Fase 5) |

---

## 6. Rujukan

- `AGENTS.md` — konvensi kode, struktur app/server/shared, komponen, mock server, Tailwind v4
- `REVIEW.md` — analisis gap legacy→Nuxt awal & backlog (date picker P0, rich text P0, DataTable P1, modal unifikasi P1)
- `server/data/*.ts` & `server/api/[...mock].ts` — lapisan mock data (jangan diedit untuk "memperbaiki" tampilan)