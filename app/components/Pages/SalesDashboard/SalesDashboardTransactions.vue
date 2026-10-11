<script setup lang="ts">
import type { SalesDashboardTransaction } from '#server/types/sales-dashboard'
defineProps<{ items: SalesDashboardTransaction[] }>()
defineEmits<{ view: [item: SalesDashboardTransaction] }>()
</script>

<template>
  <section class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 xl:col-span-8">
    <header class="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-gray-800"><h2 class="app-section-title">Recent Transactions</h2><NuxtLink to="/sales" class="flex items-center text-sm font-semibold text-primary">View All <FeatherIcon name="arrow-right" :size="14" class="ms-1" /></NuxtLink></header>
    <div class="overflow-x-auto"><table :class="salesDocumentTable"><thead><tr><th>#</th><th>Order Details</th><th>Payment</th><th>Status</th><th class="text-end">Amount</th></tr></thead><tbody>
      <tr v-for="item in items" :key="item.id" class="cursor-pointer" @click="$emit('view', item)"><td>{{ item.id }}</td><td><span class="flex min-w-48 items-center gap-3"><img :src="item.image" :alt="item.name" class="size-10 rounded-lg object-contain" /><span><strong class="block">{{ item.name }}</strong><small class="text-xs text-gray-500">{{ item.time }}</small></span></span></td><td><strong class="block">{{ item.paymentMethod }}</strong><small class="text-xs text-blue-600">{{ item.reference }}</small></td><td><SalesStatusBadge :status="item.status" /></td><td class="text-end font-semibold">${{ item.amount.toLocaleString('en-US', { minimumFractionDigits: 2 }) }}</td></tr>
    </tbody></table></div>
  </section>
</template>
