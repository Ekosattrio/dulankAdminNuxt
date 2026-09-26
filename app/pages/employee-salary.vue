<script setup lang="ts">
import { formatRupiah } from "~/composables/useFormatters";

interface AllowanceItem {
  id: string;
  name: string;
  amount: number;
  isEditing?: boolean;
}

interface SalaryRecord {
  id: string;
  employeeId: string;
  name: string;
  salary: number;
  system: "Monthly" | "Daily" | "Weekly";
  allowanceTotal: number;
  overtimeRate: number;
  status: "Active" | "Disabled";
  allowances: AllowanceItem[];
}

const records = ref<SalaryRecord[]>([
  {
    id: "1",
    employeeId: "ST001",
    name: "Budi Setiadi",
    salary: 4500000,
    system: "Monthly",
    allowanceTotal: 500000,
    overtimeRate: 15000,
    status: "Active",
    allowances: [
      { id: "1", name: "Present Allowance", amount: 300000 },
      { id: "2", name: "Pengiriman", amount: 200000 },
    ],
  },
  {
    id: "2",
    employeeId: "ST002",
    name: "Siti Nurhaliza",
    salary: 4200000,
    system: "Monthly",
    allowanceTotal: 300000,
    overtimeRate: 15000,
    status: "Active",
    allowances: [{ id: "1", name: "Present Allowance", amount: 300000 }],
  },
  {
    id: "3",
    employeeId: "ST003",
    name: "Agus Rahardjo",
    salary: 4000000,
    system: "Monthly",
    allowanceTotal: 400000,
    overtimeRate: 15000,
    status: "Active",
    allowances: [
      { id: "1", name: "Present Allowance", amount: 250000 },
      { id: "2", name: "Transport", amount: 150000 },
    ],
  },
  {
    id: "4",
    employeeId: "ST004",
    name: "Rina Permata",
    salary: 3800000,
    system: "Monthly",
    allowanceTotal: 700000,
    overtimeRate: 15000,
    status: "Active",
    allowances: [
      { id: "1", name: "Present Allowance", amount: 300000 },
      { id: "2", name: "Bonus Sales", amount: 400000 },
    ],
  },
]);

const searchQuery = ref("");
const selectedStatus = ref("");

const filteredRecords = computed(() => {
  return records.value.filter((r) => {
    const matchSearch =
      !searchQuery.value ||
      r.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      r.employeeId.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchStatus = !selectedStatus.value || r.status === selectedStatus.value;
    return matchSearch && matchStatus;
  });
});

const columns = [
  { key: "employeeId", label: "Employee ID" },
  { key: "name", label: "Name" },
  { key: "salary", label: "Salary (IDR)" },
  { key: "system", label: "System" },
  { key: "allowanceTotal", label: "Allowance (IDR)" },
  { key: "overtimeRate", label: "Overtime Rate" },
  { key: "status", label: "Status" },
  { key: "action", label: "Action", class: "text-end no-sort" },
];

// Add Modal
const isAddModalOpen = ref(false);
const addForm = reactive({
  employeeId: "",
  name: "",
  salary: 150000,
  system: "Daily" as "Daily" | "Weekly" | "Monthly",
  overtimeRate: 20000,
  allowances: [{ id: "1", name: "Present Allowance", amount: 20000, isEditing: false }],
});

const onSelectEmployeeAdd = (emp: any) => {
  addForm.employeeId = emp.id;
  addForm.name = emp.name;
  addForm.salary = emp.salary || 150000;
  addForm.system = emp.system || "Daily";
  addForm.overtimeRate = emp.ovtRate || 20000;
};

const addAllowanceItem = (formObj: any) => {
  formObj.allowances.push({
    id: String(Date.now()),
    name: "Other Allowance",
    amount: 0,
    isEditing: true,
  });
};

const removeAllowanceItem = (formObj: any, index: number) => {
  formObj.allowances.splice(index, 1);
};

