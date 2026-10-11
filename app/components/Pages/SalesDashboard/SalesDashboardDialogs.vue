<script setup lang="ts">
import type { SalesDashboardBestSeller, SalesDashboardTransaction } from '#server/types/sales-dashboard'
defineProps<{ transaction: SalesDashboardTransaction | null; product: SalesDashboardBestSeller | null }>()
defineEmits<{ closeTransaction: []; closeProduct: [] }>()
</script>

<template>
  <SalesDialog :open="!!transaction" title="Transaction Details" @close="$emit('closeTransaction')"><dl v-if="transaction" class="grid grid-cols-[8rem_1fr] gap-3 text-sm"><dt>Order Details</dt><dd class="font-semibold">{{ transaction.name }}</dd><dt>Payment</dt><dd>{{ transaction.paymentMethod }}</dd><dt>Reference</dt><dd>{{ transaction.reference }}</dd><dt>Status</dt><dd><SalesStatusBadge :status="transaction.status" /></dd><dt>Amount</dt><dd>${{ transaction.amount.toLocaleString('en-US', { minimumFractionDigits: 2 }) }}</dd><dt>Date</dt><dd>{{ transaction.date }}</dd></dl></SalesDialog>
  <SalesDialog :open="!!product" title="Product Details" @close="$emit('closeProduct')"><div v-if="product" class="flex gap-4 text-sm"><img :src="product.image" :alt="product.name" class="size-24 rounded-lg object-contain" /><dl class="grid grid-cols-[6rem_1fr] gap-2"><dt>Product</dt><dd class="font-semibold">{{ product.name }}</dd><dt>Category</dt><dd>{{ product.category }}</dd><dt>Price</dt><dd>${{ product.price.toLocaleString() }}</dd><dt>Sales</dt><dd>{{ product.sales.toLocaleString() }}</dd><dt>Stock</dt><dd>{{ product.stock }}</dd></dl></div></SalesDialog>
</template>
