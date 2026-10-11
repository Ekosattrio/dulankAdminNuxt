<script setup lang="ts">
import InvoiceDetailDocument from '~/components/Pages/Invoice/InvoiceDetailDocument.vue'

useLegacyPage({ title: 'Invoice Details', sweetAlert: false })
const route = useRoute()
const { invoices, pending, error, refresh } = useInvoices()
const selectedId = computed(() => String(route.query.id || route.query.no || ''))
const record = computed(() => invoices.value.find((item) => item.id === selectedId.value || item.invoiceNo === selectedId.value))
</script>

<template>
  <InvoiceDetailDocument v-if="record" :record="record" />
  <SalesFeedback v-else :pending="pending" :error="error ? 'Unable to load invoice.' : !pending ? 'Invoice not found.' : ''" @retry="refresh()" />
</template>
