<template>
  <div class="page-wrapper mt-3">
    <div class="content">
      <div class="page-header">
        <div class="add-item d-flex">
          <div class="page-title">
            <h4>Customer List</h4>
            <h6>Manage registered customers and address directories</h6>
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
            <i class="ti ti-circle-plus me-1"></i>Add New Customer
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
                <input v-model="searchQuery" type="text" class="form-control" placeholder="Search customer ID, name, email, or phone..." />
              </div>
            </div>
            <div class="d-flex align-items-center gap-2">
              <select v-model="filterType" class="form-select form-select-sm" style="width: auto;">
                <option value="">All Customer Types</option>
                <option value="Corporate">Corporate</option>
                <option value="General">General</option>
                <option value="VIP">VIP</option>
                <option value="Reseller">Reseller</option>
              </select>
            </div>
          </div>

          <div class="table-responsive">
            <table class="table datanew">
              <thead class="thead-light">
                <tr>
                  <th>Customer ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Customer Type</th>
                  <th class="text-end">Balance</th>
                  <th>Contact No</th>
                  <th>Join Channel</th>
                  <th>Date Join</th>
                  <th>Last Seen</th>
                  <th class="text-center" style="width: 140px;">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="cust in filteredCustomers" :key="cust.id">
                  <td class="fw-bold text-primary">{{ cust.customerId }}</td>
                  <td class="fw-bold text-dark">{{ cust.name }}</td>
                  <td class="small text-muted">{{ cust.email }}</td>
                  <td>
                    <span class="badge bg-light text-dark border">{{ cust.type }}</span>
                  </td>
                  <td class="text-end fw-semibold">Rp {{ formatNumber(cust.balance) }}</td>
                  <td>{{ cust.phone }}</td>
                  <td>
                    <span :class="cust.channel === 'Website' ? 'badge bg-info bg-opacity-10 text-info' : 'badge bg-secondary bg-opacity-10 text-secondary'">
                      {{ cust.channel }}
                    </span>
                  </td>
                  <td class="small">{{ cust.dateJoin }}</td>
                  <td class="small text-muted">{{ cust.lastSeen }}</td>
                  <td class="text-center action-table-data">
                    <div class="edit-delete-action d-inline-flex gap-1">
                      <button class="btn btn-sm btn-icon text-secondary" title="Manage Addresses" @click="openAddressModal(cust)">
                        <i class="ti ti-map-pin"></i>
                      </button>
                      <button class="btn btn-sm btn-icon text-info" title="View Detail" @click="viewCustomer(cust)">
                        <i class="ti ti-eye"></i>
                      </button>
                      <button class="btn btn-sm btn-icon text-primary" title="Edit" @click="openEditModal(cust)">
                        <i class="ti ti-edit"></i>
                      </button>
                      <button class="btn btn-sm btn-icon text-danger" title="Delete" @click="deleteCustomer(cust.id)">
                        <i class="ti ti-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="filteredCustomers.length === 0">
                  <td colspan="10" class="text-center py-4 text-muted">
                    No customers found matching the search.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Add / Edit Customer Modal -->
    <div v-if="customerModalVisible" class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.5)">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header border-0">
            <h5 class="modal-title font-bold">{{ isEditing ? 'Edit Customer' : 'Add New Customer' }}</h5>
            <button type="button" class="btn-close" @click="customerModalVisible = false"></button>
          </div>
          <form @submit.prevent="saveCustomer">
            <div class="modal-body pt-0">
              <div class="mb-3">
                <label class="form-label">Full Name <span class="text-danger">*</span></label>
                <input v-model="formData.name" type="text" class="form-control" required />
              </div>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">Email <span class="text-danger">*</span></label>
                  <input v-model="formData.email" type="email" class="form-control" required />
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Contact No <span class="text-danger">*</span></label>
                  <input v-model="formData.phone" type="text" class="form-control" required />
                </div>
              </div>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">Customer Type</label>
                  <select v-model="formData.type" class="form-select">
                    <option value="General">General</option>
                    <option value="Corporate">Corporate</option>
                    <option value="VIP">VIP</option>
                    <option value="Reseller">Reseller</option>
                  </select>
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Initial Balance (Rp)</label>
                  <input v-model.number="formData.balance" type="number" class="form-control" min="0" />
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label">Primary Address</label>
                <textarea v-model="formData.address" class="form-control" rows="2"></textarea>
              </div>
            </div>
            <div class="modal-footer border-0 justify-content-end gap-2">
              <button type="button" class="btn btn-secondary" @click="customerModalVisible = false">Cancel</button>
              <button type="submit" class="btn btn-primary">{{ isEditing ? 'Update Customer' : 'Save Customer' }}</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Manage Addresses Modal -->
    <div v-if="addressModalVisible" class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.5)">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header border-0">
            <h5 class="modal-title font-bold">Addresses: {{ selectedCustomer?.name }}</h5>
            <button type="button" class="btn-close" @click="addressModalVisible = false"></button>
          </div>
          <div class="modal-body pt-0" v-if="selectedCustomer">
            <div class="p-3 bg-light rounded-3 mb-3 border">
              <span class="badge bg-primary mb-1">Primary Address</span>
              <div class="text-dark">{{ selectedCustomer.address || 'No primary address recorded' }}</div>
            </div>

            <h6 class="fw-bold mb-2">Add New Shipping Address</h6>
            <div class="mb-2">
              <input v-model="newAddressInput" type="text" class="form-control form-control-sm" placeholder="Input complete destination address..." />
            </div>
            <button type="button" class="btn btn-sm btn-outline-primary" @click="addAddress">
              <i class="ti ti-plus me-1"></i>Add Address
            </button>
          </div>
          <div class="modal-footer border-0">
            <button type="button" class="btn btn-secondary" @click="addressModalVisible = false">Close</button>
          </div>
        </div>
      </div>
    </div>

    <!-- View Detail Modal -->
    <div v-if="detailModalVisible" class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.5)">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header border-0">
            <h5 class="modal-title font-bold">Customer Details: {{ selectedCustomer?.customerId }}</h5>
            <button type="button" class="btn-close" @click="detailModalVisible = false"></button>
          </div>
          <div class="modal-body pt-0" v-if="selectedCustomer">
            <ul class="list-group list-group-flush">
              <li class="list-group-item d-flex justify-content-between">
                <span class="text-muted">Name</span>
                <span class="fw-bold">{{ selectedCustomer.name }}</span>
              </li>
              <li class="list-group-item d-flex justify-content-between">
                <span class="text-muted">Email</span>
                <span>{{ selectedCustomer.email }}</span>
              </li>
              <li class="list-group-item d-flex justify-content-between">
                <span class="text-muted">Phone</span>
                <span>{{ selectedCustomer.phone }}</span>
              </li>
              <li class="list-group-item d-flex justify-content-between">
                <span class="text-muted">Customer Type</span>
                <span class="badge bg-light text-dark border">{{ selectedCustomer.type }}</span>
              </li>
              <li class="list-group-item d-flex justify-content-between">
                <span class="text-muted">Account Balance</span>
                <span class="fw-bold text-success">Rp {{ formatNumber(selectedCustomer.balance) }}</span>
              </li>
              <li class="list-group-item d-flex justify-content-between">
                <span class="text-muted">Join Date</span>
                <span>{{ selectedCustomer.dateJoin }}</span>
              </li>
              <li class="list-group-item">
                <div class="text-muted small mb-1">Shipping Address</div>
                <div>{{ selectedCustomer.address || '-' }}</div>
              </li>
            </ul>
          </div>
          <div class="modal-footer border-0">
            <button type="button" class="btn btn-secondary" @click="detailModalVisible = false">Close</button>
          </div>
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
  title: 'Customer List - Kacetak System'
})

