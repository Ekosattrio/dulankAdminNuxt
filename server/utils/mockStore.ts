// Registry koleksi mock per resource (dihasilkan otomatis).
// Seed dari server/data/*.ts; store in-memory per proses dev/server.
// Resource multi-array (address, banner, job-list, pos, sales-dashboard)
// TIDAK ada di sini — hanya read-only via endpoint GET-nya masing-masing.

import { processes as addProductProcessSeed } from '../data/add-product-process'
import { items as addQuotationSeed } from '../data/add-quotation'
import { items as addSalesSeed } from '../data/add-sales'
import { flowSteps as addWorkFlowSeed } from '../data/add-work-flow'
import { blogs as allBlogSeed } from '../data/all-blog'
import { banList as banIpAddressSeed } from '../data/ban-ip-address'
import { accounts as bankSettingsGridSeed } from '../data/bank-settings-grid'
import { accounts as bankSettingsListSeed } from '../data/bank-settings-list'
import { products as bestSellerSeed } from '../data/best-seller'
import { billings as billingSeed } from '../data/billing'
import { categories as blogCategorySeed } from '../data/blog-category'
import { comments as blogCommentSeed } from '../data/blog-comment'
import { tags as blogTagSeed } from '../data/blog-tag'
import { carts as cartSeed } from '../data/cart'
import { cashAdvances as cashAdvanceSeed } from '../data/cash-advance'
import { categories as categorySeed } from '../data/category'
import { products as cetakFullColorSeed } from '../data/cetak-full-color'
import { checkouts as checkoutSeed } from '../data/checkout'
import { messages as contactFormSeed } from '../data/contact-form'
import { coupons as couponSeed } from '../data/coupon'
import { currencies as currencySettingsSeed } from '../data/currency-settings'
import { customFields as customFieldSeed } from '../data/custom-field'
import { customerTypes as customerTypeSeed } from '../data/customer-type'
import { customers as customersSeed } from '../data/customers'
import { deliveryNotes as deliveryNoteSeed } from '../data/delivery-note'
import { departments as departmentSeed } from '../data/department'
import { designations as designationSeed } from '../data/designation'
import { plans as discountPlanSeed } from '../data/discount-plan'
import { discounts as discountSeed } from '../data/discount'
import { districts as districtSeed } from '../data/district'
import { fileList as downloadFilesSeed } from '../data/download-files'
import { orderProducts as editJobOrderSeed } from '../data/edit-job-order'
import { items as editQuotationSeed } from '../data/edit-quotation'
import { flowSteps as editWorkFlowSeed } from '../data/edit-work-flow'
import { records as employeeSalarySeed } from '../data/employee-salary'
import { employees as employeesSeed } from '../data/employees'
import { faqs as faqSeed } from '../data/faq'
import { categories as flowCategorySeed } from '../data/flow-category'
import { flowNames as flowNameSeed } from '../data/flow-name'
import { templates as flowTemplateSeed } from '../data/flow-template'
import { items as hargaJasaLainyaSeed } from '../data/harga-jasa-lainya'
import { incentives as incentiveSeed } from '../data/incentive'
import { categories as incomeCategorySeed } from '../data/income-category'
import { incomes as incomeSeed } from '../data/income'
import { invoices as inputTaxSeed } from '../data/input-tax'
import { invoices as invoiceSeed } from '../data/invoice'
import { jobs as jobBranchSeed } from '../data/job-branch'
import { jobOrders as jobOrderSeed } from '../data/job-order'
import { progressList as jobProgressSeed } from '../data/job-progress'
import { tableData as kalkulatorDashboardSeed } from '../data/kalkulator-dashboard'
import { groups as kertasGroupSelfSeed } from '../data/kertas-group-self'
import { groups as kertasGroupSeed } from '../data/kertas-group'
import { prices as kertasHargaSelfSeed } from '../data/kertas-harga-self'
import { prices as kertasHargaSeed } from '../data/kertas-harga'
import { items as kertasJenisSelfSeed } from '../data/kertas-jenis-self'
import { paperTypes as kertasJenisSeed } from '../data/kertas-jenis'
import { sizes as kertasUkuranSelfSeed } from '../data/kertas-ukuran-self'
import { sizes as kertasUkuranSeed } from '../data/kertas-ukuran'
import { components as komponenFiksSeed } from '../data/komponen-fiks'
import { components as komponenMinimumSeed } from '../data/komponen-minimum'
import { languages as languageSeed } from '../data/language'
import { machines as mesinCetakSelfSeed } from '../data/mesin-cetak-self'
import { machines as mesinCetakSeed } from '../data/mesin-cetak'
import { laminates as mesinLaminasiSelfSeed } from '../data/mesin-laminasi-self'
import { laminates as mesinLaminasiSeed } from '../data/mesin-laminasi'
import { polis as mesinPoliSelfSeed } from '../data/mesin-poli-self'
import { polis as mesinPoliSeed } from '../data/mesin-poli'
import { ponds as mesinPondSelfSeed } from '../data/mesin-pond-self'
import { ponds as mesinPondSeed } from '../data/mesin-pond'
import { transfers as moneyTransferSeed } from '../data/money-transfer'
import { items as myIncentiveSeed } from '../data/my-incentive'
import { jobs as myJobSeed } from '../data/my-job'
import { orders as onlineOrdersSeed } from '../data/online-orders'
import { orders as ordersSeed } from '../data/orders'
import { clients as ourClientSeed } from '../data/our-client'
import { invoices as outputTaxSeed } from '../data/output-tax'
import { inflows as paymentInflowSeed } from '../data/payment-inflow'
import { outflows as paymentOutflowSeed } from '../data/payment-outflow'
import { payments as paymentsSeed } from '../data/payments'
import { payslips as payslipSeed } from '../data/payslip'
import { modules as permissionsSeed } from '../data/permissions'
import { orders as posOrderSeed } from '../data/pos-order'
import { preferences as preferenceSeed } from '../data/preference'
import { printers as printerSettingsSeed } from '../data/printer-settings'
import { products as productListSeed } from '../data/product-list'
import { provinces as provinceSeed } from '../data/province'
import { quotations as quotationSeed } from '../data/quotation'
import { regencies as regencySeed } from '../data/regency'
import { rfqs as requestQuotationSeed } from '../data/request-quotation'
import { reviews as reviewsSeed } from '../data/reviews'
import { roles as rolePermissionsSeed } from '../data/role-permissions'
import { groups as roleSeed } from '../data/role'
import { returns as salesReturnSeed } from '../data/sales-return'
import { salesList as salesSeed } from '../data/sales'
import { vendors as semuaPercetakanSeed } from '../data/semua-percetakan'
import { shops as semuaTokoKertasSeed } from '../data/semua-toko-kertas'
import { stores as storeListSeed } from '../data/store-list'
import { subCategories as subCategorySeed } from '../data/sub-category'
import { subscriptions as subscriptionsSeed } from '../data/subscriptions'
import { suppliers as supplierSeed } from '../data/supplier'
import { tickets as supportTicketSeed } from '../data/support-ticket'
import { taxRates as taxRatesSeed } from '../data/tax-rates'
import { tickets as ticketListSeed } from '../data/ticket-list'
import { units as unitSeed } from '../data/unit'
import { admins as userAdminSeed } from '../data/user-admin'
import { users as userSeed } from '../data/user'
import { variants as variantSeed } from '../data/variant'
import { coupons as voucherSeed } from '../data/voucher'
import { wishlist as wishlistSeed } from '../data/wishlist'
import { workflows as workFlowSeed } from '../data/work-flow'

