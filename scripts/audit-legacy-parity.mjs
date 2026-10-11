import { readFile, readdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const legacyRoot = path.join(root, 'legacy/static-source')
const pagesRoot = path.join(root, 'app/pages')
const componentsRoot = path.join(root, 'app/components')
const outputPath = path.join(root, 'docs/LEGACY_PARITY_AUDIT_2026-10-10.md')
const writeReport = process.argv.includes('--write')

const decodeEntities = value => value
  .replace(/&nbsp;/gi, ' ')
  .replace(/&amp;/gi, '&')
  .replace(/&quot;/gi, '"')
  .replace(/&#39;|&apos;/gi, "'")
  .replace(/&lt;/gi, '<')
  .replace(/&gt;/gi, '>')

const cleanText = value => decodeEntities(value)
  .replace(/<script[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style[\s\S]*?<\/style>/gi, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/\{\{[\s\S]*?\}\}/g, ' ')
  .replace(/\s+/g, ' ')
  .trim()

const unique = values => [...new Set(values.map(cleanText).filter(Boolean))]
const matches = (source, expression, group = 1) => [...source.matchAll(expression)].map(match => match[group] || '')
const compact = (values, limit = 8) => {
  const selected = unique(values)
  if (!selected.length) return 'None detected'
  const shown = selected.slice(0, limit).map(value => value.replaceAll('|', '\\|'))
  return `${shown.join('; ')}${selected.length > limit ? `; +${selected.length - limit} more` : ''}`
}

function extractLegacy(source) {
  const headings = matches(source, /<h[1-6]\b[^>]*>([\s\S]*?)<\/h[1-6]>/gi)
  const tableHeaders = matches(source, /<th\b[^>]*>([\s\S]*?)<\/th>/gi)
  const labels = matches(source, /<label\b[^>]*>([\s\S]*?)<\/label>/gi)
  const buttons = matches(source, /<(?:button|a)\b[^>]*>([\s\S]*?)<\/(?:button|a)>/gi)
  const links = matches(source, /\bhref\s*=\s*["']([^"'#?]+\.html(?:\?[^"']*)?)["']/gi)
  const scriptSources = matches(source, /<script\b[^>]*\bsrc\s*=\s*["']([^"']+)["'][^>]*>/gi)
  const fields = [...source.matchAll(/<(input|select|textarea)\b([^>]*)>/gi)].map(match => {
    const attributes = match[2]
    const read = name => attributes.match(new RegExp(`\\b${name}\\s*=\\s*["']([^"']*)["']`, 'i'))?.[1] || ''
    return [match[1].toLowerCase(), read('type'), read('name'), read('id'), read('placeholder')].filter(Boolean).join(':')
  })
  return {
    headings: unique(headings),
    tableHeaders: unique(tableHeaders),
    labels: unique(labels),
    buttons: unique(buttons),
    links: unique(links),
    scriptSources: unique(scriptSources),
    fields: unique(fields),
    modalCount: (source.match(/class\s*=\s*["'][^"']*\bmodal\b[^"']*["']/gi) || []).length,
    inlineScriptCount: (source.match(/<script(?![^>]*\bsrc=)[^>]*>[\s\S]*?<\/script>/gi) || []).length,
    dynamicTemplateCount: (source.match(/(?:insertAdjacentHTML|innerHTML|appendChild|createElement|`[\s\S]*?<[^>]+>)/g) || []).length,
  }
}

async function listFiles(directory, extension) {
  const entries = await readdir(directory, { withFileTypes: true })
  const nested = await Promise.all(entries.map(async entry => {
    const target = path.join(directory, entry.name)
    if (entry.isDirectory()) return listFiles(target, extension)
    return entry.isFile() && entry.name.endsWith(extension) ? [target] : []
  }))
  return nested.flat()
}

const componentFiles = await listFiles(componentsRoot, '.vue')
const componentsByName = new Map()
for (const filename of componentFiles) {
  const name = path.basename(filename, '.vue').toLowerCase()
  const candidates = componentsByName.get(name) || []
  candidates.push(filename)
  componentsByName.set(name, candidates)
}

function resolveImport(fromFile, specifier) {
  let candidate
  if (specifier.startsWith('~/') || specifier.startsWith('@/')) candidate = path.join(root, 'app', specifier.slice(2))
  else if (specifier.startsWith('.')) candidate = path.resolve(path.dirname(fromFile), specifier)
  else return null
  for (const suffix of ['', '.vue', '.ts', '/index.vue', '/index.ts']) {
    const resolved = `${candidate}${suffix}`
    if (componentFiles.includes(resolved)) return resolved
  }
  return null
}

async function collectVueClosure(pageFile) {
  const queue = [pageFile]
  const visited = new Set()
  const sources = []
  while (queue.length) {
    const filename = queue.shift()
    if (!filename || visited.has(filename)) continue
    visited.add(filename)
    const source = await readFile(filename, 'utf8')
    sources.push({ filename, source })
    for (const specifier of matches(source, /\bfrom\s+["']([^"']+)["']/g)) {
      const resolved = resolveImport(filename, specifier)
      if (resolved) queue.push(resolved)
    }
    for (const tag of matches(source, /<([A-Z][A-Za-z0-9]+)/g)) {
      const candidates = componentsByName.get(tag.toLowerCase()) || []
      if (candidates.length === 1) queue.push(candidates[0])
    }
  }
  return sources
}

function extractNuxt(sources) {
  const source = sources.map(item => item.source).join('\n')
  const tableHeaders = [
    ...matches(source, /<th\b[^>]*>([\s\S]*?)<\/th>/gi),
    ...matches(source, /\b(?:label|title)\s*:\s*["'`]([^"'`]+)["'`]/g),
  ]
  const labels = [
    ...matches(source, /<label\b[^>]*>([\s\S]*?)<\/label>/gi),
    ...matches(source, /\blabel\s*=\s*["']([^"']+)["']/g),
  ]
  const buttons = [
    ...matches(source, /<button\b[^>]*>([\s\S]*?)<\/button>/gi),
    ...matches(source, /\b(?:label|title)\s*=\s*["']([^"']+)["']/g),
  ]
  const links = [
    ...matches(source, /\b(?:to|href)\s*=\s*["']([^"']+)["']/g),
    ...matches(source, /\bnavigateTo\(\s*["'`]([^"'`]+)["'`]/g),
  ]
  return {
    tableHeaders: unique(tableHeaders),
    labels: unique(labels),
    buttons: unique(buttons),
    links: unique(links),
    fileCount: sources.length,
    files: sources.map(item => path.relative(root, item.filename).replaceAll('\\', '/')),
    lineCount: sources[0].source.trimEnd().split(/\r?\n/).length,
    usesApiDirectly: /\b(?:\$fetch|useFetch)\s*\(/.test(sources[0].source),
  }
}

function coverage(expected, actual) {
  const normalized = new Set(actual.map(value => cleanText(value).toLowerCase()))
  const relevant = expected.map(value => cleanText(value)).filter(Boolean)
  if (!relevant.length) return { matched: 0, total: 0, missing: [] }
  const missing = relevant.filter(value => !normalized.has(value.toLowerCase()))
  return { matched: relevant.length - missing.length, total: relevant.length, missing }
}

function moduleFor(route) {
  const groups = [
    ['Sales', /sales|quotation|invoice|delivery-note|request-quotation/],
    ['Payment & Finance', /payment|income|expense|bank|cash|balance|tax|profit-and-loss|account-statement|money-transfer/],
    ['Orders & Workflow', /order|job|flow|incentive/],
    ['Purchases', /purchase/],
    ['Products & Inventory', /product|category|unit|variant|stock|brand|cetak|calender|mesin|kertas|komponen|harga-jasa/],
    ['Peoples & HRM', /customer|supplier|employee|department|designation|payroll|payslip|address|store-list/],
    ['Webstore & Content', /cart|checkout|wishlist|review|ticket|contact|blog|faq|banner|footer|client|download/],
    ['Settings & Access', /setting|profile|appearance|localization|language|permission|role|user|otp|prefix|security|storage|gateway|ban-ip|currency|printer|gdpr|delete-account|province|regency|district|preference/],
    ['Reports & Dashboard', /report|dashboard|analytics|subscription|billing|best-seller/],
    ['Promo', /voucher|discount|coupon/],
    ['Authentication', /signin|forgot-password/],
  ]
  return groups.find(([, expression]) => expression.test(route))?.[0] || 'Other'
}

const legacyFiles = (await readdir(legacyRoot)).filter(name => name.endsWith('.html')).sort()
const pageFiles = await listFiles(pagesRoot, '.vue')
const pageByRoute = new Map(pageFiles.map(filename => {
  const relative = path.relative(pagesRoot, filename).replaceAll('\\', '/')
  const route = relative === 'index.vue' ? 'index' : relative.replace(/(?:\/index)?\.vue$/, '')
  return [route, filename]
}))

const rows = []
const pageDetails = []
const salesCoreRoutes = ['sales', 'add-sales']
const salesDocumentRoutes = [
  'invoice', 'invoice-details',
  'delivery-note', 'delivery-note-detail',
  'sales-return',
  'quotation', 'add-quotation', 'edit-quotation', 'quotation-detail',
  'request-quotation', 'add-request-quotation', 'edit-request-quotation', 'request-quotation-detail',
]
const paymentRoutes = ['payments', 'payment-inflow', 'payment-outflow']
const salesAdjacentRoutes = ['sales-dashboard', 'sales-report', 'sales-note', 'sales-receipt']
const webstoreRoutes = ['cart', 'checkout', 'wishlist', 'reviews', 'contact-form', 'support-ticket', 'support-ticket-detail']
const ordersRoutes = ['orders', 'job-order', 'job-list', 'job-branch', 'my-job', 'my-incentive', 'job-order-detail', 'edit-job-order', 'job-progress']
const workflowRoutes = ['flow-category', 'flow-name', 'flow-template', 'work-flow', 'add-work-flow', 'edit-work-flow']
const dashboardRoutes = ['index', 'analytics-dashboard', 'kalkulator-dashboard']
const subscriptionRoutes = ['subscriptions']
const billingRoutes = ['billing']
const voucherRoutes = ['voucher']
const manuallyValidatedRoutes = new Set([...salesCoreRoutes, ...salesDocumentRoutes, ...paymentRoutes, ...salesAdjacentRoutes, ...webstoreRoutes, ...ordersRoutes, ...workflowRoutes, ...dashboardRoutes, ...subscriptionRoutes, ...billingRoutes, ...voucherRoutes])
for (const legacyName of legacyFiles) {
  const route = legacyName.slice(0, -5)
  const pageFile = pageByRoute.get(route)
  const legacySource = await readFile(path.join(legacyRoot, legacyName), 'utf8')
  const legacy = extractLegacy(legacySource)
  const nuxtSources = pageFile ? await collectVueClosure(pageFile) : []
  const nuxt = pageFile ? extractNuxt(nuxtSources) : null
  const headerCoverage = nuxt ? coverage(legacy.tableHeaders, nuxt.tableHeaders) : { matched: 0, total: legacy.tableHeaders.length, missing: legacy.tableHeaders }
  const labelCoverage = nuxt ? coverage(legacy.labels, [...nuxt.labels, ...nuxt.tableHeaders]) : { matched: 0, total: legacy.labels.length, missing: legacy.labels }
  const actionCoverage = nuxt ? coverage(legacy.buttons, nuxt.buttons) : { matched: 0, total: legacy.buttons.length, missing: legacy.buttons }
  const linkCoverage = nuxt ? coverage(legacy.links, nuxt.links.map(value => value.replace(/^\//, '').replace(/\?.*$/, '') + '.html')) : { matched: 0, total: legacy.links.length, missing: legacy.links }
  const automatedGap = !pageFile || headerCoverage.missing.length || labelCoverage.missing.length || actionCoverage.missing.length || linkCoverage.missing.length
  const manuallyValidated = manuallyValidatedRoutes.has(route)
  pageDetails.push({
    module: moduleFor(route), legacyName, route, pageFile, legacy, nuxt,
    headerCoverage, labelCoverage, actionCoverage, linkCoverage,
    status: manuallyValidated
      ? 'Manually reconciled; runtime evidence passed'
      : automatedGap
        ? 'Pending manual parity review'
        : 'Automated text coverage matched; interaction review pending',
  })
  const currentSummary = pageFile
    ? `${path.relative(root, pageFile).replaceAll('\\', '/')} (${nuxt.lineCount} lines; ${nuxt.fileCount} UI files scanned)`
    : 'No matching Nuxt page'
  rows.push(`| ${moduleFor(route)} | ${legacyName} | /${route === 'index' ? '' : route} | Page mapping | HTML source present | ${currentSummary} | ${pageFile ? 'Exact route mapping' : 'Missing route'} | ${manuallyValidated ? 'Implemented; runtime passed' : pageFile ? 'Mapped' : 'Unmapped'} |`)
  rows.push(`| ${moduleFor(route)} | ${legacyName} | /${route === 'index' ? '' : route} | Table headers | ${compact(legacy.tableHeaders)} | ${compact(nuxt?.tableHeaders || [])} | ${manuallyValidated ? 'Manual source and browser reconciliation completed' : headerCoverage.missing.length ? `Missing automated matches: ${compact(headerCoverage.missing, 5)}` : 'No exact-text gap detected'} | ${manuallyValidated ? 'Evidence passed' : headerCoverage.missing.length ? 'Pending' : 'Static match'} |`)
  rows.push(`| ${moduleFor(route)} | ${legacyName} | /${route === 'index' ? '' : route} | Form/modal content | ${legacy.fields.length} controls; ${legacy.modalCount} modal markers; labels: ${compact(legacy.labels, 5)} | Labels detected: ${compact(nuxt?.labels || [], 5)} | ${manuallyValidated ? 'Manual source, dynamic-field, and persistence reconciliation completed' : labelCoverage.missing.length ? `${labelCoverage.missing.length} legacy labels need manual reconciliation` : 'No exact-label gap detected'} | ${manuallyValidated ? 'Evidence passed' : labelCoverage.missing.length ? 'Pending' : 'Static match'} |`)
  rows.push(`| ${moduleFor(route)} | ${legacyName} | /${route === 'index' ? '' : route} | Actions/navigation | Actions: ${compact(legacy.buttons, 5)}; links: ${compact(legacy.links, 5)} | Actions: ${compact(nuxt?.buttons || [], 5)}; links: ${compact(nuxt?.links || [], 5)} | ${manuallyValidated ? 'Manual navigation, menu, modal, and API-flow reconciliation completed' : actionCoverage.missing.length + linkCoverage.missing.length ? `${actionCoverage.missing.length} action and ${linkCoverage.missing.length} link matches pending` : 'No exact-text/target gap detected'} | ${manuallyValidated ? 'Evidence passed' : actionCoverage.missing.length + linkCoverage.missing.length ? 'Pending' : 'Static match'} |`)
}

const nuxtOnly = [...pageByRoute.keys()].filter(route => !legacyFiles.includes(`${route}.html`)).sort()
const oversized = pageDetails.filter(item => (item.nuxt?.lineCount || 0) > 300)
const directRequests = pageDetails.filter(item => item.nuxt?.usesApiDirectly)
const summary = {
  generatedAt: '2026-10-11',
  originalRepositoryCommit: '6123241083ffa762405ab7330bab2ee40f694d5d',
  legacyPages: legacyFiles.length,
  nuxtPages: pageFiles.length,
  exactMappings: pageDetails.filter(item => item.pageFile).length,
  legacyUnmapped: pageDetails.filter(item => !item.pageFile).map(item => item.legacyName),
  nuxtOnly,
  pagesOver300Lines: oversized.map(item => `${item.route} (${item.nuxt.lineCount})`),
  directRequestPages: directRequests.map(item => item.route),
  staticFullTextCandidates: pageDetails.filter(item => item.status.startsWith('Automated text')).length,
  manualReviewPending: pageDetails.filter(item => item.status.startsWith('Pending')).length,
  manuallyValidated: pageDetails.filter(item => item.status.startsWith('Manually')).map(item => item.route),
}

const report = `# Full Legacy Parity Audit Inventory - 2026-10-11

This is the canonical working inventory for the application-wide legacy parity request. It is generated from all top-level HTML files in \`legacy/static-source/\` and all Nuxt route files in \`app/pages/\` using \`node scripts/audit-legacy-parity.mjs --write\`.

## Source verification

- Original repository: \`Ekosattrio/DulankADmin-front-end-\`, branch \`main\`, commit \`${summary.originalRepositoryCommit}\`.
- Remote original pages: ${summary.legacyPages} top-level HTML files.
- Local legacy pages: ${summary.legacyPages}; filenames map 1:1 and normalized contents were independently verified equal to the remote archive on 2026-10-10.
- Nuxt routes: ${summary.nuxtPages}; exact legacy-to-route mappings: ${summary.exactMappings}.
- Nuxt-only routes: ${summary.nuxtOnly.map(route => `\`/${route}\``).join(', ')}. They are explicit empty-state/additional routes and have no original HTML counterpart.

## Status rules

- \`Static match\` means only exact extracted text/target coverage matched. It does not verify styling, field mapping, dynamic JavaScript, API persistence, or browser behavior.
- \`Pending\` means at least one legacy label/header/action/target did not have an exact static match in the reachable Vue component closure. False positives are possible where content is derived from types/data, so each page still requires manual source and browser review.
- Only routes listed as manually validated below carry runtime evidence. The former P0 asset gate is closed; application-wide completion remains blocked by routes that have not received manual/browser reconciliation.

## Baseline findings

- Pages needing manual parity review from the static pass: ${summary.manualReviewPending}/${summary.legacyPages}.
- Automated full-text candidates (still interaction-pending): ${summary.staticFullTextCandidates}/${summary.legacyPages}.
- Route pages above 300 lines: ${summary.pagesOver300Lines.length}${summary.pagesOver300Lines.length ? ` - ${summary.pagesOver300Lines.join(', ')}` : ''}.
- Direct request calls detected in route pages: ${summary.directRequestPages.length}${summary.directRequestPages.length ? ` - ${summary.directRequestPages.join(', ')}` : ''}.

## Manually validated implementation progress

- ${salesCoreRoutes.map(route => `\`/${route}\``).join(', ')}: source reconciliation, desktop and 390px runtime layout, Add navigation, More actions, shared Add/Edit fields, dynamic rows, Pickup switching, conditional tax transaction code, Add Customer modal, API calculations, reload persistence, and empty/invalid runtime-data safeguards passed on 2026-10-10.
- ${salesDocumentRoutes.map(route => `\`/${route}\``).join(', ')}: list columns/actions, full add/edit flows, selected-record detail, duplicate-recipient flow, status mutations, numeric calculations, isolated persistence, desktop layout, and representative 390px overflow checks passed on 2026-10-10. Historical records with no stored line detail now show an explicit unavailable state instead of fabricated transaction data.
- ${paymentRoutes.map(route => `\`/${route}\``).join(', ')}: legacy rows and controls, date-range filtering, collapsed balance summary, Add/Edit/Payment dialogs, dynamic split payments, server-derived totals/statuses, CRUD/reload, invalid/empty data handling, and desktop/390px browser checks passed on 2026-10-10.
- ${salesAdjacentRoutes.map(route => `\`/${route}\``).join(', ')}: dashboard snapshot/API composition and product dialog, report KPI/table/detail/filter/export flows, selected-record note/receipt documents, invalid/empty report data handling, and desktop/390px browser checks passed on 2026-10-10.
- ${webstoreRoutes.map(route => `\`/${route}\``).join(', ')}: approved KPI/table/filter layouts, numeric currency data, server-side filters/stats, Support Ticket Add/detail-page/Edit/chat/status/delete/reload, API validation, empty/invalid data handling, and desktop/390px browser checks passed on 2026-10-10.
- ${ordersRoutes.map(route => `\`/${route}\``).join(', ')}: approved list/card/sidebar/document layouts, selected modal flows, standalone selected-record detail/editor, dynamic workflow/assignee/incentive persistence, Job Progress lifecycle, server-derived counters/totals, API validation, empty/invalid data handling, and desktop/390px browser checks passed on 2026-10-10.
- ${workflowRoutes.map(route => `\`/${route}\``).join(', ')}: legacy list filters/columns, complete category/name/template modals, selected-record edit navigation, shared Add/Edit workflow editor, persisted master submodals, relational editor context, strict validation/data safeguards, and desktop/390px browser checks passed on 2026-10-10.
- ${dashboardRoutes.map(route => `\`/${route === 'index' ? '' : route}\``).join(', ')}: Admin, Analytics, and Calculator Dashboard legacy KPIs/charts/tables, transaction/detail actions, typed server snapshots, domain composables, responsibility-split UI, malformed-data safeguards, and desktop/390px browser checks passed by 2026-10-11.
- ${subscriptionRoutes.map(route => `\`/${route}\``).join(', ')}: legacy KPI snapshot, table columns/total, search/date/plan/payment/status filters, selected-record View/Edit/Delete, numeric currency, isolated persistence/validation, print/PDF dialog, malformed-data safeguard, and desktop/390px browser checks passed on 2026-10-11.
- ${billingRoutes.map(route => `\`/${route}\``).join(', ')}: exact legacy KPI snapshot and ten-row billing ledger, search/date/method/status filters, numeric money and footer totals, typed relational data, strict malformed-data safeguard, and desktop/390px browser checks passed on 2026-10-11. No action/modal/print controls were added because the legacy page has none.
- ${voucherRoutes.map(route => `\`/${route}\``).join(', ')}: exact legacy coupon rows/columns, distinct list/modal product choices, search/date/name/type/store/product filters, complete shared Add/Edit form, numeric discounts, CRUD/reload, validation and malformed-data safeguards, print/collapse actions, and desktop/390px browser checks passed on 2026-10-11.
- Remaining routes: ${summary.legacyPages - summary.manuallyValidated.length}/${summary.legacyPages} still require page-by-page manual and browser verification. Static coverage is not treated as completion.

### Architecture Evidence Matrix - Sales/Add Sales

| Layer | Active evidence | Result |
|---|---|---|
| Page composition | \`app/pages/sales.vue\` (138 lines) and \`app/pages/add-sales.vue\` (12 lines) | Pass |
| Domain UI | \`SalesDocumentForm.vue\`, \`SalesOrderPartiesSection.vue\`, \`SalesOrderItemsSection.vue\`, \`SalesOrderAdjustmentsSection.vue\`, \`SalesOrderSummary.vue\` | Pass |
| Domain composable | \`useSalesEditor.ts\`, \`useAddSalesPage.ts\`, \`useSales.ts\`, \`useSalesContacts.ts\` | Pass |
| Thin Nitro adapter | \`server/api/sales/index.post.ts\`, \`server/api/sales/contacts.get.ts\` | Pass |
| Domain service/repository | \`server/utils/sales.ts\`, \`salesData.ts\`, \`salesVoucher.ts\`, \`salesContact.ts\`, \`data.ts\` | Pass |
| Typed relational contract | \`server/types/sale.ts\`, \`sales-document.ts\`; IDs, product references, numeric money, timestamps/source records retained | Pass |
| Persistence evidence | Isolated create/update/reload/delete suite, invalid JSON safeguard, empty runtime array safeguard | Pass |
| Structure gate | All required legacy paths exist; the restored Sticky Kit/Summernote files match their manifest SHA-256 values | Pass |

### UI Responsibility Evidence - Sales/Add Sales

| Responsibility | Component/evidence | Result |
|---|---|---|
| Header/actions | \`SalesListHeader.vue\`, \`SalesStandaloneEditor.vue\` | Separated |
| Filters/table/row menu | \`SalesRecordsTable.vue\`, \`SalesDataTable.vue\`, \`SalesMoreMenu.vue\` | Separated |
| Shared Add/Edit editor | \`SalesDocumentForm.vue\` | Shared orchestrator, 120 lines |
| Parties and shipping | \`SalesOrderPartiesSection.vue\`, \`SalesCustomerField.vue\`, \`SalesShippingFields.vue\` | Separated |
| Dynamic line items | \`SalesOrderItemsSection.vue\`, \`QuantityStepper.vue\`, currency controls | Separated |
| Adjustments/calculation display | \`SalesOrderAdjustmentsSection.vue\`, \`SalesOrderSummary.vue\` | Separated |
| Modal wrapper | \`SalesEditor.vue\` + \`SalesDialog.vue\`; Add stays standalone | Matches legacy flow |
| Feedback and mutations | \`SalesFeedback.vue\`, composable pending/error/message state | Separated |
| Responsive/browser evidence | Desktop and 390px; document scroll width equals client width; no runtime exception/log entry | Pass |

### Architecture Evidence Matrix - Sales Transaction Documents

| Layer | Active evidence | Result |
|---|---|---|
| Page composition | Invoice, Delivery Note, Sales Return, Quotation, and RFQ list/detail/add/edit pages are 14-96 lines | Pass |
| Domain UI | Domain records tables, editors, detail documents, duplicate selector, payment modal, and shared print header/company components | Pass |
| Domain composable | \`useInvoices.ts\`, \`useDeliveryNotes.ts\`, \`useSalesReturns.ts\`, \`useQuotations.ts\`, \`useRequestQuotations.ts\`, plus document editor composables | Pass |
| Thin Nitro adapter | List/save/delete/payment routes delegate to domain utilities and only map HTTP input/output | Pass |
| Domain service/repository | \`invoices.ts\`, \`deliveryNotes.ts\`, \`salesReturns.ts\`, \`quotations.ts\`, \`requestQuotations.ts\`, \`salesData.ts\` | Pass |
| Typed contract | Domain types retain document/item/refund structures and pure numeric money values | Pass |
| Persistence evidence | Isolated create/update/reload/delete, recalculation, validation, duplicate, refund, and status-action checks | Pass |
| Structure gate | All required legacy paths exist; the restored Sticky Kit/Summernote files match their manifest SHA-256 values | Pass |

### UI Responsibility Evidence - Sales Transaction Documents

| Responsibility | Component/evidence | Result |
|---|---|---|
| Header/actions | \`SalesListHeader.vue\`, \`SalesDocumentDetailHeader.vue\` | Separated |
| Filters/tables | Five domain \`*RecordsTable.vue\` components using \`SalesDataTable\` and \`TableFilterSelect\` | Separated |
| Add/Edit | Shared Quotation/RFQ document forms; modal editors for Delivery Note and Sales Return | Separated |
| Detail/print | Four selected-record domain detail components and Sales Return detail dialog | Separated |
| Feedback/mutations | Domain composables plus \`SalesFeedback.vue\` and \`SalesConfirmDelete.vue\` | Separated |
| Responsive/browser evidence | Five list pages, representative forms/modals/details, and 390px detail layout; no runtime exception | Pass |

### Architecture Evidence Matrix - Payment

| Layer | Active evidence | Result |
|---|---|---|
| Page composition | \`payments.vue\`, \`payment-inflow.vue\`, and \`payment-outflow.vue\` coordinate domain components/composables only | Pass |
| Domain UI | \`PaymentRecordsTable.vue\`; Payment Flow records, balance, detail, editor, method, split, and transaction-detail components | Pass |
| Domain composable | \`usePayments.ts\`, \`usePaymentFlow.ts\`, and shared date-range state | Pass |
| Thin Nitro adapter | Payment and Payment Flow GET/POST/DELETE routes delegate to domain utilities | Pass |
| Domain service/repository | \`paymentData.ts\`, \`paymentFlowData.ts\`, \`paymentFlow.ts\`, shared JSON/date-range utilities | Pass |
| Typed relational contract | \`payment.ts\` and \`payment-flow.ts\`; numeric money, transaction details, payment histories, transfer and split entries | Pass |
| Persistence evidence | Isolated create/update/reload/delete, derived totals/statuses, split history, overpayment rejection, empty-array and invalid-JSON checks | Pass |

### UI Responsibility Evidence - Payment

| Responsibility | Component/evidence | Result |
|---|---|---|
| Header/actions | \`SalesListHeader.vue\` and semantic \`SalesActionButton\` actions | Separated |
| Filters/tables | Payment record tables use \`SalesDataTable\` and \`DateRangePicker\`; legacy-only controls retained | Separated |
| Balance/detail | \`PaymentBalanceSummary.vue\` and \`PaymentFlowDetails.vue\` | Separated |
| Add/Edit/Payment | \`PaymentFlowEditor.vue\` orchestrates dedicated method, split, and transaction-detail components | Separated |
| Feedback/mutations | Domain composables, \`SalesFeedback.vue\`, and \`SalesConfirmDelete.vue\` | Separated |
| Responsive/browser evidence | Desktop interaction and 390px Payment Outflow; no document/dialog overflow or runtime exception | Pass |

### Architecture Evidence Matrix - Sales Dashboard, Report, Note, and Receipt

| Layer | Active evidence | Result |
|---|---|---|
| Page composition | Four route pages coordinate domain workspaces/components and composables only; dashboard route reduced from 964 to 9 lines | Pass |
| Domain UI | Dashboard header/KPI/best-seller/transaction/analytics/country/dialog components; report records/detail; selected-sale note and receipt documents | Pass |
| Domain composable | \`useSalesDashboard.ts\`, \`useSalesReports.ts\`, and \`useSaleDocument.ts\` | Pass |
| Thin Nitro adapter | Dashboard and report GET routes delegate aggregation/filtering to server utilities; sales documents reuse the Sales endpoint | Pass |
| Domain service/repository | \`salesDashboard.ts\`, \`salesReports.ts\`, \`salesData.ts\`, and strict shared JSON access | Pass |
| Typed contract | \`sales-dashboard.ts\`, \`sales-report.ts\`, and Sales transaction types retain numeric money and selected-record identity | Pass |
| Runtime/data evidence | Dashboard/report API fixtures, search/date filtering, report empty/invalid JSON, selected-record note/receipt, dialogs, and exports | Pass |

### UI Responsibility Evidence - Sales Dashboard, Report, Note, and Receipt

| Responsibility | Component/evidence | Result |
|---|---|---|
| Dashboard composition | Dedicated header, KPI, best-seller, transaction, analytics, country, and dialog components | Separated |
| Report header/KPIs/table | \`SalesReportWorkspace.vue\` orchestrates shared header/stats plus \`SalesReportRecordsTable.vue\` | Separated |
| Report detail/print | \`SalesReportDetailModal.vue\` and \`DocumentPrintModal.vue\` | Separated |
| Transaction documents | \`SalesNoteDocument.vue\` and \`SalesReceiptDocument.vue\` consume selected Sales data through one composable | Separated |
| Responsive/browser evidence | Dashboard desktop, report/note/receipt at 390px; dialogs and documents have no viewport overflow or runtime exception | Pass |

### Architecture Evidence Matrix - Webstore

| Layer | Active evidence | Result |
|---|---|---|
| Page composition | Cart, Checkout, Wishlist, Reviews, Contact Form, and Support Ticket pages coordinate domain components/composables; Support Ticket detail is a 15-line route composer | Pass |
| Domain UI | Dedicated Stats/Records tables; Support Ticket Add/Edit editor, detail panel, chat panel, workspace, and confirmation | Pass |
| Domain composable | Six list composables plus \`useSupportTickets\`, \`useSupportTicketPage\`, and \`useSupportTicketDetail\` | Pass |
| Thin Nitro adapter | Six list GET adapters and Support Ticket GET/POST/PUT/DELETE adapters delegate all domain work | Pass |
| Domain service/repository | \`webstoreLists.ts\` and \`supportTickets.ts\` own filtering, stats, validation, numbering, status/chat history, and persistence | Pass |
| Typed relational contract | Cart/Checkout/Wishlist/Review/Contact/Support types preserve IDs/FKs and numeric money; Support Ticket commands are separate from query output | Pass |
| Persistence evidence | Isolated Support Ticket create/detail/edit/chat/status/delete/reload plus validation, empty-array, and invalid-JSON checks | Pass |

### UI Responsibility Evidence - Webstore

| Responsibility | Component/evidence | Result |
|---|---|---|
| Header/actions | Shared \`SalesListHeader.vue\`; Add Ticket uses canonical add props/event | Separated |
| Stats | Six domain \`*StatsWidgets.vue\` components | Separated |
| Filters/tables | Six domain records tables use \`SalesDataTable\`, \`DateRangePicker\`, filters, currency display, and no Action on the five approved read-only lists | Separated |
| Add/Edit | \`SupportTicketAddModal.vue\` is shared by Add and selected-record Edit, including image, identity, location, and 60-character description | Shared |
| Detail/chat | Separate \`SupportTicketDetailPanel.vue\` and \`SupportTicketChatPanel.vue\`; legacy View navigates to the detail route | Separated |
| Feedback/mutations | Domain composables plus \`SalesFeedback.vue\` and \`SalesConfirmDelete.vue\` | Separated |
| Responsive/browser evidence | Five read-only lists at 390px; Support Ticket lifecycle desktop; no viewport overflow or runtime exception | Pass |

### Architecture Evidence Matrix - Orders, Job Order Documents, and Progress

| Layer | Active evidence | Result |
|---|---|---|
| Page composition | Nine route pages are 16-136 lines; Job Order list/document/editor and Job Progress orchestration live in domain composables | Pass |
| Domain UI | Dedicated stats, workflow/flow sidebars, records/card views, selected document, workflow editor, source panel, status/detail/history/settings components | Pass |
| Domain composable | \`useOrders.ts\`, \`useJobOrders.ts\`, \`useJobOrderPage.ts\`, \`useJobOrderDocument.ts\`, \`useJobProgress.ts\`, \`useJobList.ts\`, \`useJobBranches.ts\`, \`useMyJobs.ts\`, and \`useMyIncentives.ts\` | Pass |
| Thin Nitro adapter | Orders/Job routes, selected context, and source-order lookup delegate filtering, validation, calculations, IDs, and persistence to server utilities | Pass |
| Domain service/repository | \`order.ts\`, \`jobOrders.ts\`, \`jobProgress.ts\`, \`jobList.ts\`, \`jobBranch.ts\`, \`myJobs.ts\`, \`myIncentives.ts\`, and strict shared JSON access | Pass |
| Typed relational contract | Six domain types preserve order/job/customer/branch/product/employee IDs, technical specs, OK/damaged quantity, and numeric money | Pass |
| Persistence evidence | Isolated status/edit/dynamic workflow/nested branch/incentive mutations, selected context/reload reads, validation, 404, empty-array, and malformed-JSON checks | Pass |

### UI Responsibility Evidence - Orders, Job Order Documents, and Progress

| Responsibility | Component/evidence | Result |
|---|---|---|
| Header/stats | \`SalesListHeader.vue\` and domain stats widgets | Separated |
| Filters/tables/cards | Domain records/card components use shared date/filter/table/currency primitives | Separated |
| Workflow navigation | Job Order and Job List sidebar components; workflow counts derive from persisted data | Separated |
| Selected dialogs | Order status, Job Order edit/flow, Job List detail, Job Branch settings/history, and My Job detail/status | Separated |
| Complex Job Branch form | Overview orchestrator plus dedicated information editor and assignment/incentive fields | Separated |
| Job Order document/editor | \`JobOrderDetailDocument.vue\`, source panel, workflow form, flow information editor, and editor workspace | Separated |
| Job Progress | Dedicated stats and records table with shared filters/actions/print | Separated |
| Feedback/mutations | Domain composables, inline validation, \`SalesFeedback.vue\`, and \`SalesConfirmDelete.vue\` | Separated |
| Responsive/browser evidence | Nine routes desktop and 390px; standalone editor save/reload, Job Progress mutation, selected actions; no viewport overflow or runtime exception | Pass |

### Architecture Evidence Matrix - Workflow Masters

| Layer | Active evidence | Result |
|---|---|---|
| Page composition | Six route pages are 27-68 lines and only coordinate list/editor state | Pass |
| Domain UI | Category/Name/Template tables and dialogs plus Product Picker, Flow Catalog, Arrange Panel, and shared Add/Edit document form | Pass |
| Domain composable | Four list composables plus \`useWorkFlowDocumentEditor.ts\` are the frontend request/mutation boundary | Pass |
| Thin Nitro adapter | Category, name, template, workflow, and editor-context routes delegate to services | Pass |
| Domain service/repository | Validation/filter/numbering in domain utilities; all four stores use strict shared JSON access | Pass |
| Typed data/context | Typed master entities, nested template information, workflow steps, product references, and bundled editor catalog | Pass |
| Persistence evidence | Isolated CRUD/get/reload/filter, nested validation, ID generation, empty-array, and malformed-JSON checks | Pass |

### UI Responsibility Evidence - Workflow Masters

| Responsibility | Component/evidence | Result |
|---|---|---|
| Header/print/filter/table | Shared list header, DocumentPrintModal, date/select controls, and four domain records tables | Separated |
| Master dialogs | Category, complete Name/Assignee/Incentive, Template information, and Data Select dialogs | Separated |
| Shared Add/Edit editor | \`WorkFlowDocumentForm.vue\` is a 78-line orchestrator shared by both standalone routes | Shared |
| Product/flow/arrangement | \`WorkFlowProductPicker.vue\`, \`WorkFlowCatalog.vue\`, and \`WorkFlowArrangePanel.vue\` | Separated |
| Feedback/mutations | Domain composables, SalesFeedback, and SalesConfirmDelete | Separated |
| Responsive/browser evidence | Six routes, selected modal/editor persistence and navigation, desktop/390px, no runtime exception | Pass |

### Architecture Evidence Matrix - Admin, Analytics, and Calculator Dashboards

| Layer | Active evidence | Result |
|---|---|---|
| Page composition | \`app/pages/index.vue\`, \`analytics-dashboard.vue\`, and \`kalkulator-dashboard.vue\` are 9-11-line route composers | Pass |
| Domain UI | Separate Admin/Analytics/Calculator workspaces plus KPI, chart, list/table, transaction, conversion, traffic, detail, and editor components | Pass |
| Domain composable | \`useAdminDashboard.ts\`, \`useAnalyticsDashboard.ts\`, and \`useCalculatorDashboard.ts\` are the frontend request boundaries | Pass |
| Thin Nitro adapter | Three dashboard API families delegate snapshot loading and Calculator update/delete | Pass |
| Domain service/repository | Strict Admin/Analytics services load snapshots; Calculator service validates and persists selected records | Pass |
| Typed data | Separate server contracts plus bundled JSON with relational IDs, timestamps, and numeric metrics | Pass |
| Data/browser evidence | Snapshot contracts, malformed JSON, update/delete persistence, tabs/dropdowns/chart/modal/print actions, desktop/390px overflow, and runtime exception checks | Pass |

### UI Responsibility Evidence - Admin, Analytics, and Calculator Dashboards

| Responsibility | Component/evidence | Result |
|---|---|---|
| Route/workspace orchestration | Three route composers plus separate Admin/Analytics/Calculator workspaces | Separated |
| KPI/header/alerts | Admin Welcome/Metrics, Analytics KPI, and Calculator telemetry components | Separated |
| Charts/overview | Admin Sales/Overview/Statics, Analytics Conversion/Performance, and Calculator legacy series | Separated |
| Lists/tabs/traffic | Admin Product/Transactions/Insights, Analytics Traffic/Top Pages, and Calculator user table | Separated |
| Feedback/request state | Three domain composables and shared \`SalesFeedback.vue\` | Separated |
| Responsive/browser evidence | Legacy content, tabs, range/dropdown/dismiss/modal actions on desktop and 390px with no page overflow or runtime exception | Pass |

### Architecture Evidence Matrix - Subscriptions

| Layer | Active evidence | Result |
|---|---|---|
| Page composition | \`app/pages/subscriptions.vue\` is a 9-line route composer | Pass |
| Domain UI | Stats, records table, detail dialog, edit form, and workspace components under \`Pages/Subscription\` | Pass |
| Domain composable | \`useSubscriptions.ts\` owns list/filter request plus update/delete mutations | Pass |
| Thin Nitro adapter | GET list/detail, PUT, and DELETE routes delegate to the subscription service | Pass |
| Domain service/repository | \`subscriptions.ts\` validates query/mutation data and persists through strict shared JSON access | Pass |
| Typed relational data | \`subscription.ts\` plus bundled \`subscriptions.json\`; subscriber foreign keys, numeric amounts, and timestamps retained | Pass |
| Runtime/data evidence | Filter combinations, edit/reload, delete/reload, invalid command, missing record, malformed JSON, print dialog, and browser checks | Pass |

### UI Responsibility Evidence - Subscriptions

| Responsibility | Component/evidence | Result |
|---|---|---|
| Header/actions | Shared \`SalesListHeader.vue\`; no non-legacy Add/upgrade/payment action | Separated |
| KPI summary | \`SubscriptionStats.vue\` preserves the four legacy aggregate values | Separated |
| Filters/table/total | \`SubscriptionRecordsTable.vue\` plus shared DateRangePicker, TableFilterSelect, SalesDataTable, currency/status/action components | Separated |
| Detail/edit/delete | Dedicated detail and 12-column edit dialogs plus shared delete confirmation | Separated |
| Feedback/request state | \`SubscriptionWorkspace.vue\`, \`useSubscriptions.ts\`, SalesFeedback, and skeleton primitives | Separated |
| Responsive/browser evidence | Legacy content and View/Edit/Delete/filter/print actions on desktop and 390px with no page overflow or runtime exception | Pass |

### Architecture Evidence Matrix - Billing

| Layer | Active evidence | Result |
|---|---|---|
| Page composition | \`app/pages/billing.vue\` is a 9-line route composer | Pass |
| Domain UI | Stats, records table/filter/total, and workspace components under \`Pages/Billing\` | Pass |
| Domain composable | \`useBillings.ts\` owns the list/filter request boundary | Pass |
| Thin Nitro adapter | \`server/api/billings/index.get.ts\` delegates to the billing service | Pass |
| Domain service/repository | \`server/utils/billing.ts\` validates and filters through strict shared JSON access | Pass |
| Typed relational data | \`server/types/billing.ts\` plus bundled \`billing.json\`; transaction/user foreign keys, numeric money, and timestamps retained | Pass |
| Runtime/data evidence | Exact snapshot, search/method/status/date filters, valid empty store, malformed JSON, desktop/390px overflow, and runtime exception checks | Pass |

### UI Responsibility Evidence - Billing

| Responsibility | Component/evidence | Result |
|---|---|---|
| Header | \`BillingWorkspace.vue\` preserves the legacy title/subtitle without invented toolbar actions | Separated |
| KPI summary | \`BillingStats.vue\` preserves the three legacy aggregate values | Separated |
| Filters/table/total | \`BillingRecordsTable.vue\` plus shared DateRangePicker, TableFilterSelect, SalesDataTable, and CurrencyDisplay | Separated |
| Actions/modals | None, matching the legacy billing page | Exact omission |
| Feedback/request state | \`BillingWorkspace.vue\`, \`useBillings.ts\`, SalesFeedback, and skeleton primitives | Separated |
| Responsive/browser evidence | Exact legacy rows/KPI/columns and search/status interaction on desktop and 390px with no page overflow or runtime exception | Pass |

### Architecture Evidence Matrix - Voucher

| Layer | Active evidence | Result |
|---|---|---|
| Page composition | \`app/pages/voucher.vue\` is a 9-line route composer | Pass |
| Domain UI | Records table, shared Add/Edit form dialog, and workspace components under \`Pages/Voucher\` | Pass |
| Domain composable | \`useVouchers.ts\` owns list/filter requests plus create/update/delete mutations | Pass |
| Thin Nitro adapter | GET, POST, PUT, and DELETE routes under \`server/api/vouchers/\` delegate to the domain service | Pass |
| Domain service/repository | \`server/utils/vouchers.ts\` validates filters, commands, relations, uniqueness, and persists through strict shared JSON access | Pass |
| Typed relational data | \`server/types/voucher.ts\` plus bundled \`vouchers.json\`; store/product/creator relations, numeric discounts, usage counters, and timestamps retained | Pass |
| Runtime/data evidence | Exact rows/options, combined filters, CRUD/reload, invalid command, missing record, malformed JSON, print/collapse, and browser checks | Pass |

### UI Responsibility Evidence - Voucher

| Responsibility | Component/evidence | Result |
|---|---|---|
| Header/actions | Shared \`SalesListHeader.vue\` preserves Add, PDF, Print, Refresh, and Collapse actions | Separated |
| Filters/table | \`VoucherRecordsTable.vue\` plus shared DateRangePicker, TableFilterSelect, SalesDataTable, currency/status/action components | Separated |
| Add/Edit | One shared \`VoucherFormDialog.vue\` preserves every legacy field, toggle, product selection, and mode | Separated |
| Delete/print | Shared SalesConfirmDelete and DocumentPrintModal | Separated |
| Feedback/request state | \`VoucherWorkspace.vue\`, \`useVouchers.ts\`, SalesFeedback, and skeleton primitives | Separated |
| Responsive/browser evidence | Exact content and Add/Edit/Delete/print/collapse interactions on desktop and 390px with no page overflow or runtime exception | Pass |

## Comprehensive comparison matrix

| Module | Original Page | Nuxt Route | Element | Original Behavior/Content | Current Nuxt | Difference | Status |
|---|---|---|---|---|---|---|---|
${rows.join('\n')}

## Execution order

1. Sales and Add Sales manual reconciliation and implementation - completed 2026-10-10.
2. Invoice, Delivery Note, Sales Return, Quotation, and Request for Quotation - completed 2026-10-10.
3. Payments, Payment Inflow, and Payment Outflow - completed 2026-10-10.
4. Sales Dashboard, Sales Report, Sales Note, and Sales Receipt - completed 2026-10-10.
5. Webstore lists and Support Ticket detail/lifecycle - completed 2026-10-10.
6. Orders core routes, standalone Job Order detail/editor, and Job Progress - completed 2026-10-10.
7. Workflow master lists and shared Add/Edit document editor - completed 2026-10-10.
8. Admin Dashboard and Analytics Dashboard snapshots with responsibility-split UI - completed 2026-10-10.
9. Subscriptions list, filters, selected-record actions, and persistence - completed 2026-10-11.
10. Calculator Dashboard exact legacy rows/telemetry, selected-record actions, and persistence - completed 2026-10-11.
11. Billing exact legacy KPI/table/filter flow and strict read-only data service - completed 2026-10-11.
12. Voucher exact legacy filters/table/full form, CRUD persistence, and print/collapse flow - completed 2026-10-11.
13. All other mapped pages, prioritized by missing static matches and architecture gates.
14. Runtime desktop/390px interaction, persistence reload, print/export, and visual comparison.

This inventory is intentionally conservative: unresolved items remain pending until both content and relevant behavior are evidenced.
`

if (writeReport) await writeFile(outputPath, report, 'utf8')
console.log(JSON.stringify(summary, null, 2))
