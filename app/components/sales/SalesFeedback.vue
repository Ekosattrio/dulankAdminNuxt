<script setup lang="ts">
import TableSkeleton from '~/components/common/TableSkeleton.vue'
import CardSkeleton from '~/components/common/CardSkeleton.vue'
import FeatherIcon from '~/components/common/FeatherIcon.vue'

withDefaults(
  defineProps<{
    pending?: boolean
    error?: string
    message?: string
    skeleton?: 'table' | 'card' | 'none' | boolean
    skeletonRows?: number
    skeletonCols?: number
  }>(),
  {
    pending: false,
    error: '',
    message: '',
    skeleton: 'none',
    skeletonRows: 6,
    skeletonCols: 7,
  },
)

defineEmits<{ retry: []; dismiss: [] }>()
</script>

<template>
  <div>
    <!-- Error Alert -->
    <div
      v-if="error"
      role="alert"
      class="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400"
    >
      <div class="flex items-center gap-2">
        <FeatherIcon name="alert-circle" :size="16" />
        <span>{{ error }}</span>
      </div>
      <button
        type="button"
        class="font-semibold underline hover:text-red-800 dark:hover:text-red-300"
        @click="$emit('retry')"
      >
        Retry
      </button>
    </div>

    <!-- Message Alert -->
    <div
      v-if="message"
      role="status"
      class="mb-4 flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-400"
    >
      <div class="flex items-center gap-2">
        <FeatherIcon name="check-circle" :size="16" />
        <span>{{ message }}</span>
      </div>
      <button
        type="button"
        aria-label="Dismiss notification"
        class="text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-200"
        @click="$emit('dismiss')"
      >
        <FeatherIcon name="x" :size="16" />
      </button>
    </div>

    <!-- Skeleton Loader or Fallback Loading State -->
    <template v-if="pending">
      <TableSkeleton
        v-if="skeleton === 'table' || skeleton === true"
        :rows="skeletonRows"
        :cols="skeletonCols"
      />
      <CardSkeleton
        v-else-if="skeleton === 'card'"
      />
      <p
        v-else
        role="status"
        class="py-8 text-center text-sm text-gray-500 dark:text-gray-400"
      >
        Loading records…
      </p>
    </template>

    <!-- Default Content Slot when Ready -->
    <slot v-else-if="!error" />
  </div>
</template>
