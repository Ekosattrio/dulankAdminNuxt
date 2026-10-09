<template>
<<<<<<< HEAD
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
=======
  <div class="page-wrapper mt-3">
    <div class="content">
      <div class="page-header">
        <div class="add-item d-flex">
          <div class="page-title">
            <h4>Coupons</h4>
            <h6>Manage promotional coupon codes, redemptions, and limits</h6>
          </div>
        </div>
        <ul class="table-top-head">
          <li>
            <a title="Pdf" href="javascript:void(0);" @click="exportPdf"><img src="/assets/img/icons/pdf.svg" alt="img" /></a>
          </li>
          <li>
            <a title="Print" href="javascript:void(0);" @click="printTable"><i class="ti ti-printer"></i></a>
          </li>
          <li>
            <a title="Refresh" href="javascript:void(0);" @click="refresh"><i class="ti ti-rotate"></i></a>
          </li>
        </ul>
        <div class="page-btn">
          <button type="button" class="btn btn-primary" @click="openAddModal">
            <i class="ti ti-circle-plus me-1"></i>Add New Coupons
          </button>
        </div>
      </div>

      <!-- Table List Card -->
      <div class="card table-list-card">
        <div class="card-body">
          <div class="table-top d-flex align-items-center justify-content-between flex-wrap gap-3 mb-3">
            <div class="search-set d-flex align-items-center gap-2 flex-wrap">
              <div class="search-input">
                <span class="btn-searchset"><i class="ti ti-search"></i></span>
                <input v-model="searchQuery" type="text" class="form-control" placeholder="Search coupon name or code..." />
              </div>
            </div>
            <div class="d-flex align-items-center gap-2">
              <select v-model="filterType" class="form-select form-select-sm" style="width: auto;">
                <option value="">All Types</option>
                <option value="Fixed">Fixed Amount</option>
                <option value="Percentage">Percentage</option>
              </select>
              <select v-model="filterStatus" class="form-select form-select-sm" style="width: auto;">
                <option value="">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div class="table-responsive">
            <table class="table datanew">
              <thead class="thead-light">
                <tr>
                  <th>Name</th>
                  <th>Code</th>
                  <th>Type</th>
                  <th class="text-end">Discount</th>
                  <th class="text-center">Usage Limit</th>
                  <th class="text-center">Used</th>
                  <th>Valid Until</th>
                  <th>Status</th>
                  <th class="text-center" style="width: 100px;">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="c in filteredCoupons" :key="c.id">
                  <td class="fw-bold text-dark">{{ c.name }}</td>
                  <td>
                    <span class="badge bg-info bg-opacity-10 text-info border border-info border-opacity-25">{{ c.code }}</span>
                  </td>
                  <td><span class="badge bg-light text-dark border">{{ c.type }}</span></td>
                  <td class="text-end fw-semibold text-primary">
                    {{ c.type === 'Percentage' ? c.discount + '%' : 'Rp ' + formatNumber(c.discount) }}
                  </td>
                  <td class="text-center">{{ c.limit }}</td>
                  <td class="text-center">{{ c.used }}</td>
                  <td class="small">{{ c.valid }}</td>
                  <td>
                    <span :class="c.status === 'Active' ? 'badge bg-success bg-opacity-10 text-success border border-success' : 'badge bg-secondary bg-opacity-10 text-secondary border border-secondary'">
                      {{ c.status }}
                    </span>
                  </td>
                  <td class="text-center action-table-data">
                    <div class="edit-delete-action d-inline-flex gap-2">
                      <button class="btn btn-sm btn-icon text-primary" title="Edit" @click="openEditModal(c)">
                        <i class="ti ti-edit"></i>
                      </button>
                      <button class="btn btn-sm btn-icon text-danger" title="Delete" @click="deleteCoupon(c.id)">
                        <i class="ti ti-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="filteredCoupons.length === 0">
                  <td colspan="9" class="text-center py-4 text-muted">
                    No coupons found.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
>>>>>>> origin/eko
      </div>
    </div>

    <!-- Add / Edit Modal -->
