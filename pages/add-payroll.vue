<script setup lang="ts">
import { formatRupiah } from '~/composables/useFormatters'

const router = useRouter()

interface LineItem {
  id: string
  label: string
  isEditing?: boolean
  qty: number
  rate: number
  amount: number
}

const form = reactive({
  employeeId: '',
  employeeName: '',
  salary: 150000,
  system: 'Daily',
  period: '01/12/2025 - 07/12/2025',
  workedDays: 6,
  absentDays: 0,

  // Overtime
  regularOvertimeHours: 5,
  regularOvertimeRate: 30000,

  specialOvertimeHours: 0,
  specialOvertimeRate: 40000,

  // Allowance
  presentIncentive: 20000,
  allowanceItems: [
    {
      id: '1',
      label: 'Pengiriman',
      qty: 1,
      rate: 15000,
      amount: 15000,
      isEditing: false
    }
  ] as LineItem[],

  // Deduction
  cashAdvance: 300000,
  deductionItems: [
    {
      id: '1',
      label: 'Other Deduction',
      qty: 0,
      rate: 0,
      amount: 0,
      isEditing: false
    }
  ] as LineItem[]
})

const onSelectEmployee = (emp: any) => {
  form.employeeId = emp.id
  form.employeeName = emp.name
  form.salary = emp.salary || 150000
  form.system = emp.system || 'Daily'
}

// Overtime calculations
const regularOvertimeAmount = computed(() => form.regularOvertimeHours * form.regularOvertimeRate)
const specialOvertimeAmount = computed(() => form.specialOvertimeHours * form.specialOvertimeRate)
const totalOvertime = computed(() => regularOvertimeAmount.value + specialOvertimeAmount.value)

// Allowance calculations
const totalAllowance = computed(() => {
  const customSum = form.allowanceItems.reduce((acc, item) => acc + (item.qty * item.rate), 0)
  return form.presentIncentive + customSum
})

// Deduction calculations
const totalDeduction = computed(() => {
  const customSum = form.deductionItems.reduce((acc, item) => acc + (item.qty * item.rate), 0)
  return form.cashAdvance + customSum
})

// Base Pay
const basePay = computed(() => {
  if (form.system === 'Daily') {
    return form.salary * form.workedDays
  }
  return form.salary
})

// Total Received
const totalReceived = computed(() => {
  return basePay.value + totalOvertime.value + totalAllowance.value - totalDeduction.value
})

// Allowance Dynamic management
const addAllowance = () => {
  form.allowanceItems.push({
    id: String(Date.now()),
    label: 'Other Allowance',
    qty: 1,
    rate: 10000,
    amount: 10000,
    isEditing: true
  })
}

const removeAllowance = (index: number) => {
  form.allowanceItems.splice(index, 1)
}

// Deduction Dynamic management
const addDeduction = () => {
  form.deductionItems.push({
    id: String(Date.now()),
    label: 'Custom Deduction',
    qty: 1,
    rate: 10000,
    amount: 10000,
    isEditing: true
  })
}

const removeDeduction = (index: number) => {
  form.deductionItems.splice(index, 1)
}

const savePayroll = () => {
  if (!form.employeeName) {
    alert('Please select an employee')
    return
  }
  alert('Payroll saved successfully!')
  router.push('/payslip')
}

const resetForm = () => {
  form.workedDays = 6
  form.absentDays = 0
  form.regularOvertimeHours = 0
  form.specialOvertimeHours = 0
  form.cashAdvance = 0
  form.allowanceItems = []
  form.deductionItems = []
}
</script>

