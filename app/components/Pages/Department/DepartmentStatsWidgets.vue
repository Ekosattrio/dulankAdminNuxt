<script setup lang="ts">
import FeatherIcon from '~/components/Common/FeatherIcon.vue'

defineProps<{
  stats: {
    totalDepartments: number
    totalEmployees: number
    activeDepartments: number
    inactiveDepartments: number
  }
}>()
</script>

<template>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
    <!-- Total Departments -->
    <div class="relative overflow-hidden rounded-xl border border-gray-200/80 bg-white p-5 shadow-xs transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Total Departments
          </p>
          <h3 class="mt-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {{ stats.totalDepartments }}
          </h3>
        </div>
        <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-400">
          <FeatherIcon name="briefcase" size="22" />
        </div>
      </div>
    </div>

    <!-- Total Members / Employees -->
    <div class="relative overflow-hidden rounded-xl border border-gray-200/80 bg-white p-5 shadow-xs transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-xs font-medium uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Total Members
          </p>
          <h3 class="mt-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {{ stats.totalEmployees }}
          </h3>
        </div>
        <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
          <FeatherIcon name="users" size="22" />
        </div>
      </div>
    </div>

    <!-- Active Departments -->
    <div class="relative overflow-hidden rounded-xl border border-gray-200/80 bg-white p-5 shadow-xs transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-xs font-medium uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Active
          </p>
          <h3 class="mt-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {{ stats.activeDepartments }}
          </h3>
        </div>
        <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
          <FeatherIcon name="check-circle" size="22" />
        </div>
      </div>
    </div>

    <!-- Inactive / Disabled -->
    <div class="relative overflow-hidden rounded-xl border border-gray-200/80 bg-white p-5 shadow-xs transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-xs font-medium uppercase tracking-wider text-rose-600 dark:text-rose-400">
            Disabled
          </p>
          <h3 class="mt-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {{ stats.inactiveDepartments }}
          </h3>
        </div>
        <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
          <FeatherIcon name="slash" size="22" />
        </div>
      </div>
    </div>
  </div>
</template>
