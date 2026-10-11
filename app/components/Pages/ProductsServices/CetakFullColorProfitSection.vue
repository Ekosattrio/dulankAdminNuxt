<script setup lang="ts">
import type { CetakFullColorProfitSettings } from '#server/types/cetak-full-color'
import FeatherIcon from '~/components/Common/FeatherIcon.vue'
import CurrencyInput from '~/components/Common/CurrencyInput.vue'
import SalesActionButton from '~/components/Sales/SalesActionButton.vue'
import { formControlClass } from '~/utils/salesUi'

const props = defineProps<{ settings: CetakFullColorProfitSettings; busy?: boolean }>()
const emit = defineEmits<{ 'update:settings': [settings: CetakFullColorProfitSettings]; save: [] }>()

const draft = ref<CetakFullColorProfitSettings>(structuredClone(toRaw(props.settings)))
watch(() => props.settings, value => { draft.value = structuredClone(toRaw(value)) }, { deep: true })

function publish(save = false) {
  emit('update:settings', structuredClone(toRaw(draft.value)))
  if (save) nextTick(() => emit('save'))
}

function addRange() {
  draft.value.ranges.push({ id: `profit-range-${Date.now()}`, from: null, to: null, posPercent: null, webstorePercent: null })
  publish()
}

function addFee() {
  draft.value.additionalFees.push({ id: `additional-fee-${Date.now()}`, name: 'New Additional Fees', amount: null, unit: 'Per Pekerjaan/Job' })
  publish()
}

function addTax() {
  draft.value.taxes.push({ id: `tax-${Date.now()}`, name: 'New TAX', percent: null })
  publish()
}
</script>

