<script setup lang="ts">
import type { Sale, SaleFormData } from '#server/types/sale'
import SalesDocumentForm from './SalesDocumentForm.vue'
import SalesDialog from '~/components/Sales/SalesDialog.vue'

defineProps<{
  isOpen: boolean
  busy?: boolean
  error?: string
  isEdit: boolean
  editData?: Sale | null
}>()
const emit = defineEmits<{ close: []; submit: [form: SaleFormData] }>()
</script>

<template>
  <SalesDialog
    :open="isOpen"
    :title="isEdit ? 'Edit Sales' : 'Add Sales'"
    :busy="busy"
    document
    @close="emit('close')"
  >
    <SalesDocumentForm
      :open="isOpen"
      :is-edit="isEdit"
      :edit-data="editData"
      :busy="busy"
      :error="error"
      @cancel="emit('close')"
      @submit="emit('submit', $event)"
    />
  </SalesDialog>
</template>
