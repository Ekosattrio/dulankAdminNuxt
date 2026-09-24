<script setup lang="ts">
import FeatherIcon from "~/components/common/FeatherIcon.vue";
import BaseModal from "~/components/modal/BaseModal.vue";

definePageMeta({
  layout: "default",
});

useLegacyPage({
  title: 'Sales Dashboard',
  styles: ['/assets/css/style.css'],
  scripts: ['/assets/js/theme-script.js'],
  sweetAlert: true
});

// --- State: Header & Date Range Picker ---
const isHeaderCollapsed = ref(false);
const isRefreshing = ref(false);
const showDatepicker = ref(false);
const selectedDateRange = ref("7hari");
const dateRangeLabel = ref("01/09/2026 - 07/09/2026");
const toastMessage = ref<string | null>(null);

const datePresets = [
  { id: "kemarin", label: "Kemarin", range: "06/09/2026 - 06/09/2026" },
  { id: "7hari", label: "7 Hari Terakhir", range: "01/09/2026 - 07/09/2026" },
  { id: "bulanIni", label: "Bulan Ini", range: "01/09/2026 - 30/09/2026" },
  { id: "bulanLalu", label: "Bulan Lalu", range: "01/08/2026 - 31/08/2026" },
  { id: "tahunLalu", label: "Tahun Lalu", range: "01/01/2025 - 31/12/2025" },
  { id: "kustom", label: "Rentang Kustom", range: "DD/MM/YYYY - DD/MM/YYYY" },
];

function selectDateRange(preset: (typeof datePresets)[0]) {
  selectedDateRange.value = preset.id;
  dateRangeLabel.value = preset.range;
  showDatepicker.value = false;
  showToast(`Date range set to: ${preset.label}`);
}

function showToast(msg: string) {
  toastMessage.value = msg;
  setTimeout(() => {
    if (toastMessage.value === msg) {
      toastMessage.value = null;
    }
  }, 3000);
}

function refreshAllData() {
  isRefreshing.value = true;
  setTimeout(() => {
    isRefreshing.value = false;
    showToast("Sales dashboard refreshed successfully.");
  }, 600);
}

function refreshCard(type: string) {
  showToast(`Refreshed ${type} metrics.`);
}

// --- Best Seller Products ---
interface BestSellerItem {
  id: number;
  name: string;
  price: number;
  sales: number;
  image: string;
  category: string;
  stock: number;
}

const bestSellers = ref<BestSellerItem[]>([
  {
    id: 1,
    name: "Lenovo 3rd Generation",
    price: 4420,
    sales: 6547,
    image: "/assets/img/products/stock-img-01.png",
    category: "Laptops & Computers",
    stock: 120,
  },
  {
    id: 2,
    name: "Bold V3.2",
    price: 1474,
    sales: 3474,
    image: "/assets/img/products/stock-img-06.png",
    category: "Accessories",
    stock: 450,
  },
  {
    id: 3,
    name: "Nike Jordan",
    price: 8784,
    sales: 1478,
    image: "/assets/img/products/stock-img-02.png",
    category: "Footwear & Fashion",
    stock: 85,
  },
  {
    id: 4,
    name: "Apple Series 5 Watch",
    price: 3240,
    sales: 987,
    image: "/assets/img/products/stock-img-03.png",
    category: "Smartwatches",
    stock: 64,
  },
  {
    id: 5,
    name: "Amazon Echo Dot",
    price: 597,
    sales: 784,
    image: "/assets/img/products/stock-img-04.png",
    category: "Smart Home",
    stock: 210,
  },
]);

// --- Recent Transactions ---
interface TransactionItem {
  id: number;
  name: string;
  time: string;
  paymentMethod: string;
  reference: string;
  status: "Success" | "Canceled" | "Pending";
  amount: number;
  image: string;
  date: string;
}