const submitAddSalary = () => {
  if (!addForm.name) {
    alert("Please select an employee");
    return;
  }
  const totalAllow = addForm.allowances.reduce((acc, item) => acc + Number(item.amount || 0), 0);
  records.value.push({
    id: String(Date.now()),
    employeeId: addForm.employeeId || "ST099",
    name: addForm.name,
    salary: Number(addForm.salary),
    system: addForm.system,
    allowanceTotal: totalAllow,
    overtimeRate: Number(addForm.overtimeRate),
    status: "Active",
    allowances: JSON.parse(JSON.stringify(addForm.allowances)),
  });
  isAddModalOpen.value = false;
};

// Edit Modal
const isEditModalOpen = ref(false);
const editingRecord = ref<SalaryRecord | null>(null);
const editForm = reactive({
  id: "",
  employeeId: "",
  name: "",
  salary: 0,
  system: "Monthly" as "Daily" | "Weekly" | "Monthly",
  overtimeRate: 0,
  status: "Active" as "Active" | "Disabled",
  allowances: [] as AllowanceItem[],
});

const openEditModal = (r: SalaryRecord) => {
  editingRecord.value = r;
  editForm.id = r.id;
  editForm.employeeId = r.employeeId;
  editForm.name = r.name;
  editForm.salary = r.salary;
  editForm.system = r.system;
  editForm.overtimeRate = r.overtimeRate;
  editForm.status = r.status;
  editForm.allowances = JSON.parse(JSON.stringify(r.allowances));
  isEditModalOpen.value = true;
};

const submitEditSalary = () => {
  if (!editingRecord.value) return;
  const totalAllow = editForm.allowances.reduce((acc, item) => acc + Number(item.amount || 0), 0);
  editingRecord.value.salary = Number(editForm.salary);
  editingRecord.value.system = editForm.system;
  editingRecord.value.overtimeRate = Number(editForm.overtimeRate);
  editingRecord.value.status = editForm.status;
  editingRecord.value.allowances = JSON.parse(JSON.stringify(editForm.allowances));
  editingRecord.value.allowanceTotal = totalAllow;
  isEditModalOpen.value = false;
};

// View Modal
const isViewModalOpen = ref(false);
const viewingRecord = ref<SalaryRecord | null>(null);

const openViewModal = (r: SalaryRecord) => {
  viewingRecord.value = r;
  isViewModalOpen.value = true;
};

const deleteRecord = (id: string) => {
  if (confirm("Are you sure you want to delete this salary setting?")) {
    records.value = records.value.filter((r) => r.id !== id);
  }
};
</script>

