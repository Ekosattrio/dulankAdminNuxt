<script setup lang="ts">import { formatRupiah } from "~/composables/useFormatters";

const { data: incentiveData } = await useFetch<IncentiveItem[]>('/api/incentive')
const incentives = ref<IncentiveItem[]>(incentiveData.value ?? [])
useMockSync('incentive', incentives);

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
};</script>

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
          <CommonFeatherIcon name="plus-circle" size="18" />
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
          <CommonFeatherIcon name="award" size="24" />
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
          <CommonFeatherIcon name="dollar-sign" size="24" />
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
        <CommonSearchFilter v-model="searchQuery" placeholder="Search employee / code..." />

        <CommonFilterSelect v-model="selectedStatus" :options="[{ value: 'Paid', label: 'Paid' }, { value: 'Pending', label: 'Pending' }]" />
      </div>

      <TablesDataTable :columns="columns" :items="filteredIncentives">
        <template #cell(code)="{ item }">
          <span class="font-semibold text-primary">{{ item.code }}</span>
        </template>

        <template #cell(employee)="{ item }">
          <span class="font-medium text-gray-900 dark:text-gray-100">{{ item.employee }}</span>
        </template>

        <template #cell(period)="{ item }">
          <span class="font-mono text-xs text-gray-600 dark:text-gray-400">{{ item.period }}</span>
        </template>

        <template #cell(qtyComplete)="{ item }">
          <span class="font-bold text-gray-900 dark:text-gray-100">{{ item.qtyComplete }}</span>
        </template>

        <template #cell(totalAmount)="{ item }">
          <span class="font-mono font-medium text-gray-900 dark:text-gray-100">{{ formatRupiah(item.totalAmount) }}</span>
        </template>

        <template #cell(status)="{ item }">
          <CommonStatusPill :status="item.status" />
        </template>

        <template #cell(action)="{ item }">
          <CommonRowActions :item="item" @edit="openEditModal(item)" @delete="deleteItem(item.id)" />
        </template>
      </TablesDataTable>
    </div>

    <!-- Modal Add Incentive -->
    <CommonBaseModal v-model="isAddModalOpen" title="Add New Incentive" maxWidth="md">
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

        <CommonModalFooter submitLabel="Submit" @cancel="isAddModalOpen = false" />
      </form>
    </CommonBaseModal>

    <!-- Modal Edit Incentive -->
    <CommonBaseModal v-model="isEditModalOpen" title="Edit Incentive" maxWidth="md">
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

        <CommonModalFooter submitLabel="Save Changes" @cancel="isEditModalOpen = false" />
      </form>
    </CommonBaseModal>
  </div>
</template>
