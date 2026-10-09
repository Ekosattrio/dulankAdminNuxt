<script setup lang="ts">
import type { JobBranchInfoItem, JobBranchAfterItem } from '#server/types/job-branch'
import FeatherIcon from '~/components/common/FeatherIcon.vue'
import { formControlClass } from '~/utils/salesUi'

const infoList = defineModel<JobBranchInfoItem[]>('infoList', { default: () => [] })
const afterInfoList = defineModel<JobBranchAfterItem[]>('afterInfoList', { default: () => [] })

const isAddingInfo = ref(false)
const newInfoLabel = ref('')

const isAddingAfter = ref(false)
const newAfterLabel = ref('')

function handleAddInfo() {
  if (!newInfoLabel.value.trim()) return
  infoList.value.push({
    id: Date.now().toString(),
    label: newInfoLabel.value.trim(),
    value: '',
  })
  newInfoLabel.value = ''
  isAddingInfo.value = false
}

function handleDeleteInfo(index: number) {
  infoList.value.splice(index, 1)
}

function handleAddAfter() {
  if (!newAfterLabel.value.trim()) return
  afterInfoList.value.push({
    id: Date.now().toString(),
    label: newAfterLabel.value.trim(),
  })
  newAfterLabel.value = ''
  isAddingAfter.value = false
}

function handleDeleteAfter(index: number) {
  afterInfoList.value.splice(index, 1)
}
</script>

<template>
  <div class="space-y-6">
    <!-- Technical Specifications List (Job Branch Info Rows) -->
    <div class="space-y-3">
      <div
        v-for="(info, idx) in infoList"
        :key="info.id || idx"
        class="grid grid-cols-12 gap-3 items-center"
      >
        <label class="col-span-4 text-xs font-semibold text-gray-700 dark:text-gray-300">
          {{ info.label }}
        </label>
        <div class="col-span-7">
          <input
            v-model="info.value"
            type="text"
            :class="formControlClass"
            placeholder="Value"
          />
        </div>
        <div class="col-span-1 text-end">
          <button
            type="button"
            class="p-1.5 text-gray-400 hover:text-amber-500 transition-colors"
            title="Delete row"
            @click="handleDeleteInfo(idx)"
          >
            <FeatherIcon name="trash-2" size="14" />
          </button>
        </div>
      </div>

      <!-- Add Information inline toggler -->
      <div>
        <button
          v-if="!isAddingInfo"
          type="button"
          class="text-xs font-semibold text-[#ff9f43] hover:text-[#e08933] inline-flex items-center gap-1 transition-colors"
          @click="isAddingInfo = true"
        >
          + Add Information
        </button>
        <div v-else class="flex items-center gap-2 mt-2">
          <input
            v-model="newInfoLabel"
            type="text"
            placeholder="Input label information"
            class="h-9 px-3 text-xs rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white w-64"
          />
          <button
            type="button"
            class="h-9 px-3 rounded-lg bg-[#212b36] hover:bg-gray-800 text-white text-xs font-medium"
            @click="isAddingInfo = false; newInfoLabel = ''"
          >
            Cancel
          </button>
          <button
            type="button"
            class="h-9 px-3 rounded-lg bg-[#ff9f43] hover:bg-[#e08933] text-white text-xs font-medium"
            @click="handleAddInfo"
          >
            Save
          </button>
        </div>
      </div>
    </div>

    <!-- Add Information if Flow Completed -->
    <div class="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-3">
      <h6 class="font-bold text-xs text-gray-900 dark:text-white uppercase tracking-wider">
        Add Information if Flow Completed
      </h6>

      <div
        v-for="(after, idx) in afterInfoList"
        :key="after.id || idx"
        class="grid grid-cols-12 gap-3 items-center"
      >
        <div class="col-span-11">
          <input
            v-model="after.label"
            type="text"
            :class="formControlClass"
            placeholder="Label completion info"
          />
        </div>
        <div class="col-span-1 text-end">
          <button
            type="button"
            class="p-1.5 text-gray-400 hover:text-amber-500 transition-colors"
            title="Delete row"
            @click="handleDeleteAfter(idx)"
          >
            <FeatherIcon name="trash-2" size="14" />
          </button>
        </div>
      </div>

      <div>
        <button
          v-if="!isAddingAfter"
          type="button"
          class="text-xs font-semibold text-[#ff9f43] hover:text-[#e08933] inline-flex items-center gap-1 transition-colors"
          @click="isAddingAfter = true"
        >
          + Add Information After
        </button>
        <div v-else class="flex items-center gap-2 mt-2">
          <input
            v-model="newAfterLabel"
            type="text"
            placeholder="Input label information"
            class="h-9 px-3 text-xs rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white w-64"
          />
          <button
            type="button"
            class="h-9 px-3 rounded-lg bg-[#212b36] hover:bg-gray-800 text-white text-xs font-medium"
            @click="isAddingAfter = false; newAfterLabel = ''"
          >
            Cancel
          </button>
          <button
            type="button"
            class="h-9 px-3 rounded-lg bg-[#ff9f43] hover:bg-[#e08933] text-white text-xs font-medium"
            @click="handleAddAfter"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

