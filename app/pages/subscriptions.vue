<script setup lang="ts">useHead({
  title: "Subscriptions - Kacetak System",
});

// Initial records matching legacy subscriptions.html
const initialData: SubscriptionItem[] = [
  {
    id: 1,
    subscriber: "BrightWave Innovations",
    plan: "Advanced (Monthly)",
    billingCycle: "30 Days",
    method: "Credit Card",
    amount: 200000,
    createdDate: "12 Sep 2024",
    expiringOn: "11 Oct 2024",
    status: "Paid",
  },
  {
    id: 2,
    subscriber: "Stellar Dynamics",
    plan: "Basic (Yearly)",
    billingCycle: "365 Days",
    method: "Paypal",
    amount: 600000,
    createdDate: "24 Oct 2024",
    expiringOn: "23 Oct 2025",
    status: "Paid",
  },
  {
    id: 3,
    subscriber: "Quantum Nexus",
    plan: "Advanced (Monthly)",
    billingCycle: "30 Days",
    method: "Debit Card",
    amount: 200000,
    createdDate: "18 Feb 2024",
    expiringOn: "17 Mar 2024",
    status: "Paid",
  },
  {
    id: 4,
    subscriber: "EcoVision Enterprises",
    plan: "Advanced (Monthly)",
    billingCycle: "30 Days",
    method: "Paypal",
    amount: 200000,
    createdDate: "17 Oct 2024",
    expiringOn: "16 Nov 2024",
    status: "Paid",
  },
  {
    id: 5,
    subscriber: "Aurora Technologies",
    plan: "Enterprise (Monthly)",
    billingCycle: "30 Days",
    method: "Credit Card",
    amount: 400000,
    createdDate: "20 Jul 2024",
    expiringOn: "19 Aug 2024",
    status: "Paid",
  },
  {
    id: 6,
    subscriber: "BlueSky Ventures",
    plan: "Advanced (Monthly)",
    billingCycle: "30 Days",
    method: "Paypal",
    amount: 200000,
    createdDate: "10 Apr 2024",
    expiringOn: "19 Aug 2024",
    status: "Paid",
  },
  {
    id: 7,
    subscriber: "TerraFusion Energy",
    plan: "Enterprise (Yearly)",
    billingCycle: "365 Days",
    method: "Credit Card",
    amount: 480000,
    createdDate: "29 Aug 2024",
    expiringOn: "28 Aug 2025",
    status: "Paid",
  },
  {
    id: 8,
    subscriber: "UrbanPulse Design",
    plan: "Basic (Monthly)",
    billingCycle: "30 Days",
    method: "Credit Card",
    amount: 50000,
    createdDate: "22 Feb 2024",
    expiringOn: "21 Mar 2024",
    status: "Unpaid",
  },
  {
    id: 9,
    subscriber: "Nimbus Networks",
    plan: "Basic (Yearly)",
    billingCycle: "365 Days",
    method: "Paypal",
    amount: 60000,
    createdDate: "03 Nov 2024",
    expiringOn: "02 Nov 2025",
    status: "Paid",
  },
];

const subscriptions = ref<SubscriptionItem[]>([...initialData]);

// Filters & Search
const searchQuery = ref("");
const filterPlan = ref("");
const filterPayment = ref("");
const filterStatus = ref("");
const filterDateRange = ref("");
const isHeaderCollapsed = ref(false);

// Sorting

const sortField = ref<SortField>("id" as any);
const sortOrder = ref<"asc" | "desc">("asc");

const handleSort = (field: SortField) => {
  if (sortField.value === field) {
    sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
  } else {
    sortField.value = field;
    sortOrder.value = "asc";
  }
};

// Pagination
const currentPage = ref(1);
const perPage = ref(10);

