<script setup lang="ts">
import type { Sale } from '#server/types/sale'
defineProps<{ open: boolean; sales: Sale[] }>()
defineEmits<{ close: [] }>()
const { formatRupiah } = useFormatters()
</script>
<template>
  <SalesDialog :open="open" title="Recent Transactions" wide @close="$emit('close')">
    <div class="overflow-x-auto">
      <table class="w-full text-left text-sm [&_th]:p-3 [&_td]:p-3">
        <thead class="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th>Date</th>
            <th>Reference</th>
            <th>Customer</th>
            <th>Amount</th>
            <th>Payment</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="sale in sales" :key="sale.id" class="border-b border-gray-100 dark:border-gray-700">
            <td>{{ sale.date }}</td>
            <td>{{ sale.saleNo }}</td>
            <td>{{ sale.customer }}</td>
            <td>{{ formatRupiah(sale.total) }}</td>
            <td>{{ sale.status }}</td>
          </tr>
          <tr v-if="!sales.length">
            <td colspan="5" class="text-center text-gray-500">No transactions recorded.</td>
          </tr>
        </tbody>
      </table>
    </div>
    <NuxtLink to="/sales" class="mt-5 inline-block text-sm font-semibold text-primary underline"
      >View Sales</NuxtLink
    >
  </SalesDialog>
</template>
