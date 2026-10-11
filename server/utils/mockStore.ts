// Registry koleksi mock per resource (dihasilkan otomatis).
// Seed dari server/data/*.ts; store in-memory per proses dev/server.
// Resource multi-koleksi: GET /api/<slug> mengembalikan objek { nama: [...] };

import { transactions as accountStatementTransactionsSeed } from '../data/account-statement'
import { processes as addProductProcessProcessesSeed } from '../data/add-product-process'
import { items as addPurchaseItemsSeed } from '../data/add-purchase'
import { items as addQuotationItemsSeed } from '../data/add-quotation'
import { items as addSalesItemsSeed } from '../data/add-sales'
import { flowSteps as addWorkFlowFlowstepsSeed } from '../data/add-work-flow'
import { blogs as allBlogBlogsSeed } from '../data/all-blog'
import { customers as balanceAccountCustomersSeed } from '../data/balance-account'
import { accounts as bankSettingsGridAccountsSeed } from '../data/bank-settings-grid'
import { accounts as bankSettingsListAccountsSeed } from '../data/bank-settings-list'
import { billings as billingBillingsSeed } from '../data/billing'
import { calendarProducts as calenderCalendarproductsSeed } from '../data/calender'
import { calendarSizes as calenderCalendarsizesSeed } from '../data/calender'
import { finishings as calenderFinishingsSeed } from '../data/calender'
import { boards as calenderBoardsSeed } from '../data/calender'
import { calendarLogs as calenderCalendarlogsSeed } from '../data/calender'
import { products as cetakFullColorProductsSeed } from '../data/cetak-full-color'
import { coupons as couponCouponsSeed } from '../data/coupon'
import { deliveryNotes as deliveryNoteDeliverynotesSeed } from '../data/delivery-note'
import { discounts as discountDiscountsSeed } from '../data/discount'
import { orderProducts as editJobOrderOrderproductsSeed } from '../data/edit-job-order'
import { items as editQuotationItemsSeed } from '../data/edit-quotation'
import { flowSteps as editWorkFlowFlowstepsSeed } from '../data/edit-work-flow'
import { invoices as invoiceInvoicesSeed } from '../data/invoice'
import { orders as onlineOrdersOrdersSeed } from '../data/online-orders'
import { inflows as paymentInflowInflowsSeed } from '../data/payment-inflow'
import { outflows as paymentOutflowOutflowsSeed } from '../data/payment-outflow'
import { orders as posOrderOrdersSeed } from '../data/pos-order'
import { products as posProductsSeed } from '../data/pos'
import { cart as posCartSeed } from '../data/pos'
import { preferences as preferencePreferencesSeed } from '../data/preference'
import { products as productListProductsSeed } from '../data/product-list'
import { quotations as quotationQuotationsSeed } from '../data/quotation'
import { rfqs as requestQuotationRfqsSeed } from '../data/request-quotation'
import { returns as salesReturnReturnsSeed } from '../data/sales-return'
import { salesList as salesSaleslistSeed } from '../data/sales'
import { vendors as semuaPercetakanVendorsSeed } from '../data/semua-percetakan'
import { shops as semuaTokoKertasShopsSeed } from '../data/semua-toko-kertas'
import { stores as storeListStoresSeed } from '../data/store-list'

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
  'all-blog': {
    names: ['blogs'],
    cols: {
      blogs: allBlogBlogsSeed,
    },
  },
  'balance-account': {
    names: ['customers'],
    cols: {
      customers: balanceAccountCustomersSeed,
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
  'billing': {
    names: ['billings'],
    cols: {
      billings: billingBillingsSeed,
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
  'cetak-full-color': {
    names: ['products'],
    cols: {
      products: cetakFullColorProductsSeed,
    },
  },
  'coupon': {
    names: ['coupons'],
    cols: {
      coupons: couponCouponsSeed,
    },
  },
  'delivery-note': {
    names: ['deliveryNotes'],
    cols: {
      deliveryNotes: deliveryNoteDeliverynotesSeed,
    },
  },
  'discount': {
    names: ['discounts'],
    cols: {
      discounts: discountDiscountsSeed,
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
  'invoice': {
    names: ['invoices'],
    cols: {
      invoices: invoiceInvoicesSeed,
    },
  },
  'online-orders': {
    names: ['orders'],
    cols: {
      orders: onlineOrdersOrdersSeed,
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
  'product-list': {
    names: ['products'],
    cols: {
      products: productListProductsSeed,
    },
  },
  'quotation': {
    names: ['quotations'],
    cols: {
      quotations: quotationQuotationsSeed,
    },
  },
  'request-quotation': {
    names: ['rfqs'],
    cols: {
      rfqs: requestQuotationRfqsSeed,
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
  return cols[seeds[slug]!.names[0]!]!
}

export function resetMockCollection(slug: string): void {
  store.delete(slug)
}