<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <CommonPageHeader title="Add New Payroll" subtitle="Create employee payroll entry">
      <template #actions>
        <NuxtLink
          to="/payslip"
          class="inline-flex items-center gap-2 rounded-lg bg-gray-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-700"
        >
          <FeatherIcon name="arrow-left" size="18" />
          <span>Back to Payslip List</span>
        </NuxtLink>
      </template>
    </CommonPageHeader>

    <form @submit.prevent="savePayroll">
      <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 space-y-8">
        <!-- 1. Employee Information Section -->
        <div class="space-y-4">
          <div class="flex items-center gap-2 border-b border-gray-200 pb-3 dark:border-gray-800">
            <FeatherIcon name="user" size="18" class="text-primary" />
            <h6 class="text-base font-bold text-gray-900 dark:text-gray-100">Employee Information</h6>
          </div>

          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div class="sm:col-span-2">
              <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Select Employee *</label>
              <FormsEmployeeLiveSearch
                v-model="form.employeeName"
                placeholder="Search Employee..."
                @select="onSelectEmployee"
              />
            </div>

            <div>
              <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Salary</label>
              <input
                :value="formatRupiah(form.salary)"
                disabled
                class="w-full h-10 rounded-lg border border-gray-200 bg-gray-100 px-3 font-mono text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
              />
            </div>

            <div>
              <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">System</label>
              <input
                :value="form.system"
                disabled
                class="w-full h-10 rounded-lg border border-gray-200 bg-gray-100 px-3 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
              />
            </div>

            <div class="sm:col-span-2">
              <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Periode</label>
              <input
                v-model="form.period"
                type="text"
                placeholder="DD/MM/YYYY - DD/MM/YYYY"
                class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              />
            </div>

            <div>
              <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Worked Day</label>
              <FormsNumberInput v-model="form.workedDays" />
            </div>

            <div>
              <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Absent Day</label>
              <FormsNumberInput v-model="form.absentDays" />
            </div>
          </div>
        </div>

        <!-- 2. Over Time Section -->
        <div class="space-y-4">
          <div class="flex items-center gap-2 border-b border-gray-200 pb-3 dark:border-gray-800">
            <FeatherIcon name="clock" size="18" class="text-primary" />
            <h6 class="text-base font-bold text-gray-900 dark:text-gray-100">Over Time</h6>
          </div>

          <div class="space-y-3">
            <!-- Regular Overtime -->
            <div class="grid grid-cols-1 gap-3 sm:grid-cols-4 items-center rounded-lg border border-gray-100 p-3 dark:border-gray-800">
              <div class="text-xs font-semibold text-gray-800 dark:text-gray-200">Regular Over Time</div>
              <div>
                <label class="mb-1 block text-[11px] text-gray-500">Over Time Hours</label>
                <FormsNumberInput v-model="form.regularOvertimeHours" />
              </div>
              <div>
                <label class="mb-1 block text-[11px] text-gray-500">Rate / Hour</label>
                <FormsNumberInput v-model="form.regularOvertimeRate" />
              </div>
              <div>
                <label class="mb-1 block text-[11px] text-gray-500">Amount</label>
                <input
                  :value="formatRupiah(regularOvertimeAmount)"
                  disabled
                  class="w-full h-10 rounded-lg border border-gray-200 bg-gray-100 px-3 font-mono text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                />
              </div>
            </div>

            <!-- Special Overtime -->
            <div class="grid grid-cols-1 gap-3 sm:grid-cols-4 items-center rounded-lg border border-gray-100 p-3 dark:border-gray-800">
              <div class="text-xs font-semibold text-gray-800 dark:text-gray-200">Special Over Time</div>
              <div>
                <label class="mb-1 block text-[11px] text-gray-500">Over Time Hours</label>
                <FormsNumberInput v-model="form.specialOvertimeHours" />
              </div>
              <div>
                <label class="mb-1 block text-[11px] text-gray-500">Rate / Hour</label>
                <FormsNumberInput v-model="form.specialOvertimeRate" />
              </div>
              <div>
                <label class="mb-1 block text-[11px] text-gray-500">Amount</label>
                <input
                  :value="formatRupiah(specialOvertimeAmount)"
                  disabled
                  class="w-full h-10 rounded-lg border border-gray-200 bg-gray-100 px-3 font-mono text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- 3. Allowance Section -->
        <div class="space-y-4">
          <div class="flex items-center gap-2 border-b border-gray-200 pb-3 dark:border-gray-800">
            <FeatherIcon name="gift" size="18" class="text-primary" />
            <h6 class="text-base font-bold text-gray-900 dark:text-gray-100">Allowance</h6>
          </div>

          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 items-center">
            <div class="text-xs font-semibold text-gray-800 dark:text-gray-200">Present Incentive</div>
            <div>
              <FormsNumberInput v-model="form.presentIncentive" />
            </div>
          </div>

          <!-- Dynamic allowances -->
          <div v-for="(item, idx) in form.allowanceItems" :key="item.id" class="grid grid-cols-1 gap-3 sm:grid-cols-12 items-center rounded-lg border border-gray-100 p-3 dark:border-gray-800">
            <div class="sm:col-span-4">
              <div v-if="!item.isEditing" class="flex items-center gap-2">
                <span class="text-xs font-semibold text-gray-800 dark:text-gray-200">{{ item.label }}</span>
                <button type="button" class="text-xs italic text-primary hover:underline" @click="item.isEditing = true">edit</button>
                <button type="button" class="text-xs italic text-rose-500 hover:underline" @click="removeAllowance(idx)">remove</button>
              </div>
              <div v-else class="flex items-center gap-2">
                <input
                  v-model="item.label"
                  type="text"
                  class="h-8 w-40 rounded border border-gray-300 px-2 text-xs focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-800"
                />
                <button type="button" class="text-xs italic text-primary hover:underline" @click="item.isEditing = false">save</button>
              </div>
            </div>

            <div class="sm:col-span-2">
              <label class="mb-1 block text-[11px] text-gray-500">Qty</label>
              <FormsNumberInput v-model="item.qty" />
            </div>

            <div class="sm:col-span-3">
              <label class="mb-1 block text-[11px] text-gray-500">Rate</label>
              <FormsNumberInput v-model="item.rate" />
            </div>

            <div class="sm:col-span-3">
              <label class="mb-1 block text-[11px] text-gray-500">Amount</label>
              <input
                :value="formatRupiah(item.qty * item.rate)"
                disabled
                class="w-full h-10 rounded-lg border border-gray-200 bg-gray-100 px-3 font-mono text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
              />
            </div>
          </div>

          <button
            type="button"
            class="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1"
            @click="addAllowance"
          >
            + Add Other Allowance
          </button>
        </div>

        <!-- 4. Deduction Section -->
        <div class="space-y-4">
          <div class="flex items-center gap-2 border-b border-gray-200 pb-3 dark:border-gray-800">
            <FeatherIcon name="minus-circle" size="18" class="text-primary" />
            <h6 class="text-base font-bold text-gray-900 dark:text-gray-100">Deduction</h6>
          </div>

          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 items-center">
            <div>
              <div class="text-xs font-semibold text-gray-800 dark:text-gray-200">Cash Advance</div>
              <div class="text-[11px] text-gray-500">Total: Rp1.750.000 | Plan: Rp300.000</div>
            </div>
            <div>
              <FormsNumberInput v-model="form.cashAdvance" />
            </div>
          </div>

          <!-- Dynamic deductions -->
          <div v-for="(item, idx) in form.deductionItems" :key="item.id" class="grid grid-cols-1 gap-3 sm:grid-cols-12 items-center rounded-lg border border-gray-100 p-3 dark:border-gray-800">
            <div class="sm:col-span-4">
              <div v-if="!item.isEditing" class="flex items-center gap-2">
                <span class="text-xs font-semibold text-gray-800 dark:text-gray-200">{{ item.label }}</span>
                <button type="button" class="text-xs italic text-primary hover:underline" @click="item.isEditing = true">edit</button>
                <button type="button" class="text-xs italic text-rose-500 hover:underline" @click="removeDeduction(idx)">remove</button>
              </div>
              <div v-else class="flex items-center gap-2">
                <input
                  v-model="item.label"
                  type="text"
                  class="h-8 w-40 rounded border border-gray-300 px-2 text-xs focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-800"
                />
                <button type="button" class="text-xs italic text-primary hover:underline" @click="item.isEditing = false">save</button>
              </div>
            </div>

            <div class="sm:col-span-2">
              <label class="mb-1 block text-[11px] text-gray-500">Qty</label>
              <FormsNumberInput v-model="item.qty" />
            </div>

            <div class="sm:col-span-3">
              <label class="mb-1 block text-[11px] text-gray-500">Rate</label>
              <FormsNumberInput v-model="item.rate" />
            </div>

            <div class="sm:col-span-3">
              <label class="mb-1 block text-[11px] text-gray-500">Amount</label>
              <input
                :value="formatRupiah(item.qty * item.rate)"
                disabled
                class="w-full h-10 rounded-lg border border-gray-200 bg-gray-100 px-3 font-mono text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
              />
            </div>
          </div>

          <button
            type="button"
            class="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1"
            @click="addDeduction"
          >
            + Add Other Deduction
          </button>
        </div>

        <!-- 5. Summary Section -->
        <div class="border-t border-gray-200 pt-6 dark:border-gray-800">
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Total Over Time</label>
              <input
                :value="formatRupiah(totalOvertime)"
                disabled
                class="w-full h-10 rounded-lg border border-gray-200 bg-gray-100 px-3 font-mono font-medium text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
              />
            </div>

            <div>
              <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Total Allowance</label>
              <input
                :value="formatRupiah(totalAllowance)"
                disabled
                class="w-full h-10 rounded-lg border border-gray-200 bg-gray-100 px-3 font-mono font-medium text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
              />
            </div>

            <div>
              <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Total Deduction (-)</label>
              <input
                :value="formatRupiah(totalDeduction)"
                disabled
                class="w-full h-10 rounded-lg border border-gray-200 bg-gray-100 px-3 font-mono font-medium text-sm text-rose-600 dark:border-gray-700 dark:bg-gray-800 dark:text-rose-400"
              />
            </div>

            <div>
              <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Total Received</label>
              <input
                :value="formatRupiah(totalReceived)"
                disabled
                class="w-full h-10 rounded-lg border border-primary bg-orange-50 px-3 font-mono font-bold text-sm text-primary dark:border-primary dark:bg-orange-950/40 dark:text-primary"
              />
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
          <button
            type="button"
            class="rounded-lg bg-gray-100 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 transition"
            @click="resetForm"
          >
            Reset
          </button>
          <button
            type="submit"
            class="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow hover:bg-primary-600 transition"
          >
            Save
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

