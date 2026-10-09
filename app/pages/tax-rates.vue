<<<<<<< HEAD
<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <CommonPageHeader title="Settings" subtitle="Manage your settings on portal">
      <template #actions>
        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-600 focus:outline-none"
          @click="openAddModal"
        >
          <CommonFeatherIcon name="plus" size="18" />
          <span>Add New Tax Rate</span>
        </button>
      </template>
    </CommonPageHeader>

    <!-- Table Card -->
    <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:max-w-[900px]">
      <!-- Toolbar -->
      <div class="mb-5 flex flex-wrap items-center justify-between gap-4">
        <CommonSearchFilter v-model="searchQuery" placeholder="Search tax rate..." />
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="w-full text-start text-xs text-gray-700 dark:text-gray-300">
          <thead
            class="bg-gray-50 text-[11px] font-semibold uppercase text-gray-500 border-b border-gray-200 dark:bg-gray-800/50 dark:border-gray-700 dark:text-gray-400"
          >
            <tr>
              <th class="px-4 py-3 text-start whitespace-nowrap">Name</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Tax Rates %</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Created On</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Status</th>
              <th class="px-4 py-3 text-end whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <tr v-for="item in filteredTaxes" :key="item.id" class="transition-colors hover:bg-gray-50/75 dark:hover:bg-gray-800/40">
              <td class="px-4 py-3 whitespace-nowrap font-semibold text-gray-900 dark:text-gray-100">{{ item.name }}</td>
              <td class="px-4 py-3 whitespace-nowrap">{{ item.rate }}%</td>
              <td class="px-4 py-3 whitespace-nowrap text-gray-500 dark:text-gray-400">{{ item.createdOn }}</td>
              <td class="px-4 py-3 whitespace-nowrap">
                <CommonStatusPill :status="item.status" />
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-end">
                <CommonRowActions :item="item" @edit="openEditModal(item)" @delete="deleteItem(item.id)" />
              </td>
            </tr>
            <tr v-if="filteredTaxes.length === 0">
              <td colspan="5" class="p-8 text-center text-gray-400">No tax rates found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add Tax Rate Modal -->
    <CommonBaseModal v-model="showAddModal" title="Add Tax Rate" maxWidth="md">
      <form @submit.prevent="saveTax" class="space-y-4">
        <CommonFormField label="Name" required>
          <input
            v-model="formData.name"
            type="text"
            class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            placeholder="e.g. PPN 11% / VAT"
            required
          />
        </CommonFormField>
        <CommonFormField label="Tax Rate %" required>
          <input
            v-model.number="formData.rate"
            type="number"
            step="0.1"
            class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            placeholder="11"
            required
          />
        </CommonFormField>
        <CommonToggleSwitch v-model="formData.isActive" label="Active" />
        <CommonModalFooter @cancel="closeModal" />
      </form>
    </CommonBaseModal>

    <!-- Edit Tax Rate Modal -->
    <CommonBaseModal v-model="showEditModal" title="Edit Tax Rate" maxWidth="md">
      <form @submit.prevent="updateTax" class="space-y-4">
        <CommonFormField label="Name" required>
          <input
            v-model="formData.name"
            type="text"
            class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            required
          />
        </CommonFormField>
        <CommonFormField label="Tax Rate %" required>
          <input
            v-model.number="formData.rate"
            type="number"
            step="0.1"
            class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            required
          />
        </CommonFormField>
        <CommonToggleSwitch v-model="formData.isActive" label="Active" />
        <CommonModalFooter @cancel="closeModal" />
      </form>
    </CommonBaseModal>
  </div>
</template>

<script setup lang="ts">import { ref, computed } from "vue";

useHead({
  title: "Tax Rates - Kacetak System",
});

const { data: taxRatesData } = await useFetch<TaxRateItem[]>('/api/tax-rates')
const taxRates = ref<TaxRateItem[]>(taxRatesData.value ?? [])
useMockSync('tax-rates', taxRates);

const searchQuery = ref("");

const filteredTaxes = computed(() => {
  return taxRates.value.filter((item) => {
    return searchQuery.value === "" || item.name.toLowerCase().includes(searchQuery.value.toLowerCase());
  });
});

const showAddModal = ref(false);
const showEditModal = ref(false);
const editingId = ref<number | null>(null);

const defaultFormData = () => ({
  name: "",
  rate: 11,
  isActive: true,
});

const formData = ref(defaultFormData());

const openAddModal = () => {
  formData.value = defaultFormData();
  showAddModal.value = true;
};

const openEditModal = (item: TaxRateItem) => {
  editingId.value = item.id;
  formData.value = {
    name: item.name,
    rate: item.rate,
    isActive: item.status === "Active",
  };
  showEditModal.value = true;
};

const closeModal = () => {
  showAddModal.value = false;
  showEditModal.value = false;
  editingId.value = null;
};

const saveTax = () => {
  const newId = Math.max(0, ...taxRates.value.map((t) => t.id)) + 1;
  const now = new Date();
  taxRates.value.push({
    id: newId,
    name: formData.value.name,
    rate: formData.value.rate,
    createdOn: now.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
    status: formData.value.isActive ? "Active" : "Inactive",
  });
  closeModal();
};

const updateTax = () => {
  if (editingId.value === null) return;
  const idx = taxRates.value.findIndex((t) => t.id === editingId.value);
  if (idx !== -1) {
    taxRates.value[idx] = {
      ...taxRates.value[idx],
      name: formData.value.name,
      rate: formData.value.rate,
      status: formData.value.isActive ? "Active" : "Inactive",
    };
  }
  closeModal();
};

const deleteItem = (id: number) => {
  if (confirm("Are you sure you want to delete this tax rate?")) {
    taxRates.value = taxRates.value.filter((t) => t.id !== id);
  }
};

const refresh = () => {
  searchQuery.value = "";
};

const toggleCollapse = () => {
  // collapsible header
};
</script>
=======
<script setup lang="ts">
import TaxRatesWorkspace from '~/components/pages/setting/TaxRatesWorkspace.vue'

definePageMeta({
  layout: 'default'
})

useLegacyPage({
  title: 'Tax Rates',
  styles: ['/assets/css/style.css'],
  scripts: ['/assets/js/theme-script.js'],
  sweetAlert: true
})
</script>

<template>
  <div class="page-wrapper mt-3 dulank-page dulank-page-tax-rates">
    <TaxRatesWorkspace />
  </div>
</template>
>>>>>>> origin/eko
