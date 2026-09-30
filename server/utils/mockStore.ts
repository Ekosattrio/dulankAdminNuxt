// Registry koleksi mock per resource (dihasilkan otomatis).
// Seed dari server/data/*.ts; store in-memory per proses dev/server.
// Resource multi-koleksi: GET /api/<slug> mengembalikan objek { nama: [...] };

import { transactions as accountStatementTransactionsSeed } from '../data/account-statement'
import { processes as addProductProcessProcessesSeed } from '../data/add-product-process'
import { items as addPurchaseItemsSeed } from '../data/add-purchase'
import { items as addQuotationItemsSeed } from '../data/add-quotation'
import { items as addSalesItemsSeed } from '../data/add-sales'
import { flowSteps as addWorkFlowFlowstepsSeed } from '../data/add-work-flow'
import { customerAddresses as addressCustomeraddressesSeed } from '../data/address'
import { supplierAddresses as addressSupplieraddressesSeed } from '../data/address'
import { blogs as allBlogBlogsSeed } from '../data/all-blog'
import { rows as annualReportsRowsSeed } from '../data/annual-reports'
import { customers as balanceAccountCustomersSeed } from '../data/balance-account'
import { banList as banIpAddressBanlistSeed } from '../data/ban-ip-address'
import { accounts as bankAccountAccountsSeed } from '../data/bank-account'
import { accounts as bankSettingsGridAccountsSeed } from '../data/bank-settings-grid'
import { accounts as bankSettingsListAccountsSeed } from '../data/bank-settings-list'
import { mainBanners as bannerMainbannersSeed } from '../data/banner'
import { productBanners as bannerProductbannersSeed } from '../data/banner'
import { products as bestSellerProductsSeed } from '../data/best-seller'
import { billings as billingBillingsSeed } from '../data/billing'
import { categories as blogCategoryCategoriesSeed } from '../data/blog-category'
import { comments as blogCommentCommentsSeed } from '../data/blog-comment'
import { tags as blogTagTagsSeed } from '../data/blog-tag'
import { calendarProducts as calenderCalendarproductsSeed } from '../data/calender'
import { calendarSizes as calenderCalendarsizesSeed } from '../data/calender'
import { finishings as calenderFinishingsSeed } from '../data/calender'
import { boards as calenderBoardsSeed } from '../data/calender'
import { calendarLogs as calenderCalendarlogsSeed } from '../data/calender'
import { carts as cartCartsSeed } from '../data/cart'
import { cashAdvances as cashAdvanceCashadvancesSeed } from '../data/cash-advance'
import { categories as categoryCategoriesSeed } from '../data/category'
import { products as cetakFullColorProductsSeed } from '../data/cetak-full-color'
import { checkouts as checkoutCheckoutsSeed } from '../data/checkout'
import { messages as contactFormMessagesSeed } from '../data/contact-form'
import { coupons as couponCouponsSeed } from '../data/coupon'
import { currencies as currencySettingsCurrenciesSeed } from '../data/currency-settings'
import { customFields as customFieldCustomfieldsSeed } from '../data/custom-field'
import { dues as customerDueReportDuesSeed } from '../data/customer-due-report'
import { customers as customerReportCustomersSeed } from '../data/customer-report'
import { customerTypes as customerTypeCustomertypesSeed } from '../data/customer-type'
import { customers as customersCustomersSeed } from '../data/customers'
import { requests as deleteAccountRequestsSeed } from '../data/delete-account'
import { deliveryNotes as deliveryNoteDeliverynotesSeed } from '../data/delivery-note'
import { departments as departmentDepartmentsSeed } from '../data/department'
import { designations as designationDesignationsSeed } from '../data/designation'
import { plans as discountPlanPlansSeed } from '../data/discount-plan'
import { discounts as discountDiscountsSeed } from '../data/discount'
import { districts as districtDistrictsSeed } from '../data/district'
import { fileList as downloadFilesFilelistSeed } from '../data/download-files'
import { orderProducts as editJobOrderOrderproductsSeed } from '../data/edit-job-order'
import { items as editQuotationItemsSeed } from '../data/edit-quotation'
import { flowSteps as editWorkFlowFlowstepsSeed } from '../data/edit-work-flow'
import { records as employeeSalaryRecordsSeed } from '../data/employee-salary'
import { employees as employeesEmployeesSeed } from '../data/employees'
import { categories as expenseCategoryCategoriesSeed } from '../data/expense-category'
import { rows as expenseReportRowsSeed } from '../data/expense-report'
import { expenses as expensesExpensesSeed } from '../data/expenses'
import { faqs as faqFaqsSeed } from '../data/faq'
import { categories as flowCategoryCategoriesSeed } from '../data/flow-category'
import { flowNames as flowNameFlownamesSeed } from '../data/flow-name'
import { templates as flowTemplateTemplatesSeed } from '../data/flow-template'
import { items as hargaJasaLainyaItemsSeed } from '../data/harga-jasa-lainya'
import { incentives as incentiveIncentivesSeed } from '../data/incentive'
import { categories as incomeCategoryCategoriesSeed } from '../data/income-category'
import { rows as incomeReportRowsSeed } from '../data/income-report'
import { incomes as incomeIncomesSeed } from '../data/income'
import { invoices as inputTaxInvoicesSeed } from '../data/input-tax'
import { rows as invoiceReportRowsSeed } from '../data/invoice-report'
import { invoices as invoiceInvoicesSeed } from '../data/invoice'
import { jobs as jobBranchJobsSeed } from '../data/job-branch'
import { flowCategories as jobListFlowcategoriesSeed } from '../data/job-list'
import { jobs as jobListJobsSeed } from '../data/job-list'
import { jobOrders as jobOrderJobordersSeed } from '../data/job-order'
import { progressList as jobProgressProgresslistSeed } from '../data/job-progress'
import { tableData as kalkulatorDashboardTabledataSeed } from '../data/kalkulator-dashboard'
import { groups as kertasGroupSelfGroupsSeed } from '../data/kertas-group-self'
import { groups as kertasGroupGroupsSeed } from '../data/kertas-group'
import { prices as kertasHargaSelfPricesSeed } from '../data/kertas-harga-self'
import { prices as kertasHargaPricesSeed } from '../data/kertas-harga'
import { items as kertasJenisSelfItemsSeed } from '../data/kertas-jenis-self'
import { paperTypes as kertasJenisPapertypesSeed } from '../data/kertas-jenis'
import { sizes as kertasUkuranSelfSizesSeed } from '../data/kertas-ukuran-self'
import { sizes as kertasUkuranSizesSeed } from '../data/kertas-ukuran'
import { components as komponenFiksComponentsSeed } from '../data/komponen-fiks'
import { components as komponenMinimumComponentsSeed } from '../data/komponen-minimum'
import { languages as languageLanguagesSeed } from '../data/language'
import { machines as mesinCetakSelfMachinesSeed } from '../data/mesin-cetak-self'
import { machines as mesinCetakMachinesSeed } from '../data/mesin-cetak'
import { laminates as mesinLaminasiSelfLaminatesSeed } from '../data/mesin-laminasi-self'
import { laminates as mesinLaminasiLaminatesSeed } from '../data/mesin-laminasi'
import { polis as mesinPoliSelfPolisSeed } from '../data/mesin-poli-self'
import { polis as mesinPoliPolisSeed } from '../data/mesin-poli'
import { ponds as mesinPondSelfPondsSeed } from '../data/mesin-pond-self'
import { ponds as mesinPondPondsSeed } from '../data/mesin-pond'
import { transfers as moneyTransferTransfersSeed } from '../data/money-transfer'
import { items as myIncentiveItemsSeed } from '../data/my-incentive'
import { jobs as myJobJobsSeed } from '../data/my-job'
import { orders as onlineOrdersOrdersSeed } from '../data/online-orders'
import { orders as ordersOrdersSeed } from '../data/orders'
import { clients as ourClientClientsSeed } from '../data/our-client'
import { invoices as outputTaxInvoicesSeed } from '../data/output-tax'
import { inflows as paymentInflowInflowsSeed } from '../data/payment-inflow'
import { outflows as paymentOutflowOutflowsSeed } from '../data/payment-outflow'
import { payments as paymentsPaymentsSeed } from '../data/payments'
import { payslips as payslipPayslipsSeed } from '../data/payslip'
import { modules as permissionsModulesSeed } from '../data/permissions'
import { orders as posOrderOrdersSeed } from '../data/pos-order'
import { products as posProductsSeed } from '../data/pos'
import { cart as posCartSeed } from '../data/pos'
import { preferences as preferencePreferencesSeed } from '../data/preference'
import { printers as printerSettingsPrintersSeed } from '../data/printer-settings'
import { products as productListProductsSeed } from '../data/product-list'
import { products as productReportProductsSeed } from '../data/product-report'
import { provinces as provinceProvincesSeed } from '../data/province'
import { categories as purchaseCategoryCategoriesSeed } from '../data/purchase-category'
import { items as purchaseItemItemsSeed } from '../data/purchase-item'
import { orders as purchaseOrderOrdersSeed } from '../data/purchase-order'
import { rows as purchaseReportRowsSeed } from '../data/purchase-report'
import { returns as purchaseReturnReturnsSeed } from '../data/purchase-return'
import { purchases as purchasePurchasesSeed } from '../data/purchase'
import { viewOrderItems as purchaseVieworderitemsSeed } from '../data/purchase'
import { quotations as quotationQuotationsSeed } from '../data/quotation'
import { regencies as regencyRegenciesSeed } from '../data/regency'
import { rfqs as requestQuotationRfqsSeed } from '../data/request-quotation'
import { reviews as reviewsReviewsSeed } from '../data/reviews'
import { roles as rolePermissionsRolesSeed } from '../data/role-permissions'
import { groups as roleGroupsSeed } from '../data/role'
import { bestSellers as salesDashboardBestsellersSeed } from '../data/sales-dashboard'
import { recentTransactions as salesDashboardRecenttransactionsSeed } from '../data/sales-dashboard'
import { countryMarkers as salesDashboardCountrymarkersSeed } from '../data/sales-dashboard'
import { rows as salesReportRowsSeed } from '../data/sales-report'
import { returns as salesReturnReturnsSeed } from '../data/sales-return'
import { salesList as salesSaleslistSeed } from '../data/sales'
import { vendors as semuaPercetakanVendorsSeed } from '../data/semua-percetakan'
import { shops as semuaTokoKertasShopsSeed } from '../data/semua-toko-kertas'
import { stores as storeListStoresSeed } from '../data/store-list'
import { subCategories as subCategorySubcategoriesSeed } from '../data/sub-category'
import { subscriptions as subscriptionsSubscriptionsSeed } from '../data/subscriptions'
import { dues as supplierDueReportDuesSeed } from '../data/supplier-due-report'
import { rows as supplierReportRowsSeed } from '../data/supplier-report'
import { suppliers as supplierSuppliersSeed } from '../data/supplier'
import { activityList as supportTicketDetailActivitylistSeed } from '../data/support-ticket-detail'
import { messages as supportTicketDetailMessagesSeed } from '../data/support-ticket-detail'
import { tickets as supportTicketTicketsSeed } from '../data/support-ticket'
import { taxRates as taxRatesTaxratesSeed } from '../data/tax-rates'
import { rows as taxReportRowsSeed } from '../data/tax-report'
import { activityList as ticketDetailActivitylistSeed } from '../data/ticket-detail'
import { messages as ticketDetailMessagesSeed } from '../data/ticket-detail'
import { tickets as ticketListTicketsSeed } from '../data/ticket-list'
import { units as unitUnitsSeed } from '../data/unit'
import { admins as userAdminAdminsSeed } from '../data/user-admin'
import { users as userUsersSeed } from '../data/user'
import { variants as variantVariantsSeed } from '../data/variant'
import { coupons as voucherCouponsSeed } from '../data/voucher'
import { wishlist as wishlistWishlistSeed } from '../data/wishlist'
import { workflows as workFlowWorkflowsSeed } from '../data/work-flow'

