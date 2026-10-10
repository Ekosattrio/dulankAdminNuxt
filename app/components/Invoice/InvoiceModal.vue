<script setup lang="ts">
import type { Invoice, InvoiceFormData } from '#server/types/invoice'
import Editor from '~/components/Pages/Invoice/InvoiceEditor.vue'
const props = defineProps<{
  isOpen: boolean
  busy?: boolean
  error?: string
  isEdit: boolean
  editData?: Invoice | null
}>()
defineOptions({ inheritAttrs: false })
</script>
<template><Editor v-bind="{ ...$attrs, ...props }" /></template>
