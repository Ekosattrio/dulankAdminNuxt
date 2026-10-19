<script setup lang="ts">
import type { CouponFormData, CouponItem } from '#server/types/coupon'

const search = ref('')
const type = ref('')
const status = ref('')
const collapsed = ref(false)

const query = computed(() => ({
  search: search.value || undefined,
  type: type.value || undefined,
  status: status.value || undefined,
}))

const { coupons, pending, error, refresh, saveCoupon, deleteCoupon } = useCoupons(query)

const adding = ref(false)
const editing = ref<CouponItem | null>(null)
const deleting = ref<CouponItem | null>(null)
const busy = ref(false)
const message = ref('')
const actionError = ref('')

const { isPrintModalOpen, defaultPrintAction, openPrintModal, closePrintModal } = useTablePrint()
const printColumns = [
  { key: 'name', label: 'Name' },
  { key: 'code', label: 'Code' },
  { key: 'type', label: 'Type' },
  { key: 'discount', label: 'Discount' },
  { key: 'limit', label: 'Limit' },
  { key: 'used', label: 'Used' },
  { key: 'valid', label: 'Valid' },
  { key: 'status', label: 'Status' },
]

function resetFilters() {
  search.value = ''
  type.value = ''
  status.value = ''
  refresh()
}

function openAdd() {
  editing.value = null
  adding.value = true
}

function openEdit(item: CouponItem) {
  editing.value = item
  adding.value = true
}

function closeForm() {
  adding.value = false
  editing.value = null
}

async function save(payload: CouponFormData) {
  busy.value = true
  actionError.value = ''
  try {
    const response = await saveCoupon(payload)
    message.value = response.message || 'Coupon saved successfully.'
    closeForm()
  } catch (cause: any) {
    actionError.value = cause?.data?.message || cause?.message || 'Unable to save coupon'
  } finally {
    busy.value = false
  }
}

async function remove() {
  if (!deleting.value) return
  busy.value = true
  actionError.value = ''
  try {
    const response = await deleteCoupon(deleting.value.id)
    message.value = response.message || 'Coupon deleted successfully.'
    deleting.value = null
  } catch (cause: any) {
    actionError.value = cause?.data?.message || cause?.message || 'Unable to delete coupon'
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <SalesListHeader
      title="Coupons"
      subtitle="Manage Your Coupons"
      add-label="Add New Coupons"
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
    <SalesFeedback
      :pending="pending"
      skeleton="table"
      :skeleton-cols="8"
      :error="error ? 'Unable to load coupons. Please try again.' : ''"
      @retry="refresh()"
    />

    <CouponRecordsTable
      v-if="!collapsed && !pending && !error"
      :items="coupons"
      :search="search"
      :type="type"
      :status="status"
      @update:search="search = $event"
      @update:type="type = $event"
      @update:status="status = $event"
      @edit="openEdit"
      @delete="deleting = $event"
    />

    <CouponFormDialog
      :open="adding"
      :item="editing"
      :busy="busy"
      @close="closeForm"
      @submit="save"
    />

    <SalesConfirmDelete
      :open="!!deleting"
      title="Delete Coupon"
      message="Are you sure you want to delete this coupon? This action cannot be undone."
      :busy="busy"
      :error="actionError"
      @close="deleting = null"
      @confirm="remove"
    />

    <DocumentPrintModal
      :open="isPrintModalOpen"
      title="Coupons Report"
      subtitle="Daftar kupon promosi"
      :columns="printColumns"
      :items="coupons"
      :show-date-range="false"
      :default-action="defaultPrintAction"
      @close="closePrintModal"
    />
  </div>
</template>

