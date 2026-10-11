<script setup lang="ts">
import type { SubscriptionRecord } from '#server/types/subscription'
import { formatSubscriptionDate } from '~/utils/subscription'

defineProps<{ open: boolean; item: SubscriptionRecord | null }>()
defineEmits<{ close: []; edit: [item: SubscriptionRecord] }>()
</script>

<template>
  <SalesDialog :open="open" title="Subscription Detail" medium @close="$emit('close')">
    <div v-if="item" class="space-y-5">
      <div class="flex flex-wrap items-start justify-between gap-3 rounded-lg bg-gray-50 p-4 dark:bg-gray-800/70">
        <div>
          <p class="app-supporting-text font-semibold uppercase">Subscriber</p>
          <p class="mt-1 app-section-title">{{ item.subscriber }}</p>
        </div>
        <SalesStatusBadge :status="item.status" />
      </div>
      <dl class="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
        <div><dt class="app-supporting-text font-semibold">Plan</dt><dd class="mt-1 text-sm">{{ item.plan }}</dd></div>
        <div><dt class="app-supporting-text font-semibold">Billing Cycle</dt><dd class="mt-1 text-sm">{{ item.billingCycle }}</dd></div>
        <div><dt class="app-supporting-text font-semibold">Payment Method</dt><dd class="mt-1 text-sm">{{ item.paymentMethod }}</dd></div>
        <div><dt class="app-supporting-text font-semibold">Amount</dt><dd class="mt-1"><CurrencyDisplay :value="item.amount" align="left" /></dd></div>
        <div><dt class="app-supporting-text font-semibold">Created Date</dt><dd class="mt-1 text-sm">{{ formatSubscriptionDate(item.createdDate) }}</dd></div>
        <div><dt class="app-supporting-text font-semibold">Expiring On</dt><dd class="mt-1 text-sm">{{ formatSubscriptionDate(item.expiringOn) }}</dd></div>
      </dl>
      <div class="flex justify-end gap-2 border-t border-gray-100 pt-4 dark:border-gray-800">
        <button type="button" :class="salesSecondaryButton" @click="$emit('close')">Close</button>
        <button type="button" :class="salesPrimaryButton" @click="$emit('edit', item)">
          <FeatherIcon name="edit" :size="14" /> Edit
        </button>
      </div>
    </div>
  </SalesDialog>
</template>
