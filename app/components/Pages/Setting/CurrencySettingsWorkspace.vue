<script setup lang="ts">
import { ref, computed } from 'vue'
import type { CurrencySetting } from '#server/types/currency-setting'
import { useCurrencySettings } from '~/composables/useCurrencySettings'
import SalesConfirmDelete from '~/components/Sales/SalesConfirmDelete.vue'
import CurrencyDisplay from '~/components/Common/CurrencyDisplay.vue'

const { items: currencies, pending, error, refresh, saveItem, deleteItem } = useCurrencySettings()

const searchQuery = ref('')
const showModal = ref(false)
const isEditing = ref(false)
const isSaving = ref(false)

const itemToDelete = ref<CurrencySetting | null>(null)
const isDeleting = ref(false)

const currentCurrency = ref<{
  id?: string
  name: string
  code: string
  symbol: string
  exchangeRate: number
}>({
  name: '',
  code: '',
  symbol: '',
  exchangeRate: 1
})

const filteredCurrencies = computed(() => {
  return currencies.value.filter(c => {
    const q = searchQuery.value.toLowerCase()
    return c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q)
  })
})

const openAddModal = () => {
  isEditing.value = false
  currentCurrency.value = {
    name: '',
    code: '',
    symbol: '',
    exchangeRate: 1
  }
  showModal.value = true
}

const openEditModal = (c: CurrencySetting) => {
  isEditing.value = true
  currentCurrency.value = {
    id: c.id,
    name: c.name,
    code: c.code,
    symbol: c.symbol,
    exchangeRate: c.exchangeRate
  }
  showModal.value = true
}

const handleSaveCurrency = async () => {
  isSaving.value = true
  try {
    await saveItem(currentCurrency.value)
    showModal.value = false
  } catch (err) {
    console.error('Failed to save currency:', err)
  } finally {
    isSaving.value = false
  }
}

const openDeleteConfirm = (c: CurrencySetting) => {
  itemToDelete.value = c
}

const handleConfirmDelete = async () => {
  if (!itemToDelete.value) return
  isDeleting.value = true
  try {
    await deleteItem(itemToDelete.value.id)
    itemToDelete.value = null
  } catch (err) {
    console.error('Failed to delete currency:', err)
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
              <div class="d-flex justify-content-between align-items-center mb-3">
                <div class="setting-title mb-0">
                  <h4 class="fs-18 fw-bold">Currency Settings</h4>
                </div>
                <button class="btn btn-added" @click="openAddModal">
                  <i class="ti ti-plus me-1"></i> Add New Currency
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
                          placeholder="Search Currency..."
                        />
                      </div>
                    </div>
                  </div>

                  <div class="table-responsive">
                    <table class="table datanew">
                      <thead>
                        <tr>
                          <th>Currency Name</th>
                          <th>Code</th>
                          <th>Symbol</th>
                          <th>Exchange Rate</th>
                          <th>Created On</th>
                          <th class="text-end no-sort">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="c in filteredCurrencies" :key="c.id">
                          <td class="fw-semibold text-dark">{{ c.name }}</td>
                          <td><span class="badge bg-light-primary text-primary">{{ c.code }}</span></td>
                          <td class="fw-bold fs-16">{{ c.symbol }}</td>
                          <td>
                            <span v-if="c.isDefault">1.0 (Default)</span>
                            <CurrencyDisplay v-else :value="c.exchangeRate" />
                          </td>
                          <td>{{ c.createdOn }}</td>
                          <td class="action-table-data text-end">
                            <div class="edit-delete-action d-inline-flex gap-2">
                              <button class="btn btn-sm btn-outline-primary p-1" title="Edit" @click="openEditModal(c)">
                                <i class="ti ti-edit"></i>
                              </button>
                              <button class="btn btn-sm btn-outline-danger p-1" title="Delete" @click="openDeleteConfirm(c)">
                                <i class="ti ti-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                        <tr v-if="filteredCurrencies.length === 0">
                          <td colspan="6" class="text-center py-4 text-muted">No currencies found.</td>
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
                <h4>{{ isEditing ? 'Edit Currency' : 'Add Currency' }}</h4>
              </div>
              <button type="button" class="btn-close" @click="showModal = false"></button>
            </div>
            <div class="modal-body custom-modal-body">
              <form @submit.prevent="handleSaveCurrency">
                <div class="mb-3">
                  <label class="form-label">Currency Name</label>
                  <input v-model="currentCurrency.name" type="text" class="form-control" required placeholder="e.g. Indonesian Rupiah" />
                </div>
                <div class="mb-3">
                  <label class="form-label">Currency Code</label>
                  <input v-model="currentCurrency.code" type="text" class="form-control" required placeholder="e.g. IDR" />
                </div>
                <div class="mb-3">
                  <label class="form-label">Currency Symbol</label>
                  <input v-model="currentCurrency.symbol" type="text" class="form-control" required placeholder="e.g. Rp" />
                </div>
                <div class="mb-3">
                  <label class="form-label">Exchange Rate (Numeric)</label>
                  <input v-model.number="currentCurrency.exchangeRate" type="number" step="any" class="form-control" placeholder="1 or 15600" />
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
        :title="itemToDelete ? `Delete ${itemToDelete.name}` : ''"
        message="Are you sure you want to delete this currency setting? This action cannot be undone."
        :is-loading="isDeleting"
        @confirm="handleConfirmDelete"
        @close="itemToDelete = null"
      />
    </div>
  </div>
</template>
