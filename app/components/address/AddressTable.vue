<script setup lang="ts">
import type { CustomerAddress, SupplierAddress } from '#server/types/address'

const props = defineProps<{
  activeTab: 'customer' | 'supplier'
  searchQuery: string
  filterStatus: string
  customers: CustomerAddress[]
  suppliers: SupplierAddress[]
}>()

const emit = defineEmits<{
  'update:activeTab': [value: 'customer' | 'supplier']
  'update:searchQuery': [value: string]
  'update:filterStatus': [value: string]
  'view-customer': [value: CustomerAddress]
  'view-supplier': [value: SupplierAddress]
  'delete-customer': [id: string]
  'delete-supplier': [id: string]
}>()

const customerColumns = [
  ['id', 'ID Address'], ['customerId', 'ID Customer'], ['name', 'Name'],
  ['contact', 'Contact'], ['province', 'Province'], ['city', 'City'],
  ['district', 'District'], ['detailAddress', 'Detail Address'],
  ['otherDetail', 'Other Detail'], ['status', 'Status'], ['date', 'Date'],
] as const
const supplierColumns = [
  ['userId', 'ID Pengguna'], ['user', 'User'], ['phone', 'Nomor Telepon'],
  ['fullAddress', 'Alamat Lengkap'], ['district', 'Kecamatan'], ['city', 'Kota'],
  ['province', 'Provinsi'], ['postalCode', 'Kode Pos'], ['channel', 'Channel'],
  ['dateAdded', 'Tanggal Ditambahkan'], ['status', 'Status'],
] as const
const columns = computed(() => props.activeTab === 'customer' ? customerColumns : supplierColumns)
const rows = computed(() => props.activeTab === 'customer' ? props.customers : props.suppliers)
const statuses = computed(() => props.activeTab === 'customer'
  ? ['Home', 'Work', 'Office', ...props.customers.map(item => item.status)]
  : ['Aktif', 'Dinonaktifkan', ...props.suppliers.map(item => item.status)])

function selectTab(tab: 'customer' | 'supplier') {
  emit('update:activeTab', tab)
  emit('update:filterStatus', '')
}

function viewAddress(row: CustomerAddress | SupplierAddress) {
  if ('customerId' in row) emit('view-customer', row)
  else emit('view-supplier', row)
}

function deleteAddress(row: CustomerAddress | SupplierAddress) {
  if ('customerId' in row) emit('delete-customer', row.id)
  else emit('delete-supplier', row.id)
}

function cellValue(row: CustomerAddress | SupplierAddress, field: string): string {
  return String(Reflect.get(row, field) ?? '')
}
</script>

<template>
  <section class="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
    <div class="flex gap-6 border-b border-gray-200 px-5 dark:border-gray-800" role="tablist" aria-label="Address type">
      <button v-for="tab in (['customer', 'supplier'] as const)" :id="`address-tab-${tab}`" :key="tab" type="button" role="tab" :aria-selected="activeTab === tab" aria-controls="address-panel" :class="['border-b-2 py-4 font-semibold capitalize', activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-gray-500']" @click="selectTab(tab)">
        {{ tab }} Address
      </button>
    </div>
    <div class="flex flex-wrap items-center justify-between gap-3 p-5">
      <label class="relative w-full sm:w-72">
        <span class="sr-only">Search addresses</span>
        <FeatherIcon name="search" class="absolute start-3 top-3 text-gray-400" :size="16" />
        <input :value="searchQuery" type="search" placeholder="Search" class="w-full rounded-md border border-gray-300 bg-transparent py-2 ps-9 pe-3 outline-none focus:border-primary dark:border-gray-700" @input="emit('update:searchQuery', ($event.target as HTMLInputElement).value)" />
      </label>
      <label>
        <span class="sr-only">Filter status</span>
        <select :value="filterStatus" class="rounded-md border border-gray-300 bg-white px-3 py-2 dark:border-gray-700 dark:bg-gray-900" @change="emit('update:filterStatus', ($event.target as HTMLSelectElement).value)">
          <option value="">All Status</option>
          <option v-for="status in [...new Set(statuses)]" :key="status" :value="status">{{ status }}</option>
        </select>
      </label>
    </div>
    <div id="address-panel" role="tabpanel" :aria-labelledby="`address-tab-${activeTab}`" class="overflow-x-auto">
      <table class="w-full text-start text-sm">
        <thead class="bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
          <tr><th v-for="[field, label] in columns" :key="field" scope="col" class="whitespace-nowrap px-4 py-3 text-start font-semibold">{{ label }}</th><th scope="col" class="px-4 py-3 text-start">Action</th></tr>
        </thead>
        <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
          <tr v-for="row in rows" :key="row.id" class="hover:bg-gray-50 dark:hover:bg-gray-800/50">
            <td v-for="[field] in columns" :key="field" class="px-4 py-3">
              <span v-if="field === 'status'" class="rounded bg-primary/10 px-2 py-1 text-xs text-primary">{{ row.status }}</span>
              <span v-else class="block min-w-max max-w-sm">{{ cellValue(row, field) || '—' }}</span>
            </td>
            <td class="px-4 py-3"><div class="flex items-center gap-2">
              <button type="button" :aria-label="`View address ${row.id}`" class="rounded border border-gray-200 p-2 hover:text-primary dark:border-gray-700" @click="viewAddress(row)"><FeatherIcon name="eye" :size="16" /></button>
              <button type="button" :aria-label="`Delete address ${row.id}`" class="rounded border border-gray-200 p-2 hover:text-danger dark:border-gray-700" @click="deleteAddress(row)"><FeatherIcon name="trash-2" :size="16" /></button>
            </div></td>
          </tr>
          <tr v-if="!rows.length"><td :colspan="columns.length + 1" class="p-8 text-center text-gray-500">No addresses found.</td></tr>
        </tbody>
      </table>
    </div>
    <p class="border-t border-gray-200 px-5 py-3 text-sm text-gray-500 dark:border-gray-800">{{ rows.length }} addresses</p>
  </section>
</template>
