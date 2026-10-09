<script setup lang="ts">
import type { SaleFormData } from '#server/types/sale'
import SalesDocumentForm from '~/components/pages/sales/SalesDocumentForm.vue'
import SalesFeedback from '~/components/sales/SalesFeedback.vue'

definePageMeta({ layout: 'default' })
useLegacyPage({ title: 'Add Sales', sweetAlert: false })

const { save } = useSales()
const busy = ref(false)
const error = ref('')
const feedbackMsg = ref('')

async function handleSubmit(form: SaleFormData) {
  busy.value = true
  error.value = ''
  try {
    const res = await save(form)
    if (res?.success) {
      await navigateTo('/sales')
    } else {
      error.value = res?.message || 'Failed to save sales order'
    }
  } catch (err: any) {
    error.value = err?.data?.message || err?.message || 'Failed to save sales order'
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <div class="dulank-page dulank-page-add-sales space-y-6 p-4 md:p-6">
    <div class="flex items-center justify-between">
      <div>
        <h4 class="text-xl font-bold tracking-tight text-gray-900 dark:text-white">Add Sales</h4>
        <p class="text-xs text-gray-500 dark:text-gray-400">Create new sales order with custom items & billing calculation</p>
      </div>
      <div>
        <NuxtLink
          to="/sales"
          class="inline-flex h-9 items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 text-sm font-medium text-gray-700 shadow-xs hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
        >
          <i class="feather-arrow-left"></i>
          Back to Sales List
        </NuxtLink>
      </div>
    </div>

    <SalesFeedback
      v-if="error || feedbackMsg"
      :error="error"
      :message="feedbackMsg"
      @dismiss="error = ''; feedbackMsg = ''"
    />

    <div class="rounded-xl border border-gray-200/80 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-gray-900">
      <SalesDocumentForm
        :busy="busy"
        :error="error"
        @cancel="navigateTo('/sales')"
        @submit="handleSubmit"
      />
    </div>
  </div>
</template>
