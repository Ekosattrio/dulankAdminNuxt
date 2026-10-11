<script setup lang="ts">
import type { SaleFormData } from '#server/types/sale'
import SalesDocumentForm from './SalesDocumentForm.vue'

defineProps<{ busy?: boolean; error?: string; message?: string }>()
const emit = defineEmits<{ submit: [payload: SaleFormData] }>()
</script>

<template>
  <div class="space-y-5">
    <header class="flex flex-wrap items-start justify-between gap-4">
      <h1 class="app-page-title">Add sales</h1>
      <NuxtLink
        to="/sales"
        class="inline-flex h-9 items-center gap-2 rounded-md bg-gray-800 px-4 text-sm font-semibold text-white shadow-sm hover:bg-gray-700"
      >
        <FeatherIcon name="arrow-left" :size="16" />Back to sales List
      </NuxtLink>
    </header>
    <p v-if="message" role="status" class="rounded-md bg-emerald-50 p-3 text-sm text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">
      {{ message }}
    </p>
    <div class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6 dark:border-gray-800 dark:bg-gray-900">
      <SalesDocumentForm
        :busy="busy"
        :error="error"
        @cancel="navigateTo('/sales')"
        @submit="emit('submit', $event)"
      />
    </div>
  </div>
</template>
