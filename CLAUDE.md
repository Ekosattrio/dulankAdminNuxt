# CLAUDE.md - Dulank Admin Nuxt 4 Guidance for AI Assistants

You are working on **Dulank Admin Nuxt 4**, a modern ERP & printing administration system migrated from legacy Bootstrap HTML to Nuxt 4 + Vue 3 + TypeScript + Tailwind CSS 4.

> **CRITICAL INSTRUCTION FOR AI:**
> Before modifying or creating any code, you MUST follow the architectural blueprint in `AGENTS.md` and `docs/STRUCTURE.md`.
> Pola revisi menu **Sales**, **Payment**, **Orders**, dan **Webstore** yang sudah disetujui menjadi batas regresi mutlak.

---

## 1. Quick Technical Blueprint

| Layer | Responsibility & Paths |
|---|---|
| **Pages (Thin)** | `app/pages/<route>.vue` - Only coordinates metadata, composable, and mounts components. |
| **Domain Components** | `app/components/pages/<menu>/` - Tables, modals, filters, and widgets for specific domains. |
| **Shared Components** | `app/components/sales/` and `app/components/common/` - Shared UI (`SalesDataTable`, `DateRangePicker`, `TableFilterSelect`, `DocumentPrintModal`, `CurrencyDisplay`). |
| **State & API** | `app/composables/use<Menu>.ts` - Form state, validation, fetch, and mutations. |
| **Backend Layer** | `server/api/`, `server/types/`, `server/utils/`, `server/data/` - Pure REST API, domain types, mock DB data. |
| **Legacy HTML** | `legacy/static-source/<menu>.html` - Absolute single source of truth for literal labels, inputs, modals, and flow. |

---

## 2. The 8 Golden Rules (HARD CONSTRAINTS - NEVER VIOLATE)

1. **DO NOT Empty/Truncate Files (No 0-byte Files):**
   - Always verify files exist and contain valid code. Never write empty strings or truncate active files.
2. **DO NOT Touch or Delete `legacy/static-source/`:**
   - Legacy HTML, CSS, images, and fonts are the permanent visual and functional reference (`https://dulank-admin.netlify.app/`).
3. **DO NOT Mutate User Runtime Data or Wipe JSON:**
   - Treat empty arrays as valid data. Never replace user data with fake seeds on GET requests.
4. **Pure Numeric Currency (NO Static Formatted Strings in Data):**
   - Prices, discounts, totals, and fees MUST be stored as pure numbers (`number`, e.g., `250000`), NEVER static strings like `"250.000"` or `"Rp 250.000"`.
   - Display formatting MUST use `<CurrencyDisplay :value="val" align="right" />` or `formatIDR(val)`.
5. **Single Card Rule (NO Double Card Nesting):**
   - `SalesDataTable.vue` already has its own card container (border, background, rounded corners).
   - NEVER wrap `SalesDataTable.vue` inside an additional `<div class="card">...</div>`.
6. **Strict Dimensions:**
   - Toolbar controls, inputs, and filter selects MUST use standard height `h-9` (36px).
   - Multi-tag selects use `min-h-9` (36px).
   - Modal forms use pure 12-column CSS Grid: `modalFormRowClass`, `modalFormLabelClass` (col-span-5), `modalFormInputColClass` (col-span-7).
7. **Standardized Print & Export PDF:**
   - For lists/tables, NEVER call raw `window.print()`.
   - Use `DocumentPrintModal.vue` and `app/utils/documentPrinter.ts` (isolated iframe with official Dulank letterhead Kop Surat and TTD signatures).
   - Exception document pages (`sales-receipt.vue`, `sales-note.vue`, SPK ticket `printJobDetailTicket`) keep their dedicated layouts.
8. **Git Safety:**
   - NEVER run mutating Git commands (`git add`, `git commit`, `git checkout`, `git reset`, `git push`, etc.) unless explicitly instructed by the user.

---

## 3. Workflow When Given: "Kerjakan Menu <Nama-Menu>"

1. **Find Legacy Reference:**
   - Locate `legacy/static-source/<menu>.html`. Inspect table columns, filter dropdowns, buttons, modals, and scripts.
2. **Compare Netlify Reference:**
   - Check `https://dulank-admin.netlify.app/<menu>.html`.
3. **Inspect Existing Nuxt Page:**
   - Check `app/pages/<menu>.vue`. If it's a monolithic or raw page, refactor it into thin page + modular components in `app/components/pages/<menu>/`.
4. **Ensure Backend-Ready Architecture:**
   - Types: `server/types/<menu>.ts`
   - Data Mock: `server/data/<menu>.json` (with Primary Key `id`, Foreign Keys, timestamps, pure numbers)
   - API Routes: `server/api/<menu>/index.get.ts`, `server/api/<menu>/index.post.ts`, etc.
   - Composable: `app/composables/use<Menu>.ts`
5. **Hook Table & Modals:**
   - Use `SalesDataTable.vue` with `#cell(colKey)` slots.
   - Full fidelity modals (no generic 1-field placeholders).
   - Add Print & PDF standard with `<DocumentPrintModal>`.

---

## 4. Completed & Approved Modules (DO NOT REGRESS)

- **Sales:** `/sales`, `/sales-note`, `/sales-receipt`, `/invoice`, `/delivery-note`, `/sales-return`, `/quotation`, `/request-quotation`
- **Payments:** `/payments`, `/payment-inflow`, `/payment-outflow`
- **Orders:** `/orders`, `/job-order`, `/job-list`, `/job-branch`, `/my-job`, `/my-incentive`
- **Webstore:** `/cart`, `/checkout`, `/wishlist`, `/reviews`, `/support-ticket`, `/contact-form`
