# AGENTS.md

Nuxt 3 + Tailwind CSS admin UI ("Kacetak System", Indonesian POS & printing management). Recently migrated from a static HTML template; **all pages use hardcoded mock data in `<script setup>` — there is no backend/API wiring**. UI copy mixes English labels with Indonesian business fields.

## Commands

- `npm run dev` / `npm run build` — the only real checks. There is **no lint, test, or typecheck script** (no ESLint/Prettier/vitest installed). Verify with `npm run build`.
- `postinstall` runs `nuxt prepare`; `tsconfig.json` extends the generated `.nuxt/tsconfig.json`, so run `npm install` after checkout before relying on types.

## Don't touch the legacy template files

- ~186 tracked `*.html` files in the repo root (e.g. `sales.html`, `index.html`) are **pre-migration template mockups, not app files**. Editing them does nothing — the real pages are `pages/*.vue`.
- `components/sidebar.html`, `components/header.html`, `components/bekup.html` are also legacy static HTML, **not Vue components** — never import them. Real layout components live in `components/layout/` (`AppSidebar.vue`, `AppHeader.vue`), and the sidebar menu is hardcoded there.
- `scratch/parse_sidebar.cjs` is a one-off script that parsed `components/sidebar.html`; do not extend it.
- Naming gotchas: `*-bekup` pages are backups (e.g. `cetak-full-colorbekup.vue` just re-exports `cetak-full-color.vue`); `*-self` pages are self-service variants the sidebar legitimately links to (e.g. `/mesin-cetak-self`). Don't "clean up" these as duplicates.

## Routing

- `nuxt.config.ts` has a `pages:extend` hook that auto-creates a `<path>.html` alias for every non-root page, so `/sales` and `/sales.html` both resolve. Legacy `.html` links keep working because of this; keep the hook, and `AppSidebar`/`isChildActive` actively matches both forms.
- Layouts: `default` (header + sidebar; `AppSidebar`/`AppHeader`), `auth` (signin, forgot-password), `pos` (pages/pos.vue), `print`. Opt in via `definePageMeta({ layout })`.

## Assets — two trees, only one is live

- `public/assets/` is served at `/assets/...` — images, fonts, and JSON fixtures fetched at runtime (`/assets/json/provinsi.json`, `kota-kabupaten.json`, `kodepos.json` for `AddressCascader`; `product.json`/`customer.json` for the live-search components). Put new images/JSON here.
- `assets/` holds the old template's CSS/JS bundle (bootstrap.css, style.css, jQuery, DataTables, feather.min.js, …). **None of it is loaded** — the app only registers `~/assets/css/main.css` (Tailwind). Legacy Bootstrap classnames that still appear in some pages (`form-control`, `col-6`, `login-wrapper`) are dead/unstyled; write new markup with Tailwind, don't import legacy CSS to "fix" them.
- `locales/en/common.json` is unused (no i18n module configured).

## Conventions that differ from defaults

- **Dark mode** uses Tailwind's attribute strategy: `darkMode: ["class", '[data-layout-mode="dark_mode"]']`. `stores/theme.ts` sets the attribute on `<html>` and persists to localStorage key `theme`; toggle it there when testing dark styles.
- **Icons**: `FeatherIcon` is registered globally by `plugins/feather-icons.ts` (`<FeatherIcon name="search" />`). Legacy `data-feather` attributes do nothing.
- **Currency/dates**: always use `useFormatters()` (`composables/useFormatters.ts`) — `formatRupiah` uses dot thousands (`Rp48.988.078`; comma variant for sales-note), `parseNumber` parses both separators, dates are DD/MM/YYYY. Don't hand-roll. `useProfitCalculation.ts` holds the printing cost/profit formulas and tiered profit settings used by the kertas/mesin/harga pages.
- Brand tokens in `tailwind.config.ts`: `primary` orange #FF9F43, `secondary` navy #092C4C, `kacetak-gold` #b87817, success/warning/danger with `-soft` variants; Nunito/Poppins fonts.
- Reusable components to prefer: `components/table/DataTable.vue` (generic over row type; scoped slots `cell(<key>)` and `footer`; emits `print`/`export-pdf`/`export-excel`), `modal/BaseModal.vue` + `ConfirmModal.vue`, `common/PageHeader.vue`, `forms/NumberInput.vue`, `forms/AddressCascader.vue`, `forms/*LiveSearch.vue`, `dashboard/*Card.vue`. Don't reinvent jQuery DataTables-style markup.

Mixed code style (single vs double quotes) across files — match the file you're editing.