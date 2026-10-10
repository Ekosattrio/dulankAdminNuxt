<script setup lang="ts">
import type { Quotation, QuotationFormData } from '#server/types/quotation'
import Editor from '~/components/Pages/Quotation/QuotationEditor.vue'
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
