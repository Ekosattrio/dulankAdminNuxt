<script setup lang="ts">
import type { Quotation } from '#server/types/quotation'
import RecordsTable from '~/components/pages/quotation/QuotationRecordsTable.vue'
const props = defineProps<{
  quotations: Quotation[]
  searchQuery: string
  filterStatus: string
}>()
defineOptions({ inheritAttrs: false })
</script>
<template><RecordsTable v-bind="{ ...$attrs, ...props }" /></template>
