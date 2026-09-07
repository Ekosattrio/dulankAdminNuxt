<template>
  <div class="content">
    <div class="page-header">
      <div class="add-item d-flex">
        <div class="page-title">
          <h4>Bank Accounts</h4>
          <h6>Manage your company bank accounts</h6>
        </div>
      </div>
      <ul class="table-top-head">
        <li>
          <a data-bs-toggle="tooltip" data-bs-placement="top" title="Pdf" @click.prevent="printList">
            <img src="/assets/img/icons/pdf.svg" alt="img" />
          </a>
        </li>
        <li>
          <a data-bs-toggle="tooltip" data-bs-placement="top" title="Print" @click.prevent="printList">
            <i class="feather-printer"></i>
          </a>
        </li>
        <li>
          <a data-bs-toggle="tooltip" data-bs-placement="top" title="Refresh" @click.prevent="refreshList">
            <i class="feather-rotate-ccw"></i>
          </a>
        </li>
        <li>
          <a data-bs-toggle="tooltip" data-bs-placement="top" title="Collapse" id="collapse-header" @click.prevent="toggleHeader">
            <i class="feather-chevron-up"></i>
          </a>
        </li>
      </ul>
      <div class="page-btn">
        <a href="#" class="btn btn-added" @click.prevent="openAddModal">
          <i class="feather-plus-circle me-2"></i>Add Bank Account
        </a>
      </div>
    </div>

    <!-- Bank Accounts Card -->
    <div class="card table-list-card">
      <div class="card-body">
        <div class="table-top d-flex align-items-center justify-content-between flex-wrap gap-2">
          <div class="search-set d-block d-md-flex align-items-center gap-2">
            <div class="search-input">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search account..."
                class="form-control form-control-sm"
              />
            </div>
            <div class="status-select">
              <select class="form-select form-select-sm" v-model="statusFilter">
                <option value="">All Status</option>
                <option>Active</option>
                <option>Closed</option>
              </select>
            </div>
          </div>
        </div>

        <div class="table-responsive">
          <table class="table datanew">
            <thead>
              <tr>
                <th>Account Name</th>
                <th>Bank Name</th>
                <th>Account No</th>
                <th class="text-end">Opening Balance (IDR)</th>
                <th>Status</th>
                <th class="no-sort">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in filteredAccounts" :key="item.id">
                <td class="fw-bold">{{ item.accountName }}</td>
                <td>{{ item.bankName }}</td>
                <td class="str-value">{{ item.accountNo }}</td>
                <td class="text-end fw-semibold">{{ formatNumber(item.balance) }}</td>
                <td>
                  <span
                    class="badge"
                    :class="item.status === 'Active' ? 'bg-outline-success' : 'bg-outline-danger'"
                  >
                    {{ item.status }}
                  </span>
                </td>
                <td class="action-table-data">
                  <div class="edit-delete-action d-flex align-items-center gap-2">
                    <a class="p-2 text-info cursor-pointer" @click.prevent="openEditModal(item)" title="Edit">
                      <i class="feather-edit"></i>
                    </a>
                    <a class="p-2 text-danger cursor-pointer" @click.prevent="deleteAccount(item)" title="Delete">
                      <i class="feather-trash-2"></i>
                    </a>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredAccounts.length === 0">
                <td colspan="6" class="text-center py-4 text-muted">No bank accounts found.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Add/Edit Bank Account Modal -->
    <div v-if="showModal" class="modal fade show d-block" style="background: rgba(0,0,0,0.5)">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header border-0 pb-0">
            <h4 class="modal-title">{{ isEdit ? 'Edit Bank Account' : 'Add Bank Account' }}</h4>
            <button type="button" class="btn-close" @click="showModal = false"></button>
          </div>
          <div class="modal-body p-4">
            <form @submit.prevent="saveAccount">
              <div class="mb-3">
                <label class="form-label fw-semibold">Account Name</label>
                <input type="text" class="form-control" v-model="formData.accountName" required />
              </div>
              <div class="mb-3">
                <label class="form-label fw-semibold">Bank Name</label>
                <select class="form-select" v-model="formData.bankName" required>
                  <option>Bank Mandiri</option>
                  <option>Bank BCA</option>
                  <option>Bank BNI</option>
                  <option>Bank BRI</option>
                  <option>Bank Syariah Indonesia (BSI)</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label fw-semibold">Account No</label>
                <input type="text" class="form-control" v-model="formData.accountNo" required />
              </div>
              <div class="mb-3">
                <label class="form-label fw-semibold">Opening Balance</label>
                <input type="number" class="form-control" v-model.number="formData.balance" required />
              </div>
              <div class="mb-3">
                <label class="form-label fw-semibold">Status</label>
                <select class="form-select" v-model="formData.status">
                  <option>Active</option>
                  <option>Closed</option>
                </select>
              </div>
              <div class="modal-footer modal-action-footer justify-content-end p-0 pt-3 border-top gap-2">
                <button type="button" class="btn btn-dark" @click="showModal = false">Cancel</button>
                <button type="submit" class="btn btn-warning text-white fw-bold">Submit</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { formatNumber } from '~/composables/useFormatters'

const accounts = ref([
  { id: 1, accountName: 'PT Dulank Semesta Cida', bankName: 'Bank Mandiri', accountNo: '1230009876543', balance: 5500000, status: 'Active' },
  { id: 2, accountName: 'Cecep Sudirman', bankName: 'Bank BCA', accountNo: '4567891230', balance: 2100000, status: 'Active' },
  { id: 3, accountName: 'PT Dulank Semesta Cida', bankName: 'Bank BNI', accountNo: '876543210123', balance: 8250000, status: 'Active' },
  { id: 4, accountName: 'Cecep Sudirman', bankName: 'Bank BRI', accountNo: '1020304050607', balance: 2000000, status: 'Closed' }
])

const searchQuery = ref('')
const statusFilter = ref('')

const filteredAccounts = computed(() => {
  return accounts.value.filter(a => {
    const q = searchQuery.value.toLowerCase()
    const matchesSearch =
      !q ||
      a.accountName.toLowerCase().includes(q) ||
      a.bankName.toLowerCase().includes(q) ||
      a.accountNo.includes(q)

    const matchesStatus = !statusFilter.value || a.status === statusFilter.value
    return matchesSearch && matchesStatus
  })
})

const showModal = ref(false)
const isEdit = ref(false)
const formData = ref<any>({})

const openAddModal = () => {
  isEdit.value = false
  formData.value = {
    accountName: '',
    bankName: 'Bank BCA',
    accountNo: '',
    balance: 0,
    status: 'Active'
  }
  showModal.value = true
}

const openEditModal = (item: any) => {
  isEdit.value = true
  formData.value = { ...item }
  showModal.value = true
}

const saveAccount = () => {
  if (isEdit.value) {
    const idx = accounts.value.findIndex(a => a.id === formData.value.id)
    if (idx !== -1) {
      accounts.value[idx] = { ...formData.value }
    }
  } else {
    accounts.value.push({
      id: Date.now(),
      ...formData.value
    })
  }
  showModal.value = false
}

const deleteAccount = (item: any) => {
  if (confirm(`Are you sure you want to delete ${item.accountName} - ${item.bankName}?`)) {
    accounts.value = accounts.value.filter(a => a.id !== item.id)
  }
}

const printList = () => {
  window.print()
}

const refreshList = () => {
  searchQuery.value = ''
  statusFilter.value = ''
}

const toggleHeader = () => {
  // toggle
}
</script>

