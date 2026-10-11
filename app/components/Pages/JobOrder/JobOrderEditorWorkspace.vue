<script setup lang="ts">
import type { JobOrderContext, JobOrderFormData } from '#server/types/job-order'
import JobOrderSourcePanel from './JobOrderSourcePanel.vue'
import JobOrderWorkflowForm from './JobOrderWorkflowForm.vue'
import SalesConfirmDelete from '~/components/Sales/SalesConfirmDelete.vue'
import SalesFeedback from '~/components/Sales/SalesFeedback.vue'

defineProps<{
  context: JobOrderContext
  busy?: boolean
  feedback?: string
  feedbackType?: 'success' | 'error'
}>()
const form = defineModel<JobOrderFormData>({ required: true })
const activeStepIndex = defineModel<number>('activeStepIndex', { required: true })
const emit = defineEmits<{
  save: []
  addStep: []
  moveStep: [index: number, delta: number]
  removeStep: [index: number]
  addInfo: [target: 'infoList' | 'afterInfoList', label: string]
}>()
const deleteIndex = ref<number | null>(null)

function confirmRemove() {
  if (deleteIndex.value !== null) emit('removeStep', deleteIndex.value)
  deleteIndex.value = null
}
</script>

<template>
  <div class="space-y-5">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div><h1 class="app-page-title">{{ context.jobOrder ? 'Edit Job Order' : 'Add Job Order' }}</h1><p class="app-page-subtitle">Manage your order with default work flow</p></div>
      <NuxtLink to="/orders" class="inline-flex h-9 items-center gap-2 self-start rounded-md border border-gray-200 bg-white px-3 text-sm font-semibold text-gray-700 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"><FeatherIcon name="arrow-left" :size="14" /> Back to Orders</NuxtLink>
    </div>

    <SalesFeedback v-if="feedback" :error="feedbackType === 'error' ? feedback : ''" :message="feedbackType === 'success' ? feedback : ''" />

    <div class="grid min-w-0 grid-cols-1 gap-5 xl:grid-cols-[minmax(280px,0.8fr)_minmax(0,2fr)]">
      <JobOrderSourcePanel v-model="form" :context="context" />
      <JobOrderWorkflowForm
        v-model="form"
        v-model:active-step-index="activeStepIndex"
        @add-step="$emit('addStep')"
        @move-step="(index, delta) => $emit('moveStep', index, delta)"
        @remove-step="deleteIndex = $event"
        @add-info="(target, label) => $emit('addInfo', target, label)"
      />
    </div>

    <div class="flex flex-wrap justify-end gap-3">
      <NuxtLink to="/job-order" class="inline-flex h-9 items-center rounded-md border border-gray-200 bg-white px-5 text-sm font-semibold text-gray-700 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200">Cancel</NuxtLink>
      <button type="button" class="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-5 text-sm font-semibold text-white disabled:opacity-50" :disabled="busy" @click="$emit('save')"><FeatherIcon name="save" :size="14" /> {{ busy ? 'Saving...' : 'Save' }}</button>
    </div>

    <SalesConfirmDelete :open="deleteIndex !== null" title="Remove Workflow Step" message="Are you sure you want to remove this workflow step?" @cancel="deleteIndex = null" @confirm="confirmRemove" />
  </div>
</template>
