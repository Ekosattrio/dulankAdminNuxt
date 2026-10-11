<script setup lang="ts">
import type { JobOrderStep } from '#server/types/job-order'
import { formControlClass } from '~/utils/salesUi'

const step = defineModel<JobOrderStep>({ required: true })
const emit = defineEmits<{ add: [target: 'infoList' | 'afterInfoList', label: string] }>()
const newInformation = ref('')
const newCompletion = ref('')

function add(target: 'infoList' | 'afterInfoList') {
  const source = target === 'infoList' ? newInformation : newCompletion
  if (!source.value.trim()) return
  emit('add', target, source.value)
  source.value = ''
}
</script>

<template>
  <div class="space-y-5">
    <section class="space-y-3">
      <h4 class="app-section-title">Add Information Detail</h4>
      <div class="grid grid-cols-12 items-center gap-3">
        <span class="col-span-4 text-xs font-semibold">Flow Type</span>
        <div class="col-span-8 flex flex-wrap gap-4 text-sm">
          <label v-for="type in ['In-House', 'Branch Store', 'Outsource']" :key="type" class="flex items-center gap-2"><input v-model="step.flowType" type="radio" :value="type" /> {{ type }}</label>
        </div>
      </div>
      <div v-if="step.flowType === 'Branch Store'" class="grid grid-cols-12 items-center gap-3"><label class="col-span-4 text-xs font-semibold">Branch Store</label><select v-model="step.branch" :class="[formControlClass, 'col-span-8']"><option value="">Select Branch Store</option><option>Branch Store Jakarta</option><option>Branch Store Bandung</option><option>Branch Store Surabaya</option></select></div>
      <div v-if="step.flowType === 'Outsource'" class="grid grid-cols-12 items-center gap-3"><label class="col-span-4 text-xs font-semibold">Expense Name</label><input v-model="step.expenseName" :class="[formControlClass, 'col-span-8']" placeholder="Search Expense Name" /></div>
      <div v-for="(info, index) in step.infoList" :key="info.id" class="grid grid-cols-12 items-center gap-3">
        <label class="col-span-4 text-xs font-semibold">{{ info.label }}</label><input v-model="info.value" :class="[formControlClass, 'col-span-7']" />
        <button type="button" class="col-span-1 text-gray-400 hover:text-red-600" :aria-label="`Delete ${info.label}`" @click="step.infoList?.splice(index, 1)"><FeatherIcon name="trash-2" :size="14" /></button>
      </div>
      <div class="flex flex-wrap gap-2"><input v-model="newInformation" :class="[formControlClass, 'max-w-xs']" placeholder="Input label information" /><button type="button" class="h-9 rounded-md bg-primary px-3 text-xs font-semibold text-white" @click="add('infoList')">Add Information</button></div>
    </section>

    <section class="space-y-3 border-t border-gray-100 pt-5 dark:border-gray-800">
      <h4 class="app-section-title">Add Information if Flow Completed</h4>
      <div v-for="(info, index) in step.afterInfoList" :key="info.id" class="grid grid-cols-12 items-center gap-3">
        <label class="col-span-4 text-xs font-semibold">{{ info.label }}</label>
        <select v-model="info.inputType" :class="[formControlClass, 'col-span-3']"><option>Input Type</option><option>Select Type</option></select>
        <input v-model="info.value" :class="[formControlClass, 'col-span-4']" placeholder="Value" />
        <button type="button" class="col-span-1 text-gray-400 hover:text-red-600" :aria-label="`Delete ${info.label}`" @click="step.afterInfoList?.splice(index, 1)"><FeatherIcon name="trash-2" :size="14" /></button>
      </div>
      <div class="flex flex-wrap gap-2"><input v-model="newCompletion" :class="[formControlClass, 'max-w-xs']" placeholder="Input completion label" /><button type="button" class="h-9 rounded-md bg-primary px-3 text-xs font-semibold text-white" @click="add('afterInfoList')">Add Information After</button></div>
    </section>
  </div>
</template>
