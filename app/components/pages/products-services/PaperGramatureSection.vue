<script setup lang="ts">
import FeatherIcon from '~/components/common/FeatherIcon.vue'
import { formControlClass } from '~/utils/salesUi'
import WorkflowSettingSubTable, { type WorkflowItem } from './WorkflowSettingSubTable.vue'

export interface PaperGroupItem {
  name: string
  gramatures: Array<{ weight: string; checked: boolean }>
}

const props = defineProps<{
  busy?: boolean
}>()

const emit = defineEmits<{
  save: []
}>()

const paperGroups = ref<PaperGroupItem[]>([
  {
    name: 'Art Paper',
    gramatures: [
      { weight: '100 gr', checked: true },
      { weight: '120 gr', checked: true },
      { weight: '150 gr', checked: true },
    ],
  },
  {
    name: 'Art Carton',
    gramatures: [
      { weight: '210 gr', checked: true },
      { weight: '230 gr', checked: true },
      { weight: '260 gr', checked: true },
      { weight: '290 gr', checked: false },
    ],
  },
  {
    name: 'HVS',
    gramatures: [
      { weight: '60 gr', checked: true },
      { weight: '70 gr', checked: true },
      { weight: '80 gr', checked: true },
      { weight: '100 gr', checked: false },
    ],
  },
  {
    name: 'Carton BC',
    gramatures: [
      { weight: '180 gr', checked: true },
    ],
  },
])

const isAddingPaper = ref(false)
const newPaperName = ref('')
const newGramatures = ref('150 gr, 210 gr')
const feedbackMsg = ref('')

function toggleSelectAll(group: PaperGroupItem, checked: boolean) {
  for (const g of group.gramatures) {
    g.checked = checked
  }
}

function isAllSelected(group: PaperGroupItem): boolean {
  return group.gramatures.length > 0 && group.gramatures.every(g => g.checked)
}

function addPaperGroup() {
  if (!newPaperName.value.trim()) return
  const grams = newGramatures.value.split(',').map(s => s.trim()).filter(Boolean)
  paperGroups.value.push({
    name: newPaperName.value.trim(),
    gramatures: grams.map(w => ({ weight: w, checked: true })),
  })
  newPaperName.value = ''
  isAddingPaper.value = false
  saveSettings()
}

function saveSettings() {
  emit('save')
  feedbackMsg.value = 'Paper types updated successfully'
  window.setTimeout(() => { feedbackMsg.value = '' }, 3000)
}
</script>

<template>
  <div class="space-y-6">
    <div class="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="flex items-center justify-between border-b border-gray-100 pb-3 dark:border-gray-800">
        <h4 class="text-base font-bold text-gray-900 dark:text-white">Paper Type Option</h4>
        <span v-if="feedbackMsg" class="text-xs font-semibold text-emerald-600">{{ feedbackMsg }}</span>
      </div>

      <!-- Paper Type Gramature Table -->
      <div class="overflow-x-auto mt-4">
        <table class="w-full text-left text-sm">
          <thead class="border-b border-gray-200 bg-gray-50 text-xs font-semibold text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
            <tr>
              <th class="px-5 py-3 w-48">Paper Group</th>
              <th class="px-5 py-3">Gramature</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <tr v-for="group in paperGroups" :key="group.name" class="hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
              <td class="px-5 py-4 font-semibold text-gray-900 dark:text-white align-top">
                {{ group.name }}
              </td>
              <td class="px-5 py-4">
                <div class="flex flex-wrap items-center gap-4 text-xs">
                  <label
                    v-for="gram in group.gramatures"
                    :key="gram.weight"
                    class="flex items-center gap-2 cursor-pointer text-gray-700 dark:text-gray-200"
                  >
                    <input
                      v-model="gram.checked"
                      type="checkbox"
                      class="size-4 rounded border-gray-300 text-primary"
                    />
                    <span>{{ gram.weight }}</span>
                  </label>

                  <label class="flex items-center gap-2 cursor-pointer font-semibold text-amber-600 dark:text-amber-400 border-l border-gray-200 pl-4 dark:border-gray-700">
                    <input
                      type="checkbox"
                      :checked="isAllSelected(group)"
                      class="size-4 rounded border-gray-300 text-amber-500"
                      @change="toggleSelectAll(group, ($event.target as HTMLInputElement).checked)"
                    />
                    <span>Select All</span>
                  </label>
                </div>
              </td>
            </tr>

            <!-- Add Paper Group Row -->
            <tr v-if="isAddingPaper" class="bg-amber-50/50 dark:bg-amber-950/20">
              <td class="px-5 py-3">
                <input v-model="newPaperName" type="text" placeholder="Nama kertas..." :class="formControlClass" />
              </td>
              <td class="px-5 py-3">
                <div class="flex items-center gap-2">
                  <input v-model="newGramatures" type="text" placeholder="Gramatur pisahkan koma: 150 gr, 210 gr" :class="formControlClass" />
                  <button type="button" class="h-9 rounded bg-amber-500 px-3 text-xs font-semibold text-white hover:bg-amber-600" @click="addPaperGroup">Add</button>
                  <button type="button" class="h-9 rounded border border-gray-300 px-2 text-xs text-gray-600 hover:bg-gray-100 dark:text-gray-300" @click="isAddingPaper = false">Cancel</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Action buttons -->
      <div class="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
        <button
          v-if="!isAddingPaper"
          type="button"
          class="inline-flex h-9 items-center gap-1.5 rounded-md bg-amber-500 px-3.5 text-xs font-semibold text-white shadow-sm hover:bg-amber-600"
          @click="isAddingPaper = true"
        >
          <FeatherIcon name="plus" :size="14" />
          Add Paper Name
        </button>
        <div v-else />

        <div class="flex items-center gap-2">
          <button
            type="button"
            class="h-9 rounded-md border border-gray-300 bg-white px-4 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
          >
            Cancel
          </button>
          <button
            type="button"
            class="h-9 rounded-md bg-primary px-5 text-xs font-semibold text-white shadow-sm hover:bg-primary/90 disabled:opacity-50"
            :disabled="busy"
            @click="saveSettings"
          >
            Save
          </button>
        </div>
      </div>
    </div>

    <!-- Work Flow Setting Sub Table -->
    <WorkflowSettingSubTable title="Work Flow Setting" target-label="Effective Paper Group" @save="$emit('save')" />
  </div>
</template>

