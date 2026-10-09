<script setup lang="ts">
import type { JobBranchItem, JobBranchUpdatePayload, JobBranchInfoItem, JobBranchAfterItem } from '#server/types/job-branch'
import SalesDialog from '~/components/sales/SalesDialog.vue'
import AssigneeSelect from '~/components/common/AssigneeSelect.vue'
import FeatherIcon from '~/components/common/FeatherIcon.vue'
import CurrencyInput from '~/components/common/CurrencyInput.vue'
import { formControlClass } from '~/utils/salesUi'

const props = defineProps<{
  open: boolean
  item: JobBranchItem | null
  busy?: boolean
}>()

const emit = defineEmits<{
  close: []
  submit: [payload: JobBranchUpdatePayload]
}>()

const priorityOptions = ['High', 'Urgent', 'Reguler']
const incentiveUnits = ['Job', 'Qty', 'Rim']

const selectedPriority = ref('High')
const selectedBranch = ref('Dulank Karawang')
const selectedStatus = ref('Waiting')

// Technical specifications list
const infoList = ref<JobBranchInfoItem[]>([])
const isAddingInfo = ref(false)
const newInfoLabel = ref('')

// Information after flow completed
const afterInfoList = ref<JobBranchAfterItem[]>([])
const isAddingAfter = ref(false)
const newAfterLabel = ref('')

// Assignees
const selectedAssignees = ref<string[]>([])

// Incentive
const incentiveAmount = ref<number | string>(1500)
const incentiveUnit = ref('Job')
const showIncentive = ref(true)

watch(
  () => props.item,
  (val) => {
    if (val) {
      selectedPriority.value = val.priority || 'High'
      selectedBranch.value = val.branch || 'Dulank Karawang'
      selectedStatus.value = val.status || 'Waiting'

      infoList.value = val.infoList ? JSON.parse(JSON.stringify(val.infoList)) : [
        { id: '1', label: 'Jumlah Plat', value: '2' },
        { id: '2', label: 'Warna Cetak', value: 'Hitam' },
        { id: '3', label: 'Sisi Cetak', value: '1 Sisi' },
        { id: '4', label: 'Sample Warna', value: 'Tidak Ada' },
      ]

      afterInfoList.value = val.afterInfoList ? JSON.parse(JSON.stringify(val.afterInfoList)) : [
        { id: '1', label: 'Berapa Jumlah Cetak Ok' }
      ]

      selectedAssignees.value = val.assignees ? [...val.assignees] : ['Abdul', 'Nurdin']
      incentiveAmount.value = val.incentiveAmount || 1500
      incentiveUnit.value = val.incentiveUnit || 'Job'
      showIncentive.value = true
    }
  },
  { immediate: true },
)

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

function handleSubmit() {
  emit('submit', {
    priority: selectedPriority.value,
    branch: selectedBranch.value,
    status: selectedStatus.value,
    infoList: infoList.value,
    afterInfoList: afterInfoList.value,
    assignees: selectedAssignees.value,
    incentiveAmount: incentiveAmount.value,
    incentiveUnit: incentiveUnit.value,
  })
}
</script>

<template>
  <SalesDialog
    :open="open"
    title="Setting Detail Job Branch"
    wide
    :busy="busy"
    @close="$emit('close')"
  >
    <form class="space-y-6 text-xs" @submit.prevent="handleSubmit">
      <!-- Static Overview Grid matching legacy -->
      <div v-if="item" class="rounded-lg border border-gray-200 bg-gray-50/60 p-4 dark:border-gray-800 dark:bg-gray-800/40">
        <div class="grid grid-cols-12 gap-y-3 items-center">
          <div class="col-span-4 font-medium text-gray-500 dark:text-gray-400">Job Title</div>
          <div class="col-span-8 font-bold text-gray-900 dark:text-gray-100 text-sm">{{ item.jobTitle || item.product }}</div>

          <div class="col-span-4 font-medium text-gray-500 dark:text-gray-400">Description</div>
          <div class="col-span-8 leading-relaxed text-gray-700 dark:text-gray-300">{{ item.description || '-' }}</div>

          <div class="col-span-4 font-medium text-gray-500 dark:text-gray-400">Qty</div>
          <div class="col-span-8 font-semibold text-gray-800 dark:text-gray-200">{{ item.qty || '-' }}</div>

          <div class="col-span-4 font-medium text-gray-500 dark:text-gray-400">Priority</div>
          <div class="col-span-6 sm:col-span-4">
            <select v-model="selectedPriority" :class="formControlClass">
              <option v-for="p in priorityOptions" :key="p" :value="p">{{ p }}</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Flow Name Section -->
      <div class="flex items-center justify-between pb-2 border-b border-gray-200 dark:border-gray-750">
        <div class="flex items-center gap-4">
          <span class="font-bold text-sm text-gray-900 dark:text-white">Flow Name</span>
          <span class="font-bold text-sm text-primary dark:text-[#ff9f43]">{{ item?.flowName }}</span>
        </div>
      </div>

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

      <!-- Assignee List Section using AssigneeSelect.vue -->
      <div class="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-2">
        <label class="block font-bold text-xs text-gray-900 dark:text-white">
          Assignee List :
        </label>
        <AssigneeSelect
          v-model="selectedAssignees"
          placeholder="+ Add employee or department..."
        />
      </div>

      <!-- Incentive Section -->
      <div v-if="showIncentive" class="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-2">
        <h6 class="font-bold text-xs text-gray-900 dark:text-white">Incentive</h6>
        <div class="grid grid-cols-12 gap-3 items-center">
          <div class="col-span-3 text-gray-700 dark:text-gray-300 font-medium">Incentive Amount</div>
          <div class="col-span-3">
            <CurrencyInput
              v-model="incentiveAmount"
              prefix="Rp"
              align="right"
              placeholder="0"
            />
          </div>
          <div class="col-span-1 text-center text-gray-600 dark:text-gray-400 font-medium">Unit</div>
          <div class="col-span-4">
            <select v-model="incentiveUnit" :class="formControlClass">
              <option v-for="u in incentiveUnits" :key="u" :value="u">{{ u }}</option>
            </select>
          </div>
          <div class="col-span-1 text-end">
            <button
              type="button"
              class="p-1.5 text-gray-400 hover:text-amber-500 transition-colors"
              title="Remove incentive"
              @click="showIncentive = false"
            >
              <FeatherIcon name="trash-2" size="14" />
            </button>
          </div>
        </div>
      </div>
    </form>

    <template #footer>
      <div class="flex items-center justify-end gap-2">
        <button
          type="button"
          class="h-9 px-4 rounded-lg bg-[#212b36] hover:bg-gray-800 text-white text-xs font-medium transition-colors"
          :disabled="busy"
          @click="$emit('close')"
        >
          Cancel
        </button>
        <button
          type="button"
          class="h-9 px-4 rounded-lg bg-[#ff9f43] hover:bg-[#e08933] text-white text-xs font-medium transition-colors disabled:opacity-50"
          :disabled="busy"
          @click="handleSubmit"
        >
          <span v-if="busy">Menyimpan...</span>
          <span v-else>Submit</span>
        </button>
      </div>
    </template>
  </SalesDialog>
</template>
