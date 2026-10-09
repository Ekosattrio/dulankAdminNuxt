<script setup lang="ts">
import type { Voucher, VoucherFormData } from '#server/types/promo'
import { useVouchers } from '~/composables/useVouchers'
import { useTablePrint } from '~/composables/useTablePrint'
import SalesListHeader from '~/components/sales/SalesListHeader.vue'
import SalesFeedback from '~/components/sales/SalesFeedback.vue'
import SalesConfirmDelete from '~/components/sales/SalesConfirmDelete.vue'
import DocumentPrintModal from '~/components/common/DocumentPrintModal.vue'
import VoucherTable from '~/components/pages/promo/VoucherTable.vue'
import VoucherModal from '~/components/pages/promo/VoucherModal.vue'

definePageMeta({
  layout: 'default',
  alias: ['/voucher.html'],
})
useLegacyPage({ title: 'Vouchers', sweetAlert: false })

const { vouchers, pending, error, refresh, saveVoucher, deleteVoucher } = useVouchers()
const { isPrintModalOpen, defaultPrintAction, openPrintModal, closePrintModal } = useTablePrint()

const isModalOpen = ref(false)
const selectedVoucher = ref<Voucher | null>(null)
const isBusy = ref(false)
const feedbackMessage = ref('')
const feedbackError = ref('')

const isDeleteConfirmOpen = ref(false)
const targetDelete = ref<Voucher | null>(null)

const printColumns = [
  { key: 'name', label: 'Name' },
  { key: 'code', label: 'Code' },
  { key: 'type', label: 'Type' },
  { key: 'discount', label: 'Discount', align: 'right' as const },
  { key: 'limit', label: 'Usage Limit', align: 'right' as const },
  { key: 'used', label: 'Used', align: 'right' as const },
  { key: 'valid', label: 'Valid Until' },
  { key: 'status', label: 'Status' }
]

function openAdd() {
  selectedVoucher.value = null
  isModalOpen.value = true
}

function openEdit(item: Voucher) {
  selectedVoucher.value = item
  isModalOpen.value = true
}

function confirmDelete(item: Voucher) {
  targetDelete.value = item
  isDeleteConfirmOpen.value = true
}

async function handleSave(payload: VoucherFormData) {
  isBusy.value = true
  feedbackError.value = ''
  feedbackMessage.value = ''
  try {
    const res = await saveVoucher(payload)
    isModalOpen.value = false
    feedbackMessage.value = res.message || 'Voucher saved successfully'
  } catch (err: any) {
    feedbackError.value = err?.statusMessage || err?.message || 'Failed to save voucher'
  } finally {
    isBusy.value = false
  }
}

async function handleDelete() {
  if (!targetDelete.value?.id) return
  isBusy.value = true
  feedbackError.value = ''
  feedbackMessage.value = ''
  try {
    const res = await deleteVoucher(targetDelete.value.id)
    isDeleteConfirmOpen.value = false
    targetDelete.value = null
    feedbackMessage.value = res.message || 'Voucher deleted successfully'
  } catch (err: any) {
    feedbackError.value = err?.statusMessage || err?.message || 'Failed to delete voucher'
  } finally {
    isBusy.value = false
  }
}
</script>

<template>
  <div class="dulank-page dulank-page-voucher space-y-6">
    <SalesListHeader
      title="Coupons"
      subtitle="Manage Your Coupons"
      add-label="Add New Coupons"
      :refreshing="pending"
      @add="openAdd"
      @refresh="refresh()"
      @print="openPrintModal('print')"
      @pdf="openPrintModal('pdf')"
    />

    <SalesFeedback
      :pending="pending"
      :error="feedbackError || (error ? 'Failed to load vouchers' : '')"
      :message="feedbackMessage"
      @retry="refresh()"
      @dismiss="feedbackMessage = ''"
    />

    <VoucherTable
      :items="vouchers"
      :loading="pending"
      @edit="openEdit"
      @delete="confirmDelete"
    />

    <VoucherModal
      :open="isModalOpen"
      :voucher="selectedVoucher"
      :busy="isBusy"
      @close="isModalOpen = false"
      @save="handleSave"
    />

    <SalesConfirmDelete
      :open="isDeleteConfirmOpen"
      title="Delete Voucher"
      message="Are you sure you want to delete this voucher? This action cannot be undone."
      :busy="isBusy"
      @cancel="isDeleteConfirmOpen = false"
      @confirm="handleDelete"
    />

    <DocumentPrintModal
      :open="isPrintModalOpen"
      :default-action="defaultPrintAction"
      title="Vouchers Report"
      filename="vouchers-report"
      :columns="printColumns"
      :rows="vouchers"
      @close="closePrintModal"
    />
  </div>
</template>
