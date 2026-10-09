<script setup lang="ts">
import type { CustomerBalanceRow } from '#server/types/finance-report'
import CurrencyDisplay from '~/components/common/CurrencyDisplay.vue'
import SalesDialog from '~/components/sales/SalesDialog.vue'
defineProps<{ open: boolean; item: CustomerBalanceRow | null }>()
defineEmits<{ close: [] }>()
</script>
<template>
  <SalesDialog :open="open" title="Customer Balance Details" size="md" @close="$emit('close')">
    <dl v-if="item" class="grid grid-cols-12 gap-x-4 gap-y-3 text-sm">
      <dt class="col-span-5 text-xs font-semibold text-gray-500">Customer ID</dt><dd class="col-span-7 font-mono">{{ item.customerId }}</dd>
      <dt class="col-span-5 text-xs font-semibold text-gray-500">Name</dt><dd class="col-span-7">{{ item.name }}</dd>
      <dt class="col-span-5 text-xs font-semibold text-gray-500">Type</dt><dd class="col-span-7">{{ item.type }}</dd>
      <dt class="col-span-5 text-xs font-semibold text-gray-500">Ledger Entries</dt><dd class="col-span-7 tabular-nums">{{ item.entryCount }}</dd>
      <dt class="col-span-5 text-xs font-semibold text-gray-500">Current Balance</dt><dd class="col-span-7"><CurrencyDisplay :value="item.balance" align="left" bold /></dd>
    </dl>
  </SalesDialog>
</template>