<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <CommonPageHeader title="Payroll" subtitle="Manage Your Employees">
      <template #actions>
        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-600 focus:outline-none"
          @click="isAddModalOpen = true"
        >
          <FeatherIcon name="plus-circle" size="18" />
          <span>Add New Employee Salary</span>
        </button>
      </template>
    </CommonPageHeader>

    <!-- Table Card -->
    <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <!-- Filter Bar -->
      <div class="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div class="relative w-64">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search employee..."
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
            <option value="Active">Active</option>
            <option value="Disabled">Disabled</option>
          </select>
        </div>
      </div>

      <!-- Table -->
      <TableDataTable :columns="columns" :rows="filteredRecords">
        <template #cell(employeeId)="{ row }">
          <span class="font-semibold text-gray-900 dark:text-gray-100">{{ row.employeeId }}</span>
        </template>

        <template #cell(name)="{ row }">
          <div class="font-medium text-gray-900 dark:text-gray-100">{{ row.name }}</div>
        </template>

        <template #cell(salary)="{ row }">
          <span class="font-mono font-medium text-gray-900 dark:text-gray-100">
            {{ formatRupiah(row.salary) }}
          </span>
        </template>

        <template #cell(system)="{ row }">
          <span
            class="inline-flex rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300"
          >
            {{ row.system }}
          </span>
        </template>

        <template #cell(allowanceTotal)="{ row }">
          <span class="font-mono text-gray-700 dark:text-gray-300">
            {{ formatRupiah(row.allowanceTotal) }}
          </span>
        </template>

        <template #cell(overtimeRate)="{ row }">
          <span class="font-mono text-gray-700 dark:text-gray-300"> {{ formatRupiah(row.overtimeRate) }}/hr </span>
        </template>

        <template #cell(status)="{ row }">
          <span
            :class="[
              'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
              row.status === 'Active'
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
            ]"
          >
            {{ row.status }}
          </span>
        </template>

        <template #cell(action)="{ row }">
          <div class="flex items-center justify-end gap-2">
            <button
              type="button"
              class="rounded-lg p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-primary dark:hover:bg-gray-800"
              title="View"
              @click="openViewModal(row)"
            >
              <FeatherIcon name="eye" size="16" />
            </button>
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
              @click="deleteRecord(row.id)"
            >
              <FeatherIcon name="trash-2" size="16" />
            </button>
          </div>
        </template>
      </TableDataTable>
    </div>

    <!-- Modal Add Salary -->
    <ModalBaseModal v-model="isAddModalOpen" title="Add New Employee Salary" size="lg">
      <form @submit.prevent="submitAddSalary" class="space-y-4">
        <div>
          <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Select Employee *</label>
          <FormsEmployeeLiveSearch v-model="addForm.name" placeholder="Search Employee..." @select="onSelectEmployeeAdd" />
        </div>

        <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Salary</label>
            <FormsNumberInput v-model="addForm.salary" />
          </div>

          <div>
            <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">System</label>
            <select
              v-model="addForm.system"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            >
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
            </select>
          </div>

          <div>
            <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Over Time per Hours</label>
            <FormsNumberInput v-model="addForm.overtimeRate" />
          </div>
        </div>

        <!-- Allowance section -->
        <div class="space-y-3 pt-2">
          <div class="flex items-center gap-2 border-b border-gray-200 pb-2 dark:border-gray-800">
            <FeatherIcon name="gift" size="16" class="text-primary" />
            <h6 class="text-sm font-bold text-gray-900 dark:text-gray-100">Allowance</h6>
          </div>

          <div
            v-for="(item, idx) in addForm.allowances"
            :key="item.id"
            class="rounded-lg border border-gray-100 p-3 dark:border-gray-800 space-y-2"
          >
            <div class="flex items-center justify-between">
              <div v-if="!item.isEditing" class="flex items-center gap-2">
                <span class="text-xs font-semibold text-gray-800 dark:text-gray-200">{{ item.name }}</span>
                <button type="button" class="text-xs italic text-primary hover:underline" @click="item.isEditing = true">
                  edit label
                </button>
              </div>
              <div v-else class="flex items-center gap-2">
                <input
                  v-model="item.name"
                  type="text"
                  class="h-7 w-48 rounded border border-gray-300 px-2 text-xs focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-800"
                />
                <button type="button" class="text-xs italic text-primary hover:underline" @click="item.isEditing = false">
                  save
                </button>
              </div>
              <button
                v-if="addForm.allowances.length > 1"
                type="button"
                class="text-xs italic text-rose-500 hover:underline"
                @click="removeAllowanceItem(addForm, idx)"
              >
                remove
              </button>
            </div>
            <div>
              <FormsNumberInput v-model="item.amount" placeholder="Amount (IDR)" />
            </div>
          </div>

          <button
            type="button"
            class="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1"
            @click="addAllowanceItem(addForm)"
          >
            + Add Other Allowance
          </button>
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
            class="rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-white shadow hover:bg-primary-600 transition"
          >
            Submit
          </button>
        </div>
      </form>
    </ModalBaseModal>

    <!-- Modal Edit Salary -->
    <ModalBaseModal v-model="isEditModalOpen" title="Edit Employee Salary" size="lg">
      <form @submit.prevent="submitEditSalary" class="space-y-4">
        <div>
          <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Employee</label>
          <input
            :value="`${editForm.name} (${editForm.employeeId})`"
            disabled
            class="w-full h-10 rounded-lg border border-gray-200 bg-gray-100 px-3 text-sm text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
          />
        </div>

        <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Salary</label>
            <FormsNumberInput v-model="editForm.salary" />
          </div>

          <div>
            <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">System</label>
            <select
              v-model="editForm.system"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            >
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
            </select>
          </div>

          <div>
            <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Over Time per Hours</label>
            <FormsNumberInput v-model="editForm.overtimeRate" />
          </div>
        </div>

        <!-- Allowance section -->
        <div class="space-y-3 pt-2">
          <div class="flex items-center gap-2 border-b border-gray-200 pb-2 dark:border-gray-800">
            <FeatherIcon name="gift" size="16" class="text-primary" />
            <h6 class="text-sm font-bold text-gray-900 dark:text-gray-100">Allowance</h6>
          </div>

          <div
            v-for="(item, idx) in editForm.allowances"
            :key="item.id"
            class="rounded-lg border border-gray-100 p-3 dark:border-gray-800 space-y-2"
          >
            <div class="flex items-center justify-between">
              <div v-if="!item.isEditing" class="flex items-center gap-2">
                <span class="text-xs font-semibold text-gray-800 dark:text-gray-200">{{ item.name }}</span>
                <button type="button" class="text-xs italic text-primary hover:underline" @click="item.isEditing = true">
                  edit label
                </button>
              </div>
              <div v-else class="flex items-center gap-2">
                <input
                  v-model="item.name"
                  type="text"
                  class="h-7 w-48 rounded border border-gray-300 px-2 text-xs focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-800"
                />
                <button type="button" class="text-xs italic text-primary hover:underline" @click="item.isEditing = false">
                  save
                </button>
              </div>
              <button
                type="button"
                class="text-xs italic text-rose-500 hover:underline"
                @click="removeAllowanceItem(editForm, idx)"
              >
                remove
              </button>
            </div>
            <div>
              <FormsNumberInput v-model="item.amount" placeholder="Amount (IDR)" />
            </div>
          </div>

          <button
            type="button"
            class="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1"
            @click="addAllowanceItem(editForm)"
          >
            + Add Other Allowance
          </button>
        </div>

        <div>
          <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Status</label>
          <select
            v-model="editForm.status"
            class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          >
            <option value="Active">Active</option>
            <option value="Disabled">Disabled</option>
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
            class="rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-white shadow hover:bg-primary-600 transition"
          >
            Save Changes
          </button>
        </div>
      </form>
    </ModalBaseModal>

    <!-- Modal View Salary -->
    <ModalBaseModal v-model="isViewModalOpen" title="View Employee Salary" size="md">
      <div v-if="viewingRecord" class="space-y-4 text-sm">
        <div class="grid grid-cols-2 gap-2 text-xs">
          <div class="font-semibold text-gray-500">Employee</div>
          <div class="font-bold text-gray-900 dark:text-gray-100">{{ viewingRecord.name }} ({{ viewingRecord.employeeId }})</div>

          <div class="font-semibold text-gray-500">Salary</div>
          <div class="font-mono text-gray-900 dark:text-gray-100">{{ formatRupiah(viewingRecord.salary) }}</div>

          <div class="font-semibold text-gray-500">System</div>
          <div>{{ viewingRecord.system }}</div>

          <div class="font-semibold text-gray-500">Overtime Rate</div>
          <div class="font-mono">{{ formatRupiah(viewingRecord.overtimeRate) }}/hr</div>

          <div class="font-semibold text-gray-500">Status</div>
          <div>{{ viewingRecord.status }}</div>
        </div>

        <div class="border-t border-gray-200 pt-3 dark:border-gray-800">
          <h6 class="text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">Allowances:</h6>
          <div class="space-y-1.5 text-xs">
            <div
              v-for="a in viewingRecord.allowances"
              :key="a.id"
              class="flex items-center justify-between rounded bg-gray-50 px-2.5 py-1.5 dark:bg-gray-800"
            >
              <span>{{ a.name }}</span>
              <span class="font-mono font-medium">{{ formatRupiah(a.amount) }}</span>
            </div>
            <div class="flex items-center justify-between border-t border-gray-200 pt-1.5 font-bold">
              <span>Total Allowance:</span>
              <span class="font-mono text-primary">{{ formatRupiah(viewingRecord.allowanceTotal) }}</span>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end">
          <button
            type="button"
            class="rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
            @click="isViewModalOpen = false"
          >
            Close
          </button>
        </div>
      </template>
    </ModalBaseModal>
  </div>
</template>
