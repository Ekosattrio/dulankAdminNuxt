<script setup lang="ts">
interface DepartmentItem {
  id: string;
  name: string;
  members: string[];
  totalMembers: number;
  createdDate: string;
  status: "Active" | "Disable";
}

const departments = ref<DepartmentItem[]>([
  {
    id: "D01",
    name: "Produksi",
    members: ["Budi", "Dedi", "Hendra", "Fajar"],
    totalMembers: 4,
    createdDate: "01/01/2023",
    status: "Active",
  },
  {
    id: "D02",
    name: "Administrasi",
    members: ["Siti", "Larasati"],
    totalMembers: 2,
    createdDate: "01/01/2023",
    status: "Active",
  },
  {
    id: "D03",
    name: "Desain",
    members: ["Agus", "Andi"],
    totalMembers: 2,
    createdDate: "01/01/2023",
    status: "Active",
  },
  {
    id: "D04",
    name: "Marketing",
    members: ["Rina", "Maya"],
    totalMembers: 2,
    createdDate: "01/01/2023",
    status: "Active",
  },
  {
    id: "D05",
    name: "Research & Development",
    members: [],
    totalMembers: 0,
    createdDate: "10/02/2026",
    status: "Disable",
  },
]);

const searchQuery = ref("");
const selectedStatus = ref("");

const filteredDepartments = computed(() => {
  return departments.value.filter((d) => {
    const matchQuery =
      !searchQuery.value ||
      d.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      d.members.some((m) => m.toLowerCase().includes(searchQuery.value.toLowerCase()));
    const matchStatus = !selectedStatus.value || d.status === selectedStatus.value;
    return matchQuery && matchStatus;
  });
});

const columns = [
  { key: "name", label: "Department" },
  { key: "members", label: "Member" },
  { key: "totalMembers", label: "Total Member" },
  { key: "createdDate", label: "Created" },
  { key: "status", label: "Status" },
  { key: "action", label: "Action", class: "text-end no-sort" },
];

// Add Modal
const isAddModalOpen = ref(false);
const newDeptName = ref("");

const addDepartment = () => {
  if (!newDeptName.value.trim()) return;
  departments.value.push({
    id: `D0${departments.value.length + 1}`,
    name: newDeptName.value.trim(),
    members: [],
    totalMembers: 0,
    createdDate: new Date().toLocaleDateString("id-ID"),
    status: "Active",
  });
  newDeptName.value = "";
  isAddModalOpen.value = false;
};

// Edit Modal
const isEditModalOpen = ref(false);
const editingDept = ref<DepartmentItem | null>(null);
const editForm = reactive({
  name: "",
  members: [] as string[],
  status: "Active" as "Active" | "Disable",
});

const availableStaff = ["Budi", "Dedi", "Hendra", "Fajar", "Siti", "Larasati", "Agus", "Andi", "Rina", "Maya"];

const openEditModal = (dept: DepartmentItem) => {
  editingDept.value = dept;
  editForm.name = dept.name;
  editForm.members = [...dept.members];
  editForm.status = dept.status;
  isEditModalOpen.value = true;
};

const saveEditDepartment = () => {
  if (!editingDept.value || !editForm.name.trim()) return;
  editingDept.value.name = editForm.name.trim();
  editingDept.value.members = [...editForm.members];
  editingDept.value.totalMembers = editForm.members.length;
  editingDept.value.status = editForm.status;
  isEditModalOpen.value = false;
};

const toggleMember = (member: string) => {
  const index = editForm.members.indexOf(member);
  if (index > -1) {
    editForm.members.splice(index, 1);
  } else {
    editForm.members.push(member);
  }
};

const deleteDepartment = (id: string) => {
  if (confirm("Are you sure you want to delete this department?")) {
    departments.value = departments.value.filter((d) => d.id !== id);
  }
};
</script>

<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <CommonPageHeader title="Department" subtitle="Manage your Department">
      <template #actions>
        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-600 focus:outline-none"
          @click="isAddModalOpen = true"
        >
          <FeatherIcon name="plus-circle" size="18" />
          <span>Add New Department</span>
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
            placeholder="Search department..."
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
            <option value="Disable">Disable</option>
          </select>
        </div>
      </div>

      <!-- Table -->
      <TableDataTable :columns="columns" :rows="filteredDepartments">
        <template #cell(name)="{ row }">
          <span class="font-semibold text-gray-900 dark:text-gray-100">{{ row.name }}</span>
        </template>

        <template #cell(members)="{ row }">
          <div v-if="row.members.length > 0" class="flex flex-wrap gap-1.5">
            <span
              v-for="m in row.members"
              :key="m"
              class="inline-flex rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-700 dark:bg-gray-800 dark:text-gray-300"
            >
              {{ m }}
            </span>
          </div>
          <span v-else class="text-xs text-gray-400">-</span>
        </template>

        <template #cell(totalMembers)="{ row }">
          <span class="font-medium text-gray-800 dark:text-gray-200">{{ row.totalMembers }}</span>
        </template>

        <template #cell(createdDate)="{ row }">
          <span class="text-xs text-gray-500 dark:text-gray-400">{{ row.createdDate }}</span>
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
              @click="deleteDepartment(row.id)"
            >
              <FeatherIcon name="trash-2" size="16" />
            </button>
          </div>
        </template>
      </TableDataTable>
    </div>

    <!-- Modal Add Department -->
    <ModalBaseModal v-model="isAddModalOpen" title="Add New Department" size="md">
      <form @submit.prevent="addDepartment" class="space-y-4">
        <div>
          <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Department Name</label>
          <input
            v-model="newDeptName"
            type="text"
            required
            placeholder="e.g. Finance"
            class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          />
        </div>

        <div class="flex justify-end gap-3 pt-3 border-t border-gray-200 dark:border-gray-800">
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

    <!-- Modal Edit Department -->
    <ModalBaseModal v-model="isEditModalOpen" title="Edit Department" size="md">
      <form @submit.prevent="saveEditDepartment" class="space-y-4">
        <div>
          <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Department Name</label>
          <input
            v-model="editForm.name"
            type="text"
            required
            class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          />
        </div>

        <div>
          <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Add / Remove Member</label>
          <div class="flex flex-wrap gap-2 max-h-36 overflow-y-auto rounded-lg border border-gray-200 p-2.5 dark:border-gray-700">
            <button
              v-for="s in availableStaff"
              :key="s"
              type="button"
              :class="[
                'rounded-lg px-3 py-1 text-xs font-medium transition',
                editForm.members.includes(s)
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300',
              ]"
              @click="toggleMember(s)"
            >
              {{ s }} {{ editForm.members.includes(s) ? "✓" : "+" }}
            </button>
          </div>
        </div>

        <!-- Status toggle -->
        <div class="flex items-center justify-between rounded-lg border border-gray-100 p-3 dark:border-gray-800">
          <span class="text-xs font-semibold text-gray-700 dark:text-gray-300">
            Status:
            <span :class="editForm.status === 'Active' ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'">
              {{ editForm.status }}
            </span>
          </span>
          <button
            type="button"
            :class="[
              'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none',
              editForm.status === 'Active' ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-700',
            ]"
            @click="editForm.status = editForm.status === 'Active' ? 'Disable' : 'Active'"
          >
            <span
              :class="[
                'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                editForm.status === 'Active' ? 'translate-x-5' : 'translate-x-0',
              ]"
            />
          </button>
        </div>

        <div class="flex justify-end gap-3 pt-3 border-t border-gray-200 dark:border-gray-800">
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
            Submit
          </button>
        </div>
      </form>
    </ModalBaseModal>
  </div>
</template>
