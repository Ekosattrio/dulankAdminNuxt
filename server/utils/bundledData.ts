import banIpData from '../data/ban-ip.json'
import billingData from '../data/billing.json'
import cetakFullColorData from '../data/cetak-full-color.json'
import clientsData from '../data/clients.json'
import customerTypesData from '../data/customer-types.json'
import customerAccountEntriesData from '../data/customer-account-entries.json'
import calculatorListingsData from '../data/calculator-listings.json'
import calculatorModerationHistoryData from '../data/calculator-moderation-history.json'
import calculatorPartnerMetricsData from '../data/calculator-partner-metrics.json'
import calculatorPartnersData from '../data/calculator-partners.json'
import calculatorDashboardData from '../data/calculator-dashboard.json'
import calculatorJasaLainData from '../data/calculator-jasa-lain.json'
import calculatorKomponenMinimumData from '../data/calculator-komponen-minimum.json'
import calculatorKomponenFiksData from '../data/calculator-komponen-fiks.json'
import deliveryNotesData from '../data/delivery-notes.json'
import departmentsData from '../data/departments.json'
import designationsData from '../data/designations.json'
import districtsData from '../data/districts.json'
import employeesData from '../data/employees.json'
import employeeSalariesData from '../data/employeeSalaries.json'
import flowCategoriesData from '../data/flow-categories.json'
import flowNamesData from '../data/flow-names.json'
import flowTemplatesData from '../data/flow-templates.json'
import footersData from '../data/footers.json'
import footerConfigData from '../data/footer-config.json'
import incentivesData from '../data/incentives.json'
import invoicesData from '../data/invoices.json'
import jobBranchesHistoryData from '../data/job-branches-history.json'
import jobBranchesData from '../data/job-branches.json'
import jobListData from '../data/job-list.json'
import jobOrdersData from '../data/job-orders.json'
import jobProgressData from '../data/job-progress.json'
import myIncentivesData from '../data/my-incentives.json'
import myJobsData from '../data/my-jobs.json'
import paperGroupsSelfData from '../data/paper-groups-self.json'
import paperItemsSelfData from '../data/paper-items-self.json'
import paperPricesData from '../data/paper-prices.json'
import paperSizesData from '../data/paper-sizes.json'
import paymentBalancesData from '../data/payment-balances.json'
import paymentInflowsData from '../data/payment-inflows.json'
import paymentOutflowsData from '../data/payment-outflows.json'
import permissionsData from '../data/permissions.json'
import payslipsData from '../data/payslips.json'
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
import socialAuthData from '../data/social-auth.json'
import salesData from '../data/sales.json'
import suppliersData from '../data/suppliers.json'
import subscriptionsData from '../data/subscriptions.json'
import systemIntegrationsData from '../data/system-integrations.json'
import workFlowsData from '../data/work-flows.json'
import workFlowEditorCatalogData from '../data/work-flow-editor-catalog.json'
import analyticsDashboardData from '../data/analytics-dashboard.json'
import adminDashboardData from '../data/admin-dashboard.json'
import bankSettingsData from '../data/bank-settings.json'
import currencySettingsData from '../data/currency-settings.json'
import printerSettingsData from '../data/printer-settings.json'
import smsGatewaysData from '../data/sms-gateways.json'
import paymentGatewaysData from '../data/payment-gateways.json'
import preferenceSettingsData from '../data/preference-settings.json'

export const bundledSources: Record<string, unknown> = {
  'ban-ip.json': banIpData,
  'billing.json': billingData,
  'cetak-full-color.json': cetakFullColorData,
  'clients.json': clientsData,
  'customer-types.json': customerTypesData,
  'customer-account-entries.json': customerAccountEntriesData,
  'calculator-listings.json': calculatorListingsData,
  'calculator-moderation-history.json': calculatorModerationHistoryData,
  'calculator-partner-metrics.json': calculatorPartnerMetricsData,
  'calculator-partners.json': calculatorPartnersData,
  'calculator-dashboard.json': calculatorDashboardData,
  'calculator-jasa-lain.json': calculatorJasaLainData,
  'calculator-komponen-minimum.json': calculatorKomponenMinimumData,
  'calculator-komponen-fiks.json': calculatorKomponenFiksData,
  'delivery-notes.json': deliveryNotesData,
  'departments.json': departmentsData,
  'designations.json': designationsData,
  'districts.json': districtsData,
  'employees.json': employeesData,
  'employeeSalaries.json': employeeSalariesData,
  'employee-salaries.json': employeeSalariesData,
  'flow-categories.json': flowCategoriesData,
  'flow-names.json': flowNamesData,
  'flow-templates.json': flowTemplatesData,
  'footers.json': footersData,
  'footer-config.json': footerConfigData,
  'incentives.json': incentivesData,
  'invoices.json': invoicesData,
  'job-branches-history.json': jobBranchesHistoryData,
  'job-branches.json': jobBranchesData,
  'job-list.json': jobListData,
  'job-orders.json': jobOrdersData,
  'job-progress.json': jobProgressData,
  'my-incentives.json': myIncentivesData,
  'my-jobs.json': myJobsData,
  'paper-groups-self.json': paperGroupsSelfData,
  'paper-items-self.json': paperItemsSelfData,
  'paper-prices.json': paperPricesData,
  'paper-sizes.json': paperSizesData,
  'payment-balances.json': paymentBalancesData,
  'payment-inflows.json': paymentInflowsData,
  'payment-outflows.json': paymentOutflowsData,
  'permissions.json': permissionsData,
  'payslips.json': payslipsData,
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
  'social-auth.json': socialAuthData,
  'sales.json': salesData,
  'suppliers.json': suppliersData,
  'subscriptions.json': subscriptionsData,
  'system-integrations.json': systemIntegrationsData,
  'work-flows.json': workFlowsData,
  'work-flow-editor-catalog.json': workFlowEditorCatalogData,
  'analytics-dashboard.json': analyticsDashboardData,
  'admin-dashboard.json': adminDashboardData,

  'bank-settings.json': bankSettingsData,
  'currency-settings.json': currencySettingsData,
  'printer-settings.json': printerSettingsData,
  'sms-gateways.json': smsGatewaysData,
  'payment-gateways.json': paymentGatewaysData,
  'preference-settings.json': preferenceSettingsData,
}
