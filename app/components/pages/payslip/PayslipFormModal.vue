<script setup lang="ts">
import type { PayslipItem, PayslipFormData } from '#server/types/payslip'
import type { EmployeeItem } from '#server/types/employee'
import SalesDialog from '~/components/sales/SalesDialog.vue'
import CurrencyInput from '~/components/common/CurrencyInput.vue'
import CurrencyDisplay from '~/components/common/CurrencyDisplay.vue'
import {
  formControlClass,
  modalFormInputColClass,
  modalFormLabelClass,
  modalFormRowClass,
} from '~/utils/salesUi'

const props = defineProps<{
  open: boolean
  isEdit: boolean
  payslipData: PayslipItem | null
  employees: EmployeeItem[]
  busy?: boolean
}>()

const emit = defineEmits<{
  close: []
  submit: [formData: PayslipFormData]
}>()

const statusOptions = ['Paid', 'Unpaid']

const form = ref<PayslipFormData>({
  slipNo: '',
  name: '',
  period: '02/02/26 - 07/02/26',
  salaryRate: 150000,
  dayWorked: 6,
  allowance: 300000,
  overtime: 0,
  deduction: 0,
  status: 'Paid',
  paidDate: '09/02/2026',
})

const errorMessage = ref('')

watch(
  () => props.payslipData,
  (val) => {
    if (val && props.isEdit) {
      form.value = {
        id: val.id,
        slipNo: val.slipNo,
        name: val.name,
        period: val.period,
        salaryRate: val.salaryRate,
        dayWorked: val.dayWorked,
        allowance: val.allowance,
        overtime: val.overtime,
        deduction: val.deduction,
        status: val.status,
        paidDate: val.paidDate,
      }
    } else {
      const defaultEmp = props.employees[0]
      form.value = {
        slipNo: `PS${String(Date.now()).slice(-6)}`,
        name: defaultEmp?.name || '',
        period: '02/02/26 - 07/02/26',
        salaryRate: 150000,
        dayWorked: 6,
        allowance: 300000,
        overtime: 0,
        deduction: 0,
        status: 'Unpaid',
        paidDate: '-',
      }
    }
    errorMessage.value = ''
  },
  { immediate: true }
)

const calculatedTotal = computed(() => {
  const base = (Number(form.value.salaryRate) || 0) * (Number(form.value.dayWorked) || 0)
  const earnings = base + (Number(form.value.allowance) || 0) + (Number(form.value.overtime) || 0)
  return Math.max(0, earnings - (Number(form.value.deduction) || 0))
})

function onEmployeeChange(e: Event) {
  const name = (e.target as HTMLSelectElement).value
  form.value.name = name
}

function handleSubmit() {
  if (!form.value.name) {
    errorMessage.value = 'Employee name is required'
    return
  }
  if (!form.value.period) {
    errorMessage.value = 'Period is required'
    return
  }

  errorMessage.value = ''
  emit('submit', {
    ...form.value,
    total: calculatedTotal.value,
  })
}
</script>

