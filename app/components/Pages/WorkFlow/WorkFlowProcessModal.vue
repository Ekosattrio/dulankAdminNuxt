<script setup lang="ts">
import type { WorkFlow, WorkFlowFormData } from '#server/types/work-flow'
import SalesDialog from '~/components/Sales/SalesDialog.vue'

const props = defineProps<{
  open: boolean
  record: WorkFlow | null
  busy?: boolean
  error?: string
}>()

const emit = defineEmits<{
  close: []
  submit: [form: WorkFlowFormData]
}>()

const categories = ['Offset', 'Large Format', 'Digital A3+', 'Sablon']

const form = ref<WorkFlowFormData>({
  category: 'Offset',
  product: '',
  workflowSteps: '',
})

watch(
  () => props.record,
  (rec) => {
    if (rec) {
      form.value = {
        id: rec.id,
        no: rec.no,
        date: rec.date,
        category: rec.category,
        product: rec.product,
        workflowSteps: rec.workflowSteps,
        steps: rec.steps,
      }
    } else {
      form.value = {
        category: 'Offset',
        product: '',
        workflowSteps: '',
      }
    }
  },
  { immediate: true },
)

function submit() {
  emit('submit', { ...form.value })
}
</script>

<template>
  <SalesDialog :open="open" title="Add New Process Name" :busy="busy" medium @close="$emit('close')">
    <form class="space-y-4" @submit.prevent="submit">
      <p v-if="error" role="alert" class="text-xs text-red-600">{{ error }}</p>
      <fieldset :disabled="busy" class="space-y-4 text-xs disabled:opacity-60">
        <!-- Product Category -->
        <div class="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
          <div class="text-xs font-semibold text-gray-700 sm:w-1/3 dark:text-gray-300">
            Product Category <span class="text-red-500">*</span>
          </div>
          <div class="sm:w-2/3">
            <select
              v-model="form.category"
              class="h-9 w-full rounded-md border border-gray-200 bg-white px-3 text-xs font-medium text-gray-700 shadow-sm outline-none transition-colors hover:border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/10 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
              required
            >
              <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
            </select>
          </div>
        </div>

        <!-- Product -->
        <div class="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
          <div class="text-xs font-semibold text-gray-700 sm:w-1/3 dark:text-gray-300">
            Product <span class="text-red-500">*</span>
          </div>
          <div class="sm:w-2/3">
            <input
              v-model="form.product"
              type="text"
              placeholder="e.g. Brosur A5"
              class="h-9 w-full rounded-md border border-gray-200 bg-white px-3 text-xs font-medium text-gray-700 shadow-sm outline-none transition-colors hover:border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/10 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
              required
            />
          </div>
        </div>

        <!-- Work Flow -->
        <div class="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
          <div class="text-xs font-semibold text-gray-700 sm:w-1/3 dark:text-gray-300">
            Work Flow <span class="text-red-500">*</span>
          </div>
          <div class="sm:w-2/3">
            <input
              v-model="form.workflowSteps"
              type="text"
              placeholder="Artwork, Plat CTP, Cetak SM52, Potong, Lipat, Sortir, Packing"
              class="h-9 w-full rounded-md border border-gray-200 bg-white px-3 text-xs font-medium text-gray-700 shadow-sm outline-none transition-colors hover:border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/10 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
              required
            />
          </div>
        </div>

        <!-- Action Footer -->
        <div class="flex justify-end gap-2.5 border-t border-gray-200 pt-4 dark:border-gray-700">
          <button
            type="button"
            class="min-w-24 rounded-md bg-[#212b36] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#092c4c] focus:outline-none"
            @click="$emit('close')"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="min-w-24 rounded-md bg-[#ff9f43] px-5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#f39334] focus:outline-none"
          >
            {{ busy ? 'Saving...' : 'Submit' }}
          </button>
        </div>
      </fieldset>
    </form>
  </SalesDialog>
</template>
