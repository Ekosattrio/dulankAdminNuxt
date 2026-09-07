<template>
  <div class="page-wrapper mt-3">
    <div class="content">
      <div class="page-header">
        <div class="add-item d-flex">
          <div class="page-title">
            <h4>Internal Paper Stock & Specs</h4>
            <h6>Manage internal paper gramatures, pricing models, stock levels, and sheets</h6>
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
            <i class="ti ti-circle-plus me-1"></i>Add Paper Type
          </button>
        </div>
      </div>

      <!-- Data Table Card -->
      <div class="card table-list-card">
        <div class="card-body">
          <div class="table-top d-flex align-items-center justify-content-between flex-wrap gap-3 mb-3">
            <div class="search-set d-flex align-items-center gap-2 flex-wrap">
              <div class="search-input">
                <span class="btn-searchset"><i class="ti ti-search"></i></span>
                <input v-model="searchQuery" type="text" class="form-control" placeholder="Search paper name, size or gsm..." />
              </div>
            </div>
            <div class="filters d-flex align-items-center gap-2 flex-wrap">
              <div class="dropdown">
                <button
                  class="btn btn-outline-primary dropdown-toggle"
                  type="button"
                  @click="statusDropdownOpen = !statusDropdownOpen"
                >
                  Status: {{ filterStatus || 'All Status' }}
                </button>
                <ul v-if="statusDropdownOpen" class="dropdown-menu show" style="display: block; position: absolute;">
                  <li><a class="dropdown-item" href="javascript:void(0);" @click="filterStatus = ''; statusDropdownOpen = false">All Status</a></li>
                  <li><a class="dropdown-item" href="javascript:void(0);" @click="filterStatus = 'Active'; statusDropdownOpen = false">Active</a></li>
                  <li><a class="dropdown-item" href="javascript:void(0);" @click="filterStatus = 'Inactive'; statusDropdownOpen = false">Inactive</a></li>
                </ul>
              </div>
            </div>
          </div>

          <div class="table-responsive">
            <table class="table datanew">
              <thead class="thead-light">
                <tr>
                  <th>Paper Name</th>
                  <th>Merk</th>
                  <th class="text-end">Price</th>
                  <th>Price Type</th>
                  <th>Unit</th>
                  <th class="text-center">GSM</th>
                  <th>Paper Size</th>
                  <th class="text-end">Stock</th>
                  <th>Unit Stock</th>
                  <th>Status</th>
                  <th class="text-center" style="width: 100px;">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in filteredItems" :key="item.id">
                  <td class="fw-bold text-dark">{{ item.name }}</td>
                  <td>{{ item.merk }}</td>
                  <td class="text-end fw-semibold">Rp {{ formatNumber(item.price) }}</td>
                  <td><span class="badge bg-light text-dark border">{{ item.priceType }}</span></td>
                  <td>{{ item.unitPrice }}</td>
                  <td class="text-center fw-bold">{{ item.gsm }}</td>
                  <td><span class="badge bg-secondary bg-opacity-10 text-dark font-monospace">{{ item.size }}</span></td>
                  <td class="text-end fw-bold" :class="item.stock < 100 ? 'text-danger' : 'text-dark'">
                    {{ formatNumber(item.stock) }}
                  </td>
                  <td>{{ item.unitStock }}</td>
                  <td>
                    <span
                      class="badge rounded"
                      :class="item.status === 'Active' ? 'badge-success' : 'badge-secondary'"
                    >
                      • {{ item.status }}
                    </span>
                  </td>
                  <td class="action-table-data">
                    <div class="edit-delete-action justify-content-center gap-2">
                      <button
                        type="button"
                        class="btn btn-sm btn-icon text-primary p-1"
                        title="Edit Paper Type"
                        @click="openEditModal(item)"
                      >
                        <i class="ti ti-edit fs-16"></i>
                      </button>
                      <button
                        type="button"
                        class="btn btn-sm btn-icon text-danger p-1"
                        title="Delete Paper Type"
                        @click="deleteItem(item.id)"
                      >
                        <i class="ti ti-trash fs-16"></i>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="filteredItems.length === 0">
                  <td colspan="11" class="text-center py-4 text-muted">
                    No paper types found.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div
      v-if="modalVisible"
      class="modal fade show d-block"
      style="background-color: rgba(0,0,0,0.5);"
      tabindex="-1"
    >
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ isEdit ? 'Edit Paper Type' : 'Add Paper Type' }}</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <form @submit.prevent="saveItem">
            <div class="modal-body pb-0">
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label">Paper Name <span class="text-danger">*</span></label>
                  <input v-model="form.name" type="text" class="form-control" required placeholder="e.g. Art Paper" />
                </div>
                <div class="col-md-6">
                  <label class="form-label">Merk / Brand</label>
                  <input v-model="form.merk" type="text" class="form-control" placeholder="e.g. Pindo Deli" />
                </div>
                <div class="col-md-4">
                  <label class="form-label">Price (Rp) <span class="text-danger">*</span></label>
                  <input v-model.number="form.price" type="number" class="form-control" required placeholder="52000" />
                </div>
                <div class="col-md-4">
                  <label class="form-label">Price Model</label>
                  <select v-model="form.priceType" class="form-select">
                    <option value="Group">Group / Plano</option>
                    <option value="Kg">Per Kg</option>
                    <option value="Sheet">Per Sheet</option>
                  </select>
                </div>
                <div class="col-md-4">
                  <label class="form-label">Unit Price</label>
                  <input v-model="form.unitPrice" type="text" class="form-control" placeholder="Kg, Lembar, Plano" />
                </div>
                <div class="col-md-4">
                  <label class="form-label">Gramatur (GSM) <span class="text-danger">*</span></label>
                  <input v-model.number="form.gsm" type="number" class="form-control" required placeholder="150" />
                </div>
                <div class="col-md-4">
                  <label class="form-label">Plano Size (cm)</label>
                  <input v-model="form.size" type="text" class="form-control" placeholder="65x100" />
                </div>
                <div class="col-md-4">
                  <label class="form-label">Stock Quantity</label>
                  <input v-model.number="form.stock" type="number" class="form-control" placeholder="500" />
                </div>
                <div class="col-md-6">
                  <div class="d-flex align-items-center my-3">
                    <label class="form-label mb-0 me-3">Status Active</label>
                    <div class="form-check form-switch">
                      <input v-model="formActive" class="form-check-input" type="checkbox" role="switch" id="typeActiveSwitch" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer modal-action-footer justify-content-end gap-2">
              <button type="button" class="btn btn-dark modal-action-cancel" @click="closeModal">Cancel</button>
              <button type="submit" class="btn btn-warning modal-action-submit">
                {{ isEdit ? 'Update Type' : 'Save Type' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface SelfPaperType {
  id: number
  name: string
  merk: string
  price: number
  priceType: string
  unitPrice: string
  gsm: number
  size: string
  stock: number
  unitStock: string
  status: 'Active' | 'Inactive'
}

const items = ref<SelfPaperType[]>([
  { id: 1, name: 'Art Paper', merk: 'Pindo Deli', price: 52000, priceType: 'Group', unitPrice: 'Kg', gsm: 150, size: '65x100', stock: 1250, unitStock: 'Plano', status: 'Active' },
  { id: 2, name: 'Art Carton', merk: 'Golden Coin', price: 68000, priceType: 'Group', unitPrice: 'Kg', gsm: 260, size: '79x109', stock: 850, unitStock: 'Plano', status: 'Active' },
  { id: 3, name: 'HVS Putih', merk: 'Paperone', price: 42000, priceType: 'Group', unitPrice: 'Kg', gsm: 80, size: '65x90', stock: 2400, unitStock: 'Plano', status: 'Active' },
  { id: 4, name: 'Ivory', merk: 'Sinar Mas', price: 78000, priceType: 'Group', unitPrice: 'Kg', gsm: 310, size: '65x90', stock: 450, unitStock: 'Plano', status: 'Active' },
  { id: 5, name: 'Duplex', merk: 'Cenming', price: 38000, priceType: 'Group', unitPrice: 'Kg', gsm: 250, size: '79x109', stock: 80, unitStock: 'Plano', status: 'Inactive' }
])

const searchQuery = ref('')
const filterStatus = ref('')
const statusDropdownOpen = ref(false)

const filteredItems = computed(() => {
  return items.value.filter(i => {
    const matchStatus = !filterStatus.value || i.status === filterStatus.value
    const matchSearch = !searchQuery.value ||
      i.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      i.merk.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      i.size.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      String(i.gsm).includes(searchQuery.value)
    return matchStatus && matchSearch
  })
})

const modalVisible = ref(false)
const isEdit = ref(false)
const currentId = ref<number | null>(null)

const form = ref({
  name: '',
  merk: '',
  price: 0,
  priceType: 'Group',
  unitPrice: 'Kg',
  gsm: 150,
  size: '65x100',
  stock: 0,
  unitStock: 'Plano',
  status: 'Active' as 'Active' | 'Inactive'
})

const formActive = computed({
  get: () => form.value.status === 'Active',
  set: (val: boolean) => {
    form.value.status = val ? 'Active' : 'Inactive'
  }
})

function formatNumber(val: number) {
  return val.toLocaleString('id-ID')
}

function openAddModal() {
  isEdit.value = false
  currentId.value = null
  form.value = {
    name: '',
    merk: '',
    price: 50000,
    priceType: 'Group',
    unitPrice: 'Kg',
    gsm: 150,
    size: '65x100',
    stock: 100,
    unitStock: 'Plano',
    status: 'Active'
  }
  modalVisible.value = true
}

function openEditModal(i: SelfPaperType) {
  isEdit.value = true
  currentId.value = i.id
  form.value = { ...i }
  modalVisible.value = true
}

function closeModal() {
  modalVisible.value = false
}

function saveItem() {
  if (isEdit.value && currentId.value !== null) {
    const idx = items.value.findIndex(i => i.id === currentId.value)
    if (idx !== -1) {
      items.value[idx] = { ...items.value[idx], ...form.value }
    }
  } else {
    const newId = items.value.length ? Math.max(...items.value.map(i => i.id)) + 1 : 1
    items.value.unshift({ id: newId, ...form.value })
  }
  closeModal()
}

function deleteItem(id: number) {
  if (confirm('Are you sure you want to delete this paper type?')) {
    items.value = items.value.filter(i => i.id !== id)
  }
}

function exportPdf() {
  alert('Exporting paper types as PDF...')
}

function printTable() {
  window.print()
}

function refresh() {
  searchQuery.value = ''
  filterStatus.value = ''
}
</script>
