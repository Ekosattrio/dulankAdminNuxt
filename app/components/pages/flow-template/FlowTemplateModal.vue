<script setup lang="ts">
import type { FlowTemplate, FlowTemplateFormData, FlowTemplateItem } from '#server/types/flow-template'
import FlowTemplateDataSelectModal from '~/components/pages/flow-template/FlowTemplateDataSelectModal.vue'
import SalesDialog from '~/components/sales/SalesDialog.vue'
import {
  formControlClass,
  modalFormInputColClass,
  modalFormLabelClass,
  modalFormRowClass,
} from '~/utils/salesUi'

const props = defineProps<{
  open: boolean
  record: FlowTemplate | null
  busy?: boolean
  error?: string
}>()

const emit = defineEmits<{
  close: []
  submit: [form: FlowTemplateFormData]
}>()

const defaultOptionsMap: Record<string, string[]> = {
  'Sisi Cetak': ['Depan', 'Bolak-balik'],
  'Ada Contoh': ['Ya', 'Tidak'],
  'Ada Contoh?': ['Ya', 'Tidak'],
  'Acc Warna': ['Ya', 'Tidak'],
  'Acc Warna?': ['Ya', 'Tidak'],
}

const templateName = ref('')
const items = ref<FlowTemplateItem[]>([])
const showNewRow = ref(false)
const newRowLabel = ref('')
const newRowInputRef = ref<HTMLInputElement | null>(null)

// Inline editing state for an existing row
const editingIndex = ref<number | null>(null)
const editingLabel = ref('')

// Sub-modal state for Add Data Select
const isDataSelectOpen = ref(false)
const activeDataSelectIndex = ref<number | null>(null)
const activeDataSelectLabel = computed(() => {
  if (activeDataSelectIndex.value === null || !items.value[activeDataSelectIndex.value]) return ''
  return items.value[activeDataSelectIndex.value].label
})
const activeDataSelectOptions = computed(() => {
  if (activeDataSelectIndex.value === null || !items.value[activeDataSelectIndex.value]) return []
  return items.value[activeDataSelectIndex.value].options || []
})

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      editingIndex.value = null
      editingLabel.value = ''
      newRowLabel.value = ''
      isDataSelectOpen.value = false
      activeDataSelectIndex.value = null

      if (props.record) {
        templateName.value = props.record.name || ''
        showNewRow.value = false

        if (props.record.items && props.record.items.length > 0) {
          items.value = props.record.items.map((i) => ({
            id: i.id || String(Math.random()),
            label: i.label,
            type: i.type,
            options: [...(i.options || [])],
          }))
        } else if (props.record.information) {
          items.value = props.record.information
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
            .map((lbl, idx) => {
              const hasDefault = Boolean(defaultOptionsMap[lbl])
              return {
                id: String(idx + 1),
                label: lbl,
                type: hasDefault ? 'Select Type' : 'Input Type',
                options: hasDefault ? [...defaultOptionsMap[lbl]] : [],
              }
            })
        } else {
          items.value = []
        }
      } else {
        templateName.value = 'SPK Heidelberg Sm52 4 Warna'
        items.value = []
        showNewRow.value = true
        nextTick(() => {
          newRowInputRef.value?.focus()
        })
      }
    }
  },
  { immediate: true },
)

function openNewRow() {
  showNewRow.value = true
  nextTick(() => {
    newRowInputRef.value?.focus()
  })
}

function cancelNewRow() {
  newRowLabel.value = ''
  // If no items, keep it visible like legacy default note visible
  if (items.value.length > 0) {
    showNewRow.value = false
  }
}

function saveNewRow() {
  const trimmed = newRowLabel.value.trim()
  if (!trimmed) {
    newRowInputRef.value?.focus()
    return
  }

  const hasDefault = Boolean(defaultOptionsMap[trimmed])
  items.value.push({
    id: String(Date.now() + Math.random()),
    label: trimmed,
    type: hasDefault ? 'Select Type' : 'Input Type',
    options: hasDefault ? [...defaultOptionsMap[trimmed]] : [],
  })

  newRowLabel.value = ''
  if (!props.record && items.value.length === 1) {
    // Keep row visible for adding more information smoothly
    nextTick(() => {
      newRowInputRef.value?.focus()
    })
  } else {
    showNewRow.value = false
  }
}

