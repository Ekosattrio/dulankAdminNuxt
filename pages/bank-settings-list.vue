<template>
  <div class="page-wrapper">
    <div class="content settings-content">
      <div class="page-header settings-pg-header mt-3">
        <div class="add-item d-flex">
          <div class="page-title">
            <h4>Settings</h4>
            <h6>Manage your settings on portal</h6>
          </div>
        </div>
        <ul class="table-top-head">
          <li>
            <a title="Refresh" href="javascript:void(0);" @click="refresh"><i class="ti ti-rotate"></i></a>
          </li>
          <li>
            <a title="Collapse" href="javascript:void(0);" @click="toggleCollapse"><i class="ti ti-chevron-up"></i></a>
          </li>
        </ul>
      </div>

      <div class="row">
        <div class="col-xl-12">
          <div class="settings-wrapper d-flex">
            <div class="settings-page-wrap w-100">
              <div class="setting-title mb-3">
                <h4 class="fs-18 fw-bold">Bank Account</h4>
              </div>

              <div class="d-flex justify-content-between align-items-center mb-4">
                <div class="d-flex align-items-center gap-2">
                  <NuxtLink to="/bank-settings-list" class="btn btn-primary btn-sm p-2" title="List View">
                    <i class="ti ti-list"></i>
                  </NuxtLink>
                  <NuxtLink to="/bank-settings-grid" class="btn btn-outline-secondary btn-sm p-2" title="Grid View">
                    <i class="ti ti-grid-dots"></i>
                  </NuxtLink>
                </div>
                <button class="btn btn-added" @click="openAddModal">
                  <i class="ti ti-plus me-1"></i> Add New Account
                </button>
              </div>

              <div class="card table-list-card border shadow-sm">
                <div class="card-body">
                  <div class="table-top d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
                    <div class="search-set d-block d-md-flex align-items-center gap-2">
                      <div class="search-input position-relative">
                        <input
                          v-model="searchQuery"
                          type="text"
                          class="form-control"
                          placeholder="Search Bank or Holder Name..."
                        />
                      </div>
                    </div>
                  </div>

                  <div class="table-responsive">
                    <table class="table datanew">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Bank</th>
                          <th>Branch</th>
                          <th>Account No</th>
                          <th>Status</th>
                          <th>Created On</th>
                          <th class="text-end no-sort">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(b, idx) in filteredAccounts" :key="idx">
                          <td class="fw-semibold text-dark">{{ b.holderName }}</td>
                          <td>{{ b.bankName }}</td>
                          <td>{{ b.branch }}</td>
                          <td class="font-mono">{{ b.accountNo }}</td>
                          <td>
                            <span v-if="b.isDefault" class="badge bg-primary">Default</span>
                            <span v-else class="badge bg-outline-secondary">Secondary</span>
                          </td>
                          <td>{{ b.createdOn }}</td>
                          <td class="action-table-data text-end">
                            <div class="edit-delete-action d-inline-flex gap-2">
                              <button class="btn btn-sm btn-outline-primary p-1" title="Edit" @click="openEditModal(b)">
                                <i class="ti ti-edit"></i>
                              </button>
                              <button class="btn btn-sm btn-outline-danger p-1" title="Delete" @click="deleteAccount(idx)">
                                <i class="ti ti-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                        <tr v-if="filteredAccounts.length === 0">
                          <td colspan="7" class="text-center py-4 text-muted">No accounts found.</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Add/Edit Modal -->
      <div v-if="showModal" class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.5)">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header border-0 custom-modal-header pb-0">
              <div class="page-title">
                <h4>{{ isEditing ? 'Edit Bank Account' : 'Add Bank Account' }}</h4>
              </div>
              <button type="button" class="btn-close" @click="showModal = false"></button>
            </div>
            <div class="modal-body custom-modal-body">
              <form @submit.prevent="saveAccount">
                <div class="mb-3">
                  <label class="form-label">Bank Name</label>
                  <input v-model="currentAccount.bankName" type="text" class="form-control" required placeholder="e.g. Bank Central Asia (BCA)" />
                </div>
                <div class="mb-3">
                  <label class="form-label">Account Number</label>
                  <input v-model="currentAccount.accountNo" type="text" class="form-control" required placeholder="e.g. 1234567890" />
                </div>
                <div class="mb-3">
                  <label class="form-label">Account Holder Name</label>
                  <input v-model="currentAccount.holderName" type="text" class="form-control" required placeholder="e.g. John Doe" />
                </div>
                <div class="mb-3">
                  <label class="form-label">Branch</label>
                  <input v-model="currentAccount.branch" type="text" class="form-control" placeholder="e.g. KCU Sudirman" />
                </div>
                <div class="mb-3">
                  <div class="form-check form-switch">
                    <input v-model="currentAccount.isDefault" class="form-check-input" type="checkbox" role="switch" id="makeDefaultList" />
                    <label class="form-check-label" for="makeDefaultList">Make as default account</label>
                  </div>
                </div>
                <div class="modal-footer modal-action-footer justify-content-end pt-3 border-top">
                  <button type="button" class="btn btn-light" @click="showModal = false">Cancel</button>
                  <button type="submit" class="btn btn-warning text-white">Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

