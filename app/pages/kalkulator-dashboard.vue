<script setup lang="ts">definePageMeta({
  layout: "default",
});

useHead({
  title: "Kalkulator Dashboard - Kacetak System",
});

// --- State: Controls & Actions ---
const isHeaderCollapsed = ref(false);
const isRefreshing = ref(false);
const toastMessage = ref<string | null>(null);
const showFilterPanel = ref(false);
const searchQuery = ref("");
const selectedCategory = ref("All");
const selectedStatus = ref("All");

// Filter panel models
const filterProduct = ref("");
const filterCategory = ref("");
const filterSubCategory = ref("");
const filterBrand = ref("");
const filterPrice = ref("");

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
    searchQuery.value = "";
    selectedCategory.value = "All";
    selectedStatus.value = "All";
    showToast("Calculator dashboard metrics refreshed.");
  }, 500);
}

function exportPdf() {
  showToast("Exporting calculator report to PDF...");
}

function printPage() {
  window.print();
}

// --- Data Table: Users & Calculation Stats ---

const { data: kalkulatorDashboardData } = await useFetch<CalculatorItem[]>('/api/kalkulator-dashboard')
const tableData = ref<CalculatorItem[]>(kalkulatorDashboardData.value ?? []);

// Filtering
const filteredList = computed(() => {
  return tableData.value.filter((item) => {
    const matchesSearch = item.user.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesStatus = selectedStatus.value === "All" || item.status === selectedStatus.value;
    return matchesSearch && matchesStatus;
  });
});

// Pagination
const currentPage = ref(1);
const pageSize = ref(10);

const paginatedList = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return filteredList.value.slice(start, start + pageSize.value);
});

const totalPages = computed(() => Math.ceil(filteredList.value.length / pageSize.value) || 1);

// --- Modals State ---
// 1. View Modal
const isViewModalOpen = ref(false);
const viewingUser = ref<CalculatorItem | null>(null);

function openViewModal(item: CalculatorItem) {
  viewingUser.value = item;
  isViewModalOpen.value = true;
}

// 2. Edit Modal
const isEditModalOpen = ref(false);
const editingUser = ref<CalculatorItem | null>(null);
const editForm = ref({
  user: "",
  calculate: 0,
  request: 0,
  usage: 0,
  status: "Active" as "Active" | "Disabled",
});

function openEditModal(item: CalculatorItem) {
  editingUser.value = item;
  editForm.value = {
    user: item.user,
    calculate: item.calculate,
    request: item.request,
    usage: item.usage,
    status: item.status,
  };
  isEditModalOpen.value = true;
}

function saveEdit() {
  if (!editingUser.value) return;
  editingUser.value.user = editForm.value.user;
  editingUser.value.calculate = Number(editForm.value.calculate);
  editingUser.value.request = Number(editForm.value.request);
  editingUser.value.usage = Number(editForm.value.usage);
  editingUser.value.status = editForm.value.status;
  isEditModalOpen.value = false;
  showToast(`Updated user record for ${editForm.value.user}.`);
}

// 3. Delete Confirmation Modal
const isDeleteModalOpen = ref(false);
const deletingUser = ref<CalculatorItem | null>(null);

function openDeleteModal(item: CalculatorItem) {
  deletingUser.value = item;
  isDeleteModalOpen.value = true;
}

function confirmDelete() {
  if (!deletingUser.value) return;
  tableData.value = tableData.value.filter((i) => i.id !== deletingUser.value!.id);
  showToast(`Deleted record for ${deletingUser.value.user}.`);
  isDeleteModalOpen.value = false;
  deletingUser.value = null;
}

// --- Telemetry Chart Helper ---
// 7-day sparkline coordinates matching chart.js data from HTML:
// labels: ['Aug 26', 'Aug 27', 'Aug 28', 'Aug 29', 'Aug 30', 'Aug 31', 'Sep 1']
// this week: [0, 100, 0, 0, 1000, 0, 0]
// last week: [16, 16, 15, 15, 16, 16, 16]
const days = ["Aug 26", "Aug 27", "Aug 28", "Aug 29", "Aug 30", "Aug 31", "Sep 1"];

