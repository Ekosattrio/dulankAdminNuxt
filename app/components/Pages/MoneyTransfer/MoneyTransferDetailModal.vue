<script setup lang="ts">
import type { MoneyTransferView } from '#server/types/money-transfer'
import CurrencyDisplay from '~/components/Common/CurrencyDisplay.vue'
import SalesDialog from '~/components/Sales/SalesDialog.vue'
defineProps<{ open: boolean; item: MoneyTransferView | null }>()
defineEmits<{ close: [] }>()
</script>
<template>
  <SalesDialog :open="open" title="View Transfer" size="md" @close="$emit('close')">
    <dl v-if="item" class="grid grid-cols-12 gap-x-4 gap-y-3 text-sm">
      <template v-for="row in [{ label: 'Date', value: item.date }, { label: 'No Transfer', value: item.no }, { label: 'From Account', value: item.fromAccount }, { label: 'To Account', value: item.toAccount }, { label: 'Description', value: item.description || '-' }, { label: 'Created By', value: item.createdBy }]" :key="row.label"><dt class="col-span-4 text-xs font-semibold text-gray-500">{{ row.label }}</dt><dd class="col-span-8 text-gray-900 dark:text-white">{{ row.value }}</dd></template>
      <dt class="col-span-4 text-xs font-semibold text-gray-500">Amount</dt><dd class="col-span-8"><CurrencyDisplay :value="item.amount" align="left" bold /></dd>
    </dl>
  </SalesDialog>
</template>