const recentTransactions = ref<TransactionItem[]>([
  {
    id: 1,
    name: "Lobar Handy",
    time: "15 Mins",
    paymentMethod: "Paypal",
    reference: "#416645453773",
    status: "Success",
    amount: 1099.0,
    image: "/assets/img/products/stock-img-05.png",
    date: "07 Sep 2026, 14:45",
  },
  {
    id: 2,
    name: "Red Premium Handy",
    time: "10 Mins",
    paymentMethod: "Apple Pay",
    reference: "#147784454554",
    status: "Canceled",
    amount: 600.55,
    image: "/assets/img/products/expire-product-01.png",
    date: "07 Sep 2026, 14:50",
  },
  {
    id: 3,
    name: "Iphone 14 Pro",
    time: "10 Mins",
    paymentMethod: "Stripe",
    reference: "#147784454554",
    status: "Pending",
    amount: 1099.0,
    image: "/assets/img/products/expire-product-02.png",
    date: "07 Sep 2026, 14:50",
  },
  {
    id: 4,
    name: "Black Slim 200",
    time: "10 Mins",
    paymentMethod: "PayU",
    reference: "#147784454554",
    status: "Success",
    amount: 1569.0,
    image: "/assets/img/products/expire-product-03.png",
    date: "07 Sep 2026, 14:50",
  },
  {
    id: 5,
    name: "Woodcraft Sandal",
    time: "15 Mins",
    paymentMethod: "Paytm",
    reference: "#147784454554",
    status: "Success",
    amount: 1478.0,
    image: "/assets/img/products/expire-product-04.png",
    date: "07 Sep 2026, 14:45",
  },
]);

// Modal State
const isTxModalOpen = ref(false);
const activeTransaction = ref<TransactionItem | null>(null);

function viewTransaction(tx: TransactionItem) {
  activeTransaction.value = tx;
  isTxModalOpen.value = true;
}

const isProductModalOpen = ref(false);
const activeProduct = ref<BestSellerItem | null>(null);

function viewProduct(p: BestSellerItem) {
  activeProduct.value = p;
  isProductModalOpen.value = true;
}

// --- Sales Analytics Chart (Area Spline) ---
const selectedYear = ref("2023");
const showYearDropdown = ref(false);

const yearlyData: Record<string, number[]> = {
  "2023": [25, 30, 18, 15, 22, 20, 30, 20, 22, 18, 15, 20],
  "2022": [20, 24, 28, 18, 25, 32, 22, 28, 24, 20, 18, 25],
  "2021": [16, 20, 22, 18, 20, 24, 19, 21, 25, 22, 19, 21],
};

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const chartHoverIndex = ref<number | null>(null);

const currentChartPoints = computed(() => {
  const values = yearlyData[selectedYear.value] || yearlyData["2023"];
  const width = 640;
  const height = 230;
  const paddingLeft = 35;
  const paddingRight = 15;
  const paddingTop = 20;
  const paddingBottom = 30;

  const innerW = width - paddingLeft - paddingRight;
  const innerH = height - paddingTop - paddingBottom;
  const maxVal = 60;
  const minVal = 10;

  const points = values.map((val, i) => {
    const x = paddingLeft + (i / (values.length - 1)) * innerW;
    const y = paddingTop + innerH - ((val - minVal) / (maxVal - minVal)) * innerH;
    return { x, y, val, month: months[i] };
  });

  // Build SVG path
  let pathD = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    pathD += ` L ${points[i].x} ${points[i].y}`;
  }

  const areaD = `${pathD} L ${points[points.length - 1].x} ${paddingTop + innerH} L ${points[0].x} ${paddingTop + innerH} Z`;

  return { points, pathD, areaD, width, height, paddingLeft, paddingTop, innerW, innerH };
});

// --- Sales by Countries Map ---
const selectedCountryPeriod = ref("This Week");
const showCountryDropdown = ref(false);

interface CountryData {
  id: string;
  name: string;
  sales: string;
  percentage: number;
  x: number; // SVG coordinates percent
  y: number;
}

const countryMarkers = ref<CountryData[]>([
  { id: "US", name: "United States", sales: "1,000,000 Sales", percentage: 55, x: 25, y: 38 },
  { id: "UK", name: "United Kingdom", sales: "5,467 Sales", percentage: 8, x: 47, y: 28 },
  { id: "RU", name: "Russia", sales: "5,488 Sales", percentage: 6, x: 68, y: 24 },
  { id: "CN", name: "China", sales: "7,777 Sales", percentage: 10, x: 74, y: 44 },
  { id: "IN", name: "India", sales: "98,765 Sales", percentage: 18, x: 67, y: 49 },
  { id: "UAE", name: "UAE", sales: "98,654 Sales", percentage: 14, x: 59, y: 47 },
  { id: "SA", name: "Saudi Arabia", sales: "54,678 Sales", percentage: 12, x: 57, y: 49 },
  { id: "AFR", name: "Africa", sales: "3,455 Sales", percentage: 5, x: 51, y: 62 },
]);

const hoveredCountry = ref<CountryData | null>(null);
</script>

