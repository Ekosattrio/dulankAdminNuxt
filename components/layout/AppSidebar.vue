<script setup lang="ts">
import { useThemeStore } from '~/stores/theme'

const route = useRoute()
const themeStore = useThemeStore()

interface SubmenuItem {
  title: string
  to: string
}

interface MenuItem {
  title: string
  icon?: string
  to?: string
  submenus?: SubmenuItem[]
}

interface MenuGroup {
  header: string
  items: MenuItem[]
}

const openMenus = ref<Record<string, boolean>>({})

const toggleSubmenu = (key: string) => {
  openMenus.value[key] = !openMenus.value[key]
}

const isRouteActive = (to?: string, submenus?: SubmenuItem[]) => {
  if (to) {
    if (to === '/' && route.path === '/') return true
    if (to !== '/' && (route.path === to || route.path === `${to}.html` || route.path.startsWith(`${to}/`))) return true
  }
  if (submenus) {
    return submenus.some(s => route.path === s.to || route.path === `${s.to}.html` || route.path.startsWith(`${s.to}/`))
  }
  return false
}

const menuGroups: MenuGroup[] = [
  {
    header: 'DASHBOARD',
    items: [
      {
        title: 'Super Admin',
        icon: 'grid',
        submenus: [
          { title: 'Dashboard Admin', to: '/' },
          { title: 'Subscriptions', to: '/subscriptions' }
        ]
      },
      { title: 'Sales Dashboard', icon: 'trending-up', to: '/sales-dashboard' },
      { title: 'Kalkulator Dashboard', icon: 'percent', to: '/kalkulator-dashboard' },
      { title: 'Analytics Dashboard', icon: 'bar-chart', to: '/analytics-dashboard' }
    ]
  },
  {
    header: 'SALES',
    items: [
      { title: 'Sales', icon: 'trending-up', to: '/sales' },
      { title: 'Invoice', icon: 'file-text', to: '/invoice' },
      { title: 'Delivery Note', icon: 'file-text', to: '/delivery-note' },
      { title: 'Sales Return', icon: 'git-pull-request', to: '/sales-return' },
      { title: 'Quotation', icon: 'save', to: '/quotation' },
      { title: 'Request For Quotation', icon: 'save', to: '/request-quotation' },
      { title: 'POS', icon: 'hard-drive', to: '/pos' }
    ]
  },
  {
    header: 'PAYMENT',
    items: [
      { title: 'Payment-IN', icon: 'shopping-bag', to: '/payment-inflow' },
      { title: 'Payment-OUT', icon: 'file-minus', to: '/payment-outflow' }
    ]
  },
  {
    header: 'WORKFLOW',
    items: [
      { title: 'Flow Category', icon: 'grid', to: '/flow-category' },
      { title: 'Flow Name', icon: 'grid', to: '/flow-name' },
      { title: 'Flow Template', icon: 'grid', to: '/flow-template' },
      { title: 'Work Flow', icon: 'grid', to: '/work-flow' }
    ]
  },
  {
    header: 'ORDERS',
    items: [
      { title: 'Orders', icon: 'shopping-bag', to: '/orders' },
      { title: 'Job Orders', icon: 'clipboard', to: '/job-order' },
      { title: 'Job List', icon: 'clipboard', to: '/job-list' },
      { title: 'Job Branch', icon: 'git-branch', to: '/job-branch' },
      { title: 'My Job', icon: 'check-square', to: '/my-job' },
      { title: 'My Incentive', icon: 'dollar-sign', to: '/my-incentive' }
    ]
  },
  {
    header: 'CALCULATOR APPS',
    items: [
      { title: 'All Printing Shop', icon: 'copy', to: '/semua-percetakan' },
      {
        title: 'All Machine',
        icon: 'printer',
        submenus: [
          { title: 'Offset', to: '/mesin-cetak' },
          { title: 'Laminate', to: '/mesin-laminasi' },
          { title: 'Die Cutting', to: '/mesin-pond' },
          { title: 'Hot Print', to: '/mesin-poli' }
        ]
      },
      { title: 'All Paper Shop', icon: 'credit-card', to: '/semua-toko-kertas' },
      {
        title: 'All Papers',
        icon: 'file-text',
        submenus: [
          { title: 'Paper Group', to: '/kertas-group' },
          { title: 'Paper Size', to: '/kertas-ukuran' },
          { title: 'Paper Type', to: '/kertas-jenis' },
          { title: 'Paper Price', to: '/kertas-harga' }
        ]
      }
    ]
  },
  {
    header: 'PRODUCTS & SERVICES',
    items: [
      { title: 'Create Product', icon: 'plus-square', to: '/create-product' },
      {
        title: 'Custom Category',
        icon: 'gift',
        submenus: [
          { title: 'Cetak Full Color', to: '/cetak-full-color' },
          { title: 'Calender', to: '/calender' }
        ]
      },
      {
        title: 'Services Category',
        icon: 'list',
        submenus: [
          { title: 'Printing', to: '/mesin-cetak-self' },
          { title: 'Laminate', to: '/mesin-laminasi-self' },
          { title: 'Die Cutting', to: '/mesin-pond-self' },
          { title: 'Hot Print', to: '/mesin-poli-self' }
        ]
      },
      { title: 'Product List', icon: 'box', to: '/product-list' }
    ]
  },
  {
    header: 'PAPER SHOP',
    items: [
      { title: 'Paper Group', icon: 'folder', to: '/kertas-group-self' },
      { title: 'Paper Size', icon: 'maximize-2', to: '/kertas-ukuran-self' },
      { title: 'Paper Price', icon: 'dollar-sign', to: '/kertas-harga-self' },
      { title: 'Paper List', icon: 'list', to: '/kertas-jenis-self' }
    ]
  },
  {
    header: 'INVENTORY',
    items: [
      { title: 'Category', icon: 'codepen', to: '/category' },
      { title: 'Sub Category', icon: 'speaker', to: '/sub-category' },
      { title: 'Unit', icon: 'git-commit', to: '/unit' },
      { title: 'Variant', icon: 'layers', to: '/variant' },
      {
        title: 'Components',
        icon: 'list',
        submenus: [
          { title: 'Minimum', to: '/komponen-minimum' },
          { title: 'Fix', to: '/komponen-fiks' }
        ]
      }
    ]
  },
  {
    header: 'PURCHASES',
    items: [
      { title: 'Purchase', icon: 'shopping-bag', to: '/purchase' },
      { title: 'Purchase Order', icon: 'file-minus', to: '/purchase-order' },
      { title: 'Purchase Return', icon: 'refresh-cw', to: '/purchase-return' },
      { title: 'Purchase Item', icon: 'package', to: '/purchase-item' },
      { title: 'Purchase Category', icon: 'grid', to: '/purchase-category' }
    ]
  },
  {
    header: 'PROMO',
    items: [
      { title: 'Voucher', icon: 'tag', to: '/voucher' },
      {
        title: 'Discount',
        icon: 'trending-down',
        submenus: [
          { title: 'Discount plan', to: '/discount-plan' },
          { title: 'Discount', to: '/discount' }
        ]
      }
    ]
  },
  {
    header: 'FINANCE & ACCOUNT',
    items: [
      {
        title: 'Expense',
        icon: 'external-link',
        submenus: [
          { title: 'Expenses', to: '/expenses' },
          { title: 'Expense category', to: '/expense-category' }
        ]
      },
      {
        title: 'Income',
        icon: 'file-plus',
        submenus: [
          { title: 'Income', to: '/income' },
          { title: 'Income category', to: '/income-category' }
        ]
      },
      { title: 'Payments', icon: 'credit-card', to: '/payments' },
      { title: 'Balance Account', icon: 'credit-card', to: '/balance-account' },
      { title: 'Bank Account', icon: 'credit-card', to: '/bank-account' },
      { title: 'Money Transfer', icon: 'share', to: '/money-transfer' },
      { title: 'Balance Sheet', icon: 'pie-chart', to: '/balance-sheet' },
      { title: 'Cash Flow', icon: 'git-branch', to: '/cash-flow' },
      { title: 'Account Statement', icon: 'pie-chart', to: '/account-statement' },
      { title: 'Cash Advance', icon: 'git-branch', to: '/cash-advance' },
      { title: 'Incentive', icon: 'share', to: '/incentive' },
      {
        title: 'Tax',
        icon: 'database',
        submenus: [
          { title: 'Output Tax', to: '/output-tax' },
          { title: 'Input Tax', to: '/input-tax' },
          { title: 'Tax Rates', to: '/tax-rates' }
        ]
      }
    ]
  },
  {
    header: 'PEOPLES',
    items: [
      { title: 'Customers', icon: 'user', to: '/customers' },
      { title: 'Customer Types', icon: 'user', to: '/customer-type' },
      { title: 'Address', icon: 'home', to: '/address' },
      { title: 'Supplier', icon: 'users', to: '/supplier' },
      { title: 'Branch Store', icon: 'home', to: '/store-list' }
    ]
  },
  {
    header: 'HRM',
    items: [
      { title: 'Employees', icon: 'briefcase', to: '/employees' },
      { title: 'Department', icon: 'git-merge', to: '/department' },
      {
        title: 'Payroll',
        icon: 'calendar',
        submenus: [
          { title: 'Employee salary', to: '/employee-salary' },
          { title: 'Payslip', to: '/payslip' }
        ]
      }
    ]
  },
  {
    header: 'REPORT',
    items: [
      {
        title: 'Sales Report',
        icon: 'bar-chart-2',
        submenus: [
          { title: 'Sales Report', to: '/sales-report' },
          { title: 'Best Seller', to: '/best-seller' }
        ]
      },
      { title: 'Purchase Report', icon: 'pie-chart', to: '/purchase-report' },
      { title: 'Invoice Report', icon: 'clipboard', to: '/invoice-report' },
      {
        title: 'Supplier Report',
        icon: 'calendar',
        submenus: [
          { title: 'Supplier Report', to: '/supplier-report' },
          { title: 'Supplier Due Report', to: '/supplier-due-report' }
        ]
      },
      {
        title: 'Customers Report',
        icon: 'calendar',
        submenus: [
          { title: 'Customer Report', to: '/customer-report' },
          { title: 'Customer Due Report', to: '/customer-due-report' }
        ]
      },
      { title: 'Product Report', icon: 'package', to: '/product-report' },
      { title: 'Expense Report', icon: 'server', to: '/expense-report' },
      { title: 'Income Report', icon: 'database', to: '/income-report' },
      { title: 'Tax Report', icon: 'database', to: '/tax-report' },
      { title: 'Profit & Loss', icon: 'pie-chart', to: '/profit-and-loss' },
      { title: 'Annual Report', icon: 'align-center', to: '/annual-reports' }
    ]
  },
  {
    header: 'CONTENT',
    items: [
      { title: 'All Blog', icon: 'life-buoy', to: '/all-blog' },
      { title: 'Blog Tag', icon: 'hash', to: '/blog-tag' },
      { title: 'Blog Category', icon: 'sliders', to: '/blog-category' },
      { title: 'Blog Comment', icon: 'edit', to: '/blog-comment' },
      { title: 'FAQ', icon: 'help-circle', to: '/faq' },
      { title: 'Our Client', icon: 'users', to: '/our-client' },
      { title: 'Download Files', icon: 'paperclip', to: '/download-files' },
      { title: 'Footer', icon: 'underline', to: '/footer' },
      { title: 'Banner', icon: 'layout', to: '/banner' }
    ]
  },
  {
    header: 'USER MANAGEMENT',
    items: [
      { title: 'All Members', icon: 'user-check', to: '/user' },
      { title: 'User Admin', icon: 'user-check', to: '/user-admin' },
      { title: 'Role', icon: 'shield', to: '/role-permissions' },
      { title: 'Permissions', icon: 'shield', to: '/role' },
      { title: 'Delete Account Request', icon: 'user-minus', to: '/delete-account' }
    ]
  },
  {
    header: 'SETTING',
    items: [
      {
        title: 'Webstore Setting',
        icon: 'globe',
        submenus: [
          { title: 'Profile', to: '/profile' },
          { title: 'Company Setting', to: '/company-setting' }
        ]
      },
      {
        title: 'Locations',
        icon: 'globe',
        submenus: [
          { title: 'Province', to: '/province' },
          { title: 'Regency', to: '/regency' },
          { title: 'District', to: '/district' }
        ]
      },
      {
        title: 'App Setting',
        icon: 'smartphone',
        submenus: [
          { title: 'Invoice setting', to: '/invoice-setting' },
          { title: 'POS', to: '/pos-settings' }
        ]
      },
      {
        title: 'System Setting',
        icon: 'monitor',
        submenus: [
          { title: 'Email setting', to: '/email-setting' },
          { title: 'Language', to: '/language' },
          { title: 'OTP', to: '/otp' }
        ]
      },
      { title: 'Prefixes', icon: 'settings', to: '/prefixes' },
      { title: 'Logout', icon: 'log-out', to: '/signin' }
    ]
  }
]

