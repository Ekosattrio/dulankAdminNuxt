<script setup lang="ts">
import type { EmployeeItem } from '#server/types/employee'
import SalesDialog from '~/components/sales/SalesDialog.vue'
import FeatherIcon from '~/components/common/FeatherIcon.vue'

defineProps<{
  open: boolean
  employee: EmployeeItem | null
}>()

const emit = defineEmits<{
  close: []
  edit: [employee: EmployeeItem]
}>()
</script>

<template>
  <SalesDialog
    :open="open"
    title="View Employee Details"
    large
    @close="emit('close')"
  >
    <div v-if="employee" class="space-y-6 max-h-[75vh] overflow-y-auto pr-1">
      <!-- Profile Header Card -->
      <div class="flex items-center gap-4 rounded-xl border border-gray-100 bg-gray-50/80 p-4 dark:border-gray-800 dark:bg-gray-800/50">
        <div v-if="employee.avatar" class="h-16 w-16 overflow-hidden rounded-full border-2 border-primary/20 shadow-xs">
          <img :src="employee.avatar" alt="Avatar" class="h-full w-full object-cover">
        </div>
        <div v-else class="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary dark:bg-primary/20 dark:text-primary-300">
          {{ employee.name.charAt(0).toUpperCase() }}
        </div>

        <div class="flex-1">
          <div class="flex items-center gap-2">
            <h4 class="text-lg font-bold text-gray-900 dark:text-white">
              {{ employee.name }}
            </h4>
            <span
              :class="[
                'inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold',
                employee.status === 'Active'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800'
                  : 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800'
              ]"
            >
              {{ employee.status }}
            </span>
          </div>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            ID: <span class="font-semibold text-primary">{{ employee.id }}</span> • Department: <span class="font-medium text-gray-700 dark:text-gray-300">{{ employee.department }}</span>
          </p>
        </div>
      </div>

      <!-- Verified ID Card (If Photo ID Present) -->
      <div v-if="employee.photoId" class="space-y-2">
        <h5 class="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
          <FeatherIcon name="file-text" size="14" class="text-primary" />
          <span>Photo ID / KTP Document</span>
        </h5>
        <div class="overflow-hidden rounded-lg border border-gray-200 bg-white p-2 dark:border-gray-800 dark:bg-gray-900">
          <img :src="employee.photoId" alt="ID Document" class="max-h-48 rounded object-contain">
        </div>
      </div>

      <!-- General Information -->
      <div class="space-y-3">
        <h5 class="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
          <FeatherIcon name="user" size="14" class="text-primary" />
          <span>General Information</span>
        </h5>
        <div class="grid grid-cols-1 gap-3 rounded-lg border border-gray-200/80 p-4 text-sm sm:grid-cols-2 dark:border-gray-800 dark:bg-gray-900/40">
          <div>
            <span class="text-xs text-gray-500 dark:text-gray-400">Gender</span>
            <p class="font-medium text-gray-900 dark:text-gray-100">{{ employee.gender || '-' }}</p>
          </div>
          <div>
            <span class="text-xs text-gray-500 dark:text-gray-400">Date of Birth</span>
            <p class="font-medium text-gray-900 dark:text-gray-100">{{ employee.dob || '-' }}</p>
          </div>
          <div>
            <span class="text-xs text-gray-500 dark:text-gray-400">Join Channel</span>
            <p class="font-medium text-gray-900 dark:text-gray-100">{{ employee.joinChannel || 'Offline' }}</p>
          </div>
          <div>
            <span class="text-xs text-gray-500 dark:text-gray-400">Join Date</span>
            <p class="font-medium text-gray-900 dark:text-gray-100">{{ employee.joinDate || '-' }}</p>
          </div>
        </div>
      </div>

      <!-- Address Information -->
      <div class="space-y-3">
        <h5 class="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
          <FeatherIcon name="map-pin" size="14" class="text-primary" />
          <span>Address Details</span>
        </h5>
        <div class="grid grid-cols-1 gap-3 rounded-lg border border-gray-200/80 p-4 text-sm dark:border-gray-800 dark:bg-gray-900/40">
          <div>
            <span class="text-xs text-gray-500 dark:text-gray-400">Region / Area</span>
            <p class="font-medium text-gray-900 dark:text-gray-100">{{ employee.address || '-' }}</p>
          </div>
          <div>
            <span class="text-xs text-gray-500 dark:text-gray-400">Detail Address</span>
            <p class="font-medium text-gray-900 dark:text-gray-100">{{ employee.detailAddress || '-' }}</p>
          </div>
        </div>
      </div>

      <!-- Contact & Account -->
      <div class="space-y-3">
        <h5 class="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
          <FeatherIcon name="phone" size="14" class="text-primary" />
          <span>Contact & Account Information</span>
        </h5>
        <div class="grid grid-cols-1 gap-3 rounded-lg border border-gray-200/80 p-4 text-sm sm:grid-cols-2 dark:border-gray-800 dark:bg-gray-900/40">
          <div>
            <span class="text-xs text-gray-500 dark:text-gray-400">Email</span>
            <p class="font-medium text-gray-900 dark:text-gray-100">{{ employee.email || '-' }}</p>
          </div>
          <div>
            <span class="text-xs text-gray-500 dark:text-gray-400">Phone Number</span>
            <p class="font-medium text-gray-900 dark:text-gray-100">{{ employee.phone || '-' }}</p>
          </div>
        </div>
      </div>

      <!-- Emergency Contacts -->
      <div class="space-y-3">
        <h5 class="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
          <FeatherIcon name="alert-circle" size="14" class="text-primary" />
          <span>Emergency Contacts</span>
        </h5>
        <div class="grid grid-cols-1 gap-3 rounded-lg border border-gray-200/80 p-4 text-sm sm:grid-cols-2 dark:border-gray-800 dark:bg-gray-900/40">
          <div>
            <span class="text-xs text-gray-500 dark:text-gray-400">Contact Person 1</span>
            <p class="font-medium text-gray-900 dark:text-gray-100">{{ employee.contact1Name || '-' }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">{{ employee.contact1Phone || '-' }}</p>
          </div>
          <div>
            <span class="text-xs text-gray-500 dark:text-gray-400">Contact Person 2</span>
            <p class="font-medium text-gray-900 dark:text-gray-100">{{ employee.contact2Name || '-' }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">{{ employee.contact2Phone || '-' }}</p>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex items-center justify-end gap-3 w-full">
        <button
          type="button"
          class="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-xs hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
          @click="emit('close')"
        >
          Close
        </button>
        <button
          v-if="employee"
          type="button"
          class="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary/90"
          @click="emit('edit', employee); emit('close')"
        >
          <FeatherIcon name="edit" size="14" />
          <span>Edit Employee</span>
        </button>
      </div>
    </template>
  </SalesDialog>
</template>
