<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <CommonPageHeader title="Discount" subtitle="Manage your discount">
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
            <span>Add Discount</span>
          </button>
        </div>
      </template>
    </CommonPageHeader>

    <!-- Table List Card -->
    <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <!-- Toolbar -->
      <div class="mb-5 flex flex-wrap items-center justify-between gap-4">
        <CommonSearchFilter v-model="searchQuery" placeholder="Search discount name..." />
        <div class="flex flex-wrap items-center gap-3">
          <CommonFilterSelect
            v-model="filterPlan"
            allLabel="All Plans"
            :options="[
              { value: 'Standard', label: 'Standard' },
              { value: 'Membership', label: 'Membership' },
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
              <th class="px-4 py-3 text-start whitespace-nowrap">Name</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Value</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Discount Plan</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Validity</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Days</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Products</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Used</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Status</th>
              <th class="px-4 py-3 text-end whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <tr v-for="item in filteredDiscounts" :key="item.id" class="transition-colors hover:bg-gray-50/75 dark:hover:bg-gray-800/40">
              <td class="px-4 py-3 whitespace-nowrap font-medium text-gray-900 dark:text-gray-100">{{ item.name }}</td>
              <td class="px-4 py-3 whitespace-nowrap">{{ item.valueText }}</td>
              <td class="px-4 py-3 whitespace-nowrap">{{ item.plan }}</td>
              <td class="px-4 py-3 whitespace-nowrap">{{ item.validity }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-gray-500 dark:text-gray-400">{{ item.days.join(', ') }}</td>
              <td class="px-4 py-3 whitespace-nowrap">{{ item.products }}</td>
              <td class="px-4 py-3 whitespace-nowrap">{{ item.used }}</td>
              <td class="px-4 py-3 whitespace-nowrap">
                <CommonStatusPill :status="item.status" />
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-end">
                <CommonRowActions :item="item" @edit="openEditModal(item)" @delete="deleteItem(item.id)" />
              </td>
            </tr>
            <tr v-if="filteredDiscounts.length === 0">
              <td colspan="9" class="p-8 text-center text-gray-400">No discounts found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add Discount Modal -->
    <CommonBaseModal v-model="showAddModal" title="Add Discount" maxWidth="lg">
      <form @submit.prevent="saveDiscount" class="space-y-4">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <CommonFormField label="Discount Name" required>
            <input
              v-model="formData.name"
              type="text"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              required
              placeholder="e.g. Weekend Deal"
            />
          </CommonFormField>
          <CommonFormField label="Discount Plan" required>
            <select
              v-model="formData.plan"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              required
            >
              <option value="">Select</option>
              <option value="Standard">Standard</option>
              <option value="Membership">Membership</option>
            </select>
          </CommonFormField>
          <CommonFormField label="Applicable For" required>
            <select
              v-model="formData.products"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              required
            >
              <option value="All Products">All Products</option>
              <option value="Specific Products">Specific Products</option>
            </select>
          </CommonFormField>
        </div>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <CommonFormField label="Valid From" required>
            <input
              v-model="formData.validFrom"
              type="date"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              required
            />
          </CommonFormField>
          <CommonFormField label="Valid Till" required>
            <input
              v-model="formData.validTill"
              type="date"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              required
            />
          </CommonFormField>
          <CommonFormField label="Discount Type" required>
            <div class="flex gap-2">
              <select
                v-model="formData.type"
                class="w-32 h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              >
                <option value="Percentage">Percentage</option>
                <option value="Flat">Flat</option>
              </select>
              <input
                v-model.number="formData.value"
                type="number"
                class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                placeholder="Value"
                required
                min="1"
              />
            </div>
          </CommonFormField>
        </div>
        <CommonFormField label="Valid on Following Days" required>
          <div class="flex flex-wrap gap-2">
            <label
              v-for="day in daysOfWeek"
              :key="day"
              class="flex cursor-pointer items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <input v-model="formData.days" type="checkbox" :value="day" class="h-3.5 w-3.5 accent-primary" />
              {{ day }}
            </label>
          </div>
        </CommonFormField>
        <CommonModalFooter @cancel="closeModal" />
      </form>
    </CommonBaseModal>

    <!-- Edit Discount Modal -->
    <CommonBaseModal v-model="showEditModal" title="Edit Discount" maxWidth="lg">
      <form @submit.prevent="updateDiscount" class="space-y-4">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <CommonFormField label="Discount Name" required>
            <input
              v-model="formData.name"
              type="text"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              required
            />
          </CommonFormField>
          <CommonFormField label="Discount Plan" required>
            <select
              v-model="formData.plan"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              required
            >
              <option value="Standard">Standard</option>
              <option value="Membership">Membership</option>
            </select>
          </CommonFormField>
          <CommonFormField label="Applicable For" required>
            <select
              v-model="formData.products"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              required
            >
              <option value="All Products">All Products</option>
              <option value="Specific Products">Specific Products</option>
            </select>
          </CommonFormField>
        </div>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <CommonFormField label="Valid From" required>
            <input
              v-model="formData.validFrom"
              type="text"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              required
            />
          </CommonFormField>
          <CommonFormField label="Valid Till" required>
            <input
              v-model="formData.validTill"
              type="text"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              required
            />
          </CommonFormField>
          <CommonFormField label="Discount Type" required>
            <div class="flex gap-2">
              <select
                v-model="formData.type"
                class="w-32 h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              >
                <option value="Percentage">Percentage</option>
                <option value="Flat">Flat</option>
              </select>
              <input
                v-model.number="formData.value"
                type="number"
                class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                required
                min="1"
              />
            </div>
          </CommonFormField>
        </div>
        <CommonFormField label="Valid on Following Days" required>
          <div class="flex flex-wrap gap-2">
            <label
              v-for="day in daysOfWeek"
              :key="day"
              class="flex cursor-pointer items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <input v-model="formData.days" type="checkbox" :value="day" class="h-3.5 w-3.5 accent-primary" />
              {{ day }}
            </label>
          </div>
        </CommonFormField>
        <CommonModalFooter @cancel="closeModal" />
      </form>
    </CommonBaseModal>
  </div>
</template>

<script setup lang="ts">import { ref, computed } from 'vue'

useHead({
  title: 'Discount - Kacetak System'
})

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const { data: discountData } = await useFetch<DiscountItem[]>('/api/discount')
const discounts = ref<DiscountItem[]>(discountData.value ?? [])
useMockSync('discount', discounts)

const searchQuery = ref('')
const filterPlan = ref('')
const filterStatus = ref('')

const filteredDiscounts = computed(() => {
  return discounts.value.filter(item => {
    const matchSearch = searchQuery.value === '' || item.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchPlan = !filterPlan.value || item.plan === filterPlan.value
    const matchStatus = !filterStatus.value || item.status === filterStatus.value
    return matchSearch && matchPlan && matchStatus
  })
})

const showAddModal = ref(false)
const showEditModal = ref(false)
const editingId = ref<number | null>(null)

const defaultFormData = () => ({
  name: '',
  plan: 'Standard',
  products: 'All Products',
  validFrom: '',
  validTill: '',
  type: 'Percentage' as 'Percentage' | 'Flat',
  value: 10,
  days: ['Monday'] as string[],
  isActive: true
})

const formData = ref(defaultFormData())

const openAddModal = () => {
  formData.value = defaultFormData()
  showAddModal.value = true
}

const openEditModal = (item: DiscountItem) => {
  editingId.value = item.id
  formData.value = {
    name: item.name,
    plan: item.plan,
    products: item.products,
    validFrom: item.validFrom,
    validTill: item.validTill,
    type: item.type,
    value: item.value,
    days: item.days.length ? item.days : ['Monday'],
    isActive: item.status === 'Active'
  }
  showEditModal.value = true
}

const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  editingId.value = null
}

