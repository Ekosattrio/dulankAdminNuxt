<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <CommonPageHeader title="Customer List" subtitle="Manage registered customers and address directories">
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
            <span>Add New Customer</span>
          </button>
        </div>
      </template>
    </CommonPageHeader>

    <!-- Table Card -->
    <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <!-- Toolbar -->
      <div class="mb-5 flex flex-wrap items-center justify-between gap-4">
        <CommonSearchFilter v-model="searchQuery" placeholder="Search customer ID, name, email, or phone..." />
        <CommonFilterSelect
          v-model="filterType"
          allLabel="All Customer Types"
          :options="[
            { value: 'Corporate', label: 'Corporate' },
            { value: 'General', label: 'General' },
            { value: 'VIP', label: 'VIP' },
            { value: 'Reseller', label: 'Reseller' },
          ]"
        />
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="w-full text-start text-xs text-gray-700 dark:text-gray-300">
          <thead
            class="bg-gray-50 text-[11px] font-semibold uppercase text-gray-500 border-b border-gray-200 dark:bg-gray-800/50 dark:border-gray-700 dark:text-gray-400"
          >
            <tr>
              <th class="px-4 py-3 text-start whitespace-nowrap">Customer ID</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Name</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Email</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Customer Type</th>
              <th class="px-4 py-3 text-end whitespace-nowrap">Balance</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Contact No</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Join Channel</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Date Join</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Last Seen</th>
              <th class="px-4 py-3 text-center whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <tr v-for="cust in filteredCustomers" :key="cust.id" class="transition-colors hover:bg-gray-50/75 dark:hover:bg-gray-800/40">
              <td class="px-4 py-3 whitespace-nowrap font-bold text-primary">{{ cust.customerId }}</td>
              <td class="px-4 py-3 whitespace-nowrap font-semibold text-gray-900 dark:text-gray-100">{{ cust.name }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-gray-500 dark:text-gray-400">{{ cust.email }}</td>
              <td class="px-4 py-3 whitespace-nowrap">
                <CommonStatusPill :status="cust.type" tone="slate" />
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-end font-semibold">Rp {{ formatNumber(cust.balance) }}</td>
              <td class="px-4 py-3 whitespace-nowrap">{{ cust.phone }}</td>
              <td class="px-4 py-3 whitespace-nowrap">
                <CommonStatusPill :status="cust.channel" :tone="cust.channel === 'Website' ? 'sky' : 'slate'" />
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-gray-500 dark:text-gray-400">{{ cust.dateJoin }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-gray-500 dark:text-gray-400">{{ cust.lastSeen }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-center">
                <CommonRowActions :item="cust" show-view @view="viewCustomer(cust)" @edit="openEditModal(cust)" @delete="deleteCustomer(cust.id)">
                  <template #extra>
                    <button
                      type="button"
                      class="rounded-lg p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-sky-500 dark:hover:bg-gray-800"
                      title="Manage Addresses"
                      @click="openAddressModal(cust)"
                    >
                      <CommonFeatherIcon name="map-pin" size="16" />
                    </button>
                  </template>
                </CommonRowActions>
              </td>
            </tr>
            <tr v-if="filteredCustomers.length === 0">
              <td colspan="10" class="p-8 text-center text-gray-400">No customers found matching the search.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add / Edit Customer Modal -->
    <CommonBaseModal v-model="customerModalVisible" :title="isEditing ? 'Edit Customer' : 'Add New Customer'" maxWidth="lg">
      <form @submit.prevent="saveCustomer" class="space-y-4">
        <CommonFormField label="Full Name" required>
          <input
            v-model="formData.name"
            type="text"
            class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            required
          />
        </CommonFormField>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <CommonFormField label="Email" required>
            <input
              v-model="formData.email"
              type="email"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              required
            />
          </CommonFormField>
          <CommonFormField label="Contact No" required>
            <input
              v-model="formData.phone"
              type="text"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              required
            />
          </CommonFormField>
        </div>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <CommonFormField label="Customer Type">
            <select
              v-model="formData.type"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            >
              <option value="General">General</option>
              <option value="Corporate">Corporate</option>
              <option value="VIP">VIP</option>
              <option value="Reseller">Reseller</option>
            </select>
          </CommonFormField>
          <CommonFormField label="Initial Balance (Rp)">
            <input
              v-model.number="formData.balance"
              type="number"
              min="0"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            />
          </CommonFormField>
        </div>
        <CommonFormField label="Primary Address">
          <textarea
            v-model="formData.address"
            rows="2"
            class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          ></textarea>
        </CommonFormField>
        <CommonModalFooter :submit-label="isEditing ? 'Update Customer' : 'Save Customer'" @cancel="customerModalVisible = false" />
      </form>
    </CommonBaseModal>

    <!-- Manage Addresses Modal -->
    <CommonBaseModal v-model="addressModalVisible" :title="`Addresses: ${selectedCustomer?.name ?? ''}`" maxWidth="md">
      <div v-if="selectedCustomer" class="space-y-4">
        <div class="rounded-lg border border-gray-100 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-800/40">
          <CommonStatusPill status="Primary Address" tone="emerald" class="mb-1" />
          <div class="mt-1 text-sm text-gray-800 dark:text-gray-200">
            {{ selectedCustomer.address || 'No primary address recorded' }}
          </div>
        </div>

        <div>
          <h6 class="mb-2 text-sm font-bold text-gray-800 dark:text-gray-200">Add New Shipping Address</h6>
          <input
            v-model="newAddressInput"
            type="text"
            placeholder="Input complete destination address..."
            class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          />
        </div>
        <div class="flex justify-end">
          <button
            type="button"
            class="inline-flex items-center gap-1.5 rounded-lg border border-primary px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
            @click="addAddress"
          >
            <CommonFeatherIcon name="plus" size="16" />
            Add Address
          </button>
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end">
          <button
            type="button"
            class="rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
            @click="addressModalVisible = false"
          >
            Close
          </button>
        </div>
      </template>
    </CommonBaseModal>

    <!-- View Detail Modal -->
    <CommonBaseModal v-model="detailModalVisible" :title="`Customer Details: ${selectedCustomer?.customerId ?? ''}`" maxWidth="md">
      <div v-if="selectedCustomer" class="divide-y divide-gray-100 dark:divide-gray-800">
        <div class="flex items-center justify-between py-2.5">
          <span class="text-gray-500 dark:text-gray-400">Name</span>
          <span class="font-semibold text-gray-800 dark:text-gray-200">{{ selectedCustomer.name }}</span>
        </div>
        <div class="flex items-center justify-between py-2.5">
          <span class="text-gray-500 dark:text-gray-400">Email</span>
          <span class="text-gray-800 dark:text-gray-200">{{ selectedCustomer.email }}</span>
        </div>
        <div class="flex items-center justify-between py-2.5">
          <span class="text-gray-500 dark:text-gray-400">Phone</span>
          <span class="text-gray-800 dark:text-gray-200">{{ selectedCustomer.phone }}</span>
        </div>
        <div class="flex items-center justify-between py-2.5">
          <span class="text-gray-500 dark:text-gray-400">Customer Type</span>
          <CommonStatusPill :status="selectedCustomer.type" tone="slate" />
        </div>
        <div class="flex items-center justify-between py-2.5">
          <span class="text-gray-500 dark:text-gray-400">Account Balance</span>
          <span class="font-bold text-emerald-600 dark:text-emerald-400">Rp {{ formatNumber(selectedCustomer.balance) }}</span>
        </div>
        <div class="flex items-center justify-between py-2.5">
          <span class="text-gray-500 dark:text-gray-400">Join Date</span>
          <span class="text-gray-800 dark:text-gray-200">{{ selectedCustomer.dateJoin }}</span>
        </div>
        <div class="py-2.5">
          <div class="mb-1 text-xs text-gray-400">Shipping Address</div>
          <div class="text-sm text-gray-800 dark:text-gray-200">{{ selectedCustomer.address || '-' }}</div>
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end">
          <button
            type="button"
            class="rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
            @click="detailModalVisible = false"
          >
            Close
          </button>
        </div>
      </template>
    </CommonBaseModal>
  </div>
</template>

<script setup lang="ts">definePageMeta({
  layout: 'default'
})

useHead({
  title: 'Customer List - Kacetak System'
})

const { data: customersData } = await useFetch<CustomerRecord[]>('/api/customers')
const customers = ref<CustomerRecord[]>(customersData.value ?? [])
useMockSync('customers', customers)

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

function openEditModal(c: CustomerRecord) {
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
const selectedCustomer = ref<CustomerRecord | null>(null)
const newAddressInput = ref('')

function openAddressModal(c: CustomerRecord) {
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

function viewCustomer(c: CustomerRecord) {
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
}</script>