<template>
  <div class="page-wrapper min-h-screen pb-10">
    <div class="content mx-auto max-w-[1600px] px-4 pt-4 sm:px-6">
      <!-- Toast Notification -->
      <Transition
        enter-active-class="transform ease-out duration-300 transition"
        enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
        enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
        leave-active-class="transition ease-in duration-100"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="toastMessage"
          class="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-lg bg-[#092C4C] px-4 py-3 text-xs font-semibold text-white shadow-lg"
        >
          <FeatherIcon name="check-circle" size="16" class="text-[#28C76F]" />
          <span>{{ toastMessage }}</span>
        </div>
      </Transition>

      <!-- Welcome Banner Card -->
      <div
        class="welcome mb-5 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all dark:border-gray-800 dark:bg-gray-900"
      >
        <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <!-- Welcome Text -->
          <div class="welcome-text flex flex-wrap items-center gap-1.5 sm:gap-2">
            <h3 class="flex items-center text-lg font-bold text-[#092C4C] sm:text-xl dark:text-white">
              <img src="/assets/img/icons/hi.svg" alt="hi" class="me-2 h-6 w-6 inline-block" />
              Hi John Smilga,
            </h3>
            <span
              v-show="!isHeaderCollapsed"
              class="text-xs sm:text-sm font-semibold text-gray-500 transition-opacity dark:text-gray-400"
            >
              here's what's happening with your store today.
            </span>
          </div>

          <!-- Top Controls (Date Range, Refresh, Collapse) -->
          <div class="flex items-center gap-2 self-start sm:self-auto">
            <!-- Date Range Selector -->
            <div class="relative">
              <button
                type="button"
                class="flex min-w-[210px] items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 shadow-sm transition hover:border-primary hover:text-primary dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                @click="showDatepicker = !showDatepicker"
              >
                <div class="flex items-center gap-2">
                  <FeatherIcon name="calendar" size="14" class="text-gray-400" />
                  <span>{{ dateRangeLabel }}</span>
                </div>
                <FeatherIcon name="chevron-down" size="14" class="text-gray-400" />
              </button>

              <!-- Quick Range Preset Menu -->
              <div
                v-if="showDatepicker"
                class="absolute right-0 top-full z-40 mt-1 w-56 rounded-lg border border-gray-100 bg-white p-1.5 shadow-xl dark:border-gray-800 dark:bg-gray-900"
              >
                <div class="px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-400">Pilih Rentang Waktu</div>
                <button
                  v-for="preset in datePresets"
                  :key="preset.id"
                  type="button"
                  :class="[
                    'flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-xs font-medium transition',
                    selectedDateRange === preset.id
                      ? 'bg-primary/10 font-bold text-primary dark:bg-primary/20'
                      : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800',
                  ]"
                  @click="selectDateRange(preset)"
                >
                  <span>{{ preset.label }}</span>
                  <FeatherIcon v-if="selectedDateRange === preset.id" name="check" size="12" />
                </button>
              </div>
            </div>

            <!-- Refresh Button -->
            <button
              type="button"
              class="hidden md:inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:border-primary hover:bg-primary hover:text-white dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
              title="Refresh"
              @click="refreshAllData"
            >
              <FeatherIcon name="rotate-ccw" size="16" :class="{ 'animate-spin': isRefreshing }" />
            </button>

            <!-- Collapse Header Button -->
            <button
              type="button"
              class="hidden lg:inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:border-primary hover:bg-primary hover:text-white dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
              title="Collapse"
              @click="isHeaderCollapsed = !isHeaderCollapsed"
            >
              <FeatherIcon :name="isHeaderCollapsed ? 'chevron-down' : 'chevron-up'" size="16" />
            </button>
          </div>
        </div>
      </div>

      <!-- Top Sales KPI Cards (3 Cards) -->
      <div class="sales-cards mb-5 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-12">
        <!-- Card 1: Weekly Earning (6 Cols) -->
        <div
          class="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 md:col-span-2 xl:col-span-6"
        >
          <div>
            <h6 class="mb-2 text-sm sm:text-base font-semibold text-primary">Weekly Earning</h6>
            <h3 class="mb-2 text-2xl sm:text-3xl font-bold text-secondary dark:text-white">$95,000.45</h3>
            <p class="sales-range flex items-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              <span class="inline-flex items-center font-semibold text-success">
                <FeatherIcon name="chevron-up" size="16" class="me-0.5" />
                48%&nbsp;
              </span>
              increase compare to last week
            </p>
          </div>
          <img
            src="/assets/img/icons/weekly-earning.svg"
            alt="weekly earning"
            class="h-auto w-16 sm:w-20 md:w-24 object-contain flex-shrink-0 ms-4"
          />
        </div>

        <!-- Card 2: No of Total Sales - Primary (#FF9F43) (3 Cols) -->
        <div
          class="relative flex flex-col justify-between overflow-hidden rounded-xl bg-primary p-6 text-white shadow-sm transition-transform hover:-translate-y-0.5 xl:col-span-3"
        >
          <div class="mb-4 flex items-start justify-between">
            <img src="/assets/img/icons/total-sales.svg" alt="total sales" class="h-10 w-10 brightness-0 invert" />
            <button
              type="button"
              class="text-white/80 transition hover:text-white hover:rotate-180 duration-300"
              title="Refresh"
              @click="refreshCard('total sales')"
            >
              <FeatherIcon name="rotate-ccw" size="16" />
            </button>
          </div>
          <div>
            <h3 class="mb-1 text-2xl sm:text-3xl font-bold text-white tracking-tight">10,000+</h3>
            <p class="text-xs sm:text-sm font-medium text-white/90">No of Total Sales</p>
          </div>
        </div>

        <!-- Card 3: No of Total Sales - Secondary (#092C4C) (3 Cols) -->
        <div
          class="relative flex flex-col justify-between overflow-hidden rounded-xl bg-secondary p-6 text-white shadow-sm transition-transform hover:-translate-y-0.5 xl:col-span-3"
        >
          <div class="mb-4 flex items-start justify-between">
            <img src="/assets/img/icons/purchased-earnings.svg" alt="purchased earnings" class="h-10 w-10 brightness-0 invert" />
            <button
              type="button"
              class="text-white/80 transition hover:text-white hover:rotate-180 duration-300"
              title="Refresh"
              @click="refreshCard('purchased earnings')"
            >
              <FeatherIcon name="rotate-ccw" size="16" />
            </button>
          </div>
          <div>
            <h3 class="mb-1 text-2xl sm:text-3xl font-bold text-white tracking-tight">800+</h3>
            <p class="text-xs sm:text-sm font-medium text-white/90">No of Total Sales</p>
          </div>
        </div>
      </div>

      <!-- Middle Row: Best Seller & Recent Transactions -->
      <div class="mb-5 grid grid-cols-1 gap-5 xl:grid-cols-12">
        <!-- Best Seller (4 Cols) -->
        <div
          class="flex flex-col rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 xl:col-span-4"
        >
          <div class="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-gray-800">
            <h4 class="text-sm sm:text-base font-bold text-secondary dark:text-white">Best Seller</h4>
            <NuxtLink
              to="/product-list"
              class="view-all flex items-center text-xs font-semibold text-primary transition hover:text-primary-hover"
            >
              View All
              <span class="ps-1.5 flex items-center"><FeatherIcon name="arrow-right" size="14" /></span>
            </NuxtLink>
          </div>
          <div class="p-4 flex-1">
            <div class="space-y-4">
              <div
                v-for="item in bestSellers"
                :key="item.id"
                class="group flex cursor-pointer items-center justify-between rounded-lg p-2 transition hover:bg-gray-50 dark:hover:bg-gray-800/60"
                @click="viewProduct(item)"
              >
                <!-- Product Info -->
                <div class="flex items-center gap-3 min-w-0">
                  <div
                    class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg border border-gray-100 bg-gray-50 p-1 dark:border-gray-700 dark:bg-gray-800"
                  >
                    <img :src="item.image" :alt="item.name" class="h-10 w-10 object-contain" />
                  </div>
                  <div class="min-w-0">
                    <h5
                      class="truncate text-xs sm:text-sm font-bold text-secondary transition group-hover:text-primary dark:text-gray-100"
                    >
                      {{ item.name }}
                    </h5>
                    <p class="text-xs text-gray-400 font-medium">${{ item.price.toLocaleString() }}</p>
                  </div>
                </div>

                <!-- Sales Count -->
                <div class="text-end ps-3 flex-shrink-0">
                  <p class="text-[11px] font-medium text-gray-400 uppercase">Sales</p>
                  <p class="text-xs sm:text-sm font-bold text-secondary dark:text-white">{{ item.sales.toLocaleString() }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Transactions (8 Cols) -->
        <div
          class="flex flex-col rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 xl:col-span-8 overflow-hidden"
        >
          <div class="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-gray-800">
            <h4 class="text-sm sm:text-base font-bold text-secondary dark:text-white">Recent Transactions</h4>
            <NuxtLink
              to="/sales-list"
              class="view-all flex items-center text-xs font-semibold text-primary transition hover:text-primary-hover"
            >
              View All
              <span class="ps-1.5 flex items-center"><FeatherIcon name="arrow-right" size="14" /></span>
            </NuxtLink>
          </div>

          <div class="overflow-x-auto flex-1">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr
                  class="border-b border-gray-100 bg-gray-50/50 text-[11px] font-bold uppercase text-gray-400 dark:border-gray-800 dark:bg-gray-800/30"
                >
                  <th class="py-3.5 ps-5 pe-2 w-10">#</th>
                  <th class="py-3.5 px-4 min-w-[200px]">Order Details</th>
                  <th class="py-3.5 px-4 min-w-[150px]">Payment</th>
                  <th class="py-3.5 px-4 min-w-[110px]">Status</th>
                  <th class="py-3.5 pe-5 ps-4 text-end min-w-[110px]">Amount</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-50 text-xs dark:divide-gray-800/60">
                <tr
                  v-for="tx in recentTransactions"
                  :key="tx.id"
                  class="cursor-pointer transition hover:bg-gray-50/80 dark:hover:bg-gray-800/40"
                  @click="viewTransaction(tx)"
                >
                  <td class="py-3.5 ps-5 pe-2 text-gray-400 font-medium">{{ tx.id }}</td>
                  <td class="py-3.5 px-4">
                    <div class="flex items-center gap-3">
                      <div
                        class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-gray-100 bg-gray-50 p-1 dark:border-gray-700 dark:bg-gray-800"
                      >
                        <img :src="tx.image" :alt="tx.name" class="h-8 w-8 object-contain" />
                      </div>
                      <div class="min-w-0">
                        <p class="font-bold text-secondary dark:text-gray-100 truncate hover:text-primary">{{ tx.name }}</p>
                        <span class="flex items-center text-[11px] text-gray-400 gap-1 mt-0.5">
                          <FeatherIcon name="clock" size="12" />
                          {{ tx.time }}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td class="py-3.5 px-4">
                    <p class="font-bold text-secondary dark:text-gray-200">{{ tx.paymentMethod }}</p>
                    <span class="text-[11px] font-medium text-[#1B5A90] dark:text-blue-400">{{ tx.reference }}</span>
                  </td>
                  <td class="py-3.5 px-4">
                    <span
                      v-if="tx.status === 'Success'"
                      class="inline-block rounded border border-[#28C76F] bg-[#28C76F]/10 px-2.5 py-0.5 text-[11px] font-semibold text-[#28C76F]"
                    >
                      Success
                    </span>
                    <span
                      v-else-if="tx.status === 'Canceled'"
                      class="inline-block rounded border border-[#EA5455] bg-[#EA5455]/10 px-2.5 py-0.5 text-[11px] font-semibold text-[#EA5455]"
                    >
                      Canceled
                    </span>
                    <span
                      v-else
                      class="inline-block rounded border border-primary bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary"
                    >
                      Pending
                    </span>
                  </td>
                  <td class="py-3.5 pe-5 ps-4 text-end font-bold text-secondary dark:text-white">
                    ${{ tx.amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Bottom Row: Sales Analytics & Sales by Countries -->
      <div class="sales-board grid grid-cols-1 gap-5 xl:grid-cols-12">
        <!-- Sales Analytics (7 Cols) -->
        <div
          class="flex flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 xl:col-span-7"
        >
          <div class="mb-4 flex items-center justify-between border-b border-gray-100 pb-3.5 dark:border-gray-800">
            <h5 class="text-sm sm:text-base font-bold text-secondary dark:text-white">Sales Analytics</h5>
            <!-- Year Dropdown -->
            <div class="relative">
              <button
                type="button"
                class="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-sm transition hover:border-primary hover:text-primary dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                @click="showYearDropdown = !showYearDropdown"
              >
                <FeatherIcon name="calendar" size="14" class="text-gray-400" />
                <span>{{ selectedYear }}</span>
                <FeatherIcon name="chevron-down" size="12" class="text-gray-400" />
              </button>
              <div
                v-if="showYearDropdown"
                class="absolute right-0 top-full z-30 mt-1 w-28 rounded-lg border border-gray-100 bg-white p-1 shadow-lg dark:border-gray-800 dark:bg-gray-900"
              >
                <button
                  v-for="y in ['2023', '2022', '2021']"
                  :key="y"
                  type="button"
                  :class="[
                    'w-full rounded px-3 py-1.5 text-left text-xs font-medium transition',
                    selectedYear === y
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800',
                  ]"
                  @click="
                    selectedYear = y;
                    showYearDropdown = false;
                  "
                >
                  {{ y }}
                </button>
              </div>
            </div>
          </div>

          <!-- Area Chart SVG Container -->
          <div class="relative w-full overflow-hidden pt-2" style="min-height: 275px">
            <svg
              viewBox="0 0 640 230"
              class="w-full h-full overflow-visible"
              preserveAspectRatio="none"
              @mouseleave="chartHoverIndex = null"
            >
              <defs>
                <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#FF9F43" stop-opacity="0.38" />
                  <stop offset="60%" stop-color="#FF9F43" stop-opacity="0.10" />
                  <stop offset="100%" stop-color="#FF9F43" stop-opacity="0.0" />
                </linearGradient>
              </defs>

              <!-- Horizontal Grid Lines (10K to 60K) -->
              <g class="text-gray-300 dark:text-gray-800">
                <line
                  v-for="i in 6"
                  :key="i"
                  :x1="currentChartPoints.paddingLeft"
                  :y1="currentChartPoints.paddingTop + ((i - 1) * currentChartPoints.innerH) / 5"
                  :x2="currentChartPoints.width - 15"
                  :y2="currentChartPoints.paddingTop + ((i - 1) * currentChartPoints.innerH) / 5"
                  stroke="currentColor"
                  stroke-dasharray="3 3"
                  stroke-width="1"
                />
              </g>

              <!-- Y-Axis Labels -->
              <g class="text-[11px] fill-gray-400 select-none">
                <text
                  v-for="i in 6"
                  :key="i"
                  x="5"
                  :y="currentChartPoints.paddingTop + ((i - 1) * currentChartPoints.innerH) / 5 + 4"
                >
                  {{ 70 - i * 10 + "K" }}
                </text>
              </g>

              <!-- Gradient Area -->
              <path :d="currentChartPoints.areaD" fill="url(#salesGradient)" />

              <!-- Stroke Line -->
              <path
                :d="currentChartPoints.pathD"
                fill="none"
                stroke="#FF9F43"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
              />

              <!-- Points & Hover Zones -->
              <g v-for="(p, idx) in currentChartPoints.points" :key="idx">
                <!-- Outer Hover Target -->
                <circle
                  :cx="p.x"
                  :cy="p.y"
                  r="14"
                  fill="transparent"
                  class="cursor-pointer"
                  @mouseenter="chartHoverIndex = idx"
                />

                <!-- Point Circle -->
                <circle
                  :cx="p.x"
                  :cy="p.y"
                  :r="chartHoverIndex === idx ? 6 : 3.5"
                  fill="#ffffff"
                  stroke="#FF9F43"
                  stroke-width="2.5"
                  class="transition-all duration-150 pointer-events-none"
                />

                <!-- Active Vertical Guide Line -->
                <line
                  v-if="chartHoverIndex === idx"
                  :x1="p.x"
                  :y1="currentChartPoints.paddingTop"
                  :x2="p.x"
                  :y2="currentChartPoints.paddingTop + currentChartPoints.innerH"
                  stroke="#FF9F43"
                  stroke-dasharray="2 2"
                  stroke-width="1.5"
                  class="pointer-events-none"
                />
              </g>

              <!-- X-Axis Months -->
              <g class="text-[11px] fill-gray-400 select-none">
                <text
                  v-for="(p, idx) in currentChartPoints.points"
                  :key="idx"
                  :x="p.x"
                  :y="currentChartPoints.paddingTop + currentChartPoints.innerH + 18"
                  text-anchor="middle"
                  :class="{ 'font-bold fill-primary': chartHoverIndex === idx }"
                >
                  {{ p.month }}
                </text>
              </g>
            </svg>

            <!-- Floating Active Tooltip -->
            <div
              v-if="chartHoverIndex !== null"
              class="pointer-events-none absolute -top-1 z-30 transform -translate-x-1/2 rounded-md bg-[#092C4C] px-2.5 py-1 text-[11px] font-semibold text-white shadow-md transition-all duration-75"
              :style="{
                left: `${(currentChartPoints.points[chartHoverIndex].x / currentChartPoints.width) * 100}%`,
              }"
            >
              {{ currentChartPoints.points[chartHoverIndex].month }}: ${{ currentChartPoints.points[chartHoverIndex].val }},000
            </div>
          </div>
        </div>

        <!-- Sales by Countries (5 Cols) -->
        <div
          class="flex flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 xl:col-span-5"
        >
          <div class="mb-4 flex items-center justify-between border-b border-gray-100 pb-3.5 dark:border-gray-800">
            <h5 class="text-sm sm:text-base font-bold text-secondary dark:text-white">Sales by Countries</h5>
            <!-- Time Period Dropdown -->
            <div class="relative">
              <button
                type="button"
                class="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-sm transition hover:border-primary hover:text-primary dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                @click="showCountryDropdown = !showCountryDropdown"
              >
                <span>{{ selectedCountryPeriod }}</span>
                <FeatherIcon name="chevron-down" size="12" class="text-gray-400" />
              </button>
              <div
                v-if="showCountryDropdown"
                class="absolute right-0 top-full z-30 mt-1 w-32 rounded-lg border border-gray-100 bg-white p-1 shadow-lg dark:border-gray-800 dark:bg-gray-900"
              >
                <button
                  v-for="period in ['This Week', 'This Month', 'This Year']"
                  :key="period"
                  type="button"
                  :class="[
                    'w-full rounded px-3 py-1.5 text-left text-xs font-medium transition',
                    selectedCountryPeriod === period
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800',
                  ]"
                  @click="
                    selectedCountryPeriod = period;
                    showCountryDropdown = false;
                  "
                >
                  {{ period }}
                </button>
              </div>
            </div>
          </div>

          <!-- World Map Canvas Vector Simulation -->
          <div class="relative flex-1 rounded-lg bg-gray-50/50 p-2 dark:bg-gray-800/30 overflow-hidden" style="min-height: 245px">
            <svg viewBox="0 0 800 420" class="h-full w-full">
              <!-- World Continents Simplified Paths -->
              <g fill="#ECECEC" class="dark:fill-gray-700" stroke="#E2E8F0" stroke-width="0.5">
                <!-- North America -->
                <path d="M120,70 L240,65 L270,110 L250,150 L200,160 L180,210 L160,230 L140,210 L110,170 L90,130 L110,90 Z" />
                <!-- Greenland -->
                <path d="M290,40 L340,35 L360,65 L320,80 L290,60 Z" />
                <!-- South America -->
                <path d="M210,235 L260,245 L290,285 L270,365 L240,390 L220,330 L200,270 Z" />
                <!-- Europe -->
                <path d="M370,80 L440,75 L460,110 L440,140 L390,145 L370,120 Z" />
                <!-- Africa -->
                <path d="M380,160 L450,165 L480,225 L460,310 L420,335 L380,260 L360,200 Z" />
                <!-- Asia -->
                <path d="M470,60 L680,65 L710,130 L660,180 L590,195 L550,160 L490,160 L460,110 Z" />
                <!-- Australia -->
                <path d="M620,270 L700,265 L720,320 L680,350 L630,330 Z" />
              </g>

              <!-- Glowing Country Hotspot Points -->
              <g v-for="marker in countryMarkers" :key="marker.id">
                <!-- Outer Pulse Ring -->
                <circle
                  :cx="marker.x * 8"
                  :cy="marker.y * 4.2"
                  r="8"
                  class="animate-ping text-primary opacity-40"
                  fill="currentColor"
                />
                <!-- Core Marker -->
                <circle
                  :cx="marker.x * 8"
                  :cy="marker.y * 4.2"
                  r="5"
                  class="cursor-pointer transition-all duration-200"
                  :fill="hoveredCountry?.id === marker.id ? '#FF9F43' : '#092C4C'"
                  stroke="#ffffff"
                  stroke-width="1.5"
                  @mouseenter="hoveredCountry = marker"
                  @mouseleave="hoveredCountry = null"
                />
              </g>
            </svg>

            <!-- Interactive Country Tooltip -->
            <div
              v-if="hoveredCountry"
              class="pointer-events-none absolute z-40 transform -translate-x-1/2 -translate-y-full rounded-md border border-gray-100 bg-white px-3 py-1.5 text-center shadow-lg dark:border-gray-700 dark:bg-gray-900"
              :style="{
                left: `${hoveredCountry.x}%`,
                top: `${hoveredCountry.y - 4}%`,
              }"
            >
              <h6 class="text-xs font-bold text-secondary dark:text-white">{{ hoveredCountry.name }}</h6>
              <p class="text-[11px] font-semibold text-primary">{{ hoveredCountry.sales }}</p>
            </div>
          </div>

          <!-- Bottom Increase Trend Text -->
          <p class="sales-range mt-4 flex items-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            <span class="inline-flex items-center font-semibold text-success">
              <FeatherIcon name="chevron-up" size="16" class="me-0.5" />
              48%&nbsp;
            </span>
            increase compare to last week
          </p>
        </div>
      </div>
    </div>

    <!-- Modal: Transaction Details -->
    <BaseModal v-model="isTxModalOpen" title="Transaction Details" max-width="md">
      <div v-if="activeTransaction" class="space-y-4 text-xs sm:text-sm">
        <div class="flex items-center gap-3 border-b border-gray-100 pb-3 dark:border-gray-800">
          <img
            :src="activeTransaction.image"
            :alt="activeTransaction.name"
            class="h-12 w-12 rounded-lg object-contain bg-gray-50 dark:bg-gray-800 p-1"
          />
          <div>
            <h4 class="text-base font-bold text-secondary dark:text-white">{{ activeTransaction.name }}</h4>
            <p class="text-gray-400 text-xs">{{ activeTransaction.date }} ({{ activeTransaction.time }} ago)</p>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-3 py-2">
          <div>
            <span class="text-gray-400 block text-xs">Payment Method</span>
            <span class="font-bold text-secondary dark:text-white">{{ activeTransaction.paymentMethod }}</span>
          </div>
          <div>
            <span class="text-gray-400 block text-xs">Reference No</span>
            <span class="font-mono text-[#1B5A90] font-semibold">{{ activeTransaction.reference }}</span>
          </div>
          <div>
            <span class="text-gray-400 block text-xs">Status</span>
            <span
              :class="[
                'inline-block px-2.5 py-0.5 rounded text-xs font-semibold',
                activeTransaction.status === 'Success'
                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-500'
                  : activeTransaction.status === 'Canceled'
                    ? 'bg-red-50 text-red-600 border border-red-500'
                    : 'bg-amber-50 text-amber-600 border border-amber-500',
              ]"
            >
              {{ activeTransaction.status }}
            </span>
          </div>
          <div>
            <span class="text-gray-400 block text-xs">Total Amount</span>
            <span class="text-base font-bold text-secondary dark:text-white">
              ${{ activeTransaction.amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
            </span>
          </div>
        </div>
      </div>
      <template #footer>
        <button
          type="button"
          class="rounded-lg bg-gray-100 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200"
          @click="isTxModalOpen = false"
        >
          Close
        </button>
      </template>
    </BaseModal>

    <!-- Modal: Product Details -->
    <BaseModal v-model="isProductModalOpen" title="Product Details" max-width="md">
      <div v-if="activeProduct" class="space-y-4 text-xs sm:text-sm">
        <div class="flex items-center gap-4 border-b border-gray-100 pb-3 dark:border-gray-800">
          <img
            :src="activeProduct.image"
            :alt="activeProduct.name"
            class="h-16 w-16 rounded-xl object-contain bg-gray-50 dark:bg-gray-800 p-1.5"
          />
          <div>
            <h4 class="text-base font-bold text-secondary dark:text-white">{{ activeProduct.name }}</h4>
            <span class="inline-block rounded bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary mt-1">
              {{ activeProduct.category }}
            </span>
          </div>
        </div>
        <div class="grid grid-cols-3 gap-3 py-2 text-center">
          <div class="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50">
            <span class="text-gray-400 block text-xs mb-1">Price</span>
            <span class="text-base font-bold text-secondary dark:text-white">${{ activeProduct.price }}</span>
          </div>
          <div class="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50">
            <span class="text-gray-400 block text-xs mb-1">Total Sales</span>
            <span class="text-base font-bold text-primary">{{ activeProduct.sales.toLocaleString() }}</span>
          </div>
          <div class="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50">
            <span class="text-gray-400 block text-xs mb-1">In Stock</span>
            <span class="text-base font-bold text-emerald-600">{{ activeProduct.stock }} pcs</span>
          </div>
        </div>
      </div>
      <template #footer>
        <button
          type="button"
          class="rounded-lg bg-gray-100 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200"
          @click="isProductModalOpen = false"
        >
          Close
        </button>
      </template>
    </BaseModal>
  </div>
</template>
