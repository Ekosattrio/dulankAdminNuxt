<<<<<<< HEAD
<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <CommonPageHeader title="Customer Type" subtitle="Manage customer classification tiers and membership levels">
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
            <span>Add Customer Type</span>
          </button>
        </div>
      </template>
    </CommonPageHeader>

    <!-- Table List Card -->
    <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <!-- Toolbar -->
      <div class="mb-5 flex flex-wrap items-center justify-between gap-4">
        <CommonSearchFilter v-model="searchQuery" placeholder="Search customer type..." />
        <CommonFilterSelect
          v-model="filterStatus"
          allLabel="All Statuses"
          :options="[
            { value: 'Active', label: 'Active' },
            { value: 'Inactive', label: 'Inactive' },
          ]"
        />
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="w-full text-start text-xs text-gray-700 dark:text-gray-300">
          <thead
            class="bg-gray-50 text-[11px] font-semibold uppercase text-gray-500 border-b border-gray-200 dark:bg-gray-800/50 dark:border-gray-700 dark:text-gray-400"
          >
            <tr>
              <th class="px-4 py-3 text-start whitespace-nowrap">Customer Type</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Status</th>
              <th class="px-4 py-3 text-center whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <tr v-for="t in filteredList" :key="t.id" class="transition-colors hover:bg-gray-50/75 dark:hover:bg-gray-800/40">
              <td class="px-4 py-3 whitespace-nowrap font-bold text-gray-900 dark:text-gray-100">{{ t.name }}</td>
              <td class="px-4 py-3 whitespace-nowrap">
                <CommonStatusPill :status="t.status" />
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-center">
                <CommonRowActions :item="t" @edit="openEditModal(t)" @delete="deleteType(t.id)" />
              </td>
            </tr>
            <tr v-if="filteredList.length === 0">
              <td colspan="3" class="p-8 text-center text-gray-400">No customer types found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add / Edit Modal -->
    <CommonBaseModal v-model="modalVisible" :title="isEditing ? 'Edit Customer Type' : 'Add Customer Type'" maxWidth="md">
      <form @submit.prevent="saveType" class="space-y-4">
        <CommonFormField label="Customer Type Name" required>
          <input
            v-model="formData.name"
            type="text"
            class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            placeholder="e.g. Standard, Corporate, Reseller"
            required
          />
        </CommonFormField>
        <CommonFormField label="Status">
          <select
            v-model="formData.status"
            class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </CommonFormField>
        <CommonModalFooter :submit-label="isEditing ? 'Update Type' : 'Save Type'" @cancel="modalVisible = false" />
      </form>
    </CommonBaseModal>
  </div>
</template>

<script setup lang="ts">definePageMeta({
  layout: 'default'
})

useHead({
  title: 'Customer Type - Kacetak System'
})

const { data: customerTypeData } = await useFetch<CustomerTypeItem[]>('/api/customer-type')
const customerTypes = ref<CustomerTypeItem[]>(customerTypeData.value ?? [])
useMockSync('customer-type', customerTypes)

const searchQuery = ref('')
const filterStatus = ref('')

const filteredList = computed(() => {
  return customerTypes.value.filter(t => {
    const matchSearch = t.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchStatus = filterStatus.value ? t.status === filterStatus.value : true
    return matchSearch && matchStatus
  })
})

const modalVisible = ref(false)
const isEditing = ref(false)
const formData = reactive({
  id: 0,
  name: '',
  status: 'Active' as 'Active' | 'Inactive'
})

function openAddModal() {
  isEditing.value = false
  formData.id = 0
  formData.name = ''
  formData.status = 'Active'
  modalVisible.value = true
}

function openEditModal(t: CustomerTypeItem) {
  isEditing.value = true
  formData.id = t.id
  formData.name = t.name
  formData.status = t.status
  modalVisible.value = true
}

function saveType() {
  if (isEditing.value) {
    const idx = customerTypes.value.findIndex(t => t.id === formData.id)
    if (idx !== -1) {
      customerTypes.value[idx].name = formData.name
      customerTypes.value[idx].status = formData.status
    }
  } else {
    customerTypes.value.push({
      id: Date.now(),
      name: formData.name,
      status: formData.status
    })
  }
  modalVisible.value = false
}

function deleteType(id: number) {
  if (confirm('Delete this customer type?')) {
    customerTypes.value = customerTypes.value.filter(t => t.id !== id)
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
  filterStatus.value = ''
}
</script>
=======
<script setup lang="ts">
import CustomerTypeWorkspace from '~/components/pages/customer-type/CustomerTypeWorkspace.vue'

useLegacyPage({ title: 'Customer Type', sweetAlert: false })
</script>

<template>
  <div class="dulank-page dulank-page-customer-type">
    <CustomerTypeWorkspace />
  </div>
</template>
>>>>>>> origin/eko
