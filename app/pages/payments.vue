<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <CommonPageHeader title="Payments" subtitle="Manage payment in and payment out">
      <template #actions>
        <div class="flex flex-wrap items-center gap-2">
          <button
            type="button"
            class="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 hover:text-primary dark:border-gray-700 dark:hover:bg-gray-800"
            title="Export PDF"
            @click="exportPdf"
          >
            <CommonFeatherIcon name="file-text" size="18" />
          </button>
          <button
            type="button"
            class="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 hover:text-primary dark:border-gray-700 dark:hover:bg-gray-800"
            title="Print"
            @click="printTable"
          >
            <CommonFeatherIcon name="printer" size="18" />
          </button>
          <button
            type="button"
            class="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 hover:text-primary dark:border-gray-700 dark:hover:bg-gray-800"
            title="Refresh"
            @click="refresh"
          >
            <CommonFeatherIcon name="rotate-ccw" size="18" />
          </button>
        </div>
      </template>
    </CommonPageHeader>

    <!-- Payment List Card -->
    <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <!-- Toolbar -->
      <div class="mb-5 flex flex-wrap items-center justify-between gap-4">
        <CommonSearchFilter v-model="searchQuery" placeholder="Search ref no, name..." />
        <div class="flex flex-wrap items-center gap-3">
          <CommonFilterSelect
            v-model="filterType"
            allLabel="All Types"
            :options="[
              { value: 'Payment-In', label: 'Payment-In' },
              { value: 'Payment-Out', label: 'Payment-Out' },
            ]"
          />
          <CommonFilterSelect
            v-model="filterMethod"
            allLabel="All Methods"
            :options="[
              { value: 'Cash', label: 'Cash' },
              { value: 'Transfer', label: 'Transfer' },
            ]"
          />
        </div>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="w-full text-start text-xs text-gray-700 dark:text-gray-300">
          <thead
            class="bg-gray-50 text-[11px] font-semibold uppercase text-gray-500 border-b border-gray-200 dark:bg-gray-800/50 dark:border-gray-700 dark:text-gray-400"
          >
            <tr>
              <th class="px-4 py-3 text-start whitespace-nowrap">Date Payment</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Ref No</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Name</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Type</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Payment Method</th>
              <th class="px-4 py-3 text-end whitespace-nowrap">Amount (IDR)</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Status</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Created By</th>
              <th class="px-4 py-3 text-end whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <tr v-for="item in filteredPayments" :key="item.id" class="transition-colors hover:bg-gray-50/75 dark:hover:bg-gray-800/40">
              <td class="px-4 py-3 whitespace-nowrap">{{ item.date }}</td>
              <td class="px-4 py-3 whitespace-nowrap font-semibold text-primary">{{ item.refNo }}</td>
              <td class="px-4 py-3 whitespace-nowrap font-medium text-gray-900 dark:text-gray-100">{{ item.name }}</td>
              <td class="px-4 py-3 whitespace-nowrap">
                <CommonStatusPill :status="item.type" :tone="item.type === 'Payment-In' ? 'emerald' : 'rose'" />
              </td>
              <td class="px-4 py-3 whitespace-nowrap">
                <span class="inline-flex rounded-full border border-gray-200 bg-gray-50 px-2.5 py-0.5 text-[11px] text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
                  {{ item.method }}
                </span>
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-end font-semibold">{{ formatNumber(item.amount) }}</td>
              <td class="px-4 py-3 whitespace-nowrap">
                <CommonStatusPill :status="item.status" />
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-xs text-gray-500 dark:text-gray-400">{{ item.created }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-end">
                <div class="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    class="rounded-lg p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-sky-500 dark:hover:bg-gray-800"
                    title="View Details"
                    @click="openViewModal(item)"
                  >
                    <CommonFeatherIcon name="eye" size="16" />
                  </button>
                  <button
                    type="button"
                    class="rounded-lg p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-primary dark:hover:bg-gray-800"
                    title="Print Receipt"
                    @click="printReceipt(item)"
                  >
                    <CommonFeatherIcon name="printer" size="16" />
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredPayments.length === 0">
              <td colspan="9" class="p-8 text-center text-gray-400">No payment records found.</td>
            </tr>
          </tbody>
          <tfoot class="border-t-2 border-gray-200 bg-gray-50/75 font-semibold text-gray-800 dark:border-gray-700 dark:bg-gray-800/60 dark:text-white">
            <tr>
              <td class="px-4 py-3 text-start" colspan="5">Total Visible Payments</td>
              <td class="px-4 py-3 text-end font-bold text-primary">{{ formatNumber(totalAmount) }}</td>
              <td class="px-4 py-3" colspan="3"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>

    <!-- View Payment Modal -->
    <CommonBaseModal v-model="showViewModal" :title="`Payment Details - ${viewingItem?.refNo ?? ''}`" maxWidth="md">
      <div v-if="viewingItem" class="divide-y divide-gray-100 dark:divide-gray-800">
        <div class="flex items-center justify-between py-2.5">
          <span class="text-gray-500 dark:text-gray-400">Date</span>
          <span class="font-medium text-gray-800 dark:text-gray-200">{{ viewingItem.date }}</span>
        </div>
        <div class="flex items-center justify-between py-2.5">
          <span class="text-gray-500 dark:text-gray-400">Ref No</span>
          <span class="font-bold text-primary">{{ viewingItem.refNo }}</span>
        </div>
        <div class="flex items-center justify-between py-2.5">
          <span class="text-gray-500 dark:text-gray-400">Name / Entity</span>
          <span class="font-medium text-gray-800 dark:text-gray-200">{{ viewingItem.name }}</span>
        </div>
        <div class="flex items-center justify-between py-2.5">
          <span class="text-gray-500 dark:text-gray-400">Type</span>
          <CommonStatusPill :status="viewingItem.type" :tone="viewingItem.type === 'Payment-In' ? 'emerald' : 'rose'" />
        </div>
        <div class="flex items-center justify-between py-2.5">
          <span class="text-gray-500 dark:text-gray-400">Method</span>
          <span class="text-gray-800 dark:text-gray-200">{{ viewingItem.method }}</span>
        </div>
        <div class="flex items-center justify-between py-2.5">
          <span class="text-gray-500 dark:text-gray-400">Amount</span>
          <span class="text-lg font-bold text-emerald-600 dark:text-emerald-400">Rp {{ formatNumber(viewingItem.amount) }}</span>
        </div>
        <div class="flex items-center justify-between py-2.5">
          <span class="text-gray-500 dark:text-gray-400">Status</span>
          <CommonStatusPill :status="viewingItem.status" />
        </div>
        <div class="flex items-center justify-between py-2.5">
          <span class="text-gray-500 dark:text-gray-400">Created By</span>
          <span class="text-gray-800 dark:text-gray-200">{{ viewingItem.created }}</span>
        </div>
      </div>
      <template #footer>
        <div class="flex items-center justify-end gap-3">
          <button
            type="button"
            class="rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
            @click="closeModal"
          >
            Close
          </button>
          <button
            v-if="viewingItem"
            type="button"
            class="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-primary-600"
            @click="printReceipt(viewingItem)"
          >
            <CommonFeatherIcon name="printer" size="15" />
            Print Receipt
          </button>
        </div>
      </template>
    </CommonBaseModal>
  </div>
