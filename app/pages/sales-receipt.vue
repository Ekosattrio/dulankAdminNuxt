<script setup lang="ts">
import SalesReceiptDocument from '~/components/pages/sales/SalesReceiptDocument.vue'
useLegacyPage({ title: 'Sales Receipt', sweetAlert: false })
const { record, pending, message } = useSaleDocument()
</script>
<template>
  <div class="dulank-page dulank-page-sales-receipt">
    <SalesFeedback :pending="pending" :error="message" /><SalesReceiptDocument
      v-if="record"
      :record="record"
    />
  </div>
</template>
