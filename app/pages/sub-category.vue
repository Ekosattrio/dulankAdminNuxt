<script setup lang="ts">
interface SubCategoryItem {
  id: string;
  name: string;
  category: string;
  categoryCode: string;
  description: string;
  itemUsed: number;
  createdBy: string;
  status: "Active" | "Deactive";
}

const subCategories = ref<SubCategoryItem[]>([
  {
    id: "1",
    name: "Print Outdoor",
    category: "Large Format",
    categoryCode: "CAT-LF",
    description: "Spanduk, banner, baliho outdoor",
    itemUsed: 12,
    createdBy: "Admin",
    status: "Active",
  },
  {
    id: "2",
    name: "Cetak A3+",
    category: "Digital Print",
    categoryCode: "CAT-DP",
    description: "Print lembaran A3+ bahan art paper, linen, dll",
    itemUsed: 25,
    createdBy: "Admin",
    status: "Active",
  },
  {
    id: "3",
    name: "Brosur",
    category: "Offset Print",
    categoryCode: "CAT-OP",
    description: "Brosur lipat 2, lipat 3, flyer promo",
    itemUsed: 8,
    createdBy: "Budi",
    status: "Active",
  },
  {
    id: "4",
    name: "Sticker & Label",
    category: "Digital Print",
    categoryCode: "CAT-DP",
    description: "Sticker vinyl, cromo, bontax, transparan",
    itemUsed: 18,
    createdBy: "Admin",
    status: "Active",
  },
  {
    id: "5",
    name: "Kalender",
    category: "Finishing & Merchandise",
    categoryCode: "CAT-FM",
    description: "Kalender dinding, kalender meja spiral",
    itemUsed: 6,
    createdBy: "Admin",
    status: "Active",
  },
]);

const searchQuery = ref("");
const selectedCategory = ref("");

const filteredList = computed(() => {
  return subCategories.value.filter((s) => {
    const matchSearch =
      !searchQuery.value ||
      s.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchCat = !selectedCategory.value || s.category === selectedCategory.value;
    return matchSearch && matchCat;
  });
});

const columns = [
  { key: "name", label: "Sub Category" },
  { key: "category", label: "Category" },
  { key: "categoryCode", label: "Category Code" },
  { key: "description", label: "Description" },
  { key: "itemUsed", label: "Item Used" },
  { key: "createdBy", label: "Created By" },
  { key: "action", label: "Action", class: "text-end no-sort" },
];

// Modal Add
const isAddModalOpen = ref(false);
const addForm = reactive({
  name: "",
  category: "Large Format",
  description: "",
});

const submitAdd = () => {
  if (!addForm.name.trim()) return;
  subCategories.value.push({
    id: String(Date.now()),
    name: addForm.name.trim(),
    category: addForm.category,
    categoryCode: "CAT-GEN",
    description: addForm.description,
    itemUsed: 0,
    createdBy: "Admin",
    status: "Active",
  });
  addForm.name = "";
  addForm.description = "";
  isAddModalOpen.value = false;
};

// Modal Edit
const isEditModalOpen = ref(false);
const editingItem = ref<SubCategoryItem | null>(null);
const editForm = reactive({
  name: "",
  category: "",
  description: "",
});

const openEditModal = (item: SubCategoryItem) => {
  editingItem.value = item;
  editForm.name = item.name;
  editForm.category = item.category;
  editForm.description = item.description;
  isEditModalOpen.value = true;
};

const submitEdit = () => {
  if (!editingItem.value || !editForm.name.trim()) return;
  editingItem.value.name = editForm.name.trim();
  editingItem.value.category = editForm.category;
  editingItem.value.description = editForm.description;
  isEditModalOpen.value = false;
};

const deleteItem = (id: string) => {
  if (confirm("Are you sure you want to delete this sub-category?")) {
    subCategories.value = subCategories.value.filter((s) => s.id !== id);
  }
};
</script>

