<script setup lang="ts">
import type { ExpenseCategory, ExpenseCategoryFormData } from '#server/types/expense-category'

const search = ref('')
const status = ref('')
const collapsed = ref(false)

const query = computed(() => ({
  search: search.value || undefined,
  status: status.value || undefined,
}))

const { expenseCategories, pending, error, refresh, saveExpenseCategory, deleteExpenseCategory } = useExpenseCategories(query)

const adding = ref(false)
const editing = ref<ExpenseCategory | null>(null)
const deleting = ref<ExpenseCategory | null>(null)
const busy = ref(false)
const message = ref('')
const actionError = ref('')

const { isPrintModalOpen, defaultPrintAction, openPrintModal, closePrintModal } = useTablePrint()
const printColumns = [
  { key: 'categoryName', label: 'Category Name' },
  { key: 'date', label: 'Date' },
  { key: 'status', label: 'Status' },
]

function resetFilters() {
  search.value = ''
  status.value = ''
  refresh()
}

function openAdd() {
  editing.value = null
  adding.value = true
}

function openEdit(item: ExpenseCategory) {
  editing.value = item
  adding.value = true
}

function closeForm() {
  adding.value = false
  editing.value = null
}

async function save(payload: ExpenseCategoryFormData) {
  busy.value = true
  actionError.value = ''
  try {
    const response = await saveExpenseCategory(payload)
    message.value = response.message || 'Category saved successfully.'
    closeForm()
  } catch (cause: any) {
    actionError.value = cause?.data?.message || cause?.data?.statusMessage || cause?.message || 'Unable to save category'
  } finally {
    busy.value = false
  }
}

async function remove() {
  if (!deleting.value) return
  busy.value = true
  actionError.value = ''
  try {
    const response = await deleteExpenseCategory(deleting.value.id)
    message.value = response.message || 'Category deleted successfully.'
    deleting.value = null
  } catch (cause: any) {
    actionError.value = cause?.data?.message || cause?.data?.statusMessage || cause?.message || 'Unable to delete category'
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <SalesListHeader
      title="Expense Category"
      subtitle="Manage your expense categories"
      add-label="Add Category"
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
    <SalesFeedback :pending="pending" skeleton="table" :skeleton-cols="4" :error="error ? 'Unable to load categories. Please try again.' : ''" @retry="refresh()" />

    <ExpenseCategoryRecordsTable
      v-if="!collapsed && !pending && !error"
      :items="expenseCategories"
      :search="search"
      :status="status"
      @update:search="search = $event"
      @update:status="status = $event"
      @edit="openEdit"
      @delete="deleting = $event"
    />

    <ExpenseCategoryFormDialog :open="adding" :item="editing" :busy="busy" @close="closeForm" @submit="save" />
    <SalesConfirmDelete
      :open="!!deleting"
      title="Delete Category"
      message="Are you sure you want to delete this expense category? This action cannot be undone."
      :busy="busy"
      :error="actionError"
      @close="deleting = null"
      @confirm="remove"
    />
    <DocumentPrintModal
      :open="isPrintModalOpen"
      title="Expense Category Report"
      subtitle="Daftar kategori pengeluaran"
      :columns="printColumns"
      :items="expenseCategories"
      :show-date-range="false"
      :default-action="defaultPrintAction"
      @close="closePrintModal"
    />
  </div>
</template>