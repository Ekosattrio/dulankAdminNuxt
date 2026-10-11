<script setup lang="ts">
import type { CetakFullColorWorkflow, PaperGroupPreset } from '#server/types/cetak-full-color'
import FeatherIcon from '~/components/Common/FeatherIcon.vue'
import { formControlClass } from '~/utils/salesUi'
import WorkflowSettingSubTable from './WorkflowSettingSubTable.vue'

const defaultGroups = (): PaperGroupPreset[] => [
  { id: 'paper-art-paper', name: 'Art Paper', gramatures: ['100 gr', '120 gr', '150 gr'].map((label, index) => ({ id: `paper-art-${index}`, label, enabled: true })) },
  { id: 'paper-art-carton', name: 'Art Carton', gramatures: ['210 gr', '230 gr', '260 gr', '290 gr'].map((label, index) => ({ id: `paper-carton-${index}`, label, enabled: index < 3 })) },
  { id: 'paper-hvs', name: 'HVS', gramatures: ['60 gr', '70 gr', '80 gr', '100 gr'].map((label, index) => ({ id: `paper-hvs-${index}`, label, enabled: index < 3 })) },
  { id: 'paper-carton-bc', name: 'Carton BC', gramatures: [{ id: 'paper-bc-180', label: '180 gr', enabled: true }] },
]

const props = withDefaults(defineProps<{
  groups?: PaperGroupPreset[]
  workflowItems?: CetakFullColorWorkflow[]
  busy?: boolean
}>(), {
  groups: () => [],
  workflowItems: () => [],
})

const emit = defineEmits<{
  'update:groups': [groups: PaperGroupPreset[]]
  'update:workflowItems': [items: CetakFullColorWorkflow[]]
  save: []
}>()

const localGroups = ref<PaperGroupPreset[]>(defaultGroups())
watch(() => props.groups, (groups) => {
  localGroups.value = structuredClone(toRaw(groups.length ? groups : defaultGroups()))
}, { immediate: true, deep: true })

const isAddingPaper = ref(false)
const newPaperName = ref('')
const newGramatures = ref('')

const paperOptions = computed(() => localGroups.value.map(group => group.name))

function publishGroups(save = false) {
  emit('update:groups', structuredClone(toRaw(localGroups.value)))
  if (save) nextTick(() => emit('save'))
}

function toggleSelectAll(group: PaperGroupPreset, enabled: boolean) {
  group.gramatures.forEach(item => { item.enabled = enabled })
  publishGroups()
}

function isAllSelected(group: PaperGroupPreset) {
  return group.gramatures.length > 0 && group.gramatures.every(item => item.enabled)
}

function addPaperGroup() {
  const name = newPaperName.value.trim()
  const values = newGramatures.value.split(',').map(value => value.trim()).filter(Boolean)
  if (!name || !values.length) return
  localGroups.value.push({
    id: `paper-group-${Date.now()}`,
    name,
    gramatures: values.map((label, index) => ({ id: `paper-gramature-${Date.now()}-${index}`, label, enabled: false })),
  })
  newPaperName.value = ''
  newGramatures.value = ''
  isAddingPaper.value = false
  publishGroups()
}
</script>

<template>
  <div class="space-y-6">
    <section class="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <h4 class="app-section-title border-b border-gray-100 pb-3 text-gray-900 dark:border-gray-800 dark:text-white">Paper Type Option</h4>

      <div class="mt-4 overflow-x-auto">
        <table class="min-w-[680px] w-full text-left text-sm">
          <thead class="border-b border-gray-200 bg-gray-50 font-semibold text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200">
            <tr><th class="w-48 px-5 py-3">Paper Group</th><th class="px-5 py-3">Gramature</th></tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <tr v-for="group in localGroups" :key="group.id">
              <td class="px-5 py-4 font-semibold text-gray-900 dark:text-white">{{ group.name }}</td>
              <td class="px-5 py-4">
                <div class="flex flex-wrap items-center gap-4">
                  <label v-for="gramature in group.gramatures" :key="gramature.id" class="flex cursor-pointer items-center gap-2">
                    <input v-model="gramature.enabled" type="checkbox" class="size-4 rounded border-gray-300 text-primary" @change="publishGroups()" />
                    <span>{{ gramature.label }}</span>
                  </label>
                  <label class="flex cursor-pointer items-center gap-2 border-l border-gray-200 pl-4 font-semibold dark:border-gray-700">
                    <input type="checkbox" :checked="isAllSelected(group)" class="size-4 rounded border-gray-300 text-primary" @change="toggleSelectAll(group, ($event.target as HTMLInputElement).checked)" />
                    <span>Select All</span>
                  </label>
                </div>
              </td>
            </tr>
            <tr v-if="isAddingPaper" class="bg-amber-50/50 dark:bg-amber-950/20">
              <td class="px-5 py-3"><input v-model="newPaperName" :class="formControlClass" placeholder="Paper Group" /></td>
              <td class="px-5 py-3">
                <div class="flex gap-2">
                  <input v-model="newGramatures" :class="formControlClass" placeholder="100 gr, 120 gr, 150 gr" />
                  <button type="button" class="h-9 rounded-md bg-[#ff9f43] px-3 text-sm font-semibold text-white" @click="addPaperGroup">Add</button>
                  <button type="button" class="h-9 rounded-md bg-gray-800 px-3 text-sm font-semibold text-white" @click="isAddingPaper = false">Cancel</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-4 dark:border-gray-800">
        <button v-if="!isAddingPaper" type="button" class="inline-flex h-9 items-center gap-2 rounded-md bg-[#ff9f43] px-3 text-sm font-semibold text-white" @click="isAddingPaper = true">
          <FeatherIcon name="plus" :size="14" /> Add Paper Name
        </button>
        <div v-else />
        <div class="flex gap-2">
          <button type="button" class="h-9 rounded-md bg-gray-800 px-4 text-sm font-semibold text-white">Cancel</button>
          <button type="button" class="h-9 rounded-md bg-primary px-4 text-sm font-semibold text-white disabled:opacity-50" :disabled="busy" @click="publishGroups(true)">Save</button>
        </div>
      </div>
    </section>

    <WorkflowSettingSubTable
      title="Work Flow Setting"
      target-label="Effective Paper Group"
      add-label="Add Flow Name"
      :items="workflowItems"
      :options="paperOptions"
      @update:items="emit('update:workflowItems', $event)"
      @save="emit('save')"
    />
  </div>
</template>
