<script setup lang="ts">
import type { FlowName, FlowNameFormData } from '#server/types/flow-name'
import AssigneeSelect from '~/components/common/AssigneeSelect.vue'
import CurrencyInput from '~/components/common/CurrencyInput.vue'
import SalesDialog from '~/components/sales/SalesDialog.vue'
import {
  formControlClass,
  modalFormInputColClass,
  modalFormLabelClass,
  modalFormRowClass,
} from '~/utils/salesUi'

const props = defineProps<{
  open: boolean
  record: FlowName | null
  busy?: boolean
  error?: string
}>()

const emit = defineEmits<{
  close: []
  submit: [form: FlowNameFormData]
}>()

const categories = ['Design', 'Pracetak', 'Cetak', 'Finishing']
const unitIncentives = ['Per Job', 'Per Meter', 'Per Pieces', 'Per Ream']

const form = ref<FlowNameFormData>({
  category: 'Design',
  name: '',
  incentiveAmount: 0,
  unitIncentive: 'Per Job',
  flowAssignee: 'Adul, Nurdin',
  flowType: 'In-House',
})

const isIncentiveOpen = ref(true)

function normalizeFlowType(type?: string): string {
  if (!type) return 'In-House'
  const lower = type.toLowerCase().replace(/[-_\s]/g, '')
  if (lower === 'inhouse') return 'In-House'
  if (lower === 'branchstore') return 'Branch Store'
  if (lower === 'outsource' || lower === 'outs') return 'OutSource'
  return type
}

watch(
  () => props.record,
  (rec) => {
    if (rec) {
      form.value = {
        id: rec.id,
        no: rec.no,
        category: rec.category,
        name: rec.name,
        incentiveAmount: rec.incentiveAmount ?? 0,
        unitIncentive: rec.unitIncentive ?? 'Per Job',
        flowAssignee: rec.flowAssignee || 'Adul, Nurdin',
        flowType: normalizeFlowType(rec.flowType),
        createDate: rec.createDate,
      }
      isIncentiveOpen.value = true
    } else {
      form.value = {
        category: 'Design',
        name: '',
        incentiveAmount: 0,
        unitIncentive: 'Per Job',
        flowAssignee: 'Adul, Nurdin',
        flowType: 'In-House',
      }
      isIncentiveOpen.value = true
    }
  },
  { immediate: true },
)

function clearIncentive() {
  form.value.incentiveAmount = 0
  form.value.unitIncentive = ''
}

function submit() {
  emit('submit', { ...form.value })
}
</script>

<template>
  <SalesDialog
    :open="open"
    :title="record ? 'Edit New Flow Name' : 'Add New Flow Name'"
    :busy="busy"
    @close="$emit('close')"
  >
    <form class="space-y-4" @submit.prevent="submit">
      <p v-if="error" role="alert" class="text-xs text-red-600">{{ error }}</p>
      <fieldset :disabled="busy" class="space-y-4 text-xs disabled:opacity-60">
        <!-- Flow Name -->
        <div :class="modalFormRowClass">
          <label :class="modalFormLabelClass">Flow Name</label>
          <div :class="modalFormInputColClass">
            <input
              v-model="form.name"
              type="text"
              required
              placeholder="e.g. Printing"
              :class="formControlClass"
            />
          </div>
        </div>

        <!-- Assignee (Reusable AssigneeSelect Component) -->
        <div class="grid grid-cols-12 items-start gap-3 sm:gap-4">
          <label :class="[modalFormLabelClass, 'pt-2']">Assignee</label>
          <div :class="modalFormInputColClass">
            <AssigneeSelect
              v-model="form.flowAssignee"
              :disabled="busy"
            />
          </div>
        </div>

        <!-- Flow Category -->
        <div :class="modalFormRowClass">
          <label :class="modalFormLabelClass">Flow Category</label>
          <div :class="modalFormInputColClass">
            <select
              v-model="form.category"
              :class="formControlClass"
            >
              <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
            </select>
          </div>
        </div>

        <!-- Flow Type -->
        <div :class="modalFormRowClass">
          <label :class="modalFormLabelClass">Flow Type</label>
          <div :class="[modalFormInputColClass, 'flex flex-wrap items-center gap-5']">
            <label class="inline-flex cursor-pointer items-center gap-2 text-xs font-medium text-gray-700 dark:text-gray-300">
              <input
                v-model="form.flowType"
                type="radio"
                value="In-House"
                class="size-4 accent-primary"
              />
              <span>In-House</span>
            </label>
            <label class="inline-flex cursor-pointer items-center gap-2 text-xs font-medium text-gray-700 dark:text-gray-300">
              <input
                v-model="form.flowType"
                type="radio"
                value="Branch Store"
                class="size-4 accent-primary"
              />
              <span>Branch Store</span>
            </label>
            <label class="inline-flex cursor-pointer items-center gap-2 text-xs font-medium text-gray-700 dark:text-gray-300">
              <input
                v-model="form.flowType"
                type="radio"
                value="OutSource"
                class="size-4 accent-primary"
              />
              <span>OutSource</span>
            </label>
          </div>
        </div>

        <!-- Collapsible Add Incentive Section -->
        <div class="mb-4 rounded-md border border-gray-200 bg-gray-50/50 p-3.5 dark:border-gray-700 dark:bg-gray-800/30">
          <button
            type="button"
            class="flex w-full items-center justify-between text-left transition-colors focus:outline-none"
            :class="isIncentiveOpen ? 'mb-3' : ''"
            @click="isIncentiveOpen = !isIncentiveOpen"
          >
            <span class="text-sm font-semibold text-gray-800 dark:text-gray-200">Add Incentive</span>
            <FeatherIcon
              :name="isIncentiveOpen ? 'chevron-up' : 'chevron-down'"
              :size="16"
              class="text-gray-500 transition-transform duration-200"
            />
          </button>

          <div v-show="isIncentiveOpen" class="space-y-3.5 border-t border-gray-100 pt-3 dark:border-gray-700/50">
            <!-- Incentive Amount -->
            <div :class="modalFormRowClass">
              <label :class="modalFormLabelClass">Incentive Amount</label>
              <div :class="modalFormInputColClass">
                <CurrencyInput
                  v-model="form.incentiveAmount"
                  thousand-separator="."
                  placeholder="0"
                  :disabled="busy"
                />
              </div>
            </div>

            <!-- Unit Incentive -->
            <div :class="modalFormRowClass">
              <label :class="modalFormLabelClass">Unit Incentive</label>
              <div :class="modalFormInputColClass">
                <select
                  v-model="form.unitIncentive"
                  :class="formControlClass"
                >
                  <option value=""></option>
                  <option v-for="u in unitIncentives" :key="u" :value="u">{{ u }}</option>
                </select>
              </div>
            </div>

            <!-- Clear Incentive Button -->
            <div class="pt-0.5 text-right">
              <button
                type="button"
                class="text-xs font-semibold text-primary hover:underline focus:outline-none"
                @click="clearIncentive"
              >
                Clear X
              </button>
            </div>
          </div>
        </div>

        <!-- Action Footer -->
        <div class="flex justify-end gap-2.5 border-t border-gray-200 pt-4 dark:border-gray-700">
          <button
            type="button"
            class="min-w-24 rounded-md bg-[#212b36] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#092c4c] focus:outline-none"
            @click="$emit('close')"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="min-w-24 rounded-md bg-[#ff9f43] px-5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#f39334] focus:outline-none"
          >
            {{ busy ? 'Saving...' : 'Submit' }}
          </button>
        </div>
      </fieldset>
    </form>
  </SalesDialog>
</template>
