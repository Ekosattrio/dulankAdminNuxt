<<<<<<< HEAD
<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <CommonPageHeader title="User Admin" subtitle="Kelola User & Role Toko">
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
            <span>Add New User</span>
          </button>
        </div>
      </template>
    </CommonPageHeader>

    <!-- Table Card -->
    <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <!-- Toolbar -->
      <div class="mb-5 flex flex-wrap items-center justify-between gap-4">
        <CommonSearchFilter v-model="searchQuery" placeholder="Search User Admin..." />
        <div class="flex flex-wrap items-center gap-3">
          <CommonFilterSelect
            v-model="selectedRole"
            allLabel="All Roles"
            :options="[
              { value: 'Admin', label: 'Admin' },
              { value: 'Manager', label: 'Manager' },
              { value: 'Supervisor', label: 'Supervisor' },
              { value: 'Staff', label: 'Staff' },
            ]"
          />
          <CommonFilterSelect
            v-model="selectedStatus"
            allLabel="All Statuses"
            :options="[
              { value: 'Active', label: 'Active' },
              { value: 'Inactive', label: 'Inactive' },
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
              <th class="px-4 py-3 text-start whitespace-nowrap">User ID</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Name</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Email</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Role</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Store</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Status</th>
              <th class="px-4 py-3 text-end whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <tr v-for="(u, idx) in filteredAdmins" :key="idx" class="transition-colors hover:bg-gray-50/75 dark:hover:bg-gray-800/40">
              <td class="px-4 py-3 whitespace-nowrap font-bold text-primary">{{ u.id }}</td>
              <td class="px-4 py-3 whitespace-nowrap font-medium text-gray-900 dark:text-gray-100">{{ u.name }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-gray-500 dark:text-gray-400">{{ u.email }}</td>
              <td class="px-4 py-3 whitespace-nowrap">
                <CommonStatusPill
                  :status="u.role"
                  :tone="u.role === 'Admin' ? 'indigo' : u.role === 'Manager' ? 'sky' : u.role === 'Supervisor' ? 'amber' : 'slate'"
                />
              </td>
              <td class="px-4 py-3 whitespace-nowrap">
                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="(store, sIdx) in u.stores"
                    :key="sIdx"
                    class="inline-flex rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary dark:bg-primary/20"
                  >
                    {{ store }}
                  </span>
                </div>
              </td>
              <td class="px-4 py-3 whitespace-nowrap">
                <CommonStatusPill :status="u.status" />
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-end">
                <CommonRowActions :item="u" @edit="openEditModal(u)" @delete="deleteAdmin(idx)" />
              </td>
            </tr>
            <tr v-if="filteredAdmins.length === 0">
              <td colspan="7" class="p-8 text-center text-gray-400">No admin users found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <CommonBaseModal v-model="showModal" :title="isEditing ? 'Edit Admin User' : 'Add Admin User'" maxWidth="lg">
      <form @submit.prevent="saveAdmin" class="space-y-4">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <CommonFormField label="Full Name" required>
            <input
              v-model="currentAdmin.name"
              type="text"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              required
            />
          </CommonFormField>
          <CommonFormField label="Email" required>
            <input
              v-model="currentAdmin.email"
              type="email"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              required
            />
          </CommonFormField>
        </div>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <CommonFormField label="Role">
            <select
              v-model="currentAdmin.role"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            >
              <option value="Admin">Admin</option>
              <option value="Manager">Manager</option>
              <option value="Supervisor">Supervisor</option>
              <option value="Staff">Staff</option>
            </select>
          </CommonFormField>
          <CommonFormField label="Status">
            <select
              v-model="currentAdmin.status"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </CommonFormField>
        </div>
        <CommonFormField label="Assigned Stores">
          <div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <label
              v-for="st in availableStores"
              :key="st"
              class="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-100 px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-50 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <input
                type="checkbox"
                class="h-4 w-4 accent-primary"
                :checked="currentAdmin.stores.includes(st)"
                @change="toggleStore(st)"
              />
              {{ st }}
            </label>
          </div>
        </CommonFormField>
        <CommonModalFooter submitLabel="Save Changes" @cancel="showModal = false" />
      </form>
    </CommonBaseModal>
  </div>
</template>

<script setup lang="ts">import { ref, computed } from "vue";

useHead({
  title: "User Admin - Kacetak System",
});

const searchQuery = ref("");
const selectedRole = ref("");
const selectedStatus = ref("");
const showModal = ref(false);
const isEditing = ref(false);

const availableStores = ["Toko Pusat", "Toko Cabang 1", "Toko Cabang 2", "Toko Cabang 3"];

const { data: userAdminData } = await useFetch<AdminItem[]>('/api/user-admin')
const admins = ref<AdminItem[]>(userAdminData.value ?? [])
useMockSync('user-admin', admins);

const currentAdmin = ref<AdminItem>({
  id: "",
  name: "",
  email: "",
  role: "Admin",
  stores: [],
  status: "Active",
});
const getRoleBadgeClass = (role: string) => {
  switch (role) {
    case "Admin":
      return "badge bg-info";
    case "Manager":
      return "badge bg-warning";
    case "Supervisor":
      return "badge bg-success";
    default:
      return "badge bg-secondary";
  }
};

const filteredAdmins = computed(() => {
  return admins.value.filter((u) => {
    const q = searchQuery.value.toLowerCase();
    const matchQ = u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.id.toLowerCase().includes(q);
    const matchRole = !selectedRole.value || u.role === selectedRole.value;
    const matchStatus = !selectedStatus.value || u.status === selectedStatus.value;
    return matchQ && matchRole && matchStatus;
  });
});

const toggleStore = (storeName: string) => {
  const idx = currentAdmin.value.stores.indexOf(storeName);
  if (idx === -1) {
    currentAdmin.value.stores.push(storeName);
  } else {
    currentAdmin.value.stores.splice(idx, 1);
  }
};

const openAddModal = () => {
  isEditing.value = false;
  const nextNum = admins.value.length + 1;
  currentAdmin.value = {
    id: `U00${nextNum}`,
    name: "",
    email: "",
    role: "Admin",
    stores: ["Toko Pusat"],
    status: "Active",
  };
  showModal.value = true;
};

const openEditModal = (u: AdminItem) => {
  isEditing.value = true;
  currentAdmin.value = { ...u, stores: [...u.stores] };
  showModal.value = true;
};

const saveAdmin = () => {
  if (isEditing.value) {
    const idx = admins.value.findIndex((a) => a.id === currentAdmin.value.id);
    if (idx !== -1) {
      admins.value[idx] = { ...currentAdmin.value };
    }
  } else {
    admins.value.unshift({ ...currentAdmin.value });
  }
  showModal.value = false;
};

const deleteAdmin = (idx: number) => {
  if (confirm("Are you sure you want to delete this admin user?")) {
    admins.value.splice(idx, 1);
  }
};

const exportPdf = () => {
  window.print();
};

const printTable = () => {
  window.print();
};

const refresh = () => {
  // refresh
};

const toggleCollapse = () => {
  // collapse
};</script>
=======
<script setup lang="ts">
import UserAdminWorkspace from '~/components/pages/user-admin/UserAdminWorkspace.vue'

definePageMeta({
  layout: 'default',
})

useLegacyPage({
  title: 'User Admin - User Management',
  sweetAlert: false,
})
</script>

<template>
  <div class="dulank-page dulank-page-user-admin p-4 md:p-6">
    <UserAdminWorkspace />
  </div>
</template>
>>>>>>> origin/eko
