<script setup lang="ts">
import type { ConfigurationColumn, ConfigurationField } from '../../../types/configuration'
import FeatherIcon from '~/components/Common/FeatherIcon.vue'
import SalesActionButton from '~/components/Sales/SalesActionButton.vue'
import SalesConfirmDelete from '~/components/Sales/SalesConfirmDelete.vue'
import SalesDataTable from '~/components/Sales/SalesDataTable.vue'
import { formatIDR } from '~/utils/currency'
import ConfigurationRecordModal from './ConfigurationRecordModal.vue'
import WorkflowSettingSubTable, { type WorkflowItem } from './WorkflowSettingSubTable.vue'

const props = withDefaults(defineProps<{
  modelValue: Record<string, any>[]
  title: string
  columns: ConfigurationColumn[]
  fields: ConfigurationField[]
  addLabel?: string
  readonly?: boolean
  busy?: boolean
  error?: string
  withWorkflow?: boolean
  workflowItems?: WorkflowItem[]
  workflowTitle?: string
  workflowTargetLabel?: string
}>(), {
  addLabel: 'Add Record',
  readonly: false,
  busy: false,
  error: '',
  withWorkflow: false,
})

const emit = defineEmits<{
  'update:modelValue': [rows: Record<string, any>[]]
  change: []
}>()

const editIndex = ref<number | null>(null)
const deleteIndex = ref<number | null>(null)
const modalOpen = ref(false)

const tableColumns = computed<ConfigurationColumn[]>(() => {
  if (props.readonly) return props.columns
  return [...props.columns, { key: 'actions', label: 'Action', align: 'center' }]
})

const fieldMap = computed(() => new Map(props.fields.map(field => [field.key, field])))

const displayRows = computed(() => props.modelValue.map((row, index) => {
  const formatted: Record<string, any> = { ...row, _index: index, _record: row }
  for (const column of props.columns) {
    const field = fieldMap.value.get(column.key)
    if (field?.type === 'currency') formatted[column.key] = formatIDR(row[column.key] || 0)
    if (field?.type === 'boolean') formatted[column.key] = row[column.key] ? 'Active' : 'Inactive'
  }
  return formatted
}))

const editingRecord = computed(() => editIndex.value === null ? null : props.modelValue[editIndex.value] || null)

function openAdd() {
  editIndex.value = null
  modalOpen.value = true
}

function openEdit(index: number) {
  editIndex.value = index
  modalOpen.value = true
}

function saveRecord(record: Record<string, any>) {
  const rows = props.modelValue.map(item => ({ ...item }))
  if (editIndex.value === null) {
    rows.unshift({ id: `${props.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`, ...record })
  } else {
    rows[editIndex.value] = { ...rows[editIndex.value], ...record }
  }
  emit('update:modelValue', rows)
  modalOpen.value = false
  nextTick(() => emit('change'))
}

function removeRecord() {
  if (deleteIndex.value === null) return
  emit('update:modelValue', props.modelValue.filter((_, index) => index !== deleteIndex.value))
  deleteIndex.value = null
  nextTick(() => emit('change'))
}
</script>

<template>
  <div class="space-y-6">
    <section class="min-w-0 space-y-3">
      <!-- Title & Add Button -->
      <div class="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h4 class="text-base font-bold text-gray-900 dark:text-white">{{ title }}</h4>
          <p class="text-xs text-gray-500">{{ modelValue.length }} configured items</p>
        </div>
        <button
          v-if="!readonly"
          type="button"
          class="inline-flex h-9 items-center gap-1.5 rounded-md bg-amber-500 px-3.5 text-xs font-semibold text-white shadow-sm hover:bg-amber-600 disabled:opacity-50"
          :disabled="busy"
          @click="openAdd"
        >
          <FeatherIcon name="plus" :size="14" />
          {{ addLabel }}
        </button>
      </div>

      <!-- Data Table -->
      <SalesDataTable
        :columns="tableColumns"
        :items="displayRows"
        :search-placeholder="`Search ${title.toLowerCase()}...`"
      >
        <template #cell(actions)="{ item }">
          <div class="flex justify-center gap-1">
            <SalesActionButton icon="edit-2" label="Edit item" @click="openEdit(item._index)" />
            <SalesActionButton icon="trash-2" label="Delete item" @click="deleteIndex = item._index" />
          </div>
        </template>
      </SalesDataTable>

      <ConfigurationRecordModal
        :open="modalOpen"
        :title="`${editingRecord ? 'Edit' : 'Add'} ${title}`"
        :fields="fields"
        :record="editingRecord"
        :busy="busy"
        :error="error"
        @close="modalOpen = false"
        @submit="saveRecord"
      />

      <SalesConfirmDelete
        :open="deleteIndex !== null"
        :busy="busy"
        :error="error"
        @close="deleteIndex = null"
        @confirm="removeRecord"
      />
    </section>

    <!-- Work Flow Setting Sub Table if enabled -->
    <WorkflowSettingSubTable
      v-if="withWorkflow"
      :title="workflowTitle || 'Work Flow Setting'"
      :items="workflowItems"
      :target-label="workflowTargetLabel || 'Effective Paper Group'"
      @save="$emit('change')"
    />
  </div>
</template>

