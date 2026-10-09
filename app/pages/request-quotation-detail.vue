<script setup lang="ts">
import RequestQuotationDetailSheet from '~/components/pages/request-quotation/RequestQuotationDetailSheet.vue'

definePageMeta({ layout: 'default' })
useLegacyPage({ title: 'Request Quotation Detail', sweetAlert: false })

const route = useRoute()
const rfqNo = computed(() => (route.query.no as string) || '6100167851')

const rfqStatus = ref<'pending' | 'ordered' | 'unavailable'>('pending')
const notice = ref('')

function handleOrder() {
  rfqStatus.value = 'ordered'
  notice.value = 'Quotation Ordered! Added to Purchase Pipeline.'
}

function handleUnavailable() {
  rfqStatus.value = 'unavailable'
  notice.value = 'Marked as Unavailable.'
}

function handlePrint() {
  window.print()
}
</script>

<template>
  <div class="dulank-page dulank-page-request-quotation-detail space-y-4 p-4 md:p-6">
    <!-- Top Action Bar (Hidden in Print) -->
    <div class="print:hidden">
      <div class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex items-center gap-3">
          <h4 class="text-xl font-bold text-gray-900 dark:text-white">Detail Request For Quotation (RFQ)</h4>
          <span
            v-if="rfqStatus === 'ordered'"
            class="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300"
          >
            Ordered
          </span>
          <span
            v-else-if="rfqStatus === 'unavailable'"
            class="rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-300"
          >
            Unavailable
          </span>
        </div>

        <div class="flex items-center gap-2">
          <NuxtLink
            to="/request-quotation"
            class="inline-flex h-9 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 text-xs font-medium text-gray-700 shadow-xs hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
          >
            <i class="feather-arrow-left"></i>
            <span>Back to RFQ List</span>
          </NuxtLink>

          <button
            type="button"
            class="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white shadow-xs hover:bg-primary-600"
            title="Print RFQ"
            @click="handlePrint"
          >
            <i class="feather-printer"></i>
            <span>Print</span>
          </button>
        </div>
      </div>

      <div
        v-if="notice"
        :class="[
          'mb-4 rounded-lg p-3 text-xs font-medium border',
          rfqStatus === 'ordered'
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300'
            : 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-300',
        ]"
      >
        {{ notice }}
      </div>
    </div>

    <!-- Printable RFQ Sheet -->
    <RequestQuotationDetailSheet :rfq-no="rfqNo" />

    <!-- Bottom Actions (Hidden in Print) -->
    <div class="mx-auto mt-6 flex max-w-4xl justify-end gap-3 print:hidden">
      <button
        type="button"
        class="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700"
        @click="handleOrder"
      >
        <i class="feather-shopping-cart"></i>
        <span>Order (Add to purchase)</span>
      </button>
      <button
        type="button"
        class="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-rose-700"
        @click="handleUnavailable"
      >
        <i class="feather-x-circle"></i>
        <span>Unavailable</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
@media print {
  @page {
    size: A4;
    margin: 0.4in;
  }
}
</style>
