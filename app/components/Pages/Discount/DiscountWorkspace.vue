<script setup lang="ts">
import type { DiscountFormData, DiscountItem } from '#server/types/discount'
import type { DiscountPlanView } from '#server/types/discount-plan'

const search = ref('')
const status = ref('')
const plan = ref('')
const collapsed = ref(false)

const query = computed(() => ({
  search: search.value || undefined,
  plan: plan.value || undefined,
  status: status.value || undefined,
}))

const { discounts, pending, error, refresh, saveDiscount, deleteDiscount } = useDiscounts(query)

const planState = useDiscountPlans(ref({ search: undefined, sort: undefined }))
const planOptions = computed(() =>
  planState.plans.value.map((item: DiscountPlanView) => ({ label: item.name, value: item.id })),
)

const adding = ref(false)
const editing = ref<DiscountItem | null>(null)
const deleting = ref<DiscountItem | null>(null)
const busy = ref(false)
const message = ref('')
const actionError = ref('')

const { isPrintModalOpen, defaultPrintAction, openPrintModal, closePrintModal } = useTablePrint()
const printColumns = [
  { key: 'name', label: 'Discount Name' },
  { key: 'plan', label: 'Discount Plan' },
  { key: 'value', label: 'Value' },
  { key: 'validFrom', label: 'Valid From' },
  { key: 'validTill', label: 'Valid Till' },
  { key: 'used', label: 'Used' },
  { key: 'status', label: 'Status' },
]

function resetFilters() {
  search.value = ''
  status.value = ''
  plan.value = ''
  refresh()
}

function openAdd() {
  editing.value = null
  adding.value = true
}

function openEdit(item: DiscountItem) {
  editing.value = item
  adding.value = true
}

function closeForm() {
  adding.value = false
  editing.value = null
}

async function save(payload: DiscountFormData) {
  busy.value = true
  actionError.value = ''
  try {
    const response = editing.value ? await saveDiscount({ ...payload, id: editing.value.id }) : await saveDiscount(payload)
    message.value = response.message || 'Discount saved successfully.'
    closeForm()
  } catch (cause: any) {
    actionError.value = cause?.data?.message || cause?.data?.statusMessage || cause?.message || 'Unable to save discount'
  } finally {
    busy.value = false
  }
}

async function remove() {
  if (!deleting.value) return
  busy.value = true
  actionError.value = ''
  try {
    const response = await deleteDiscount(deleting.value.id)
    message.value = response.message || 'Discount deleted successfully.'
    deleting.value = null
  } catch (cause: any) {
    actionError.value = cause?.data?.message || cause?.data?.statusMessage || cause?.message || 'Unable to delete discount'
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <SalesListHeader
      title="Discount"
      subtitle="Manage your discount"
      add-label="Add Discount"
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
    <SalesFeedback :pending="pending" skeleton="table" :skeleton-cols="7" :error="error ? 'Unable to load discounts. Please try again.' : ''" @retry="refresh()" />

    <DiscountRecordsTable
      v-if="!collapsed && !pending && !error"
      :items="discounts"
      :search="search"
      :status="status"
      :plan="plan"
      :plan-options="planOptions"
      @update:search="search = $event"
      @update:status="status = $event"
      @update:plan="plan = $event"
      @edit="openEdit"
      @delete="deleting = $event"
    />

    <DiscountFormDialog :open="adding" :item="editing" :plans="planOptions" :busy="busy" @close="closeForm" @submit="save" />
    <SalesConfirmDelete
      :open="!!deleting"
      title="Delete Discount"
      message="Are you sure you want to delete this discount? This action cannot be undone."
      :busy="busy"
      :error="actionError"
      @close="deleting = null"
      @confirm="remove"
    />
    <DocumentPrintModal
      :open="isPrintModalOpen"
      title="Discount Report"
      subtitle="Daftar program diskon"
      :columns="printColumns"
      :items="discounts"
      :show-date-range="false"
      :default-action="defaultPrintAction"
      @close="closePrintModal"
    />
  </div>
</template>