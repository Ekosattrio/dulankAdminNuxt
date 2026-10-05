<script setup lang="ts">
import type { EmployeeSalaryItem, EmployeeSalaryFormData, SalaryAllowanceItem } from '#server/types/employeeSalary'
import type { EmployeeItem } from '#server/types/employee'
import SalesDialog from '~/components/sales/SalesDialog.vue'
import FeatherIcon from '~/components/common/FeatherIcon.vue'
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
  salaryData: EmployeeSalaryItem | null
  employees: EmployeeItem[]
  busy?: boolean
}>()

const emit = defineEmits<{
  close: []
  submit: [formData: EmployeeSalaryFormData]
}>()

const systemOptions = ['Monthly', 'Weekly', 'Daily']
const statusOptions = ['Active', 'Disabled']

const form = ref<EmployeeSalaryFormData>({
  employeeId: '',
  name: '',
  salary: 0,
  system: 'Monthly',
  overtimeRate: 15000,
  status: 'Active',
  allowances: [],
})

const allowances = ref<SalaryAllowanceItem[]>([])
const newAllowanceName = ref('')
const newAllowanceAmount = ref(0)
const errorMessage = ref('')

watch(
  () => props.salaryData,
  (val) => {
    if (val && props.isEdit) {
      form.value = {
        id: val.id,
        employeeId: val.employeeId,
        name: val.name,
        salary: val.salary,
        system: val.system,
        overtimeRate: val.overtimeRate,
        status: val.status,
        allowances: val.allowances ? val.allowances.map(a => ({ ...a })) : [],
      }
      allowances.value = val.allowances ? val.allowances.map(a => ({ ...a })) : []
    } else {
      const defaultEmp = props.employees[0]
      form.value = {
        employeeId: defaultEmp?.id || '',
        name: defaultEmp?.name || '',
        salary: 4000000,
        system: 'Monthly',
        overtimeRate: 15000,
        status: 'Active',
        allowances: [{ id: '1', name: 'Present Allowance', amount: 300000 }],
      }
      allowances.value = [{ id: '1', name: 'Present Allowance', amount: 300000 }]
    }
    newAllowanceName.value = ''
    newAllowanceAmount.value = 0
    errorMessage.value = ''
  },
  { immediate: true }
)

function onEmployeeChange(e: Event) {
  const empId = (e.target as HTMLSelectElement).value
  const emp = props.employees.find(item => item.id === empId)
  if (emp) {
    form.value.employeeId = emp.id
    form.value.name = emp.name
  }
}

function addAllowance() {
  const name = newAllowanceName.value.trim()
  if (!name) return
  allowances.value.push({
    id: String(Date.now()),
    name,
    amount: Number(newAllowanceAmount.value) || 0,
  })
  newAllowanceName.value = ''
  newAllowanceAmount.value = 0
}

function removeAllowance(index: number) {
  allowances.value.splice(index, 1)
}

const totalAllowanceCalculated = computed(() => {
  return allowances.value.reduce((sum, a) => sum + (Number(a.amount) || 0), 0)
})

function handleSubmit() {
  if (!form.value.employeeId) {
    errorMessage.value = 'Please select an employee'
    return
  }
  if (!form.value.salary || form.value.salary <= 0) {
    errorMessage.value = 'Base salary must be greater than 0'
    return
  }

  // Auto add pending allowance if filled
  if (newAllowanceName.value.trim()) {
    addAllowance()
  }

  errorMessage.value = ''
  emit('submit', {
    ...form.value,
    allowances: allowances.value,
    allowanceTotal: totalAllowanceCalculated.value,
  })
}
</script>

