<script setup lang="ts">
import type { MyIncentive, MyIncentiveFormData } from '#server/types/my-incentive'
import CurrencyInput from '~/components/Common/CurrencyInput.vue'
import SalesDialog from '~/components/Sales/SalesDialog.vue'
import {
  modalFormRowClass,
  modalFormLabelClass,
  modalFormInputColClass,
  formControlClass
} from '~/utils/salesUi'

interface Props {
  isOpen: boolean
  editData: MyIncentive | null
  busy?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'save', payload: MyIncentiveFormData): void
}>()

const form = ref<MyIncentiveFormData>({
  date: '',
  jobTitle: '',
  flowName: '',
  process: 'Printing',
  incentive: 1000,
  unit: 'Ream',
  qty: 1,
  status: 'Pending',
  employee: 'Ahmad'
})

watch(() => props.isOpen, (open) => {
  if (open) {
    if (props.editData) {
      form.value = {
        id: props.editData.id,
        code: props.editData.code,
        date: props.editData.date,
        jobTitle: props.editData.jobTitle,
        flowName: props.editData.flowName,
        process: props.editData.process,
        incentive: props.editData.incentive,
        unit: props.editData.unit,
        qty: props.editData.qty,
        amount: props.editData.amount,
        status: props.editData.status,
        employee: props.editData.employee || 'Ahmad'
      }
    } else {
      form.value = {
        date: new Date().toLocaleDateString('id-ID'),
        jobTitle: '',
        flowName: 'Cetak Multilith',
        process: 'Printing',
        incentive: 1000,
        unit: 'Ream',
        qty: 1,
        status: 'Pending',
        employee: 'Ahmad'
      }
    }
  }
})

const calculatedAmount = computed(() => {
  return (Number(form.value.incentive) || 0) * (Number(form.value.qty) || 0)
})

const handleClose = () => {
  if (!props.busy) {
    emit('close')
  }
}

const handleSubmit = () => {
  emit('save', {
    ...form.value,
    incentive: Number(form.value.incentive) || 0,
    qty: Number(form.value.qty) || 1,
    amount: calculatedAmount.value
  })
}
</script>

<template>
  <SalesDialog
    :open="isOpen"
    :title="editData ? 'Edit Incentive' : 'Add Incentive'"
    size="md"
    :busy="busy"
    @close="handleClose"
  >
    <div class="space-y-3.5">
      <!-- Date -->
      <div :class="modalFormRowClass">
        <label for="incDate" :class="modalFormLabelClass">
          Date <span class="text-red-500">*</span>
        </label>
        <div :class="modalFormInputColClass">
          <input
            id="incDate"
            v-model="form.date"
            type="text"
            placeholder="DD/MM/YYYY"
            :class="formControlClass"
            :disabled="busy"
          />
        </div>
      </div>

      <!-- Job Title -->
      <div :class="modalFormRowClass">
        <label for="incJobTitle" :class="modalFormLabelClass">
          Job Title <span class="text-red-500">*</span>
        </label>
        <div :class="modalFormInputColClass">
          <input
            id="incJobTitle"
            v-model="form.jobTitle"
            type="text"
            placeholder="e.g. Nota Surat Jalan PT KIA"
            :class="formControlClass"
            :disabled="busy"
          />
        </div>
      </div>

      <!-- Flow Name -->
      <div :class="modalFormRowClass">
        <label for="incFlowName" :class="modalFormLabelClass">
          Flow Name <span class="text-red-500">*</span>
        </label>
        <div :class="modalFormInputColClass">
          <input
            id="incFlowName"
            v-model="form.flowName"
            type="text"
            placeholder="e.g. Cetak Multilith"
            :class="formControlClass"
            :disabled="busy"
          />
        </div>
      </div>

      <!-- Name Of Process -->
      <div :class="modalFormRowClass">
        <label for="incProcess" :class="modalFormLabelClass">
          Process <span class="text-red-500">*</span>
        </label>
        <div :class="modalFormInputColClass">
          <select
            id="incProcess"
            v-model="form.process"
            :class="formControlClass"
            :disabled="busy"
          >
            <option value="Printing">Printing</option>
            <option value="Cutting">Cutting</option>
            <option value="Laminasi">Laminasi</option>
          </select>
        </div>
      </div>

      <!-- Incentive Rate (Rp) -->
      <div :class="modalFormRowClass">
        <label for="incRate" :class="modalFormLabelClass">
          Incentive (Rp) <span class="text-red-500">*</span>
        </label>
        <div :class="modalFormInputColClass">
          <CurrencyInput
            id="incRate"
            v-model="form.incentive"
            thousand-separator="."
            placeholder="1,000"
            :disabled="busy"
          />
        </div>
      </div>

      <!-- Unit -->
      <div :class="modalFormRowClass">
        <label for="incUnit" :class="modalFormLabelClass">
          Unit <span class="text-red-500">*</span>
        </label>
        <div :class="modalFormInputColClass">
          <select
            id="incUnit"
            v-model="form.unit"
            :class="formControlClass"
            :disabled="busy"
          >
            <option value="Ream">Ream</option>
            <option value="Job">Job</option>
            <option value="Pcs">Pcs</option>
            <option value="Lembar">Lembar</option>
          </select>
        </div>
      </div>

      <!-- Qty -->
      <div :class="modalFormRowClass">
        <label for="incQty" :class="modalFormLabelClass">
          Qty <span class="text-red-500">*</span>
        </label>
        <div :class="modalFormInputColClass">
          <input
            id="incQty"
            v-model.number="form.qty"
            type="number"
            min="1"
            placeholder="1"
            :class="formControlClass"
            :disabled="busy"
          />
        </div>
      </div>

      <!-- Calculated Amount Preview -->
      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">
          Calculated Amount
        </label>
        <div :class="modalFormInputColClass">
          <div class="h-9 px-3 flex items-center font-bold text-gray-900 dark:text-white font-mono bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 text-xs">
            Rp {{ new Intl.NumberFormat('id-ID').format(calculatedAmount) }}
          </div>
        </div>
      </div>

      <!-- Status -->
      <div :class="modalFormRowClass">
        <label for="incStatus" :class="modalFormLabelClass">
          Status <span class="text-red-500">*</span>
        </label>
        <div :class="modalFormInputColClass">
          <select
            id="incStatus"
            v-model="form.status"
            :class="formControlClass"
            :disabled="busy"
          >
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
          </select>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex items-center justify-end gap-2">
        <button
          type="button"
          class="h-9 px-4 rounded-lg bg-[#212b36] hover:bg-gray-800 text-white text-xs font-medium transition-colors"
          :disabled="busy"
          @click="handleClose"
        >
          Cancel
        </button>
        <button
          type="button"
          class="h-9 px-4 rounded-lg bg-[#ff9f43] hover:bg-[#e08933] text-white text-xs font-medium transition-colors disabled:opacity-50"
          :disabled="busy"
          @click="handleSubmit"
        >
          <span v-if="busy">Menyimpan...</span>
          <span v-else>Submit</span>
        </button>
      </div>
    </template>
  </SalesDialog>
</template>
