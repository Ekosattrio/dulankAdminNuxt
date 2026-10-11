<script setup lang="ts">
import type { DiscountPlanCommand, DiscountPlanQuery, DiscountPlanView } from '#server/types/discount-plan'

const search = ref(''), customerSegmentId = ref(''), status = ref(''), collapsed = ref(false)
const query = computed<DiscountPlanQuery>(() => ({ search: search.value || undefined, customerSegmentId: customerSegmentId.value || undefined, status: status.value || undefined }))
const { plans, meta, pending, error, refresh, createPlan, updatePlan, deletePlan, createCustomer } = useDiscountPlans(query)
const adding = ref(false), editing = ref<DiscountPlanView | null>(null), deleting = ref<DiscountPlanView | null>(null), addingCustomer = ref(false)
const addedCustomerSegmentId = ref(''), busy = ref(false), message = ref(''), actionError = ref(''), customerError = ref('')
const { isPrintModalOpen, defaultPrintAction, openPrintModal, closePrintModal } = useTablePrint()
const printColumns = [{ key: 'name', label: 'Plane Name' }, { key: 'customers', label: 'Customers' }, { key: 'status', label: 'Status' }]
function resetFilters() { search.value = ''; customerSegmentId.value = ''; status.value = ''; refresh() }
function openAdd() { addedCustomerSegmentId.value = ''; adding.value = true }
function openEdit(item: DiscountPlanView) { addedCustomerSegmentId.value = ''; editing.value = item }
function closeForm() { adding.value = false; editing.value = null; addingCustomer.value = false }
async function save(command: DiscountPlanCommand) {
  busy.value = true; actionError.value = ''
  try { const response = editing.value ? await updatePlan(editing.value.id, command) : await createPlan(command); message.value = response.message; closeForm() }
  catch (cause: any) { actionError.value = cause?.data?.message || cause?.data?.statusMessage || cause?.message || 'Unable to save discount plan' }
  finally { busy.value = false }
}
async function addCustomer(name: string) {
  busy.value = true; customerError.value = ''
  try { const response = await createCustomer(name); addedCustomerSegmentId.value = response.data.id; message.value = response.message; addingCustomer.value = false }
  catch (cause: any) { customerError.value = cause?.data?.message || cause?.data?.statusMessage || cause?.message || 'Unable to add customer' }
  finally { busy.value = false }
}
async function remove() {
  if (!deleting.value) return
  busy.value = true; actionError.value = ''
  try { const response = await deletePlan(deleting.value.id); message.value = response.message; deleting.value = null }
  catch (cause: any) { actionError.value = cause?.data?.message || cause?.data?.statusMessage || cause?.message || 'Unable to delete discount plan' }
  finally { busy.value = false }
}
</script>

<template>
  <div class="space-y-6">
    <SalesListHeader title="Discount Plan" subtitle="Manage your discount plans" add-label="Add Discount Plan" :refreshing="pending" @add="openAdd" @refresh="resetFilters" @print="openPrintModal('print')" @pdf="openPrintModal('pdf')">
      <template #actions><button type="button" title="Collapse" aria-label="Collapse" class="flex size-9 items-center justify-center rounded border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300" @click="collapsed = !collapsed"><FeatherIcon :name="collapsed ? 'chevron-down' : 'chevron-up'" :size="14" /></button></template>
    </SalesListHeader>
    <SalesFeedback :message="message" :error="actionError" @dismiss="message = ''" @retry="actionError = ''" />
    <SalesFeedback :pending="pending" skeleton="table" :skeleton-cols="4" :error="error ? 'Unable to load discount plans. Please try again.' : ''" @retry="refresh()" />
    <DiscountPlanRecordsTable v-if="!collapsed && !pending && !error" :items="plans" :meta="meta" :search="search" :customer-segment-id="customerSegmentId" :status="status" @update:search="search = $event" @update:customer-segment-id="customerSegmentId = $event" @update:status="status = $event" @edit="openEdit" @delete="deleting = $event" />
    <DiscountPlanFormDialog :open="adding || !!editing" :item="editing" :customers="meta.formCustomerSegments" :added-customer-segment-id="addedCustomerSegmentId" :busy="busy" @close="closeForm" @submit="save" @add-customer="addingCustomer = true" />
    <DiscountPlanCustomerDialog :open="addingCustomer" :busy="busy" :error="customerError" @close="addingCustomer = false" @submit="addCustomer" />
    <SalesConfirmDelete :open="!!deleting" title="Delete Discount Plan" message="Are you sure you want to delete this discount plan? This action cannot be undone." :busy="busy" :error="actionError" @close="deleting = null" @confirm="remove" />
    <DocumentPrintModal :open="isPrintModalOpen" title="Discount Plan Report" subtitle="Daftar kelompok dan cakupan program diskon" :columns="printColumns" :items="plans" :show-date-range="false" :default-action="defaultPrintAction" @close="closePrintModal" />
  </div>
</template>