const seeds: Record<string, unknown[]> = {
  'add-product-process': addProductProcessSeed,
  'add-quotation': addQuotationSeed,
  'add-sales': addSalesSeed,
  'add-work-flow': addWorkFlowSeed,
  'all-blog': allBlogSeed,
  'ban-ip-address': banIpAddressSeed,
  'bank-settings-grid': bankSettingsGridSeed,
  'bank-settings-list': bankSettingsListSeed,
  'best-seller': bestSellerSeed,
  'billing': billingSeed,
  'blog-category': blogCategorySeed,
  'blog-comment': blogCommentSeed,
  'blog-tag': blogTagSeed,
  'cart': cartSeed,
  'cash-advance': cashAdvanceSeed,
  'category': categorySeed,
  'cetak-full-color': cetakFullColorSeed,
  'checkout': checkoutSeed,
  'contact-form': contactFormSeed,
  'coupon': couponSeed,
  'currency-settings': currencySettingsSeed,
  'custom-field': customFieldSeed,
  'customer-type': customerTypeSeed,
  'customers': customersSeed,
  'delivery-note': deliveryNoteSeed,
  'department': departmentSeed,
  'designation': designationSeed,
  'discount-plan': discountPlanSeed,
  'discount': discountSeed,
  'district': districtSeed,
  'download-files': downloadFilesSeed,
  'edit-job-order': editJobOrderSeed,
  'edit-quotation': editQuotationSeed,
  'edit-work-flow': editWorkFlowSeed,
  'employee-salary': employeeSalarySeed,
  'employees': employeesSeed,
  'faq': faqSeed,
  'flow-category': flowCategorySeed,
  'flow-name': flowNameSeed,
  'flow-template': flowTemplateSeed,
  'harga-jasa-lainya': hargaJasaLainyaSeed,
  'incentive': incentiveSeed,
  'income-category': incomeCategorySeed,
  'income': incomeSeed,
  'input-tax': inputTaxSeed,
  'invoice': invoiceSeed,
  'job-branch': jobBranchSeed,
  'job-order': jobOrderSeed,
  'job-progress': jobProgressSeed,
  'kalkulator-dashboard': kalkulatorDashboardSeed,
  'kertas-group-self': kertasGroupSelfSeed,
  'kertas-group': kertasGroupSeed,
  'kertas-harga-self': kertasHargaSelfSeed,
  'kertas-harga': kertasHargaSeed,
  'kertas-jenis-self': kertasJenisSelfSeed,
  'kertas-jenis': kertasJenisSeed,
  'kertas-ukuran-self': kertasUkuranSelfSeed,
  'kertas-ukuran': kertasUkuranSeed,
  'komponen-fiks': komponenFiksSeed,
  'komponen-minimum': komponenMinimumSeed,
  'language': languageSeed,
  'mesin-cetak-self': mesinCetakSelfSeed,
  'mesin-cetak': mesinCetakSeed,
  'mesin-laminasi-self': mesinLaminasiSelfSeed,
  'mesin-laminasi': mesinLaminasiSeed,
  'mesin-poli-self': mesinPoliSelfSeed,
  'mesin-poli': mesinPoliSeed,
  'mesin-pond-self': mesinPondSelfSeed,
  'mesin-pond': mesinPondSeed,
  'money-transfer': moneyTransferSeed,
  'my-incentive': myIncentiveSeed,
  'my-job': myJobSeed,
  'online-orders': onlineOrdersSeed,
  'orders': ordersSeed,
  'our-client': ourClientSeed,
  'output-tax': outputTaxSeed,
  'payment-inflow': paymentInflowSeed,
  'payment-outflow': paymentOutflowSeed,
  'payments': paymentsSeed,
  'payslip': payslipSeed,
  'permissions': permissionsSeed,
  'pos-order': posOrderSeed,
  'preference': preferenceSeed,
  'printer-settings': printerSettingsSeed,
  'product-list': productListSeed,
  'province': provinceSeed,
  'quotation': quotationSeed,
  'regency': regencySeed,
  'request-quotation': requestQuotationSeed,
  'reviews': reviewsSeed,
  'role-permissions': rolePermissionsSeed,
  'role': roleSeed,
  'sales-return': salesReturnSeed,
  'sales': salesSeed,
  'semua-percetakan': semuaPercetakanSeed,
  'semua-toko-kertas': semuaTokoKertasSeed,
  'store-list': storeListSeed,
  'sub-category': subCategorySeed,
  'subscriptions': subscriptionsSeed,
  'supplier': supplierSeed,
  'support-ticket': supportTicketSeed,
  'tax-rates': taxRatesSeed,
  'ticket-list': ticketListSeed,
  'unit': unitSeed,
  'user-admin': userAdminSeed,
  'user': userSeed,
  'variant': variantSeed,
  'voucher': voucherSeed,
  'wishlist': wishlistSeed,
  'work-flow': workFlowSeed,
}

const store = new Map<string, unknown[]>()

export function isMockResource(slug: string): boolean {
  return slug in seeds
}

export function useMockCollection(slug: string): unknown[] {
  if (!store.has(slug)) store.set(slug, structuredClone(seeds[slug]!))
  return store.get(slug)!
}

export function resetMockCollection(slug: string): void {
  store.delete(slug)
}
