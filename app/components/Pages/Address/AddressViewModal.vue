<script setup lang="ts">
import SalesDialog from '~/components/Sales/SalesDialog.vue'

defineProps<{
  open: boolean
  addressData: any | null
}>()

defineEmits<{
  close: []
}>()
</script>

<template>
  <SalesDialog
    :open="open"
    title="View Address Details"
    medium
    @close="$emit('close')"
  >
    <div v-if="addressData" class="p-6 space-y-3">
      <div class="grid grid-cols-12 gap-2 py-1.5 border-b border-gray-100 dark:border-gray-800 text-xs">
        <div class="col-span-5 font-semibold text-gray-500 dark:text-gray-400">ID Address</div>
        <div class="col-span-7 font-bold text-primary dark:text-primary-400">{{ addressData.id }}</div>
      </div>
      <div class="grid grid-cols-12 gap-2 py-1.5 border-b border-gray-100 dark:border-gray-800 text-xs">
        <div class="col-span-5 font-semibold text-gray-500 dark:text-gray-400">Entity ID</div>
        <div class="col-span-7 font-medium text-gray-800 dark:text-gray-200">
          {{ addressData.customerId || addressData.supplierId || '-' }}
        </div>
      </div>
      <div class="grid grid-cols-12 gap-2 py-1.5 border-b border-gray-100 dark:border-gray-800 text-xs">
        <div class="col-span-5 font-semibold text-gray-500 dark:text-gray-400">Name</div>
        <div class="col-span-7 font-semibold text-gray-900 dark:text-gray-100">
          {{ addressData.name || addressData.user || '-' }}
        </div>
      </div>
      <div class="grid grid-cols-12 gap-2 py-1.5 border-b border-gray-100 dark:border-gray-800 text-xs">
        <div class="col-span-5 font-semibold text-gray-500 dark:text-gray-400">Contact</div>
        <div class="col-span-7 font-medium text-gray-800 dark:text-gray-200">
          {{ addressData.contact || addressData.phone || '-' }}
        </div>
      </div>
      <div class="grid grid-cols-12 gap-2 py-1.5 border-b border-gray-100 dark:border-gray-800 text-xs">
        <div class="col-span-5 font-semibold text-gray-500 dark:text-gray-400">Location</div>
        <div class="col-span-7 font-medium text-gray-800 dark:text-gray-200">
          {{ addressData.province }}, {{ addressData.city }}, {{ addressData.district }}
        </div>
      </div>
      <div class="grid grid-cols-12 gap-2 py-1.5 border-b border-gray-100 dark:border-gray-800 text-xs">
        <div class="col-span-5 font-semibold text-gray-500 dark:text-gray-400">Detail Address</div>
        <div class="col-span-7 font-medium text-gray-700 dark:text-gray-300">
          {{ addressData.detailAddress || '-' }}
        </div>
      </div>
      <div class="grid grid-cols-12 gap-2 py-1.5 border-b border-gray-100 dark:border-gray-800 text-xs">
        <div class="col-span-5 font-semibold text-gray-500 dark:text-gray-400">Other Detail</div>
        <div class="col-span-7 font-medium text-gray-700 dark:text-gray-300">
          {{ addressData.otherDetail || '-' }}
        </div>
      </div>
      <div class="grid grid-cols-12 gap-2 py-1.5 border-b border-gray-100 dark:border-gray-800 text-xs">
        <div class="col-span-5 font-semibold text-gray-500 dark:text-gray-400">Status</div>
        <div class="col-span-7">
          <span class="inline-flex items-center rounded-md border border-primary/20 bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
            {{ addressData.status || 'Active' }}
          </span>
        </div>
      </div>
      <div class="grid grid-cols-12 gap-2 py-1.5 text-xs">
        <div class="col-span-5 font-semibold text-gray-500 dark:text-gray-400">Date</div>
        <div class="col-span-7 font-medium text-gray-500 dark:text-gray-400">
          {{ addressData.date || '-' }}
        </div>
      </div>

      <div class="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-800">
        <button
          type="button"
          class="rounded-md border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
          @click="$emit('close')"
        >
          Close
        </button>
      </div>
    </div>
  </SalesDialog>
</template>
