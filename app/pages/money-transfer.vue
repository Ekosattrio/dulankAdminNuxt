<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <CommonPageHeader title="Money Transfer" subtitle="Manage Money Transfer List">
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
            <span>Add New Transfer</span>
          </button>
        </div>
      </template>
    </CommonPageHeader>

    <!-- Transfer List Card -->
    <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <!-- Toolbar -->
      <div class="mb-5 flex flex-wrap items-center justify-between gap-4">
        <CommonSearchFilter v-model="searchQuery" placeholder="Search transfer no, account, note..." />
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="w-full text-start text-xs text-gray-700 dark:text-gray-300">
          <thead
            class="bg-gray-50 text-[11px] font-semibold uppercase text-gray-500 border-b border-gray-200 dark:bg-gray-800/50 dark:border-gray-700 dark:text-gray-400"
          >
            <tr>
              <th class="px-4 py-3 text-start whitespace-nowrap">Date</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">No Transfer</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">From Account</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">To Account</th>
              <th class="px-4 py-3 text-end whitespace-nowrap">Amount (IDR)</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Description</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Created By</th>
              <th class="px-4 py-3 text-end whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <tr v-for="item in filteredTransfers" :key="item.id" class="transition-colors hover:bg-gray-50/75 dark:hover:bg-gray-800/40">
              <td class="px-4 py-3 whitespace-nowrap">{{ item.date }}</td>
              <td class="px-4 py-3 whitespace-nowrap font-semibold text-primary">{{ item.no }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-xs font-medium">{{ item.fromAccount }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-xs font-medium">{{ item.toAccount }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-end font-semibold">{{ formatNumber(item.amount) }}</td>
              <td class="max-w-[240px] truncate px-4 py-3 whitespace-nowrap text-gray-500 dark:text-gray-400">{{ item.description }}</td>
              <td class="px-4 py-3 whitespace-nowrap">{{ item.createdBy }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-end">
                <CommonRowActions :item="item" show-view @view="openViewModal(item)" @edit="openEditModal(item)" @delete="deleteItem(item.id)" />
              </td>
            </tr>
            <tr v-if="filteredTransfers.length === 0">
              <td colspan="8" class="p-8 text-center text-gray-400">No money transfers found.</td>
            </tr>
          </tbody>
          <tfoot class="border-t-2 border-gray-200 bg-gray-50/75 font-semibold text-gray-800 dark:border-gray-700 dark:bg-gray-800/60 dark:text-white">
            <tr>
              <td class="px-4 py-3 text-start" colspan="4">Total Transferred Amount</td>
              <td class="px-4 py-3 text-end font-bold text-primary">{{ formatNumber(totalAmount) }}</td>
              <td class="px-4 py-3" colspan="3"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>

    <!-- Add Transfer Modal -->
    <CommonBaseModal v-model="showAddModal" title="Add New Transfer" maxWidth="lg">
      <form @submit.prevent="saveTransfer" class="space-y-4">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <CommonFormField label="Date" required>
            <input
              v-model="formData.date"
              type="text"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              required
            />
          </CommonFormField>
          <CommonFormField label="Amount (IDR)" required>
            <input
              v-model.number="formData.amount"
              type="number"
              min="1"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              required
            />
          </CommonFormField>
        </div>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <CommonFormField label="From Account" required>
            <select
              v-model="formData.fromAccount"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              required
            >
              <option v-for="acc in accountOptions" :key="acc" :value="acc">{{ acc }}</option>
            </select>
          </CommonFormField>
          <CommonFormField label="To Account" required>
            <select
              v-model="formData.toAccount"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              required
            >
              <option v-for="acc in accountOptions" :key="acc" :value="acc">{{ acc }}</option>
            </select>
          </CommonFormField>
        </div>
        <CommonFormField label="Description / Note">
          <textarea
            v-model="formData.description"
            rows="3"
            class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            placeholder="Transfer purpose..."
          ></textarea>
        </CommonFormField>
        <CommonModalFooter @cancel="closeModal" />
      </form>
    </CommonBaseModal>

    <!-- Edit Transfer Modal -->
    <CommonBaseModal v-model="showEditModal" title="Edit Money Transfer" maxWidth="lg">
      <form @submit.prevent="updateTransfer" class="space-y-4">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <CommonFormField label="Date" required>
            <input
              v-model="formData.date"
              type="text"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              required
            />
          </CommonFormField>
          <CommonFormField label="Amount (IDR)" required>
            <input
              v-model.number="formData.amount"
              type="number"
              min="1"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              required
            />
          </CommonFormField>
        </div>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <CommonFormField label="From Account" required>
            <select
              v-model="formData.fromAccount"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              required
            >
              <option v-for="acc in accountOptions" :key="acc" :value="acc">{{ acc }}</option>
            </select>
          </CommonFormField>
          <CommonFormField label="To Account" required>
            <select
              v-model="formData.toAccount"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              required
            >
              <option v-for="acc in accountOptions" :key="acc" :value="acc">{{ acc }}</option>
            </select>
          </CommonFormField>
        </div>
        <CommonFormField label="Description / Note">
          <textarea
            v-model="formData.description"
            rows="3"
            class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            placeholder="Transfer purpose..."
          ></textarea>
        </CommonFormField>
        <CommonModalFooter @cancel="closeModal" />
      </form>
    </CommonBaseModal>

    <!-- View Transfer Modal -->
    <CommonBaseModal v-model="showViewModal" :title="`View Transfer - ${activeItem?.no ?? ''}`" maxWidth="md">
      <div v-if="activeItem" class="divide-y divide-gray-100 dark:divide-gray-800">
        <div class="flex items-center justify-between py-2.5">
          <span class="text-gray-500 dark:text-gray-400">Date</span>
          <span class="font-medium text-gray-800 dark:text-gray-200">{{ activeItem.date }}</span>
        </div>
        <div class="flex items-center justify-between py-2.5">
          <span class="text-gray-500 dark:text-gray-400">No Transfer</span>
          <span class="font-semibold text-primary">{{ activeItem.no }}</span>
        </div>
        <div class="flex items-center justify-between py-2.5">
          <span class="text-gray-500 dark:text-gray-400">From Account</span>
          <span class="text-gray-800 dark:text-gray-200">{{ activeItem.fromAccount }}</span>
        </div>
        <div class="flex items-center justify-between py-2.5">
          <span class="text-gray-500 dark:text-gray-400">To Account</span>
          <span class="text-gray-800 dark:text-gray-200">{{ activeItem.toAccount }}</span>
        </div>
        <div class="flex items-center justify-between py-2.5">
          <span class="text-gray-500 dark:text-gray-400">Amount</span>
          <span class="font-bold text-emerald-600 dark:text-emerald-400">Rp {{ formatNumber(activeItem.amount) }}</span>
        </div>
        <div class="flex items-center justify-between py-2.5">
          <span class="text-gray-500 dark:text-gray-400">Created By</span>
          <span class="text-gray-800 dark:text-gray-200">{{ activeItem.createdBy }}</span>
        </div>
        <div class="py-2.5">
          <span class="text-gray-500 dark:text-gray-400">Description</span>
          <div class="mt-1 rounded-lg bg-gray-50 p-2 text-sm text-gray-500 dark:bg-gray-800/40 dark:text-gray-400">{{ activeItem.description || '-' }}</div>
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
  title: "Money Transfer - Kacetak System",
});

const accountOptions = [
  "Cash Account Cash Account - 1001",
  "Bank BNI 0876543210123 - PT Dulank Semesta Cida",
  "Bank BCA 4567891230 - Cecep Sudirman",
  "Bank Mandiri 1230009876543 - PT Dulank Semesta Cida",
  "Bank BRI 1020304050607 - Cecep Sudirman",
];

const { data: moneyTransferData } = await useFetch<TransferRecord[]>('/api/money-transfer')
const transfers = ref<TransferRecord[]>(moneyTransferData.value ?? [])
useMockSync('money-transfer', transfers);

const searchQuery = ref("");

const filteredTransfers = computed(() => {
  return transfers.value.filter((item) => {
    const q = searchQuery.value.toLowerCase();
    return (
      !q ||
      item.no.toLowerCase().includes(q) ||
      item.fromAccount.toLowerCase().includes(q) ||
      item.toAccount.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q)
    );
  });
});

