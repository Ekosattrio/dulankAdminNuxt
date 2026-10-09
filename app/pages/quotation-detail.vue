<script setup lang="ts">
import QuotationDetailSheet from '~/components/pages/quotation/QuotationDetailSheet.vue'

definePageMeta({ layout: 'default' })
useLegacyPage({ title: 'Quotation Detail', sweetAlert: false })

const route = useRoute()
const quoteNo = computed(() => (route.query.no as string) || '#Q21000220213')

const quoteStatus = ref<'pending' | 'accepted' | 'rejected'>('pending')
const notice = ref('')

function handleAccept() {
  quoteStatus.value = 'accepted'
  notice.value = 'Order Accepted! Quotation moved to sales pipeline.'
}

function handleReject() {
  quoteStatus.value = 'rejected'
  notice.value = 'Quotation has been rejected.'
}

function handlePrint() {
  window.print()
}
</script>

<template>
  <div class="dulank-page dulank-page-quotation-detail space-y-4 p-4 md:p-6">
    <!-- Top Action Bar (Hidden in Print) -->
    <div class="print:hidden">
      <div class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex items-center gap-3">
          <h4 class="text-xl font-bold text-gray-900 dark:text-white">Quotation {{ quoteNo }}</h4>
          <span
            v-if="quoteStatus === 'accepted'"
            class="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300"
          >
            Accepted
          </span>
          <span
            v-else-if="quoteStatus === 'rejected'"
            class="rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-300"
          >
            Rejected
          </span>
        </div>

        <div class="flex items-center gap-2">
          <NuxtLink
            to="/quotation"
            class="inline-flex h-9 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 text-xs font-medium text-gray-700 shadow-xs hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
          >
            <i class="feather-arrow-left"></i>
            <span>Back to Quotation List</span>
          </NuxtLink>

          <button
            type="button"
            class="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white shadow-xs hover:bg-primary-600"
            title="Print Quotation"
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
          quoteStatus === 'accepted'
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300'
            : 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-300',
        ]"
      >
        {{ notice }}
      </div>
    </div>

    <!-- Printable Quotation Sheet -->
    <QuotationDetailSheet :quote-no="quoteNo" />

    <!-- Bottom Actions (Hidden in Print) -->
    <div class="mx-auto mt-6 flex max-w-4xl justify-end gap-3 print:hidden">
      <button
        type="button"
        class="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700"
        @click="handleAccept"
      >
        <i class="feather-check-circle"></i>
        <span>Order (Accept Quotation)</span>
      </button>
      <button
        type="button"
        class="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-rose-700"
        @click="handleReject"
      >
        <i class="feather-x-circle"></i>
        <span>Reject Quotation</span>
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
