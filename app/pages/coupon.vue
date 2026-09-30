<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <CommonPageHeader title="Coupons" subtitle="Manage promotional coupon codes, redemptions, and limits">
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
            <span>Add New Coupons</span>
          </button>
        </div>
      </template>
    </CommonPageHeader>

    <!-- Table List Card -->
    <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <!-- Toolbar -->
      <div class="mb-5 flex flex-wrap items-center justify-between gap-4">
        <CommonSearchFilter v-model="searchQuery" placeholder="Search coupon name or code..." />
        <div class="flex flex-wrap items-center gap-3">
          <CommonFilterSelect
            v-model="filterType"
            allLabel="All Types"
            :options="[
              { value: 'Fixed', label: 'Fixed Amount' },
              { value: 'Percentage', label: 'Percentage' },
            ]"
          />
          <CommonFilterSelect
            v-model="filterStatus"
            allLabel="All Statuses"
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
              <th class="px-4 py-3 text-start whitespace-nowrap">Code</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Type</th>
              <th class="px-4 py-3 text-end whitespace-nowrap">Discount</th>
              <th class="px-4 py-3 text-center whitespace-nowrap">Usage Limit</th>
              <th class="px-4 py-3 text-center whitespace-nowrap">Used</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Valid Until</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Status</th>
              <th class="px-4 py-3 text-center whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <tr v-for="c in filteredCoupons" :key="c.id" class="transition-colors hover:bg-gray-50/75 dark:hover:bg-gray-800/40">
              <td class="px-4 py-3 whitespace-nowrap font-bold text-gray-900 dark:text-gray-100">{{ c.name }}</td>
              <td class="px-4 py-3 whitespace-nowrap">
                <span class="inline-flex rounded-md border border-sky-200 bg-sky-50 px-2 py-0.5 font-mono text-[11px] text-sky-700 dark:border-sky-900 dark:bg-sky-950 dark:text-sky-300">{{ c.code }}</span>
              </td>
              <td class="px-4 py-3 whitespace-nowrap">
                <span class="inline-flex rounded-full border border-gray-200 bg-gray-50 px-2.5 py-0.5 text-[11px] text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">{{ c.type }}</span>
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-end font-semibold text-primary">
                {{ c.type === 'Percentage' ? c.discount + '%' : 'Rp ' + formatNumber(c.discount) }}
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-center">{{ c.limit }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-center">{{ c.used }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-gray-500 dark:text-gray-400">{{ c.valid }}</td>
              <td class="px-4 py-3 whitespace-nowrap">
                <CommonStatusPill :status="c.status" />
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-center">
                <CommonRowActions :item="c" @edit="openEditModal(c)" @delete="deleteCoupon(c.id)" />
              </td>
            </tr>
            <tr v-if="filteredCoupons.length === 0">
              <td colspan="9" class="p-8 text-center text-gray-400">No coupons found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add / Edit Modal -->
    <CommonBaseModal v-model="modalVisible" :title="isEditing ? 'Edit Coupon' : 'Add New Coupon'" maxWidth="md">
      <form @submit.prevent="saveCoupon" class="space-y-4">
        <CommonFormField label="Coupon Name" required>
          <input
            v-model="formData.name"
            type="text"
            class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            placeholder="e.g. Year End Special"
            required
          />
        </CommonFormField>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <CommonFormField label="Coupon Code" required>
            <input
              v-model="formData.code"
              type="text"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm uppercase text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              placeholder="e.g. DISKONSALE"
              required
            />
          </CommonFormField>
          <CommonFormField label="Type">
            <select
              v-model="formData.type"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            >
              <option value="Fixed">Fixed (Rp)</option>
              <option value="Percentage">Percentage (%)</option>
            </select>
          </CommonFormField>
        </div>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <CommonFormField label="Discount Value" required>
            <input
              v-model.number="formData.discount"
              type="number"
              min="0"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              required
            />
          </CommonFormField>
          <CommonFormField label="Usage Limit">
            <input
              v-model.number="formData.limit"
              type="number"
              min="1"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            />
          </CommonFormField>
        </div>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <CommonFormField label="Valid Until">
            <input
              v-model="formData.valid"
              type="text"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              placeholder="DD/MM/YYYY"
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
        </div>
        <CommonModalFooter :submit-label="isEditing ? 'Update Coupon' : 'Save Coupon'" @cancel="modalVisible = false" />
      </form>
    </CommonBaseModal>
  </div>
</template>

<script setup lang="ts">definePageMeta({
  layout: 'default'
})

useHead({
  title: 'Coupons - Kacetak System'
})

const { data: couponData } = await useFetch<CouponItem[]>('/api/coupon')
const coupons = ref<CouponItem[]>(couponData.value ?? [])
useMockSync('coupon', coupons)

const searchQuery = ref('')
const filterType = ref('')
const filterStatus = ref('')

const filteredCoupons = computed(() => {
  return coupons.value.filter(c => {
    const matchSearch =
      c.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      c.code.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchType = filterType.value ? c.type === filterType.value : true
    const matchStat = filterStatus.value ? c.status === filterStatus.value : true
    return matchSearch && matchType && matchStat
  })
})

function formatNumber(val: number): string {
  return new Intl.NumberFormat('id-ID').format(val)
}

const modalVisible = ref(false)
const isEditing = ref(false)
const formData = reactive({
  id: 0,
  name: '',
  code: '',
  type: 'Fixed' as 'Fixed' | 'Percentage',
  discount: 0,
  limit: 50,
  valid: '31/12/2026',
  status: 'Active' as 'Active' | 'Inactive'
})

function openAddModal() {
  isEditing.value = false
  formData.id = 0
  formData.name = ''
  formData.code = ''
  formData.type = 'Fixed'
  formData.discount = 0
  formData.limit = 50
  formData.valid = '31/12/2026'
  formData.status = 'Active'
  modalVisible.value = true
}

function openEditModal(c: CouponItem) {
  isEditing.value = true
  formData.id = c.id
  formData.name = c.name
  formData.code = c.code
  formData.type = c.type
  formData.discount = c.discount
  formData.limit = c.limit
  formData.valid = c.valid
  formData.status = c.status
  modalVisible.value = true
}

function saveCoupon() {
  if (isEditing.value) {
    const idx = coupons.value.findIndex(c => c.id === formData.id)
    if (idx !== -1) {
      coupons.value[idx] = {
        ...coupons.value[idx],
        name: formData.name,
        code: formData.code,
        type: formData.type,
        discount: formData.discount,
        limit: formData.limit,
        valid: formData.valid,
        status: formData.status
      }
    }
  } else {
    coupons.value.unshift({
      id: Date.now(),
      name: formData.name,
      code: formData.code.toUpperCase(),
      type: formData.type,
      discount: formData.discount,
      limit: formData.limit,
      used: 0,
      valid: formData.valid,
      status: formData.status
    })
  }
  modalVisible.value = false
}

function deleteCoupon(id: number) {
  if (confirm('Delete this coupon?')) {
    coupons.value = coupons.value.filter(c => c.id !== id)
  }
}

function exportPdf() {
  alert('Exporting Coupons PDF...')
}

function printTable() {
  window.print()
}

function refresh() {
  searchQuery.value = ''
  filterType.value = ''
  filterStatus.value = ''
}
</script>