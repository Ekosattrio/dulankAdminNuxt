<script setup lang="ts">
import type { Invoice } from '#server/types/invoice'
import RecordsTable from '~/components/pages/invoice/InvoiceRecordsTable.vue'
const props = defineProps<{
  invoices: Invoice[]
  searchQuery: string
  filterStatus: string
}>()
defineOptions({ inheritAttrs: false })
</script>
<template><RecordsTable v-bind="{ ...$attrs, ...props }" /></template>