const totalAmount = computed(() => filteredTransfers.value.reduce((acc, c) => acc + c.amount, 0));

const formatNumber = (val: number) => {
  return new Intl.NumberFormat("id-ID").format(val || 0);
};

const showAddModal = ref(false);
const showEditModal = ref(false);
const showViewModal = ref(false);
const editingId = ref<number | null>(null);
const activeItem = ref<TransferRecord | null>(null);

const defaultFormData = () => ({
  date: "20/01/2026 14:00",
  fromAccount: "Cash Account Cash Account - 1001",
  toAccount: "Bank BCA 4567891230 - Cecep Sudirman",
  amount: 500000,
  description: "",
});

const formData = ref(defaultFormData());

const openAddModal = () => {
  formData.value = defaultFormData();
  showAddModal.value = true;
};

const openEditModal = (item: TransferRecord) => {
  editingId.value = item.id;
  formData.value = {
    date: item.date,
    fromAccount: item.fromAccount,
    toAccount: item.toAccount,
    amount: item.amount,
    description: item.description,
  };
  showEditModal.value = true;
};

const openViewModal = (item: TransferRecord) => {
  activeItem.value = item;
  showViewModal.value = true;
};

const closeModal = () => {
  showAddModal.value = false;
  showEditModal.value = false;
  showViewModal.value = false;
  editingId.value = null;
  activeItem.value = null;
};

const saveTransfer = () => {
  const newId = Math.max(0, ...transfers.value.map((t) => t.id)) + 1;
  const count = transfers.value.length + 1;
  const no = `TF${String(count).padStart(5, "0")}`;
  transfers.value.unshift({
    id: newId,
    date: formData.value.date,
    no,
    fromAccount: formData.value.fromAccount,
    toAccount: formData.value.toAccount,
    amount: formData.value.amount,
    description: formData.value.description,
    createdBy: "Admin",
  });
  closeModal();
};

const updateTransfer = () => {
  if (editingId.value === null) return;
  const idx = transfers.value.findIndex((t) => t.id === editingId.value);
  if (idx !== -1) {
    transfers.value[idx] = {
      ...transfers.value[idx],
      date: formData.value.date,
      fromAccount: formData.value.fromAccount,
      toAccount: formData.value.toAccount,
      amount: formData.value.amount,
      description: formData.value.description,
    };
  }
  closeModal();
};

const deleteItem = (id: number) => {
  if (confirm("Are you sure you want to delete this money transfer?")) {
    transfers.value = transfers.value.filter((t) => t.id !== id);
  }
};

const exportPdf = () => {
  window.print();
};

const printTable = () => {
  window.print();
};

const refresh = () => {
  searchQuery.value = "";
};

const toggleCollapse = () => {
  // collapsible header
};</script>