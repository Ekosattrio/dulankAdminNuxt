<script setup lang="ts">
import { formatRupiah } from '~/composables/useFormatters'

interface CashAdvanceItem {
  id: string
  employee: string
  date: string
  tenorTotal: number
  tenorRemain: number
  totalCash: number
  period: 'Daily' | 'Weekly' | 'Monthly'
  note?: string
  status: 'On' | 'Close'
  history: Array<{
    date: string
    amount: number
    installment: number
    period: string
    tenor: string
    note: string
    status: 'On' | 'Close'
  }>
  payments: Array<{
    date: string
    payment: number
  }>
}

const cashAdvances = ref<CashAdvanceItem[]>([
  {
    id: 'CA001',
    employee: 'Maman Suherman',
    date: '2025-08-28',
    tenorTotal: 5,
    tenorRemain: 2,
    totalCash: 550000,
    period: 'Weekly',
    note: 'Cicilan BMW',
    status: 'On',
    history: [
      { date: '25/02/2026', amount: 500000, installment: 50000, period: 'Weekly', tenor: '10/8', note: 'Cicilan BMW', status: 'On' },
      { date: '25/02/2026', amount: 100000, installment: 50000, period: 'Weekly', tenor: '2/2', note: 'Berobat', status: 'Close' },
      { date: '25/02/2026', amount: 1000000, installment: 50000, period: 'Monthly', tenor: '20/19', note: 'Jalan-jalan', status: 'On' }
    ],
    payments: [
      { date: '25/02/2026', payment: 50000 },
      { date: '25/02/2026', payment: 50000 },
      { date: '25/02/2026', payment: 50000 }
    ]
  },
  {
    id: 'CA002',
    employee: 'Indra Subagja',
    date: '2025-09-02',
    tenorTotal: 4,
    tenorRemain: 1,
    totalCash: 300000,
    period: 'Monthly',
    note: 'Renovasi rumah',
    status: 'On',
    history: [
      { date: '02/09/2025', amount: 300000, installment: 75000, period: 'Monthly', tenor: '4/3', note: 'Renovasi rumah', status: 'On' }
    ],
    payments: [
      { date: '02/10/2025', payment: 75000 },
      { date: '02/11/2025', payment: 75000 },
      { date: '02/12/2025', payment: 75000 }
    ]
  },
  {
    id: 'CA003',
    employee: 'Saepul Ahmad',
    date: '2025-08-15',
    tenorTotal: 6,
    tenorRemain: 0,
    totalCash: 600000,
    period: 'Monthly',
    note: 'Kebutuhan keluarga',
    status: 'Close',
    history: [
      { date: '15/08/2025', amount: 600000, installment: 100000, period: 'Monthly', tenor: '6/6', note: 'Lunas', status: 'Close' }
    ],
    payments: [
      { date: '15/09/2025', payment: 100000 },
      { date: '15/10/2025', payment: 100000 },
      { date: '15/11/2025', payment: 100000 },
      { date: '15/12/2025', payment: 100000 },
      { date: '15/01/2026', payment: 100000 },
      { date: '15/02/2026', payment: 100000 }
    ]
  }
])

const searchQuery = ref('')
const filteredCashAdvances = computed(() => {
  if (!searchQuery.value) return cashAdvances.value
  const q = searchQuery.value.toLowerCase()
  return cashAdvances.value.filter(
    (ca) => ca.employee.toLowerCase().includes(q) || ca.id.toLowerCase().includes(q)
  )
})

const columns = [
  { key: 'employee', label: 'Employee' },
  { key: 'date', label: 'Date' },
  { key: 'tenor', label: 'Tenor' },
  { key: 'totalCash', label: 'Total Cash' },
  { key: 'status', label: 'Status' },
  { key: 'action', label: 'Action', class: 'text-end no-sort' }
]

