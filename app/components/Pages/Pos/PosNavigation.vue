<script setup lang="ts">
defineProps<{ heldCount: number }>()
const emit = defineEmits<{ orders: []; reset: []; transactions: [] }>()
</script>
<template>
  <header
    class="flex min-h-14 flex-wrap gap-3 py-3 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm dark:border-gray-800 dark:bg-gray-900"
  >
    <div class="flex flex-wrap items-center gap-3">
      <NuxtLink
        to="/"
        class="flex items-center gap-2 rounded-lg bg-secondary px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-secondary/90"
      >
        <FeatherIcon name="home" size="14" />
        <span>Dashboard Admin</span>
      </NuxtLink>

      <button
        type="button"
        class="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
        @click="emit('orders')"
      >
        <FeatherIcon name="shopping-cart" size="14" />
        <span>View Orders</span>
        <span v-if="heldCount > 0" class="rounded-full bg-amber-500 px-1.5 py-0.2 text-[10px] text-white">
          {{ heldCount }}
        </span>
      </button>

      <button
        type="button"
        class="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
        @click="emit('reset')"
      >
        <FeatherIcon name="rotate-cw" size="14" />
        <span>Reset</span>
      </button>

      <button
        type="button"
        class="flex items-center gap-1.5 rounded-lg border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/10"
        @click="emit('transactions')"
      >
        <FeatherIcon name="refresh-ccw" size="14" />
        <span>Transaction</span>
      </button>
    </div>

    <div class="flex items-center gap-3">
      <span class="text-xs font-semibold text-gray-700 dark:text-gray-300">Dulank Printing POS</span>
      <span class="h-2 w-2 rounded-full bg-emerald-500"></span>
    </div>
  </header>
</template>
