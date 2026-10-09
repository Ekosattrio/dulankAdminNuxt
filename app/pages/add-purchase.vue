<script setup lang="ts">
import type { PurchaseFormData } from '#server/types/purchase'
import { usePurchases } from '~/composables/usePurchases'
import { useSuppliers } from '~/composables/useSuppliers'
import { usePurchaseItems } from '~/composables/usePurchaseItems'
import SalesFeedback from '~/components/sales/SalesFeedback.vue'
import FeatherIcon from '~/components/common/FeatherIcon.vue'
import PurchaseDocumentForm from '~/components/pages/purchase/PurchaseDocumentForm.vue'
import { salesSecondaryButton } from '~/utils/salesUi'

definePageMeta({
  layout: 'default',
  alias: ['/add-purchase.html'],
})
useLegacyPage({ title: 'Add Purchase', sweetAlert: false })

const router = useRouter()
const { savePurchase } = usePurchases()
const { suppliers, pending: suppliersPending } = useSuppliers()
const { items: catalogItems, pending: itemsPending } = usePurchaseItems()

const isBusy = ref(false)
const errorMessage = ref('')

const supplierOptions = computed(() => {
  if (suppliers.value && suppliers.value.length > 0) {
    return suppliers.value.map(s => s.name)
  }
  return ['PT Kertas Jaya', 'CV Kimia Prima', 'Global Inkindo', 'PT Sinar Grafika']
})

const todayFormatted = new Date().toLocaleDateString('id-ID', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric'
}).replace(/\//g, '-')

const initialForm = ref<PurchaseFormData>({
  supplier: '',
  date: todayFormatted,
  status: 'Ordered',
  paymentStatus: 'Unpaid',
  shippingCost: 0,
  paid: 0,
  notes: '',
  items: [
    { name: '', qty: 1, unit: 'Pcs', price: 0 }
  ]
})

async function handleSubmit(payload: PurchaseFormData) {
  isBusy.value = true
  errorMessage.value = ''
  try {
    await savePurchase(payload)
    router.push('/purchase')
  } catch (err: any) {
    errorMessage.value = err?.statusMessage || err?.message || 'Failed to save purchase'
  } finally {
    isBusy.value = false
  }
}
</script>

<template>
  <div class="dulank-page dulank-page-add-purchase space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 dark:border-gray-800 pb-4">
      <div>
        <h1 class="text-xl font-bold text-gray-900 dark:text-white">Add Purchase</h1>
        <p class="text-xs text-gray-500 dark:text-gray-400">Create new supplier purchase order and track inventory incoming</p>
      </div>
      <NuxtLink to="/purchase" :class="salesSecondaryButton">
        <FeatherIcon name="arrow-left" :size="14" />
        <span>Back to Purchase List</span>
      </NuxtLink>
    </div>

    <SalesFeedback
      :pending="suppliersPending || itemsPending"
      :error="errorMessage"
      @dismiss="errorMessage = ''"
    />

    <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <PurchaseDocumentForm
        v-model="initialForm"
        :supplier-options="supplierOptions"
        :catalog-items="catalogItems"
        :busy="isBusy"
        :is-edit="false"
        @submit="handleSubmit"
        @cancel="router.push('/purchase')"
      />
    </div>
  </div>
</template>
