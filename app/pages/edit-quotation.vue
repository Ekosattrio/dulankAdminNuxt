<script setup lang="ts">
import QuotationDocumentForm from '~/components/Pages/Quotation/QuotationDocumentForm.vue'
useLegacyPage({ title: 'Edit Quotation', sweetAlert: false })
const { form, number, pending, loadError, busy, actionError, tax, total, submit } =
  useQuotationDocumentEditor(true)
</script>
<template>
  <div class="dulank-page dulank-page-edit-quotation">
    <div class="mb-6 flex flex-wrap items-center justify-between gap-3">
      <h1 class="text-xl font-semibold text-gray-900 dark:text-white">Edit Quotation</h1>
      <NuxtLink to="/quotation" :class="salesSecondaryButton"
        ><FeatherIcon name="arrow-left" :size="14" />Back to Quotation List</NuxtLink
      >
    </div>
    <SalesFeedback :pending="pending" :error="loadError || actionError" />
    <QuotationDocumentForm
      v-if="!pending && !loadError"
      v-model="form"
      :number="number"
      :busy="busy"
      :total="total"
      :tax="tax"
      @submit="submit"
    />
  </div>
</template>
