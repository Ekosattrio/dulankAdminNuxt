<script setup lang="ts">
import type { UserAdmin } from '#server/types/user-management'
import FeatherIcon from '~/components/Common/FeatherIcon.vue'
import AppBadge from '~/components/Common/AppBadge.vue'

defineProps<{
  userAdmins: UserAdmin[]
  searchQuery: string
  selectedRole: string
  selectedStatus: string
}>()

const emit = defineEmits<{
  'update:searchQuery': [value: string]
  'update:selectedRole': [value: string]
  'update:selectedStatus': [value: string]
  edit: [user: UserAdmin]
  delete: [user: UserAdmin]
}>()

const { roles: roleOptions } = useMasterOptions()
const roles = computed(() => roleOptions.value.map(item => item.name))
const statuses = ['Active', 'Inactive']

const getRoleTone = (role: string) => {
  switch (role) {
    case 'Admin':
      return 'info' as const
    case 'Manager':
      return 'warning' as const
    case 'Supervisor':
      return 'success' as const
    default:
      return 'neutral' as const
  }
}
</script>

<template>
  <div class="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 overflow-hidden">
    <!-- Toolbar Controls -->
    <div class="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 dark:border-gray-800">
      <!-- Search Input -->
      <div class="relative w-full max-w-xs">
        <input
          :value="searchQuery"
          type="text"
          placeholder="Search User Admin or Email..."
          class="w-full rounded-md border border-gray-200 bg-white py-2 ps-9 pe-3 text-xs text-gray-800 placeholder-gray-400 focus:border-[#FE9F43] focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500"
          @input="emit('update:searchQuery', ($event.target as HTMLInputElement).value)"
        />
        <span class="absolute inset-y-0 start-0 flex items-center ps-3 text-gray-400">
          <FeatherIcon name="search" size="14" />
        </span>
      </div>

      <!-- Filters -->
      <div class="flex items-center gap-2">
        <select
          :value="selectedRole"
          class="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-700 focus:border-[#FE9F43] focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          @change="emit('update:selectedRole', ($event.target as HTMLSelectElement).value)"
        >
          <option value="">All Roles</option>
          <option v-for="r in roles" :key="r" :value="r">{{ r }}</option>
        </select>

        <select
          :value="selectedStatus"
          class="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-700 focus:border-[#FE9F43] focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          @change="emit('update:selectedStatus', ($event.target as HTMLSelectElement).value)"
        >
          <option value="">All Statuses</option>
          <option v-for="s in statuses" :key="s" :value="s">{{ s }}</option>
        </select>
      </div>
    </div>

    <!-- Table Content -->
    <div class="overflow-x-auto">
      <table class="w-full text-start text-xs text-gray-700 dark:text-gray-300">
        <thead class="border-b border-gray-200 bg-gray-50/75 dark:border-gray-800 dark:bg-gray-800/50">
          <tr>
            <th class="px-4 py-3.5 font-semibold text-gray-900 dark:text-gray-100">User ID</th>
            <th class="px-4 py-3.5 font-semibold text-gray-900 dark:text-gray-100">Name</th>
            <th class="px-4 py-3.5 font-semibold text-gray-900 dark:text-gray-100">Email</th>
            <th class="px-4 py-3.5 font-semibold text-gray-900 dark:text-gray-100">Role</th>
            <th class="px-4 py-3.5 font-semibold text-gray-900 dark:text-gray-100">Store</th>
            <th class="px-4 py-3.5 text-center font-semibold text-gray-900 dark:text-gray-100">Status</th>
            <th class="px-4 py-3.5 text-end font-semibold text-gray-900 dark:text-gray-100">Action</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 dark:divide-gray-800/60">
          <tr
            v-for="adm in userAdmins"
            :key="adm.id"
            class="transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-800/30"
          >
            <td class="px-4 py-3.5 font-medium text-gray-900 dark:text-gray-100">{{ adm.userId }}</td>
            <td class="px-4 py-3.5 font-medium text-gray-900 dark:text-gray-100">
              <div class="flex items-center gap-2.5">
                <img
                  :src="adm.avatar || '/assets/img/users/user-01.jpg'"
                  :alt="adm.name"
                  class="size-7 rounded-full object-cover"
                />
                <span>{{ adm.name }}</span>
              </div>
            </td>
            <td class="px-4 py-3.5 text-gray-600 dark:text-gray-400">{{ adm.email }}</td>
            <td class="px-4 py-3.5">
              <AppBadge :label="adm.role" :tone="getRoleTone(adm.role)" />
            </td>
            <td class="px-4 py-3.5">
              <div class="flex flex-wrap gap-1">
                <AppBadge
                  v-for="st in (adm.storeNames || adm.stores)"
                  :key="st"
                  :label="st"
                  tone="primary"
                />
              </div>
            </td>
            <td class="px-4 py-3.5 text-center">
              <AppBadge :label="adm.status" />
            </td>
            <td class="px-4 py-3.5 text-end">
              <div class="inline-flex items-center gap-1.5">
                <button
                  type="button"
                  class="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-[#FE9F43] dark:text-gray-400 dark:hover:bg-gray-800"
                  title="Edit User Admin"
                  @click="emit('edit', adm)"
                >
                  <FeatherIcon name="edit" size="14" />
                </button>
                <button
                  type="button"
                  class="rounded p-1 text-gray-500 hover:bg-rose-50 hover:text-rose-600 dark:text-gray-400 dark:hover:bg-rose-950/30 dark:hover:text-rose-400"
                  title="Delete User Admin"
                  @click="emit('delete', adm)"
                >
                  <FeatherIcon name="trash-2" size="14" />
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="!userAdmins.length">
            <td colspan="7" class="py-8 text-center text-gray-500 dark:text-gray-400">
              No user admin records found.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
