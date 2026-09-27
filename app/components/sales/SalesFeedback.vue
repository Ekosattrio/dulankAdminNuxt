<script setup lang="ts">
defineProps<{ pending?: boolean; error?: string; message?: string }>()
defineEmits<{ retry: []; dismiss: [] }>()
</script>

<template>
  <div
    v-if="error"
    role="alert"
    class="mb-4 flex flex-wrap items-center justify-between gap-3 rounded border border-red-200 bg-red-50 p-4 text-sm text-red-700"
  >
    <span>{{ error }}</span
    ><button type="button" class="font-semibold underline" @click="$emit('retry')">Retry</button>
  </div>
  <div
    v-if="message"
    role="status"
    class="mb-4 flex items-center justify-between rounded border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700"
  >
    <span>{{ message }}</span
    ><button type="button" aria-label="Dismiss notification" @click="$emit('dismiss')">
      <FeatherIcon name="x" :size="16" />
    </button>
  </div>
  <p v-if="pending" role="status" class="py-8 text-center text-sm text-gray-500">Loading records…</p>
</template>
