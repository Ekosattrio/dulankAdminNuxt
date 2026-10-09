<script setup lang="ts">
import FeatherIcon from '~/components/common/FeatherIcon.vue'
import SalesActionButton from '~/components/sales/SalesActionButton.vue'
import { formControlClass } from '~/utils/salesUi'

export interface WorkflowItem {
  id: string
  category: string
  name: string
  assignee: string
  incentive: string | number
  targets: string[]
}

const props = withDefaults(defineProps<{
  title?: string
  items?: WorkflowItem[]
  targetLabel?: string
}>(), {
  title: 'Work Flow Setting',
  targetLabel: 'Effective Paper Group',
  items: () => [
    {
      id: 'wf-1',
      category: 'Pracetak',
      name: 'Pesan Kertas ke Toko',
      assignee: 'Nurdin',
      incentive: '5.000 per Job',
      targets: ['Art Paper', 'Art Carton', 'HVS', 'Carton BC'],
    },
    {
      id: 'wf-2',
      category: 'Finishing',
      name: 'Potong & Sisir Kertas',
      assignee: 'Budi Santoso',
      incentive: '3.000 per Job',
      targets: ['Art Paper', 'Art Carton'],
    },
  ],
})

const emit = defineEmits<{
  'update:items': [items: WorkflowItem[]]
  save: []
}>()

const localItems = ref<WorkflowItem[]>(props.items ? [...props.items] : [])
watch(() => props.items, (val) => { if (val) localItems.value = [...val] }, { deep: true })

const isAdding = ref(false)
const newCategory = ref('Pracetak')
const newName = ref('')
const newAssignee = ref('')
const newIncentive = ref('5.000 per Job')
const newTargets = ref('Art Paper, Art Carton')

function removeRow(idx: number) {
  localItems.value.splice(idx, 1)
  emit('update:items', [...localItems.value])
  emit('save')
}

function addWorkflow() {
  if (!newName.value.trim()) return
  const targets = newTargets.value.split(',').map(s => s.trim()).filter(Boolean)
  localItems.value.push({
    id: `wf-${Date.now()}`,
    category: newCategory.value,
    name: newName.value.trim(),
    assignee: newAssignee.value.trim() || 'Nurdin',
    incentive: newIncentive.value,
    targets: targets.length ? targets : ['Semua'],
  })
  emit('update:items', [...localItems.value])
  newName.value = ''
  newAssignee.value = ''
  isAdding.value = false
  emit('save')
}
</script>

<template>
  <div class="mt-6 rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
    <div class="flex items-center justify-between border-b border-gray-100 pb-3 dark:border-gray-800">
      <h4 class="text-sm font-bold text-gray-900 dark:text-white">{{ title }}</h4>
      <button
        v-if="!isAdding"
        type="button"
        class="inline-flex h-8 items-center gap-1.5 rounded-md bg-amber-500 px-3 text-xs font-semibold text-white shadow-sm hover:bg-amber-600"
        @click="isAdding = true"
      >
        <FeatherIcon name="plus" :size="13" />
        Add Work Flow
      </button>
    </div>

    <div class="overflow-x-auto mt-4">
      <table class="w-full text-left text-xs">
        <thead class="border-b border-gray-200 bg-gray-50 text-[11px] font-semibold text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
          <tr>
            <th class="px-4 py-2.5">Flow Category</th>
            <th class="px-4 py-2.5">Flow Name</th>
            <th class="px-4 py-2.5">Assigne</th>
            <th class="px-4 py-2.5">Incentive</th>
            <th class="px-4 py-2.5">{{ targetLabel }}</th>
            <th class="px-4 py-2.5 text-center">Action</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
          <tr v-for="(item, idx) in localItems" :key="item.id" class="hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
            <td class="px-4 py-3 font-semibold text-gray-800 dark:text-gray-200">{{ item.category }}</td>
            <td class="px-4 py-3 text-gray-700 dark:text-gray-300">{{ item.name }}</td>
            <td class="px-4 py-3 text-gray-600 dark:text-gray-400">{{ item.assignee }}</td>
            <td class="px-4 py-3 font-medium text-emerald-600 dark:text-emerald-400">{{ item.incentive }}</td>
            <td class="px-4 py-3">
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="target in item.targets"
                  :key="target"
                  class="rounded bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800"
                >
                  {{ target }}
                </span>
              </div>
            </td>
            <td class="px-4 py-3 text-center">
              <div class="flex justify-center">
                <SalesActionButton
                  action="delete"
                  label="Remove workflow step"
                  @click="removeRow(idx)"
                />
              </div>
            </td>
          </tr>

          <!-- Inline Add Form -->
          <tr v-if="isAdding" class="bg-amber-50/40 dark:bg-amber-950/20">
            <td class="px-3 py-2">
              <select v-model="newCategory" :class="formControlClass">
                <option value="Pracetak">Pracetak</option>
                <option value="Cetak">Cetak</option>
                <option value="Finishing">Finishing</option>
              </select>
            </td>
            <td class="px-3 py-2">
              <input v-model="newName" type="text" placeholder="Nama alur pengerjaan" :class="formControlClass" />
            </td>
            <td class="px-3 py-2">
              <input v-model="newAssignee" type="text" placeholder="Petugas" :class="formControlClass" />
            </td>
            <td class="px-3 py-2">
              <input v-model="newIncentive" type="text" placeholder="Insentif" :class="formControlClass" />
            </td>
            <td class="px-3 py-2">
              <input v-model="newTargets" type="text" placeholder="Target pisahkan koma" :class="formControlClass" />
            </td>
            <td class="px-3 py-2 text-center space-x-1">
              <button type="button" class="rounded bg-amber-500 px-2.5 py-1 text-xs font-semibold text-white hover:bg-amber-600" @click="addWorkflow">Simpan</button>
              <button type="button" class="rounded border border-gray-300 px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 dark:text-gray-300" @click="isAdding = false">Batal</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

