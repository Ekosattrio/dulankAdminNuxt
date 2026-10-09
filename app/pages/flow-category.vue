<<<<<<< HEAD
<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <CommonPageHeader title="Flow Category" subtitle="Manage master stages and manufacturing categories">
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
            <span>Add Flow Category</span>
          </button>
        </div>
      </template>
    </CommonPageHeader>

    <!-- Table List Card -->
    <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="mb-5">
        <CommonSearchFilter v-model="searchQuery" placeholder="Search category..." />
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-start text-xs text-gray-700 dark:text-gray-300">
          <thead
            class="bg-gray-50 text-[11px] font-semibold uppercase text-gray-500 border-b border-gray-200 dark:bg-gray-800/50 dark:border-gray-700 dark:text-gray-400"
          >
            <tr>
              <th class="px-4 py-3 text-start whitespace-nowrap">No</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Flow Process Category</th>
              <th class="px-4 py-3 text-center whitespace-nowrap">Used Count</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Created By</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Created Date</th>
              <th class="px-4 py-3 text-center whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <tr v-for="cat in filteredList" :key="cat.id" class="transition-colors hover:bg-gray-50/75 dark:hover:bg-gray-800/40">
              <td class="px-4 py-3 whitespace-nowrap font-bold text-primary">{{ cat.code }}</td>
              <td class="px-4 py-3 whitespace-nowrap font-bold text-gray-900 dark:text-gray-100">{{ cat.name }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-center">
                <span class="inline-flex rounded-full border border-gray-200 bg-gray-50 px-2.5 py-0.5 text-[11px] text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">{{ cat.usedCount }}</span>
              </td>
              <td class="px-4 py-3 whitespace-nowrap">{{ cat.createdBy }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-gray-500 dark:text-gray-400">{{ cat.createdDate }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-center">
                <CommonRowActions :item="cat" @edit="openEditModal(cat)" @delete="deleteCategory(cat.id)" />
              </td>
            </tr>
            <tr v-if="filteredList.length === 0">
              <td colspan="6" class="p-8 text-center text-gray-400">No flow categories found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add / Edit Modal -->
    <CommonBaseModal v-model="modalVisible" :title="isEditing ? 'Edit Flow Category' : 'Add Flow Category'" maxWidth="md">
      <form @submit.prevent="saveCategory" class="space-y-4">
        <CommonFormField label="Category Name" required>
          <input
            v-model="formData.name"
            type="text"
            class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            placeholder="e.g. Design, Pracetak, Cetak, Finishing"
            required
          />
        </CommonFormField>
        <CommonModalFooter :submit-label="isEditing ? 'Update Category' : 'Save Category'" @cancel="modalVisible = false" />
      </form>
    </CommonBaseModal>
  </div>
</template>

<script setup lang="ts">definePageMeta({
  layout: 'default'
})

useHead({
  title: 'Flow Category - Kacetak System'
})

const { data: flowCategoryData } = await useFetch<FlowCategory[]>('/api/flow-category')
const categories = ref<FlowCategory[]>(flowCategoryData.value ?? [])
useMockSync('flow-category', categories)

const searchQuery = ref('')

const filteredList = computed(() => {
  return categories.value.filter(c => {
    return (
      c.code.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      c.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  })
})

const modalVisible = ref(false)
const isEditing = ref(false)
const formData = reactive({
  id: 0,
  name: ''
})

function openAddModal() {
  isEditing.value = false
  formData.id = 0
  formData.name = ''
  modalVisible.value = true
}

function openEditModal(cat: FlowCategory) {
  isEditing.value = true
  formData.id = cat.id
  formData.name = cat.name
  modalVisible.value = true
}

function saveCategory() {
  if (isEditing.value) {
    const idx = categories.value.findIndex(c => c.id === formData.id)
    if (idx !== -1) {
      categories.value[idx].name = formData.name
    }
  } else {
    categories.value.push({
      id: Date.now(),
      code: 'PCC-00' + (categories.value.length + 1),
      name: formData.name,
      usedCount: 0,
      createdBy: 'Admin',
      createdDate: new Date().toISOString().replace('T', ' ').substring(0, 19)
    })
  }
  modalVisible.value = false
}

function deleteCategory(id: number) {
  if (confirm('Delete this flow category?')) {
    categories.value = categories.value.filter(c => c.id !== id)
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
import type { FlowCategory, FlowCategoryFormData } from '#server/types/flow-category'
import type { DateRangeValue } from '~/composables/useDateRange'
import FlowCategoryModal from '~/components/pages/flow-category/FlowCategoryModal.vue'
import FlowCategoryRecordsTable from '~/components/pages/flow-category/FlowCategoryRecordsTable.vue'
import SalesConfirmDelete from '~/components/sales/SalesConfirmDelete.vue'
import SalesFeedback from '~/components/sales/SalesFeedback.vue'
import SalesListHeader from '~/components/sales/SalesListHeader.vue'

useLegacyPage({ title: 'Flow Category', sweetAlert: false })

const searchQuery = ref('')
const filterCategory = ref('')
const filterDateRange = ref<DateRangeValue | null>(null)

const editingRecord = ref<FlowCategory | null>(null)
const isAddModalOpen = ref(false)
const deletingRecord = ref<FlowCategory | null>(null)
const busy = ref(false)
const actionError = ref('')

const filterParams = computed(() => ({
  search: searchQuery.value,
  category: filterCategory.value,
  startDate: filterDateRange.value?.start || '',
  endDate: filterDateRange.value?.end || '',
}))

const { flowCategories, pending, error, refresh, saveFlowCategory, deleteFlowCategory } = useFlowCategories(filterParams)

async function handleSubmit(form: FlowCategoryFormData) {
  busy.value = true
  actionError.value = ''
  try {
    await saveFlowCategory(form)
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
    await deleteFlowCategory(deletingRecord.value.id)
    deletingRecord.value = null
  } catch (err) {
    actionError.value = salesErrorMessage(err)
  } finally {
    busy.value = false
  }
}

function printTable() {
  printSalesRows(
    'Flow Category List',
    ['No', 'Flow Process', 'Used', 'Created By', 'Created Date'],
    flowCategories.value.map((item) => [
      item.no,
      item.name,
      String(item.used),
      item.createdBy,
      item.createdDate,
    ]),
  )
}
</script>

<template>
  <div class="dulank-page dulank-page-flow-category">
    <SalesListHeader
      title="Flow Category"
      subtitle="Manage your Flow Category"
      add-label="Add Flow Category"
      :refreshing="pending"
      @add="isAddModalOpen = true"
      @refresh="refresh()"
      @print="printTable"
    />

    <SalesFeedback
      :pending="pending"
      skeleton="table"
      :skeleton-cols="6"
      :skeleton-rows="6"
      :error="error ? 'Unable to load flow categories. Please try again.' : ''"
      @retry="refresh()"
    />

    <FlowCategoryRecordsTable
      v-if="!pending && !error"
      :flow-categories="flowCategories"
      :search-query="searchQuery"
      :filter-category="filterCategory"
      :filter-date-range="filterDateRange"
      @update:search-query="searchQuery = $event"
      @update:filter-category="filterCategory = $event"
      @update:filter-date-range="filterDateRange = $event"
      @edit="editingRecord = $event"
      @delete="deletingRecord = $event"
    />

    <!-- Add/Edit Modal -->
    <FlowCategoryModal
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
