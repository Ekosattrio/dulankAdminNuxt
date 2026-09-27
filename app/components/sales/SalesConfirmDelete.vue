<script setup lang="ts">
defineProps<{ open: boolean; busy?: boolean; error?: string }>()
defineEmits<{ close: []; confirm: [] }>()
</script>
<template>
  <SalesDialog :open="open" title="Delete record" @close="!busy && $emit('close')">
    <p class="text-sm text-gray-600 dark:text-gray-300">Are you sure you want to delete this record?</p>
    <p v-if="error" role="alert" class="mt-3 text-sm text-red-600">{{ error }}</p>
    <div class="mt-6 flex justify-end gap-3">
      <button
        type="button"
        :disabled="busy"
        class="rounded border border-gray-200 px-4 py-2 text-sm disabled:opacity-50"
        @click="$emit('close')"
      >
        Cancel
      </button>
      <button
        type="button"
        :disabled="busy"
        class="rounded bg-red-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        @click="$emit('confirm')"
      >
        {{ busy ? 'Deleting…' : 'Delete' }}
      </button>
    </div>
  </SalesDialog>
</template>
