<script setup lang="ts">
import type { RFQDocument } from '#server/types/request-quotation'
const form = defineModel<RFQDocument>({ required: true })
defineProps<{ busy: boolean }>()
defineEmits<{ submit: [] }>()
</script>
<template>
  <RequestQuotationDocumentForm v-model="form" :is-submitting="busy" @submit="$emit('submit')" />
</template>