<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <CommonPageHeader title="Sub Category list" subtitle="Manage your subcategories">
      <template #actions>
        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-600 focus:outline-none"
          @click="isAddModalOpen = true"
        >
          <FeatherIcon name="plus-circle" size="18" />
          <span>Add Sub Category</span>
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
            placeholder="Search sub category..."
            class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 pe-8 text-sm text-gray-800 placeholder-gray-400 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          />
          <span class="pointer-events-none absolute inset-y-0 end-0 flex items-center pe-2.5 text-gray-400">
            <FeatherIcon name="search" size="16" />
          </span>
        </div>

        <div class="flex items-center gap-3">
          <select
            v-model="selectedCategory"
            class="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          >
            <option value="">Category: All</option>
            <option value="Large Format">Large Format</option>
            <option value="Digital Print">Digital Print</option>
            <option value="Offset Print">Offset Print</option>
            <option value="Finishing & Merchandise">Finishing & Merchandise</option>
          </select>
        </div>
      </div>

      <TableDataTable :columns="columns" :rows="filteredList">
        <template #cell(name)="{ row }">
          <span class="font-semibold text-gray-900 dark:text-gray-100">{{ row.name }}</span>
        </template>

        <template #cell(category)="{ row }">
          <span
            class="inline-flex rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300"
          >
            {{ row.category }}
          </span>
        </template>

        <template #cell(categoryCode)="{ row }">
          <span class="font-mono text-xs text-gray-500">{{ row.categoryCode }}</span>
        </template>

        <template #cell(description)="{ row }">
          <span class="text-xs text-gray-600 dark:text-gray-400">{{ row.description }}</span>
        </template>

        <template #cell(itemUsed)="{ row }">
          <span class="font-medium text-gray-800 dark:text-gray-200">{{ row.itemUsed }}</span>
        </template>

        <template #cell(createdBy)="{ row }">
          <span class="text-xs text-gray-500">{{ row.createdBy }}</span>
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

    <!-- Modal Add Sub Category -->
    <ModalBaseModal v-model="isAddModalOpen" title="Add Sub Category" size="md">
      <form @submit.prevent="submitAdd" class="space-y-4">
        <div>
          <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Sub Category Name</label>
          <input
            v-model="addForm.name"
            type="text"
            required
            placeholder="e.g. Cetak A3+"
            class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          />
        </div>

        <div>
          <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Parent Category</label>
          <select
            v-model="addForm.category"
            class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          >
            <option value="Large Format">Large Format</option>
            <option value="Digital Print">Digital Print</option>
            <option value="Offset Print">Offset Print</option>
            <option value="Finishing & Merchandise">Finishing & Merchandise</option>
          </select>
        </div>

        <div>
          <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Description</label>
          <textarea
            v-model="addForm.description"
            rows="2"
            class="w-full rounded-lg border border-gray-200 bg-white p-2.5 text-xs text-gray-800 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          ></textarea>
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

    <!-- Modal Edit Sub Category -->
    <ModalBaseModal v-model="isEditModalOpen" title="Edit Sub Category" size="md">
      <form @submit.prevent="submitEdit" class="space-y-4">
        <div>
          <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Sub Category Name</label>
          <input
            v-model="editForm.name"
            type="text"
            required
            class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          />
        </div>

        <div>
          <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Parent Category</label>
          <select
            v-model="editForm.category"
            class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          >
            <option value="Large Format">Large Format</option>
            <option value="Digital Print">Digital Print</option>
            <option value="Offset Print">Offset Print</option>
            <option value="Finishing & Merchandise">Finishing & Merchandise</option>
          </select>
        </div>

        <div>
          <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Description</label>
          <textarea
            v-model="editForm.description"
            rows="2"
            class="w-full rounded-lg border border-gray-200 bg-white p-2.5 text-xs text-gray-800 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          ></textarea>
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
