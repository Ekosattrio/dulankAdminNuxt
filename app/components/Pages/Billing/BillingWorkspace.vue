<script setup lang="ts">
import type { BillingQuery } from '#server/types/billing'
import type { DateRangeValue } from '~/composables/useDateRange'

const search = ref('')
const paymentMethod = ref('')
const status = ref('')
const dateRange = ref<DateRangeValue | null>(null)
const query = computed<BillingQuery>(() => ({ search: search.value || undefined, paymentMethod: paymentMethod.value || undefined, status: status.value || undefined, startDate: dateRange.value?.start, endDate: dateRange.value?.end }))
const { billings, summary, pending, error, refresh } = useBillings(query)
</script>

<template>
  <div class="space-y-6">
    <header><h1 class="app-page-title">Billing List</h1><p class="app-page-subtitle">Manage Billing</p></header>
    <CardSkeleton v-if="pending" :count="3" />
    <BillingStats v-else :summary="summary" />
    <SalesFeedback :pending="pending" skeleton="table" :skeleton-cols="11" :error="error ? 'Unable to load billing records. Please try again.' : ''" @retry="refresh()" />
    <BillingRecordsTable
      v-if="!pending && !error"
      :items="billings" :search="search" :payment-method="paymentMethod" :status="status" :date-range="dateRange"
      @update:search="search = $event" @update:payment-method="paymentMethod = $event" @update:status="status = $event" @update:date-range="dateRange = $event"
    />
  </div>
</template>