// Modal Add
const isAddModalOpen = ref(false)
const addForm = reactive({
  name: '',
  date: new Date().toISOString().split('T')[0],
  amount: 0,
  period: 'Monthly' as 'Daily' | 'Weekly' | 'Monthly',
  description: ''
})

const submitAdd = () => {
  if (!addForm.name || !addForm.amount) {
    alert('Please fill employee name and amount')
    return
  }
  cashAdvances.value.push({
    id: `CA00${cashAdvances.value.length + 1}`,
    employee: addForm.name,
    date: addForm.date,
    tenorTotal: 5,
    tenorRemain: 5,
    totalCash: Number(addForm.amount),
    period: addForm.period,
    note: addForm.description,
    status: 'On',
    history: [
      {
        date: addForm.date,
        amount: Number(addForm.amount),
        installment: Math.round(Number(addForm.amount) / 5),
        period: addForm.period,
        tenor: '5/0',
        note: addForm.description,
        status: 'On'
      }
    ],
    payments: []
  })
  isAddModalOpen.value = false
}

// Modal View
const isViewModalOpen = ref(false)
const viewingItem = ref<CashAdvanceItem | null>(null)
const activeViewTab = ref<'debit' | 'credit'>('debit')

const openViewModal = (item: CashAdvanceItem) => {
  viewingItem.value = item
  activeViewTab.value = 'debit'
  isViewModalOpen.value = true
}

// Modal Edit
const isEditModalOpen = ref(false)
const editingItem = ref<CashAdvanceItem | null>(null)
const editForm = reactive({
  amount: 0,
  period: 'Monthly' as 'Daily' | 'Weekly' | 'Monthly',
  note: ''
})

const openEditModal = (item: CashAdvanceItem) => {
  editingItem.value = item
  editForm.amount = item.totalCash
  editForm.period = item.period
  editForm.note = item.note || ''
  isEditModalOpen.value = true
}

const submitEdit = () => {
  if (!editingItem.value) return
  editingItem.value.totalCash = Number(editForm.amount)
  editingItem.value.period = editForm.period
  editingItem.value.note = editForm.note
  isEditModalOpen.value = false
}

