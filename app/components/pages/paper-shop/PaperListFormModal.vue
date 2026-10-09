<script setup lang="ts">
import type { PaperItem, PaperItemFormData, PaperGroup, PaperSize } from '#server/types/paper-shop'
import SalesDialog from '~/components/sales/SalesDialog.vue'
import PaperListAddForm from '~/components/pages/paper-shop/PaperListAddForm.vue'
import PaperListEditForm from '~/components/pages/paper-shop/PaperListEditForm.vue'

const props = defineProps<{
  open: boolean
  item: PaperItem | null
  groups: PaperGroup[]
  sizes?: PaperSize[]
  busy?: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', payload: PaperItemFormData): void
}>()
</script>

<template>
  <SalesDialog
    :open="open"
    :title="item ? 'Edit Paper List' : 'Add New Paper Item'"
    size="lg"
    @close="emit('close')"
  >
    <PaperListEditForm
      v-if="item"
      :item="item"
      :busy="busy"
      @close="emit('close')"
      @submit="(payload) => emit('submit', payload)"
    />
    <PaperListAddForm
      v-else
      :groups="groups"
      :sizes="sizes"
      :busy="busy"
      @close="emit('close')"
      @submit="(payload) => emit('submit', payload)"
    />
  </SalesDialog>
</template>
