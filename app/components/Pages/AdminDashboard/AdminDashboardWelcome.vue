<script setup lang="ts">
withDefaults(
  defineProps<{
    name?: string
    ordersToday?: number
    notice?: { productName: string; threshold: number; link?: string } | null
  }>(),
  {
    name: 'Admin',
    ordersToday: 0,
    notice: null,
  },
)
const visible = ref(true)
</script>

<template>
  <section class="space-y-3">
    <div><h1 class="app-page-title">Welcome, {{ name }}</h1><p class="app-page-subtitle">You have <strong class="text-danger">{{ ordersToday }}+</strong> Orders, Today</p></div>
    <div v-if="visible && notice?.productName" class="flex items-start justify-between gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
      <p>Your Product <strong>{{ notice.productName }}</strong> is running Low, already below {{ notice.threshold }} Pcs. <a href="#" class="ml-1 font-semibold text-primary underline" @click.prevent>Add Stock</a></p>
      <button type="button" class="shrink-0 rounded p-1 hover:bg-amber-100 dark:hover:bg-amber-900" aria-label="Close low stock warning" title="Close" @click="visible = false"><FeatherIcon name="x" :size="14" /></button>
    </div>
  </section>
</template>

