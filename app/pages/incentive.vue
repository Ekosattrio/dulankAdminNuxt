<script setup lang="ts">
import { formatRupiah } from "~/composables/useFormatters";

interface IncentiveItem {
  id: string;
  code: string;
  employee: string;
  period: string;
  qtyComplete: number;
  totalAmount: number;
  status: "Paid" | "Pending";
}

const incentives = ref<IncentiveItem[]>([
  { id: "1", code: "INC-01", employee: "Desman Dwi", period: "2025-08", qtyComplete: 10, totalAmount: 5000, status: "Paid" },
  { id: "2", code: "INC-02", employee: "Eko Satrio", period: "2025-08", qtyComplete: 8, totalAmount: 2400, status: "Pending" },
  { id: "3", code: "INC-03", employee: "Rina Melati", period: "2025-07", qtyComplete: 15, totalAmount: 7500, status: "Paid" },
  { id: "4", code: "INC-04", employee: "Budi Santoso", period: "2025-07", qtyComplete: 12, totalAmount: 3600, status: "Paid" },
  { id: "5", code: "INC-05", employee: "Santi Dewi", period: "2025-08", qtyComplete: 5, totalAmount: 1500, status: "Pending" },
  { id: "6", code: "INC-06", employee: "Joko Susilo", period: "2025-06", qtyComplete: 20, totalAmount: 10000, status: "Paid" },
  { id: "7", code: "INC-07", employee: "Lia Amalia", period: "2025-07", qtyComplete: 9, totalAmount: 2700, status: "Pending" },
  { id: "8", code: "INC-08", employee: "Taufik Hidayat", period: "2025-06", qtyComplete: 18, totalAmount: 9000, status: "Paid" },
  { id: "9", code: "INC-09", employee: "Dewi Sartika", period: "2025-08", qtyComplete: 7, totalAmount: 2100, status: "Pending" },
  { id: "10", code: "INC-10", employee: "Agus Salim", period: "2025-07", qtyComplete: 14, totalAmount: 4200, status: "Paid" },
]);

const searchQuery = ref("");
const selectedStatus = ref("");

const filteredIncentives = computed(() => {
  return incentives.value.filter((item) => {
    const matchSearch =
      !searchQuery.value ||
      item.employee.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.code.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchStatus = !selectedStatus.value || item.status === selectedStatus.value;
    return matchSearch && matchStatus;
  });
});

const columns = [
  { key: "code", label: "# Incentive" },
  { key: "employee", label: "Employee" },
  { key: "period", label: "Incentive Priode" },
  { key: "qtyComplete", label: "Qty Complete" },
  { key: "totalAmount", label: "Total Amount" },
  { key: "status", label: "Status" },
  { key: "action", label: "Action", class: "text-end no-sort" },
];

// Add Modal
const isAddModalOpen = ref(false);
const addForm = reactive({
  employee: "",
  period: "2025-08",
  qty: 1,
  amount: 5000,
  status: "Pending" as "Paid" | "Pending",
});

const submitAdd = () => {
  if (!addForm.employee) {
    alert("Please enter employee name");
    return;
  }
  const nextNum = incentives.value.length + 1;
  incentives.value.unshift({
    id: String(Date.now()),
    code: `INC-${nextNum < 10 ? "0" + nextNum : nextNum}`,
    employee: addForm.employee,
    period: addForm.period,
    qtyComplete: Number(addForm.qty),
    totalAmount: Number(addForm.amount),
    status: addForm.status,
  });
  isAddModalOpen.value = false;
};

// Edit Modal
const isEditModalOpen = ref(false);
const editingItem = ref<IncentiveItem | null>(null);
const editForm = reactive({
  qty: 0,
  amount: 0,
  status: "Pending" as "Paid" | "Pending",
});

const openEditModal = (item: IncentiveItem) => {
  editingItem.value = item;
  editForm.qty = item.qtyComplete;
  editForm.amount = item.totalAmount;
  editForm.status = item.status;
  isEditModalOpen.value = true;
};

const submitEdit = () => {
  if (!editingItem.value) return;
  editingItem.value.qtyComplete = Number(editForm.qty);
  editingItem.value.totalAmount = Number(editForm.amount);
  editingItem.value.status = editForm.status;
  isEditModalOpen.value = false;
};

const deleteItem = (id: string) => {
  if (confirm("Are you sure you want to delete this incentive entry?")) {
    incentives.value = incentives.value.filter((i) => i.id !== id);
  }
};
</script>