function startEditRow(index: number) {
  editingIndex.value = index
  editingLabel.value = items.value[index].label
}

function cancelEditRow() {
  editingIndex.value = null
  editingLabel.value = ''
}

function saveEditRow(index: number) {
  const trimmed = editingLabel.value.trim()
  if (trimmed) {
    items.value[index].label = trimmed
  }
  editingIndex.value = null
  editingLabel.value = ''
}

function removeRow(index: number) {
  items.value.splice(index, 1)
  if (items.value.length === 0) {
    showNewRow.value = true
  }
}

function handleTypeChange(index: number) {
  const item = items.value[index]
  if (item.type === 'Select Type' && (!item.options || item.options.length === 0)) {
    if (defaultOptionsMap[item.label]) {
      item.options = [...defaultOptionsMap[item.label]]
    } else {
      item.options = []
    }
  }
}

function openDataSelect(index: number) {
  activeDataSelectIndex.value = index
  isDataSelectOpen.value = true
}

function handleDataSelectSubmit(options: string[]) {
  if (activeDataSelectIndex.value !== null && items.value[activeDataSelectIndex.value]) {
    items.value[activeDataSelectIndex.value].options = options
  }
  isDataSelectOpen.value = false
  activeDataSelectIndex.value = null
}

function submit() {
  const name = templateName.value.trim()
  if (!name) return

  const information = items.value
    .map((i) => i.label.trim())
    .filter(Boolean)
    .join(', ')

  emit('submit', {
    id: props.record?.id,
    no: props.record?.no,
    name,
    information: information || 'Default',
    items: items.value,
  })
}
</script>

