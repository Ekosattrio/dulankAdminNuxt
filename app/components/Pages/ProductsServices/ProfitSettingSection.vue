<script setup lang="ts">
import type { ProfitTier } from '~/composables/useProfitCalculation'
import FeatherIcon from '~/components/Common/FeatherIcon.vue'
import SalesActionButton from '~/components/Sales/SalesActionButton.vue'
import { formControlClass } from '~/utils/salesUi'

const props = defineProps<{
  tiers: ProfitTier[]
  busy?: boolean
}>()

const emit = defineEmits<{
  'update:tiers': [tiers: ProfitTier[]]
  save: []
}>()

const localTiers = ref<ProfitTier[]>(props.tiers ? structuredClone(toRaw(props.tiers)) : [])
watch(() => props.tiers, (val) => {
  if (val) localTiers.value = structuredClone(toRaw(val))
}, { deep: true })

const isAdding = ref(false)
const newFromQty = ref(1)
const newToQty = ref(500)
const newPosProfit = ref(30)
const newWebsiteProfit = ref(25)

function removeTier(index: number) {
  localTiers.value.splice(index, 1)
  emit('update:tiers', localTiers.value)
  emit('save')
}

function addTier() {
  if (newToQty.value < newFromQty.value) return
  localTiers.value.push({
    id: `profit-${Date.now()}`,
    minQty: Number(newFromQty.value) || 1,
    maxQty: Number(newToQty.value) || 100,
    profitPosPercent: Number(newPosProfit.value) || 0,
    profitWebstorePercent: Number(newWebsiteProfit.value) || 0,
  })
  emit('update:tiers', localTiers.value)
  isAdding.value = false
  emit('save')
}

function handleSave() {
  emit('update:tiers', localTiers.value)
  emit('save')
}
</script>

<template>
  <div class="space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
    <div class="flex items-center justify-between border-b border-gray-100 pb-4 dark:border-gray-800">
      <div>
        <h4 class="text-base font-bold text-gray-900 dark:text-white">Profit Setting</h4>
        <p class="text-xs text-gray-500">Configure tiered profit percentages based on order quantity range</p>
      </div>
      <button
        v-if="!isAdding"
        type="button"
        class="inline-flex h-9 items-center gap-1.5 rounded-md bg-amber-500 px-4 text-xs font-semibold text-white shadow-sm hover:bg-amber-600"
        @click="isAdding = true"
      >
        <FeatherIcon name="plus" :size="14" />
        Add Range
      </button>
    </div>

    <!-- Tiered Profit Table -->
    <div class="overflow-x-auto">
      <table class="w-full text-left text-sm">
        <thead class="border-b border-gray-200 bg-gray-50 text-xs font-semibold text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
          <tr>
            <th class="px-5 py-3">From Qty</th>
            <th class="px-5 py-3">To Qty</th>
            <th class="px-5 py-3 text-right">POS Profit %</th>
            <th class="px-5 py-3 text-right">Website Profit %</th>
            <th class="px-5 py-3 text-center">Action</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
          <tr v-for="(tier, idx) in localTiers" :key="tier.id" class="hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
            <td class="px-5 py-3 font-medium text-gray-900 dark:text-white">
              <input
                v-model.number="tier.minQty"
                type="number"
                min="0"
                class="h-8 w-28 rounded border border-gray-300 px-2 text-xs dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              />
            </td>
            <td class="px-5 py-3 font-medium text-gray-900 dark:text-white">
              <input
                v-model.number="tier.maxQty"
                type="number"
                min="0"
                class="h-8 w-28 rounded border border-gray-300 px-2 text-xs dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              />
            </td>
            <td class="px-5 py-3 text-right">
              <div class="inline-flex items-center gap-1">
                <input
                  v-model.number="tier.profitPosPercent"
                  type="number"
                  min="0"
                  max="100"
                  class="h-8 w-20 rounded border border-gray-300 px-2 text-right text-xs dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                />
                <span class="text-xs text-gray-500">%</span>
              </div>
            </td>
            <td class="px-5 py-3 text-right">
              <div class="inline-flex items-center gap-1">
                <input
                  v-model.number="tier.profitWebstorePercent"
                  type="number"
                  min="0"
                  max="100"
                  class="h-8 w-20 rounded border border-gray-300 px-2 text-right text-xs dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                />
                <span class="text-xs text-gray-500">%</span>
              </div>
            </td>
            <td class="px-5 py-3 text-center">
              <div class="flex justify-center">
                <SalesActionButton
                  action="delete"
                  label="Remove profit tier"
                  @click="removeTier(idx)"
                />
              </div>
            </td>
          </tr>

          <!-- Inline Add Form -->
          <tr v-if="isAdding" class="bg-amber-50/50 dark:bg-amber-950/20">
            <td class="px-5 py-2">
              <input v-model.number="newFromQty" type="number" min="1" placeholder="From Qty" :class="formControlClass" />
            </td>
            <td class="px-5 py-2">
              <input v-model.number="newToQty" type="number" min="1" placeholder="To Qty" :class="formControlClass" />
            </td>
            <td class="px-5 py-2 text-right">
              <div class="inline-flex items-center gap-1 justify-end">
                <input v-model.number="newPosProfit" type="number" min="0" max="100" placeholder="%" :class="formControlClass" />
                <span class="text-xs text-gray-500">%</span>
              </div>
            </td>
            <td class="px-5 py-2 text-right">
              <div class="inline-flex items-center gap-1 justify-end">
                <input v-model.number="newWebsiteProfit" type="number" min="0" max="100" placeholder="%" :class="formControlClass" />
                <span class="text-xs text-gray-500">%</span>
              </div>
            </td>
            <td class="px-5 py-2 text-center space-x-2">
              <button type="button" class="h-8 rounded bg-amber-500 px-3 text-xs font-semibold text-white hover:bg-amber-600" @click="addTier">Add</button>
              <button type="button" class="h-8 rounded border border-gray-300 px-2 text-xs text-gray-600 hover:bg-gray-100 dark:text-gray-300" @click="isAdding = false">Cancel</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Save Button -->
    <div class="flex justify-end border-t border-gray-100 pt-4 dark:border-gray-800">
      <button
        type="button"
        class="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-5 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 disabled:opacity-50"
        :disabled="busy"
        @click="handleSave"
      >
        <FeatherIcon name="save" :size="15" />
        {{ busy ? 'Saving...' : 'Save Profit Settings' }}
      </button>
    </div>
  </div>
</template>

