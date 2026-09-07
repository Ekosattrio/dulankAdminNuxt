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
                        <tr v-for="(c, idx) in filteredCurrencies" :key="idx">
                          <td class="fw-semibold text-dark">{{ c.name }}</td>
                          <td><span class="badge bg-light-primary text-primary">{{ c.code }}</span></td>
                          <td class="fw-bold fs-16">{{ c.symbol }}</td>
                          <td>{{ c.exchangeRate }}</td>
                          <td>{{ c.createdOn }}</td>
                          <td class="action-table-data text-end">
                            <div class="edit-delete-action d-inline-flex gap-2">
                              <button class="btn btn-sm btn-outline-primary p-1" title="Edit" @click="openEditModal(c)">
                                <i class="ti ti-edit"></i>
                              </button>
                              <button class="btn btn-sm btn-outline-danger p-1" title="Delete" @click="deleteCurrency(idx)">
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
              <form @submit.prevent="saveCurrency">
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
                  <label class="form-label">Exchange Rate</label>
                  <input v-model="currentCurrency.exchangeRate" type="text" class="form-control" placeholder="Default or 15,500" />
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
  title: 'Currency Settings - Kacetak System'
})

const searchQuery = ref('')
const showModal = ref(false)
const isEditing = ref(false)

interface CurrencyItem {
  id?: number
  name: string
  code: string
  symbol: string
  exchangeRate: string
  createdOn: string
}

const currencies = ref<CurrencyItem[]>([
  { id: 1, name: 'Indonesian Rupiah', code: 'IDR', symbol: 'Rp', exchangeRate: 'Default', createdOn: '01 Jan 2023' },
  { id: 2, name: 'US Dollar', code: 'USD', symbol: '$', exchangeRate: '15,600', createdOn: '10 Jan 2023' },
  { id: 3, name: 'Euro', code: 'EUR', symbol: '€', exchangeRate: '16,900', createdOn: '12 Jul 2023' },
  { id: 4, name: 'Singapore Dollar', code: 'SGD', symbol: 'S$', exchangeRate: '11,700', createdOn: '14 Jul 2023' }
])

const currentCurrency = ref<CurrencyItem>({
  name: '',
  code: '',
  symbol: '',
  exchangeRate: '1.0',
  createdOn: ''
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
    exchangeRate: '1.0',
    createdOn: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  }
  showModal.value = true
}

const openEditModal = (c: CurrencyItem) => {
  isEditing.value = true
  currentCurrency.value = { ...c }
  showModal.value = true
}

const saveCurrency = () => {
  if (isEditing.value) {
    const idx = currencies.value.findIndex(c => c.id === currentCurrency.value.id)
    if (idx !== -1) {
      currencies.value[idx] = { ...currentCurrency.value }
    }
  } else {
    currencies.value.unshift({
      id: Date.now(),
      ...currentCurrency.value
    })
  }
  showModal.value = false
}

const deleteCurrency = (idx: number) => {
  if (confirm('Are you sure you want to delete this currency?')) {
    currencies.value.splice(idx, 1)
  }
}

const refresh = () => {
  // refresh
}

const toggleCollapse = () => {
  // collapse
}
</script>
