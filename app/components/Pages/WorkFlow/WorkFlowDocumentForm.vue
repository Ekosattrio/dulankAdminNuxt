<script setup lang="ts">
import type { FlowCategoryFormData } from '#server/types/flow-category'
import type { FlowNameFormData } from '#server/types/flow-name'
import type { WorkFlow, WorkFlowFormData } from '#server/types/work-flow'
import FlowCategoryModal from '~/components/Pages/FlowCategory/FlowCategoryModal.vue'
import FlowNameModal from '~/components/Pages/FlowName/FlowNameModal.vue'
import SalesFeedback from '~/components/Sales/SalesFeedback.vue'

const props = defineProps<{ initialData?: WorkFlow | null; isEdit?: boolean; busy?: boolean }>()
const emit = defineEmits<{ submit: [data: WorkFlowFormData]; cancel: [] }>()
const editor = useWorkFlowDocumentEditor(toRef(props, 'initialData'))
const { context, pending, error, form, arrangedFlows } = editor
const showCategory = ref(false)
const showName = ref(false)
const nameCategory = ref('Design')
const modalBusy = ref(false)
const modalError = ref('')

function openName(category: string) {
  nameCategory.value = category
  modalError.value = ''
  showName.value = true
}

async function saveCategory(payload: FlowCategoryFormData) {
  modalBusy.value = true
  modalError.value = ''
  try { await editor.createFlowCategory(payload); showCategory.value = false }
  catch (cause) { modalError.value = salesErrorMessage(cause) }
  finally { modalBusy.value = false }
}

async function saveName(payload: FlowNameFormData) {
  modalBusy.value = true
  modalError.value = ''
  try { await editor.createFlowName(payload); showName.value = false }
  catch (cause) { modalError.value = salesErrorMessage(cause) }
  finally { modalBusy.value = false }
}
</script>

<template>
  <form class="space-y-6" @submit.prevent="$emit('submit', editor.payload())">
    <SalesFeedback :pending="pending" :error="error ? 'Unable to load workflow editor data. Please try again.' : ''" @retry="editor.refresh()" />
    <div v-if="!pending && !error" class="grid grid-cols-1 gap-6 xl:grid-cols-12">
      <div class="space-y-6 xl:col-span-7">
        <WorkFlowProductPicker
          :product="form.product"
          :products="context.products"
          @update:product="form.product = $event"
          @select="editor.selectProduct"
        />
        <WorkFlowCatalog
          :categories="context.flowCategories"
          :flows="context.flows"
          :arranged="arrangedFlows"
          @toggle="editor.toggleFlow"
          @template="editor.updateTemplate"
          @add-category="modalError = ''; showCategory = true"
          @add-name="openName"
        />
      </div>
      <div class="min-w-0 xl:col-span-5"><WorkFlowArrangePanel :items="arrangedFlows" @move="editor.move" /></div>
    </div>

    <div class="flex flex-wrap justify-end gap-3 border-t border-gray-200 pt-4 dark:border-gray-700">
      <button type="button" class="min-w-24 rounded-md border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700" @click="$emit('cancel')">Cancel</button>
      <button type="submit" :disabled="busy || pending || !!error || !form.product.trim() || arrangedFlows.length === 0" class="min-w-24 rounded-md bg-[#ff9f43] px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-50">{{ busy ? 'Saving...' : 'Save' }}</button>
    </div>

    <FlowCategoryModal :open="showCategory" :record="null" :busy="modalBusy" :error="modalError" @close="showCategory = false" @submit="saveCategory" />
    <FlowNameModal :open="showName" :record="null" :initial-category="nameCategory" :category-options="context.flowCategories" :busy="modalBusy" :error="modalError" @close="showName = false" @submit="saveName" />
  </form>
</template>
