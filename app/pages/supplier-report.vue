<<<<<<< HEAD
<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <CommonPageHeader title="Supplier Report" subtitle="Manage supplier purchasing transactions and order history">
      <template #actions>
        <div class="flex flex-wrap items-center gap-2">
          <button
            type="button"
            class="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 hover:text-primary dark:border-gray-700 dark:hover:bg-gray-800"
            title="Export PDF"
            @click="printReport"
          >
            <CommonFeatherIcon name="file-text" size="18" />
          </button>
          <button
            type="button"
            class="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 hover:text-primary dark:border-gray-700 dark:hover:bg-gray-800"
            title="Print"
            @click="printReport"
          >
            <CommonFeatherIcon name="printer" size="18" />
          </button>
          <button
            type="button"
            class="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 hover:text-primary dark:border-gray-700 dark:hover:bg-gray-800"
            title="Refresh"
            @click="refreshReport"
          >
            <CommonFeatherIcon name="rotate-ccw" size="18" />
          </button>
        </div>
      </template>
    </CommonPageHeader>

    <!-- Stat Cards -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <CommonStatCard label="Total Purchase Amount" :value="`Rp ${formatNumber(totalPurchaseAmount)}`" icon="shopping-cart" tone="primary" />
      <CommonStatCard label="Total Purchase (Paid)" :value="`Rp ${formatNumber(totalPaid)}`" icon="check-circle" tone="success" />
      <CommonStatCard label="Total Purchase Due" :value="`Rp ${formatNumber(totalDue)}`" icon="clock" tone="warning" />
      <CommonStatCard label="Total Overdue" value="Rp 1.800.000" icon="alert-triangle" tone="danger" />
    </div>

    <!-- Table Card -->
    <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="mb-5">
        <CommonSearchFilter v-model="searchQuery" placeholder="Search item or category..." />
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-start text-xs text-gray-700 dark:text-gray-300">
          <thead
            class="bg-gray-50 text-[11px] font-semibold uppercase text-gray-500 border-b border-gray-200 dark:bg-gray-800/50 dark:border-gray-700 dark:text-gray-400"
          >
            <tr>
              <th class="px-4 py-3 text-start whitespace-nowrap">Date</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Category</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Purchase Item</th>
              <th class="px-4 py-3 text-center whitespace-nowrap">Qty</th>
              <th class="px-4 py-3 text-end whitespace-nowrap">Amount (IDR)</th>
              <th class="px-4 py-3 text-center whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <tr v-for="item in filteredRows" :key="item.id" class="transition-colors hover:bg-gray-50/75 dark:hover:bg-gray-800/40">
              <td class="px-4 py-3 whitespace-nowrap">{{ item.date }}</td>
              <td class="px-4 py-3 whitespace-nowrap">{{ item.category }}</td>
              <td class="px-4 py-3 whitespace-nowrap font-semibold text-gray-900 dark:text-gray-100">{{ item.item }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-center">{{ item.qty }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-end font-bold text-emerald-600 dark:text-emerald-400">{{ formatNumber(item.amount) }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-center">
                <CommonRowActions :item="item" show-view @view="viewItem(item)" />
              </td>
            </tr>
            <tr v-if="filteredRows.length === 0">
              <td colspan="6" class="p-8 text-center text-gray-400">No records found.</td>
            </tr>
          </tbody>
          <tfoot class="border-t-2 border-gray-200 bg-gray-50/75 font-semibold text-gray-800 dark:border-gray-700 dark:bg-gray-800/60 dark:text-white">
            <tr>
              <td class="px-4 py-3" colspan="3">Total</td>
              <td class="px-4 py-3 text-center">{{ totalQty }}</td>
              <td class="px-4 py-3 text-end text-primary">{{ formatNumber(totalPurchaseAmount) }}</td>
              <td class="px-4 py-3"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>

    <!-- View Modal -->
    <CommonBaseModal v-model="showModal" title="Purchase Item Details" maxWidth="md">
      <div v-if="activeItem" class="space-y-2 text-sm">
        <div class="flex justify-between"><span class="text-gray-500 dark:text-gray-400">Item</span><span class="font-semibold text-gray-800 dark:text-gray-200">{{ activeItem.item }}</span></div>
        <div class="flex justify-between"><span class="text-gray-500 dark:text-gray-400">Category</span><span class="text-gray-800 dark:text-gray-200">{{ activeItem.category }}</span></div>
        <div class="flex justify-between"><span class="text-gray-500 dark:text-gray-400">Date</span><span class="text-gray-800 dark:text-gray-200">{{ activeItem.date }}</span></div>
        <div class="flex justify-between"><span class="text-gray-500 dark:text-gray-400">Quantity</span><span class="text-gray-800 dark:text-gray-200">{{ activeItem.qty }}</span></div>
        <div class="flex justify-between"><span class="text-gray-500 dark:text-gray-400">Amount</span><span class="font-bold text-gray-800 dark:text-gray-200">Rp {{ formatNumber(activeItem.amount) }}</span></div>
      </div>
      <template #footer>
        <div class="flex justify-end">
          <button
            type="button"
            class="rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
            @click="showModal = false"
          >
            Close
          </button>
        </div>
      </template>
    </CommonBaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { formatNumber } from "~/composables/useFormatters";

const { data: supplierReportData } = await useFetch<any[]>('/api/supplier-report')
const rows = ref(supplierReportData.value ?? []);

const searchQuery = ref("");

const filteredRows = computed(() => {
  return rows.value.filter((r) => {
    const q = searchQuery.value.toLowerCase();
    return !q || r.item.toLowerCase().includes(q) || r.category.toLowerCase().includes(q);
  });
});

const totalQty = computed(() => filteredRows.value.reduce((acc, r) => acc + r.qty, 0));
const totalPurchaseAmount = computed(() => filteredRows.value.reduce((acc, r) => acc + r.amount, 0));
const totalPaid = computed(() => totalPurchaseAmount.value * 0.85);
const totalDue = computed(() => totalPurchaseAmount.value * 0.15);

const showModal = ref(false);
const activeItem = ref<any>(null);

const viewItem = (item: any) => {
  activeItem.value = item;
  showModal.value = true;
};

const printReport = () => {
  window.print();
};

const refreshReport = () => {
  searchQuery.value = "";
};

const toggleHeader = () => {
  // toggle
};
useMockSync('supplier-report', rows);
</script>
=======
<script setup lang="ts">
import SupplierReportWorkspace from '~/components/pages/reports/SupplierReportWorkspace.vue'

useLegacyPage({ title: 'Supplier Report', sweetAlert: false })
</script>

<template>
  <div class="dulank-page dulank-page-supplier-report">
    <SupplierReportWorkspace />
  </div>
</template>
>>>>>>> origin/eko
