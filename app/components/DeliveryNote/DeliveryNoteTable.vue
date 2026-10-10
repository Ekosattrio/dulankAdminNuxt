<script setup lang="ts">
import type { DeliveryNote } from '#server/types/delivery-note'
import RecordsTable from '~/components/Pages/DeliveryNote/DeliveryNoteRecordsTable.vue'
const props = defineProps<{
  deliveryNotes: DeliveryNote[]
  searchQuery: string
  filterStatus: string
}>()
defineOptions({ inheritAttrs: false })
</script>
<template><RecordsTable v-bind="{ ...$attrs, ...props }" /></template>
