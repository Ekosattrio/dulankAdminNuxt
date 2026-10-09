<<<<<<< HEAD
<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <CommonPageHeader title="Flow Template" subtitle="Manage flow templates and checklist parameters">
      <template #actions>
        <div class="flex flex-wrap items-center gap-2">
          <button
            type="button"
            class="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 hover:text-primary dark:border-gray-700 dark:hover:bg-gray-800"
            title="Export PDF"
            @click="exportPdf"
          >
            <CommonFeatherIcon name="file-text" size="18" />
          </button>
          <button
            type="button"
            class="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 hover:text-primary dark:border-gray-700 dark:hover:bg-gray-800"
            title="Print"
            @click="printTable"
          >
            <CommonFeatherIcon name="printer" size="18" />
          </button>
          <button
            type="button"
            class="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 hover:text-primary dark:border-gray-700 dark:hover:bg-gray-800"
            title="Refresh"
            @click="refresh"
          >
            <CommonFeatherIcon name="rotate-ccw" size="18" />
          </button>
          <button
            type="button"
            class="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-600 focus:outline-none"
            @click="openAddModal"
          >
            <CommonFeatherIcon name="plus" size="18" />
            <span>Add Flow Template</span>
          </button>
        </div>
      </template>
    </CommonPageHeader>

    <!-- Table List Card -->
    <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="mb-5">
        <CommonSearchFilter v-model="searchQuery" placeholder="Search template name or parameter..." />
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-start text-xs text-gray-700 dark:text-gray-300">
          <thead
            class="bg-gray-50 text-[11px] font-semibold uppercase text-gray-500 border-b border-gray-200 dark:bg-gray-800/50 dark:border-gray-700 dark:text-gray-400"
          >
            <tr>
              <th class="px-4 py-3 text-start whitespace-nowrap">No</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Flow Template Name</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Required Information / Checklist Parameters</th>
              <th class="px-4 py-3 text-end whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <tr v-for="t in filteredList" :key="t.id" class="transition-colors hover:bg-gray-50/75 dark:hover:bg-gray-800/40">
              <td class="px-4 py-3 whitespace-nowrap font-bold text-primary">{{ t.code }}</td>
              <td class="px-4 py-3 whitespace-nowrap font-bold text-gray-900 dark:text-gray-100">{{ t.name }}</td>
              <td class="px-4 py-3">
                <span
                  v-for="(info, i) in t.information.split(', ')"
                  :key="i"
                  class="mb-1 me-1 inline-flex rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-[11px] text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                >
                  {{ info }}
                </span>
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-end">
                <CommonRowActions :item="t" @edit="openEditModal(t)" @delete="deleteTemplate(t.id)" />
              </td>
            </tr>
            <tr v-if="filteredList.length === 0">
              <td colspan="4" class="p-8 text-center text-gray-400">No flow templates found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add / Edit Modal -->
    <CommonBaseModal v-model="modalVisible" :title="isEditing ? 'Edit Flow Template' : 'Add Flow Template'" maxWidth="md">
      <form @submit.prevent="saveTemplate" class="space-y-4">
        <CommonFormField label="Flow Template Name" required>
          <input
            v-model="formData.name"
            type="text"
            class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            placeholder="e.g. SPK Heidelberg SM52 4 Warna"
            required
          />
        </CommonFormField>
        <CommonFormField label="Required Parameters (Comma-separated)" required>
          <textarea
            v-model="formData.information"
            rows="3"
            class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            placeholder="Project Name, Kertas, Sisi Cetak, Panjang Kertas, Lebar Kertas, Jumlah Plat, etc."
            required
          ></textarea>
        </CommonFormField>
        <CommonModalFooter :submit-label="isEditing ? 'Update' : 'Submit'" @cancel="modalVisible = false" />
      </form>
    </CommonBaseModal>
  </div>
</template>

<script setup lang="ts">definePageMeta({
  layout: 'default'
})

useHead({
  title: 'Flow Template - Kacetak System'
})

const { data: flowTemplateData } = await useFetch<FlowTemplateItem[]>('/api/flow-template')
const templates = ref<FlowTemplateItem[]>(flowTemplateData.value ?? [])
useMockSync('flow-template', templates)

const searchQuery = ref('')

