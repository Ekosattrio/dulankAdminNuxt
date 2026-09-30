<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <CommonPageHeader title="Purchase Item" subtitle="Manage your purchase catalog items">
      <template #actions>
        <div class="flex flex-wrap items-center gap-2">
          <button
            type="button"
            class="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 hover:text-primary dark:border-gray-700 dark:hover:bg-gray-800"
            title="Print"
            @click="printList"
          >
            <CommonFeatherIcon name="printer" size="18" />
          </button>
          <button
            type="button"
            class="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 hover:text-primary dark:border-gray-700 dark:hover:bg-gray-800"
            title="Refresh"
            @click="refreshList"
          >
            <CommonFeatherIcon name="rotate-ccw" size="18" />
          </button>
          <button
            type="button"
            class="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-600 focus:outline-none"
            @click="openAddModal"
          >
            <CommonFeatherIcon name="plus" size="18" />
            <span>Add Purchase Item</span>
          </button>
        </div>
      </template>
    </CommonPageHeader>

    <!-- Purchase Items Card -->
    <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <!-- Toolbar -->
      <div class="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div class="flex flex-wrap items-center gap-3">
          <CommonSearchFilter v-model="searchQuery" placeholder="Search purchase item..." />
          <CommonFilterSelect
            v-model="categoryFilter"
            allLabel="All Categories"
            :options="[
              { value: 'Kertas & Bahan Baku Cetak', label: 'Kertas & Bahan Baku Cetak' },
              { value: 'Tinta & Toner', label: 'Tinta & Toner' },
              { value: 'Bahan Finishing & Jilid', label: 'Bahan Finishing & Jilid' },
              { value: 'Sparepart Mesin', label: 'Sparepart Mesin' },
            ]"
          />
        </div>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="w-full text-start text-xs text-gray-700 dark:text-gray-300">
          <thead
            class="bg-gray-50 text-[11px] font-semibold uppercase text-gray-500 border-b border-gray-200 dark:bg-gray-800/50 dark:border-gray-700 dark:text-gray-400"
          >
            <tr>
              <th class="px-4 py-3 text-start whitespace-nowrap">Category</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Product</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Description</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Merk</th>
              <th class="px-4 py-3 text-end whitespace-nowrap">Price (IDR)</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Unit</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Created</th>
              <th class="px-4 py-3 text-end whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <tr v-for="item in filteredItems" :key="item.id" class="transition-colors hover:bg-gray-50/75 dark:hover:bg-gray-800/40">
              <td class="px-4 py-3 whitespace-nowrap">{{ item.category }}</td>
              <td class="px-4 py-3 whitespace-nowrap font-bold text-gray-900 dark:text-gray-100">{{ item.product }}</td>
              <td class="max-w-[200px] truncate px-4 py-3 whitespace-nowrap text-gray-500 dark:text-gray-400">{{ item.description }}</td>
              <td class="px-4 py-3 whitespace-nowrap">{{ item.merk }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-end font-semibold">{{ formatNumber(item.price) }}</td>
              <td class="px-4 py-3 whitespace-nowrap">{{ item.unit }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-gray-500 dark:text-gray-400">{{ item.created }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-end">
                <CommonRowActions :item="item" show-view @view="viewItem(item)" @edit="openEditModal(item)" @delete="deleteItem(item)" />
              </td>
            </tr>
            <tr v-if="filteredItems.length === 0">
              <td colspan="8" class="p-8 text-center text-gray-400">No purchase items found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- View Item Modal -->
    <CommonBaseModal v-model="showViewModal" title="Purchase Item Detail" maxWidth="md">
      <div v-if="selectedItem" class="space-y-2.5 text-sm">
        <div class="flex justify-between"><span class="text-gray-500 dark:text-gray-400">Category</span><span class="text-gray-800 dark:text-gray-200">{{ selectedItem.category }}</span></div>
        <div class="flex justify-between"><span class="text-gray-500 dark:text-gray-400">Product Name</span><span class="text-gray-800 dark:text-gray-200">{{ selectedItem.product }}</span></div>
        <div class="flex justify-between"><span class="text-gray-500 dark:text-gray-400">Merk</span><span class="text-gray-800 dark:text-gray-200">{{ selectedItem.merk }}</span></div>
        <div class="flex justify-between"><span class="text-gray-500 dark:text-gray-400">Price</span><span class="text-gray-800 dark:text-gray-200">Rp {{ formatNumber(selectedItem.price) }} / {{ selectedItem.unit }}</span></div>
        <div class="flex justify-between"><span class="text-gray-500 dark:text-gray-400">Description</span><span class="text-gray-800 dark:text-gray-200">{{ selectedItem.description }}</span></div>
        <div class="flex justify-between"><span class="text-gray-500 dark:text-gray-400">Created</span><span class="text-gray-800 dark:text-gray-200">{{ selectedItem.created }}</span></div>
      </div>
      <template #footer>
        <div class="flex justify-end">
          <button
            type="button"
            class="rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
            @click="showViewModal = false"
          >
            Close
          </button>
        </div>
      </template>
    </CommonBaseModal>

    <!-- Add/Edit Purchase Item Modal -->
    <CommonBaseModal v-model="showModal" :title="isEdit ? 'Edit Purchase Item' : 'Add Purchase Item'" maxWidth="lg">
      <form @submit.prevent="saveItem" class="space-y-4">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <CommonFormField label="Category" required>
            <select
              v-model="formData.category"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              required
            >
              <option>Kertas & Bahan Baku Cetak</option>
              <option>Tinta & Toner</option>
              <option>Bahan Finishing & Jilid</option>
              <option>Sparepart Mesin</option>
            </select>
          </CommonFormField>
          <CommonFormField label="Product Name" required>
            <input
              v-model="formData.product"
              type="text"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              required
            />
          </CommonFormField>
        </div>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <CommonFormField label="Merk">
            <input
              v-model="formData.merk"
              type="text"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            />
          </CommonFormField>
          <div class="grid grid-cols-2 gap-4">
            <CommonFormField label="Unit">
              <select
                v-model="formData.unit"
                class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              >
                <option>Lembar</option>
                <option>Botol</option>
                <option>Pcs</option>
                <option>Roll</option>
                <option>Ream</option>
                <option>Kg</option>
              </select>
            </CommonFormField>
            <CommonFormField label="Price (IDR)" required>
              <input
                v-model.number="formData.price"
                type="number"
                class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                required
              />
            </CommonFormField>
          </div>
        </div>
        <CommonFormField label="Description">
          <textarea
            v-model="formData.description"
            rows="3"
            class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          ></textarea>
        </CommonFormField>
        <CommonModalFooter @cancel="showModal = false" />
      </form>
    </CommonBaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { formatNumber } from "~/composables/useFormatters";

const { data: purchaseItemData } = await useFetch<any[]>('/api/purchase-item')
const items = ref(purchaseItemData.value ?? []);

const searchQuery = ref("");
const categoryFilter = ref("");

const filteredItems = computed(() => {
  return items.value.filter((item) => {
    const q = searchQuery.value.toLowerCase();
    const matchesSearch =
      !q ||
      item.product.toLowerCase().includes(q) ||
      item.merk.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q);

    const matchesCategory = !categoryFilter.value || item.category === categoryFilter.value;
    return matchesSearch && matchesCategory;
  });
});

const showModal = ref(false);
const isEdit = ref(false);
const formData = ref<any>({});

const showViewModal = ref(false);
const selectedItem = ref<any>(null);

const openAddModal = () => {
  isEdit.value = false;
  formData.value = {
    category: "Kertas & Bahan Baku Cetak",
    product: "",
    merk: "",
    unit: "Pcs",
    price: 0,
    description: "",
  };
  showModal.value = true;
};

const openEditModal = (item: any) => {
  isEdit.value = true;
  formData.value = { ...item };
  showModal.value = true;
};

const viewItem = (item: any) => {
  selectedItem.value = item;
  showViewModal.value = true;
};

const saveItem = () => {
  if (isEdit.value) {
    const idx = items.value.findIndex((i) => i.id === formData.value.id);
    if (idx !== -1) {
      items.value[idx] = { ...formData.value };
    }
  } else {
    items.value.unshift({
      id: Date.now(),
      ...formData.value,
      created: `Admin, ${new Date().toLocaleDateString("id-ID")}`,
    });
  }
  showModal.value = false;
};

const deleteItem = (item: any) => {
  if (confirm(`Are you sure you want to delete ${item.product}?`)) {
    items.value = items.value.filter((i) => i.id !== item.id);
  }
};

const printList = () => {
  window.print();
};

const refreshList = () => {
  searchQuery.value = "";
  categoryFilter.value = "";
};

const toggleHeader = () => {
  // toggle header
};
useMockSync('purchase-item', items);
</script>