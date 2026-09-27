<script setup lang="ts">
import CreateRequestQuotationForm from '~/components/pages/add-request-quotation/CreateRequestQuotationForm.vue'
useLegacyPage({ title: 'Add New Request For Quotation (RFQ)', sweetAlert: false })
const { form, pending, loadError, isSubmitting, actionError, handleSubmit } = useRequestQuotationEditor(false)
</script>
<template>
  <div class="dulank-page dulank-page-add-request-quotation">
    <div class="mb-6 flex flex-wrap items-center justify-between gap-3">
      <h1 class="text-xl font-semibold text-gray-900 dark:text-white">Add New Request For Quotation (RFQ)</h1>
      <NuxtLink to="/request-quotation" :class="salesSecondaryButton"
        ><FeatherIcon name="arrow-left" :size="14" />Back to Quotation List</NuxtLink
      >
    </div>
    <SalesFeedback :pending="pending" :error="loadError || actionError" />
    <CreateRequestQuotationForm
      v-if="!pending && !loadError"
      v-model="form"
      :busy="isSubmitting"
      @submit="handleSubmit"
    />
  </div>
</template>
