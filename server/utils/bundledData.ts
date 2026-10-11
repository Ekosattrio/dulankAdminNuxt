import banIpData from '../data/ban-ip.json'
import billingData from '../data/billing.json'
import cetakFullColorData from '../data/cetak-full-color.json'
import clientsData from '../data/clients.json'
import customerTypesData from '../data/customer-types.json'
import customerAccountEntriesData from '../data/customer-account-entries.json'
import deliveryNotesData from '../data/delivery-notes.json'
import districtsData from '../data/districts.json'
import footersData from '../data/footers.json'
import footerConfigData from '../data/footer-config.json'
import invoicesData from '../data/invoices.json'
import paymentBalancesData from '../data/payment-balances.json'
import paymentInflowsData from '../data/payment-inflows.json'
import paymentOutflowsData from '../data/payment-outflows.json'
import posProductsData from '../data/pos-products.json'
import prefixesData from '../data/prefixes.json'
import printingMachinesData from '../data/printing-machines.json'
import provincesData from '../data/provinces.json'
import purchasesData from '../data/purchases.json'
import quotationsData from '../data/quotations.json'
import regenciesData from '../data/regencies.json'
import requestQuotationsData from '../data/request-quotations.json'
import salesHistoryData from '../data/sales-history.json'
import salesReturnsData from '../data/sales-returns.json'
import salesVouchersData from '../data/sales-vouchers.json'
import salesData from '../data/sales.json'
import suppliersData from '../data/suppliers.json'
import workFlowsData from '../data/work-flows.json'
import workFlowEditorCatalogData from '../data/work-flow-editor-catalog.json'
import analyticsDashboardData from '../data/analytics-dashboard.json'
import adminDashboardData from '../data/admin-dashboard.json'
import preferenceSettingsData from '../data/preference-settings.json'

export const bundledSources: Record<string, unknown> = {
  'ban-ip.json': banIpData,
  'billing.json': billingData,
  'cetak-full-color.json': cetakFullColorData,
  'clients.json': clientsData,
  'customer-types.json': customerTypesData,
  'customer-account-entries.json': customerAccountEntriesData,
  'delivery-notes.json': deliveryNotesData,
  'districts.json': districtsData,
  'footers.json': footersData,
  'footer-config.json': footerConfigData,
  'invoices.json': invoicesData,
  'payment-balances.json': paymentBalancesData,
  'payment-inflows.json': paymentInflowsData,
  'payment-outflows.json': paymentOutflowsData,
  'pos-products.json': posProductsData,
  'prefixes.json': prefixesData,
  'printing-machines.json': printingMachinesData,
  'provinces.json': provincesData,
  'purchases.json': purchasesData,
  'quotations.json': quotationsData,
  'regencies.json': regenciesData,
  'request-quotations.json': requestQuotationsData,
  'sales-history.json': salesHistoryData,
  'sales-returns.json': salesReturnsData,
  'sales-vouchers.json': salesVouchersData,
  'sales.json': salesData,
  'suppliers.json': suppliersData,
  'work-flows.json': workFlowsData,
  'work-flow-editor-catalog.json': workFlowEditorCatalogData,
  'analytics-dashboard.json': analyticsDashboardData,
  'admin-dashboard.json': adminDashboardData,

  'preference-settings.json': preferenceSettingsData,
}
