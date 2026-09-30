<script setup lang="ts">const { data: designationData } = await useFetch<DesignationItem[]>('/api/designation')
const designations = ref<DesignationItem[]>(designationData.value ?? [])
useMockSync('designation', designations);

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
};</script>

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
          <CommonFeatherIcon name="plus-circle" size="18" />
          <span>Add New Designation</span>
        </button>
      </template>
    </CommonPageHeader>

    <!-- Table Card -->
    <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <!-- Filter Bar -->
      <div class="mb-5 flex flex-wrap items-center justify-between gap-4">
        <CommonSearchFilter v-model="searchQuery" placeholder="Search designation..." />

        <CommonFilterSelect v-model="selectedStatus" :options="[{ value: 'Active', label: 'Active' }, { value: 'Inactive', label: 'Inactive' }]" />
      </div>

      <!-- Table -->
      <TablesDataTable :columns="columns" :items="filteredDesignations">
        <template #cell(name)="{ item }">
          <span class="font-semibold text-gray-900 dark:text-gray-100">{{ item.name }}</span>
        </template>

        <template #cell(members)="{ item }">
          <div class="flex -space-x-2 overflow-hidden">
            <img
              v-for="(img, idx) in item.members"
              :key="idx"
              :src="`/assets/img/users/${img}`"
              alt="Avatar"
              class="inline-block h-7 w-7 rounded-full ring-2 ring-white dark:ring-gray-900 object-cover"
              onerror="this.src = '/assets/img/profiles/avatar-01.jpg'"
            />
          </div>
        </template>

        <template #cell(createdOn)="{ item }">
          <span class="text-xs text-gray-600 dark:text-gray-400">{{ item.createdOn }}</span>
        </template>

        <template #cell(totalMembers)="{ item }">
          <span class="font-medium text-gray-800 dark:text-gray-200">{{ item.totalMembers }}</span>
        </template>

        <template #cell(status)="{ item }">
          <CommonStatusPill :status="item.status" />
        </template>

        <template #cell(action)="{ item }">
          <CommonRowActions :item="item" @edit="openEditModal(item)" @delete="deleteItem(item.id)" />
        </template>
      </TablesDataTable>
    </div>

    <!-- Modal Add Designation -->
    <CommonBaseModal v-model="isAddModalOpen" title="Add Designation" maxWidth="md">
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

        <CommonModalFooter submitLabel="Submit" @cancel="isAddModalOpen = false" />
      </form>
    </CommonBaseModal>

    <!-- Modal Edit Designation -->
    <CommonBaseModal v-model="isEditModalOpen" title="Edit Designation" maxWidth="md">
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

        <CommonModalFooter submitLabel="Submit" @cancel="isEditModalOpen = false" />
      </form>
    </CommonBaseModal>
  </div>
</template>
