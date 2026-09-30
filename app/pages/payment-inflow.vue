<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <CommonPageHeader title="Payment Inflow" subtitle="Manage your Payment Inflow report">
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
          <button
            type="button"
            class="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-600 focus:outline-none"
            @click="openAddModal"
          >
            <CommonFeatherIcon name="plus" size="18" />
            <span>Add Payment Inflow</span>
          </button>
        </div>
      </template>
    </CommonPageHeader>

    <!-- Balance Summary Card -->
    <div class="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="p-5">
        <div class="flex cursor-pointer items-center justify-between" @click="showBalanceSummary = !showBalanceSummary">
          <div class="flex items-center gap-2">
            <CommonFeatherIcon name="wallet" size="20" class="text-primary" />
            <h5 class="font-bold text-gray-900 dark:text-gray-100">Balance Summary (Kas & Rekening Bank)</h5>
          </div>
          <button type="button" class="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
            <CommonFeatherIcon :name="showBalanceSummary ? 'chevron-up' : 'chevron-down'" size="16" />
          </button>
        </div>
        <div v-if="showBalanceSummary" class="mt-3 overflow-x-auto border-t border-gray-100 pt-3 dark:border-gray-800">
          <table class="w-full text-start text-xs text-gray-700 dark:text-gray-300">
            <thead class="bg-gray-50 text-[11px] font-semibold uppercase text-gray-500 dark:bg-gray-800/50 dark:text-gray-400">
              <tr>
                <th class="px-3 py-2 text-start">Bank Account</th>
                <th class="px-3 py-2 text-start">Account Name</th>
                <th class="px-3 py-2 text-end">Amount Balance (IDR)</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
              <tr>
                <td class="px-3 py-2 font-medium">Cash Box</td>
                <td class="px-3 py-2">Kasir Dulank</td>
                <td class="px-3 py-2 text-end font-semibold text-emerald-600 dark:text-emerald-400">1.350.500</td>
              </tr>
              <tr>
                <td class="px-3 py-2 font-medium">Bank Mandiri</td>
                <td class="px-3 py-2">PT. Dulank Semesta Cida</td>
                <td class="px-3 py-2 text-end font-semibold">0</td>
              </tr>
              <tr>
                <td class="px-3 py-2 font-medium">Bank BCA</td>
                <td class="px-3 py-2">PT. Dulank Semesta Cida</td>
                <td class="px-3 py-2 text-end font-semibold text-rose-600 dark:text-rose-400">-750.000</td>
              </tr>
              <tr>
                <td class="px-3 py-2 font-medium">QRIS Mandiri</td>
                <td class="px-3 py-2">Percetakan Dulank</td>
                <td class="px-3 py-2 text-end font-semibold text-emerald-600 dark:text-emerald-400">250.000</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Inflow Table List Card -->
    <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <!-- Toolbar -->
      <div class="mb-5 flex flex-wrap items-center justify-between gap-4">
        <CommonSearchFilter v-model="searchQuery" placeholder="Search ref no, customer name..." />
        <div class="flex flex-wrap items-center gap-3">
          <CommonFilterSelect
            v-model="filterSource"
            allLabel="All Sources"
            :options="[
              { value: 'Sales', label: 'Sales' },
              { value: 'Income', label: 'Income' },
              { value: 'Purchase Return', label: 'Purchase Return' },
            ]"
          />
          <CommonFilterSelect
            v-model="filterStatus"
            allLabel="All Statuses"
            :options="[
              { value: 'Paid', label: 'Paid' },
              { value: 'Partial', label: 'Partial' },
              { value: 'Unpaid', label: 'Unpaid' },
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
              <th class="px-4 py-3 text-start whitespace-nowrap">Date</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Ref No</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Name</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Source</th>
              <th class="px-4 py-3 text-end whitespace-nowrap">Amount</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Due Date</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Status</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Payment Method</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Note</th>
              <th class="px-4 py-3 text-end whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <tr v-for="item in filteredInflows" :key="item.id" class="transition-colors hover:bg-gray-50/75 dark:hover:bg-gray-800/40">
              <td class="px-4 py-3 whitespace-nowrap">{{ item.date }}</td>
              <td class="px-4 py-3 whitespace-nowrap font-semibold text-primary">{{ item.refNo }}</td>
              <td class="px-4 py-3 whitespace-nowrap font-medium text-gray-900 dark:text-gray-100">{{ item.name }}</td>
              <td class="px-4 py-3 whitespace-nowrap">
                <span class="inline-flex rounded-full border border-gray-200 bg-gray-50 px-2.5 py-0.5 text-[11px] text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">{{ item.source }}</span>
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-end font-semibold">{{ formatNumber(item.amount) }}</td>
              <td class="px-4 py-3 whitespace-nowrap">{{ item.dueDate }}</td>
              <td class="px-4 py-3 whitespace-nowrap">
                <CommonStatusPill :status="item.status" />
              </td>
              <td class="px-4 py-3 whitespace-nowrap">{{ item.method || "-" }}</td>
              <td class="max-w-[200px] truncate px-4 py-3 whitespace-nowrap text-gray-500 dark:text-gray-400">{{ item.note || "-" }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-end">
                <CommonRowActions :item="item" show-view @view="openViewModal(item)" @edit="openEditModal(item)" @delete="deleteItem(item.id)">
                  <template #extra>
                    <button
                      type="button"
                      class="rounded-lg p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-emerald-600 dark:hover:bg-gray-800"
                      title="Make Payment"
                      @click="openPayModal(item)"
                    >
                      <CommonFeatherIcon name="dollar-sign" size="16" />
                    </button>
                  </template>
                </CommonRowActions>
              </td>
            </tr>
            <tr v-if="filteredInflows.length === 0">
              <td colspan="10" class="p-8 text-center text-gray-400">No inflow records found.</td>
            </tr>
          </tbody>
          <tfoot class="border-t-2 border-gray-200 bg-gray-50/75 font-semibold text-gray-800 dark:border-gray-700 dark:bg-gray-800/60 dark:text-white">
            <tr>
              <td class="px-4 py-3 text-start" colspan="4">Total Visible Inflows</td>
              <td class="px-4 py-3 text-end text-emerald-600 dark:text-emerald-400">{{ formatNumber(totalAmount) }}</td>
              <td class="px-4 py-3" colspan="5"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>

    <!-- Add Payment Inflow Modal -->
    <CommonBaseModal v-model="showAddModal" title="Add Payment Inflow" maxWidth="lg">
      <form @submit.prevent="saveInflow" class="space-y-4">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <CommonFormField label="Date" required>
            <input
              v-model="formData.date"
              type="date"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              required
            />
          </CommonFormField>
          <CommonFormField label="Due Date">
            <input
              v-model="formData.dueDate"
              type="date"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            />
          </CommonFormField>
        </div>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <CommonFormField label="Customer / Entity Name" required>
            <input
              v-model="formData.name"
              type="text"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              placeholder="Enter customer name"
              required
            />
          </CommonFormField>
          <CommonFormField label="Source" required>
            <select
              v-model="formData.source"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              required
            >
              <option value="Sales">Sales</option>
              <option value="Income">Income</option>
              <option value="Purchase Return">Purchase Return</option>
            </select>
          </CommonFormField>
        </div>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <CommonFormField label="Amount (IDR)" required>
            <input
              v-model.number="formData.amount"
              type="number"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              required
              min="1"
            />
          </CommonFormField>
          <CommonFormField label="Payment Method">
            <select
              v-model="formData.method"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            >
              <option value="Transfer">Transfer</option>
              <option value="Cash">Cash</option>
              <option value="Balanced">Balanced</option>
            </select>
          </CommonFormField>
        </div>
        <CommonFormField v-if="formData.method === 'Transfer'" label="Destination Bank Account">
          <select
            v-model="formData.bankAccount"
            class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          >
            <option value="Dulank Semesta Cida PT / BCA / 1092993242">Dulank Semesta Cida PT / BCA / 1092993242</option>
            <option value="Dulank Semesta Cida PT / Mandiri / 1320009982282">Dulank Semesta Cida PT / Mandiri / 1320009982282</option>
          </select>
        </CommonFormField>
        <CommonFormField label="Note">
          <textarea
            v-model="formData.note"
            rows="3"
            class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            placeholder="Notes..."
          ></textarea>
        </CommonFormField>
        <CommonModalFooter @cancel="closeModal" />
      </form>
    </CommonBaseModal>

    <!-- View Modal -->
    <CommonBaseModal v-model="showViewModal" :title="`Payment Inflow - ${activeItem?.refNo ?? ''}`" maxWidth="md">
      <div v-if="activeItem" class="divide-y divide-gray-100 dark:divide-gray-800">
        <div class="flex items-center justify-between py-2.5">
          <span class="text-gray-500 dark:text-gray-400">Date</span>
          <span class="text-gray-800 dark:text-gray-200">{{ activeItem.date }}</span>
        </div>
        <div class="flex items-center justify-between py-2.5">
          <span class="text-gray-500 dark:text-gray-400">Customer / Entity</span>
          <span class="font-bold text-gray-900 dark:text-gray-100">{{ activeItem.name }}</span>
        </div>
        <div class="flex items-center justify-between py-2.5">
          <span class="text-gray-500 dark:text-gray-400">Source</span>
          <span class="text-gray-800 dark:text-gray-200">{{ activeItem.source }}</span>
        </div>
        <div class="flex items-center justify-between py-2.5">
          <span class="text-gray-500 dark:text-gray-400">Amount</span>
          <span class="text-base font-bold text-emerald-600 dark:text-emerald-400">Rp {{ formatNumber(activeItem.amount) }}</span>
        </div>
        <div class="flex items-center justify-between py-2.5">
          <span class="text-gray-500 dark:text-gray-400">Due Date</span>
          <span class="text-gray-800 dark:text-gray-200">{{ activeItem.dueDate }}</span>
        </div>
        <div class="flex items-center justify-between py-2.5">
          <span class="text-gray-500 dark:text-gray-400">Status</span>
          <CommonStatusPill :status="activeItem.status" />
        </div>
        <div class="flex items-center justify-between py-2.5">
          <span class="text-gray-500 dark:text-gray-400">Payment Method</span>
          <span class="text-gray-800 dark:text-gray-200">{{ activeItem.method || "-" }}</span>
        </div>
        <div class="py-2.5">
          <span class="text-xs text-gray-400">Notes</span>
          <p class="mb-0 mt-1 rounded-lg bg-gray-50 p-2 text-sm text-gray-500 dark:bg-gray-800/40 dark:text-gray-400">{{ activeItem.note || "-" }}</p>
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end">
          <button
            type="button"
            class="rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
            @click="closeModal"
          >
            Close
          </button>
        </div>
      </template>
    </CommonBaseModal>
  </div>
</template>

<script setup lang="ts">import { ref, computed } from "vue";

useHead({
  title: "Payment Inflow - Kacetak System",
});

const showBalanceSummary = ref(true);

const { data: paymentInflowData } = await useFetch<InflowRecord[]>('/api/payment-inflow')
const inflows = ref<InflowRecord[]>(paymentInflowData.value ?? [])
useMockSync('payment-inflow', inflows);

const searchQuery = ref("");
const filterSource = ref("");
const filterStatus = ref("");

const filteredInflows = computed(() => {
  return inflows.value.filter((item) => {
    const q = searchQuery.value.toLowerCase();
    const matchSearch =
      !q || item.refNo.toLowerCase().includes(q) || item.name.toLowerCase().includes(q) || item.note.toLowerCase().includes(q);
    const matchSource = !filterSource.value || item.source === filterSource.value;
    const matchStatus = !filterStatus.value || item.status === filterStatus.value;
    return matchSearch && matchSource && matchStatus;
  });
});

const totalAmount = computed(() => filteredInflows.value.reduce((acc, c) => acc + c.amount, 0));

const formatNumber = (val: number) => {
  return new Intl.NumberFormat("id-ID").format(val || 0);
};

const showAddModal = ref(false);
const showViewModal = ref(false);
const activeItem = ref<InflowRecord | null>(null);

const defaultFormData = () => ({
  date: new Date().toISOString().split("T")[0],
  dueDate: "",
  name: "",
  source: "Sales",
  amount: 0,
  method: "Transfer",
  bankAccount: "Dulank Semesta Cida PT / BCA / 1092993242",
  note: "",
});

const formData = ref(defaultFormData());

const openAddModal = () => {
  formData.value = defaultFormData();
  showAddModal.value = true;
};

const openViewModal = (item: InflowRecord) => {
  activeItem.value = item;
  showViewModal.value = true;
};

const openPayModal = (item: InflowRecord) => {
  if (confirm(`Confirm marked as fully paid for ${item.refNo}?`)) {
    item.status = "Paid";
  }
};

const openEditModal = (item: InflowRecord) => {
  const newAmount = prompt("Enter new amount:", String(item.amount));
  if (newAmount) {
    item.amount = Number(newAmount);
  }
};

const deleteItem = (id: number) => {
  if (confirm("Are you sure you want to delete this payment inflow?")) {
    inflows.value = inflows.value.filter((i) => i.id !== id);
  }
};

const closeModal = () => {
  showAddModal.value = false;
  showViewModal.value = false;
  activeItem.value = null;
};

const saveInflow = () => {
  const newId = Math.max(0, ...inflows.value.map((i) => i.id)) + 1;
  const count = inflows.value.length + 1;
  const refNo = `INV-${String(count).padStart(3, "0")}`;
  inflows.value.unshift({
    id: newId,
    date: formData.value.date,
    refNo,
    name: formData.value.name,
    source: formData.value.source,
    amount: formData.value.amount,
    dueDate: formData.value.dueDate || formData.value.date,
    status: "Paid",
    method: formData.value.method,
    note: formData.value.note,
  });
  closeModal();
};

const exportPdf = () => {
  window.print();
};

const printTable = () => {
  window.print();
};

const refresh = () => {
  searchQuery.value = "";
  filterSource.value = "";
  filterStatus.value = "";
};

const toggleCollapse = () => {
  // collapsible header
};
</script>