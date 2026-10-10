<script setup lang="ts">
import type { Sale } from '#server/types/sale'
import RecordsTable from '~/components/Pages/Sales/SalesRecordsTable.vue'
const props = defineProps<{
  sales: Sale[]
  searchQuery: string
  filterStatus: string
  filterChannel: string
}>()
defineOptions({ inheritAttrs: false })
</script>
<template><RecordsTable v-bind="{ ...$attrs, ...props }" /></template>
