<script setup lang="ts">
import type { Purchase, PurchaseFormData } from '#server/types/purchase'
import SalesDialog from '~/components/sales/SalesDialog.vue'
import PurchaseDocumentForm from './PurchaseDocumentForm.vue'

const props = defineProps<{
  open: boolean
  isEdit: boolean
  purchaseData: Purchase | null
  supplierOptions?: string[]
  catalogItems?: { product: string; price: number; unit: string }[]
  busy?: boolean
}>()

const emit = defineEmits<{
  close: []
  submit: [formData: PurchaseFormData]
}>()

const formModel = ref<PurchaseFormData>({
  supplier: '',
  date: '',
  status: 'Ordered',
  paymentStatus: 'Unpaid',
  shippingCost: 0,
  paid: 0,
  notes: '',
  items: [],
})

watch(
  () => props.purchaseData,
  (val) => {
    if (val && props.isEdit) {
      formModel.value = {
        id: val.id,
        noPurchase: val.noPurchase,
        date: val.date,
        supplier: val.supplier,
        status: val.status,
        paymentStatus: val.paymentStatus,
        shippingCost: val.shippingCost || 0,
        paid: val.paid || 0,
        notes: val.notes || '',
        items: val.items && val.items.length > 0
          ? val.items.map(i => ({ ...i }))
          : [{ name: val.product || '', qty: 1, unit: 'Pcs', price: val.amount || 0 }],
      }
    } else {
      const today = new Date().toLocaleDateString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).replace(/\//g, '-')

      formModel.value = {
        supplier: props.supplierOptions?.[0] || '',
        date: today,
        status: 'Ordered',
        paymentStatus: 'Unpaid',
        shippingCost: 0,
        paid: 0,
        notes: '',
        items: [
          { name: '', qty: 1, unit: 'Pcs', price: 0 }
        ],
      }
    }
  },
  { immediate: true }
)
</script>

<template>
  <SalesDialog
    :open="open"
    :title="isEdit ? 'Edit Purchase Order' : 'Add New Purchase'"
    wide
    :busy="busy"
    @close="emit('close')"
  >
    <div class="p-6">
      <PurchaseDocumentForm
        v-model="formModel"
        :supplier-options="supplierOptions"
        :catalog-items="catalogItems"
        :busy="busy"
        :is-edit="isEdit"
        @submit="emit('submit', $event)"
        @cancel="emit('close')"
      />
    </div>
  </SalesDialog>
</template>
