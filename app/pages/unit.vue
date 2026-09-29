<script setup lang="ts">
interface UnitItem {
  id: string;
  name: string;
  shortName: string;
  itemUsed: number;
  createdOn: string;
  status: "Active" | "Deactive";
}

const units = ref<UnitItem[]>([
  { id: "1", name: "Meter", shortName: "m", itemUsed: 14, createdOn: "25 May 2023", status: "Active" },
  { id: "2", name: "Box", shortName: "bx", itemUsed: 8, createdOn: "24 May 2023", status: "Active" },
  { id: "3", name: "Rim", shortName: "rm", itemUsed: 12, createdOn: "23 May 2023", status: "Active" },
  { id: "4", name: "Piece", shortName: "pcs", itemUsed: 35, createdOn: "22 May 2023", status: "Active" },
  { id: "5", name: "Buku", shortName: "bk", itemUsed: 10, createdOn: "21 May 2023", status: "Active" },
  { id: "6", name: "Lembar", shortName: "lbr", itemUsed: 40, createdOn: "20 May 2023", status: "Active" },
  { id: "7", name: "Kilogram", shortName: "kg", itemUsed: 5, createdOn: "18 May 2023", status: "Active" },
]);

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
};
</script>

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
          <FeatherIcon name="plus-circle" size="18" />
          <span>Add New Unit</span>
        </button>
      </template>
    </CommonPageHeader>

    <!-- Table Card -->
    <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div class="relative w-64">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search unit..."
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
            <option value="Deactive">Deactive</option>
          </select>
        </div>
      </div>

      <TableDataTable :columns="columns" :rows="filteredUnits">
        <template #cell(name)="{ row }">
          <span class="font-semibold text-gray-900 dark:text-gray-100">{{ row.name }}</span>
        </template>

        <template #cell(shortName)="{ row }">
          <span class="font-mono text-xs font-bold text-primary">{{ row.shortName }}</span>
        </template>

        <template #cell(itemUsed)="{ row }">
          <span class="font-medium text-gray-800 dark:text-gray-200">{{ row.itemUsed }}</span>
        </template>

        <template #cell(createdOn)="{ row }">
          <span class="text-xs text-gray-500">{{ row.createdOn }}</span>
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
              @click="deleteUnit(row.id)"
            >
              <FeatherIcon name="trash-2" size="16" />
            </button>
          </div>
        </template>
      </TableDataTable>
    </div>

    <!-- Modal Add Unit -->
    <ModalBaseModal v-model="isAddModalOpen" title="Add New Unit" size="md">
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

    <!-- Modal Edit Unit -->
    <ModalBaseModal v-model="isEditModalOpen" title="Edit Unit" size="md">
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
            Save Changes
          </button>
        </div>
      </form>
    </ModalBaseModal>
  </div>
</template>
