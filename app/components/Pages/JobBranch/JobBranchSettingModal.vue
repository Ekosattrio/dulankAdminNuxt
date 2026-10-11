<script setup lang="ts">
import type { JobBranchAfterItem, JobBranchInfoItem, JobBranchItem, JobBranchUpdatePayload } from '#server/types/job-branch'
import SalesDialog from '~/components/Sales/SalesDialog.vue'
import JobBranchAssignmentFields from './JobBranchAssignmentFields.vue'
import JobBranchInformationEditor from './JobBranchInformationEditor.vue'
import { formControlClass } from '~/utils/salesUi'

const props = defineProps<{ open: boolean; item: JobBranchItem | null; busy?: boolean }>()
const emit = defineEmits<{ close: []; submit: [payload: JobBranchUpdatePayload] }>()

const priority = ref('High')
const branch = ref('Dulank Karawang')
const status = ref('Waiting')
const infoList = ref<JobBranchInfoItem[]>([])
const afterInfoList = ref<JobBranchAfterItem[]>([])
const assignees = ref<string[]>([])
const incentiveAmount = ref<number | string>(0)
const incentiveUnit = ref('Job')

watch(() => props.item, (item) => {
  if (!item) return
  priority.value = item.priority
  branch.value = item.branch
  status.value = item.status
  infoList.value = structuredClone(item.infoList ?? [])
  afterInfoList.value = structuredClone(item.afterInfoList ?? [])
  assignees.value = [...(item.assignees ?? [])]
  incentiveAmount.value = item.incentiveAmount ?? 0
  incentiveUnit.value = item.incentiveUnit ?? 'Job'
}, { immediate: true })

function submit() {
  emit('submit', {
    priority: priority.value,
    branch: branch.value,
    status: status.value,
    infoList: infoList.value,
    afterInfoList: afterInfoList.value,
    assignees: assignees.value,
    incentiveAmount: incentiveAmount.value,
    incentiveUnit: incentiveUnit.value,
  })
}
</script>

<template>
  <SalesDialog :open="open" title="Setting Detail Job Branch" wide :busy="busy" @close="$emit('close')">
    <form class="space-y-6" @submit.prevent="submit">
      <div v-if="item" class="rounded-lg border border-gray-200 bg-gray-50/60 p-4 dark:border-gray-800 dark:bg-gray-800/40">
        <div class="grid grid-cols-12 items-center gap-3">
          <span class="col-span-4 text-xs font-semibold text-gray-600">Job Title</span><strong class="col-span-8 text-sm">{{ item.jobTitle || item.product }}</strong>
          <span class="col-span-4 text-xs font-semibold text-gray-600">Description</span><span class="col-span-8 text-sm">{{ item.description || '-' }}</span>
          <span class="col-span-4 text-xs font-semibold text-gray-600">Qty</span><span class="col-span-8 text-sm">{{ item.qty || '-' }}</span>
          <label class="col-span-4 text-xs font-semibold text-gray-600">Priority</label>
          <select v-model="priority" :class="[formControlClass, 'col-span-8 sm:col-span-4']"><option>High</option><option>Urgent</option><option>Reguler</option></select>
          <label class="col-span-4 text-xs font-semibold text-gray-600">Branch</label>
          <select v-model="branch" :class="[formControlClass, 'col-span-8 sm:col-span-4']"><option>Dulank Karawang</option><option>Dulank Jakarta</option><option>Dulank Cirebon</option></select>
          <label class="col-span-4 text-xs font-semibold text-gray-600">Status</label>
          <select v-model="status" :class="[formControlClass, 'col-span-8 sm:col-span-4']"><option>Waiting</option><option>On Process</option><option>Completed</option></select>
        </div>
      </div>

      <div class="flex items-center gap-4 border-b border-gray-200 pb-2 dark:border-gray-700">
        <span class="app-section-title">Flow Name</span><strong class="text-sm text-primary">{{ item?.flowName }}</strong>
      </div>
      <JobBranchInformationEditor v-model:info-list="infoList" v-model:after-info-list="afterInfoList" />
      <JobBranchAssignmentFields v-model:assignees="assignees" v-model:incentive-amount="incentiveAmount" v-model:incentive-unit="incentiveUnit" />
    </form>
    <template #footer>
      <button type="button" class="h-9 rounded-md bg-gray-800 px-4 text-sm font-semibold text-white" :disabled="busy" @click="$emit('close')">Cancel</button>
      <button type="button" class="h-9 rounded-md bg-primary px-4 text-sm font-semibold text-white disabled:opacity-50" :disabled="busy" @click="submit">{{ busy ? 'Menyimpan...' : 'Submit' }}</button>
    </template>
  </SalesDialog>
</template>
