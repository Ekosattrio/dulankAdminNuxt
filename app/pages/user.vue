<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <CommonPageHeader title="User List" subtitle="Manage Your Users">
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
        <CommonSearchFilter v-model="searchQuery" placeholder="Search Customer or Email..." />
        <div class="flex flex-wrap items-center gap-3">
          <CommonFilterSelect
            v-model="selectedRole"
            allLabel="All Roles"
            :options="[
              { value: 'Admin', label: 'Admin' },
              { value: 'Manager', label: 'Manager' },
              { value: 'Sales', label: 'Sales' },
            ]"
          />
          <CommonFilterSelect
            v-model="selectedStatus"
            allLabel="All Statuses"
            :options="[
              { value: 'Active Member', label: 'Active Member' },
              { value: 'Suspended', label: 'Suspended' },
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
              <th class="px-4 py-3 text-start whitespace-nowrap">Customer Id</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Email</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Customer Name</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Verified Email</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Subscription</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Status</th>
              <th class="px-4 py-3 text-end whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <tr v-for="(user, idx) in filteredUsers" :key="idx" class="transition-colors hover:bg-gray-50/75 dark:hover:bg-gray-800/40">
              <td class="px-4 py-3 whitespace-nowrap font-semibold text-primary">{{ user.id }}</td>
              <td class="px-4 py-3 whitespace-nowrap">{{ user.email }}</td>
              <td class="px-4 py-3 whitespace-nowrap font-medium text-gray-900 dark:text-gray-100">{{ user.name }}</td>
              <td class="px-4 py-3 whitespace-nowrap">
                <CommonStatusPill :status="user.verified ? 'Active' : 'No'" :tone="user.verified ? 'emerald' : 'rose'" />
              </td>
              <td class="px-4 py-3 whitespace-nowrap">
                <CommonStatusPill :status="user.subscription ? 'Yes' : 'No'" :tone="user.subscription ? 'emerald' : 'rose'" />
              </td>
              <td class="px-4 py-3 whitespace-nowrap">
                <select
                  v-model="user.status"
                  class="h-8 rounded-md border border-gray-200 bg-white px-2 text-xs text-gray-700 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                >
                  <option value="Active Member">Active Member</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-end">
                <CommonRowActions :item="user" @edit="openEditModal(user)" @delete="deleteUser(idx)" />
              </td>
            </tr>
            <tr v-if="filteredUsers.length === 0">
              <td colspan="7" class="p-8 text-center text-gray-400">No users found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add/Edit User Modal -->
    <CommonBaseModal v-model="showModal" :title="isEditing ? 'Edit User' : 'Add User'" maxWidth="lg">
      <form @submit.prevent="saveUser" class="space-y-4">
        <!-- Avatar -->
        <div>
          <span class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Avatar</span>
          <div class="mb-2 flex items-center gap-3">
            <div class="h-[60px] w-[60px] overflow-hidden rounded-full border border-gray-200 dark:border-gray-700">
              <img
                :src="currentUser.avatar || '/assets/img/users/user-01.jpg'"
                alt="User"
                class="h-full w-full object-cover"
              />
            </div>
            <label class="cursor-pointer rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800">
              Change Image
              <input type="file" class="hidden" accept="image/*" @change="onAvatarChange" />
            </label>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <CommonFormField label="User Name" required>
            <input
              v-model="currentUser.name"
              type="text"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              required
            />
          </CommonFormField>
          <CommonFormField label="Phone">
            <input
              v-model="currentUser.phone"
              type="text"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            />
          </CommonFormField>
        </div>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <CommonFormField label="Email" required>
            <input
              v-model="currentUser.email"
              type="email"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              required
            />
          </CommonFormField>
          <CommonFormField label="Role">
            <select
              v-model="currentUser.role"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            >
              <option value="Admin">Admin</option>
              <option value="Manager">Manager</option>
              <option value="Sales">Sales</option>
            </select>
          </CommonFormField>
        </div>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <CommonFormField label="Password">
            <input
              v-model="currentUser.password"
              type="password"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              :required="!isEditing"
            />
          </CommonFormField>
          <CommonFormField label="Confirm Password">
            <input
              v-model="currentUser.confirmPassword"
              type="password"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              :required="!isEditing"
            />
          </CommonFormField>
        </div>
        <CommonFormField label="Descriptions">
          <textarea
            v-model="currentUser.descriptions"
            rows="3"
            class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            placeholder="Type message..."
          ></textarea>
        </CommonFormField>
        <CommonModalFooter submitLabel="Submit" @cancel="showModal = false" />
      </form>
    </CommonBaseModal>
  </div>
</template>

<script setup lang="ts">import { ref, computed } from "vue";

useHead({
  title: "User List - Kacetak System",
});

const searchQuery = ref("");
const selectedRole = ref("");
const selectedStatus = ref("");
const showModal = ref(false);
const isEditing = ref(false);

const { data: userData } = await useFetch<UserItem[]>('/api/user')
const users = ref<UserItem[]>(userData.value ?? [])
useMockSync('user', users);

const currentUser = ref<UserItem>({
  id: "",
  email: "",
  name: "",
  verified: true,
  subscription: true,
  status: "Active Member",
  role: "Admin",
  phone: "",
  avatar: "",
  descriptions: "",
});

const filteredUsers = computed(() => {
  return users.value.filter((item) => {
    const q = searchQuery.value.toLowerCase();
    const matchQ =
      item.name.toLowerCase().includes(q) || item.email.toLowerCase().includes(q) || item.id.toLowerCase().includes(q);
    const matchRole = !selectedRole.value || item.role === selectedRole.value;
    const matchStatus = !selectedStatus.value || item.status === selectedStatus.value;
    return matchQ && matchRole && matchStatus;
  });
});

const openAddModal = () => {
  isEditing.value = false;
  const nextNum = users.value.length + 1;
  currentUser.value = {
    id: `ID${String(nextNum).padStart(6, "0")}`,
    email: "",
    name: "",
    verified: true,
    subscription: true,
    status: "Active Member",
    role: "Admin",
    phone: "",
    avatar: "/assets/img/users/user-01.jpg",
    descriptions: "",
  };
  showModal.value = true;
};

const openEditModal = (user: UserItem) => {
  isEditing.value = true;
  currentUser.value = { ...user };
  showModal.value = true;
};

const onAvatarChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    currentUser.value.avatar = URL.createObjectURL(target.files[0]);
  }
};

const saveUser = () => {
  if (isEditing.value) {
    const idx = users.value.findIndex((u) => u.id === currentUser.value.id);
    if (idx !== -1) {
      users.value[idx] = { ...currentUser.value };
    }
  } else {
    users.value.unshift({ ...currentUser.value });
  }
  showModal.value = false;
};

const deleteUser = (idx: number) => {
  if (confirm("Are you sure you want to delete this user?")) {
    users.value.splice(idx, 1);
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
};
</script>