<template>
  <SalesDialog
    :open="open"
    :title="isEdit ? 'Edit Payslip' : 'Add New Payslip'"
    wide
    @close="emit('close')"
  >
    <form class="space-y-4" @submit.prevent="handleSubmit">
      <div v-if="errorMessage" class="rounded-lg bg-rose-50 p-3 text-xs text-rose-600 dark:bg-rose-950/50 dark:text-rose-400">
        {{ errorMessage }}
      </div>

      <!-- No. Slip & Employee Name (2 Kolom) -->
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div :class="modalFormRowClass">
          <label :class="modalFormLabelClass">
            No. Slip <span class="text-rose-500">*</span>
          </label>
          <div :class="modalFormInputColClass">
            <input
              v-model="form.slipNo"
              type="text"
              required
              placeholder="PS000001"
              :class="formControlClass"
            >
          </div>
        </div>

        <div :class="modalFormRowClass">
          <label :class="modalFormLabelClass">
            Employee Name <span class="text-rose-500">*</span>
          </label>
          <div :class="modalFormInputColClass">
            <select
              :value="form.name"
              :class="formControlClass"
              @change="onEmployeeChange"
            >
              <option value="" disabled>Choose Employee</option>
              <option v-for="emp in employees" :key="emp.id" :value="emp.name">
                {{ emp.id }} - {{ emp.name }} ({{ emp.department }})
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Period & Paid Date (2 Kolom) -->
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div :class="modalFormRowClass">
          <label :class="modalFormLabelClass">
            Period (Periode) <span class="text-rose-500">*</span>
          </label>
          <div :class="modalFormInputColClass">
            <input
              v-model="form.period"
              type="text"
              placeholder="dd/mm/yy - dd/mm/yy"
              :class="formControlClass"
            >
          </div>
        </div>

        <div :class="modalFormRowClass">
          <label :class="modalFormLabelClass">
            Paid Date
          </label>
          <div :class="modalFormInputColClass">
            <input
              v-model="form.paidDate"
              type="text"
              placeholder="dd/mm/yyyy or -"
              :class="formControlClass"
            >
          </div>
        </div>
      </div>

      <!-- Salary Rate & Days Worked (2 Kolom) -->
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div :class="modalFormRowClass">
          <label :class="modalFormLabelClass">
            Salary / Rate (IDR) <span class="text-rose-500">*</span>
          </label>
          <div :class="modalFormInputColClass">
            <CurrencyInput
              v-model="form.salaryRate"
              align="right"
              :class="formControlClass"
              placeholder="0"
            />
          </div>
        </div>

        <div :class="modalFormRowClass">
          <label :class="modalFormLabelClass">
            Days Worked (Hari) <span class="text-rose-500">*</span>
          </label>
          <div :class="modalFormInputColClass">
            <input
              v-model="form.dayWorked"
              type="number"
              min="0"
              max="31"
              :class="formControlClass"
            >
          </div>
        </div>
      </div>

      <!-- Allowance & Overtime (2 Kolom) -->
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div :class="modalFormRowClass">
          <label :class="modalFormLabelClass">
            Allowance (Tunjangan)
          </label>
          <div :class="modalFormInputColClass">
            <CurrencyInput
              v-model="form.allowance"
              align="right"
              :class="formControlClass"
              placeholder="0"
            />
          </div>
        </div>

        <div :class="modalFormRowClass">
          <label :class="modalFormLabelClass">
            Overtime (Lembur)
          </label>
          <div :class="modalFormInputColClass">
            <CurrencyInput
              v-model="form.overtime"
              align="right"
              :class="formControlClass"
              placeholder="0"
            />
          </div>
        </div>
      </div>

      <!-- Deduction & Status (2 Kolom) -->
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div :class="modalFormRowClass">
          <label :class="modalFormLabelClass">
            Deduction (Potongan)
          </label>
          <div :class="modalFormInputColClass">
            <CurrencyInput
              v-model="form.deduction"
              align="right"
              :class="formControlClass"
              placeholder="0"
            />
          </div>
        </div>

        <div :class="modalFormRowClass">
          <label :class="modalFormLabelClass">
            Status
          </label>
          <div :class="modalFormInputColClass">
            <select v-model="form.status" :class="formControlClass">
              <option v-for="st in statusOptions" :key="st" :value="st">
                {{ st }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Calculation Summary Box -->
      <div class="rounded-lg border border-primary/20 bg-primary/5 p-4 dark:border-primary/30 dark:bg-primary/10">
        <div class="flex items-center justify-between">
          <div>
            <span class="text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
              Total Net Salary (Gaji Bersih Diterima)
            </span>
            <p class="text-[11px] text-gray-500">
              (Rate × Hari Kerja) + Tunjangan + Lembur - Potongan
            </p>
          </div>
          <div class="text-right">
            <h4 class="text-xl font-bold text-primary dark:text-primary-400">
              <CurrencyDisplay :value="calculatedTotal" />
            </h4>
          </div>
        </div>
      </div>
    </form>

    <template #footer>
      <div class="flex items-center justify-end gap-3 w-full">
        <button
          type="button"
          class="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-xs hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
          @click="emit('close')"
        >
          Cancel
        </button>
        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
          :disabled="busy"
          @click="handleSubmit"
        >
          <span v-if="busy" class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          <span>{{ isEdit ? 'Update Payslip' : 'Save Payslip' }}</span>
        </button>
      </div>
    </template>
  </SalesDialog>
</template>