<<<<<<< HEAD
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
=======
    <div v-if="modalVisible" class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.5)">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header border-0">
            <h5 class="modal-title font-bold">{{ isEditing ? 'Edit Coupon' : 'Add New Coupon' }}</h5>
            <button type="button" class="btn-close" @click="modalVisible = false"></button>
          </div>
          <form @submit.prevent="saveCoupon">
            <div class="modal-body pt-0">
              <div class="mb-3">
                <label class="form-label">Coupon Name <span class="text-danger">*</span></label>
                <input v-model="formData.name" type="text" class="form-control" placeholder="e.g. Year End Special" required />
              </div>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">Coupon Code <span class="text-danger">*</span></label>
                  <input v-model="formData.code" type="text" class="form-control text-uppercase" placeholder="e.g. DISKONSALE" required />
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Type</label>
                  <select v-model="formData.type" class="form-select">
                    <option value="Fixed">Fixed (Rp)</option>
                    <option value="Percentage">Percentage (%)</option>
                  </select>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">Discount Value <span class="text-danger">*</span></label>
                  <input v-model.number="formData.discount" type="number" min="0" class="form-control" required />
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Usage Limit</label>
                  <input v-model.number="formData.limit" type="number" min="1" class="form-control" />
                </div>
              </div>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">Valid Until</label>
                  <input v-model="formData.valid" type="text" class="form-control" placeholder="DD/MM/YYYY" />
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Status</label>
                  <select v-model="formData.status" class="form-select">
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="modal-footer border-0 justify-content-end gap-2">
              <button type="button" class="btn btn-secondary" @click="modalVisible = false">Cancel</button>
              <button type="submit" class="btn btn-primary">{{ isEditing ? 'Update Coupon' : 'Save Coupon' }}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <!-- Confirm Delete Modal -->
    <SalesConfirmDelete
      :open="isDeleteConfirmOpen"
      title="Delete Coupon"
      message="Are you sure you want to delete this coupon? This action cannot be undone."
      @cancel="isDeleteConfirmOpen = false"
      @confirm="confirmDelete"
    />
    <DocumentPrintModal
      :open="print.isPrintModalOpen.value"
      title="Coupons"
      :columns="printColumns"
      :items="filteredCoupons"
      :default-action="print.defaultPrintAction.value"
      :show-date-range="false"
      @close="print.closePrintModal"
    />
  </div>
</template>

<script setup lang="ts">
import SalesConfirmDelete from '~/components/sales/SalesConfirmDelete.vue'

definePageMeta({
  layout: 'default'
})

useLegacyPage({
  title: 'Coupons',
  styles: ['/assets/css/style.css'],
  scripts: ['/assets/js/theme-script.js'],
  sweetAlert: true
})

interface CouponItem {
  id: number
  name: string
  code: string
  type: 'Fixed' | 'Percentage'
  discount: number
  limit: number
  used: number
  valid: string
  status: 'Active' | 'Inactive'
}

const coupons = ref<CouponItem[]>([
  { id: 1, name: 'Coupons 21', code: 'Christmas', type: 'Fixed', discount: 20000, limit: 40, used: 12, valid: '04 Jan 2026', status: 'Active' },
  { id: 2, name: 'First Offer', code: 'WELCOME10', type: 'Percentage', discount: 10, limit: 100, used: 45, valid: '15 Feb 2026', status: 'Active' },
  { id: 3, name: 'Offer 40', code: 'BULK40', type: 'Fixed', discount: 40000, limit: 25, used: 20, valid: '08 Apr 2026', status: 'Active' },
  { id: 4, name: 'Subscription Discount', code: 'PROSUB', type: 'Percentage', discount: 15, limit: 50, used: 10, valid: '31 Dec 2026', status: 'Active' }
])
>>>>>>> origin/eko

const searchQuery = ref('')
const filterType = ref('')
const filterStatus = ref('')
<<<<<<< HEAD
=======
const print = useTablePrint()
const printColumns = [
  { key: 'name', label: 'Name' },
  { key: 'code', label: 'Code' },
  { key: 'type', label: 'Type' },
  { key: 'discount', label: 'Discount', align: 'right' as const },
  { key: 'limit', label: 'Usage Limit', align: 'right' as const },
  { key: 'used', label: 'Used', align: 'right' as const },
  { key: 'valid', label: 'Valid Until' },
  { key: 'status', label: 'Status' },
]
>>>>>>> origin/eko

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

<<<<<<< HEAD
function deleteCoupon(id: number) {
  if (confirm('Delete this coupon?')) {
    coupons.value = coupons.value.filter(c => c.id !== id)
=======
const isDeleteConfirmOpen = ref(false)
const deleteTargetId = ref<number | null>(null)

function deleteCoupon(id: number) {
  deleteTargetId.value = id
  isDeleteConfirmOpen.value = true
}

function confirmDelete() {
  if (deleteTargetId.value !== null) {
    coupons.value = coupons.value.filter(c => c.id !== deleteTargetId.value)
    isDeleteConfirmOpen.value = false
    deleteTargetId.value = null
>>>>>>> origin/eko
  }
}

function exportPdf() {
<<<<<<< HEAD
  alert('Exporting Coupons PDF...')
}

function printTable() {
  window.print()
=======
  print.openPrintModal('pdf')
}

function printTable() {
  print.openPrintModal('print')
>>>>>>> origin/eko
}

function refresh() {
  searchQuery.value = ''
  filterType.value = ''
  filterStatus.value = ''
}
<<<<<<< HEAD
</script>
=======
</script>

>>>>>>> origin/eko
