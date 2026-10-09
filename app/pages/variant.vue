<<<<<<< HEAD
<script setup lang="ts">const { data: variantData } = await useFetch<VariantItem[]>('/api/variant')
const variants = ref<VariantItem[]>(variantData.value ?? [])
useMockSync('variant', variants);

const searchQuery = ref("");
const selectedStatus = ref("");

const filteredVariants = computed(() => {
  return variants.value.filter((v) => {
    const matchSearch =
      !searchQuery.value ||
      v.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      v.values.some((val) => val.toLowerCase().includes(searchQuery.value.toLowerCase()));
    const matchStatus = !selectedStatus.value || v.status === selectedStatus.value;
    return matchSearch && matchStatus;
  });
});

const columns = [
  { key: "name", label: "Variant" },
  { key: "values", label: "Values" },
  { key: "itemUsed", label: "Item Used" },
  { key: "createdOn", label: "Created On" },
  { key: "status", label: "Status" },
  { key: "action", label: "Action", class: "text-end no-sort" },
];

// Modal Add
const isAddModalOpen = ref(false);
const addName = ref("");
const addValueInput = ref("");
const addValues = ref<string[]>([]);

const addValueTag = () => {
  if (addValueInput.value.trim() && !addValues.value.includes(addValueInput.value.trim())) {
    addValues.value.push(addValueInput.value.trim());
    addValueInput.value = "";
  }
};

const removeValueTag = (val: string) => {
  addValues.value = addValues.value.filter((v) => v !== val);
};

const submitAdd = () => {
  if (!addName.value.trim() || addValues.value.length === 0) {
    alert("Please enter variant name and at least one value");
    return;
  }
  variants.value.push({
    id: String(Date.now()),
    name: addName.value.trim(),
    values: [...addValues.value],
    itemUsed: 0,
    createdOn: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
    status: "Active",
  });
  addName.value = "";
  addValues.value = [];
  isAddModalOpen.value = false;
};

// Modal Edit
const isEditModalOpen = ref(false);
const editingItem = ref<VariantItem | null>(null);
const editName = ref("");
const editValueInput = ref("");
const editValues = ref<string[]>([]);
const editStatus = ref<"Active" | "Deactive">("Active");

const openEditModal = (v: VariantItem) => {
  editingItem.value = v;
  editName.value = v.name;
  editValues.value = [...v.values];
  editStatus.value = v.status;
  isEditModalOpen.value = true;
};

const addEditValueTag = () => {
  if (editValueInput.value.trim() && !editValues.value.includes(editValueInput.value.trim())) {
    editValues.value.push(editValueInput.value.trim());
    editValueInput.value = "";
  }
};

const removeEditValueTag = (val: string) => {
  editValues.value = editValues.value.filter((v) => v !== val);
};

const submitEdit = () => {
  if (!editingItem.value || !editName.value.trim()) return;
  editingItem.value.name = editName.value.trim();
  editingItem.value.values = [...editValues.value];
  editingItem.value.status = editStatus.value;
  isEditModalOpen.value = false;
};

const deleteItem = (id: string) => {
  if (confirm("Are you sure you want to delete this variant attribute?")) {
    variants.value = variants.value.filter((v) => v.id !== id);
  }
};</script>

<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <CommonPageHeader title="Variant Attributes" subtitle="Manage your variant attributes">
      <template #actions>
        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-600 focus:outline-none"
          @click="isAddModalOpen = true"
        >
          <CommonFeatherIcon name="plus-circle" size="18" />
          <span>Add New Variant</span>
        </button>
      </template>
    </CommonPageHeader>

    <!-- Table Card -->
    <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="mb-5 flex flex-wrap items-center justify-between gap-4">
        <CommonSearchFilter v-model="searchQuery" placeholder="Search variant..." />

        <CommonFilterSelect v-model="selectedStatus" :options="[{ value: 'Active', label: 'Active' }, { value: 'Deactive', label: 'Deactive' }]" />
      </div>

      <TablesDataTable :columns="columns" :items="filteredVariants">
        <template #cell(name)="{ item }">
          <span class="font-semibold text-gray-900 dark:text-gray-100">{{ item.name }}</span>
        </template>

        <template #cell(values)="{ item }">
          <div class="flex flex-wrap gap-1">
            <span
              v-for="val in item.values"
              :key="val"
              class="inline-flex rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-700 dark:bg-gray-800 dark:text-gray-300"
            >
              {{ val }}
            </span>
          </div>
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
          <CommonRowActions :item="item" @edit="openEditModal(item)" @delete="deleteItem(item.id)" />
        </template>
      </TablesDataTable>
    </div>

    <!-- Modal Add Variant -->
    <CommonBaseModal v-model="isAddModalOpen" title="Add New Variant" maxWidth="md">
      <form @submit.prevent="submitAdd" class="space-y-4">
        <div>
          <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Variant Name</label>
          <input
            v-model="addName"
            type="text"
            required
            placeholder="e.g. Size"
            class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          />
        </div>

        <div>
          <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Variant Values</label>
          <div class="flex gap-2">
            <input
              v-model="addValueInput"
              type="text"
              placeholder="e.g. XL"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              @keydown.enter.prevent="addValueTag"
            />
            <button
              type="button"
              class="rounded-lg bg-gray-100 px-3 text-xs font-semibold text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
              @click="addValueTag"
            >
              Add
            </button>
          </div>

          <div class="flex flex-wrap gap-1.5 mt-2">
            <span
              v-for="val in addValues"
              :key="val"
              class="inline-flex items-center gap-1 rounded bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
            >
              {{ val }}
              <button type="button" class="hover:text-rose-500" @click="removeValueTag(val)">&times;</button>
            </span>
          </div>
        </div>

        <CommonModalFooter submitLabel="Submit" @cancel="isAddModalOpen = false" />
      </form>
    </CommonBaseModal>

    <!-- Modal Edit Variant -->
    <CommonBaseModal v-model="isEditModalOpen" title="Edit Variant" maxWidth="md">
      <form @submit.prevent="submitEdit" class="space-y-4">
        <div>
          <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Variant Name</label>
          <input
            v-model="editName"
            type="text"
            required
            class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          />
        </div>

        <div>
          <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Variant Values</label>
          <div class="flex gap-2">
            <input
              v-model="editValueInput"
              type="text"
              placeholder="e.g. Red"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              @keydown.enter.prevent="addEditValueTag"
            />
            <button
              type="button"
              class="rounded-lg bg-gray-100 px-3 text-xs font-semibold text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
              @click="addEditValueTag"
            >
              Add
            </button>
          </div>

          <div class="flex flex-wrap gap-1.5 mt-2">
            <span
              v-for="val in editValues"
              :key="val"
              class="inline-flex items-center gap-1 rounded bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
            >
              {{ val }}
              <button type="button" class="hover:text-rose-500" @click="removeEditValueTag(val)">&times;</button>
            </span>
          </div>
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
=======
<script setup lang="ts">
import VariantWorkspace from '~/components/variant/VariantWorkspace.vue'

definePageMeta({
  layout: 'default'
})

useLegacyPage({
  title: 'Variant',
  styles: ['/assets/css/style.css'],
  scripts: ['/assets/js/theme-script.js'],
  sweetAlert: true
})
</script>

<template>
  <div class="dulank-page dulank-page-variant">
    <VariantWorkspace />
>>>>>>> origin/eko
  </div>
</template>
