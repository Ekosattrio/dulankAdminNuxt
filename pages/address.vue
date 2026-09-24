<script setup lang="ts">
import type { CustomerAddress, SupplierAddress, AddressFormData } from '~/types/address'
import AddressStats from '~/components/address/AddressStats.vue'
import AddressTable from '~/components/address/AddressTable.vue'
import AddressViewModal from '~/components/address/AddressViewModal.vue'
import AddressModal from '~/components/address/AddressModal.vue'
import FeatherIcon from '~/components/common/FeatherIcon.vue'

definePageMeta({
  layout: 'default'
})

useHead({
  title: 'Address List - Dulank Admin'
})

const { stats, customers, suppliers, pending, refresh, saveAddress, deleteAddress } = useAddress()

const activeTab = ref<'customer' | 'supplier'>('customer')
const searchQuery = ref('')
const filterStatus = ref('')

const isAddModalOpen = ref(false)
const isViewModalOpen = ref(false)
const selectedCustomer = ref<CustomerAddress | null>(null)
const selectedSupplier = ref<SupplierAddress | null>(null)

const filteredCustomers = computed(() => {
  return customers.value.filter((c) => {
    const q = searchQuery.value.toLowerCase()
    const matchSearch =
      !q ||
      c.name?.toLowerCase().includes(q) ||
      c.city?.toLowerCase().includes(q) ||
      c.province?.toLowerCase().includes(q) ||
      c.contact?.toLowerCase().includes(q)
    const matchStatus = !filterStatus.value || c.status.toLowerCase() === filterStatus.value.toLowerCase()
    return matchSearch && matchStatus
  })
})

const filteredSuppliers = computed(() => {
  return suppliers.value.filter((s) => {
    const q = searchQuery.value.toLowerCase()
    const matchSearch =
      !q ||
      s.user?.toLowerCase().includes(q) ||
      s.city?.toLowerCase().includes(q) ||
      s.province?.toLowerCase().includes(q) ||
      s.phone?.toLowerCase().includes(q)
    const matchStatus = !filterStatus.value || s.status.toLowerCase() === filterStatus.value.toLowerCase()
    return matchSearch && matchStatus
  })
})

const handleViewCustomer = (c: CustomerAddress) => {
  selectedCustomer.value = c
  selectedSupplier.value = null
  isViewModalOpen.value = true
}

const handleViewSupplier = (s: SupplierAddress) => {
  selectedSupplier.value = s
  selectedCustomer.value = null
  isViewModalOpen.value = true
}

const handleDeleteCustomer = async (id: string) => {
  if (confirm(`Are you sure you want to delete customer address ${id}?`)) {
    try {
      await deleteAddress(id)
    } catch (err) {
      console.error('Failed to delete address:', err)
    }
  }
}

const handleDeleteSupplier = async (id: string) => {
  if (confirm(`Are you sure you want to delete supplier address ${id}?`)) {
    try {
      await deleteAddress(id)
    } catch (err) {
      console.error('Failed to delete address:', err)
    }
  }
}

const handleSaveAddress = async (payload: AddressFormData) => {
  try {
    await saveAddress(payload)
    isAddModalOpen.value = false
  } catch (err) {
    console.error('Failed to save address:', err)
  }
}

const printTable = () => {
  window.print()
}

const exportPdf = () => {
  alert('Exporting address data to PDF...')
}
</script>

<template>
  <div class="page-wrapper mt-3">
    <div class="content container-fluid">
      <!-- Header -->
      <div class="page-header d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div class="page-title">
          <h4 class="fw-bold mb-1">Address List</h4>
          <h6 class="text-muted mb-0">Kelola database alamat pengiriman customer & supplier</h6>
        </div>
        <div class="d-flex align-items-center gap-2">
          <ul class="table-top-head d-flex align-items-center list-unstyled gap-2 mb-0">
            <li>
              <button type="button" class="btn btn-outline-secondary btn-sm" title="PDF" @click="exportPdf">
                <img src="/assets/img/icons/pdf.svg" alt="pdf" width="16" />
              </button>
            </li>
            <li>
              <button type="button" class="btn btn-outline-secondary btn-sm" title="Print" @click="printTable">
                <FeatherIcon name="printer" size="16" />
              </button>
            </li>
            <li>
              <button type="button" class="btn btn-outline-secondary btn-sm" title="Refresh" @click="refresh">
                <FeatherIcon name="rotate-cw" size="16" />
              </button>
            </li>
          </ul>
          <button type="button" class="btn btn-primary d-flex align-items-center gap-2" @click="isAddModalOpen = true">
            <FeatherIcon name="plus-circle" size="18" />
            <span>Add Address</span>
          </button>
        </div>
      </div>

      <!-- KPI Widgets -->
      <AddressStats :stats="stats" />

      <!-- Loading State -->
      <div v-if="pending" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <!-- Address Table Component -->
      <AddressTable
        v-else
        v-model:active-tab="activeTab"
        v-model:search-query="searchQuery"
        v-model:filter-status="filterStatus"
        :customers="filteredCustomers"
        :suppliers="filteredSuppliers"
        @view-customer="handleViewCustomer"
        @delete-customer="handleDeleteCustomer"
        @view-supplier="handleViewSupplier"
        @delete-supplier="handleDeleteSupplier"
      />
    </div>

    <!-- View Modal -->
    <AddressViewModal
      :is-open="isViewModalOpen"
      :customer-data="selectedCustomer"
      :supplier-data="selectedSupplier"
      @close="isViewModalOpen = false"
    />

    <!-- Add Modal -->
    <AddressModal
      :is-open="isAddModalOpen"
      @close="isAddModalOpen = false"
      @save="handleSaveAddress"
    />
  </div>
</template>
