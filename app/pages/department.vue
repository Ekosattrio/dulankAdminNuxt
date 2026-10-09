<<<<<<< HEAD
<script setup lang="ts">const { data: departmentData } = await useFetch<DepartmentItem[]>('/api/department')
const departments = ref<DepartmentItem[]>(departmentData.value ?? [])
useMockSync('department', departments);

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
};</script>

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
          <CommonFeatherIcon name="plus-circle" size="18" />
          <span>Add New Department</span>
        </button>
      </template>
    </CommonPageHeader>

    <!-- Table Card -->
    <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <!-- Filter Bar -->
      <div class="mb-5 flex flex-wrap items-center justify-between gap-4">
        <CommonSearchFilter v-model="searchQuery" placeholder="Search department..." />

        <CommonFilterSelect v-model="selectedStatus" :options="[{ value: 'Active', label: 'Active' }, { value: 'Disable', label: 'Disable' }]" />
      </div>

      <!-- Table -->
      <TablesDataTable :columns="columns" :items="filteredDepartments">
        <template #cell(name)="{ item }">
          <span class="font-semibold text-gray-900 dark:text-gray-100">{{ item.name }}</span>
        </template>

        <template #cell(members)="{ item }">
          <div v-if="item.members.length > 0" class="flex flex-wrap gap-1.5">
            <span
              v-for="m in item.members"
              :key="m"
              class="inline-flex rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-700 dark:bg-gray-800 dark:text-gray-300"
            >
              {{ m }}
            </span>
          </div>
          <span v-else class="text-xs text-gray-400">-</span>
        </template>

        <template #cell(totalMembers)="{ item }">
          <span class="font-medium text-gray-800 dark:text-gray-200">{{ item.totalMembers }}</span>
        </template>

        <template #cell(createdDate)="{ item }">
          <span class="text-xs text-gray-500 dark:text-gray-400">{{ item.createdDate }}</span>
        </template>

        <template #cell(status)="{ item }">
          <CommonStatusPill :status="item.status" />
        </template>

        <template #cell(action)="{ item }">
          <CommonRowActions :item="item" @edit="openEditModal(item)" @delete="deleteDepartment(item.id)" />
        </template>
      </TablesDataTable>
    </div>

    <!-- Modal Add Department -->
    <CommonBaseModal v-model="isAddModalOpen" title="Add New Department" maxWidth="md">
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

        <CommonModalFooter submitLabel="Submit" @cancel="isAddModalOpen = false" />
      </form>
    </CommonBaseModal>

    <!-- Modal Edit Department -->
    <CommonBaseModal v-model="isEditModalOpen" title="Edit Department" maxWidth="md">
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

        <CommonModalFooter submitLabel="Submit" @cancel="isEditModalOpen = false" />
      </form>
    </CommonBaseModal>
=======
<script setup lang="ts">
import DepartmentWorkspace from '~/components/pages/department/DepartmentWorkspace.vue'

useLegacyPage({ title: 'Departments - Departemen Karyawan', sweetAlert: false })
</script>

<template>
  <div class="dulank-page dulank-page-department">
    <DepartmentWorkspace />
>>>>>>> origin/eko
  </div>
</template>
