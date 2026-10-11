<script setup lang="ts">
import AssigneeSelect from '~/components/Common/AssigneeSelect.vue'
import CurrencyInput from '~/components/Common/CurrencyInput.vue'
import { formControlClass } from '~/utils/salesUi'

const assignees = defineModel<string[]>('assignees', { required: true })
const incentiveAmount = defineModel<number | string>('incentiveAmount', { required: true })
const incentiveUnit = defineModel<string>('incentiveUnit', { required: true })
const incentiveUnits = ['Job', 'Lembar', 'Rim', 'Meter', 'Pcs']
</script>

<template>
  <div class="space-y-4 border-t border-gray-100 pt-4 dark:border-gray-800">
    <div class="space-y-2">
      <label class="block text-xs font-bold text-gray-900 dark:text-white">Assignee List :</label>
      <AssigneeSelect v-model="assignees" placeholder="+ Add employee or department..." />
    </div>
    <div class="grid grid-cols-12 items-center gap-3">
      <label class="col-span-4 text-xs font-semibold text-gray-700 dark:text-gray-300">Incentive Amount</label>
      <CurrencyInput v-model="incentiveAmount" class="col-span-4" prefix="Rp" align="right" placeholder="0" />
      <select v-model="incentiveUnit" :class="[formControlClass, 'col-span-4']" aria-label="Incentive unit">
        <option v-for="unit in incentiveUnits" :key="unit" :value="unit">{{ unit }}</option>
      </select>
    </div>
  </div>
</template>