</template>

<script setup lang="ts">import { ref, computed } from "vue";

useHead({
  title: "Payments - Kacetak System",
});

const { data: paymentsData } = await useFetch<PaymentRecord[]>('/api/payments')
const payments = ref<PaymentRecord[]>(paymentsData.value ?? [])
useMockSync('payments', payments);

const searchQuery = ref("");
const filterType = ref("");
const filterMethod = ref("");

const filteredPayments = computed(() => {
  return payments.value.filter((item) => {
    const q = searchQuery.value.toLowerCase();
    const matchSearch = !q || item.refNo.toLowerCase().includes(q) || item.name.toLowerCase().includes(q);
    const matchType = !filterType.value || item.type === filterType.value;
    const matchMethod = !filterMethod.value || item.method === filterMethod.value;
    return matchSearch && matchType && matchMethod;
  });
});

const totalAmount = computed(() => filteredPayments.value.reduce((acc, c) => acc + c.amount, 0));

const formatNumber = (val: number) => {
  return new Intl.NumberFormat("id-ID").format(val || 0);
};

const showViewModal = ref(false);
const viewingItem = ref<PaymentRecord | null>(null);

const openViewModal = (item: PaymentRecord) => {
  viewingItem.value = item;
  showViewModal.value = true;
};

const closeModal = () => {
  showViewModal.value = false;
  viewingItem.value = null;
};

const printReceipt = (item: PaymentRecord) => {
  window.print();
};

const exportPdf = () => {
  window.print();
};

const printTable = () => {
  window.print();
};

const refresh = () => {
  searchQuery.value = "";
  filterType.value = "";
  filterMethod.value = "";
};

const toggleCollapse = () => {
  // collapsible header
};</script>