// Computed Filtered & Sorted Data
const filteredSubs = computed(() => {
  let list = subscriptions.value.filter((item) => {
    const q = searchQuery.value.toLowerCase().trim();
    const matchSearch =
      !q ||
      item.subscriber.toLowerCase().includes(q) ||
      item.plan.toLowerCase().includes(q) ||
      item.method.toLowerCase().includes(q);

    const matchPlan = !filterPlan.value || item.plan.toLowerCase().includes(filterPlan.value.toLowerCase());
    const matchPayment = !filterPayment.value || item.method === filterPayment.value;
    const matchStatus = !filterStatus.value || item.status === filterStatus.value;

    return matchSearch && matchPlan && matchPayment && matchStatus;
  });

  // Sort
  if (sortField.value) {
    list = [...list].sort((a: any, b: any) => {
      const valA = a[sortField.value];
      const valB = b[sortField.value];
      if (typeof valA === "number") {
        return sortOrder.value === "asc" ? valA - valB : valB - valA;
      }
      return sortOrder.value === "asc" ? String(valA).localeCompare(String(valB)) : String(valB).localeCompare(String(valA));
    });
  }

  return list;
});

const totalAmount = computed(() => {
  return filteredSubs.value.reduce((sum, item) => sum + (item.amount || 0), 0);
});

const paginatedSubs = computed(() => {
  const start = (currentPage.value - 1) * perPage.value;
  return filteredSubs.value.slice(start, start + perPage.value);
});

const totalPages = computed(() => {
  return Math.ceil(filteredSubs.value.length / perPage.value) || 1;
});

// Number & Currency formatting
const formatNumber = (num: number) => {
  return new Intl.NumberFormat("id-ID").format(num || 0);
};

// Header Actions
const exportPdf = () => {
  window.print();
};

const printTable = () => {
  window.print();
};

const refreshData = () => {
  searchQuery.value = "";
  filterPlan.value = "";
  filterPayment.value = "";
  filterStatus.value = "";
  filterDateRange.value = "";
  currentPage.value = 1;
};

const toggleHeaderCollapse = () => {
  isHeaderCollapsed.value = !isHeaderCollapsed.value;
};

// Modals State
const showViewModal = ref(false);
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const selectedItem = ref<SubscriptionItem | null>(null);
const editForm = ref<SubscriptionItem>({
  id: 0,
  subscriber: "",
  plan: "Basic (Monthly)",
  billingCycle: "30 Days",
  method: "Credit Card",
  amount: 0,
  createdDate: "",
  expiringOn: "",
  status: "Paid",
});

// Modal Openers
const openViewModal = (item: SubscriptionItem) => {
  selectedItem.value = item;
  showViewModal.value = true;
};

const openEditModal = (item: SubscriptionItem) => {
  selectedItem.value = item;
  editForm.value = { ...item };
  showEditModal.value = true;
};

const openDeleteModal = (item: SubscriptionItem) => {
  selectedItem.value = item;
  showDeleteModal.value = true;
};

// Modal Handlers
const handleSaveEdit = () => {
  if (!selectedItem.value) return;
  const idx = subscriptions.value.findIndex((s) => s.id === editForm.value.id);
  if (idx !== -1) {
    subscriptions.value[idx] = { ...editForm.value };
  }
  showEditModal.value = false;
};

const handleConfirmDelete = () => {
  if (!selectedItem.value) return;
  subscriptions.value = subscriptions.value.filter((s) => s.id !== selectedItem.value?.id);
  showDeleteModal.value = false;
};</script>

