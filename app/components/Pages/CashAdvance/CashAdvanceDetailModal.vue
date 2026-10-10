<script setup lang="ts">
import type { CashAdvanceView } from '#server/types/cash-advance'
import CurrencyDisplay from '~/components/Common/CurrencyDisplay.vue'
import SalesDialog from '~/components/Sales/SalesDialog.vue'
defineProps<{ open: boolean; item: CashAdvanceView | null }>()
defineEmits<{ close: [] }>()
const tab = ref<'debit' | 'credit'>('debit')
</script>
<template>
  <SalesDialog :open="open" title="Cash Advance Details" wide @close="$emit('close')">
    <div v-if="item" class="space-y-4">
      <div class="flex flex-wrap justify-between gap-3 rounded-md bg-gray-50 p-3 dark:bg-gray-800"><div><p class="font-semibold">{{ item.employee }}</p><p class="text-xs text-gray-500">{{ item.date }} | {{ item.note || '-' }}</p></div><div><CurrencyDisplay :value="item.outstanding" bold /><p class="text-xs text-gray-500">Outstanding</p></div></div>
      <div class="flex border-b border-gray-200"><button v-for="value in ['debit', 'credit'] as const" :key="value" type="button" :class="['h-9 px-4 text-sm font-semibold capitalize', tab === value ? 'border-b-2 border-primary text-primary' : 'text-gray-500']" @click="tab = value">{{ value }}</button></div>
      <div class="overflow-x-auto"><table class="w-full text-sm"><thead class="bg-gray-50 dark:bg-gray-800"><tr v-if="tab === 'debit'"><th class="px-3 py-2 text-start">Date</th><th class="px-3 py-2 text-end">Amount</th><th class="px-3 py-2 text-end">Installment</th><th class="px-3 py-2">Period</th><th class="px-3 py-2">Tenor</th><th class="px-3 py-2">Note</th></tr><tr v-else><th class="px-3 py-2 text-start">Date</th><th class="px-3 py-2 text-end">Payment</th></tr></thead><tbody class="divide-y divide-gray-100 dark:divide-gray-800">
        <template v-if="tab === 'debit'"><tr v-for="entry in item.history" :key="entry.id"><td class="px-3 py-2">{{ entry.date }}</td><td class="px-3 py-2 text-end"><CurrencyDisplay :value="entry.amount" /></td><td class="px-3 py-2 text-end"><CurrencyDisplay :value="entry.installment" /></td><td class="px-3 py-2 text-center">{{ entry.period }}</td><td class="px-3 py-2 text-center">{{ entry.tenorTotal }}</td><td class="px-3 py-2">{{ entry.note }}</td></tr></template>
        <template v-else><tr v-for="payment in item.payments" :key="payment.id"><td class="px-3 py-2">{{ payment.date }}</td><td class="px-3 py-2 text-end"><CurrencyDisplay :value="payment.amount" /></td></tr><tr v-if="item.payments.length === 0"><td colspan="2" class="px-3 py-8 text-center text-gray-500">No payment records yet</td></tr></template>
      </tbody></table></div>
    </div>
  </SalesDialog>
</template>

