<script setup lang="ts">
import DeliveryNoteDetailSheet from '~/components/pages/delivery-note/DeliveryNoteDetailSheet.vue'

definePageMeta({ layout: 'default' })
useLegacyPage({ title: 'Delivery Note Detail', sweetAlert: false })

const route = useRoute()
const dnNo = computed(() => (route.query.no as string) || 'DN0001')

const status = ref<'Pending' | 'Complete' | 'Failed'>('Pending')
const statusMessage = ref('')

function handleComplete() {
  status.value = 'Complete'
  statusMessage.value = 'Delivery Note marked as Complete!'
}

function handleFail() {
  status.value = 'Failed'
  statusMessage.value = 'Delivery Note marked as Failed / Rescheduled!'
}

function handlePrint() {
  window.print()
}
</script>

<template>
  <div class="dulank-page dulank-page-delivery-note-detail space-y-4 p-4 md:p-6">
    <!-- Top Action Bar (Hidden in Print) -->
    <div class="print:hidden">
      <div class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex items-center gap-3">
          <h4 class="text-xl font-bold text-gray-900 dark:text-white">Delivery Note Detail</h4>
          <span
            v-if="status === 'Complete'"
            class="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300"
          >
            Complete
          </span>
          <span
            v-else-if="status === 'Failed'"
            class="rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-300"
          >
            Rescheduled
          </span>
        </div>

        <div class="flex items-center gap-2">
          <NuxtLink
            to="/delivery-note"
            class="inline-flex h-9 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 text-xs font-medium text-gray-700 shadow-xs hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
          >
            <i class="feather-arrow-left"></i>
            <span>Back to Delivery Note List</span>
          </NuxtLink>

          <button
            type="button"
            class="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white shadow-xs hover:bg-primary-600"
            title="Print Delivery Note"
            @click="handlePrint"
          >
            <i class="feather-printer"></i>
            <span>Print</span>
          </button>
        </div>
      </div>

      <!-- Alert message banner -->
      <div
        v-if="statusMessage"
        class="mb-4 rounded-lg bg-emerald-50 p-3 text-xs font-medium text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
      >
        {{ statusMessage }}
      </div>
    </div>

    <!-- Printable Delivery Note Sheet -->
    <DeliveryNoteDetailSheet :dn-no="dnNo" />

    <!-- Bottom Status Update Buttons (Hidden in Print) -->
    <div class="mx-auto mt-6 flex max-w-4xl justify-end gap-3 print:hidden">
      <button
        type="button"
        class="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700"
        @click="handleComplete"
      >
        <i class="feather-check-circle"></i>
        <span>Complete</span>
      </button>
      <button
        type="button"
        class="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-rose-700"
        @click="handleFail"
      >
        <i class="feather-x-circle"></i>
        <span>Fail (Reschedule)</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
@media print {
  @page {
    size: A4;
    margin: 0.3in !important;
  }
}
</style>