<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <CommonPageHeader title="Incentive List" subtitle="Manage your Incentive">
      <template #actions>
        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-600 focus:outline-none"
          @click="isAddModalOpen = true"
        >
          <FeatherIcon name="plus-circle" size="18" />
          <span>Add New Incentive</span>
        </button>
      </template>
    </CommonPageHeader>

    <!-- Stat widgets -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div
        class="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >
        <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-primary dark:bg-orange-950/40">
          <FeatherIcon name="award" size="24" />
        </div>
        <div>
          <p class="text-xs font-medium text-gray-500">Total Count Incentive</p>
          <h4 class="mt-1 font-mono text-xl font-bold text-gray-900 dark:text-gray-100">307,144</h4>
        </div>
      </div>

      <div
        class="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >
        <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40">
          <FeatherIcon name="dollar-sign" size="24" />
        </div>
        <div>
          <p class="text-xs font-medium text-gray-500">Total Amount Incentive</p>
          <h4 class="mt-1 font-mono text-xl font-bold text-gray-900 dark:text-gray-100">Rp4.385.000</h4>
        </div>
      </div>
    </div>

    <!-- Table Card -->
    <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div class="relative w-64">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search employee / code..."
            class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 pe-8 text-sm text-gray-800 placeholder-gray-400 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          />
          <span class="pointer-events-none absolute inset-y-0 end-0 flex items-center pe-2.5 text-gray-400">
            <FeatherIcon name="search" size="16" />
          </span>
        </div>

        <div class="flex items-center gap-3">
          <select
            v-model="selectedStatus"
            class="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          >
            <option value="">Status: All</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
      </div>

      <TableDataTable :columns="columns" :rows="filteredIncentives">
        <template #cell(code)="{ row }">
          <span class="font-semibold text-primary">{{ row.code }}</span>
        </template>

        <template #cell(employee)="{ row }">
          <span class="font-medium text-gray-900 dark:text-gray-100">{{ row.employee }}</span>
        </template>

        <template #cell(period)="{ row }">
          <span class="font-mono text-xs text-gray-600 dark:text-gray-400">{{ row.period }}</span>
        </template>

        <template #cell(qtyComplete)="{ row }">
          <span class="font-bold text-gray-900 dark:text-gray-100">{{ row.qtyComplete }}</span>
        </template>

        <template #cell(totalAmount)="{ row }">
          <span class="font-mono font-medium text-gray-900 dark:text-gray-100">{{ formatRupiah(row.totalAmount) }}</span>
        </template>

        <template #cell(status)="{ row }">
          <span
            :class="[
              'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
              row.status === 'Paid'
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                : 'bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300',
            ]"
          >
            {{ row.status }}
          </span>
        </template>

        <template #cell(action)="{ row }">
          <div class="flex items-center justify-end gap-2">
            <button
              type="button"
              class="rounded-lg p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-amber-500 dark:hover:bg-gray-800"
              title="Edit"
              @click="openEditModal(row)"
            >
              <FeatherIcon name="edit" size="16" />
            </button>
            <button
              type="button"
              class="rounded-lg p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-rose-600 dark:hover:bg-gray-800"
              title="Delete"
              @click="deleteItem(row.id)"
            >
              <FeatherIcon name="trash-2" size="16" />
            </button>
          </div>
        </template>
      </TableDataTable>
    </div>

    <!-- Modal Add Incentive -->
    <ModalBaseModal v-model="isAddModalOpen" title="Add New Incentive" size="md">
      <form @submit.prevent="submitAdd" class="space-y-4">
        <div>
          <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Employee Name</label>
          <FormsEmployeeLiveSearch
            v-model="addForm.employee"
            placeholder="Select Employee..."
            @select="(e: any) => (addForm.employee = e.name)"
          />
        </div>

        <div>
          <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Incentive Period</label>
          <input
            v-model="addForm.period"
            type="month"
            class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          />
        </div>

        <div>
          <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Qty Complete</label>
          <FormsNumberInput v-model="addForm.qty" />
        </div>

        <div>
          <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Total Amount</label>
          <FormsNumberInput v-model="addForm.amount" />
        </div>

        <div>
          <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Status</label>
          <select
            v-model="addForm.status"
            class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          >
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
          </select>
        </div>

        <div class="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
          <button
            type="button"
            class="rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
            @click="isAddModalOpen = false"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white shadow hover:bg-primary-600 transition"
          >
            Submit
          </button>
        </div>
      </form>
    </ModalBaseModal>

    <!-- Modal Edit Incentive -->
    <ModalBaseModal v-model="isEditModalOpen" title="Edit Incentive" size="md">
      <form @submit.prevent="submitEdit" class="space-y-4">
        <div>
          <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Employee</label>
          <input
            :value="editingItem?.employee"
            disabled
            class="w-full h-10 rounded-lg border border-gray-200 bg-gray-100 px-3 text-sm text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
          />
        </div>

        <div>
          <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Qty Complete</label>
          <FormsNumberInput v-model="editForm.qty" />
        </div>

        <div>
          <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Total Amount</label>
          <FormsNumberInput v-model="editForm.amount" />
        </div>

        <div>
          <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Status</label>
          <select
            v-model="editForm.status"
            class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          >
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
          </select>
        </div>

        <div class="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
          <button
            type="button"
            class="rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
            @click="isEditModalOpen = false"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white shadow hover:bg-primary-600 transition"
          >
            Save Changes
          </button>
        </div>
      </form>
    </ModalBaseModal>
  </div>
</template>
