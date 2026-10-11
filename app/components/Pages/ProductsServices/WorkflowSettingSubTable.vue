<script setup lang="ts">
import type { CetakFullColorWorkflow } from '#server/types/cetak-full-color'
import FeatherIcon from '~/components/Common/FeatherIcon.vue'
import CurrencyInput from '~/components/Common/CurrencyInput.vue'
import SalesActionButton from '~/components/Sales/SalesActionButton.vue'
import { formatMoney } from '~/utils/currency'
import { formControlClass } from '~/utils/salesUi'
import ConfigurationMultiSelect from './ConfigurationMultiSelect.vue'

export type WorkflowItem = CetakFullColorWorkflow

const props = withDefaults(defineProps<{
  title?: string
  items?: WorkflowItem[]
  targetLabel?: string
  options?: string[]
  addLabel?: string
}>(), {
  title: 'Work Flow Setting',
  targetLabel: 'Effective Paper Group',
  options: () => [],
  addLabel: 'Add Flow Name',
})

const emit = defineEmits<{
  'update:items': [items: WorkflowItem[]]
  save: []
}>()

const isAdding = ref(false)
const fallbackItems = ref<WorkflowItem[]>([
  { id: 'wf-1', category: 'Pracetak', name: 'Pesan Kertas ke Toko', assignee: 'Nurdin', incentiveAmount: 5000, incentiveUnit: 'per Job', targets: ['Art Paper', 'Art Carton', 'HVS', 'Carton BC'] },
  { id: 'wf-2', category: 'Finishing', name: 'Potong & Sisir Kertas', assignee: 'Budi Santoso', incentiveAmount: 3000, incentiveUnit: 'per Job', targets: ['Art Paper', 'Art Carton'] },
])
const displayedItems = computed(() => props.items ?? fallbackItems.value)
const newItem = reactive<Omit<WorkflowItem, 'id'>>({
  category: 'Pracetak',
  name: '',
  assignee: '',
  incentiveAmount: 5000,
  incentiveUnit: 'per Job',
  targets: [],
})

const availableOptions = computed(() => {
  const combined = [...props.options, ...displayedItems.value.flatMap(item => item.targets)]
  return [...new Set(combined.filter(Boolean))]
})

function updateTargets(index: number, targets: string[]) {
  const rows = displayedItems.value.map(item => ({ ...item, targets: [...item.targets] }))
  const row = rows[index]
  if (!row) return
  row.targets = targets
  if (!props.items) fallbackItems.value = rows
  emit('update:items', rows)
}

function removeRow(index: number) {
  const rows = displayedItems.value.filter((_, itemIndex) => itemIndex !== index)
  if (!props.items) fallbackItems.value = rows
  emit('update:items', rows)
}

function addWorkflow() {
  if (!newItem.name.trim() || !newItem.assignee.trim() || !newItem.targets.length) return
  const rows = [
    ...displayedItems.value,
    {
      id: `workflow-${Date.now()}`,
      category: newItem.category.trim(),
      name: newItem.name.trim(),
      assignee: newItem.assignee.trim(),
      incentiveAmount: Number(newItem.incentiveAmount) || 0,
      incentiveUnit: newItem.incentiveUnit.trim() || 'per Job',
      targets: [...newItem.targets],
    },
  ]
  if (!props.items) fallbackItems.value = rows
  emit('update:items', rows)
  newItem.name = ''
  newItem.assignee = ''
  newItem.targets = []
  isAdding.value = false
}
</script>

<template>
  <section class="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
    <div class="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-3 dark:border-gray-800">
      <h4 class="app-section-title text-gray-900 dark:text-white">{{ title }}</h4>
      <button
        v-if="!isAdding"
        type="button"
        class="inline-flex h-9 items-center gap-1.5 rounded-md bg-[#ff9f43] px-3 text-sm font-semibold text-white shadow-sm hover:bg-[#e08a36]"
        @click="isAdding = true"
      >
        <FeatherIcon name="plus" :size="14" />
        {{ addLabel }}
      </button>
    </div>

    <div class="mt-4 overflow-x-auto">
      <table class="min-w-[980px] w-full text-left text-sm">
        <thead class="border-b border-gray-200 bg-gray-50 font-semibold text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200">
          <tr>
            <th class="px-4 py-3">Flow Category</th>
            <th class="px-4 py-3">Flow Name</th>
            <th class="px-4 py-3">Assignee</th>
            <th class="px-4 py-3">Incentive</th>
            <th class="min-w-56 px-4 py-3">{{ targetLabel }}</th>
            <th class="px-4 py-3 text-center">Action</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
          <tr v-for="(item, index) in displayedItems" :key="item.id" class="align-top">
            <td class="px-4 py-3 font-medium text-gray-900 dark:text-white">{{ item.category }}</td>
            <td class="px-4 py-3">{{ item.name }}</td>
            <td class="px-4 py-3">{{ item.assignee }}</td>
            <td class="whitespace-nowrap px-4 py-3">{{ formatMoney(item.incentiveAmount) }} {{ item.incentiveUnit }}</td>
            <td class="px-4 py-3">
              <ConfigurationMultiSelect
                :model-value="item.targets"
                :options="availableOptions"
                :label="`${targetLabel} untuk ${item.name}`"
                @update:model-value="updateTargets(index, $event)"
              />
            </td>
            <td class="px-4 py-3 text-center">
              <SalesActionButton action="delete" :label="`Remove ${item.name}`" @click="removeRow(index)" />
            </td>
          </tr>

          <tr v-if="isAdding" class="align-top bg-amber-50/50 dark:bg-amber-950/20">
            <td class="px-3 py-3"><input v-model="newItem.category" :class="formControlClass" aria-label="Flow Category" /></td>
            <td class="px-3 py-3"><input v-model="newItem.name" :class="formControlClass" aria-label="Flow Name" /></td>
            <td class="px-3 py-3"><input v-model="newItem.assignee" :class="formControlClass" aria-label="Assignee" /></td>
            <td class="px-3 py-3">
              <div class="flex min-w-52 gap-2">
                <CurrencyInput v-model="newItem.incentiveAmount" :min="0" align="left" aria-label="Incentive amount" />
                <input v-model="newItem.incentiveUnit" :class="formControlClass" aria-label="Incentive unit" />
              </div>
            </td>
            <td class="px-3 py-3">
              <ConfigurationMultiSelect
                v-model="newItem.targets"
                :options="availableOptions"
                :label="targetLabel"
              />
            </td>
            <td class="px-3 py-3">
              <div class="flex justify-center gap-2">
                <button type="button" class="h-9 rounded-md bg-[#ff9f43] px-3 text-sm font-semibold text-white" @click="addWorkflow">Add</button>
                <button type="button" class="h-9 rounded-md bg-gray-800 px-3 text-sm font-semibold text-white" @click="isAdding = false">Cancel</button>
              </div>
            </td>
          </tr>

          <tr v-if="!displayedItems.length && !isAdding">
            <td colspan="6" class="px-4 py-8 text-center text-sm text-gray-500">No workflow configured.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="mt-4 flex justify-end gap-2 border-t border-gray-100 pt-4 dark:border-gray-800">
      <button type="button" class="h-9 rounded-md bg-gray-800 px-4 text-sm font-semibold text-white">Cancel</button>
      <button type="button" class="h-9 rounded-md bg-primary px-4 text-sm font-semibold text-white" @click="emit('save')">Save</button>
    </div>
  </section>
</template>
