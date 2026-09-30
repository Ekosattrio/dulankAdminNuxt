<script setup lang="ts">const { data: unitData } = await useFetch<UnitItem[]>('/api/unit')
const units = ref<UnitItem[]>(unitData.value ?? [])
useMockSync('unit', units);

const searchQuery = ref("");
const selectedStatus = ref("");

const filteredUnits = computed(() => {
  return units.value.filter((u) => {
    const matchSearch =
      !searchQuery.value ||
      u.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      u.shortName.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchStatus = !selectedStatus.value || u.status === selectedStatus.value;
    return matchSearch && matchStatus;
  });
});

const columns = [
  { key: "name", label: "Unit" },
  { key: "shortName", label: "Short name" },
  { key: "itemUsed", label: "Item Used" },
  { key: "createdOn", label: "Created On" },
  { key: "status", label: "Status" },
  { key: "action", label: "Action", class: "text-end no-sort" },
];

// Add Modal
const isAddModalOpen = ref(false);
const addName = ref("");
const addShortName = ref("");

const submitAdd = () => {
  if (!addName.value.trim() || !addShortName.value.trim()) return;
  units.value.push({
    id: String(Date.now()),
    name: addName.value.trim(),
    shortName: addShortName.value.trim(),
    itemUsed: 0,
    createdOn: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
    status: "Active",
  });
  addName.value = "";
  addShortName.value = "";
  isAddModalOpen.value = false;
};

// Edit Modal
const isEditModalOpen = ref(false);
const editingUnit = ref<UnitItem | null>(null);
const editName = ref("");
const editShortName = ref("");
const editStatus = ref<"Active" | "Deactive">("Active");

const openEditModal = (u: UnitItem) => {
  editingUnit.value = u;
  editName.value = u.name;
  editShortName.value = u.shortName;
  editStatus.value = u.status;
  isEditModalOpen.value = true;
};

const submitEdit = () => {
  if (!editingUnit.value || !editName.value.trim()) return;
  editingUnit.value.name = editName.value.trim();
  editingUnit.value.shortName = editShortName.value.trim();
  editingUnit.value.status = editStatus.value;
  isEditModalOpen.value = false;
};

const deleteUnit = (id: string) => {
  if (confirm("Are you sure you want to delete this unit?")) {
    units.value = units.value.filter((u) => u.id !== id);
  }
};</script>

<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <CommonPageHeader title="Units" subtitle="Manage your units">
      <template #actions>
        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-600 focus:outline-none"
          @click="isAddModalOpen = true"
        >
          <CommonFeatherIcon name="plus-circle" size="18" />
          <span>Add New Unit</span>
        </button>
      </template>
    </CommonPageHeader>

    <!-- Table Card -->
    <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="mb-5 flex flex-wrap items-center justify-between gap-4">
        <CommonSearchFilter v-model="searchQuery" placeholder="Search unit..." />

        <CommonFilterSelect v-model="selectedStatus" :options="[{ value: 'Active', label: 'Active' }, { value: 'Deactive', label: 'Deactive' }]" />
      </div>

      <TablesDataTable :columns="columns" :items="filteredUnits">
        <template #cell(name)="{ item }">
          <span class="font-semibold text-gray-900 dark:text-gray-100">{{ item.name }}</span>
        </template>

        <template #cell(shortName)="{ item }">
          <span class="font-mono text-xs font-bold text-primary">{{ item.shortName }}</span>
        </template>

        <template #cell(itemUsed)="{ item }">
          <span class="font-medium text-gray-800 dark:text-gray-200">{{ item.itemUsed }}</span>
        </template>

        <template #cell(createdOn)="{ item }">
          <span class="text-xs text-gray-500">{{ item.createdOn }}</span>
        </template>

        <template #cell(status)="{ item }">
          <CommonStatusPill :status="item.status" />
        </template>

        <template #cell(action)="{ item }">
          <CommonRowActions :item="item" @edit="openEditModal(item)" @delete="deleteUnit(item.id)" />
        </template>
      </TablesDataTable>
    </div>

    <!-- Modal Add Unit -->
    <CommonBaseModal v-model="isAddModalOpen" title="Add New Unit" maxWidth="md">
      <form @submit.prevent="submitAdd" class="space-y-4">
        <div>
          <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Unit Name</label>
          <input
            v-model="addName"
            type="text"
            required
            placeholder="e.g. Meter"
            class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          />
        </div>

        <div>
          <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Short Name</label>
          <input
            v-model="addShortName"
            type="text"
            required
            placeholder="e.g. m"
            class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 font-mono text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          />
        </div>

        <CommonModalFooter submitLabel="Submit" @cancel="isAddModalOpen = false" />
      </form>
    </CommonBaseModal>

    <!-- Modal Edit Unit -->
    <CommonBaseModal v-model="isEditModalOpen" title="Edit Unit" maxWidth="md">
      <form @submit.prevent="submitEdit" class="space-y-4">
        <div>
          <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Unit Name</label>
          <input
            v-model="editName"
            type="text"
            required
            class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          />
        </div>

        <div>
          <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Short Name</label>
          <input
            v-model="editShortName"
            type="text"
            required
            class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 font-mono text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          />
        </div>

        <div>
          <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Status</label>
          <select
            v-model="editStatus"
            class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          >
            <option value="Active">Active</option>
            <option value="Deactive">Deactive</option>
          </select>
        </div>

        <CommonModalFooter submitLabel="Save Changes" @cancel="isEditModalOpen = false" />
      </form>
    </CommonBaseModal>
  </div>
</template>
