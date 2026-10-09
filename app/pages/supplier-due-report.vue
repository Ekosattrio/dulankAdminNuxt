<<<<<<< HEAD
<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <CommonPageHeader title="Supplier Due Report" subtitle="Manage supplier accounts payable and due aging">
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

    <!-- Table Card -->
    <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="mb-5">
        <CommonSearchFilter v-model="searchQuery" placeholder="Search supplier..." />
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-start text-xs text-gray-700 dark:text-gray-300">
          <thead
            class="bg-gray-50 text-[11px] font-semibold uppercase text-gray-500 border-b border-gray-200 dark:bg-gray-800/50 dark:border-gray-700 dark:text-gray-400"
          >
            <tr>
              <th class="px-4 py-3 text-start whitespace-nowrap">Supplier Name</th>
              <th class="px-4 py-3 text-center whitespace-nowrap">Purchases Due</th>
              <th class="px-4 py-3 text-end whitespace-nowrap">Amount Due (IDR)</th>
              <th class="px-4 py-3 text-center whitespace-nowrap">Days Due</th>
              <th class="px-4 py-3 text-center whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <tr v-for="item in filteredDues" :key="item.name" class="transition-colors hover:bg-gray-50/75 dark:hover:bg-gray-800/40">
              <td class="px-4 py-3 whitespace-nowrap font-bold text-gray-900 dark:text-gray-100">{{ item.name }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-center">{{ item.purchasesDue }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-end font-bold text-rose-600 dark:text-rose-400">{{ formatNumber(item.amountDue) }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-center">
                <CommonStatusPill :status="item.daysDue" :tone="parseInt(item.daysDue) > 10 ? 'rose' : 'amber'" />
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-center">
                <CommonRowActions :item="item" show-view @view="viewDetail(item)" />
              </td>
            </tr>
            <tr v-if="filteredDues.length === 0">
              <td colspan="5" class="p-8 text-center text-gray-400">No records found.</td>
            </tr>
          </tbody>
          <tfoot class="border-t-2 border-gray-200 bg-gray-50/75 font-semibold text-gray-800 dark:border-gray-700 dark:bg-gray-800/60 dark:text-white">
            <tr>
              <td class="px-4 py-3">Total</td>
              <td class="px-4 py-3 text-center">{{ totalPurchasesDue }}</td>
              <td class="px-4 py-3 text-end text-rose-600 dark:text-rose-400">{{ formatNumber(totalAmountDue) }}</td>
              <td class="px-4 py-3" colspan="2"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>

    <!-- View Modal -->
    <CommonBaseModal v-model="showModal" :title="`Outstanding Invoices - ${activeItem?.name ?? ''}`" maxWidth="md">
      <div v-if="activeItem" class="space-y-2 text-sm">
        <div class="flex justify-between"><span class="text-gray-500 dark:text-gray-400">Supplier</span><span class="font-semibold text-gray-800 dark:text-gray-200">{{ activeItem.name }}</span></div>
        <div class="flex justify-between"><span class="text-gray-500 dark:text-gray-400">Total Pending Purchases</span><span class="text-gray-800 dark:text-gray-200">{{ activeItem.purchasesDue }}</span></div>
        <div class="flex justify-between"><span class="text-gray-500 dark:text-gray-400">Total Amount Due</span><span class="font-bold text-rose-600 dark:text-rose-400">Rp {{ formatNumber(activeItem.amountDue) }}</span></div>
        <div class="flex justify-between"><span class="text-gray-500 dark:text-gray-400">Overdue Aging</span><span class="text-gray-800 dark:text-gray-200">{{ activeItem.daysDue }}</span></div>
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

const { data: supplierDueReportData } = await useFetch<any[]>('/api/supplier-due-report')
const dues = ref(supplierDueReportData.value ?? []);

const searchQuery = ref("");

const filteredDues = computed(() => {
  return dues.value.filter((d) => !searchQuery.value || d.name.toLowerCase().includes(searchQuery.value.toLowerCase()));
});

const totalPurchasesDue = computed(() => filteredDues.value.reduce((acc, d) => acc + d.purchasesDue, 0));
const totalAmountDue = computed(() => filteredDues.value.reduce((acc, d) => acc + d.amountDue, 0));

const showModal = ref(false);
const activeItem = ref<any>(null);

const viewDetail = (item: any) => {
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
useMockSync('supplier-due-report', dues);
</script>
=======
<script setup lang="ts">
import SupplierDueReportWorkspace from '~/components/pages/reports/SupplierDueReportWorkspace.vue'

definePageMeta({
  layout: 'default',
})

useLegacyPage({
  title: 'Supplier Due Report',
  sweetAlert: false,
})
</script>

<template>
  <div class="dulank-page dulank-page-supplier-due-report p-4 md:p-6">
    <SupplierDueReportWorkspace />
  </div>
</template>
>>>>>>> origin/eko
