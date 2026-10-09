<script setup lang="ts">
import type { OrderProductItem } from '~/components/pages/job-order/JobOrderProductSelector.vue'
import JobOrderProductSelector from '~/components/pages/job-order/JobOrderProductSelector.vue'
import JobOrderWorkflowEditor from '~/components/pages/job-order/JobOrderWorkflowEditor.vue'
import SalesConfirmDelete from '~/components/sales/SalesConfirmDelete.vue'

definePageMeta({
  layout: 'default',
  alias: ['/edit-job-order.html'],
})
useLegacyPage({ title: 'Edit Job Order', sweetAlert: false })

const orderProducts = ref<OrderProductItem[]>([
  {
    id: 1,
    name: 'Brosur Full Color Promo',
    jobTitle: 'Brosur SMKN 1 Karawang',
    description: 'Brosur Full Color A4 (210x297 mm), Art paper 150gr, Tanpa Laminasi, Tanpa Lipatan',
    qty: '15 Rim',
    priority: 'Urgent',
    workflow: [
      { id: 101, flowName: 'Cetak Multilith', branch: 'Dulank Karawang', assignee: 'Abdul', incentive: 1500 },
      { id: 102, flowName: 'Potong Sisir', branch: 'Dulank Karawang', assignee: 'Nurdin', incentive: 500 },
      { id: 103, flowName: 'Finishing Packing', branch: 'Dulank Karawang', assignee: 'Rapli', incentive: 300 },
    ],
  },
  {
    id: 2,
    name: 'Yasin Soft Cover 192 HVS',
    jobTitle: '40 Hari Alm Kusnadi',
    description: 'Buku Yasin 192 Halaman HVS, Cover Art Carton 260gr Doff + Poly Emas',
    qty: '200 Pcs',
    priority: 'High',
    workflow: [
      { id: 201, flowName: 'Cetak Isi Digital', branch: 'Dulank Jakarta', assignee: 'Dani', incentive: 2000 },
      { id: 202, flowName: 'Hot Print Foil Cover', branch: 'Dulank Jakarta', assignee: 'Adul', incentive: 1000 },
      { id: 203, flowName: 'Jilid Lem Panas (Binding)', branch: 'Dulank Jakarta', assignee: 'Arif', incentive: 1500 },
    ],
  },
])

const selectedProductIndex = ref(0)
const currentProduct = computed(() => orderProducts.value[selectedProductIndex.value] || null)

function moveStep(idx: number, delta: number) {
  if (!currentProduct.value) return
  const list = currentProduct.value.workflow
  const targetIdx = idx + delta
  if (targetIdx >= 0 && targetIdx < list.length) {
    const temp = list[idx]
    list[idx] = list[targetIdx]
    list[targetIdx] = temp
  }
}

const isDeleteConfirmOpen = ref(false)
const deleteTargetIdx = ref<number | null>(null)

function removeStep(idx: number) {
  deleteTargetIdx.value = idx
  isDeleteConfirmOpen.value = true
}

function confirmDeleteStep() {
  if (deleteTargetIdx.value !== null && currentProduct.value) {
    currentProduct.value.workflow.splice(deleteTargetIdx.value, 1)
    isDeleteConfirmOpen.value = false
    deleteTargetIdx.value = null
  }
}

function addWorkflowStep() {
  if (currentProduct.value) {
    currentProduct.value.workflow.push({
      id: Date.now(),
      flowName: 'New Operation Process',
      branch: 'Dulank Karawang',
      assignee: 'Unassigned',
      incentive: 1000,
    })
  }
}

function saveJobOrder() {
  navigateTo('/job-orders')
}
</script>

<template>
  <div class="dulank-page dulank-page-edit-job-order space-y-6 p-4 md:p-6">
    <div class="flex items-center justify-between">
      <div>
        <h4 class="text-xl font-bold tracking-tight text-gray-900 dark:text-white">Edit Job Order</h4>
        <p class="text-xs text-gray-500 dark:text-gray-400">Configure workflow routing and production scheduling per product</p>
      </div>
      <div>
        <NuxtLink
          to="/orders"
          class="inline-flex h-9 items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 text-sm font-medium text-gray-700 shadow-xs hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
        >
          <i class="feather-arrow-left"></i>
          Back to Orders
        </NuxtLink>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <!-- Left Panel -->
      <div class="lg:col-span-4">
        <JobOrderProductSelector
          :products="orderProducts"
          :selected-index="selectedProductIndex"
          @select="selectedProductIndex = $event"
        />
      </div>

      <!-- Right Panel -->
      <div class="lg:col-span-8">
        <JobOrderWorkflowEditor
          v-if="currentProduct"
          :product="currentProduct"
          @move-step="moveStep"
          @remove-step="removeStep"
          @add-step="addWorkflowStep"
          @save="saveJobOrder"
        />
      </div>
    </div>

    <!-- Confirm Delete Modal -->
    <SalesConfirmDelete
      :open="isDeleteConfirmOpen"
      title="Remove Workflow Step"
      message="Are you sure you want to remove this workflow step? This action cannot be undone."
      @cancel="isDeleteConfirmOpen = false"
      @confirm="confirmDeleteStep"
    />
  </div>
</template>
