<script setup lang="ts">
import { ref, computed } from 'vue'
import type { BankSetting } from '#server/types/bank-setting'
import { useBankSettings } from '~/composables/useBankSettings'
import SalesConfirmDelete from '~/components/Sales/SalesConfirmDelete.vue'

const { items: accounts, pending, error, refresh, saveItem, deleteItem } = useBankSettings()

const searchQuery = ref('')
const showModal = ref(false)
const isEditing = ref(false)
const isSaving = ref(false)

const itemToDelete = ref<BankSetting | null>(null)
const isDeleting = ref(false)

const currentAccount = ref<{
  id?: string
  bankName: string
  accountNumber: string
  accountName: string
  branch: string
  status: 'active' | 'inactive'
}>({
  bankName: '',
  accountNumber: '',
  accountName: '',
  branch: '',
  status: 'active'
})

const filteredAccounts = computed(() => {
  return accounts.value.filter(a => {
    const q = searchQuery.value.toLowerCase()
    return a.bankName.toLowerCase().includes(q) || a.accountName.toLowerCase().includes(q)
  })
})

const openAddModal = () => {
  isEditing.value = false
  currentAccount.value = {
    bankName: '',
    accountNumber: '',
    accountName: '',
    branch: '',
    status: 'active'
  }
  showModal.value = true
}

const openEditModal = (b: BankSetting) => {
  isEditing.value = true
  currentAccount.value = {
    id: b.id,
    bankName: b.bankName,
    accountNumber: b.accountNumber,
    accountName: b.accountName,
    branch: b.branch,
    status: b.status
  }
  showModal.value = true
}

const handleSaveAccount = async () => {
  isSaving.value = true
  try {
    await saveItem(currentAccount.value)
    showModal.value = false
  } catch (err) {
    console.error('Failed to save bank account:', err)
  } finally {
    isSaving.value = false
  }
}

const openDeleteConfirm = (b: BankSetting) => {
  itemToDelete.value = b
}

const handleConfirmDelete = async () => {
  if (!itemToDelete.value) return
  isDeleting.value = true
  try {
    await deleteItem(itemToDelete.value.id)
    itemToDelete.value = null
  } catch (err) {
    console.error('Failed to delete bank account:', err)
  } finally {
    isDeleting.value = false
  }
}
</script>

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
            <a title="Refresh" href="javascript:void(0);" @click="refresh()"><i class="ti ti-rotate"></i></a>
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
                          <th>Account Holder</th>
                          <th>Bank</th>
                          <th>Branch</th>
                          <th>Account No</th>
                          <th>Status</th>
                          <th>Created On</th>
                          <th class="text-end no-sort">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="b in filteredAccounts" :key="b.id">
                          <td class="fw-semibold text-dark">{{ b.accountName }}</td>
                          <td>{{ b.bankName }}</td>
                          <td>{{ b.branch }}</td>
                          <td class="font-mono">{{ b.accountNumber }}</td>
                          <td>
                            <span :class="b.status === 'active' ? 'badge bg-success' : 'badge bg-secondary'">
                              {{ b.status === 'active' ? 'Active' : 'Inactive' }}
                            </span>
                          </td>
                          <td>{{ b.createdOn }}</td>
                          <td class="action-table-data text-end">
                            <div class="edit-delete-action d-inline-flex gap-2">
                              <button class="btn btn-sm btn-outline-primary p-1" title="Edit" @click="openEditModal(b)">
                                <i class="ti ti-edit"></i>
                              </button>
                              <button class="btn btn-sm btn-outline-danger p-1" title="Delete" @click="openDeleteConfirm(b)">
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
              <form @submit.prevent="handleSaveAccount">
                <div class="mb-3">
                  <label class="form-label">Bank Name</label>
                  <input v-model="currentAccount.bankName" type="text" class="form-control" required placeholder="e.g. Bank Central Asia (BCA)" />
                </div>
                <div class="mb-3">
                  <label class="form-label">Account Number</label>
                  <input v-model="currentAccount.accountNumber" type="text" class="form-control" required placeholder="e.g. 1234567890" />
                </div>
                <div class="mb-3">
                  <label class="form-label">Account Holder Name</label>
                  <input v-model="currentAccount.accountName" type="text" class="form-control" required placeholder="e.g. PT. DULANK SEMESTA CIDA" />
                </div>
                <div class="mb-3">
                  <label class="form-label">Branch</label>
                  <input v-model="currentAccount.branch" type="text" class="form-control" placeholder="e.g. KCU Sudirman" />
                </div>
                <div class="mb-3">
                  <label class="form-label">Status</label>
                  <select v-model="currentAccount.status" class="form-select">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div class="modal-footer modal-action-footer justify-content-end pt-3 border-top">
                  <button type="button" class="btn btn-light" @click="showModal = false">Cancel</button>
                  <button type="submit" class="btn btn-warning text-white" :disabled="isSaving">
                    {{ isSaving ? 'Saving...' : 'Save Changes' }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <!-- Delete Confirmation Modal -->
      <SalesConfirmDelete
        :open="!!itemToDelete"
        :title="itemToDelete ? `Delete ${itemToDelete.bankName}` : ''"
        message="Are you sure you want to delete this bank account? This action cannot be undone."
        :is-loading="isDeleting"
        @confirm="handleConfirmDelete"
        @close="itemToDelete = null"
      />
    </div>
  </div>
</template>
