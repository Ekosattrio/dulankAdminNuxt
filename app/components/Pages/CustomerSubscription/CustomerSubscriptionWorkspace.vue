<script setup lang="ts">
import type { CustomerSubscriptionItem, SubscribePayload } from '#server/types/customer-subscription'

const search = ref('')
const status = ref('')
const collapsed = ref(false)

const query = computed(() => ({
  search: search.value || undefined,
  status: status.value || undefined,
}))

const { rows, summary, pending, error, refresh, subscribe, updateSubscription } = useCustomerSubscriptions(query)
const { customers } = useCustomers()

const customerOptions = computed(() =>
  customers.value.map(customer => ({ label: `${customer.name}${customer.email ? ` (${customer.email})` : ''}`, value: customer.id })),
)

const dialogOpen = ref(false)
const editing = ref<CustomerSubscriptionItem | null>(null)
const busy = ref(false)
const message = ref('')
const actionError = ref('')

const { isPrintModalOpen, defaultPrintAction, openPrintModal, closePrintModal } = useTablePrint()
const printColumns = [
  { key: 'customer', label: 'Customer' },
  { key: 'email', label: 'Email' },
  { key: 'plan', label: 'Plan' },
  { key: 'billingCycle', label: 'Billing Cycle' },
  { key: 'amount', label: 'Amount (IDR)' },
  { key: 'expiringOn', label: 'Expiring On' },
  { key: 'status', label: 'Status' },
]

const statCards = computed(() => [
  { label: 'Total Subscriber', value: summary.value.totalSubscribers, icon: 'users', tone: 'primary' as const },
  { label: 'Aktif', value: summary.value.activeSubscribers, icon: 'check-circle', tone: 'success' as const },
  { label: 'Kadaluarsa', value: summary.value.expiredSubscribers, icon: 'clock', tone: 'warning' as const },
])

function resetFilters() {
  search.value = ''
  status.value = ''
  refresh()
}

function openSubscribe() {
  editing.value = null
  dialogOpen.value = true
}

function openEdit(item: CustomerSubscriptionItem) {
  editing.value = item
  dialogOpen.value = true
}

function closeDialog() {
  dialogOpen.value = false
  editing.value = null
}

async function save(payload: SubscribePayload) {
  busy.value = true
  actionError.value = ''
  try {
    const response = editing.value?.id
      ? await updateSubscription(editing.value.id, payload)
      : await subscribe(payload)
    message.value = response.message || 'Subscription saved successfully.'
    closeDialog()
  } catch (cause: any) {
    actionError.value = cause?.data?.message || cause?.data?.statusMessage || cause?.message || 'Unable to save subscription'
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <SalesListHeader
      title="Customer Subscription"
      subtitle="Relasi pelanggan dan subskripsi"
      :refreshing="pending"
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
    <SalesFeedback :pending="pending" skeleton="card" :skeleton-cols="3" :error="error ? 'Unable to load customer subscriptions. Please try again.' : ''" @retry="refresh()" />

    <template v-if="!pending && !error">
      <div v-if="!collapsed" class="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard v-for="card in statCards" :key="card.label" :label="card.label" :value="String(card.value)" :icon="card.icon" :tone="card.tone" />
      </div>

      <CustomerSubscriptionRecordsTable
        v-if="!collapsed"
        :items="rows"
        :search="search"
        :status="status"
        @update:search="search = $event"
        @update:status="status = $event"
        @edit="openEdit"
        @subscribe="openSubscribe"
      />
    </template>

    <CustomerSubscriptionFormDialog :open="dialogOpen" :item="editing" :customers="customerOptions" :busy="busy" @close="closeDialog" @submit="save" />
    <DocumentPrintModal
      :open="isPrintModalOpen"
      title="Customer Subscription Report"
      subtitle="Daftar relasi pelanggan dan subskripsi"
      :columns="printColumns"
      :items="rows"
      :show-date-range="false"
      :default-action="defaultPrintAction"
      @close="closePrintModal"
    />
  </div>
</template>