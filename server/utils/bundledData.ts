import addressData from '../data/address.json'
import bannersData from '../data/banners.json'
import blogsData from '../data/blogs.json'
import blogCategoriesData from '../data/blog-categories.json'
import blogTagsData from '../data/blog-tags.json'
import blogCommentsData from '../data/blog-comments.json'
import calendarSettingsData from '../data/calendar-settings.json'
import cartsData from '../data/carts.json'
import categoriesData from '../data/categories.json'
import cetakFullColorData from '../data/cetak-full-color.json'
import checkoutsData from '../data/checkouts.json'
import clientsData from '../data/clients.json'
import companySettingData from '../data/company-setting.json'
import contactFormsData from '../data/contact-forms.json'
import customerTypesData from '../data/customer-types.json'
import customersData from '../data/customers.json'
import deliveryNotesData from '../data/delivery-notes.json'
import departmentsData from '../data/departments.json'
import designationsData from '../data/designations.json'
import districtsData from '../data/districts.json'
import downloadFilesData from '../data/download-files.json'
import emailSettingsData from '../data/email-settings.json'
import employeesData from '../data/employees.json'
import employeeSalariesData from '../data/employeeSalaries.json'
import expenseCategoriesData from '../data/expense-categories.json'
import expensesData from '../data/expenses.json'
import faqsData from '../data/faqs.json'
import faqCategoriesData from '../data/faq-categories.json'
import flowCategoriesData from '../data/flow-categories.json'
import flowNamesData from '../data/flow-names.json'
import flowTemplatesData from '../data/flow-templates.json'
import footersData from '../data/footers.json'
import footerConfigData from '../data/footer-config.json'
import incentivesData from '../data/incentives.json'
import incomesData from '../data/incomes.json'
import invoiceSettingsData from '../data/invoice-settings.json'
import invoicesData from '../data/invoices.json'
import jobBranchesHistoryData from '../data/job-branches-history.json'
import jobBranchesData from '../data/job-branches.json'
import jobListData from '../data/job-list.json'
import jobOrdersData from '../data/job-orders.json'
import languagesData from '../data/languages.json'
import myIncentivesData from '../data/my-incentives.json'
import myJobsData from '../data/my-jobs.json'
import ordersData from '../data/orders.json'
import otpSettingsData from '../data/otp-settings.json'
import paperPricesData from '../data/paper-prices.json'
import paperSizesData from '../data/paper-sizes.json'
import paymentBalancesData from '../data/payment-balances.json'
import paymentInflowsData from '../data/payment-inflows.json'
import paymentOutflowsData from '../data/payment-outflows.json'
import paymentsData from '../data/payments.json'
import payslipsData from '../data/payslips.json'
import posProductsData from '../data/pos-products.json'
import posSettingsData from '../data/pos-settings.json'
import prefixesData from '../data/prefixes.json'
import printingMachinesData from '../data/printing-machines.json'
import profileData from '../data/profile.json'
import productsData from '../data/products.json'
import provincesData from '../data/provinces.json'
import purchaseCategoriesData from '../data/purchase-categories.json'
import purchaseItemsData from '../data/purchase-items.json'
import purchaseOrdersData from '../data/purchase-orders.json'
import purchaseReturnsData from '../data/purchase-returns.json'
import purchasesData from '../data/purchases.json'
import quotationsData from '../data/quotations.json'
import regenciesData from '../data/regencies.json'
import requestQuotationsData from '../data/request-quotations.json'
import reviewsData from '../data/reviews.json'
import rolesData from '../data/roles.json'
import salesHistoryData from '../data/sales-history.json'
import salesReturnsData from '../data/sales-returns.json'
import salesVouchersData from '../data/sales-vouchers.json'
import salesData from '../data/sales.json'
import storesData from '../data/stores.json'
import subCategoriesData from '../data/sub-categories.json'
import suppliersData from '../data/suppliers.json'
import supportTicketsData from '../data/support-tickets.json'
import unitsData from '../data/units.json'
import variantsData from '../data/variants.json'
import wishlistsData from '../data/wishlists.json'
import workFlowsData from '../data/work-flows.json'
import salesReportsData from '../data/sales-reports.json'
import bestSellerReportsData from '../data/best-seller-reports.json'
import purchaseReportsData from '../data/purchase-reports.json'
import invoiceReportsData from '../data/invoice-reports.json'
import productReportsData from '../data/product-reports.json'
import expenseReportsData from '../data/expense-reports.json'
import incomeReportsData from '../data/income-reports.json'
import taxReportsData from '../data/tax-reports.json'
import profitLossReportsData from '../data/profit-loss-reports.json'
import annualReportsData from '../data/annual-reports.json'
import supplierReportsData from '../data/supplier-reports.json'
import supplierDueReportsData from '../data/supplier-due-reports.json'
import customerReportsData from '../data/customer-reports.json'
import customerDueReportsData from '../data/customer-due-reports.json'

