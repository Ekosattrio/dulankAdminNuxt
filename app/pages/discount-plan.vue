<script setup lang="ts">
import type { DiscountPlan, DiscountPlanFormData } from '#server/types/promo'
import { useDiscountPlans } from '~/composables/useDiscountPlans'
import { useTablePrint } from '~/composables/useTablePrint'
import SalesListHeader from '~/components/sales/SalesListHeader.vue'
import SalesFeedback from '~/components/sales/SalesFeedback.vue'
import SalesConfirmDelete from '~/components/sales/SalesConfirmDelete.vue'
import DocumentPrintModal from '~/components/common/DocumentPrintModal.vue'
import DiscountPlanTable from '~/components/pages/promo/DiscountPlanTable.vue'
import DiscountPlanModal from '~/components/pages/promo/DiscountPlanModal.vue'

definePageMeta({
  layout: 'default',
  alias: ['/discount-plan.html'],
})
useLegacyPage({ title: 'Discount Plan', sweetAlert: false })

const { discountPlans, pending, error, refresh, saveDiscountPlan, deleteDiscountPlan } = useDiscountPlans()
const { isPrintModalOpen, defaultPrintAction, openPrintModal, closePrintModal } = useTablePrint()

const isModalOpen = ref(false)
const selectedPlan = ref<DiscountPlan | null>(null)
const isBusy = ref(false)
const feedbackMessage = ref('')
const feedbackError = ref('')

const isDeleteConfirmOpen = ref(false)
const targetDelete = ref<DiscountPlan | null>(null)

const printColumns = [
  { key: 'planName', label: 'Plan Name' },
  { key: 'customers', label: 'Customers' },
  { key: 'status', label: 'Status' }
]

function openAdd() {
  selectedPlan.value = null
  isModalOpen.value = true
}

function openEdit(item: DiscountPlan) {
  selectedPlan.value = item
  isModalOpen.value = true
}

function confirmDelete(item: DiscountPlan) {
  targetDelete.value = item
  isDeleteConfirmOpen.value = true
}

async function handleSave(payload: DiscountPlanFormData) {
  isBusy.value = true
  feedbackError.value = ''
  feedbackMessage.value = ''
  try {
    const res = await saveDiscountPlan(payload)
    isModalOpen.value = false
    feedbackMessage.value = res.message || 'Discount plan saved successfully'
  } catch (err: any) {
    feedbackError.value = err?.statusMessage || err?.message || 'Failed to save discount plan'
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
    const res = await deleteDiscountPlan(targetDelete.value.id)
    isDeleteConfirmOpen.value = false
    targetDelete.value = null
    feedbackMessage.value = res.message || 'Discount plan deleted successfully'
  } catch (err: any) {
    feedbackError.value = err?.statusMessage || err?.message || 'Failed to delete discount plan'
  } finally {
    isBusy.value = false
  }
}
</script>

<template>
  <div class="dulank-page dulank-page-discount-plan space-y-6">
    <SalesListHeader
      title="Discount Plan"
      subtitle="Manage discount plans and customer tiering"
      add-label="Add Discount Plan"
      :refreshing="pending"
      @add="openAdd"
      @refresh="refresh()"
      @print="openPrintModal('print')"
      @pdf="openPrintModal('pdf')"
    />

    <SalesFeedback
      :pending="pending"
      :error="feedbackError || (error ? 'Failed to load discount plans' : '')"
      :message="feedbackMessage"
      @retry="refresh()"
      @dismiss="feedbackMessage = ''"
    />

    <DiscountPlanTable
      :items="discountPlans"
      :loading="pending"
      @edit="openEdit"
      @delete="confirmDelete"
    />

    <DiscountPlanModal
      :open="isModalOpen"
      :plan="selectedPlan"
      :busy="isBusy"
      @close="isModalOpen = false"
      @save="handleSave"
    />

    <SalesConfirmDelete
      :open="isDeleteConfirmOpen"
      title="Delete Discount Plan"
      message="Are you sure you want to delete this discount plan? This action cannot be undone."
      :busy="isBusy"
      @cancel="isDeleteConfirmOpen = false"
      @confirm="handleDelete"
    />

    <DocumentPrintModal
      :open="isPrintModalOpen"
      :default-action="defaultPrintAction"
      title="Discount Plans Report"
      filename="discount-plans-report"
      :columns="printColumns"
      :rows="discountPlans"
      @close="closePrintModal"
    />
  </div>
</template>