const filteredList = computed(() => {
  return templates.value.filter(t => {
    return (
      t.code.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      t.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      t.information.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  })
})

const modalVisible = ref(false)
const isEditing = ref(false)
const formData = reactive({
  id: 0,
  name: '',
  information: ''
})

function openAddModal() {
  isEditing.value = false
  formData.id = 0
  formData.name = ''
  formData.information = ''
  modalVisible.value = true
}

function openEditModal(t: FlowTemplateItem) {
  isEditing.value = true
  formData.id = t.id
  formData.name = t.name
  formData.information = t.information
  modalVisible.value = true
}

function saveTemplate() {
  if (isEditing.value) {
    const idx = templates.value.findIndex(t => t.id === formData.id)
    if (idx !== -1) {
      templates.value[idx].name = formData.name
      templates.value[idx].information = formData.information
    }
  } else {
    templates.value.push({
      id: Date.now(),
      code: 'FT-000' + (templates.value.length + 1),
      name: formData.name,
      information: formData.information
    })
  }
  modalVisible.value = false
}

function deleteTemplate(id: number) {
  if (confirm('Delete this flow template?')) {
    templates.value = templates.value.filter(t => t.id !== id)
  }
}

function exportPdf() {
  alert('Exporting PDF...')
}

function printTable() {
  window.print()
}

function refresh() {
  searchQuery.value = ''
}
</script>
=======
<script setup lang="ts">
import type { FlowTemplate, FlowTemplateFormData } from '#server/types/flow-template'
import type { DateRangeValue } from '~/composables/useDateRange'
import FlowTemplateModal from '~/components/pages/flow-template/FlowTemplateModal.vue'
import FlowTemplateRecordsTable from '~/components/pages/flow-template/FlowTemplateRecordsTable.vue'
import SalesConfirmDelete from '~/components/sales/SalesConfirmDelete.vue'
import SalesFeedback from '~/components/sales/SalesFeedback.vue'
import SalesListHeader from '~/components/sales/SalesListHeader.vue'

useLegacyPage({ title: 'Flow Template', sweetAlert: false })

const searchQuery = ref('')
const filterTemplate = ref('')
const filterDateRange = ref<DateRangeValue | null>(null)
const editingRecord = ref<FlowTemplate | null>(null)
const isAddModalOpen = ref(false)
const deletingRecord = ref<FlowTemplate | null>(null)
const busy = ref(false)
const actionError = ref('')

const filterParams = computed(() => ({
  search: searchQuery.value,
  template: filterTemplate.value,
  startDate: filterDateRange.value?.start || '',
  endDate: filterDateRange.value?.end || '',
}))

const { flowTemplates, pending, error, refresh, saveFlowTemplate, deleteFlowTemplate } = useFlowTemplates(filterParams)

async function handleSubmit(form: FlowTemplateFormData) {
  busy.value = true
  actionError.value = ''
  try {
    await saveFlowTemplate(form)
    isAddModalOpen.value = false
    editingRecord.value = null
  } catch (err) {
    actionError.value = salesErrorMessage(err)
  } finally {
    busy.value = false
  }
}

async function handleConfirmDelete() {
  if (!deletingRecord.value) return
  busy.value = true
  actionError.value = ''
  try {
    await deleteFlowTemplate(deletingRecord.value.id)
    deletingRecord.value = null
  } catch (err) {
    actionError.value = salesErrorMessage(err)
  } finally {
    busy.value = false
  }
}

function printTable() {
  printSalesRows(
    'Flow Template List',
    ['No', 'Flow Template', 'Information'],
    flowTemplates.value.map((item) => [
      item.no,
      item.name,
      item.information,
    ]),
  )
}
</script>

<template>
  <div class="dulank-page dulank-page-flow-template">
    <SalesListHeader
      title="Flow Template"
      subtitle="Manage your Flow Template"
      add-label="Add Flow Template"
      :refreshing="pending"
      @add="isAddModalOpen = true"
      @refresh="refresh()"
      @print="printTable"
    />

    <SalesFeedback
      :pending="pending"
      skeleton="table"
      :skeleton-cols="4"
      :skeleton-rows="6"
      :error="error ? 'Unable to load flow templates. Please try again.' : ''"
      @retry="refresh()"
    />

    <FlowTemplateRecordsTable
      v-if="!pending && !error"
      :flow-templates="flowTemplates"
      :search-query="searchQuery"
      :filter-template="filterTemplate"
      :filter-date-range="filterDateRange"
      @update:search-query="searchQuery = $event"
      @update:filter-template="filterTemplate = $event"
      @update:filter-date-range="filterDateRange = $event"
      @edit="editingRecord = $event"
      @delete="deletingRecord = $event"
    />

    <!-- Add/Edit Modal -->
    <FlowTemplateModal
      :open="isAddModalOpen || !!editingRecord"
      :record="editingRecord"
      :busy="busy"
      :error="actionError"
      @close="() => { isAddModalOpen = false; editingRecord = null; actionError = '' }"
      @submit="handleSubmit"
    />

    <!-- Delete Confirmation Modal -->
    <SalesConfirmDelete
      :open="!!deletingRecord"
      :busy="busy"
      :error="actionError"
      @close="deletingRecord = null"
      @confirm="handleConfirmDelete"
    />
  </div>
</template>
>>>>>>> origin/eko
