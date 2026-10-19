<script setup lang="ts">
import type { IncomeRecord, IncomeFormData } from '#server/types/income'

const search = ref('')
const category = ref('')
const collapsed = ref(false)

const query = computed(() => ({
  search: search.value || undefined,
  category: category.value || undefined,
}))

const { incomes, pending, error, refresh, saveIncome, deleteIncome } = useIncomes(query)
const { accounts: bankAccounts } = useBankAccounts()
const { items: incomeCategories } = useIncomeCategories()

const activeBankAccounts = computed(() => bankAccounts.value.filter(account => account.status === 'Active'))
const bankOptions = computed(() => activeBankAccounts.value.map(account => ({ label: `${account.bankName} - ${account.accountName}`, value: account.id })))
const categoryOptions = computed(() => incomeCategories.value.map(category => ({ label: category.name, value: category.name })))

const adding = ref(false)
const editing = ref<IncomeRecord | null>(null)
const deleting = ref<IncomeRecord | null>(null)
const busy = ref(false)
const message = ref('')
const actionError = ref('')

const { isPrintModalOpen, defaultPrintAction, openPrintModal, closePrintModal } = useTablePrint()
const printColumns = [
  { key: 'no', label: 'No Income' },
  { key: 'date', label: 'Date' },
  { key: 'name', label: 'Income' },
  { key: 'category', label: 'Category' },
  { key: 'amount', label: 'Amount (IDR)' },
  { key: 'paymentMethod', label: 'Method' },
]

function resetFilters() {
  search.value = ''
  category.value = ''
  refresh()
}

function openAdd() {
  editing.value = null
  adding.value = true
}

function openEdit(item: IncomeRecord) {
  editing.value = item
  adding.value = true
}

function closeForm() {
  adding.value = false
  editing.value = null
}

async function save(payload: IncomeFormData) {
  busy.value = true
  actionError.value = ''
  try {
    const response = await saveIncome(payload)
    message.value = response.message || 'Income saved successfully.'
    closeForm()
  } catch (cause: any) {
    actionError.value = cause?.data?.message || cause?.data?.statusMessage || cause?.message || 'Unable to save income'
  } finally {
    busy.value = false
  }
}

async function remove() {
  if (!deleting.value) return
  busy.value = true
  actionError.value = ''
  try {
    const response = await deleteIncome(deleting.value.id)
    message.value = response.message || 'Income deleted successfully.'
    deleting.value = null
  } catch (cause: any) {
    actionError.value = cause?.data?.message || cause?.data?.statusMessage || cause?.message || 'Unable to delete income'
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <SalesListHeader
      title="Income"
      subtitle="Manage your income"
      add-label="Add Income"
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
    <SalesFeedback :pending="pending" skeleton="table" :skeleton-cols="7" :error="error ? 'Unable to load incomes. Please try again.' : ''" @retry="refresh()" />

    <IncomeRecordsTable
      v-if="!collapsed && !pending && !error"
      :items="incomes"
      :search="search"
      :category="category"
      :category-options="categoryOptions"
      @update:search="search = $event"
      @update:category="category = $event"
      @edit="openEdit"
      @delete="deleting = $event"
    />

    <IncomeFormDialog :open="adding" :item="editing" :categories="categoryOptions" :bank-accounts="bankOptions" :busy="busy" @close="closeForm" @submit="save" />
    <SalesConfirmDelete
      :open="!!deleting"
      title="Delete Income"
      message="Are you sure you want to delete this income? This action cannot be undone."
      :busy="busy"
      :error="actionError"
      @close="deleting = null"
      @confirm="remove"
    />
    <DocumentPrintModal
      :open="isPrintModalOpen"
      title="Income Report"
      subtitle="Daftar pendapatan"
      :columns="printColumns"
      :items="incomes"
      :show-date-range="false"
      :default-action="defaultPrintAction"
      @close="closePrintModal"
    />
  </div>
</template>