<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div
      v-if="!isHeaderCollapsed"
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition-all duration-200"
    >
      <div>
        <h4 class="text-xl font-bold tracking-tight text-[#212529] dark:text-white">Subscription List</h4>
        <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Manage your Subscriptions</p>
      </div>

      <!-- Action Icons (PDF, Print, Refresh, Collapse) -->
      <ul class="flex items-center gap-2">
        <li>
          <button
            type="button"
            class="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:border-primary hover:text-primary transition-all dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"
            title="PDF Export"
            @click="exportPdf"
          >
            <img src="/assets/img/icons/pdf.svg" alt="PDF" class="h-4 w-4" />
          </button>
        </li>
        <li>
          <button
            type="button"
            class="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:border-primary hover:text-primary transition-all dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"
            title="Print"
            @click="printTable"
          >
            <CommonFeatherIcon name="printer" size="16" />
          </button>
        </li>
        <li>
          <button
            type="button"
            class="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:border-primary hover:text-primary transition-all dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"
            title="Refresh"
            @click="refreshData"
          >
            <CommonFeatherIcon name="rotate-ccw" size="16" />
          </button>
        </li>
        <li>
          <button
            type="button"
            class="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:border-primary hover:text-primary transition-all dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"
            title="Collapse"
            @click="toggleHeaderCollapse"
          >
            <CommonFeatherIcon name="chevron-up" size="16" />
          </button>
        </li>
      </ul>
    </div>

    <!-- 4 KPI Summary Widgets -->
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
      <!-- Card 1: Total Transactions -->
      <div
        class="flex items-center justify-between rounded-xl border border-gray-200/80 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
      >
        <div class="flex items-center gap-4">
          <div class="flex h-12 w-12 items-center justify-center rounded-full bg-[#F96E6F]/15 text-[#F96E6F]">
            <img src="/assets/img/icons/dash1.svg" alt="Transactions" class="h-6 w-6" />
          </div>
          <div>
            <h5 class="text-lg font-bold text-[#212529] dark:text-white">307,000</h5>
            <h6 class="text-xs font-medium text-gray-500 dark:text-gray-400">Total Transactions</h6>
          </div>
        </div>
      </div>

      <!-- Card 2: Total Subscribers -->
      <div
        class="flex items-center justify-between rounded-xl border border-gray-200/80 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
      >
        <div class="flex items-center gap-4">
          <div class="flex h-12 w-12 items-center justify-center rounded-full bg-[#28C76F]/15 text-[#28C76F]">
            <img src="/assets/img/icons/dash2.svg" alt="Subscribers" class="h-6 w-6" />
          </div>
          <div>
            <h5 class="text-lg font-bold text-[#212529] dark:text-white">4,385</h5>
            <h6 class="text-xs font-medium text-gray-500 dark:text-gray-400">Total Subscribers</h6>
          </div>
        </div>
      </div>

      <!-- Card 3: Active Subscribers -->
      <div
        class="flex items-center justify-between rounded-xl border border-gray-200/80 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
      >
        <div class="flex items-center gap-4">
          <div class="flex h-12 w-12 items-center justify-center rounded-full bg-[#00CFE8]/15 text-[#00CFE8]">
            <img src="/assets/img/icons/dash3.svg" alt="Active" class="h-6 w-6" />
          </div>
          <div>
            <h5 class="text-lg font-bold text-[#212529] dark:text-white">3,000</h5>
            <h6 class="text-xs font-medium text-gray-500 dark:text-gray-400">Active Subscribers</h6>
          </div>
        </div>
      </div>

      <!-- Card 4: Expired Subscribers -->
      <div
        class="flex items-center justify-between rounded-xl border border-gray-200/80 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
      >
        <div class="flex items-center gap-4">
          <div class="flex h-12 w-12 items-center justify-center rounded-full bg-[#EA5455]/15 text-[#EA5455]">
            <img src="/assets/img/icons/dash4.svg" alt="Expired" class="h-6 w-6" />
          </div>
          <div>
            <h5 class="text-lg font-bold text-[#212529] dark:text-white">1,385</h5>
            <h6 class="text-xs font-medium text-gray-500 dark:text-gray-400">Expired Subscribers</h6>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Table Card -->
    <div class="rounded-xl border border-gray-200/80 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="p-5 sm:p-6">
        <!-- Filter Bar -->
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <!-- Left: Search & Date Range -->
          <div class="flex flex-col sm:flex-row sm:items-center gap-3">
            <!-- Search -->
            <div class="relative min-w-[240px]">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search subscriber, plan..."
                class="w-full rounded-lg border border-gray-200 bg-white py-2 ps-10 pe-4 text-xs sm:text-sm text-gray-800 transition-all focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              />
              <span class="absolute inset-y-0 start-0 flex items-center ps-3 text-gray-400">
                <CommonFeatherIcon name="search" size="16" />
              </span>
            </div>

            <!-- Date Range Selector -->
            <select
              v-model="filterDateRange"
              class="rounded-lg border border-gray-200 bg-white py-2 px-3 text-xs sm:text-sm text-gray-700 transition-all focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            >
              <option value="">All Dates</option>
              <option value="kemarin">Kemarin</option>
              <option value="7hari">7 Hari Terakhir</option>
              <option value="bulanIni">Bulan Ini</option>
              <option value="bulanLalu">Bulan Lalu</option>
              <option value="tahunLalu">Tahun Lalu</option>
            </select>
          </div>

          <!-- Right: Dropdown Filters -->
          <div class="flex flex-wrap items-center gap-2 sm:gap-3">
            <!-- Plan Filter -->
            <select
              v-model="filterPlan"
              class="rounded-lg border border-gray-200 bg-white py-2 px-3 text-xs sm:text-sm text-gray-700 transition-all focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            >
              <option value="">All Plans</option>
              <option value="Basic">Basic</option>
              <option value="Advanced">Advanced</option>
              <option value="Enterprise">Enterprise</option>
            </select>

            <!-- Payment Filter -->
            <select
              v-model="filterPayment"
              class="rounded-lg border border-gray-200 bg-white py-2 px-3 text-xs sm:text-sm text-gray-700 transition-all focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            >
              <option value="">All Payments</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Paypal">Paypal</option>
              <option value="Debit Card">Debit Card</option>
            </select>

            <!-- Status Filter -->
            <select
              v-model="filterStatus"
              class="rounded-lg border border-gray-200 bg-white py-2 px-3 text-xs sm:text-sm text-gray-700 transition-all focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            >
              <option value="">All Statuses</option>
              <option value="Paid">Paid</option>
              <option value="Unpaid">Unpaid</option>
            </select>

            <!-- Reset Button -->
            <button
              v-if="searchQuery || filterPlan || filterPayment || filterStatus || filterDateRange"
              type="button"
              class="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-100 dark:border-rose-800/40 dark:bg-rose-950/20 dark:text-rose-400"
              @click="refreshData"
            >
              <CommonFeatherIcon name="x" size="14" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        <!-- Table Container -->
        <div class="overflow-x-auto rounded-lg border border-gray-200/80 dark:border-gray-800">
          <table class="w-full text-start text-xs sm:text-sm">
            <thead
              class="bg-gray-50/80 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 font-semibold border-b border-gray-200/80 dark:border-gray-800"
            >
              <tr>
                <th class="py-3 px-4 text-start cursor-pointer select-none hover:text-primary" @click="handleSort('subscriber')">
                  <div class="inline-flex items-center gap-1.5">
                    <span>Subscriber</span>
                    <CommonFeatherIcon
                      v-if="sortField === 'subscriber'"
                      :name="sortOrder === 'asc' ? 'chevron-up' : 'chevron-down'"
                      size="14"
                    />
                  </div>
                </th>
                <th class="py-3 px-4 text-start cursor-pointer select-none hover:text-primary" @click="handleSort('plan')">
                  <div class="inline-flex items-center gap-1.5">
                    <span>Plan</span>
                    <CommonFeatherIcon
                      v-if="sortField === 'plan'"
                      :name="sortOrder === 'asc' ? 'chevron-up' : 'chevron-down'"
                      size="14"
                    />
                  </div>
                </th>
                <th
                  class="py-3 px-4 text-start cursor-pointer select-none hover:text-primary"
                  @click="handleSort('billingCycle')"
                >
                  <div class="inline-flex items-center gap-1.5">
                    <span>Billing Cycle</span>
                    <CommonFeatherIcon
                      v-if="sortField === 'billingCycle'"
                      :name="sortOrder === 'asc' ? 'chevron-up' : 'chevron-down'"
                      size="14"
                    />
                  </div>
                </th>
                <th class="py-3 px-4 text-start cursor-pointer select-none hover:text-primary" @click="handleSort('method')">
                  <div class="inline-flex items-center gap-1.5">
                    <span>Payment Method</span>
                    <CommonFeatherIcon
                      v-if="sortField === 'method'"
                      :name="sortOrder === 'asc' ? 'chevron-up' : 'chevron-down'"
                      size="14"
                    />
                  </div>
                </th>
                <th class="py-3 px-4 text-end cursor-pointer select-none hover:text-primary" @click="handleSort('amount')">
                  <div class="inline-flex items-center justify-end gap-1.5 w-full">
                    <span>Amount</span>
                    <CommonFeatherIcon
                      v-if="sortField === 'amount'"
                      :name="sortOrder === 'asc' ? 'chevron-up' : 'chevron-down'"
                      size="14"
                    />
                  </div>
                </th>
                <th class="py-3 px-4 text-start cursor-pointer select-none hover:text-primary" @click="handleSort('createdDate')">
                  <div class="inline-flex items-center gap-1.5">
                    <span>Created Date</span>
                    <CommonFeatherIcon
                      v-if="sortField === 'createdDate'"
                      :name="sortOrder === 'asc' ? 'chevron-up' : 'chevron-down'"
                      size="14"
                    />
                  </div>
                </th>
                <th class="py-3 px-4 text-start cursor-pointer select-none hover:text-primary" @click="handleSort('expiringOn')">
                  <div class="inline-flex items-center gap-1.5">
                    <span>Expiring On</span>
                    <CommonFeatherIcon
                      v-if="sortField === 'expiringOn'"
                      :name="sortOrder === 'asc' ? 'chevron-up' : 'chevron-down'"
                      size="14"
                    />
                  </div>
                </th>
                <th class="py-3 px-4 text-start cursor-pointer select-none hover:text-primary" @click="handleSort('status')">
                  <div class="inline-flex items-center gap-1.5">
                    <span>Status</span>
                    <CommonFeatherIcon
                      v-if="sortField === 'status'"
                      :name="sortOrder === 'asc' ? 'chevron-up' : 'chevron-down'"
                      size="14"
                    />
                  </div>
                </th>
                <th class="py-3 px-4 text-end">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200/60 dark:divide-gray-800 text-gray-700 dark:text-gray-300">
              <tr
                v-for="item in paginatedSubs"
                :key="item.id"
                class="hover:bg-gray-50/70 transition-colors dark:hover:bg-gray-800/40"
              >
                <!-- Subscriber -->
                <td class="py-3.5 px-4 font-semibold text-gray-900 dark:text-white">
                  <a href="javascript:void(0);" class="hover:text-primary transition-colors" @click="openViewModal(item)">
                    {{ item.subscriber }}
                  </a>
                </td>

                <!-- Plan -->
                <td class="py-3.5 px-4 text-gray-600 dark:text-gray-400">
                  {{ item.plan }}
                </td>

                <!-- Billing Cycle -->
                <td class="py-3.5 px-4 text-gray-600 dark:text-gray-400">
                  {{ item.billingCycle }}
                </td>

                <!-- Payment Method -->
                <td class="py-3.5 px-4">
                  <span
                    class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                  >
                    {{ item.method }}
                  </span>
                </td>

                <!-- Amount -->
                <td class="py-3.5 px-4 text-end font-semibold text-gray-900 dark:text-white">
                  {{ formatNumber(item.amount) }}
                </td>

                <!-- Created Date -->
                <td class="py-3.5 px-4 text-gray-600 dark:text-gray-400">
                  {{ item.createdDate }}
                </td>

                <!-- Expiring On -->
                <td class="py-3.5 px-4 text-gray-600 dark:text-gray-400">
                  {{ item.expiringOn }}
                </td>

                <!-- Status Badge -->
                <td class="py-3.5 px-4">
                  <span
                    :class="[
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold',
                      item.status === 'Paid'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/60'
                        : 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800/60',
                    ]"
                  >
                    {{ item.status }}
                  </span>
                </td>

                <!-- Actions -->
                <td class="py-3.5 px-4 text-end">
                  <div class="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      class="flex h-8 w-8 items-center justify-center rounded-lg text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors"
                      title="View Details"
                      @click="openViewModal(item)"
                    >
                      <CommonFeatherIcon name="eye" size="15" />
                    </button>
                    <button
                      type="button"
                      class="flex h-8 w-8 items-center justify-center rounded-lg text-[#FE9F43] hover:bg-[#FE9F43]/10 transition-colors"
                      title="Edit Subscription"
                      @click="openEditModal(item)"
                    >
                      <CommonFeatherIcon name="edit" size="15" />
                    </button>
                    <button
                      type="button"
                      class="flex h-8 w-8 items-center justify-center rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                      title="Delete"
                      @click="openDeleteModal(item)"
                    >
                      <CommonFeatherIcon name="trash-2" size="15" />
                    </button>
                  </div>
                </td>
              </tr>

              <!-- Empty state -->
              <tr v-if="filteredSubs.length === 0">
                <td colspan="9" class="py-8 text-center text-gray-400 dark:text-gray-500">
                  <div class="flex flex-col items-center justify-center gap-2">
                    <CommonFeatherIcon name="inbox" size="32" class="text-gray-300 dark:text-gray-600" />
                    <p class="text-sm">No subscriptions found matching your filters.</p>
                  </div>
                </td>
              </tr>
            </tbody>

            <!-- Table Footer Total -->
            <tfoot class="border-t-2 border-gray-200 bg-gray-50/75 dark:border-gray-800 dark:bg-gray-800/40 font-bold">
              <tr>
                <td class="py-3 px-4 text-gray-900 dark:text-white">Total</td>
                <td colspan="3"></td>
                <td class="py-3 px-4 text-end text-primary font-bold text-sm">
                  {{ formatNumber(totalAmount) }}
                </td>
                <td colspan="4"></td>
              </tr>
            </tfoot>
          </table>
        </div>

        <!-- Pagination & Summary -->
        <div
          class="flex flex-col sm:flex-row items-center justify-between gap-4 mt-5 text-xs sm:text-sm text-gray-500 dark:text-gray-400"
        >
          <div>
            Showing
            <span class="font-semibold text-gray-700 dark:text-gray-300">
              {{ filteredSubs.length ? (currentPage - 1) * perPage + 1 : 0 }}
            </span>
            to
            <span class="font-semibold text-gray-700 dark:text-gray-300">
              {{ Math.min(currentPage * perPage, filteredSubs.length) }}
            </span>
            of
            <span class="font-semibold text-gray-700 dark:text-gray-300">{{ filteredSubs.length }}</span>
            entries
          </div>

          <!-- Page Controls -->
          <div class="flex items-center gap-1.5">
            <button
              type="button"
              :disabled="currentPage === 1"
              :class="[
                'flex h-8 px-3 items-center justify-center rounded-lg border text-xs font-medium transition-colors',
                currentPage === 1
                  ? 'border-gray-200 text-gray-300 cursor-not-allowed dark:border-gray-800 dark:text-gray-600'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800',
              ]"
              @click="currentPage--"
            >
              Previous
            </button>

            <button
              v-for="p in totalPages"
              :key="p"
              type="button"
              :class="[
                'flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold transition-colors',
                currentPage === p
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800',
              ]"
              @click="currentPage = p"
            >
              {{ p }}
            </button>

            <button
              type="button"
              :disabled="currentPage === totalPages || totalPages === 0"
              :class="[
                'flex h-8 px-3 items-center justify-center rounded-lg border text-xs font-medium transition-colors',
                currentPage === totalPages || totalPages === 0
                  ? 'border-gray-200 text-gray-300 cursor-not-allowed dark:border-gray-800 dark:text-gray-600'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800',
              ]"
              @click="currentPage++"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 1. STANDARDIZED VIEW DETAILS MODAL -->
    <CommonBaseModal v-model="showViewModal" max-width="md" :title="selectedItem?.subscriber">
      <div v-if="selectedItem" class="space-y-3 py-1">
        <div class="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800">
          <span class="text-xs text-gray-500 dark:text-gray-400">Plan</span>
          <span class="text-sm font-semibold text-gray-900 dark:text-white">{{ selectedItem.plan }}</span>
        </div>
        <div class="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800">
          <span class="text-xs text-gray-500 dark:text-gray-400">Billing Cycle</span>
          <span class="text-sm font-medium text-gray-800 dark:text-gray-200">{{ selectedItem.billingCycle }}</span>
        </div>
        <div class="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800">
          <span class="text-xs text-gray-500 dark:text-gray-400">Payment Method</span>
          <span class="text-sm font-medium text-gray-800 dark:text-gray-200">{{ selectedItem.method }}</span>
        </div>
        <div class="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800">
          <span class="text-xs text-gray-500 dark:text-gray-400">Amount</span>
          <span class="text-base font-bold text-primary">Rp {{ formatNumber(selectedItem.amount) }}</span>
        </div>
        <div class="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800">
          <span class="text-xs text-gray-500 dark:text-gray-400">Created Date</span>
          <span class="text-sm text-gray-700 dark:text-gray-300">{{ selectedItem.createdDate }}</span>
        </div>
        <div class="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800">
          <span class="text-xs text-gray-500 dark:text-gray-400">Expiring On</span>
          <span class="text-sm text-gray-700 dark:text-gray-300">{{ selectedItem.expiringOn }}</span>
        </div>
        <div class="flex items-center justify-between pt-1">
          <span class="text-xs text-gray-500 dark:text-gray-400">Status</span>
          <span
            :class="[
              'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold',
              selectedItem.status === 'Paid'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400'
                : 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-400',
            ]"
          >
            {{ selectedItem.status }}
          </span>
        </div>
      </div>

      <template #footer="{ close }">
        <button
          type="button"
          class="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
          @click="close"
        >
          Close
        </button>
      </template>
    </CommonBaseModal>

    <!-- 2. STANDARDIZED EDIT SUBSCRIPTION MODAL -->
    <CommonBaseModal v-model="showEditModal" max-width="lg" title="Edit Subscription">
      <form class="space-y-4 py-2" @submit.prevent="handleSaveEdit">
        <div>
          <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1"> Subscriber Name </label>
          <input
            v-model="editForm.subscriber"
            type="text"
            required
            class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          />
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1"> Plan </label>
            <select
              v-model="editForm.plan"
              class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            >
              <option value="Basic (Monthly)">Basic (Monthly)</option>
              <option value="Basic (Yearly)">Basic (Yearly)</option>
              <option value="Advanced (Monthly)">Advanced (Monthly)</option>
              <option value="Advanced (Yearly)">Advanced (Yearly)</option>
              <option value="Enterprise (Monthly)">Enterprise (Monthly)</option>
              <option value="Enterprise (Yearly)">Enterprise (Yearly)</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1"> Billing Cycle </label>
            <select
              v-model="editForm.billingCycle"
              class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            >
              <option value="30 Days">30 Days</option>
              <option value="365 Days">365 Days</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1"> Payment Method </label>
            <select
              v-model="editForm.method"
              class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            >
              <option value="Credit Card">Credit Card</option>
              <option value="Paypal">Paypal</option>
              <option value="Debit Card">Debit Card</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1"> Amount (Rp) </label>
            <input
              v-model.number="editForm.amount"
              type="number"
              step="1000"
              required
              class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1"> Expiring On </label>
            <input
              v-model="editForm.expiringOn"
              type="text"
              placeholder="e.g. 11 Oct 2024"
              class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1"> Status </label>
            <select
              v-model="editForm.status"
              class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            >
              <option value="Paid">Paid</option>
              <option value="Unpaid">Unpaid</option>
            </select>
          </div>
        </div>
      </form>

      <template #footer="{ close }">
        <button
          type="button"
          class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
          @click="close"
        >
          Cancel
        </button>
        <button
          type="button"
          class="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 shadow-sm transition-colors"
          @click="handleSaveEdit"
        >
          Save Changes
        </button>
      </template>
    </CommonBaseModal>

    <!-- 3. STANDARDIZED DELETE CONFIRMATION MODAL -->
    <CommonConfirmModal
      v-model="showDeleteModal"
      title="Delete Subscription?"
      :message="`Are you sure you want to delete the subscription for '${selectedItem?.subscriber}'? This action cannot be undone.`"
      confirm-text="Yes, Delete"
      variant="danger"
      @confirm="handleConfirmDelete"
    />
  </div>
</template>
