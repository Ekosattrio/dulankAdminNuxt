<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <CommonPageHeader title="Discount Plan" subtitle="Manage your discount plans">
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
            <span>Add Discount Plan</span>
          </button>
        </div>
      </template>
    </CommonPageHeader>

    <!-- Table List Card -->
    <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <!-- Toolbar -->
      <div class="mb-5 flex flex-wrap items-center justify-between gap-4">
        <CommonSearchFilter v-model="searchQuery" placeholder="Search plan name..." />
        <div class="flex flex-wrap items-center gap-3">
          <CommonFilterSelect
            v-model="filterCustomer"
            allLabel="All Customer"
            :options="[
              { value: 'Members Only', label: 'Members Only' },
              { value: 'High-Spending Customers', label: 'High-Spending Customers' },
              { value: 'Online Customers', label: 'Online Customers' },
              { value: 'Students', label: 'Students' },
            ]"
          />
          <CommonFilterSelect
            v-model="filterStatus"
            allLabel="All Status"
            :options="[
              { value: 'Active', label: 'Active' },
              { value: 'Inactive', label: 'Inactive' },
            ]"
          />
        </div>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="w-full text-start text-xs text-gray-700 dark:text-gray-300">
          <thead
            class="bg-gray-50 text-[11px] font-semibold uppercase text-gray-500 border-b border-gray-200 dark:bg-gray-800/50 dark:border-gray-700 dark:text-gray-400"
          >
            <tr>
              <th class="px-4 py-3 text-start whitespace-nowrap">Plan Name</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Customers</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Status</th>
              <th class="px-4 py-3 text-end whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <tr v-for="item in filteredPlans" :key="item.id" class="transition-colors hover:bg-gray-50/75 dark:hover:bg-gray-800/40">
              <td class="px-4 py-3 whitespace-nowrap font-medium text-gray-900 dark:text-gray-100">{{ item.name }}</td>
              <td class="px-4 py-3 whitespace-nowrap">{{ item.customers }}</td>
              <td class="px-4 py-3 whitespace-nowrap">
                <CommonStatusPill :status="item.status" />
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-end">
                <CommonRowActions :item="item" @edit="openEditModal(item)" @delete="deleteItem(item.id)" />
              </td>
            </tr>
            <tr v-if="filteredPlans.length === 0">
              <td colspan="4" class="p-8 text-center text-gray-400">No discount plans found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add Discount Plan Modal -->
    <CommonBaseModal v-model="showAddModal" title="Add Discount Plan" maxWidth="md">
      <form @submit.prevent="savePlan" class="space-y-4">
        <CommonFormField label="Plan Name" required>
          <input
            v-model="formData.name"
            type="text"
            class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            required
            placeholder="e.g. Premium Plan"
          />
        </CommonFormField>
        <CommonFormField label="Customer" required>
          <div class="flex gap-2">
            <select
              v-model="formData.customers"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              required
            >
              <option value="">Select</option>
              <option v-for="c in customerOptions" :key="c" :value="c">{{ c }}</option>
            </select>
            <button
              type="button"
              class="shrink-0 rounded-lg border border-primary px-3 text-xs font-semibold text-primary transition hover:bg-primary hover:text-white"
              @click="showAddCustomerModal = true"
            >
              Create New
            </button>
          </div>
        </CommonFormField>
        <CommonToggleSwitch v-model="formData.isActive" label="Status Active" />
        <CommonModalFooter @cancel="closeModal" />
      </form>
    </CommonBaseModal>

    <!-- Edit Discount Plan Modal -->
    <CommonBaseModal v-model="showEditModal" title="Edit Discount Plan" maxWidth="md">
      <form @submit.prevent="updatePlan" class="space-y-4">
        <CommonFormField label="Plan Name" required>
          <input
            v-model="formData.name"
            type="text"
            class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            required
          />
        </CommonFormField>
        <CommonFormField label="Customer" required>
          <div class="flex gap-2">
            <select
              v-model="formData.customers"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              required
            >
              <option v-for="c in customerOptions" :key="c" :value="c">{{ c }}</option>
            </select>
            <button
              type="button"
              class="shrink-0 rounded-lg border border-primary px-3 text-xs font-semibold text-primary transition hover:bg-primary hover:text-white"
              @click="showAddCustomerModal = true"
            >
              Create New
            </button>
          </div>
        </CommonFormField>
        <CommonToggleSwitch v-model="formData.isActive" label="Status Active" />
        <CommonModalFooter @cancel="closeModal" />
      </form>
    </CommonBaseModal>

    <!-- Add Customer Sub-Modal -->
    <CommonBaseModal v-model="showAddCustomerModal" title="Add Customer" maxWidth="md">
      <form @submit.prevent="addNewCustomerOption" class="space-y-4">
        <CommonFormField label="Customer Tier / Name" required>
          <input
            v-model="newCustomerName"
            type="text"
            class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            required
            placeholder="e.g. VIP Gold Tier"
          />
        </CommonFormField>
        <CommonModalFooter @cancel="showAddCustomerModal = false" />
      </form>
    </CommonBaseModal>
  </div>