function getChartPath(points: number[], maxVal = 1000, height = 90, width = 340) {
  const stepX = width / (points.length - 1);
  return points
    .map((val, i) => {
      const x = i * stepX;
      const y = height - (val / maxVal) * (height - 15) - 5;
      return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
}

const thisWeekPath = computed(() => getChartPath([0, 100, 0, 0, 1000, 0, 0]));
const lastWeekPath = computed(() => getChartPath([16, 16, 15, 15, 16, 16, 16]));</script>

<template>
  <div class="page-wrapper min-h-screen pb-10">
    <div class="content mx-auto max-w-[1600px] px-4 pt-4 sm:px-6">
      <!-- Floating Toast Notification -->
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
          <CommonFeatherIcon name="check-circle" size="16" class="text-[#28C76F]" />
          <span>{{ toastMessage }}</span>
        </div>
      </Transition>

      <!-- Page Header -->
      <div class="page-header mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div class="page-title">
          <h4 class="text-xl font-bold text-gray-900 dark:text-white">Kalkulator Dashboard</h4>
          <h6 v-show="!isHeaderCollapsed" class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Manage kalkulator</h6>
        </div>

        <!-- Action Buttons (PDF, Print, Refresh, Collapse) -->
        <ul class="table-top-head flex items-center gap-2">
          <li>
            <button
              type="button"
              class="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:border-primary hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
              title="Pdf"
              @click="exportPdf"
            >
              <img src="/assets/img/icons/pdf.svg" alt="pdf" class="h-4 w-4" />
            </button>
          </li>
          <li>
            <button
              type="button"
              class="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:border-primary hover:text-primary dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
              title="Print"
              @click="printPage"
            >
              <CommonFeatherIcon name="printer" size="16" />
            </button>
          </li>
          <li>
            <button
              type="button"
              class="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:border-primary hover:bg-primary hover:text-white dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
              title="Refresh"
              @click="refreshAllData"
            >
              <CommonFeatherIcon name="rotate-ccw" size="16" :class="{ 'animate-spin': isRefreshing }" />
            </button>
          </li>
          <li>
            <button
              type="button"
              class="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:border-primary hover:bg-primary hover:text-white dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
              title="Collapse"
              @click="isHeaderCollapsed = !isHeaderCollapsed"
            >
              <CommonFeatherIcon :name="isHeaderCollapsed ? 'chevron-down' : 'chevron-up'" size="16" />
            </button>
          </li>
        </ul>
      </div>

      <!-- Dashboard Statistik Build (Dark Telemetry Card) -->
      <div class="mb-5 rounded-xl border border-slate-700/60 bg-[#161D31] p-5 sm:p-6 text-white shadow-md">
        <div class="mb-4">
          <span class="inline-block rounded bg-[#334155] px-2.5 py-1 text-xs font-semibold text-slate-200">
            Realtime Database
          </span>
        </div>

        <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
          <!-- Col 1: User (current) -->
          <div class="flex flex-col justify-between">
            <div>
              <div class="text-xs font-semibold text-slate-400">User (current)</div>
              <div class="text-3xl font-bold text-white mb-2">56</div>
            </div>
            <!-- SVG Sparkline Chart -->
            <div class="w-full pt-2">
              <svg viewBox="0 0 340 90" class="w-full h-24 overflow-visible">
                <!-- Last week dashed -->
                <path :d="lastWeekPath" fill="none" stroke="#64748B" stroke-width="1.5" stroke-dasharray="4 4" />
                <!-- This week solid -->
                <path :d="thisWeekPath" fill="none" stroke="#3B82F6" stroke-width="2.5" stroke-linecap="round" />
                <!-- Peak Dot -->
                <circle cx="226" cy="18" r="4.5" fill="#3B82F6" stroke="#ffffff" stroke-width="2" />
              </svg>
            </div>
          </div>

          <!-- Col 2: Total Request (7d total) -->
          <div class="flex flex-col justify-between">
            <div>
              <div class="text-xs font-semibold text-slate-400">Total Request (7d total)</div>
              <div class="text-3xl font-bold text-white">7920 Requests</div>
              <div class="text-xs font-semibold text-[#28C76F] mt-0.5 mb-2">+5,056.2%</div>
            </div>
            <!-- SVG Sparkline Chart -->
            <div class="w-full pt-2">
              <svg viewBox="0 0 340 90" class="w-full h-24 overflow-visible">
                <path :d="lastWeekPath" fill="none" stroke="#64748B" stroke-width="1.5" stroke-dasharray="4 4" />
                <path :d="thisWeekPath" fill="none" stroke="#3B82F6" stroke-width="2.5" stroke-linecap="round" />
                <circle cx="226" cy="18" r="4.5" fill="#3B82F6" stroke="#ffffff" stroke-width="2" />
              </svg>
            </div>
          </div>

          <!-- Col 3: Total Calculate (7d total) -->
          <div class="flex flex-col justify-between">
            <div>
              <div class="text-xs font-semibold text-slate-400">Total Calculate (7d total)</div>
              <div class="text-3xl font-bold text-white">18032 Calculates</div>
              <div class="text-xs font-semibold text-[#28C76F] mt-0.5 mb-2">+2,056.2%</div>
            </div>
            <!-- SVG Sparkline Chart -->
            <div class="w-full pt-2">
              <svg viewBox="0 0 340 90" class="w-full h-24 overflow-visible">
                <path :d="lastWeekPath" fill="none" stroke="#64748B" stroke-width="1.5" stroke-dasharray="4 4" />
                <path :d="thisWeekPath" fill="none" stroke="#3B82F6" stroke-width="2.5" stroke-linecap="round" />
                <circle cx="226" cy="18" r="4.5" fill="#3B82F6" stroke="#ffffff" stroke-width="2" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Legend Footer -->
        <div class="mt-4 flex items-center justify-between border-t border-slate-700/60 pt-3 text-xs text-slate-400">
          <span class="flex items-center gap-1.5">
            <span class="h-2.5 w-2.5 rounded-full bg-[#3B82F6]"></span>
            This week
          </span>
          <span class="flex items-center gap-1.5">
            <span class="inline-block w-4 border-t border-dashed border-slate-400"></span>
            Last week
          </span>
        </div>
      </div>

      <!-- Data Table Card -->
      <div class="table-list-card rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <!-- Table Top Controls -->
        <div class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <!-- Search Input -->
          <div class="search-set flex items-center gap-2">
            <div class="relative w-full sm:w-64">
              <input
                v-model="searchQuery"
                type="text"
                class="w-full rounded-lg border border-gray-200 bg-white ps-9 pe-3 py-2 text-xs font-medium text-gray-800 placeholder-gray-400 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                placeholder="Search..."
              />
              <span class="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3 text-gray-400">
                <CommonFeatherIcon name="search" size="14" />
              </span>
            </div>
          </div>

          <!-- Filters & Actions -->
          <div class="flex items-center gap-2">
            <!-- Category Filter Button/Dropdown -->
            <div class="relative">
              <button
                type="button"
                class="flex items-center gap-1.5 rounded-lg border border-primary bg-white px-3 py-2 text-xs font-semibold text-primary transition hover:bg-primary hover:text-white dark:bg-gray-800"
                @click="showFilterPanel = !showFilterPanel"
              >
                <CommonFeatherIcon name="filter" size="14" />
                <span>Filter</span>
              </button>
            </div>

            <!-- Status Dropdown -->
            <select
              v-model="selectedStatus"
              class="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Disabled">Disabled</option>
            </select>
          </div>
        </div>

        <!-- Filter Inputs Collapsible Bar -->
        <div
          v-if="showFilterPanel"
          class="mb-4 rounded-xl border border-gray-100 bg-gray-50/60 p-4 dark:border-gray-800 dark:bg-gray-800/40"
        >
          <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6">
            <div>
              <label class="mb-1 block text-[11px] font-semibold text-gray-500">Choose Product</label>
              <select
                v-model="filterProduct"
                class="w-full rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              >
                <option value="">Choose Product</option>
                <option value="Lenovo">Lenovo 3rd Generation</option>
                <option value="Nike">Nike Jordan</option>
              </select>
            </div>
            <div>
              <label class="mb-1 block text-[11px] font-semibold text-gray-500">Choose Category</label>
              <select
                v-model="filterCategory"
                class="w-full rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              >
                <option value="">Choose Category</option>
                <option value="Laptop">Laptop</option>
                <option value="Shoe">Shoe</option>
              </select>
            </div>
            <div>
              <label class="mb-1 block text-[11px] font-semibold text-gray-500">Sub Category</label>
              <select
                v-model="filterSubCategory"
                class="w-full rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              >
                <option value="">Choose Sub Category</option>
                <option value="Computers">Computers</option>
                <option value="Fruits">Fruits</option>
              </select>
            </div>
            <div>
              <label class="mb-1 block text-[11px] font-semibold text-gray-500">All Brand</label>
              <select
                v-model="filterBrand"
                class="w-full rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              >
                <option value="">All Brand</option>
                <option value="Lenovo">Lenovo</option>
                <option value="Nike">Nike</option>
              </select>
            </div>
            <div>
              <label class="mb-1 block text-[11px] font-semibold text-gray-500">Price</label>
              <select
                v-model="filterPrice"
                class="w-full rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              >
                <option value="">Price</option>
                <option value="12500">$12,500.00</option>
              </select>
            </div>
            <div class="flex items-end">
              <button
                type="button"
                class="flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white transition hover:bg-primary-hover shadow-sm"
                @click="showToast('Filters applied.')"
              >
                <CommonFeatherIcon name="search" size="14" />
                Search
              </button>
            </div>
          </div>
        </div>

        <!-- Data Table -->
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr
                class="border-b border-gray-100 bg-gray-50/60 text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:border-gray-800 dark:bg-gray-800/40"
              >
                <th class="py-3.5 ps-4 pe-3 min-w-[180px]">User</th>
                <th class="py-3.5 px-4 min-w-[120px]">Calculate</th>
                <th class="py-3.5 px-4 min-w-[120px]">Request</th>
                <th class="py-3.5 px-4 min-w-[140px]">Usage</th>
                <th class="py-3.5 px-4 min-w-[100px]">Status</th>
                <th class="py-3.5 pe-4 ps-3 text-end min-w-[110px]">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50 text-xs dark:divide-gray-800/60">
              <tr v-for="item in paginatedList" :key="item.id" class="transition hover:bg-gray-50/80 dark:hover:bg-gray-800/40">
                <td class="py-3.5 ps-4 pe-3 font-semibold text-secondary dark:text-gray-100">
                  {{ item.user }}
                </td>
                <td class="py-3.5 px-4 font-bold text-secondary dark:text-white">
                  {{ item.calculate.toLocaleString() }}
                </td>
                <td class="py-3.5 px-4 text-gray-600 dark:text-gray-300 font-medium">
                  {{ item.request.toLocaleString() }}
                </td>
                <td class="py-3.5 px-4">
                  <div class="flex items-center gap-2">
                    <div class="h-2 w-20 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                      <div
                        class="h-full rounded-full transition-all"
                        :class="[item.usage >= 80 ? 'bg-primary' : item.usage >= 50 ? 'bg-emerald-500' : 'bg-blue-500']"
                        :style="{ width: `${item.usage}%` }"
                      ></div>
                    </div>
                    <span class="font-bold text-secondary dark:text-gray-200">{{ item.usage }}%</span>
                  </div>
                </td>
                <td class="py-3.5 px-4">
                  <span
                    v-if="item.status === 'Active'"
                    class="inline-block rounded bg-primary px-2.5 py-0.5 text-[11px] font-semibold text-white"
                  >
                    Active
                  </span>
                  <span v-else class="inline-block rounded bg-[#EA5455] px-2.5 py-0.5 text-[11px] font-semibold text-white">
                    Disabled
                  </span>
                </td>
                <td class="py-3.5 pe-4 ps-3 text-end">
                  <div class="flex items-center justify-end gap-1.5">
                    <!-- View Button -->
                    <button
                      type="button"
                      class="flex h-7 w-7 items-center justify-center rounded border border-gray-200 bg-white text-gray-500 transition hover:border-primary hover:text-primary dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
                      title="View Details"
                      @click="openViewModal(item)"
                    >
                      <CommonFeatherIcon name="eye" size="14" />
                    </button>
                    <!-- Edit Button -->
                    <button
                      type="button"
                      class="flex h-7 w-7 items-center justify-center rounded border border-gray-200 bg-white text-gray-500 transition hover:border-blue-500 hover:text-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
                      title="Edit"
                      @click="openEditModal(item)"
                    >
                      <CommonFeatherIcon name="edit" size="14" />
                    </button>
                    <!-- Delete Button -->
                    <button
                      type="button"
                      class="flex h-7 w-7 items-center justify-center rounded border border-gray-200 bg-white text-gray-500 transition hover:border-red-500 hover:text-red-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
                      title="Delete"
                      @click="openDeleteModal(item)"
                    >
                      <CommonFeatherIcon name="trash-2" size="14" />
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="paginatedList.length === 0">
                <td colspan="6" class="py-8 text-center text-xs text-gray-400">No calculator logs matching your search.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Table Pagination Footer -->
        <div
          class="mt-4 flex flex-col items-center justify-between gap-3 border-t border-gray-100 pt-4 sm:flex-row dark:border-gray-800"
        >
          <div class="text-xs text-gray-500 dark:text-gray-400">
            Showing {{ filteredList.length === 0 ? 0 : (currentPage - 1) * pageSize + 1 }} to
            {{ Math.min(currentPage * pageSize, filteredList.length) }} of {{ filteredList.length }} entries
          </div>

          <div class="flex items-center gap-1.5">
            <button
              type="button"
              :disabled="currentPage <= 1"
              class="flex h-8 items-center justify-center rounded-lg border border-gray-200 bg-white px-3 text-xs font-semibold text-gray-600 transition hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
              @click="currentPage--"
            >
              Previous
            </button>
            <button
              v-for="p in totalPages"
              :key="p"
              type="button"
              :class="[
                'flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold transition',
                currentPage === p
                  ? 'bg-primary text-white shadow-sm'
                  : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300',
              ]"
              @click="currentPage = p"
            >
              {{ p }}
            </button>
            <button
              type="button"
              :disabled="currentPage >= totalPages"
              class="flex h-8 items-center justify-center rounded-lg border border-gray-200 bg-white px-3 text-xs font-semibold text-gray-600 transition hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
              @click="currentPage++"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal: View Calculator Details -->
    <CommonBaseModal v-model="isViewModalOpen" title="User Calculation Metrics" max-width="md">
      <div v-if="viewingUser" class="space-y-4 text-xs sm:text-sm">
        <div class="flex items-center justify-between border-b border-gray-100 pb-3 dark:border-gray-800">
          <div>
            <h4 class="text-base font-bold text-secondary dark:text-white">{{ viewingUser.user }}</h4>
            <span class="text-xs text-gray-400"
              >{{ viewingUser.role || "Calculator Operator" }} • {{ viewingUser.lastActive }}</span
            >
          </div>
          <span
            :class="[
              'inline-block px-2.5 py-0.5 rounded text-xs font-semibold',
              viewingUser.status === 'Active'
                ? 'bg-emerald-50 text-emerald-600 border border-emerald-500'
                : 'bg-red-50 text-red-600 border border-red-500',
            ]"
          >
            {{ viewingUser.status }}
          </span>
        </div>

        <div class="grid grid-cols-3 gap-3 py-2 text-center">
          <div class="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50">
            <span class="text-[11px] text-gray-400 block mb-1">Calculations</span>
            <span class="text-base font-bold text-secondary dark:text-white">{{ viewingUser.calculate.toLocaleString() }}</span>
          </div>
          <div class="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50">
            <span class="text-[11px] text-gray-400 block mb-1">API Requests</span>
            <span class="text-base font-bold text-primary">{{ viewingUser.request.toLocaleString() }}</span>
          </div>
          <div class="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50">
            <span class="text-[11px] text-gray-400 block mb-1">Quota Usage</span>
            <span class="text-base font-bold text-secondary dark:text-white">{{ viewingUser.usage }}%</span>
          </div>
        </div>

        <div class="rounded-lg border border-gray-100 bg-gray-50/50 p-3 dark:border-gray-800 dark:bg-gray-800/30">
          <h6 class="text-xs font-bold text-secondary dark:text-gray-200 mb-1">Printing & Layout Estimations</h6>
          <p class="text-xs text-gray-500 dark:text-gray-400">
            This operator computes sheet optimizations, finishing costs, and plano layouts in real time.
          </p>
        </div>
      </div>
      <template #footer>
        <button
          type="button"
          class="rounded-lg bg-gray-100 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200"
          @click="isViewModalOpen = false"
        >
          Close
        </button>
      </template>
    </CommonBaseModal>

    <!-- Modal: Edit Calculator Record -->
    <CommonBaseModal v-model="isEditModalOpen" title="Edit Calculator Record" max-width="md">
      <div v-if="editingUser" class="space-y-3.5 text-xs">
        <div>
          <label class="mb-1 block font-semibold text-gray-700 dark:text-gray-300">User Name</label>
          <input
            v-model="editForm.user"
            type="text"
            class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 focus:border-primary focus:outline-none"
          />
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="mb-1 block font-semibold text-gray-700 dark:text-gray-300">Calculate Count</label>
            <input
              v-model="editForm.calculate"
              type="number"
              class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 focus:border-primary focus:outline-none"
            />
          </div>
          <div>
            <label class="mb-1 block font-semibold text-gray-700 dark:text-gray-300">Request Count</label>
            <input
              v-model="editForm.request"
              type="number"
              class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 focus:border-primary focus:outline-none"
            />
          </div>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="mb-1 block font-semibold text-gray-700 dark:text-gray-300">Quota Usage (%)</label>
            <input
              v-model="editForm.usage"
              type="number"
              min="0"
              max="100"
              class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 focus:border-primary focus:outline-none"
            />
          </div>
          <div>
            <label class="mb-1 block font-semibold text-gray-700 dark:text-gray-300">Status</label>
            <select
              v-model="editForm.status"
              class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 focus:border-primary focus:outline-none"
            >
              <option value="Active">Active</option>
              <option value="Disabled">Disabled</option>
            </select>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="flex items-center justify-end gap-2">
          <button
            type="button"
            class="rounded-lg bg-gray-100 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200"
            @click="isEditModalOpen = false"
          >
            Cancel
          </button>
          <button
            type="button"
            class="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary-hover shadow-sm"
            @click="saveEdit"
          >
            Save Changes
          </button>
        </div>
      </template>
    </CommonBaseModal>

    <!-- Modal: Delete Confirmation -->
    <CommonConfirmModal
      v-model="isDeleteModalOpen"
      title="Delete Calculator Record"
      :message="`Are you sure you want to delete the calculator metrics record for '${deletingUser?.user}'? This action cannot be undone.`"
      confirm-text="Yes, Delete"
      confirm-variant="danger"
      @confirm="confirmDelete"
    />
  </div>
</template>
