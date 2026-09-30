<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <CommonPageHeader title="Supplier List" subtitle="Manage material vendors, raw paper suppliers, and chemical providers">
      <template #actions>
        <div class="flex flex-wrap items-center gap-2">
          <button
            type="button"
            class="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 hover:text-primary dark:border-gray-700 dark:hover:bg-gray-800"
            title="Export PDF"
            @click="exportPdf"
          >
            <CommonFeatherIcon name="file-text" size="18" />
          </button>
          <button
            type="button"
            class="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 hover:text-primary dark:border-gray-700 dark:hover:bg-gray-800"
            title="Print"
            @click="printTable"
          >
            <CommonFeatherIcon name="printer" size="18" />
          </button>
          <button
            type="button"
            class="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 hover:text-primary dark:border-gray-700 dark:hover:bg-gray-800"
            title="Refresh"
            @click="refresh"
          >
            <CommonFeatherIcon name="rotate-ccw" size="18" />
          </button>
          <button
            type="button"
            class="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-600 focus:outline-none"
            @click="openAddModal"
          >
            <CommonFeatherIcon name="plus" size="18" />
            <span>Add New Supplier</span>
          </button>
        </div>
      </template>
    </CommonPageHeader>

    <!-- Table Card -->
    <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <!-- Toolbar -->
      <div class="mb-5 flex flex-wrap items-center justify-between gap-4">
        <CommonSearchFilter v-model="searchQuery" placeholder="Search supplier ID, name, or contact..." />
        <CommonFilterSelect
          v-model="filterStatus"
          allLabel="All Statuses"
          :options="[
            { value: 'Active', label: 'Active' },
            { value: 'Inactive', label: 'Inactive' },
          ]"
        />
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="w-full text-start text-xs text-gray-700 dark:text-gray-300">
          <thead
            class="bg-gray-50 text-[11px] font-semibold uppercase text-gray-500 border-b border-gray-200 dark:bg-gray-800/50 dark:border-gray-700 dark:text-gray-400"
          >
            <tr>
              <th class="px-4 py-3 text-start whitespace-nowrap">ID Supplier</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Supplier Name</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Email</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Contact</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">PIC Name</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Status</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Date</th>
              <th class="px-4 py-3 text-center whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <tr v-for="sup in filteredSuppliers" :key="sup.id" class="transition-colors hover:bg-gray-50/75 dark:hover:bg-gray-800/40">
              <td class="px-4 py-3 whitespace-nowrap font-bold text-primary">{{ sup.code }}</td>
              <td class="px-4 py-3 whitespace-nowrap font-semibold text-gray-900 dark:text-gray-100">{{ sup.name }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-gray-500 dark:text-gray-400">{{ sup.email }}</td>
              <td class="px-4 py-3 whitespace-nowrap">{{ sup.contact }}</td>
              <td class="px-4 py-3 whitespace-nowrap font-medium">{{ sup.picName }}</td>
              <td class="px-4 py-3 whitespace-nowrap">
                <CommonStatusPill :status="sup.status" />
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-gray-500 dark:text-gray-400">{{ sup.date }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-center">
                <CommonRowActions :item="sup" @edit="openEditModal(sup)" @delete="deleteSupplier(sup.id)" />
              </td>
            </tr>
            <tr v-if="filteredSuppliers.length === 0">
              <td colspan="8" class="p-8 text-center text-gray-400">No suppliers found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add / Edit Modal -->
    <CommonBaseModal v-model="modalVisible" :title="isEditing ? 'Edit Supplier' : 'Add New Supplier'" maxWidth="md">
      <form @submit.prevent="saveSupplier" class="space-y-4">
        <CommonFormField label="Supplier Name" required>
          <input
            v-model="formData.name"
            type="text"
            class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            required
          />
        </CommonFormField>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <CommonFormField label="Email" required>
            <input
              v-model="formData.email"
              type="email"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              required
            />
          </CommonFormField>
          <CommonFormField label="Contact / Phone" required>
            <input
              v-model="formData.contact"
              type="text"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              required
            />
          </CommonFormField>
        </div>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <CommonFormField label="PIC Name" required>
            <input
              v-model="formData.picName"
              type="text"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              required
            />
          </CommonFormField>
          <CommonFormField label="Status">
            <select
              v-model="formData.status"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </CommonFormField>
        </div>
        <CommonModalFooter :submit-label="isEditing ? 'Update Supplier' : 'Save Supplier'" @cancel="modalVisible = false" />
      </form>
    </CommonBaseModal>
  </div>
</template>

<script setup lang="ts">definePageMeta({
  layout: "default",
});

useHead({
  title: "Supplier List - Kacetak System",
});

const { data: supplierData } = await useFetch<SupplierItem[]>('/api/supplier')
const suppliers = ref<SupplierItem[]>(supplierData.value ?? [])
useMockSync('supplier', suppliers);

const searchQuery = ref("");
const filterStatus = ref("");

const filteredSuppliers = computed(() => {
  return suppliers.value.filter((s) => {
    const matchSearch =
      s.code.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      s.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      s.picName.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchStat = filterStatus.value ? s.status === filterStatus.value : true;
    return matchSearch && matchStat;
  });
});

const modalVisible = ref(false);
const isEditing = ref(false);
const formData = reactive({
  id: 0,
  name: "",
  email: "",
  contact: "",
  picName: "",
  status: "Active" as "Active" | "Inactive",
});

function openAddModal() {
  isEditing.value = false;
  formData.id = 0;
  formData.name = "";
  formData.email = "";
  formData.contact = "";
  formData.picName = "";
  formData.status = "Active";
  modalVisible.value = true;
}

function openEditModal(sup: SupplierItem) {
  isEditing.value = true;
  formData.id = sup.id;
  formData.name = sup.name;
  formData.email = sup.email;
  formData.contact = sup.contact;
  formData.picName = sup.picName;
  formData.status = sup.status;
  modalVisible.value = true;
}

function saveSupplier() {
  if (isEditing.value) {
    const idx = suppliers.value.findIndex((s) => s.id === formData.id);
    if (idx !== -1) {
      suppliers.value[idx] = {
        ...suppliers.value[idx],
        name: formData.name,
        email: formData.email,
        contact: formData.contact,
        picName: formData.picName,
        status: formData.status,
      };
    }
  } else {
    suppliers.value.unshift({
      id: Date.now(),
      code: "ID000" + (suppliers.value.length + 1),
      name: formData.name,
      email: formData.email,
      contact: formData.contact,
      picName: formData.picName,
      status: formData.status,
      date:
        new Date().toLocaleDateString("en-GB") +
        " " +
        new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
    });
  }
  modalVisible.value = false;
}

function deleteSupplier(id: number) {
  if (confirm("Are you sure you want to remove this supplier?")) {
    suppliers.value = suppliers.value.filter((s) => s.id !== id);
  }
}

function exportPdf() {
  alert("Exporting Supplier PDF...");
}

function printTable() {
  window.print();
}

function refresh() {
  searchQuery.value = "";
  filterStatus.value = "";
}</script>