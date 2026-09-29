# AGENTS.md

Nuxt 4.5 + Tailwind CSS v4 admin UI ("Kacetak System", Indonesian POS & printing management). Migrated from a static HTML template; **all pages use hardcoded mock data in `<script setup lang="ts">` — no backend/API wiring yet** (only a demo `server/api/health.ts`). UI copy mixes English labels with Indonesian business fields.

## Commands

- `npm run dev` / `npm run build` — primary checks. No lint/test configured.
- `npm run typecheck` (`nuxt typecheck`) — known debt: ~100 pre-existing TS errors (mock literal vs interface optionality, TS2322/TS2532) unrelated to structure; don't try to fix them all in one pass.
- `postinstall` runs `nuxt prepare`; root `tsconfig.json` extends generated `.nuxt/tsconfig.json` (project refs: app/server/shared). Re-run `nuxi prepare` after moving files so `.nuxt/imports.d.ts` & `components.d.ts` regenerate — **the build can silently reuse a stale components scan**, so prepare before trusting auto-imports.

## Nuxt 4 structure (app/ + server/ + shared/)

- App code lives in `app/`: `app/pages`, `app/components`, `app/composables`, `app/layouts`, `app/plugins`, `app/stores` (Pinia, auto-discovered), `app/assets/css/main.css`, `app/app.vue`.
- `public/` stays at repo root and is served at `/assets/...` — runtime JSON fixtures (`/assets/json/provinsi.json`, `kota-kabupaten.json`, `kodepos.json`, `product.json`, `customer.json`) for the live-search/cascader components. Put new images/JSON there.
- `server/` (one level above `app/`): Nitro routes, e.g. `server/api/health.ts`. On Nuxt 4.6+ prefer explicit `import { defineEventHandler } from 'nuxt/server'` (4.5.x auto-imports from h3).
- `shared/types/` — **all interfaces/types live here, one file per domain** (customer, employee, payroll, product, printing, paper, machine, sales, finance, blog, workflow, settings, report, master, support, navigation, supplier). Auto-imported in both app & server; names must be globally unique. Don't define interfaces inline in pages.
- `locales/`, `scratch/`, and root `*.html` files: legacy/reference material (see below).

## Don't touch the legacy template files

- ~186 tracked `*.html` files in the repo root are pre-migration template mockups, not app files. Editing them does nothing.
- `app/components/bekup.html`, `header.html`, `sidebar.html` are legacy static HTML, **not Vue components** — never import them. Real layout components: `app/components/App/Layout/`.
- Page naming gotchas: `*-bekup` = backups (re-export wrapper); `*-self` = self-service variants the sidebar links to. Don't "clean up" as duplicates.

## Routing

- `nuxt.config.ts` `pages:extend` hook auto-creates `<path>.html` aliases for every non-root page, so `/sales` and `/sales.html` both resolve. Keep the hook; `AppSidebar` matches both forms (`isChildActive`).
- Layouts: `default` (header+sidebar), `auth` (signin, forgot-password), `pos` (pos.vue), `print`. Opt in via `definePageMeta({ layout })`.

## Assets & styling — Tailwind v4 (CSS-first)

- `app/assets/css/main.css` is the sole Tailwind entry: `@import "tailwindcss";` + `@custom-variant dark` + `@theme` tokens + base layer. **No `tailwind.config.ts`** — v4 doesn't read JS config; content sources are auto-detected.
- Brand tokens in `@theme`: `--color-primary` (orange #FF9F43, shades 50–900 + hover), `--color-secondary` (navy), `--color-success/-soft`, `--color-warning/-soft`, `--color-danger/-soft`, `--color-dark`, `--color-kacetak-gold`, fonts Nunito/Poppins. Unused tokens are tree-shaken from output.
- Formatting helpers are in `app/assets/css/main.css` (fonts, scrollbar), plus `[dir=rtl]` and print CSS rules (`@media print`, `.no-print`). Classnames from the old Bootstrap template (e.g. `form-control`, `col-6`, `login-wrapper`) are **dead/unstyled** — write Tailwind utilities instead.
- **Dark mode** works via the `[data-layout-mode="dark_mode"]` attribute on `<html>` (see `@custom-variant dark` in main.css). `app/stores/theme.ts` persists it to localStorage key `theme`; toggle that to test dark styles.

## Components — auto-import, name = path + filename

Components are auto-imported with directory prefixes (no manual imports; don't add `import X from '~/components/...'`):

| Path (app/components/) | Name |
|---|---|
| `Common/FeatherIcon.vue`, `Common/PageHeader.vue`, `Common/BaseModal.vue`, `Common/ConfirmModal.vue` | `<CommonFeatherIcon/>`, `<CommonPageHeader/>`, … |
| `Forms/NumberInput.vue`, `Forms/AddressCascader.vue`, `Forms/CustomerLiveSearch.vue`, `Forms/EmployeeLiveSearch.vue`, `Forms/ProductLiveSearch.vue` | `<FormsNumberInput/>` … |
| `Tables/DataTable.vue` | `<TablesDataTable/>` (generic; slots `cell(<key>)`, `footer`; emits `print`/`export-pdf`/`export-excel` — export events currently unhandled, buttons fall back to `window.print`) |
| `Dashboard/PrimaryCard.vue`, `Dashboard/RevenueCard.vue` | `<DashboardPrimaryCard/>`, `<DashboardRevenueCard/>` |
| `App/Layout/Header.vue`, `App/Layout/Sidebar.vue` | `<AppLayoutHeader/>`, `<AppLayoutSidebar/>` |

Icons: use `<CommonFeatherIcon name="..." />`; legacy `data-feather` attributes and `feather-*` font classes do nothing.

## Composables & conventions

- `app/composables/`: `useFormatters` (Rupiah dot-thousands, `parseNumber`, formats `DD/MM/YYYY` — don't hand-roll), `useProfitCalculation` (printing cost/profit formulas; types re-exported from `shared/types/printing.ts`), `usePrint` (SSR-safe `window.print`), `useModal` (uniform modal state — prefer for new modals over the 3 legacy patterns).
- Money/date formatting: always `useFormatters`.
- Types: extend `shared/types/*.ts`; keep names unique since they're globally auto-imported. `import type` is only needed for types that don't live in `shared/types/`.

## Known constraints

- The `pages:extend` `.html` aliases and the `-self`/`-bekup` pages are deliberate; verify against the sidebar before deleting routes.
- Dev server note: `.nuxt` may be rebuilt from `node_modules/.cache/nuxt`; run `nuxi prepare` after structural changes (see Commands).