<template>
  <section class="space-y-5 rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
    <div class="flex flex-wrap items-start justify-between gap-3">
      <h4 class="app-section-title text-gray-900 dark:text-white">Profit Setting</h4>
      <span class="text-sm italic text-gray-500">Update : {{ draft.updatedLabel }}</span>
    </div>

    <div class="border-t border-gray-100 pt-4 dark:border-gray-800">
      <p class="mb-3 text-sm text-gray-800 dark:text-gray-200">Profit Markup Options :</p>
      <label class="flex cursor-pointer items-center gap-2 text-sm">
        <input v-model="draft.mode" type="radio" value="production-cost" class="size-4 border-gray-300 text-primary" @change="publish()" />
        <span>Profit Markup on Production Cost</span>
      </label>
      <div class="mt-3 grid gap-3 md:ml-10 md:grid-cols-[minmax(220px,1fr)_minmax(180px,1fr)_minmax(180px,1fr)] md:items-center">
        <label class="text-xs font-semibold text-gray-700 dark:text-gray-300">Profit percentage based on the total production cost</label>
        <label class="flex h-9 items-center rounded-md border border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-900">
          <span class="whitespace-nowrap border-r border-gray-200 px-3 text-xs dark:border-gray-700">Set POS Profit %</span>
          <input v-model.number="draft.productionCostPosPercent" type="number" min="0" class="h-full min-w-0 flex-1 bg-transparent px-2 text-sm outline-none" @change="publish()" />
        </label>
        <label class="flex h-9 items-center rounded-md border border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-900">
          <span class="whitespace-nowrap border-r border-gray-200 px-3 text-xs dark:border-gray-700">Set Webstore Profit %</span>
          <input v-model.number="draft.productionCostWebstorePercent" type="number" min="0" class="h-full min-w-0 flex-1 bg-transparent px-2 text-sm outline-none" @change="publish()" />
        </label>
      </div>
    </div>

    <div>
      <label class="flex cursor-pointer items-center gap-2 text-sm">
        <input v-model="draft.mode" type="radio" value="production-cost-range" class="size-4 border-gray-300 text-primary" @change="publish()" />
        <span>Profit markup based on the total production cost range</span>
      </label>
      <div :class="['mt-3 space-y-3 overflow-x-auto md:ml-10', draft.mode !== 'production-cost-range' && 'opacity-60']">
        <div v-for="(range, index) in draft.ranges" :key="range.id" class="grid min-w-[760px] grid-cols-[140px_140px_180px_200px_40px] items-center gap-3">
          <label class="flex items-center gap-2 text-xs">From <CurrencyInput v-model="range.from" :min="0" @change="publish()" /></label>
          <label class="flex items-center gap-2 text-xs">To <span v-if="index === draft.ranges.length - 1" class="flex h-9 flex-1 items-center rounded-md border border-gray-300 px-3 text-sm">So on</span><CurrencyInput v-else v-model="range.to" :min="0" @change="publish()" /></label>
          <label class="flex items-center gap-2 text-xs">POS % <input v-model.number="range.posPercent" type="number" min="0" :class="formControlClass" @change="publish()" /></label>
          <label class="flex items-center gap-2 text-xs">Webstore % <input v-model.number="range.webstorePercent" type="number" min="0" :class="formControlClass" @change="publish()" /></label>
          <SalesActionButton v-if="index > 0 && index < draft.ranges.length - 1" action="delete" label="Delete cost range" @click="draft.ranges.splice(index, 1); publish()" />
        </div>
        <button type="button" class="inline-flex h-9 items-center gap-2 text-sm font-semibold text-[#c98520]" @click="addRange"><FeatherIcon name="plus" :size="14" /> Add Cost Range</button>
      </div>
    </div>

    <div class="border-t border-gray-100 pt-4 dark:border-gray-800">
      <div class="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h5 class="text-sm font-semibold">Additional Fees</h5>
        <button type="button" class="inline-flex h-9 items-center gap-2 rounded-md bg-[#ff9f43] px-3 text-sm font-semibold text-white" @click="addFee"><FeatherIcon name="plus" :size="14" /> Add New Additional Fees</button>
      </div>
      <div v-for="(fee, index) in draft.additionalFees" :key="fee.id" class="grid gap-3 border-b border-gray-100 py-3 md:grid-cols-[minmax(180px,1fr)_minmax(180px,1fr)_minmax(170px,1fr)_40px] md:items-center dark:border-gray-800">
        <input v-model="fee.name" :class="formControlClass" aria-label="Fee name" @change="publish()" />
        <CurrencyInput v-model="fee.amount" :min="0" align="left" @change="publish()" />
        <input v-model="fee.unit" :class="formControlClass" aria-label="Fee unit" @change="publish()" />
        <SalesActionButton action="delete" :label="`Delete ${fee.name}`" @click="draft.additionalFees.splice(index, 1); publish()" />
      </div>
    </div>

    <div class="border-t border-gray-100 pt-4 dark:border-gray-800">
      <div class="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h5 class="text-sm font-semibold">Additional TAX Charge</h5>
        <button type="button" class="inline-flex h-9 items-center gap-2 rounded-md bg-[#ff9f43] px-3 text-sm font-semibold text-white" @click="addTax"><FeatherIcon name="plus" :size="14" /> Add New Additional TAX Charge</button>
      </div>
      <div v-for="(tax, index) in draft.taxes" :key="tax.id" class="grid gap-3 border-b border-gray-100 py-3 md:grid-cols-[minmax(180px,1fr)_minmax(180px,1fr)_40px] md:items-center dark:border-gray-800">
        <input v-model="tax.name" :class="formControlClass" aria-label="Tax name" @change="publish()" />
        <label class="flex h-9 items-center rounded-md border border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-900"><input v-model.number="tax.percent" type="number" min="0" class="h-full min-w-0 flex-1 bg-transparent px-3 text-sm outline-none" @change="publish()" /><span class="px-3 text-sm">%</span></label>
        <SalesActionButton action="delete" :label="`Delete ${tax.name}`" @click="draft.taxes.splice(index, 1); publish()" />
      </div>
    </div>

    <div class="flex justify-end gap-2 border-t border-gray-100 pt-4 dark:border-gray-800">
      <button type="button" class="h-9 rounded-md bg-gray-800 px-4 text-sm font-semibold text-white">Cancel</button>
      <button type="button" class="h-9 rounded-md bg-primary px-4 text-sm font-semibold text-white disabled:opacity-50" :disabled="busy" @click="publish(true)">Save</button>
    </div>
  </section>
</template>