</template>

<script setup lang="ts">import { ref, computed } from 'vue'

useHead({
  title: 'Discount Plan - Kacetak System'
})

const customerOptions = ref([
  'All Customers',
  'Members Only',
  'High-Spending Customers',
  'Students',
  'Online Customers'
])

const { data: discountPlanData } = await useFetch<DiscountPlan[]>('/api/discount-plan')
const plans = ref<DiscountPlan[]>(discountPlanData.value ?? [])
useMockSync('discount-plan', plans)

const searchQuery = ref('')
const filterCustomer = ref('')
const filterStatus = ref('')

const filteredPlans = computed(() => {
  return plans.value.filter(item => {
    const matchSearch = searchQuery.value === '' || item.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchCustomer = !filterCustomer.value || item.customers === filterCustomer.value
    const matchStatus = !filterStatus.value || item.status === filterStatus.value
    return matchSearch && matchCustomer && matchStatus
  })
})

const showAddModal = ref(false)
const showEditModal = ref(false)
const showAddCustomerModal = ref(false)
const editingId = ref<number | null>(null)
const newCustomerName = ref('')

const defaultFormData = () => ({
  name: '',
  customers: 'All Customers',
  isActive: true
})

const formData = ref(defaultFormData())

const openAddModal = () => {
  formData.value = defaultFormData()
  showAddModal.value = true
}

const openEditModal = (item: DiscountPlan) => {
  editingId.value = item.id
  formData.value = {
    name: item.name,
    customers: item.customers,
    isActive: item.status === 'Active'
  }
  showEditModal.value = true
}

const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  editingId.value = null
}

const addNewCustomerOption = () => {
  if (newCustomerName.value.trim()) {
    if (!customerOptions.value.includes(newCustomerName.value.trim())) {
      customerOptions.value.push(newCustomerName.value.trim())
    }
    formData.value.customers = newCustomerName.value.trim()
    newCustomerName.value = ''
    showAddCustomerModal.value = false
  }
}

const savePlan = () => {
  const newId = Math.max(0, ...plans.value.map(p => p.id)) + 1
  plans.value.unshift({
    id: newId,
    name: formData.value.name,
    customers: formData.value.customers,
    status: formData.value.isActive ? 'Active' : 'Inactive'
  })
  closeModal()
}

const updatePlan = () => {
  if (editingId.value === null) return
  const idx = plans.value.findIndex(p => p.id === editingId.value)
  if (idx !== -1) {
    plans.value[idx] = {
      ...plans.value[idx],
      name: formData.value.name,
      customers: formData.value.customers,
      status: formData.value.isActive ? 'Active' : 'Inactive'
    }
  }
  closeModal()
}

const deleteItem = (id: number) => {
  if (confirm('Are you sure you want to delete this discount plan?')) {
    plans.value = plans.value.filter(p => p.id !== id)
  }
}

const exportPdf = () => {
  window.print()
}

const printTable = () => {
  window.print()
}

const refresh = () => {
  searchQuery.value = ''
  filterCustomer.value = ''
  filterStatus.value = ''
}

const toggleCollapse = () => {
  // collapsible header
}
</script>