const saveDiscount = () => {
  const newId = Math.max(0, ...discounts.value.map(d => d.id)) + 1
  discounts.value.unshift({
    id: newId,
    name: formData.value.name,
    value: formData.value.value,
    type: formData.value.type,
    valueText: `${formData.value.value} (${formData.value.type})`,
    plan: formData.value.plan,
    validity: `${formData.value.validFrom} - ${formData.value.validTill}`,
    validFrom: formData.value.validFrom,
    validTill: formData.value.validTill,
    days: [...formData.value.days],
    products: formData.value.products,
    used: 0,
    status: formData.value.isActive ? 'Active' : 'Inactive'
  })
  closeModal()
}

const updateDiscount = () => {
  if (editingId.value === null) return
  const idx = discounts.value.findIndex(d => d.id === editingId.value)
  if (idx !== -1) {
    discounts.value[idx] = {
      ...discounts.value[idx],
      name: formData.value.name,
      value: formData.value.value,
      type: formData.value.type,
      valueText: `${formData.value.value} (${formData.value.type})`,
      plan: formData.value.plan,
      validity: `${formData.value.validFrom} - ${formData.value.validTill}`,
      validFrom: formData.value.validFrom,
      validTill: formData.value.validTill,
      days: [...formData.value.days],
      products: formData.value.products,
      status: formData.value.isActive ? 'Active' : 'Inactive'
    }
  }
  closeModal()
}

const deleteItem = (id: number) => {
  if (confirm('Are you sure you want to delete this discount?')) {
    discounts.value = discounts.value.filter(d => d.id !== id)
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
  filterPlan.value = ''
  filterStatus.value = ''
}

const toggleCollapse = () => {
  // collapsible header trigger
}</script>