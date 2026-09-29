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
                  <NuxtLink to="/bank-settings-list" class="btn btn-outline-secondary btn-sm p-2" title="List View">
                    <i class="ti ti-list"></i>
                  </NuxtLink>
                  <NuxtLink to="/bank-settings-grid" class="btn btn-primary btn-sm p-2" title="Grid View">
                    <i class="ti ti-grid-dots"></i>
                  </NuxtLink>
                </div>
                <button class="btn btn-added" @click="openAddModal">
                  <i class="ti ti-plus me-1"></i> Add New Account
                </button>
              </div>

              <!-- Bank Account Cards Grid -->
              <div class="row g-4">
                <div v-for="(bank, idx) in accounts" :key="idx" class="col-xxl-4 col-xl-6 col-lg-6 col-md-6">
                  <div
                    class="card p-4 border shadow-sm h-100 position-relative"
                    :class="{ 'border-primary': bank.isDefault }"
                  >
                    <div class="d-flex justify-content-between align-items-start mb-3">
                      <div>
                        <h5 class="fw-bold mb-1">{{ bank.bankName }}</h5>
                        <p class="text-muted text-sm font-mono mb-0">{{ bank.accountNo }}</p>
                      </div>
                      <span v-if="bank.isDefault" class="badge bg-primary">Default</span>
                    </div>

                    <div class="d-flex align-items-center justify-content-between mt-auto pt-3 border-top">
                      <div>
                        <span class="text-muted text-xs d-block">Holder Name</span>
                        <h6 class="fw-semibold mb-0">{{ bank.holderName }}</h6>
                      </div>
                      <div class="d-flex gap-2">
                        <button class="btn btn-sm btn-outline-primary p-1" title="Edit" @click="openEditModal(bank)">
                          <i class="ti ti-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger p-1" title="Delete" @click="deleteAccount(idx)">
                          <i class="ti ti-trash"></i>
                        </button>
                      </div>
                    </div>
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
                    <input v-model="currentAccount.isDefault" class="form-check-input" type="checkbox" role="switch" id="makeDefault" />
                    <label class="form-check-label" for="makeDefault">Make as default account</label>
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
import { ref } from 'vue'

useHead({
  title: 'Bank Settings Grid - Kacetak System'
})

const showModal = ref(false)
const isEditing = ref(false)

interface BankAccount {
  id?: number
  bankName: string
  accountNo: string
  holderName: string
  branch?: string
  isDefault: boolean
}

const accounts = ref<BankAccount[]>([
  { id: 1, bankName: 'Bank BCA', accountNo: '**** **** 1982', holderName: 'PT Kacetak Digital', branch: 'Jakarta', isDefault: true },
  { id: 2, bankName: 'Bank Mandiri', accountNo: '**** **** 1796', holderName: 'PT Kacetak Digital', branch: 'Bandung', isDefault: false },
  { id: 3, bankName: 'Bank BNI', accountNo: '**** **** 1832', holderName: 'PT Kacetak Digital', branch: 'Surabaya', isDefault: false }
])

const currentAccount = ref<BankAccount>({
  bankName: '',
  accountNo: '',
  holderName: '',
  branch: '',
  isDefault: false
})

const openAddModal = () => {
  isEditing.value = false
  currentAccount.value = {
    bankName: '',
    accountNo: '',
    holderName: '',
    branch: '',
    isDefault: false
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

