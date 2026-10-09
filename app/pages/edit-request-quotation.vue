<script setup lang="ts">
import EditRequestQuotationForm from '~/components/pages/edit-request-quotation/EditRequestQuotationForm.vue'
useLegacyPage({ title: 'Edit Request For Quotation', sweetAlert: false })
const { form, pending, loadError, isSubmitting, actionError, handleSubmit } = useRequestQuotationEditor(true)
</script>
<template>
  <div class="dulank-page dulank-page-edit-request-quotation">
    <div class="mb-6 flex flex-wrap items-center justify-between gap-3">
      <h1 class="text-xl font-semibold text-gray-900 dark:text-white">Edit Request For Quotation (RFQ)</h1>
      <NuxtLink to="/request-quotation" :class="salesSecondaryButton"
        ><FeatherIcon name="arrow-left" :size="14" />Back to Quotation List</NuxtLink
      >
    </div>
    <SalesFeedback :pending="pending" :error="loadError || actionError" />
    <EditRequestQuotationForm
      v-if="!pending && !loadError"
      v-model="form"
      :busy="isSubmitting"
      @submit="handleSubmit"
    />
  </div>
</template>
