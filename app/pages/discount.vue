<script setup lang="ts">
import type { Discount, DiscountFormData } from '#server/types/promo'
import { useDiscounts } from '~/composables/useDiscounts'
import { useDiscountPlans } from '~/composables/useDiscountPlans'
import { useTablePrint } from '~/composables/useTablePrint'
import SalesListHeader from '~/components/sales/SalesListHeader.vue'
import SalesFeedback from '~/components/sales/SalesFeedback.vue'
import SalesConfirmDelete from '~/components/sales/SalesConfirmDelete.vue'
import DocumentPrintModal from '~/components/common/DocumentPrintModal.vue'
import DiscountTable from '~/components/pages/promo/DiscountTable.vue'
import DiscountModal from '~/components/pages/promo/DiscountModal.vue'

definePageMeta({
  layout: 'default',
  alias: ['/discount.html'],
})
useLegacyPage({ title: 'Discount', sweetAlert: false })

const { discounts, pending, error, refresh, saveDiscount, deleteDiscount } = useDiscounts()
const { discountPlans } = useDiscountPlans()
const { isPrintModalOpen, defaultPrintAction, openPrintModal, closePrintModal } = useTablePrint()

const isModalOpen = ref(false)
const selectedDiscount = ref<Discount | null>(null)
const isBusy = ref(false)
const feedbackMessage = ref('')
const feedbackError = ref('')

const isDeleteConfirmOpen = ref(false)
const targetDelete = ref<Discount | null>(null)

const printColumns = [
  { key: 'name', label: 'Name' },
  { key: 'value', label: 'Value', align: 'right' as const },
  { key: 'discountPlanName', label: 'Discount Plan' },
  { key: 'validFrom', label: 'Valid From' },
  { key: 'validTill', label: 'Valid Till' },
  { key: 'products', label: 'Products' },
  { key: 'used', label: 'Used', align: 'right' as const },
  { key: 'status', label: 'Status' }
]

function openAdd() {
  selectedDiscount.value = null
  isModalOpen.value = true
}

function openEdit(item: Discount) {
  selectedDiscount.value = item
  isModalOpen.value = true
}

function confirmDelete(item: Discount) {
  targetDelete.value = item
  isDeleteConfirmOpen.value = true
}

async function handleSave(payload: DiscountFormData) {
  isBusy.value = true
  feedbackError.value = ''
  feedbackMessage.value = ''
  try {
    const res = await saveDiscount(payload)
    isModalOpen.value = false
    feedbackMessage.value = res.message || 'Discount saved successfully'
  } catch (err: any) {
    feedbackError.value = err?.statusMessage || err?.message || 'Failed to save discount'
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
    const res = await deleteDiscount(targetDelete.value.id)
    isDeleteConfirmOpen.value = false
    targetDelete.value = null
    feedbackMessage.value = res.message || 'Discount deleted successfully'
  } catch (err: any) {
    feedbackError.value = err?.statusMessage || err?.message || 'Failed to delete discount'
  } finally {
    isBusy.value = false
  }
}
</script>

<template>
  <div class="dulank-page dulank-page-discount space-y-6">
    <SalesListHeader
      title="Discount"
      subtitle="Manage promotional discount rules, validity, and applicability"
      add-label="Add Discount"
      :refreshing="pending"
      @add="openAdd"
      @refresh="refresh()"
      @print="openPrintModal('print')"
      @pdf="openPrintModal('pdf')"
    />

    <SalesFeedback
      :pending="pending"
      :error="feedbackError || (error ? 'Failed to load discounts' : '')"
      :message="feedbackMessage"
      @retry="refresh()"
      @dismiss="feedbackMessage = ''"
    />

    <DiscountTable
      :items="discounts"
      :loading="pending"
      @edit="openEdit"
      @delete="confirmDelete"
    />

    <DiscountModal
      :open="isModalOpen"
      :discount="selectedDiscount"
      :plans="discountPlans"
      :busy="isBusy"
      @close="isModalOpen = false"
      @save="handleSave"
    />

    <SalesConfirmDelete
      :open="isDeleteConfirmOpen"
      title="Delete Discount"
      message="Are you sure you want to delete this discount? This action cannot be undone."
      :busy="isBusy"
      @cancel="isDeleteConfirmOpen = false"
      @confirm="handleDelete"
    />

    <DocumentPrintModal
      :open="isPrintModalOpen"
      :default-action="defaultPrintAction"
      title="Discount Report"
      filename="discount-report"
      :columns="printColumns"
      :rows="discounts"
      @close="closePrintModal"
    />
  </div>
</template>
