<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <CommonPageHeader title="Store List" subtitle="Manage branches, outlet stores, and workshop locations">
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
            <span>Add Store</span>
          </button>
        </div>
      </template>
    </CommonPageHeader>

    <!-- Data Table Card -->
    <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <!-- Toolbar -->
      <div class="mb-5 flex flex-wrap items-center justify-between gap-4">
        <CommonSearchFilter v-model="searchQuery" placeholder="Search store name, user or address..." />
        <CommonFilterSelect
          v-model="filterStatus"
          allLabel="All Status"
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
              <th class="px-4 py-3 text-start whitespace-nowrap">Store Name</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Manager / User</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Address</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Phone</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Email</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Status</th>
              <th class="px-4 py-3 text-center whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <tr v-for="s in filteredStores" :key="s.id" class="transition-colors hover:bg-gray-50/75 dark:hover:bg-gray-800/40">
              <td class="px-4 py-3 whitespace-nowrap font-bold text-gray-900 dark:text-gray-100">{{ s.storeName }}</td>
              <td class="px-4 py-3 whitespace-nowrap">{{ s.userName }}</td>
              <td class="max-w-[260px] truncate px-4 py-3 whitespace-nowrap text-gray-500 dark:text-gray-400">{{ s.address }}</td>
              <td class="px-4 py-3 whitespace-nowrap">{{ s.phone }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-gray-500 dark:text-gray-400">{{ s.email }}</td>
              <td class="px-4 py-3 whitespace-nowrap">
                <CommonStatusPill :status="s.status" />
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-center">
                <CommonRowActions :item="s" @edit="openEditModal(s)" @delete="deleteStore(s.id)" />
              </td>
            </tr>
            <tr v-if="filteredStores.length === 0">
              <td colspan="7" class="p-8 text-center text-gray-400">No store outlets found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add/Edit Store Modal -->
    <CommonBaseModal v-model="modalVisible" :title="isEdit ? 'Edit Store' : 'Add Store'" maxWidth="lg">
      <form @submit.prevent="saveStore" class="space-y-4">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <CommonFormField label="Store Outlet Name" required>
            <input
              v-model="form.storeName"
              type="text"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              required
              placeholder="e.g. Workshop Karawang"
            />
          </CommonFormField>
          <CommonFormField label="PIC / Manager Username" required>
            <input
              v-model="form.userName"
              type="text"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              required
              placeholder="e.g. Thomas21"
            />
          </CommonFormField>
        </div>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <CommonFormField label="Phone" required>
            <input
              v-model="form.phone"
              type="text"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              required
              placeholder="+62 812 3456 789"
            />
          </CommonFormField>
          <CommonFormField label="Email" required>
            <input
              v-model="form.email"
              type="email"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              required
              placeholder="outlet@example.com"
            />
          </CommonFormField>
        </div>
        <CommonFormField label="Address">
          <textarea
            v-model="form.address"
            rows="2"
            class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            placeholder="Complete address of the outlet"
          ></textarea>
        </CommonFormField>
        <CommonToggleSwitch v-model="formActive" label="Status Active" />
        <CommonModalFooter submitLabel="Save Changes" @cancel="closeModal" />
      </form>
    </CommonBaseModal>
  </div>
</template>

<script setup lang="ts">import { ref, computed } from "vue";

const { data: storeListData } = await useFetch<StoreItem[]>('/api/store-list')
const stores = ref<StoreItem[]>(storeListData.value ?? [])
useMockSync('store-list', stores);

const searchQuery = ref("");
const filterStatus = ref("");
const statusDropdownOpen = ref(false);

const filteredStores = computed(() => {
  return stores.value.filter((s) => {
    const matchStatus = !filterStatus.value || s.status === filterStatus.value;
    const matchSearch =
      !searchQuery.value ||
      s.storeName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      s.userName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      s.address.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.value.toLowerCase());
    return matchStatus && matchSearch;
  });
});

const modalVisible = ref(false);
const isEdit = ref(false);
const currentId = ref<number | null>(null);

const form = ref({
  storeName: "",
  userName: "",
  address: "",
  phone: "",
  email: "",
  status: "Active" as "Active" | "Inactive",
});

const formActive = computed({
  get: () => form.value.status === "Active",
  set: (val: boolean) => {
    form.value.status = val ? "Active" : "Inactive";
  },
});

function openAddModal() {
  isEdit.value = false;
  currentId.value = null;
  form.value = {
    storeName: "",
    userName: "",
    address: "",
    phone: "",
    email: "",
    status: "Active",
  };
  modalVisible.value = true;
}

function openEditModal(s: StoreItem) {
  isEdit.value = true;
  currentId.value = s.id;
  form.value = {
    storeName: s.storeName,
    userName: s.userName,
    address: s.address,
    phone: s.phone,
    email: s.email,
    status: s.status,
  };
  modalVisible.value = true;
}

function closeModal() {
  modalVisible.value = false;
}

function saveStore() {
  if (isEdit.value && currentId.value !== null) {
    const idx = stores.value.findIndex((s) => s.id === currentId.value);
    if (idx !== -1) {
      stores.value[idx] = {
        ...stores.value[idx],
        ...form.value,
      };
    }
  } else {
    const newId = stores.value.length ? Math.max(...stores.value.map((s) => s.id)) + 1 : 1;
    stores.value.unshift({
      id: newId,
      ...form.value,
    });
  }
  closeModal();
}

function deleteStore(id: number) {
  if (confirm("Are you sure you want to delete this store outlet?")) {
    stores.value = stores.value.filter((s) => s.id !== id);
  }
}

function exportPdf() {
  alert("Exporting stores list as PDF...");
}

function printTable() {
  window.print();
}

function refresh() {
  searchQuery.value = "";
  filterStatus.value = "";
}</script>