interface Customer {
  id: number
  customerId: string
  name: string
  email: string
  type: string
  balance: number
  phone: string
  channel: string
  dateJoin: string
  lastSeen: string
  address: string
}

const customers = ref<Customer[]>([
  { id: 1, customerId: 'ID000001', name: 'Aditya Pratama', email: 'aditya.pratama@gmail.com', type: 'Corporate', balance: 15000000, phone: '+6281234567890', channel: 'Website', dateJoin: '01/12/2025 9:15', lastSeen: '01/12/2025 9:15', address: 'Jl. Riau No. 12, Bandung' },
  { id: 2, customerId: 'ID000002', name: 'Siti Aminah', email: 'siti.aminah@yahoo.co.id', type: 'General', balance: 750000, phone: '+6281398765432', channel: 'Offline', dateJoin: '03/12/2025 10:30', lastSeen: '03/12/2025 10:30', address: 'Jl. Surya Kencana No. 40, Bogor' },
  { id: 3, customerId: 'ID000003', name: 'Budi Santoso', email: 'budi.santoso@outlook.com', type: 'VIP', balance: 5400000, phone: '+625211223344', channel: 'Website', dateJoin: '05/12/2025 14:45', lastSeen: '05/12/2025 14:45', address: 'Jl. Gatot Subroto Kav. 51, Jakarta' },
  { id: 4, customerId: 'ID000004', name: 'Dewi Lestari', email: 'dewi.lestari@gmail.com', type: 'Reseller', balance: 2150000, phone: '+6281155667788', channel: 'Website', dateJoin: '08/12/2025 11:20', lastSeen: '08/12/2025 11:20', address: 'Jl. Diponegoro No. 8, Cirebon' }
])

