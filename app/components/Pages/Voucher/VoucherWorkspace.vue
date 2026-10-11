<script setup lang="ts">
import type { VoucherCommand, VoucherQuery, VoucherRecord } from '#server/types/voucher'
import type { DateRangeValue } from '~/composables/useDateRange'
import { formatVoucherDate, formatVoucherDiscount } from '~/utils/voucher'

const search = ref(''), name = ref(''), type = ref(''), storeId = ref(''), productId = ref('')
const dateRange = ref<DateRangeValue | null>(null), collapsed = ref(false)
const query = computed<VoucherQuery>(() => ({ search: search.value || undefined, name: name.value || undefined, type: type.value || undefined, storeId: storeId.value || undefined, productId: productId.value || undefined, startDate: dateRange.value?.start, endDate: dateRange.value?.end }))
const { vouchers, meta, pending, error, refresh, createVoucher, updateVoucher, deleteVoucher } = useVouchers(query)
const editing = ref<VoucherRecord | null>(null), adding = ref(false), deleting = ref<VoucherRecord | null>(null), busy = ref(false), message = ref(''), actionError = ref('')
const { isPrintModalOpen, defaultPrintAction, openPrintModal, closePrintModal } = useTablePrint()
const printColumns = [{ key: 'name', label: 'Name' }, { key: 'code', label: 'Code' }, { key: 'type', label: 'Type' }, { key: 'discountLabel', label: 'Discount', align: 'right' as const }, { key: 'limitLabel', label: 'Limit', align: 'right' as const }, { key: 'usedLabel', label: 'Used', align: 'right' as const }, { key: 'validLabel', label: 'Valid' }, { key: 'status', label: 'Status' }]
const printable = computed(() => vouchers.value.map(item => ({ ...item, discountLabel: formatVoucherDiscount(item), limitLabel: item.limit === 0 ? 'Unlimited' : String(item.limit).padStart(2, '0'), usedLabel: String(item.used).padStart(2, '0'), validLabel: formatVoucherDate(item.endDate) })))
function resetFilters() { search.value = ''; name.value = ''; type.value = ''; storeId.value = ''; productId.value = ''; dateRange.value = null; refresh() }
async function save(command: VoucherCommand) {
  busy.value = true; actionError.value = ''
  try { const response = editing.value ? await updateVoucher(editing.value.id, command) : await createVoucher(command); message.value = response.message; editing.value = null; adding.value = false }
  catch (cause: any) { actionError.value = cause?.data?.message || cause?.data?.statusMessage || cause?.message || 'Unable to save voucher' }
  finally { busy.value = false }
}
async function remove() {
  if (!deleting.value) return
  busy.value = true; actionError.value = ''
  try { const response = await deleteVoucher(deleting.value.id); message.value = response.message; deleting.value = null }
  catch (cause: any) { actionError.value = cause?.data?.message || cause?.data?.statusMessage || cause?.message || 'Unable to delete voucher' }
  finally { busy.value = false }
}
</script>

<template>
  <div class="space-y-6">
    <SalesListHeader title="Coupons" subtitle="Manage Your Coupons" add-label="Add New Coupons" :refreshing="pending" @add="adding = true" @refresh="resetFilters" @print="openPrintModal('print')" @pdf="openPrintModal('pdf')">
      <template #actions><button type="button" title="Collapse" aria-label="Collapse" class="flex size-9 items-center justify-center rounded border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300" @click="collapsed = !collapsed"><FeatherIcon :name="collapsed ? 'chevron-down' : 'chevron-up'" :size="14" /></button></template>
    </SalesListHeader>
    <SalesFeedback :message="message" :error="actionError" @dismiss="message = ''" @retry="actionError = ''" />
    <SalesFeedback :pending="pending" skeleton="table" :skeleton-cols="9" :error="error ? 'Unable to load coupons. Please try again.' : ''" @retry="refresh()" />
    <VoucherRecordsTable v-if="!collapsed && !pending && !error" :items="vouchers" :meta="meta" :search="search" :name="name" :type="type" :store-id="storeId" :product-id="productId" :date-range="dateRange" @update:search="search = $event" @update:name="name = $event" @update:type="type = $event" @update:store-id="storeId = $event" @update:product-id="productId = $event" @update:date-range="dateRange = $event" @report="openPrintModal('print')" @edit="editing = $event" @delete="deleting = $event" />
    <VoucherFormDialog :open="adding || !!editing" :item="editing" :products="meta.products" :busy="busy" @close="adding = false; editing = null" @submit="save" />
    <SalesConfirmDelete :open="!!deleting" title="Delete Voucher" message="Are you sure you want to delete this coupon/voucher? This action cannot be undone." :busy="busy" :error="actionError" @close="deleting = null" @confirm="remove" />
    <DocumentPrintModal :open="isPrintModalOpen" title="Voucher and Coupon Report" subtitle="Daftar voucher, kupon, dan masa berlakunya" :columns="printColumns" :items="printable" date-field="endDate" :initial-date-range="dateRange" :default-action="defaultPrintAction" @close="closePrintModal" />
  </div>
</template>
