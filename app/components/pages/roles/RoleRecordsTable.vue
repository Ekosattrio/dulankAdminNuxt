<script setup lang="ts">
import type { SystemRole } from '#server/types/user-management'
import FeatherIcon from '~/components/common/FeatherIcon.vue'

defineProps<{
  roles: SystemRole[]
  searchQuery: string
  sortOrder: string
}>()

const emit = defineEmits<{
  'update:searchQuery': [value: string]
  'update:sortOrder': [value: string]
  edit: [role: SystemRole]
  delete: [role: SystemRole]
}>()
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
          placeholder="Search Role..."
          class="w-full rounded-md border border-gray-200 bg-white py-2 ps-9 pe-3 text-xs text-gray-800 placeholder-gray-400 focus:border-[#FE9F43] focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500"
          @input="emit('update:searchQuery', ($event.target as HTMLInputElement).value)"
        />
        <span class="absolute inset-y-0 start-0 flex items-center ps-3 text-gray-400">
          <FeatherIcon name="search" size="14" />
        </span>
      </div>

      <!-- Sort -->
      <div class="flex items-center gap-2">
        <select
          :value="sortOrder"
          class="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-700 focus:border-[#FE9F43] focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          @change="emit('update:sortOrder', ($event.target as HTMLSelectElement).value)"
        >
          <option value="newest">Sort by: Newest</option>
          <option value="oldest">Sort by: Oldest</option>
        </select>
      </div>
    </div>

    <!-- Table Content -->
    <div class="overflow-x-auto">
      <table class="w-full text-start text-xs text-gray-700 dark:text-gray-300">
        <thead class="border-b border-gray-200 bg-gray-50/75 dark:border-gray-800 dark:bg-gray-800/50">
          <tr>
            <th class="px-4 py-3.5 font-semibold text-gray-900 dark:text-gray-100">Role Name</th>
            <th class="px-4 py-3.5 font-semibold text-gray-900 dark:text-gray-100">Created On</th>
            <th class="px-4 py-3.5 text-end font-semibold text-gray-900 dark:text-gray-100">Action</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 dark:divide-gray-800/60">
          <tr
            v-for="r in roles"
            :key="r.id"
            class="transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-800/30"
          >
            <td class="px-4 py-3.5 font-semibold text-gray-900 dark:text-gray-100">{{ r.name }}</td>
            <td class="px-4 py-3.5 text-gray-600 dark:text-gray-400">{{ r.createdOn }}</td>
            <td class="px-4 py-3.5 text-end">
              <div class="inline-flex items-center gap-1.5">
                <button
                  type="button"
                  class="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-[#FE9F43] dark:text-gray-400 dark:hover:bg-gray-800"
                  title="Edit Role"
                  @click="emit('edit', r)"
                >
                  <FeatherIcon name="edit" size="14" />
                </button>
                <NuxtLink
                  to="/role"
                  class="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-sky-600 dark:text-gray-400 dark:hover:bg-gray-800"
                  title="Permissions Matrix"
                >
                  <FeatherIcon name="shield" size="14" />
                </NuxtLink>
                <button
                  type="button"
                  class="rounded p-1 text-gray-500 hover:bg-rose-50 hover:text-rose-600 dark:text-gray-400 dark:hover:bg-rose-950/30 dark:hover:text-rose-400"
                  title="Delete Role"
                  @click="emit('delete', r)"
                >
                  <FeatherIcon name="trash-2" size="14" />
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="!roles.length">
            <td colspan="3" class="py-8 text-center text-gray-500 dark:text-gray-400">
              No roles found.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