useHead({
  title: 'Bank Settings List - Kacetak System'
})

const searchQuery = ref('')
const showModal = ref(false)
const isEditing = ref(false)

interface BankAccount {
  id?: number
  bankName: string
  accountNo: string
  holderName: string
  branch: string
  isDefault: boolean
  createdOn: string
}

const accounts = ref<BankAccount[]>([
  { id: 1, bankName: 'Bank BCA', accountNo: '**** **** 1982', holderName: 'PT Kacetak Digital', branch: 'Jakarta', isDefault: true, createdOn: '12 Jul 2023' },
  { id: 2, bankName: 'Bank Mandiri', accountNo: '**** **** 1796', holderName: 'PT Kacetak Digital', branch: 'Bandung', isDefault: false, createdOn: '17 Aug 2023' },
  { id: 3, bankName: 'Bank BNI', accountNo: '**** **** 1832', holderName: 'PT Kacetak Digital', branch: 'Surabaya', isDefault: false, createdOn: '08 Sep 2023' }
])

const currentAccount = ref<BankAccount>({
  bankName: '',
  accountNo: '',
  holderName: '',
  branch: '',
  isDefault: false,
  createdOn: ''
})

const filteredAccounts = computed(() => {
  return accounts.value.filter(a => {
    const q = searchQuery.value.toLowerCase()
    return a.bankName.toLowerCase().includes(q) || a.holderName.toLowerCase().includes(q)
  })
})

const openAddModal = () => {
  isEditing.value = false
  currentAccount.value = {
    bankName: '',
    accountNo: '',
    holderName: '',
    branch: '',
    isDefault: false,
    createdOn: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  }
  showModal.value = true
}

const openEditModal = (b: BankAccount) => {
  isEditing.value = true
  currentAccount.value = { ...b }
  showModal.value = true
}

const saveAccount = () => {
  if (currentAccount.value.isDefault) {
    accounts.value.forEach(a => a.isDefault = false)
  }
  if (isEditing.value) {
    const idx = accounts.value.findIndex(a => a.id === currentAccount.value.id)
    if (idx !== -1) {
      accounts.value[idx] = { ...currentAccount.value }
    }
  } else {
    accounts.value.unshift({
      id: Date.now(),
      ...currentAccount.value
    })
  }
  showModal.value = false
}

const deleteAccount = (idx: number) => {
  if (confirm('Are you sure you want to delete this bank account?')) {
    accounts.value.splice(idx, 1)
  }
}

const refresh = () => {
  // refresh
}

const toggleCollapse = () => {
  // collapse
}
</script>
