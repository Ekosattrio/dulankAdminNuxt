<script setup lang="ts">
import type { Expense, ExpenseFormData } from '#server/types/expense'

const search = ref('')
const status = ref('')
const category = ref('')
const collapsed = ref(false)

const query = computed(() => ({
  search: search.value || undefined,
  status: status.value || undefined,
  category: category.value || undefined,
}))

const { expenses, pending, error, refresh, saveExpense, deleteExpense } = useExpenses(query)
const { accounts: bankAccounts } = useBankAccounts()
const { expenseCategories } = useExpenseCategories()

const activeBankAccounts = computed(() => bankAccounts.value.filter(account => account.status === 'Active'))
const bankOptions = computed(() =>
  activeBankAccounts.value.map(account => ({ label: `${account.bankName} - ${account.accountName}`, value: account.id })),
)
const categoryOptions = computed(() =>
  expenseCategories.value
    .filter(category => category.status === 'Active' || category.status === 'Deactive')
    .map(category => ({ label: category.categoryName, value: category.categoryName })),
)

const adding = ref(false)
const editing = ref<Expense | null>(null)
const deleting = ref<Expense | null>(null)
const busy = ref(false)
const message = ref('')
const actionError = ref('')

const { isPrintModalOpen, defaultPrintAction, openPrintModal, closePrintModal } = useTablePrint()
const printColumns = [
  { key: 'noExpense', label: 'No Expense' },
  { key: 'date', label: 'Date' },
  { key: 'name', label: 'Expense' },
  { key: 'category', label: 'Category' },
  { key: 'amount', label: 'Amount (IDR)' },
  { key: 'paid', label: 'Paid (IDR)' },
  { key: 'due', label: 'Due (IDR)' },
  { key: 'status', label: 'Status' },
]

function resetFilters() {
  search.value = ''
  status.value = ''
  category.value = ''
  refresh()
}

function openAdd() {
  editing.value = null
  adding.value = true
}

function openEdit(item: Expense) {
  editing.value = item
  adding.value = true
}

function closeForm() {
  adding.value = false
  editing.value = null
}

async function save(payload: ExpenseFormData) {
  busy.value = true
  actionError.value = ''
  try {
    const response = await saveExpense(payload)
    message.value = response.message || 'Expense saved successfully.'
    closeForm()
  } catch (cause: any) {
    actionError.value = cause?.data?.message || cause?.data?.statusMessage || cause?.message || 'Unable to save expense'
  } finally {
    busy.value = false
  }
}

async function remove() {
  if (!deleting.value) return
  busy.value = true
  actionError.value = ''
  try {
    const response = await deleteExpense(deleting.value.id)
    message.value = response.message || 'Expense deleted successfully.'
    deleting.value = null
  } catch (cause: any) {
    actionError.value = cause?.data?.message || cause?.data?.statusMessage || cause?.message || 'Unable to delete expense'
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <SalesListHeader
      title="Expenses"
      subtitle="Manage your expenses"
      add-label="Add Expense"
      :refreshing="pending"
      @add="openAdd"
      @refresh="resetFilters"
      @print="openPrintModal('print')"
      @pdf="openPrintModal('pdf')"
    >
      <template #actions>
        <button
          type="button"
          title="Collapse"
          aria-label="Collapse"
          class="flex size-9 items-center justify-center rounded border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
          @click="collapsed = !collapsed"
        >
          <FeatherIcon :name="collapsed ? 'chevron-down' : 'chevron-up'" :size="14" />
        </button>
      </template>
    </SalesListHeader>

    <SalesFeedback :message="message" :error="actionError" @dismiss="message = ''" @retry="actionError = ''" />
    <SalesFeedback :pending="pending" skeleton="table" :skeleton-cols="9" :error="error ? 'Unable to load expenses. Please try again.' : ''" @retry="refresh()" />

    <ExpenseRecordsTable
      v-if="!collapsed && !pending && !error"
      :items="expenses"
      :search="search"
      :status="status"
      :category="category"
      :category-options="categoryOptions"
      @update:search="search = $event"
      @update:status="status = $event"
      @update:category="category = $event"
      @edit="openEdit"
      @delete="deleting = $event"
    />

    <ExpenseFormDialog :open="adding" :item="editing" :categories="categoryOptions" :bank-accounts="bankOptions" :busy="busy" @close="closeForm" @submit="save" />
    <SalesConfirmDelete
      :open="!!deleting"
      title="Delete Expense"
      message="Are you sure you want to delete this expense? This action cannot be undone."
      :busy="busy"
      :error="actionError"
      @close="deleting = null"
      @confirm="remove"
    />
    <DocumentPrintModal
      :open="isPrintModalOpen"
      title="Expense Report"
      subtitle="Daftar pengeluaran operasional dan produksi"
      :columns="printColumns"
      :items="expenses"
      :show-date-range="false"
      :default-action="defaultPrintAction"
      @close="closePrintModal"
    />
  </div>
</template>