const seeds: Record<string, { names: string[]; cols: Record<string, unknown[]> }> = {
  'account-statement': {
    names: ['transactions'],
    cols: {
      transactions: accountStatementTransactionsSeed,
    },
  },
  'add-product-process': {
    names: ['processes'],
    cols: {
      processes: addProductProcessProcessesSeed,
    },
  },
  'add-purchase': {
    names: ['items'],
    cols: {
      items: addPurchaseItemsSeed,
    },
  },
  'add-quotation': {
    names: ['items'],
    cols: {
      items: addQuotationItemsSeed,
    },
  },
  'add-sales': {
    names: ['items'],
    cols: {
      items: addSalesItemsSeed,
    },
  },
  'add-work-flow': {
    names: ['flowSteps'],
    cols: {
      flowSteps: addWorkFlowFlowstepsSeed,
    },
  },
  'address': {
    names: ['customerAddresses', 'supplierAddresses'],
    cols: {
      customerAddresses: addressCustomeraddressesSeed,
      supplierAddresses: addressSupplieraddressesSeed,
    },
  },
  'all-blog': {
    names: ['blogs'],
    cols: {
      blogs: allBlogBlogsSeed,
    },
  },
  'annual-reports': {
    names: ['rows'],
    cols: {
      rows: annualReportsRowsSeed,
    },
  },
  'balance-account': {
    names: ['customers'],
    cols: {
      customers: balanceAccountCustomersSeed,
    },
  },
  'ban-ip-address': {
    names: ['banList'],
    cols: {
      banList: banIpAddressBanlistSeed,
    },
  },
  'bank-account': {
    names: ['accounts'],
    cols: {
      accounts: bankAccountAccountsSeed,
    },
  },
  'bank-settings-grid': {
    names: ['accounts'],
    cols: {
      accounts: bankSettingsGridAccountsSeed,
    },
  },
  'bank-settings-list': {
    names: ['accounts'],
    cols: {
      accounts: bankSettingsListAccountsSeed,
    },
  },
  'banner': {
    names: ['mainBanners', 'productBanners'],
    cols: {
      mainBanners: bannerMainbannersSeed,
      productBanners: bannerProductbannersSeed,
    },
  },
  'best-seller': {
    names: ['products'],
    cols: {
      products: bestSellerProductsSeed,
    },
  },
  'billing': {
    names: ['billings'],
    cols: {
      billings: billingBillingsSeed,
    },
  },
  'blog-category': {
    names: ['categories'],
    cols: {
      categories: blogCategoryCategoriesSeed,
    },
  },
  'blog-comment': {
    names: ['comments'],
    cols: {
      comments: blogCommentCommentsSeed,
    },
  },
  'blog-tag': {
    names: ['tags'],
    cols: {
      tags: blogTagTagsSeed,
    },
  },
  'calender': {
    names: ['calendarProducts', 'calendarSizes', 'finishings', 'boards', 'calendarLogs'],
    cols: {
      calendarProducts: calenderCalendarproductsSeed,
      calendarSizes: calenderCalendarsizesSeed,
      finishings: calenderFinishingsSeed,
      boards: calenderBoardsSeed,
      calendarLogs: calenderCalendarlogsSeed,
    },
  },
  'cart': {
    names: ['carts'],
    cols: {
      carts: cartCartsSeed,
    },
  },
  'cash-advance': {
    names: ['cashAdvances'],
    cols: {
      cashAdvances: cashAdvanceCashadvancesSeed,
    },
  },
  'category': {
    names: ['categories'],
    cols: {
      categories: categoryCategoriesSeed,
    },
  },
  'cetak-full-color': {
    names: ['products'],
    cols: {
      products: cetakFullColorProductsSeed,
    },
  },
  'checkout': {
    names: ['checkouts'],
    cols: {
      checkouts: checkoutCheckoutsSeed,
    },
  },
  'contact-form': {
    names: ['messages'],
    cols: {
      messages: contactFormMessagesSeed,
    },
  },
  'coupon': {
    names: ['coupons'],
    cols: {
      coupons: couponCouponsSeed,
    },
  },
  'currency-settings': {
    names: ['currencies'],
    cols: {
      currencies: currencySettingsCurrenciesSeed,
    },
  },
  'custom-field': {
    names: ['customFields'],
    cols: {
      customFields: customFieldCustomfieldsSeed,
    },
  },
  'customer-due-report': {
    names: ['dues'],
    cols: {
      dues: customerDueReportDuesSeed,
    },
  },
  'customer-report': {
    names: ['customers'],
    cols: {
      customers: customerReportCustomersSeed,
    },
  },
  'customer-type': {
    names: ['customerTypes'],
    cols: {
      customerTypes: customerTypeCustomertypesSeed,
    },
  },
  'customers': {
    names: ['customers'],
    cols: {
      customers: customersCustomersSeed,
    },
  },
  'delete-account': {
    names: ['requests'],
    cols: {
      requests: deleteAccountRequestsSeed,
    },
  },
  'delivery-note': {
    names: ['deliveryNotes'],
    cols: {
      deliveryNotes: deliveryNoteDeliverynotesSeed,
    },
  },
  'department': {
    names: ['departments'],
    cols: {
      departments: departmentDepartmentsSeed,
    },
  },
  'designation': {
    names: ['designations'],
    cols: {
      designations: designationDesignationsSeed,
    },
  },
  'discount-plan': {
    names: ['plans'],
    cols: {
      plans: discountPlanPlansSeed,
    },
  },
  'discount': {
    names: ['discounts'],
    cols: {
      discounts: discountDiscountsSeed,
    },
  },
  'district': {
    names: ['districts'],
    cols: {
      districts: districtDistrictsSeed,
    },
  },
  'download-files': {
    names: ['fileList'],
    cols: {
      fileList: downloadFilesFilelistSeed,
    },
  },
  'edit-job-order': {
    names: ['orderProducts'],
    cols: {
      orderProducts: editJobOrderOrderproductsSeed,
    },
  },
  'edit-quotation': {
    names: ['items'],
    cols: {
      items: editQuotationItemsSeed,
    },
  },
  'edit-work-flow': {
    names: ['flowSteps'],
    cols: {
      flowSteps: editWorkFlowFlowstepsSeed,
    },
  },
  'employee-salary': {
    names: ['records'],
    cols: {
      records: employeeSalaryRecordsSeed,
    },
  },
  'employees': {
    names: ['employees'],
    cols: {
      employees: employeesEmployeesSeed,
    },
  },
  'expense-category': {
    names: ['categories'],
    cols: {
      categories: expenseCategoryCategoriesSeed,
    },
  },
  'expense-report': {
    names: ['rows'],
    cols: {
      rows: expenseReportRowsSeed,
    },
  },
  'expenses': {
    names: ['expenses'],
    cols: {
      expenses: expensesExpensesSeed,
    },
  },
  'faq': {
    names: ['faqs'],
    cols: {
      faqs: faqFaqsSeed,
    },
  },
  'flow-category': {
    names: ['categories'],
    cols: {
      categories: flowCategoryCategoriesSeed,
    },
  },
  'flow-name': {
    names: ['flowNames'],
    cols: {
      flowNames: flowNameFlownamesSeed,
    },
  },
  'flow-template': {
    names: ['templates'],
    cols: {
      templates: flowTemplateTemplatesSeed,
    },
  },
  'harga-jasa-lainya': {
    names: ['items'],
    cols: {
      items: hargaJasaLainyaItemsSeed,
    },
  },
  'incentive': {
    names: ['incentives'],
    cols: {
      incentives: incentiveIncentivesSeed,
    },
  },
  'income-category': {
    names: ['categories'],
    cols: {
      categories: incomeCategoryCategoriesSeed,
    },
  },
  'income-report': {
    names: ['rows'],
    cols: {
      rows: incomeReportRowsSeed,
    },
  },
  'income': {
    names: ['incomes'],
    cols: {
      incomes: incomeIncomesSeed,
    },
  },
  'input-tax': {
    names: ['invoices'],
    cols: {
      invoices: inputTaxInvoicesSeed,
    },
  },
  'invoice-report': {
    names: ['rows'],
    cols: {
      rows: invoiceReportRowsSeed,
    },
  },
  'invoice': {
    names: ['invoices'],
    cols: {
      invoices: invoiceInvoicesSeed,
    },
  },
  'job-branch': {
    names: ['jobs'],
    cols: {
      jobs: jobBranchJobsSeed,
    },
  },
  'job-list': {
    names: ['flowCategories', 'jobs'],
    cols: {
      flowCategories: jobListFlowcategoriesSeed,
      jobs: jobListJobsSeed,
    },
  },
  'job-order': {
    names: ['jobOrders'],
    cols: {
      jobOrders: jobOrderJobordersSeed,
    },
  },
  'job-progress': {
    names: ['progressList'],
    cols: {
      progressList: jobProgressProgresslistSeed,
    },
  },
  'kalkulator-dashboard': {
    names: ['tableData'],
    cols: {
      tableData: kalkulatorDashboardTabledataSeed,
    },
  },
  'kertas-group-self': {
    names: ['groups'],
    cols: {
      groups: kertasGroupSelfGroupsSeed,
    },
  },
  'kertas-group': {
    names: ['groups'],
    cols: {
      groups: kertasGroupGroupsSeed,
    },
  },
  'kertas-harga-self': {
    names: ['prices'],
    cols: {
      prices: kertasHargaSelfPricesSeed,
    },
  },
  'kertas-harga': {
    names: ['prices'],
    cols: {
      prices: kertasHargaPricesSeed,
    },
  },
  'kertas-jenis-self': {
    names: ['items'],
    cols: {
      items: kertasJenisSelfItemsSeed,
    },
  },
  'kertas-jenis': {
    names: ['paperTypes'],
    cols: {
      paperTypes: kertasJenisPapertypesSeed,
    },
  },
  'kertas-ukuran-self': {
    names: ['sizes'],
    cols: {
      sizes: kertasUkuranSelfSizesSeed,
    },
  },
  'kertas-ukuran': {
    names: ['sizes'],
    cols: {
      sizes: kertasUkuranSizesSeed,
    },
  },
  'komponen-fiks': {
    names: ['components'],
    cols: {
      components: komponenFiksComponentsSeed,
    },
  },
  'komponen-minimum': {
    names: ['components'],
    cols: {
      components: komponenMinimumComponentsSeed,
    },
  },
  'language': {
    names: ['languages'],
    cols: {
      languages: languageLanguagesSeed,
    },
  },
  'mesin-cetak-self': {
    names: ['machines'],
    cols: {
      machines: mesinCetakSelfMachinesSeed,
    },
  },
  'mesin-cetak': {
    names: ['machines'],
    cols: {
      machines: mesinCetakMachinesSeed,
    },
  },
  'mesin-laminasi-self': {
    names: ['laminates'],
    cols: {
      laminates: mesinLaminasiSelfLaminatesSeed,
    },
  },
  'mesin-laminasi': {
    names: ['laminates'],
    cols: {
      laminates: mesinLaminasiLaminatesSeed,
    },
  },
  'mesin-poli-self': {
    names: ['polis'],
    cols: {
      polis: mesinPoliSelfPolisSeed,
    },
  },
  'mesin-poli': {
    names: ['polis'],
    cols: {
      polis: mesinPoliPolisSeed,
    },
  },
  'mesin-pond-self': {
    names: ['ponds'],
    cols: {
      ponds: mesinPondSelfPondsSeed,
    },
  },
  'mesin-pond': {
    names: ['ponds'],
    cols: {
      ponds: mesinPondPondsSeed,
    },
  },
  'money-transfer': {
    names: ['transfers'],
    cols: {
      transfers: moneyTransferTransfersSeed,
    },
  },
  'my-incentive': {
    names: ['items'],
    cols: {
      items: myIncentiveItemsSeed,
    },
  },
  'my-job': {
    names: ['jobs'],
    cols: {
      jobs: myJobJobsSeed,
    },
  },
  'online-orders': {
    names: ['orders'],
    cols: {
      orders: onlineOrdersOrdersSeed,
    },
  },
  'orders': {
    names: ['orders'],
    cols: {
      orders: ordersOrdersSeed,
    },
  },
  'our-client': {
    names: ['clients'],
    cols: {
      clients: ourClientClientsSeed,
    },
  },
  'output-tax': {
    names: ['invoices'],
    cols: {
      invoices: outputTaxInvoicesSeed,
    },
  },
  'payment-inflow': {
    names: ['inflows'],
    cols: {
      inflows: paymentInflowInflowsSeed,
    },
  },
  'payment-outflow': {
    names: ['outflows'],
    cols: {
      outflows: paymentOutflowOutflowsSeed,
    },
  },
  'payments': {
    names: ['payments'],
    cols: {
      payments: paymentsPaymentsSeed,
    },
  },
  'payslip': {
    names: ['payslips'],
    cols: {
      payslips: payslipPayslipsSeed,
    },
  },
  'permissions': {
    names: ['modules'],
    cols: {
      modules: permissionsModulesSeed,
    },
  },
  'pos-order': {
    names: ['orders'],
    cols: {
      orders: posOrderOrdersSeed,
    },
  },
  'pos': {
    names: ['products', 'cart'],
    cols: {
      products: posProductsSeed,
      cart: posCartSeed,
    },
  },
  'preference': {
    names: ['preferences'],
    cols: {
      preferences: preferencePreferencesSeed,
    },
  },
  'printer-settings': {
    names: ['printers'],
    cols: {
      printers: printerSettingsPrintersSeed,
    },
  },
  'product-list': {
    names: ['products'],
    cols: {
      products: productListProductsSeed,
    },
  },
  'product-report': {
    names: ['products'],
    cols: {
      products: productReportProductsSeed,
    },
  },
  'province': {
    names: ['provinces'],
    cols: {
      provinces: provinceProvincesSeed,
    },
  },
  'purchase-category': {
    names: ['categories'],
    cols: {
      categories: purchaseCategoryCategoriesSeed,
    },
  },
  'purchase-item': {
    names: ['items'],
    cols: {
      items: purchaseItemItemsSeed,
    },
  },
  'purchase-order': {
    names: ['orders'],
    cols: {
      orders: purchaseOrderOrdersSeed,
    },
  },
  'purchase-report': {
    names: ['rows'],
    cols: {
      rows: purchaseReportRowsSeed,
    },
  },
  'purchase-return': {
    names: ['returns'],
    cols: {
      returns: purchaseReturnReturnsSeed,
    },
  },
  'purchase': {
    names: ['purchases', 'viewOrderItems'],
    cols: {
      purchases: purchasePurchasesSeed,
      viewOrderItems: purchaseVieworderitemsSeed,
    },
  },
  'quotation': {
    names: ['quotations'],
    cols: {
      quotations: quotationQuotationsSeed,
    },
  },
  'regency': {
    names: ['regencies'],
    cols: {
      regencies: regencyRegenciesSeed,
    },
  },
  'request-quotation': {
    names: ['rfqs'],
    cols: {
      rfqs: requestQuotationRfqsSeed,
    },
  },
  'reviews': {
    names: ['reviews'],
    cols: {
      reviews: reviewsReviewsSeed,
    },
  },
  'role-permissions': {
    names: ['roles'],
    cols: {
      roles: rolePermissionsRolesSeed,
    },
  },
  'role': {
    names: ['groups'],
    cols: {
      groups: roleGroupsSeed,
    },
  },
  'sales-dashboard': {
    names: ['bestSellers', 'recentTransactions', 'countryMarkers'],
    cols: {
      bestSellers: salesDashboardBestsellersSeed,
      recentTransactions: salesDashboardRecenttransactionsSeed,
      countryMarkers: salesDashboardCountrymarkersSeed,
    },
  },
  'sales-report': {
    names: ['rows'],
    cols: {
      rows: salesReportRowsSeed,
    },
  },
  'sales-return': {
    names: ['returns'],
    cols: {
      returns: salesReturnReturnsSeed,
    },
  },
  'sales': {
    names: ['salesList'],
    cols: {
      salesList: salesSaleslistSeed,
    },
  },
  'semua-percetakan': {
    names: ['vendors'],
    cols: {
      vendors: semuaPercetakanVendorsSeed,
    },
  },
  'semua-toko-kertas': {
    names: ['shops'],
    cols: {
      shops: semuaTokoKertasShopsSeed,
    },
  },
  'store-list': {
    names: ['stores'],
    cols: {
      stores: storeListStoresSeed,
    },
  },
  'sub-category': {
    names: ['subCategories'],
    cols: {
      subCategories: subCategorySubcategoriesSeed,
    },
  },
  'subscriptions': {
    names: ['subscriptions'],
    cols: {
      subscriptions: subscriptionsSubscriptionsSeed,
    },
  },
  'supplier-due-report': {
    names: ['dues'],
    cols: {
      dues: supplierDueReportDuesSeed,
    },
  },
  'supplier-report': {
    names: ['rows'],
    cols: {
      rows: supplierReportRowsSeed,
    },
  },
  'supplier': {
    names: ['suppliers'],
    cols: {
      suppliers: supplierSuppliersSeed,
    },
  },
  'support-ticket-detail': {
    names: ['activityList', 'messages'],
    cols: {
      activityList: supportTicketDetailActivitylistSeed,
      messages: supportTicketDetailMessagesSeed,
    },
  },
  'support-ticket': {
    names: ['tickets'],
    cols: {
      tickets: supportTicketTicketsSeed,
    },
  },
  'tax-rates': {
    names: ['taxRates'],
    cols: {
      taxRates: taxRatesTaxratesSeed,
    },
  },
  'tax-report': {
    names: ['rows'],
    cols: {
      rows: taxReportRowsSeed,
    },
  },
  'ticket-detail': {
    names: ['activityList', 'messages'],
    cols: {
      activityList: ticketDetailActivitylistSeed,
      messages: ticketDetailMessagesSeed,
    },
  },
  'ticket-list': {
    names: ['tickets'],
    cols: {
      tickets: ticketListTicketsSeed,
    },
  },
  'unit': {
    names: ['units'],
    cols: {
      units: unitUnitsSeed,
    },
  },
  'user-admin': {
    names: ['admins'],
    cols: {
      admins: userAdminAdminsSeed,
    },
  },
  'user': {
    names: ['users'],
    cols: {
      users: userUsersSeed,
    },
  },
  'variant': {
    names: ['variants'],
    cols: {
      variants: variantVariantsSeed,
    },
  },
  'voucher': {
    names: ['coupons'],
    cols: {
      coupons: voucherCouponsSeed,
    },
  },
  'wishlist': {
    names: ['wishlist'],
    cols: {
      wishlist: wishlistWishlistSeed,
    },
  },
  'work-flow': {
    names: ['workflows'],
    cols: {
      workflows: workFlowWorkflowsSeed,
    },
  },
}

const store = new Map<string, Record<string, unknown[]>>()

export function isMockResource(slug: string): boolean {
  return slug in seeds
}

export function useMockCollections(slug: string): Record<string, unknown[]> {
  if (!store.has(slug)) {
    const cols: Record<string, unknown[]> = {}
    for (const name of seeds[slug]!.names) {
      cols[name] = structuredClone(seeds[slug]!.cols[name]!)
    }
    store.set(slug, cols)
  }
  return store.get(slug)!
}

/** Koleksi utama (pertama) — dipakai batch PUT / POST / DELETE. */
export function useMockCollection(slug: string): unknown[] {
  const cols = useMockCollections(slug)
  return cols[seeds[slug]!.names[0]!]
}

export function resetMockCollection(slug: string): void {
  store.delete(slug)
}
