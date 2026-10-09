<script setup lang="ts">
import InvoiceDetailSheet from '~/components/pages/invoice/InvoiceDetailSheet.vue'

definePageMeta({ layout: 'default' })
useLegacyPage({ title: 'Invoice Details', sweetAlert: false })

const route = useRoute()
const invoiceNo = computed(() => (route.query.no as string) || 'INV00001')
const isProforma = ref(false)

function handlePrint() {
  window.print()
}
</script>

<template>
  <div class="dulank-page dulank-page-invoice-details space-y-4 p-4 md:p-6">
    <!-- Top Action Bar (Hidden in Print) -->
    <div class="print:hidden">
      <div class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex items-center gap-4">
          <h4 class="text-xl font-bold text-gray-900 dark:text-white">Invoice Details</h4>
          <label
            class="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-xs dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
          >
            <input
              v-model="isProforma"
              type="checkbox"
              class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-700"
            />
            <span>Proforma Invoice</span>
          </label>
        </div>

        <div class="flex items-center gap-2">
          <NuxtLink
            to="/invoice"
            class="inline-flex h-9 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 text-xs font-medium text-gray-700 shadow-xs hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
          >
            <i class="feather-arrow-left"></i>
            <span>Back to Invoices List</span>
          </NuxtLink>

          <button
            type="button"
            class="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white shadow-xs hover:bg-primary-600"
            title="Print Invoice"
            @click="handlePrint"
          >
            <i class="feather-printer"></i>
            <span>Print Invoice</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Printable Invoice Sheet -->
    <InvoiceDetailSheet :invoice-no="invoiceNo" :is-proforma="isProforma" />
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
