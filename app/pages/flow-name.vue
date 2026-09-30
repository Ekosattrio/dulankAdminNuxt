<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <CommonPageHeader title="Flow Name" subtitle="Manage flow names and incentives">
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
            <span>Add Flow Name</span>
          </button>
        </div>
      </template>
    </CommonPageHeader>

    <!-- Table List Card -->
    <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="mb-5 flex flex-wrap items-center justify-between gap-4">
        <CommonSearchFilter v-model="searchQuery" placeholder="Search flow name or assignee..." />
        <div class="flex flex-wrap items-center gap-3">
          <CommonFilterSelect
            v-model="filterCategory"
            allLabel="All Categories"
            :options="[
              { value: 'Design', label: 'Design' },
              { value: 'Pracetak', label: 'Pracetak' },
              { value: 'Cetak', label: 'Cetak' },
              { value: 'Finishing', label: 'Finishing' },
            ]"
          />
          <CommonFilterSelect
            v-model="filterType"
            allLabel="All Types"
            :options="[
              { value: 'Inhouse', label: 'Inhouse' },
              { value: 'Outsource', label: 'Outsource' },
            ]"
          />
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-start text-xs text-gray-700 dark:text-gray-300">
          <thead
            class="bg-gray-50 text-[11px] font-semibold uppercase text-gray-500 border-b border-gray-200 dark:bg-gray-800/50 dark:border-gray-700 dark:text-gray-400"
          >
            <tr>
              <th class="px-4 py-3 text-start whitespace-nowrap">No</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Flow Category</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Flow Name</th>
              <th class="px-4 py-3 text-end whitespace-nowrap">Incentive Amount</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Unit Incentive</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Flow Assignee</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Flow Type</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Created Info</th>
              <th class="px-4 py-3 text-end whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <tr v-for="item in filteredList" :key="item.id" class="transition-colors hover:bg-gray-50/75 dark:hover:bg-gray-800/40">
              <td class="px-4 py-3 whitespace-nowrap font-bold text-primary">{{ item.code }}</td>
              <td class="px-4 py-3 whitespace-nowrap">
                <span class="inline-flex rounded-full border border-gray-200 bg-gray-50 px-2.5 py-0.5 text-[11px] text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">{{ item.category }}</span>
              </td>
              <td class="px-4 py-3 whitespace-nowrap font-bold text-gray-900 dark:text-gray-100">{{ item.name }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-end font-semibold">{{ formatNumber(item.incentive) }}</td>
              <td class="px-4 py-3 whitespace-nowrap">{{ item.unit }}</td>
              <td class="px-4 py-3 whitespace-nowrap">{{ item.assignees }}</td>
              <td class="px-4 py-3 whitespace-nowrap">
                <CommonStatusPill :status="item.flowType" :tone="item.flowType === 'Inhouse' ? 'emerald' : 'amber'" />
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-gray-500 dark:text-gray-400">{{ item.createdInfo }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-end">
                <CommonRowActions :item="item" @edit="openEditModal(item)" @delete="deleteItem(item.id)" />
              </td>
            </tr>
            <tr v-if="filteredList.length === 0">
              <td colspan="9" class="p-8 text-center text-gray-400">No flow names found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add / Edit Modal -->
    <CommonBaseModal v-model="modalVisible" :title="isEditing ? 'Edit Flow Name' : 'Add Flow Name'" maxWidth="md">
      <form @submit.prevent="saveItem" class="space-y-4">
        <CommonFormField label="Flow Category" required>
          <select
            v-model="formData.category"
            class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            required
          >
            <option value="Design">Design</option>
            <option value="Pracetak">Pracetak</option>
            <option value="Cetak">Cetak</option>
            <option value="Finishing">Finishing</option>
          </select>
        </CommonFormField>
        <CommonFormField label="Flow Name" required>
          <input
            v-model="formData.name"
            type="text"
            class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            placeholder="e.g. Cetak Multilith, Potong Sisir"
            required
          />
        </CommonFormField>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <CommonFormField label="Incentive (Rp)" required>
            <input
              v-model.number="formData.incentive"
              type="number"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              required
            />
          </CommonFormField>
          <CommonFormField label="Unit Incentive" required>
            <select
              v-model="formData.unit"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              required
            >
              <option value="Per Job">Per Job</option>
              <option value="Per Meter">Per Meter</option>
              <option value="Per Rim">Per Rim</option>
              <option value="Per Pcs">Per Pcs</option>
            </select>
          </CommonFormField>
        </div>
        <CommonFormField label="Flow Type">
          <select
            v-model="formData.flowType"
            class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          >
            <option value="Inhouse">Inhouse</option>
            <option value="Outsource">Outsource</option>
          </select>
        </CommonFormField>
        <CommonFormField label="Default Assignees">
          <input
            v-model="formData.assignees"
            type="text"
            class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            placeholder="e.g. Abdul, Nurdin"
          />
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
  title: 'Flow Name List - Kacetak System'
})

const { data: flowNameData } = await useFetch<FlowNameItem[]>('/api/flow-name')
const flowNames = ref<FlowNameItem[]>(flowNameData.value ?? [])
useMockSync('flow-name', flowNames)

const searchQuery = ref('')
const filterCategory = ref('')
const filterType = ref('')

const filteredList = computed(() => {
  return flowNames.value.filter(item => {
    const matchSearch =
      item.code.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.assignees.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchCat = filterCategory.value ? item.category === filterCategory.value : true
    const matchType = filterType.value ? item.flowType === filterType.value : true
    return matchSearch && matchCat && matchType
  })
})

function formatNumber(val: number): string {
  return new Intl.NumberFormat('id-ID').format(val)
}

const modalVisible = ref(false)
const isEditing = ref(false)
const formData = reactive({
  id: 0,
  category: 'Design',
  name: '',
  incentive: 0,
  unit: 'Per Job',
  flowType: 'Inhouse' as 'Inhouse' | 'Outsource',
  assignees: ''
})

function openAddModal() {
  isEditing.value = false
  formData.id = 0
  formData.category = 'Design'
  formData.name = ''
  formData.incentive = 0
  formData.unit = 'Per Job'
  formData.flowType = 'Inhouse'
  formData.assignees = ''
  modalVisible.value = true
}

function openEditModal(item: FlowNameItem) {
  isEditing.value = true
  formData.id = item.id
  formData.category = item.category
  formData.name = item.name
  formData.incentive = item.incentive
  formData.unit = item.unit
  formData.flowType = item.flowType
  formData.assignees = item.assignees
  modalVisible.value = true
}

function saveItem() {
  if (isEditing.value) {
    const idx = flowNames.value.findIndex(f => f.id === formData.id)
    if (idx !== -1) {
      flowNames.value[idx] = {
        ...flowNames.value[idx],
        category: formData.category,
        name: formData.name,
        incentive: formData.incentive,
        unit: formData.unit,
        flowType: formData.flowType,
        assignees: formData.assignees
      }
    }
  } else {
    flowNames.value.push({
      id: Date.now(),
      code: 'JBP-000' + (flowNames.value.length + 1),
      category: formData.category,
      name: formData.name,
      incentive: formData.incentive,
      unit: formData.unit,
      flowType: formData.flowType,
      assignees: formData.assignees,
      createdInfo: 'Admin, ' + new Date().toISOString().split('T')[0]
    })
  }
  modalVisible.value = false
}

function deleteItem(id: number) {
  if (confirm('Delete this flow name?')) {
    flowNames.value = flowNames.value.filter(f => f.id !== id)
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
  filterCategory.value = ''
  filterType.value = ''
}
</script>