<script setup lang="ts">
import type { Coupon, CouponFormData } from '#server/types/promo'
import { useCoupons } from '~/composables/useCoupons'
import { useTablePrint } from '~/composables/useTablePrint'
import SalesListHeader from '~/components/sales/SalesListHeader.vue'
import SalesFeedback from '~/components/sales/SalesFeedback.vue'
import SalesConfirmDelete from '~/components/sales/SalesConfirmDelete.vue'
import DocumentPrintModal from '~/components/common/DocumentPrintModal.vue'
import CouponTable from '~/components/pages/promo/CouponTable.vue'
import CouponModal from '~/components/pages/promo/CouponModal.vue'

definePageMeta({
  layout: 'default',
  alias: ['/coupon.html'],
})
useLegacyPage({ title: 'Coupons', sweetAlert: false })

const { coupons, pending, error, refresh, saveCoupon, deleteCoupon } = useCoupons()
const { isPrintModalOpen, defaultPrintAction, openPrintModal, closePrintModal } = useTablePrint()

const isModalOpen = ref(false)
const selectedCoupon = ref<Coupon | null>(null)
const isBusy = ref(false)
const feedbackMessage = ref('')
const feedbackError = ref('')

const isDeleteConfirmOpen = ref(false)
const targetDelete = ref<Coupon | null>(null)

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
  selectedCoupon.value = null
  isModalOpen.value = true
}

function openEdit(item: Coupon) {
  selectedCoupon.value = item
  isModalOpen.value = true
}

function confirmDelete(item: Coupon) {
  targetDelete.value = item
  isDeleteConfirmOpen.value = true
}

async function handleSave(payload: CouponFormData) {
  isBusy.value = true
  feedbackError.value = ''
  feedbackMessage.value = ''
  try {
    const res = await saveCoupon(payload)
    isModalOpen.value = false
    feedbackMessage.value = res.message || 'Coupon saved successfully'
  } catch (err: any) {
    feedbackError.value = err?.statusMessage || err?.message || 'Failed to save coupon'
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
    const res = await deleteCoupon(targetDelete.value.id)
    isDeleteConfirmOpen.value = false
    targetDelete.value = null
    feedbackMessage.value = res.message || 'Coupon deleted successfully'
  } catch (err: any) {
    feedbackError.value = err?.statusMessage || err?.message || 'Failed to delete coupon'
  } finally {
    isBusy.value = false
  }
}
</script>

<template>
  <div class="dulank-page dulank-page-coupon space-y-6">
    <SalesListHeader
      title="Coupons"
      subtitle="Manage promotional coupon codes, redemptions, and limits"
      add-label="Add New Coupons"
      :refreshing="pending"
      @add="openAdd"
      @refresh="refresh()"
      @print="openPrintModal('print')"
      @pdf="openPrintModal('pdf')"
    />

    <SalesFeedback
      :pending="pending"
      :error="feedbackError || (error ? 'Failed to load coupons' : '')"
      :message="feedbackMessage"
      @retry="refresh()"
      @dismiss="feedbackMessage = ''"
    />

    <CouponTable
      :items="coupons"
      :loading="pending"
      @edit="openEdit"
      @delete="confirmDelete"
    />

    <CouponModal
      :open="isModalOpen"
      :coupon="selectedCoupon"
      :busy="isBusy"
      @close="isModalOpen = false"
      @save="handleSave"
    />

    <SalesConfirmDelete
      :open="isDeleteConfirmOpen"
      title="Delete Coupon"
      message="Are you sure you want to delete this coupon? This action cannot be undone."
      :busy="isBusy"
      @cancel="isDeleteConfirmOpen = false"
      @confirm="handleDelete"
    />

    <DocumentPrintModal
      :open="isPrintModalOpen"
      :default-action="defaultPrintAction"
      title="Coupons Report"
      filename="coupons-report"
      :columns="printColumns"
      :rows="coupons"
      @close="closePrintModal"
    />
  </div>
</template>
