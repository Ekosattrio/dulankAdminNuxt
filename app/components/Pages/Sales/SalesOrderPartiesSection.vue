<script setup lang="ts">
import type { SalesDocument } from '#server/types/sales-document'
import SalesCustomerField from '~/components/Sales/SalesCustomerField.vue'
import SalesShippingFields from '~/components/Sales/SalesShippingFields.vue'
import { salesField, salesLabel } from '~/utils/salesUi'

const document = defineModel<SalesDocument>('document', { required: true })
const emit = defineEmits<{ customerSelected: [] }>()
</script>

<template>
  <section class="space-y-5 border-b border-gray-200 pb-5 dark:border-gray-700">
    <div class="grid gap-6 lg:grid-cols-2">
      <SalesCustomerField v-model="document.contact" @select="emit('customerSelected')" />
      <SalesShippingFields v-model="document.shipping" />
    </div>
    <label :class="salesLabel" class="max-w-md">
      PO
      <input v-model="document.po" :class="salesField" placeholder="Invoice No" />
    </label>
  </section>
</template>
