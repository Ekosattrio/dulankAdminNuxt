<template>
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
      </div>
    </div>

    <!-- Add / Edit Modal -->
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
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

useHead({
  title: 'Coupons - Kacetak System'
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