export const bundledSources: Record<string, unknown> = {
  'address.json': addressData,
  'banners.json': bannersData,
  'blogs.json': blogsData,
  'blog-categories.json': blogCategoriesData,
  'blog-tags.json': blogTagsData,
  'blog-comments.json': blogCommentsData,
  'calendar-settings.json': calendarSettingsData,
  'carts.json': cartsData,
  'categories.json': categoriesData,
  'cetak-full-color.json': cetakFullColorData,
  'checkouts.json': checkoutsData,
  'clients.json': clientsData,
  'company-setting.json': companySettingData,
  'contact-forms.json': contactFormsData,
  'customer-types.json': customerTypesData,
  'customers.json': customersData,
  'delivery-notes.json': deliveryNotesData,
  'departments.json': departmentsData,
  'designations.json': designationsData,
  'districts.json': districtsData,
  'download-files.json': downloadFilesData,
  'email-settings.json': emailSettingsData,
  'employees.json': employeesData,
  'employeeSalaries.json': employeeSalariesData,
  'employee-salaries.json': employeeSalariesData,
  'expense-categories.json': expenseCategoriesData,
  'expenses.json': expensesData,
  'faqs.json': faqsData,
  'faq-categories.json': faqCategoriesData,
  'flow-categories.json': flowCategoriesData,
  'flow-names.json': flowNamesData,
  'flow-templates.json': flowTemplatesData,
  'footers.json': footersData,
  'footer-config.json': footerConfigData,
  'incentives.json': incentivesData,
  'incomes.json': incomesData,
  'invoice-settings.json': invoiceSettingsData,
  'invoices.json': invoicesData,
  'job-branches-history.json': jobBranchesHistoryData,
  'job-branches.json': jobBranchesData,
  'job-list.json': jobListData,
  'job-orders.json': jobOrdersData,
  'languages.json': languagesData,
  'my-incentives.json': myIncentivesData,
  'my-jobs.json': myJobsData,
  'orders.json': ordersData,
  'otp-settings.json': otpSettingsData,
  'paper-prices.json': paperPricesData,
  'paper-sizes.json': paperSizesData,
  'payment-balances.json': paymentBalancesData,
  'payment-inflows.json': paymentInflowsData,
  'payment-outflows.json': paymentOutflowsData,
  'payments.json': paymentsData,
  'payslips.json': payslipsData,
  'pos-products.json': posProductsData,
  'pos-settings.json': posSettingsData,
  'prefixes.json': prefixesData,
  'printing-machines.json': printingMachinesData,
  'profile.json': profileData,
  'products.json': productsData,
  'provinces.json': provincesData,
  'purchase-categories.json': purchaseCategoriesData,
  'purchase-items.json': purchaseItemsData,
  'purchase-orders.json': purchaseOrdersData,
  'purchase-returns.json': purchaseReturnsData,
  'purchases.json': purchasesData,
  'quotations.json': quotationsData,
  'regencies.json': regenciesData,
  'request-quotations.json': requestQuotationsData,
  'reviews.json': reviewsData,
  'roles.json': rolesData,
  'sales-history.json': salesHistoryData,
  'sales-returns.json': salesReturnsData,
  'sales-vouchers.json': salesVouchersData,
  'sales.json': salesData,
  'stores.json': storesData,
  'sub-categories.json': subCategoriesData,
  'suppliers.json': suppliersData,
  'support-tickets.json': supportTicketsData,
  'units.json': unitsData,
  'variants.json': variantsData,
  'wishlists.json': wishlistsData,
  'work-flows.json': workFlowsData,
  'sales-reports.json': salesReportsData,
  'best-seller-reports.json': bestSellerReportsData,
  'purchase-reports.json': purchaseReportsData,
  'invoice-reports.json': invoiceReportsData,
  'product-reports.json': productReportsData,
  'expense-reports.json': expenseReportsData,
  'income-reports.json': incomeReportsData,
  'tax-reports.json': taxReportsData,
  'profit-loss-reports.json': profitLossReportsData,
  'annual-reports.json': annualReportsData,
  'supplier-reports.json': supplierReportsData,
  'supplier-due-reports.json': supplierDueReportsData,
  'customer-reports.json': customerReportsData,
  'customer-due-reports.json': customerDueReportsData,
}
