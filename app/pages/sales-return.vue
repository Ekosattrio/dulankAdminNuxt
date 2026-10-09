<<<<<<< HEAD
<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <CommonPageHeader title="Sales Return List" subtitle="Manage return orders, credit notes, and customer refunds">
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
            <span>Add New Sales Return</span>
          </button>
        </div>
      </template>
    </CommonPageHeader>

    <!-- Table Card -->
    <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <!-- Toolbar -->
      <div class="mb-5 flex flex-wrap items-center justify-between gap-4">
        <CommonSearchFilter v-model="searchQuery" placeholder="Search return no, sales no, or customer..." />
        <CommonFilterSelect
          v-model="filterPaymentStatus"
          allLabel="All Payment Status"
          :options="[
            { value: 'Paid', label: 'Paid' },
            { value: 'Unpaid', label: 'Unpaid' },
          ]"
        />
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="w-full text-start text-xs text-gray-700 dark:text-gray-300">
          <thead
            class="bg-gray-50 text-[11px] font-semibold uppercase text-gray-500 border-b border-gray-200 dark:bg-gray-800/50 dark:border-gray-700 dark:text-gray-400"
          >
            <tr>
              <th class="px-4 py-3 text-start whitespace-nowrap">No Return</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Date</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">No Sales</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Customer</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Payment Status</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Payment Date</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Payment Method</th>
              <th class="px-4 py-3 text-end whitespace-nowrap">Total</th>
              <th class="px-4 py-3 text-center whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <tr v-for="ret in filteredReturns" :key="ret.id" class="transition-colors hover:bg-gray-50/75 dark:hover:bg-gray-800/40">
              <td class="px-4 py-3 whitespace-nowrap font-bold text-primary">{{ ret.returnNo }}</td>
              <td class="px-4 py-3 whitespace-nowrap">{{ ret.date }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-gray-500 dark:text-gray-400">{{ ret.salesNo }}</td>
              <td class="px-4 py-3 whitespace-nowrap font-semibold text-gray-900 dark:text-gray-100">{{ ret.customer }}</td>
              <td class="px-4 py-3 whitespace-nowrap">
                <CommonStatusPill :status="ret.paymentStatus" />
              </td>
              <td class="px-4 py-3 whitespace-nowrap">{{ ret.paymentDate || "-" }}</td>
              <td class="px-4 py-3 whitespace-nowrap">{{ ret.paymentMethod || "-" }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-end font-bold text-gray-900 dark:text-gray-100">Rp {{ formatNumber(ret.total) }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-center">
                <CommonRowActions :item="ret" show-view @view="viewReturn(ret)" @edit="openEditModal(ret)" @delete="deleteReturn(ret.id)">
                  <template #extra>
                    <button
                      v-if="ret.paymentStatus === 'Unpaid'"
                      type="button"
                      class="rounded-lg p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-emerald-600 dark:hover:bg-gray-800"
                      title="Payment-OUT"
                      @click="openPaymentModal(ret)"
                    >
                      <CommonFeatherIcon name="credit-card" size="16" />
                    </button>
                  </template>
                </CommonRowActions>
              </td>
            </tr>
            <tr v-if="filteredReturns.length === 0">
              <td colspan="9" class="p-8 text-center text-gray-400">No sales returns found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- View Return Details Modal -->
    <CommonBaseModal v-model="viewModalVisible" :title="`Return Invoice: ${selectedReturn?.returnNo ?? ''}`" maxWidth="xl">
      <div v-if="selectedReturn" class="space-y-4">
        <!-- Summary Card -->
        <div class="rounded-lg border border-gray-100 bg-gray-50/60 p-4 dark:border-gray-800 dark:bg-gray-800/30">
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <div class="text-xs text-gray-400">Customer</div>
              <div class="font-bold text-gray-900 dark:text-gray-100">{{ selectedReturn.customer }}</div>
              <div class="mt-0.5 text-xs text-gray-400">Sales Reference: {{ selectedReturn.salesNo }}</div>
            </div>
            <div class="sm:text-end">
              <div class="text-xs text-gray-400">Return Date</div>
              <div class="font-bold text-gray-900 dark:text-gray-100">{{ selectedReturn.date }}</div>
              <div class="mt-0.5 text-xs text-gray-400">
                Status: <CommonStatusPill :status="selectedReturn.paymentStatus" />
              </div>
            </div>
          </div>
        </div>

        <!-- Return Items Summary -->
        <div>
          <h6 class="mb-2 text-sm font-bold text-gray-800 dark:text-gray-200">Return Items Summary</h6>
          <div class="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
            <table class="w-full text-start text-xs text-gray-700 dark:text-gray-300">
              <thead class="bg-gray-50 text-[11px] font-semibold uppercase text-gray-500 dark:bg-gray-800/50 dark:text-gray-400">
                <tr>
                  <th class="px-3 py-2 text-start">Product Name</th>
                  <th class="px-3 py-2 text-center">Qty Order</th>
                  <th class="px-3 py-2 text-center">Qty Return</th>
                  <th class="px-3 py-2 text-start">Unit</th>
                  <th class="px-3 py-2 text-end">Unit Price</th>
                  <th class="px-3 py-2 text-end">Return Amount</th>
                  <th class="px-3 py-2 text-start">Reason</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                <tr v-for="item in selectedReturn.items" :key="item.name">
                  <td class="px-3 py-2">
                    <div class="font-semibold text-gray-900 dark:text-gray-100">{{ item.name }}</div>
                    <div class="text-[11px] text-gray-400">{{ item.description }}</div>
                  </td>
                  <td class="px-3 py-2 text-center">{{ item.qtyOrder }}</td>
                  <td class="px-3 py-2 text-center font-bold text-rose-600 dark:text-rose-400">{{ item.qtyReturn }}</td>
                  <td class="px-3 py-2">{{ item.unit }}</td>
                  <td class="px-3 py-2 text-end">Rp {{ formatNumber(item.price) }}</td>
                  <td class="px-3 py-2 text-end font-bold">Rp {{ formatNumber(item.returnAmount) }}</td>
                  <td class="px-3 py-2 text-gray-500 dark:text-gray-400">{{ item.reason }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="flex items-center justify-between rounded-lg bg-gray-50/60 p-3.5 dark:bg-gray-800/30">
          <span class="text-sm font-bold text-gray-800 dark:text-gray-200">Total Refund Due:</span>
          <span class="text-lg font-bold text-primary">Rp {{ formatNumber(selectedReturn.total) }}</span>
        </div>
      </div>
      <template #footer>
        <div class="flex items-center justify-between">
          <button
            type="button"
            class="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            @click="printTable"
          >
            <CommonFeatherIcon name="printer" size="16" />
            Print Invoice
          </button>
          <button
            type="button"
            class="rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
            @click="viewModalVisible = false"
          >
            Close
          </button>
        </div>
      </template>
    </CommonBaseModal>

    <!-- Payment-OUT Modal -->
    <CommonBaseModal v-model="paymentModalVisible" :title="`Payment-OUT Refund: ${selectedReturn?.returnNo ?? ''}`" maxWidth="md">
      <form v-if="selectedReturn" @submit.prevent="processPaymentOut" class="space-y-4">
        <CommonFormField label="Payment Method" required>
          <div class="flex gap-4">
            <label class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <input v-model="paymentForm.method" type="radio" value="Cash" class="h-4 w-4 accent-primary" />
              Cash
            </label>
            <label class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <input v-model="paymentForm.method" type="radio" value="Transfer" class="h-4 w-4 accent-primary" />
              Bank Transfer
            </label>
          </div>
        </CommonFormField>

        <div v-if="paymentForm.method === 'Transfer'" class="space-y-3 rounded-lg border border-gray-100 bg-gray-50/60 p-3.5 dark:border-gray-800 dark:bg-gray-800/30">
          <CommonFormField label="Customer Bank Name">
            <input
              v-model="paymentForm.bankName"
              type="text"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              placeholder="BCA / Mandiri / BNI"
              required
            />
          </CommonFormField>
          <CommonFormField label="Account Number">
            <input
              v-model="paymentForm.accountNumber"
              type="text"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              placeholder="e.g. 1234567890"
              required
            />
          </CommonFormField>
          <CommonFormField label="Account Holder">
            <input
              v-model="paymentForm.accountName"
              type="text"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              :placeholder="selectedReturn.customer"
              required
            />
          </CommonFormField>
        </div>

        <CommonFormField label="Paying Refund Amount (Rp)" required>
          <input
            v-model.number="paymentForm.amount"
            type="number"
            class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            required
          />
        </CommonFormField>

        <CommonFormField label="Notes">
          <textarea
            v-model="paymentForm.notes"
            rows="2"
            class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            placeholder="Refund notes or reference..."
          ></textarea>
        </CommonFormField>

        <CommonModalFooter submitLabel="Confirm Payment-OUT" @cancel="paymentModalVisible = false" />
      </form>
    </CommonBaseModal>

    <!-- Add / Edit Modal -->
    <CommonBaseModal v-model="crudModalVisible" :title="isEditing ? 'Edit Sales Return' : 'Add New Sales Return'" maxWidth="md">
      <form @submit.prevent="saveCrudReturn" class="space-y-4">
        <CommonFormField label="Sales Invoice No" required>
          <input
            v-model="crudForm.salesNo"
            type="text"
            class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            placeholder="e.g. 2511000001"
            required
          />
        </CommonFormField>
        <CommonFormField label="Customer Name" required>
          <input
            v-model="crudForm.customer"
            type="text"
            class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            placeholder="Customer name"
            required
          />
        </CommonFormField>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <CommonFormField label="Return Date" required>
            <input
              v-model="crudForm.date"
              type="text"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              placeholder="DD/MM/YYYY"
              required
            />
          </CommonFormField>
          <CommonFormField label="Total Refund (Rp)" required>
            <input
              v-model.number="crudForm.total"
              type="number"
              min="0"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              required
            />
          </CommonFormField>
        </div>
        <CommonFormField label="Payment Status">
          <select
            v-model="crudForm.paymentStatus"
            class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          >
            <option value="Unpaid">Unpaid</option>
            <option value="Paid">Paid</option>
          </select>
        </CommonFormField>
        <CommonModalFooter :submit-label="isEditing ? 'Update Return' : 'Save Return'" @cancel="crudModalVisible = false" />
      </form>
    </CommonBaseModal>
  </div>
</template>

<script setup lang="ts">definePageMeta({
  layout: "default",
});

useHead({
  title: "Sales Return List - Kacetak System",
});

const { data: salesReturnData } = await useFetch<SalesReturn[]>('/api/sales-return')
const returns = ref<SalesReturn[]>(salesReturnData.value ?? [])
useMockSync('sales-return', returns);

const searchQuery = ref("");
const filterPaymentStatus = ref("");

const filteredReturns = computed(() => {
  return returns.value.filter((r) => {
    const matchSearch =
      r.returnNo.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      r.salesNo.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      r.customer.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchPayment = filterPaymentStatus.value ? r.paymentStatus === filterPaymentStatus.value : true;
    return matchSearch && matchPayment;
  });
});

function formatNumber(val: number): string {
  return new Intl.NumberFormat("id-ID").format(val);
}

// Details View Modal
const viewModalVisible = ref(false);
const selectedReturn = ref<SalesReturn | null>(null);

function viewReturn(ret: SalesReturn) {
  selectedReturn.value = ret;
  viewModalVisible.value = true;
}

// Payment-OUT Modal
const paymentModalVisible = ref(false);
const paymentForm = reactive({
  method: "Cash" as "Cash" | "Transfer",
  bankName: "BCA",
  accountNumber: "",
  accountName: "",
  amount: 0,
  notes: "",
});

function openPaymentModal(ret: SalesReturn) {
  selectedReturn.value = ret;
  paymentForm.method = "Cash";
  paymentForm.bankName = "BCA";
  paymentForm.accountNumber = "";
  paymentForm.accountName = ret.customer;
  paymentForm.amount = ret.total;
  paymentForm.notes = `Refund for ${ret.returnNo}`;
  paymentModalVisible.value = true;
}

function processPaymentOut() {
  if (selectedReturn.value) {
    selectedReturn.value.paymentStatus = "Paid";
    selectedReturn.value.paymentMethod = paymentForm.method;
    selectedReturn.value.paymentDate = new Date().toLocaleDateString("en-GB");
    alert(`Payment-OUT of Rp ${formatNumber(paymentForm.amount)} processed successfully.`);
  }
  paymentModalVisible.value = false;
}

// Add / Edit CRUD Modal
const crudModalVisible = ref(false);
const isEditing = ref(false);
const crudForm = reactive({
  id: 0,
  salesNo: "",
  customer: "",
  date: "",
  total: 0,
  paymentStatus: "Unpaid" as "Paid" | "Unpaid",
});

function openAddModal() {
  isEditing.value = false;
  crudForm.id = 0;
  crudForm.salesNo = "";
  crudForm.customer = "";
  crudForm.date = new Date().toLocaleDateString("en-GB");
  crudForm.total = 0;
  crudForm.paymentStatus = "Unpaid";
  crudModalVisible.value = true;
}

function openEditModal(ret: SalesReturn) {
  isEditing.value = true;
  crudForm.id = ret.id;
  crudForm.salesNo = ret.salesNo;
  crudForm.customer = ret.customer;
  crudForm.date = ret.date;
  crudForm.total = ret.total;
  crudForm.paymentStatus = ret.paymentStatus;
  crudModalVisible.value = true;
}

function saveCrudReturn() {
  if (isEditing.value) {
    const editId = crudForm.id;
    const idx = returns.value.findIndex((r) => r.id === editId);
    if (idx !== -1) {
      returns.value[idx] = {
        ...returns.value[idx],
        salesNo: crudForm.salesNo,
        customer: crudForm.customer,
        date: crudForm.date,
        total: crudForm.total,
        paymentStatus: crudForm.paymentStatus,
      };
    }
  } else {
    returns.value.unshift({
      id: Date.now(),
      returnNo: `SR${String(returns.value.length + 1).padStart(6, "0")}`,
      salesNo: crudForm.salesNo,
      date: crudForm.date,
      customer: crudForm.customer,
      total: crudForm.total,
      paymentStatus: crudForm.paymentStatus,
      paymentDate: "",
      paymentMethod: "",
      items: [],
    });
  }
  crudModalVisible.value = false;
}

function deleteReturn(id: number) {
  if (confirm("Are you sure you want to delete this sales return?")) {
    returns.value = returns.value.filter((r) => r.id !== id);
  }
}

const exportPdf = () => {
  window.print();
};

const printTable = () => {
  window.print();
};

const refresh = () => {
  searchQuery.value = "";
  filterPaymentStatus.value = "";
};</script>
=======
<script setup lang="ts">
import SalesReturnRecordsTable from '~/components/pages/sales-return/SalesReturnRecordsTable.vue'
import SalesReturnEditor from '~/components/pages/sales-return/SalesReturnEditor.vue'
import SalesReturnDetails from '~/components/pages/sales-return/SalesReturnDetails.vue'
import SalesReturnPayment from '~/components/pages/sales-return/SalesReturnPayment.vue'
useLegacyPage({ title: 'Sales Return List', sweetAlert: false })
const {
  pending,
  error,
  refresh,
  filteredReturns,
  searchQuery,
  filterPaymentStatus,
  editorOpen,
  editData,
  selectedReturn,
  paymentReturn,
  deleting,
  busy,
  actionError,
  message,
  add,
  edit,
  save,
  pay,
  remove,
  printTable,
} = useSalesReturns()
</script>
<template>
  <div class="dulank-page dulank-page-sales-return">
    <SalesListHeader
      title="Sales Return List"
      subtitle="Manage your Returns"
      add-label="Add New Sales Return"
      :refreshing="pending"
      @add="add"
      @refresh="refresh()"
      @print="printTable"
    />
    <SalesFeedback
      :pending="pending"
      skeleton="table"
      :skeleton-cols="9"
      :skeleton-rows="6"
      :error="error ? 'Unable to load sales returns.' : ''"
      :message="message"
      @retry="refresh()"
      @dismiss="message = ''"
    />
    <SalesReturnRecordsTable
      v-if="!pending && !error"
      v-model:search="searchQuery"
      v-model:payment-status="filterPaymentStatus"
      :items="filteredReturns"
      @view="selectedReturn = $event"
      @edit="edit"
      @payment="
        (item) => {
          actionError = ''
          paymentReturn = item
        }
      "
      @delete="
        (item) => {
          actionError = ''
          deleting = item
        }
      "
      @print="printTable"
    />
    <SalesReturnEditor
      :open="editorOpen"
      :record="editData"
      :busy="busy"
      :error="actionError"
      @close="!busy && (editorOpen = false)"
      @submit="save"
    />
    <SalesReturnDetails :record="selectedReturn" @close="selectedReturn = null" />
    <SalesReturnPayment
      :record="paymentReturn"
      :busy="busy"
      :error="actionError"
      @close="!busy && (paymentReturn = null)"
      @submit="pay"
    />
    <SalesConfirmDelete
      :open="!!deleting"
      :busy="busy"
      :error="actionError"
      @close="deleting = null"
      @confirm="remove"
    />
  </div>
</template>
>>>>>>> origin/eko