<template>
  <div>
    <SalesDialog
      :open="open"
      :title="record ? 'Edit Flow Template' : 'Add Flow Template'"
      :busy="busy"
      medium
      @close="$emit('close')"
    >
      <form class="space-y-4" @submit.prevent="submit">
        <!-- Subtitle matching legacy HTML -->
        <p class="text-xs text-gray-500 dark:text-gray-400">
          Add all Information you need in your flow Templete
        </p>

        <p v-if="error" role="alert" class="text-xs text-red-600 dark:text-red-400">
          {{ error }}
        </p>

        <fieldset :disabled="busy" class="space-y-4 text-xs disabled:opacity-60">
          <!-- Flow Template Name -->
          <div :class="modalFormRowClass">
            <label :class="modalFormLabelClass">Flow Templete Name</label>
            <div :class="modalFormInputColClass">
              <input
                v-model="templateName"
                type="text"
                required
                placeholder="SPK Heidelberg Sm52 4 Warna"
                :class="formControlClass"
              />
            </div>
          </div>

          <!-- Add Information Trigger -->
          <div>
            <button
              type="button"
              class="inline-flex items-center gap-1.5 text-xs font-semibold text-[#ff9f43] transition hover:underline"
              @click="openNewRow"
            >
              <span>+ Add Information</span>
            </button>
          </div>

          <!-- Information Table -->
          <div class="overflow-x-auto rounded-lg border border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-900">
            <table class="w-full text-left text-xs">
              <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                <!-- Existing Information Rows -->
                <tr
                  v-for="(item, idx) in items"
                  :key="item.id || idx"
                  class="transition hover:bg-gray-50/50 dark:hover:bg-gray-800/40"
                >
                  <!-- Label / Edit input -->
                  <td class="px-3 py-2.5 font-medium text-gray-800 dark:text-gray-200">
                    <div v-if="editingIndex === idx" class="flex items-center gap-2">
                      <input
                        v-model="editingLabel"
                        type="text"
                        class="h-7 w-full rounded border border-gray-200 bg-white px-2 text-xs outline-none focus:border-primary dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                        @keydown.enter.prevent="saveEditRow(idx)"
                      />
                      <button
                        type="button"
                        class="font-semibold text-primary hover:underline"
                        @click="saveEditRow(idx)"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        class="font-semibold text-gray-400 hover:underline"
                        @click="cancelEditRow"
                      >
                        Cancel
                      </button>
                    </div>
                    <span v-else>{{ item.label }}</span>
                  </td>

                  <!-- Edit Action Link -->
                  <td class="w-14 px-2 py-2.5">
                    <button
                      type="button"
                      class="font-semibold text-[#ff9f43] hover:underline"
                      @click="startEditRow(idx)"
                    >
                      Edit
                    </button>
                  </td>

                  <!-- Delete Action Link -->
                  <td class="w-16 px-2 py-2.5">
                    <button
                      type="button"
                      class="font-semibold text-[#ff9f43] hover:underline"
                      @click="removeRow(idx)"
                    >
                      Delete
                    </button>
                  </td>

                  <!-- Type Selector -->
                  <td class="w-32 px-2 py-2.5">
                    <select
                      v-model="item.type"
                      class="h-7 w-full rounded border border-gray-200 bg-white px-2 text-xs text-gray-700 outline-none focus:border-primary dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                      @change="handleTypeChange(idx)"
                    >
                      <option value="Input Type">Input Type</option>
                      <option value="Select Type">Select Type</option>
                    </select>
                  </td>

                  <!-- Data Select Trigger Action Cell -->
                  <td class="w-36 px-3 py-2.5 text-right sm:text-left">
                    <button
                      v-if="item.type === 'Select Type'"
                      type="button"
                      class="font-semibold transition hover:underline"
                      :class="
                        item.options && item.options.length > 0
                          ? 'text-gray-900 dark:text-gray-100'
                          : 'text-[#ff9f43]'
                      "
                      @click="openDataSelect(idx)"
                    >
                      {{ item.options && item.options.length > 0 ? 'Edit Data Select' : 'Add Data Select' }}
                    </button>
                  </td>
                </tr>

                <!-- Inline Add Information Row -->
                <tr v-if="showNewRow" class="bg-amber-50/20 dark:bg-amber-950/10">
                  <td class="px-3 py-2.5">
                    <input
                      ref="newRowInputRef"
                      v-model="newRowLabel"
                      type="text"
                      placeholder="Information"
                      class="h-7 w-full rounded border border-gray-200 bg-white px-2.5 text-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                      @keydown.enter.prevent="saveNewRow"
                    />
                  </td>
                  <td colspan="4" class="px-3 py-2.5">
                    <div class="flex items-center gap-3">
                      <button
                        type="button"
                        class="font-semibold text-[#ff9f43] hover:underline"
                        @click="cancelNewRow"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        class="rounded bg-primary px-3 py-1 text-xs font-semibold text-white shadow-sm transition hover:bg-primary-hover focus:outline-none"
                        @click="saveNewRow"
                      >
                        Save
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Modal Action Footer -->
          <div class="flex justify-end gap-2.5 border-t border-gray-200 pt-4 dark:border-gray-700">
            <button
              type="button"
              class="min-w-24 rounded-md bg-[#212b36] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#092c4c] focus:outline-none"
              @click="$emit('close')"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="min-w-24 rounded-md bg-[#ff9f43] px-5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#f39334] focus:outline-none"
            >
              {{ busy ? 'Saving...' : 'Submit' }}
            </button>
          </div>
        </fieldset>
      </form>
    </SalesDialog>

    <!-- Sub-modal Add Data Select -->
    <FlowTemplateDataSelectModal
      :open="isDataSelectOpen"
      :information-label="activeDataSelectLabel"
      :options="activeDataSelectOptions"
      @close="isDataSelectOpen = false"
      @submit="handleDataSelectSubmit"
    />
  </div>
</template>
