<script setup lang="ts">
interface DesignationItem {
  id: string;
  name: string;
  members: string[];
  createdOn: string;
  totalMembers: number;
  status: "Active" | "Inactive";
}

const designations = ref<DesignationItem[]>([
  {
    id: "DS01",
    name: "Designer",
    members: ["user-08.jpg", "user-13.jpg", "user-09.jpg", "user-11.jpg"],
    createdOn: "13 August 2023",
    totalMembers: 4,
    status: "Active",
  },
  {
    id: "DS02",
    name: "Database administrator",
    members: ["user-11.jpg", "user-07.jpg", "user-02.jpg", "user-11.jpg"],
    createdOn: "24 August 2023",
    totalMembers: 4,
    status: "Active",
  },
  {
    id: "DS03",
    name: "Curator",
    members: ["user-05.jpg", "user-06.jpg", "user-12.jpg"],
    createdOn: "07 September 2023",
    totalMembers: 3,
    status: "Active",
  },
  {
    id: "DS04",
    name: "System Administrator",
    members: ["user-01.jpg", "user-03.jpg"],
    createdOn: "21 September 2023",
    totalMembers: 2,
    status: "Active",
  },
  {
    id: "DS05",
    name: "Administrative Officer",
    members: ["user-04.jpg", "user-10.jpg", "user-13.jpg"],
    createdOn: "15 October 2023",
    totalMembers: 3,
    status: "Active",
  },
]);

const searchQuery = ref("");
const selectedStatus = ref("");

const filteredDesignations = computed(() => {
  return designations.value.filter((d) => {
    const matchQuery = !searchQuery.value || d.name.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchStatus = !selectedStatus.value || d.status === selectedStatus.value;
    return matchQuery && matchStatus;
  });
});

const columns = [
  { key: "name", label: "Designation" },
  { key: "members", label: "Members" },
  { key: "createdOn", label: "Created On" },
  { key: "totalMembers", label: "Total Members" },
  { key: "status", label: "Status" },
  { key: "action", label: "Action", class: "text-end no-sort" },
];

// Add Modal
const isAddModalOpen = ref(false);
const newName = ref("");
const newStatus = ref(true);

const addDesignation = () => {
  if (!newName.value.trim()) return;
  designations.value.push({
    id: `DS0${designations.value.length + 1}`,
    name: newName.value.trim(),
    members: ["user-01.jpg"],
    createdOn: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }),
    totalMembers: 1,
    status: newStatus.value ? "Active" : "Inactive",
  });
  newName.value = "";
  newStatus.value = true;
  isAddModalOpen.value = false;
};

// Edit Modal
const isEditModalOpen = ref(false);
const editingItem = ref<DesignationItem | null>(null);
const editName = ref("");
const editStatus = ref(true);

const openEditModal = (item: DesignationItem) => {
  editingItem.value = item;
  editName.value = item.name;
  editStatus.value = item.status === "Active";
  isEditModalOpen.value = true;
};

const saveEdit = () => {
  if (!editingItem.value || !editName.value.trim()) return;
  editingItem.value.name = editName.value.trim();
  editingItem.value.status = editStatus.value ? "Active" : "Inactive";
  isEditModalOpen.value = false;
};

const deleteItem = (id: string) => {
  if (confirm("Are you sure you want to delete this designation?")) {
    designations.value = designations.value.filter((d) => d.id !== id);
  }
};
</script>

<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <CommonPageHeader title="Designation" subtitle="Manage your designation">
      <template #actions>
        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-600 focus:outline-none"
          @click="isAddModalOpen = true"
        >
          <FeatherIcon name="plus-circle" size="18" />
          <span>Add New Designation</span>
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
            placeholder="Search designation..."
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
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      <!-- Table -->
      <TableDataTable :columns="columns" :rows="filteredDesignations">
        <template #cell(name)="{ row }">
          <span class="font-semibold text-gray-900 dark:text-gray-100">{{ row.name }}</span>
        </template>

        <template #cell(members)="{ row }">
          <div class="flex -space-x-2 overflow-hidden">
            <img
              v-for="(img, idx) in row.members"
              :key="idx"
              :src="`/assets/img/users/${img}`"
              alt="Avatar"
              class="inline-block h-7 w-7 rounded-full ring-2 ring-white dark:ring-gray-900 object-cover"
              onerror="this.src = '/assets/img/profiles/avatar-01.jpg'"
            />
          </div>
        </template>

        <template #cell(createdOn)="{ row }">
          <span class="text-xs text-gray-600 dark:text-gray-400">{{ row.createdOn }}</span>
        </template>

        <template #cell(totalMembers)="{ row }">
          <span class="font-medium text-gray-800 dark:text-gray-200">{{ row.totalMembers }}</span>
        </template>

        <template #cell(status)="{ row }">
          <span
            :class="[
              'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
              row.status === 'Active'
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300',
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

    <!-- Modal Add Designation -->
    <ModalBaseModal v-model="isAddModalOpen" title="Add Designation" size="md">
      <form @submit.prevent="addDesignation" class="space-y-4">
        <div>
          <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Designation Name</label>
          <input
            v-model="newName"
            type="text"
            required
            placeholder="e.g. Graphic Designer"
            class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          />
        </div>

        <div class="flex items-center justify-between rounded-lg border border-gray-100 p-3 dark:border-gray-800">
          <span class="text-xs font-semibold text-gray-700 dark:text-gray-300">
            Status:
            <span :class="newStatus ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'">{{
              newStatus ? "Active" : "Inactive"
            }}</span>
          </span>
          <button
            type="button"
            :class="[
              'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none',
              newStatus ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-700',
            ]"
            @click="newStatus = !newStatus"
          >
            <span
              :class="[
                'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                newStatus ? 'translate-x-5' : 'translate-x-0',
              ]"
            />
          </button>
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

    <!-- Modal Edit Designation -->
    <ModalBaseModal v-model="isEditModalOpen" title="Edit Designation" size="md">
      <form @submit.prevent="saveEdit" class="space-y-4">
        <div>
          <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Designation Name</label>
          <input
            v-model="editName"
            type="text"
            required
            class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          />
        </div>

        <div class="flex items-center justify-between rounded-lg border border-gray-100 p-3 dark:border-gray-800">
          <span class="text-xs font-semibold text-gray-700 dark:text-gray-300">
            Status:
            <span :class="editStatus ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'">{{
              editStatus ? "Active" : "Inactive"
            }}</span>
          </span>
          <button
            type="button"
            :class="[
              'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none',
              editStatus ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-700',
            ]"
            @click="editStatus = !editStatus"
          >
            <span
              :class="[
                'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                editStatus ? 'translate-x-5' : 'translate-x-0',
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
