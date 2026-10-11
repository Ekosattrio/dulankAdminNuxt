<script setup lang="ts">
import JobOrderEditorWorkspace from '~/components/Pages/JobOrder/JobOrderEditorWorkspace.vue'
import SalesFeedback from '~/components/Sales/SalesFeedback.vue'
import { useJobOrderDocument } from '~/composables/useJobOrderDocument'

useLegacyPage({ title: 'Edit Job Order', sweetAlert: false })

const {
  context, form, activeStepIndex, pending, error, busy, feedback, feedbackType,
  refresh, addStep, removeStep, moveStep, addInfo, save,
} = useJobOrderDocument()
</script>

<template>
  <div class="dulank-page dulank-page-edit-job-order">
    <SalesFeedback :pending="pending" :error="error ? 'Unable to load the selected order.' : ''" @retry="refresh()" />
    <JobOrderEditorWorkspace
      v-if="!pending && !error && context"
      v-model="form"
      v-model:active-step-index="activeStepIndex"
      :context="context"
      :busy="busy"
      :feedback="feedback"
      :feedback-type="feedbackType"
      @save="save"
      @add-step="addStep"
      @move-step="moveStep"
      @remove-step="removeStep"
      @add-info="addInfo"
    />
  </div>
</template>
