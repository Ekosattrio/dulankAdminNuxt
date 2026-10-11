<script setup lang="ts">
import type { JobBranchAfterItem, JobBranchInfoItem } from '#server/types/job-branch'
import FeatherIcon from '~/components/Common/FeatherIcon.vue'
import { formControlClass } from '~/utils/salesUi'

const infoList = defineModel<JobBranchInfoItem[]>('infoList', { required: true })
const afterInfoList = defineModel<JobBranchAfterItem[]>('afterInfoList', { required: true })
const addingInfo = ref(false)
const addingAfter = ref(false)
const newInfoLabel = ref('')
const newAfterLabel = ref('')

function addInfo() {
  const label = newInfoLabel.value.trim()
  if (!label) return
  infoList.value.push({ id: crypto.randomUUID(), label, value: '' })
  newInfoLabel.value = ''
  addingInfo.value = false
}

function addAfter() {
  const label = newAfterLabel.value.trim()
  if (!label) return
  afterInfoList.value.push({ id: crypto.randomUUID(), label })
  newAfterLabel.value = ''
  addingAfter.value = false
}
</script>

<template>
  <div class="space-y-5">
    <section class="space-y-3" aria-labelledby="job-branch-input-info">
      <h6 id="job-branch-input-info" class="app-section-title">Information Before Flow</h6>
      <div v-for="(info, index) in infoList" :key="info.id" class="grid grid-cols-12 items-center gap-3">
        <label class="col-span-4 text-xs font-semibold text-gray-700 dark:text-gray-300">{{ info.label }}</label>
        <input v-model="info.value" type="text" :class="[formControlClass, 'col-span-7']" placeholder="Value" />
        <button type="button" class="col-span-1 p-1.5 text-gray-400 hover:text-amber-500" :aria-label="`Delete ${info.label}`" @click="infoList.splice(index, 1)">
          <FeatherIcon name="trash-2" :size="14" />
        </button>
      </div>
      <button v-if="!addingInfo" type="button" class="text-xs font-semibold text-primary" @click="addingInfo = true">+ Add Information</button>
      <div v-else class="flex flex-wrap items-center gap-2">
        <input v-model="newInfoLabel" type="text" :class="[formControlClass, 'w-64']" placeholder="Input label information" />
        <button type="button" class="h-9 rounded-md bg-gray-800 px-3 text-xs font-semibold text-white" @click="addingInfo = false; newInfoLabel = ''">Cancel</button>
        <button type="button" class="h-9 rounded-md bg-primary px-3 text-xs font-semibold text-white" @click="addInfo">Save</button>
      </div>
    </section>

    <section class="space-y-3 border-t border-gray-100 pt-4 dark:border-gray-800" aria-labelledby="job-branch-output-info">
      <h6 id="job-branch-output-info" class="app-section-title">Add Information if Flow Completed</h6>
      <div v-for="(after, index) in afterInfoList" :key="after.id" class="grid grid-cols-12 items-center gap-3">
        <input v-model="after.label" type="text" :class="[formControlClass, 'col-span-11']" placeholder="Label completion info" />
        <button type="button" class="col-span-1 p-1.5 text-gray-400 hover:text-amber-500" :aria-label="`Delete ${after.label}`" @click="afterInfoList.splice(index, 1)">
          <FeatherIcon name="trash-2" :size="14" />
        </button>
      </div>
      <button v-if="!addingAfter" type="button" class="text-xs font-semibold text-primary" @click="addingAfter = true">+ Add Information After</button>
      <div v-else class="flex flex-wrap items-center gap-2">
        <input v-model="newAfterLabel" type="text" :class="[formControlClass, 'w-64']" placeholder="Input label information" />
        <button type="button" class="h-9 rounded-md bg-gray-800 px-3 text-xs font-semibold text-white" @click="addingAfter = false; newAfterLabel = ''">Cancel</button>
        <button type="button" class="h-9 rounded-md bg-primary px-3 text-xs font-semibold text-white" @click="addAfter">Save</button>
      </div>
    </section>
  </div>
</template>
