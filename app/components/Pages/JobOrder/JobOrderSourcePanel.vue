<script setup lang="ts">
import type { JobOrderContext, JobOrderFormData } from '#server/types/job-order'

const props = defineProps<{ context: JobOrderContext }>()
const form = defineModel<JobOrderFormData>({ required: true })

const items = computed(() => props.context.order?.items ?? [])
const salesRows = computed(() => [
  ['Sales Date', props.context.jobOrder?.salesDate || props.context.order?.orderDate],
  ['No Sales', props.context.jobOrder?.salesNo || props.context.order?.no],
  ['Customer', props.context.jobOrder?.customer || props.context.order?.customer],
  ['Shipping', props.context.jobOrder?.shipping || props.context.order?.shipping],
  ['Order Summary', props.context.jobOrder?.orderSummary || `${items.value.length} Products`],
])

function chooseProduct(index: number) {
  const item = items.value[index]
  if (!item) return
  form.value.productId = item.productId
  form.value.product = item.productName
  form.value.qty = item.qty
}
</script>

<template>
  <aside class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
    <h2 class="app-section-title mb-5">Sales Information</h2>
    <dl class="space-y-3 text-sm">
      <div v-for="row in salesRows" :key="String(row[0])" class="grid grid-cols-12 gap-3">
        <dt class="col-span-5 text-gray-500">{{ row[0] }}</dt><dd class="col-span-7 font-semibold text-gray-900 dark:text-gray-100">{{ row[1] || '-' }}</dd>
      </div>
    </dl>

    <h2 class="app-section-title mb-3 mt-7 border-t border-gray-100 pt-5 dark:border-gray-800">Order Detail</h2>
    <div v-if="items.length" class="overflow-x-auto">
      <table class="w-full min-w-[360px] text-left text-sm">
        <thead><tr class="border-b border-gray-200 text-gray-500"><th class="p-2 font-medium">Product Name</th><th class="p-2 font-medium">Qty</th><th class="p-2"></th></tr></thead>
        <tbody>
          <tr v-for="(item, index) in items" :key="item.productId" class="border-b border-gray-100 dark:border-gray-800">
            <td class="p-2 font-semibold">{{ item.productName }}</td><td class="p-2">{{ item.qty }}</td>
            <td class="p-2 text-right"><button type="button" class="text-xs font-semibold text-primary" @click="chooseProduct(index)">{{ form.productId === item.productId ? 'Managing' : 'Manage' }}</button></td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else class="rounded-lg border border-dashed border-gray-300 p-4 text-sm text-gray-500">
      <p class="font-semibold text-gray-700 dark:text-gray-200">{{ form.product || 'No stored product detail' }}</p>
      <p>{{ form.jobTitle || 'Job title is not available.' }}</p>
    </div>
  </aside>
</template>
