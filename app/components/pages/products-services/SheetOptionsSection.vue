<script setup lang="ts">
import type { CalendarSheetOption } from '#server/types/calendar-setting'
import FeatherIcon from '~/components/common/FeatherIcon.vue'
import SalesActionButton from '~/components/sales/SalesActionButton.vue'
import { formControlClass } from '~/utils/salesUi'

const props = defineProps<{
  options: CalendarSheetOption[]
  busy?: boolean
}>()

const emit = defineEmits<{
  'update:options': [options: CalendarSheetOption[]]
  save: []
}>()

const customEnabled = ref(true)
const isAddingInline = ref(false)
const newSheetName = ref('')
const newSheetCount = ref(1)

function removeRow(index: number) {
  const updated = props.options.filter((_, i) => i !== index)
  emit('update:options', updated)
  emit('save')
}

function updateStatus(index: number, active: boolean) {
  const updated = props.options.map((opt, i) => i === index ? { ...opt, active } : opt)
  emit('update:options', updated)
  emit('save')
}

function addInline() {
  if (!newSheetName.value.trim()) return
  const newRow: CalendarSheetOption = {
    id: `sheet-${Date.now()}`,
    name: newSheetName.value.trim(),
    sheets: Number(newSheetCount.value) || 1,
    description: `${newSheetCount.value} lembar`,
    active: true,
  }
  emit('update:options', [...props.options, newRow])
  newSheetName.value = ''
  newSheetCount.value = 1
  isAddingInline.value = false
  emit('save')
}
</script>

<template>
  <div class="space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
    <div class="flex items-center justify-between border-b border-gray-100 pb-4 dark:border-gray-800">
      <div>
        <h4 class="text-base font-bold text-gray-900 dark:text-white">Number of Sheet Option</h4>
        <p class="text-xs text-gray-500">Manage available sheet counts and visibility for calendar calculations</p>
      </div>
    </div>

    <!-- Sheet Options Table -->
    <div class="overflow-x-auto">
      <table class="w-full text-left text-sm">
        <thead class="border-b border-gray-200 bg-gray-50 text-xs font-semibold text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
          <tr>
            <th class="px-5 py-3">Sheet Option</th>
            <th class="px-5 py-3">Sheets Count</th>
            <th class="px-5 py-3 text-center">Status</th>
            <th class="px-5 py-3 text-center">Action</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
          <tr v-for="(item, idx) in options" :key="item.id" class="hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
            <td class="px-5 py-3 font-semibold text-gray-900 dark:text-white">
              {{ item.name }}
            </td>
            <td class="px-5 py-3 text-gray-600 dark:text-gray-300">
              {{ item.sheets }} Lembar
            </td>
            <td class="px-5 py-3 text-center">
              <select
                :value="item.active ? 'true' : 'false'"
                class="h-8 rounded border border-gray-300 bg-white px-2 text-xs font-medium text-gray-700 shadow-sm focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                @change="updateStatus(idx, ($event.target as HTMLSelectElement).value === 'true')"
              >
                <option value="true">Show</option>
                <option value="false">Hide</option>
              </select>
            </td>
            <td class="px-5 py-3 text-center">
              <div class="flex justify-center">
                <SalesActionButton
                  action="delete"
                  label="Remove sheet option"
                  @click="removeRow(idx)"
                />
              </div>
            </td>
          </tr>

          <!-- Inline Add Row -->
          <tr v-if="isAddingInline" class="bg-amber-50/50 dark:bg-amber-950/20">
            <td class="px-5 py-2">
              <input
                v-model="newSheetName"
                type="text"
                placeholder="Contoh: 14 Lembar"
                :class="formControlClass"
              />
            </td>
            <td class="px-5 py-2">
              <input
                v-model.number="newSheetCount"
                type="number"
                min="1"
                placeholder="Jumlah lembar"
                :class="formControlClass"
              />
            </td>
            <td class="px-5 py-2 text-center text-xs text-gray-500">Show</td>
            <td class="px-5 py-2 text-center space-x-2">
              <button
                type="button"
                class="inline-flex h-8 items-center rounded bg-amber-500 px-3 text-xs font-semibold text-white shadow-sm hover:bg-amber-600"
                @click="addInline"
              >
                Save
              </button>
              <button
                type="button"
                class="inline-flex h-8 items-center rounded border border-gray-300 px-2 text-xs text-gray-600 hover:bg-gray-100 dark:text-gray-300"
                @click="isAddingInline = false"
              >
                Cancel
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add Number Sheet Button -->
    <div v-if="!isAddingInline">
      <button
        type="button"
        class="inline-flex h-9 items-center gap-2 rounded-md bg-amber-500 px-4 text-xs font-semibold text-white shadow-sm hover:bg-amber-600"
        @click="isAddingInline = true"
      >
        <FeatherIcon name="plus" :size="14" />
        Add Number Sheet
      </button>
    </div>

    <!-- Custom for Number of Sheet Radio Switch -->
    <div class="border-t border-gray-100 pt-5 dark:border-gray-800">
      <h6 class="text-xs font-bold text-gray-900 dark:text-white mb-2">Custom for Number of Sheet</h6>
      <div class="flex items-center gap-4">
        <span class="text-xs text-gray-600 dark:text-gray-300">Enable Custom for Number of Sheet?</span>
        <div class="inline-flex rounded-md border border-gray-300 p-0.5 dark:border-gray-700">
          <button
            type="button"
            :class="['rounded px-3 py-1 text-xs font-semibold transition', !customEnabled ? 'bg-amber-500 text-white' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800']"
            @click="customEnabled = false"
          >
            No
          </button>
          <button
            type="button"
            :class="['rounded px-3 py-1 text-xs font-semibold transition', customEnabled ? 'bg-amber-500 text-white' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800']"
            @click="customEnabled = true"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

