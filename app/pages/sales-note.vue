<script setup lang="ts">
import SalesNoteDocument from '~/components/pages/sales/SalesNoteDocument.vue'
useLegacyPage({ title: 'Sales Note', sweetAlert: false })
const { record, pending, message } = useSaleDocument()
</script>
<template>
  <div class="dulank-page dulank-page-sales-note">
    <SalesFeedback :pending="pending" :error="message" /><SalesNoteDocument v-if="record" :record="record" />
  </div>
</template>
