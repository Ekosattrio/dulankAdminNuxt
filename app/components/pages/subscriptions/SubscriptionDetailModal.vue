<script setup lang="ts">
import type { SubscriptionItem } from '#server/types/subscription'
import SalesDialog from '~/components/sales/SalesDialog.vue'
import FeatherIcon from '~/components/common/FeatherIcon.vue'
import { formatIDR } from '~/utils/currency'

defineProps<{
  open: boolean
  subscription: SubscriptionItem | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'print', subscription: SubscriptionItem): void
}>()
</script>

<template>
  <SalesDialog
    :open="open"
    :title="subscription ? `Invoice Detail - ${subscription.subscriber}` : 'Invoice Detail'"
    max-width-class="max-w-lg"
    @close="emit('close')"
  >
    <div v-if="subscription" class="space-y-4">
      <div class="grid grid-cols-2 gap-2 text-sm">
        <span class="text-gray-500">Subscriber</span>
        <span class="text-end font-semibold text-gray-900 dark:text-white">{{ subscription.subscriber }}</span>

        <span class="text-gray-500">Plan</span>
        <span class="text-end text-gray-700 dark:text-gray-300">{{ subscription.plan }}</span>

        <span class="text-gray-500">Billing Cycle</span>
        <span class="text-end text-gray-700 dark:text-gray-300">{{ subscription.billingCycle }}</span>

        <span class="text-gray-500">Payment Method</span>
        <span class="text-end text-gray-700 dark:text-gray-300">{{ subscription.method }}</span>

        <span class="text-gray-500">Created Date</span>
        <span class="text-end text-gray-700 dark:text-gray-300">{{ subscription.createdDate }}</span>

        <span class="text-gray-500">Expiring On</span>
        <span class="text-end text-gray-700 dark:text-gray-300">{{ subscription.expiringOn }}</span>

        <span class="text-gray-500">Status</span>
        <span class="text-end">
          <span
            :class="[
              'inline-block px-2 py-0.5 rounded-full text-xs font-semibold',
              subscription.status === 'Paid'
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
            ]"
          >
            {{ subscription.status }}
          </span>
        </span>
      </div>

      <div class="border-t border-gray-200 pt-3 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <span class="font-bold text-gray-900 dark:text-white">Amount Total</span>
          <span class="text-lg font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
            {{ formatIDR(subscription.amount) }}
          </span>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex items-center justify-end gap-2">
        <button
          type="button"
          class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          @click="emit('close')"
        >
          Close
        </button>
        <button
          v-if="subscription"
          type="button"
          class="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover"
          @click="emit('print', subscription)"
        >
          <FeatherIcon name="printer" size="14" />
          <span>Print</span>
        </button>
      </div>
    </template>
  </SalesDialog>
</template>

