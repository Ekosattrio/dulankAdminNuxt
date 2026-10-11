<script setup lang="ts">
import type { FlowTemplateItem } from '#server/types/flow-template'

const props = defineProps<{ items: FlowTemplateItem[] }>()
const emit = defineEmits<{ 'update:items': [items: FlowTemplateItem[]] }>()

const showNewRow = ref(false)
const newLabel = ref('')
const editingIndex = ref<number | null>(null)
const editingLabel = ref('')
const dataSelectIndex = ref<number | null>(null)
const activeItem = computed(() => dataSelectIndex.value === null ? null : props.items[dataSelectIndex.value] || null)

function replace(items: FlowTemplateItem[]) { emit('update:items', items) }
function addRow() {
  const label = newLabel.value.trim()
  if (!label) return
  replace([...props.items, { id: `info-${Date.now()}`, label, type: 'Input Type', options: [] }])
  newLabel.value = ''
  showNewRow.value = false
}
function saveEdit() {
  if (editingIndex.value === null) return
  const label = editingLabel.value.trim()
  if (!label) return
  replace(props.items.map((item, index) => index === editingIndex.value ? { ...item, label } : item))
  editingIndex.value = null
}
function updateType(index: number, type: FlowTemplateItem['type']) {
  replace(props.items.map((item, itemIndex) => itemIndex === index ? { ...item, type, options: type === 'Input Type' ? [] : item.options || [] } : item))
}
function saveOptions(options: string[]) {
  if (dataSelectIndex.value === null) return
  replace(props.items.map((item, index) => index === dataSelectIndex.value ? { ...item, options } : item))
  dataSelectIndex.value = null
}
</script>

<template>
  <div class="space-y-3">
    <button type="button" class="text-xs font-semibold text-[#ff9f43] hover:underline" @click="showNewRow = true">+ Add Information</button>
    <div class="overflow-x-auto rounded-lg border border-gray-100 dark:border-gray-800">
      <table class="w-full min-w-[620px] text-left text-xs">
        <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
          <tr v-for="(item, index) in items" :key="item.id || index">
            <td class="px-3 py-2.5 font-medium text-gray-800 dark:text-gray-200">
              <input v-if="editingIndex === index" v-model="editingLabel" class="h-9 w-full rounded-md border border-gray-200 px-3 text-sm dark:border-gray-700 dark:bg-gray-800" @keydown.enter.prevent="saveEdit" />
              <span v-else>{{ item.label }}</span>
            </td>
            <td class="w-16 px-2 py-2.5">
              <button v-if="editingIndex !== index" type="button" class="font-semibold text-[#ff9f43] hover:underline" @click="editingIndex = index; editingLabel = item.label">Edit</button>
              <button v-else type="button" class="font-semibold text-primary hover:underline" @click="saveEdit">Save</button>
            </td>
            <td class="w-16 px-2 py-2.5"><button type="button" class="font-semibold text-[#ff9f43] hover:underline" @click="replace(items.filter((_, itemIndex) => itemIndex !== index))">Delete</button></td>
            <td class="w-36 px-2 py-2.5">
              <select :value="item.type" class="h-9 w-full rounded-md border border-gray-200 bg-white px-2 text-sm dark:border-gray-700 dark:bg-gray-800" @change="updateType(index, ($event.target as HTMLSelectElement).value as FlowTemplateItem['type'])">
                <option>Input Type</option><option>Select Type</option>
              </select>
            </td>
            <td class="w-40 px-3 py-2.5">
              <button v-if="item.type === 'Select Type'" type="button" class="font-semibold text-[#ff9f43] hover:underline" @click="dataSelectIndex = index">{{ item.options?.length ? 'Edit Data Select' : 'Add Data Select' }}</button>
            </td>
          </tr>
          <tr v-if="showNewRow || items.length === 0">
            <td class="px-3 py-2.5"><input v-model="newLabel" placeholder="Information" class="h-9 w-full rounded-md border border-gray-200 px-3 text-sm dark:border-gray-700 dark:bg-gray-800" @keydown.enter.prevent="addRow" /></td>
            <td colspan="4" class="px-3 py-2.5"><div class="flex gap-3"><button type="button" class="font-semibold text-gray-500" @click="showNewRow = false; newLabel = ''">Cancel</button><button type="button" class="rounded-md bg-primary px-3 py-2 font-semibold text-white" @click="addRow">Save</button></div></td>
          </tr>
        </tbody>
      </table>
    </div>
    <FlowTemplateDataSelectModal :open="dataSelectIndex !== null" :information-label="activeItem?.label || ''" :options="activeItem?.options || []" @close="dataSelectIndex = null" @submit="saveOptions" />
  </div>
</template>