<template>
  <SalesDialog
    :open="open"
    :title="isEdit ? 'Edit Employee Salary' : 'Add New Employee Salary'"
    medium
    @close="emit('close')"
  >
    <form class="space-y-4 p-5 sm:p-6" @submit.prevent="handleSubmit">
      <div v-if="errorMessage" class="rounded-lg bg-rose-50 p-3 text-xs text-rose-600 dark:bg-rose-950/50 dark:text-rose-400">
        {{ errorMessage }}
      </div>

      <!-- Employee Selection -->
      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">
          Employee <span class="text-rose-500">*</span>
        </label>
        <div :class="modalFormInputColClass">
          <select
            v-if="!isEdit"
            :value="form.employeeId"
            :class="formControlClass"
            @change="onEmployeeChange"
          >
            <option value="" disabled>Choose Employee</option>
            <option v-for="emp in employees" :key="emp.id" :value="emp.id">
              {{ emp.id }} - {{ emp.name }} ({{ emp.department }})
            </option>
          </select>
          <div v-else class="flex h-9 items-center rounded-md border border-gray-200 bg-gray-50 px-3 text-xs font-semibold text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200">
            <span>{{ form.employeeId }} - {{ form.name }}</span>
          </div>
        </div>
      </div>

      <!-- Base Salary -->
      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">
          Base Salary (IDR) <span class="text-rose-500">*</span>
        </label>
        <div :class="modalFormInputColClass">
          <CurrencyInput
            v-model="form.salary"
            align="right"
            :class="formControlClass"
            placeholder="0"
          />
        </div>
      </div>

      <!-- Payroll System -->
      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">
          Payroll System
        </label>
        <div :class="modalFormInputColClass">
          <select v-model="form.system" :class="formControlClass">
            <option v-for="s in systemOptions" :key="s" :value="s">
              {{ s }}
            </option>
          </select>
        </div>
      </div>

      <!-- Overtime Rate -->
      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">
          Overtime Rate / Hour
        </label>
        <div :class="modalFormInputColClass">
          <CurrencyInput
            v-model="form.overtimeRate"
            align="right"
            :class="formControlClass"
            placeholder="15.000"
          />
        </div>
      </div>

      <!-- Status -->
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

      <!-- Allowances Header & List -->
      <div class="border-t border-gray-200 pt-4 dark:border-gray-700">
        <div class="mb-3 flex items-center justify-between">
          <div class="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
            <FeatherIcon name="award" size="14" class="text-amber-500" />
            <span>Allowances / Tunjangan</span>
          </div>
          <span class="text-xs font-bold text-primary dark:text-primary-400">
            Total: <CurrencyDisplay :value="totalAllowanceCalculated" />
          </span>
        </div>

        <div class="space-y-2 rounded-lg border border-gray-200/80 bg-gray-50/50 p-3 dark:border-gray-700 dark:bg-gray-800/40">
          <!-- Existing allowances -->
          <div
            v-for="(allowance, idx) in allowances"
            :key="allowance.id || idx"
            class="flex items-center gap-2"
          >
            <input
              v-model="allowance.name"
              type="text"
              placeholder="Allowance name (e.g. Present Allowance)"
              :class="[formControlClass, 'flex-1']"
            >
            <div class="w-36 shrink-0">
              <CurrencyInput
                v-model="allowance.amount"
                align="right"
                :class="formControlClass"
                placeholder="0"
              />
            </div>
            <button
              type="button"
              class="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-rose-200 bg-white text-rose-500 shadow-2xs hover:bg-rose-50 dark:border-rose-800/50 dark:bg-gray-800 dark:hover:bg-rose-950/40"
              title="Remove allowance"
              @click="removeAllowance(idx)"
            >
              <FeatherIcon name="trash-2" size="14" />
            </button>
          </div>

          <!-- Add new allowance row -->
          <div class="flex items-center gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
            <input
              v-model="newAllowanceName"
              type="text"
              placeholder="+ New allowance name..."
              :class="[formControlClass, 'flex-1 border-dashed']"
              @keydown.enter.prevent="addAllowance"
            >
            <div class="w-36 shrink-0">
              <CurrencyInput
                v-model="newAllowanceAmount"
                align="right"
                :class="[formControlClass, 'border-dashed']"
                placeholder="0"
                @keydown.enter.prevent="addAllowance"
              />
            </div>
            <button
              type="button"
              class="inline-flex h-9 shrink-0 items-center gap-1 rounded-md border border-gray-300 bg-white px-3 text-xs font-semibold text-gray-700 shadow-2xs hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
              @click="addAllowance"
            >
              <FeatherIcon name="plus" size="13" />
              <span>Add</span>
            </button>
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
          <span>{{ isEdit ? 'Update Salary' : 'Save Salary' }}</span>
        </button>
      </div>
    </template>
  </SalesDialog>
</template>
