<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <CommonPageHeader title="Internal Paper Types" subtitle="Manage your workshop's own paper types, prices, and stock units">
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
            <span>Add New Paper Type</span>
          </button>
        </div>
      </template>
    </CommonPageHeader>

    <!-- Data Table Card -->
    <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="mb-5">
        <CommonSearchFilter v-model="searchQuery" placeholder="Search paper name or merk..." />
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-start text-xs text-gray-700 dark:text-gray-300">
          <thead
            class="bg-gray-50 text-[11px] font-semibold uppercase text-gray-500 border-b border-gray-200 dark:bg-gray-800/50 dark:border-gray-700 dark:text-gray-400"
          >
            <tr>
              <th class="px-4 py-3 text-start whitespace-nowrap">Nama Kertas</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Merk</th>
              <th class="px-4 py-3 text-end whitespace-nowrap">Harga (Rp)</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Price Model</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Unit Price</th>
              <th class="px-4 py-3 text-center whitespace-nowrap">GSM</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Plano Size</th>
              <th class="px-4 py-3 text-end whitespace-nowrap">Stock</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Unit Stock</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Status</th>
              <th class="px-4 py-3 text-center whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <tr v-for="item in filteredItems" :key="item.id" class="transition-colors hover:bg-gray-50/75 dark:hover:bg-gray-800/40">
              <td class="px-4 py-3 whitespace-nowrap font-bold text-gray-900 dark:text-gray-100">{{ item.name }}</td>
              <td class="px-4 py-3 whitespace-nowrap">{{ item.merk }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-end font-semibold">Rp {{ formatNumber(item.price) }}</td>
              <td class="px-4 py-3 whitespace-nowrap">
                <span class="inline-flex rounded-full border border-gray-200 bg-gray-50 px-2.5 py-0.5 text-[11px] text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">{{ item.priceType }}</span>
              </td>
              <td class="px-4 py-3 whitespace-nowrap">{{ item.unitPrice }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-center font-bold">{{ item.gsm }}</td>
              <td class="px-4 py-3 whitespace-nowrap">
                <span class="inline-flex rounded-md border border-gray-200 bg-gray-50 px-2 py-0.5 font-mono text-[11px] text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">{{ item.size }}</span>
              </td>
              <td :class="item.stock < 100 ? 'px-4 py-3 whitespace-nowrap text-end font-bold text-rose-600 dark:text-rose-400' : 'px-4 py-3 whitespace-nowrap text-end font-bold text-gray-900 dark:text-gray-100'">
                {{ formatNumber(item.stock) }}
              </td>
              <td class="px-4 py-3 whitespace-nowrap">{{ item.unitStock }}</td>
              <td class="px-4 py-3 whitespace-nowrap">
                <CommonStatusPill :status="item.status" />
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-center">
                <CommonRowActions :item="item" @edit="openEditModal(item)" @delete="deleteItem(item.id)" />
              </td>
            </tr>
            <tr v-if="filteredItems.length === 0">
              <td colspan="11" class="p-8 text-center text-gray-400">No paper types found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <CommonBaseModal v-model="modalVisible" :title="isEdit ? 'Edit Paper Type' : 'Add New Paper Type'" maxWidth="lg">
      <form @submit.prevent="saveItem" class="space-y-4">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <CommonFormField label="Paper Name" required>
            <input
              v-model="form.name"
              type="text"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              required
              placeholder="e.g. Art Paper"
            />
          </CommonFormField>
          <CommonFormField label="Merk / Brand">
            <input
              v-model="form.merk"
              type="text"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              placeholder="e.g. Pindo Deli"
            />
          </CommonFormField>
        </div>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <CommonFormField label="Price (Rp)" required>
            <input
              v-model.number="form.price"
              type="number"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              required
              placeholder="52000"
            />
          </CommonFormField>
          <CommonFormField label="Price Model">
            <select
              v-model="form.priceType"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            >
              <option value="Group">Group / Plano</option>
              <option value="Kg">Per Kg</option>
              <option value="Sheet">Per Sheet</option>
            </select>
          </CommonFormField>
        </div>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <CommonFormField label="Unit Price">
            <input
              v-model="form.unitPrice"
              type="text"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              placeholder="Kg, Lembar, Plano"
            />
          </CommonFormField>
          <CommonFormField label="Gramatur (GSM)" required>
            <input
              v-model.number="form.gsm"
              type="text"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              required
            />
          </CommonFormField>
        </div>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <CommonFormField label="Plano Size (cm)">
            <input
              v-model="form.size"
              type="text"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              placeholder="65x100"
            />
          </CommonFormField>
          <CommonToggleSwitch v-model="formActive" label="Status Active" />
        </div>
        <CommonModalFooter :submit-label="isEdit ? 'Update' : 'Submit'" @cancel="closeModal" />
      </form>
    </CommonBaseModal>
  </div>
</template>

<script setup lang="ts">import { ref, computed } from 'vue'

const { data: kertasJenisSelfData } = await useFetch<SelfPaperType[]>('/api/kertas-jenis-self')
const items = ref<SelfPaperType[]>(kertasJenisSelfData.value ?? [])
useMockSync('kertas-jenis-self', items)

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