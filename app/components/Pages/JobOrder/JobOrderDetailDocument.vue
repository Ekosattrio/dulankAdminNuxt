<script setup lang="ts">
import type { JobOrder, JobOrderInfoItem } from '#server/types/job-order'
import SalesActionButton from '~/components/Sales/SalesActionButton.vue'

const props = defineProps<{ jobOrder: JobOrder }>()

function displayValue(value: unknown): string {
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  return String(value ?? '-') || '-'
}

const inputSpecifications = computed<JobOrderInfoItem[]>(() => Object.entries(props.jobOrder.inputSpecs ?? {}).map(([label, value]) => ({
  id: `input-${label}`, label, value: displayValue(value),
})))
const outputSpecifications = computed<JobOrderInfoItem[]>(() => Object.entries(props.jobOrder.outputSpecs ?? {}).map(([label, value]) => ({
  id: `output-${label}`, label, value: displayValue(value),
})))

function printDocument() { window.print() }
</script>

<template>
  <div class="space-y-4">
    <div class="print:hidden flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div><h1 class="app-page-title">Job Order Detail</h1><p class="app-page-subtitle">{{ jobOrder.no }}</p></div>
      <div class="flex flex-wrap items-center gap-2">
        <NuxtLink to="/job-order" class="inline-flex h-9 items-center gap-2 rounded-md border border-gray-200 bg-white px-3 text-sm font-semibold text-gray-700 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"><FeatherIcon name="arrow-left" :size="14" /> Back</NuxtLink>
        <NuxtLink :to="{ path: '/edit-job-order', query: { id: jobOrder.id, mode: 'edit' } }"><SalesActionButton action="edit" label="Edit Job Order" /></NuxtLink>
        <SalesActionButton action="print" label="Print" @click="printDocument" />
      </div>
    </div>

    <article id="job-order-detail" class="mx-auto max-w-5xl overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm print:max-w-none print:border-0 print:shadow-none dark:border-gray-800 dark:bg-gray-900">
      <header class="flex flex-col gap-3 border-b-2 border-gray-900 p-5 sm:flex-row sm:items-start sm:justify-between dark:border-gray-100">
        <div><h2 class="app-dialog-title uppercase tracking-wide">Job Order Detail</h2><p class="text-sm font-bold text-primary">{{ jobOrder.no }}</p></div>
        <div class="text-sm sm:text-right"><p class="font-bold text-gray-900 dark:text-white">PT. DULANK SEMESTA CIDA</p><p class="text-gray-500">Production Management</p><span class="mt-2 inline-flex rounded-full border border-sky-200 bg-sky-50 px-2 py-1 text-xs font-semibold text-sky-700">{{ jobOrder.status }}</span></div>
      </header>

      <div class="overflow-x-auto p-5">
        <table class="w-full min-w-[620px] border-collapse text-sm text-gray-700 dark:text-gray-300">
          <tbody>
            <tr class="bg-gray-100 font-bold dark:bg-gray-800"><td colspan="2" class="border border-gray-300 p-2 dark:border-gray-700">Sales Information</td></tr>
            <tr v-for="row in [['Sales Date', jobOrder.salesDate], ['No Sales', jobOrder.salesNo], ['Customer', jobOrder.customer], ['Shipping', jobOrder.shipping], ['Order Summary', jobOrder.orderSummary], ['Due Date', jobOrder.dueDate]]" :key="String(row[0])">
              <td class="w-1/3 border border-gray-200 p-2 font-semibold dark:border-gray-800">{{ row[0] }}</td><td class="border border-gray-200 p-2 dark:border-gray-800">{{ row[1] || '-' }}</td>
            </tr>
            <tr class="bg-gray-100 font-bold dark:bg-gray-800"><td colspan="2" class="border border-gray-300 p-2 dark:border-gray-700">Product Detail No. 1</td></tr>
            <tr v-for="row in [['Category', jobOrder.workflowCategory], ['Product Name', jobOrder.product], ['Job Title', jobOrder.jobTitle], ['Description', jobOrder.description], ['Quantity', jobOrder.qty], ['Priority', jobOrder.priority]]" :key="String(row[0])">
              <td class="border border-gray-200 p-2 font-semibold dark:border-gray-800">{{ row[0] }}</td><td class="border border-gray-200 p-2 dark:border-gray-800">{{ row[1] || '-' }}</td>
            </tr>
            <tr v-for="info in inputSpecifications" :key="info.id"><td class="border border-gray-200 p-2 font-semibold capitalize dark:border-gray-800">{{ info.label }}</td><td class="border border-gray-200 p-2 dark:border-gray-800">{{ info.value || '-' }}</td></tr>

            <template v-for="(step, index) in jobOrder.steps" :key="step.id || `${step.name}-${index}`">
              <tr class="bg-gray-50 dark:bg-gray-800/60"><td class="border border-gray-200 p-2 font-bold dark:border-gray-800">Flow No. {{ index + 1 }}</td><td class="border border-gray-200 p-2 font-bold text-primary dark:border-gray-800">{{ step.name }}</td></tr>
              <tr v-if="step.flowType"><td class="border border-gray-200 p-2 font-semibold dark:border-gray-800">Flow Type</td><td class="border border-gray-200 p-2 dark:border-gray-800">{{ step.flowType }}</td></tr>
              <tr v-if="step.branch"><td class="border border-gray-200 p-2 font-semibold dark:border-gray-800">Branch Store</td><td class="border border-gray-200 p-2 dark:border-gray-800">{{ step.branch }}</td></tr>
              <tr v-if="step.expenseName"><td class="border border-gray-200 p-2 font-semibold dark:border-gray-800">Expense Name</td><td class="border border-gray-200 p-2 dark:border-gray-800">{{ step.expenseName }}</td></tr>
              <tr v-for="info in step.infoList" :key="info.id"><td class="border border-gray-200 p-2 font-semibold dark:border-gray-800">{{ info.label }}</td><td class="border border-gray-200 p-2 dark:border-gray-800">{{ info.value || '-' }}</td></tr>
              <tr v-for="info in step.afterInfoList" :key="info.id"><td class="border border-gray-200 p-2 font-semibold dark:border-gray-800">{{ info.label }}</td><td class="border border-gray-200 p-2 dark:border-gray-800">{{ info.value || '-' }}</td></tr>
            </template>

            <template v-if="outputSpecifications.length">
              <tr class="bg-gray-100 font-bold dark:bg-gray-800"><td colspan="2" class="border border-gray-300 p-2 dark:border-gray-700">Completion Information</td></tr>
              <tr v-for="info in outputSpecifications" :key="info.id"><td class="border border-gray-200 p-2 font-semibold capitalize dark:border-gray-800">{{ info.label }}</td><td class="border border-gray-200 p-2 dark:border-gray-800">{{ info.value || '-' }}</td></tr>
            </template>
          </tbody>
        </table>
      </div>
    </article>
  </div>
</template>