const deleteItem = (id: string) => {
  if (confirm('Are you sure you want to delete this cash advance?')) {
    cashAdvances.value = cashAdvances.value.filter((ca) => ca.id !== id)
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <CommonPageHeader title="Cash Advance List" subtitle="Manage your Cash Advance">
      <template #actions>
        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-600 focus:outline-none"
          @click="isAddModalOpen = true"
        >
          <FeatherIcon name="plus-circle" size="18" />
          <span>Add New Cash Advance</span>
        </button>
      </template>
    </CommonPageHeader>

    <!-- Stat Card -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <div class="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-primary dark:bg-orange-950/40">
          <FeatherIcon name="dollar-sign" size="24" />
        </div>
        <div>
          <p class="text-xs font-medium text-gray-500">Total Cash Advance</p>
          <h4 class="mt-1 font-mono text-xl font-bold text-gray-900 dark:text-gray-100">307,144.00</h4>
        </div>
      </div>
    </div>

    <!-- Table Card -->
    <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="mb-5 flex items-center justify-between">
        <div class="relative w-64">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search employee..."
            class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 pe-8 text-sm text-gray-800 placeholder-gray-400 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          />
          <span class="pointer-events-none absolute inset-y-0 end-0 flex items-center pe-2.5 text-gray-400">
            <FeatherIcon name="search" size="16" />
          </span>
        </div>
      </div>

      <TableDataTable :columns="columns" :rows="filteredCashAdvances">
        <template #cell(employee)="{ row }">
          <div class="font-medium text-gray-900 dark:text-gray-100">{{ row.employee }}</div>
          <div class="text-xs text-gray-400">{{ row.note }}</div>
        </template>

        <template #cell(date)="{ row }">
          <span class="text-xs text-gray-600 dark:text-gray-400">{{ row.date }}</span>
        </template>

        <template #cell(tenor)="{ row }">
          <span class="inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            Tenor({{ row.tenorTotal }}) / remain({{ row.tenorRemain }})
          </span>
        </template>

        <template #cell(totalCash)="{ row }">
          <span class="font-mono font-bold text-gray-900 dark:text-gray-100">{{ formatRupiah(row.totalCash) }}</span>
        </template>

        <template #cell(status)="{ row }">
          <span
            :class="[
              'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
              row.status === 'On' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
            ]"
          >
            {{ row.status }}
          </span>
        </template>

        <template #cell(action)="{ row }">
          <div class="flex items-center justify-end gap-2">
            <button
              type="button"
              class="rounded-lg p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-primary dark:hover:bg-gray-800"
              title="View History"
              @click="openViewModal(row)"
            >
              <FeatherIcon name="eye" size="16" />
            </button>
            <button
              type="button"
              class="rounded-lg p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-amber-500 dark:hover:bg-gray-800"
              title="Edit"
              @click="openEditModal(row)"
            >
              <FeatherIcon name="edit" size="16" />
            </button>
            <button
              type="button"
              class="rounded-lg p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-rose-600 dark:hover:bg-gray-800"
              title="Delete"
              @click="deleteItem(row.id)"
            >
              <FeatherIcon name="trash-2" size="16" />
            </button>
          </div>
        </template>
      </TableDataTable>
    </div>

    <!-- Modal Add Cash Advance -->
    <ModalBaseModal v-model="isAddModalOpen" title="Add New Cash Advance" size="md">
      <form @submit.prevent="submitAdd" class="space-y-4">
        <div>
          <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Name</label>
          <FormsEmployeeLiveSearch
            v-model="addForm.name"
            placeholder="Choose employee..."
            @select="(e: any) => addForm.name = e.name"
          />
        </div>

        <div>
          <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Expense Date</label>
          <input
            v-model="addForm.date"
            type="date"
            class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          />
        </div>

        <div>
          <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Amount Cash Advance</label>
          <FormsNumberInput v-model="addForm.amount" />
        </div>

        <div>
          <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Payment Periode</label>
          <select
            v-model="addForm.period"
            class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          >
            <option value="Daily">Daily</option>
            <option value="Weekly">Weekly</option>
            <option value="Monthly">Monthly</option>
          </select>
        </div>

        <div>
          <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Description</label>
          <textarea
            v-model="addForm.description"
            rows="2"
            class="w-full rounded-lg border border-gray-200 bg-white p-2.5 text-xs text-gray-800 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            placeholder="Enter note here..."
          ></textarea>
        </div>

        <div class="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
          <button
            type="button"
            class="rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
            @click="isAddModalOpen = false"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white shadow hover:bg-primary-600 transition"
          >
            Submit
          </button>
        </div>
      </form>
    </ModalBaseModal>

    <!-- Modal View Cash Advance (Debit & Credit Tabs) -->
    <ModalBaseModal v-model="isViewModalOpen" title="Cash Advance Details" size="xl">
      <div v-if="viewingItem" class="space-y-4">
        <!-- Header info -->
        <div class="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
          <div>
            <h6 class="font-bold text-gray-900 dark:text-gray-100">{{ viewingItem.employee }}</h6>
            <p class="text-xs text-gray-500">Date: {{ viewingItem.date }} &bull; Note: {{ viewingItem.note || '-' }}</p>
          </div>
          <div class="text-end">
            <span class="font-mono text-base font-bold text-primary">{{ formatRupiah(viewingItem.totalCash) }}</span>
            <div class="text-xs text-gray-400">Tenor({{ viewingItem.tenorTotal }}) / remain({{ viewingItem.tenorRemain }})</div>
          </div>
        </div>

        <!-- Tab switcher -->
        <div class="flex border-b border-gray-200 dark:border-gray-700">
          <button
            type="button"
            :class="[
              'px-4 py-2 text-sm font-semibold border-b-2 transition',
              activeViewTab === 'debit'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            ]"
            @click="activeViewTab = 'debit'"
          >
            Debit (Cash Advance History)
          </button>
          <button
            type="button"
            :class="[
              'px-4 py-2 text-sm font-semibold border-b-2 transition',
              activeViewTab === 'credit'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            ]"
            @click="activeViewTab = 'credit'"
          >
            Credit (Payment Installments)
          </button>
        </div>

        <!-- Debit Tab -->
        <div v-if="activeViewTab === 'debit'" class="overflow-x-auto">
          <table class="w-full text-xs">
            <thead>
              <tr class="border-b border-gray-200 text-left font-bold text-gray-700 dark:border-gray-700 dark:text-gray-300">
                <th class="pb-2">Date</th>
                <th class="pb-2 text-end">Amount</th>
                <th class="pb-2 text-end">Installment</th>
                <th class="pb-2">Periode</th>
                <th class="pb-2">Tenor</th>
                <th class="pb-2">Note</th>
                <th class="pb-2">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
              <tr v-for="(h, idx) in viewingItem.history" :key="idx">
                <td class="py-2">{{ h.date }}</td>
                <td class="py-2 text-end font-mono">{{ formatRupiah(h.amount) }}</td>
                <td class="py-2 text-end font-mono">{{ formatRupiah(h.installment) }}</td>
                <td class="py-2">{{ h.period }}</td>
                <td class="py-2 font-mono">{{ h.tenor }}</td>
                <td class="py-2">{{ h.note }}</td>
                <td class="py-2">
                  <span
                    :class="[
                      'rounded-full px-2 py-0.5 text-[10px] font-semibold',
                      h.status === 'On' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                    ]"
                  >
                    {{ h.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Credit Tab -->
        <div v-if="activeViewTab === 'credit'" class="overflow-x-auto">
          <table class="w-full text-xs">
            <thead>
              <tr class="border-b border-gray-200 text-left font-bold text-gray-700 dark:border-gray-700 dark:text-gray-300">
                <th class="pb-2">Date</th>
                <th class="pb-2 text-end">Payment Amount</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
              <tr v-for="(p, idx) in viewingItem.payments" :key="idx">
                <td class="py-2">{{ p.date }}</td>
                <td class="py-2 text-end font-mono text-emerald-600 dark:text-emerald-400">{{ formatRupiah(p.payment) }}</td>
              </tr>
              <tr v-if="viewingItem.payments.length === 0">
                <td colspan="2" class="py-4 text-center text-gray-400">No payment records yet</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end">
          <button
            type="button"
            class="rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
            @click="isViewModalOpen = false"
          >
            Close
          </button>
        </div>
      </template>
    </ModalBaseModal>

    <!-- Modal Edit Cash Advance -->
    <ModalBaseModal v-model="isEditModalOpen" title="Edit Cash Advance" size="md">
      <form @submit.prevent="submitEdit" class="space-y-4">
        <div>
          <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Employee</label>
          <input
            :value="editingItem?.employee"
            disabled
            class="w-full h-10 rounded-lg border border-gray-200 bg-gray-100 px-3 text-sm text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
          />
        </div>

        <div>
          <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Amount Cash Advance</label>
          <FormsNumberInput v-model="editForm.amount" />
        </div>

        <div>
          <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Payment Periode</label>
          <select
            v-model="editForm.period"
            class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          >
            <option value="Daily">Daily</option>
            <option value="Weekly">Weekly</option>
            <option value="Monthly">Monthly</option>
          </select>
        </div>

        <div>
          <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Note</label>
          <input
            v-model="editForm.note"
            type="text"
            class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          />
        </div>

        <div class="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
          <button
            type="button"
            class="rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
            @click="isEditModalOpen = false"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-white shadow hover:bg-primary-600 transition"
          >
            Save Changes
          </button>
        </div>
      </form>
    </ModalBaseModal>
  </div>
</template>