// Auto-open active submenu on mount
onMounted(() => {
  menuGroups.forEach(group => {
    group.items.forEach(item => {
      if (item.submenus && isRouteActive(undefined, item.submenus)) {
        openMenus.value[item.title] = true
      }
    })
  })
})
</script>

<template>
  <aside
    :class="[
      'fixed inset-y-0 start-0 z-30 flex flex-col border-e border-gray-200 bg-white transition-all duration-300 dark:border-gray-800 dark:bg-gray-900',
      themeStore.isSidebarCollapsed ? 'w-20' : 'w-64',
      themeStore.isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
    ]"
  >
    <!-- Sidebar Top Brand Spacer -->
    <div class="flex h-16 items-center justify-between px-4 border-b border-gray-100 lg:hidden dark:border-gray-800">
      <NuxtLink to="/" class="flex items-center gap-2">
        <img src="/assets/img/logo-small.png" alt="Logo" class="h-8 w-auto" />
        <span class="text-base font-bold text-secondary dark:text-white">Kacetak</span>
      </NuxtLink>
      <button
        type="button"
        class="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100"
        @click="themeStore.closeMobileSidebar"
      >
        <FeatherIcon name="x" size="18" />
      </button>
    </div>

    <!-- Scrollable Nav Menu -->
    <div class="flex-1 overflow-y-auto px-3 py-4 text-xs">
      <div v-for="(group, gIdx) in menuGroups" :key="gIdx" class="mb-4">
        <!-- Group Header -->
        <h6
          v-if="!themeStore.isSidebarCollapsed"
          class="mb-2 px-3 text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500"
        >
          {{ group.header }}
        </h6>

        <ul class="space-y-1">
          <li v-for="(item, iIdx) in group.items" :key="iIdx">
            <!-- Single Link Item -->
            <NuxtLink
              v-if="!item.submenus && item.to"
              :to="item.to"
              :class="[
                'flex items-center gap-3 rounded-lg px-3 py-2 font-medium transition-colors',
                isRouteActive(item.to)
                  ? 'bg-primary-100 text-primary font-semibold dark:bg-primary/20'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white'
              ]"
              :title="themeStore.isSidebarCollapsed ? item.title : undefined"
              @click="themeStore.closeMobileSidebar"
            >
              <FeatherIcon v-if="item.icon" :name="item.icon" size="18" class="flex-shrink-0" />
              <span v-if="!themeStore.isSidebarCollapsed" class="truncate">{{ item.title }}</span>
            </NuxtLink>

            <!-- Submenu Accordion Item -->
            <div v-else-if="item.submenus">
              <button
                type="button"
                :class="[
                  'flex w-full items-center justify-between rounded-lg px-3 py-2 font-medium transition-colors',
                  isRouteActive(undefined, item.submenus)
                    ? 'text-primary font-semibold'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800'
                ]"
                @click="toggleSubmenu(item.title)"
              >
                <div class="flex items-center gap-3 truncate">
                  <FeatherIcon v-if="item.icon" :name="item.icon" size="18" class="flex-shrink-0" />
                  <span v-if="!themeStore.isSidebarCollapsed" class="truncate">{{ item.title }}</span>
                </div>
                <FeatherIcon
                  v-if="!themeStore.isSidebarCollapsed"
                  :name="openMenus[item.title] ? 'chevron-down' : 'chevron-right'"
                  size="14"
                  class="transition-transform duration-200"
                />
              </button>

              <!-- Submenu List -->
              <ul
                v-if="!themeStore.isSidebarCollapsed && (openMenus[item.title] || isRouteActive(undefined, item.submenus))"
                class="ms-7 mt-1 space-y-1 border-s border-gray-200 ps-2 dark:border-gray-700"
              >
                <li v-for="(sub, sIdx) in item.submenus" :key="sIdx">
                  <NuxtLink
                    :to="sub.to"
                    :class="[
                      'block rounded-md px-2.5 py-1.5 transition-colors',
                      isRouteActive(sub.to)
                        ? 'font-semibold text-primary'
                        : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                    ]"
                    @click="themeStore.closeMobileSidebar"
                  >
                    {{ sub.title }}
                  </NuxtLink>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </aside>

  <!-- Mobile Backdrop Overlay -->
  <div
    v-if="themeStore.isMobileSidebarOpen"
    class="fixed inset-0 z-20 bg-black/50 lg:hidden"
    @click="themeStore.closeMobileSidebar"
  />
</template>

