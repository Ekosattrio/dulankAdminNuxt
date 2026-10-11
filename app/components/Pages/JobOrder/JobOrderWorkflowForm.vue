<script setup lang="ts">
import type { JobOrderFormData } from '#server/types/job-order'
import AssigneeSelect from '~/components/Common/AssigneeSelect.vue'
import CurrencyInput from '~/components/Common/CurrencyInput.vue'
import SalesActionButton from '~/components/Sales/SalesActionButton.vue'
import JobOrderFlowInformation from './JobOrderFlowInformation.vue'
import { jobOrderFlowOptions } from '~/composables/useJobOrderDocument'
import { formControlClass } from '~/utils/salesUi'

const form = defineModel<JobOrderFormData>({ required: true })
const activeStepIndex = defineModel<number>('activeStepIndex', { required: true })
const emit = defineEmits<{
  addStep: []
  moveStep: [index: number, delta: number]
  removeStep: [index: number]
  addInfo: [target: 'infoList' | 'afterInfoList', label: string]
}>()
const activeTab = ref<'workflow' | 'assignee' | 'incentive'>('workflow')
const tabs = [
  { id: 'workflow', label: 'Work Flow Default' },
  { id: 'assignee', label: 'Assignee' },
  { id: 'incentive', label: 'Incentive' },
] as const
const arranging = ref(false)
const activeStep = computed(() => form.value.steps?.[activeStepIndex.value] ?? null)
const usedFlowNames = computed(() => new Set((form.value.steps ?? []).map((step) => step.name)))
const availableFlowNames = computed(() => jobOrderFlowOptions.filter((name) => !usedFlowNames.value.has(name) || name === activeStep.value?.name))
</script>

<template>
  <section class="min-w-0 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
    <header class="border-b border-gray-100 p-5 dark:border-gray-800">
      <h2 class="app-section-title">Manage Job Order : {{ form.product || '-' }}</h2>
      <div class="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <label class="text-xs font-semibold text-gray-600">Job Title<input v-model="form.jobTitle" :class="[formControlClass, 'mt-1']" /></label>
        <label class="text-xs font-semibold text-gray-600">Quantity<input v-model="form.qty" :class="[formControlClass, 'mt-1']" /></label>
        <label class="text-xs font-semibold text-gray-600">Due Date<input v-model="form.dueDate" type="text" :class="[formControlClass, 'mt-1']" placeholder="DD/MM/YYYY" /></label>
        <label class="text-xs font-semibold text-gray-600">Priority<select v-model="form.priority" :class="[formControlClass, 'mt-1']"><option>Urgent</option><option>High</option><option>Normal</option><option>Medium</option><option>Low</option></select></label>
      </div>
      <label class="mt-3 block text-xs font-semibold text-gray-600">Description<textarea v-model="form.description" class="mt-1 min-h-20 w-full rounded-md border border-gray-200 bg-white p-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 dark:border-gray-700 dark:bg-gray-900" /></label>
    </header>

    <div class="flex overflow-x-auto border-b border-gray-200 px-5 dark:border-gray-800" role="tablist">
      <button v-for="tab in tabs" :key="tab.id" type="button" class="whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold" :class="activeTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-gray-500'" @click="activeTab = tab.id">{{ tab.label }}</button>
    </div>

    <div v-if="activeTab === 'workflow'" class="grid min-w-0 grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)]">
      <aside class="min-w-0 border-b border-gray-200 p-4 lg:border-b-0 lg:border-r dark:border-gray-800">
        <div class="mb-3 flex items-center justify-between"><h3 class="text-sm font-bold">Workflow Included</h3><SalesActionButton action="add" label="Add Flow" @click="$emit('addStep')" /></div>
        <div class="space-y-2">
          <div v-for="(step, index) in form.steps" :key="step.id || index" class="flex items-center gap-1">
            <button type="button" class="min-h-9 min-w-0 flex-1 truncate rounded-md border px-3 text-left text-sm font-semibold" :class="activeStepIndex === index ? 'border-primary bg-primary/5 text-primary' : 'border-gray-200 text-gray-600 dark:border-gray-700'" @click="activeStepIndex = index">{{ step.name || 'Choose Flow Name' }}</button>
            <template v-if="arranging"><SalesActionButton action="back" icon="arrow-up" label="Move Up" :disabled="index === 0" @click="$emit('moveStep', index, -1)" /><SalesActionButton action="back" icon="arrow-down" label="Move Down" :disabled="index === (form.steps?.length ?? 0) - 1" @click="$emit('moveStep', index, 1)" /></template>
          </div>
        </div>
        <button type="button" class="mt-4 text-xs font-semibold text-primary" @click="arranging = !arranging">{{ arranging ? 'Finish Arrange' : 'Arrange Flow Work' }}</button>
      </aside>

      <div v-if="activeStep" class="min-w-0 space-y-5 p-5">
        <div class="grid grid-cols-12 items-center gap-3"><label class="col-span-4 text-xs font-semibold">Flow Name</label><select v-model="activeStep.name" :class="[formControlClass, 'col-span-8']"><option value="">Choose Flow Name</option><option v-for="name in availableFlowNames" :key="name">{{ name }}</option></select></div>
        <JobOrderFlowInformation v-model="activeStep" @add="(target, label) => $emit('addInfo', target, label)" />
        <div class="flex justify-end"><button type="button" class="inline-flex h-9 items-center gap-2 rounded-md border border-red-200 px-3 text-xs font-semibold text-red-600" @click="$emit('removeStep', activeStepIndex)"><FeatherIcon name="trash-2" :size="14" /> Remove Flow</button></div>
      </div>
      <div v-else class="min-w-0 p-8 text-center text-sm text-gray-500">Add a workflow step to configure production.</div>
    </div>

    <div v-else-if="activeTab === 'assignee'" class="overflow-x-auto p-5">
      <div class="min-w-[650px] space-y-3">
        <div class="grid grid-cols-12 gap-3 text-xs font-bold text-gray-500"><span class="col-span-4">Flow Name with Incentive</span><span class="col-span-3">Flow Type</span><span class="col-span-5">Assignee List :</span></div>
        <div v-for="step in form.steps" :key="step.id" class="grid grid-cols-12 items-center gap-3"><span class="col-span-4 text-sm font-semibold">{{ step.name || '-' }}</span><span class="col-span-3 text-sm">{{ step.flowType }}</span><div class="col-span-5"><AssigneeSelect v-model="step.assignees" /></div></div>
      </div>
    </div>

    <div v-else class="overflow-x-auto p-5">
      <div class="min-w-[620px] space-y-3">
        <div class="grid grid-cols-12 gap-3 text-xs font-bold text-gray-500"><span class="col-span-5">Flow Name with Incentive</span><span class="col-span-3">Amount</span><span class="col-span-3">Unit</span></div>
        <div v-for="step in form.steps" :key="step.id" class="grid grid-cols-12 items-center gap-3"><span class="col-span-5 text-sm font-semibold">{{ step.name || '-' }}</span><div class="col-span-3"><CurrencyInput v-model="step.incentive" prefix="Rp" :min="0" /></div><select v-model="step.incentiveUnit" :class="[formControlClass, 'col-span-3']"><option>Job</option><option>Kg</option><option>Lembar</option><option>Rim</option><option>Meter</option><option>Pcs</option></select><button type="button" class="col-span-1 text-xs font-semibold text-primary" @click="step.incentive = 0">Remove</button></div>
      </div>
    </div>
  </section>
</template>
