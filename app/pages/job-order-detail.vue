<script setup lang="ts">
import JobOrderSpkSheet from '~/components/pages/job-order/JobOrderSpkSheet.vue'

definePageMeta({
  layout: 'default',
  alias: ['/job-order-detail.html'],
})
useLegacyPage({ title: 'Job Order Detail', sweetAlert: false })

const route = useRoute()
const joNo = computed(() => (route.query.no as string) || 'JO-0001')

function handlePrint() {
  window.print()
}
</script>

<template>
  <div class="dulank-page dulank-page-job-order-detail space-y-4 p-4 md:p-6">
    <!-- Top Action Bar (Hidden in Print) -->
    <div class="print:hidden">
      <div class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex items-center gap-3">
          <h4 class="text-xl font-bold text-gray-900 dark:text-white">Detail Job Order #{{ joNo }}</h4>
          <span class="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 border border-blue-200 dark:bg-blue-950/40 dark:border-blue-800 dark:text-blue-300">
            On Process
          </span>
        </div>

        <div class="flex items-center gap-2">
          <NuxtLink
            to="/job-order"
            class="inline-flex h-9 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 text-xs font-medium text-gray-700 shadow-xs hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
          >
            <i class="feather-arrow-left"></i>
            <span>Back to Job Order List</span>
          </NuxtLink>

          <button
            type="button"
            class="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white shadow-xs hover:bg-primary-600"
            title="Print SPK Sheet"
            @click="handlePrint"
          >
            <i class="feather-printer"></i>
            <span>Print SPK Traveler</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Printable Job Traveler Sheet (A4 SPK) -->
    <JobOrderSpkSheet :jo-no="joNo" />
  </div>
</template>

<style scoped>
@media print {
  @page {
    size: A4;
    margin: 0.35in;
  }
}
</style>
