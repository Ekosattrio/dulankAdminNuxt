<<<<<<< HEAD
<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <CommonPageHeader title="Payment Outflow" subtitle="Manage your Payment Outflow report">
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
            <span>Add Payment Outflow</span>
          </button>
        </div>
      </template>
    </CommonPageHeader>

    <!-- Balance Summary Card -->
    <div class="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="p-5">
        <div class="flex cursor-pointer items-center justify-between" @click="showBalanceSummary = !showBalanceSummary">
          <div class="flex items-center gap-2">
            <CommonFeatherIcon name="wallet" size="20" class="text-rose-500" />
            <h5 class="font-bold text-gray-900 dark:text-gray-100">Balance Summary (Kas & Rekening Pengeluaran)</h5>
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

    <!-- Outflow Table List Card -->
    <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <!-- Toolbar -->
      <div class="mb-5 flex flex-wrap items-center justify-between gap-4">
        <CommonSearchFilter v-model="searchQuery" placeholder="Search ref no, payee name..." />
        <div class="flex flex-wrap items-center gap-3">
          <CommonFilterSelect
            v-model="filterSource"
            allLabel="All Sources"
            :options="[
              { value: 'Payroll', label: 'Payroll' },
              { value: 'Expense', label: 'Expense' },
              { value: 'Advance', label: 'Advance' },
              { value: 'Purchase', label: 'Purchase' },
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
              <th class="px-4 py-3 text-end whitespace-nowrap">Amount (IDR)</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Status</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Payment Method</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Note</th>
              <th class="px-4 py-3 text-end whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <tr v-for="item in filteredOutflows" :key="item.id" class="transition-colors hover:bg-gray-50/75 dark:hover:bg-gray-800/40">
              <td class="px-4 py-3 whitespace-nowrap">{{ item.date }}</td>
              <td class="px-4 py-3 whitespace-nowrap font-semibold text-rose-600 dark:text-rose-400">{{ item.refNo }}</td>
              <td class="px-4 py-3 whitespace-nowrap font-medium text-gray-900 dark:text-gray-100">{{ item.name }}</td>
              <td class="px-4 py-3 whitespace-nowrap">
                <span class="inline-flex rounded-full border border-gray-200 bg-gray-50 px-2.5 py-0.5 text-[11px] text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">{{ item.source }}</span>
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-end font-semibold text-rose-600 dark:text-rose-400">{{ formatNumber(item.amount) }}</td>
              <td class="px-4 py-3 whitespace-nowrap">
                <CommonStatusPill :status="item.status" />
              </td>
              <td class="px-4 py-3 whitespace-nowrap">{{ item.method }}</td>
              <td class="max-w-[200px] truncate px-4 py-3 whitespace-nowrap text-gray-500 dark:text-gray-400">{{ item.note || "-" }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-end">
                <CommonRowActions :item="item" show-view @view="openViewModal(item)" @edit="openEditModal(item)" @delete="deleteItem(item.id)" />
              </td>
            </tr>
            <tr v-if="filteredOutflows.length === 0">
              <td colspan="9" class="p-8 text-center text-gray-400">No outflow records found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add Payment Outflow Modal -->
    <CommonBaseModal v-model="showAddModal" title="Add Payment Outflow" maxWidth="lg">
      <form @submit.prevent="saveOutflow" class="space-y-4">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <CommonFormField label="Date" required>
            <input
              v-model="formData.date"
              type="date"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              required
            />
          </CommonFormField>
          <CommonFormField label="Payee Name" required>
            <input
              v-model="formData.name"
              type="text"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              required
            />
          </CommonFormField>
        </div>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <CommonFormField label="Source" required>
            <select
              v-model="formData.source"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              required
            >
              <option>Payroll</option>
              <option>Expense</option>
              <option>Advance</option>
              <option>Purchase</option>
            </select>
          </CommonFormField>
          <CommonFormField label="Amount (IDR)" required>
            <input
              v-model.number="formData.amount"
              type="number"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              required
              min="1"
            />
          </CommonFormField>
        </div>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <CommonFormField label="Payment Method">
            <select
              v-model="formData.method"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            >
              <option>Cash</option>
              <option>Transfer</option>
              <option>Balanced</option>
            </select>
          </CommonFormField>
          <CommonFormField label="Source Bank Account">
            <select
              v-model="formData.bankAccount"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            >
              <option value="Dulank Semesta Cida PT / BCA / 1092993242">Dulank Semesta Cida PT / BCA / 1092993242</option>
              <option value="Dulank Semesta Cida PT / Mandiri / 1320009982282">Dulank Semesta Cida PT / Mandiri / 1320009982282</option>
            </select>
          </CommonFormField>
        </div>
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
  </div>
</template>

<script setup lang="ts">import { ref, computed } from "vue";

useHead({
  title: "Payment Outflow - Kacetak System",
});

const showBalanceSummary = ref(true);

const { data: paymentOutflowData } = await useFetch<OutflowRecord[]>('/api/payment-outflow')
const outflows = ref<OutflowRecord[]>(paymentOutflowData.value ?? [])
useMockSync('payment-outflow', outflows);

const searchQuery = ref("");
const filterSource = ref("");
const filterStatus = ref("");

const filteredOutflows = computed(() => {
  return outflows.value.filter((item) => {
    const q = searchQuery.value.toLowerCase();
    const matchSearch =
      !q || item.refNo.toLowerCase().includes(q) || item.name.toLowerCase().includes(q) || item.note.toLowerCase().includes(q);
    const matchSource = !filterSource.value || item.source === filterSource.value;
    const matchStatus = !filterStatus.value || item.status === filterStatus.value;
    return matchSearch && matchSource && matchStatus;
  });
});

const totalAmount = computed(() => filteredOutflows.value.reduce((acc, c) => acc + c.amount, 0));

const formatNumber = (val: number) => {
  return new Intl.NumberFormat("id-ID").format(val || 0);
};

const showAddModal = ref(false);
const showViewModal = ref(false);
const activeItem = ref<OutflowRecord | null>(null);

const defaultFormData = () => ({
  date: new Date().toISOString().split("T")[0],
  name: "",
  source: "Expense",
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

const openViewModal = (item: OutflowRecord) => {
  activeItem.value = item;
  showViewModal.value = true;
};

const openEditModal = (item: OutflowRecord) => {
  const newAmount = prompt("Enter new amount:", String(item.amount));
  if (newAmount) {
    item.amount = Number(newAmount);
  }
};

const deleteItem = (id: number) => {
  if (confirm("Are you sure you want to delete this payment outflow?")) {
    outflows.value = outflows.value.filter((i) => i.id !== id);
  }
};

const closeModal = () => {
  showAddModal.value = false;
  showViewModal.value = false;
  activeItem.value = null;
};

const saveOutflow = () => {
  const newId = Math.max(0, ...outflows.value.map((i) => i.id)) + 1;
  const count = outflows.value.length + 1;
  const refNo = `OUT-${String(count).padStart(3, "0")}`;
  outflows.value.unshift({
    id: newId,
    date: formData.value.date,
    refNo,
    name: formData.value.name,
    source: formData.value.source,
    amount: formData.value.amount,
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
=======
<script setup lang="ts">
import PaymentBalanceSummary from '~/components/pages/payment-flow/PaymentBalanceSummary.vue'
import PaymentFlowDetails from '~/components/pages/payment-flow/PaymentFlowDetails.vue'
import PaymentFlowEditor from '~/components/pages/payment-flow/PaymentFlowEditor.vue'
import PaymentFlowRecordsTable from '~/components/pages/payment-flow/PaymentFlowRecordsTable.vue'
import type { DateRangeValue } from '~/composables/useDateRange'
import type { PaymentFlowFormData, PaymentFlowRecord } from '#server/types/payment-flow'

useLegacyPage({ title: 'Payment Outflow', sweetAlert: false })

const searchQuery = ref('')
const filterDateRange = ref<DateRangeValue | null>(null)
const filterSource = ref('')
const filterStatus = ref('')
const modalMode = ref<'add' | 'edit' | 'payment' | null>(null)
const selectedRecord = ref<PaymentFlowRecord | null>(null)
const deleting = ref<PaymentFlowRecord | null>(null)
const busy = ref(false)
const actionError = ref('')
const filters = computed(() => ({
  search: searchQuery.value,
  startDate: filterDateRange.value?.start || '',
  endDate: filterDateRange.value?.end || '',
  source: filterSource.value,
  status: filterStatus.value,
}))
const { records, balances, pending, error, refresh, saveRecord, deleteRecord } = usePaymentFlow('outflow', filters)

function openEditor(mode: 'add' | 'edit' | 'payment', record: PaymentFlowRecord | null = null) {
  actionError.value = ''
  modalMode.value = mode
  selectedRecord.value = record
}

async function submit(form: PaymentFlowFormData) {
  busy.value = true
  actionError.value = ''
  try {
    await saveRecord(form)
    modalMode.value = null
    selectedRecord.value = null
  } catch (event) {
    actionError.value = salesErrorMessage(event)
  } finally {
    busy.value = false
  }
}

async function confirmDelete() {
  if (!deleting.value) return
  busy.value = true
  actionError.value = ''
  try {
    await deleteRecord(deleting.value.id)
    deleting.value = null
  } catch (event) {
    actionError.value = salesErrorMessage(event)
  } finally {
    busy.value = false
  }
}

function printTable() {
  printSalesRows(
    'Payment Outflow',
    ['Date', 'Ref No', 'Name', 'Source', 'Amount (IDR)', 'Status', 'Payment Method', 'Note', 'Date'],
    records.value.map((item) => [
      item.date,
      item.refNo,
      item.name,
      item.source,
      item.amount.toLocaleString('id-ID'),
      item.status,
      item.method,
      item.note,
      item.paymentDate,
    ]),
  )
}
</script>

<template>
  <div class="dulank-page dulank-page-payment-outflow">
    <SalesListHeader
      title="Payment Outflow"
      subtitle="Manage your Payment Outflow report"
      add-label="Add Payment Outflow"
      :refreshing="pending"
      @add="openEditor('add')"
      @refresh="refresh()"
      @print="printTable"
    />
    <SalesFeedback
      :pending="pending"
      skeleton="table"
      :skeleton-cols="10"
      :skeleton-rows="6"
      :error="error ? 'Unable to load payment outflow. Please try again.' : ''"
      @retry="refresh()"
    />
    <template v-if="!pending && !error">
      <PaymentBalanceSummary v-model:date-range="filterDateRange" :balances="balances" />
      <PaymentFlowRecordsTable
        kind="outflow"
        :records="records"
        :search-query="searchQuery"
        :filter-date-range="filterDateRange"
        :filter-source="filterSource"
        :filter-status="filterStatus"
        @update:search-query="searchQuery = $event"
        @update:filter-date-range="filterDateRange = $event"
        @update:filter-source="filterSource = $event"
        @update:filter-status="filterStatus = $event"
        @view="selectedRecord = $event"
        @payment="openEditor('payment', $event)"
        @edit="openEditor('edit', $event)"
        @delete="deleting = $event"
      />
    </template>
    <PaymentFlowEditor
      :open="!!modalMode"
      kind="outflow"
      :mode="modalMode || 'add'"
      :record="selectedRecord"
      :busy="busy"
      :error="actionError"
      @close="
        modalMode = null;
        selectedRecord = null
      "
      @submit="submit"
    />
    <PaymentFlowDetails kind="outflow" :record="!modalMode ? selectedRecord : null" @close="selectedRecord = null" />
    <SalesConfirmDelete
      :open="!!deleting"
      :busy="busy"
      :error="actionError"
      @close="deleting = null"
      @confirm="confirmDelete"
    />
  </div>
</template>
>>>>>>> origin/eko