const searchQuery = ref('')
const filterType = ref('')

const filteredCustomers = computed(() => {
  return customers.value.filter(c => {
    const matchSearch =
      c.customerId.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      c.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      c.phone.includes(searchQuery.value)
    const matchType = filterType.value ? c.type === filterType.value : true
    return matchSearch && matchType
  })
})

function formatNumber(val: number): string {
  return new Intl.NumberFormat('id-ID').format(val)
}

// Modal Form
const customerModalVisible = ref(false)
const isEditing = ref(false)
const formData = reactive({
  id: 0,
  name: '',
  email: '',
  phone: '',
  type: 'General',
  balance: 0,
  address: ''
})

function openAddModal() {
  isEditing.value = false
  formData.id = 0
  formData.name = ''
  formData.email = ''
  formData.phone = ''
  formData.type = 'General'
  formData.balance = 0
  formData.address = ''
  customerModalVisible.value = true
}

function openEditModal(c: Customer) {
  isEditing.value = true
  formData.id = c.id
  formData.name = c.name
  formData.email = c.email
  formData.phone = c.phone
  formData.type = c.type
  formData.balance = c.balance
  formData.address = c.address
  customerModalVisible.value = true
}

function saveCustomer() {
  if (isEditing.value) {
    const idx = customers.value.findIndex(c => c.id === formData.id)
    if (idx !== -1) {
      customers.value[idx] = {
        ...customers.value[idx],
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        type: formData.type,
        balance: formData.balance,
        address: formData.address
      }
    }
  } else {
    customers.value.unshift({
      id: Date.now(),
      customerId: 'ID00000' + (customers.value.length + 1),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      type: formData.type,
      balance: formData.balance,
      address: formData.address,
      channel: 'Website',
      dateJoin: new Date().toLocaleDateString('en-GB') + ' ' + new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
      lastSeen: 'Just now'
    })
  }
  customerModalVisible.value = false
}

function deleteCustomer(id: number) {
  if (confirm('Are you sure you want to delete this customer?')) {
    customers.value = customers.value.filter(c => c.id !== id)
  }
}

// Address & Detail Modals
const addressModalVisible = ref(false)
const detailModalVisible = ref(false)
const selectedCustomer = ref<Customer | null>(null)
const newAddressInput = ref('')

function openAddressModal(c: Customer) {
  selectedCustomer.value = c
  newAddressInput.value = ''
  addressModalVisible.value = true
}

function addAddress() {
  if (selectedCustomer.value && newAddressInput.value) {
    selectedCustomer.value.address = newAddressInput.value
    alert('Address saved successfully!')
    addressModalVisible.value = false
  }
}

function viewCustomer(c: Customer) {
  selectedCustomer.value = c
  detailModalVisible.value = true
}

function exportPdf() {
  alert('Exporting customers PDF...')
}

function printTable() {
  window.print()
}

function refresh() {
  searchQuery.value = ''
  filterType.value = ''
}
</script>
