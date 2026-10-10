<script setup lang="ts">
import type { Sale, SaleFormData } from '#server/types/sale'
import Editor from '~/components/Pages/Sales/SalesEditor.vue'
const props = defineProps<{
  isOpen: boolean
  busy?: boolean
  error?: string
  isEdit: boolean
  editData?: Sale | null
}>()
defineOptions({ inheritAttrs: false })
</script>
<template><Editor v-bind="{ ...$attrs, ...props }" /></template>
