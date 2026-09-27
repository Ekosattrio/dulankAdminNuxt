<script setup lang="ts">
import type { DeliveryNote, DeliveryNoteFormData } from '#server/types/delivery-note'
import Editor from '~/components/pages/delivery-note/DeliveryNoteEditor.vue'
const props = defineProps<{
  isOpen: boolean
  busy?: boolean
  error?: string
  isEdit: boolean
  editData?: DeliveryNote | null
}>()
defineOptions({ inheritAttrs: false })
</script>
<template><Editor v-bind="{ ...$attrs, ...props }" /></template>
