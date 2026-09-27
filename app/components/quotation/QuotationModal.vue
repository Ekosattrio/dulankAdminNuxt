<script setup lang="ts">
import type { Quotation, QuotationFormData } from '#server/types/quotation'
import Editor from '~/components/pages/quotation/QuotationEditor.vue'
const props = defineProps<{
  isOpen: boolean
  busy?: boolean
  error?: string
  isEdit: boolean
  editData?: Quotation | null
}>()
defineOptions({ inheritAttrs: false })
</script>
<template><Editor v-bind="{ ...$attrs, ...props }" /></template>
