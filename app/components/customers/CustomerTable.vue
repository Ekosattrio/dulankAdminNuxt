<script setup lang="ts">
import type { Customer } from '~/types/customer'
import { formatNumber } from '~/composables/useFormatters'
import FeatherIcon from '~/components/common/FeatherIcon.vue'

const props = defineProps<{
  customers: Customer[]
  searchQuery: string
  filterType: string
}>()

const emit = defineEmits<{
  (e: 'update:searchQuery', val: string): void
  (e: 'update:filterType', val: string): void
  (e: 'add-customer'): void
  (e: 'add-address', customer: Customer): void
  (e: 'view-customer', customer: Customer): void
  (e: 'edit-customer', customer: Customer): void
  (e: 'delete-customer', id: string): void
  (e: 'export-pdf'): void
  (e: 'print-table'): void
  (e: 'refresh'): void
}>()

// Pagination
const currentPage = ref(1)
const itemsPerPage = ref(10)

const paginatedList = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return props.customers.slice(start, start + itemsPerPage.value)
})

const totalPages = computed(() => {
  return Math.ceil(props.customers.length / itemsPerPage.value) || 1
})

const changePage = (p: number) => {
  if (p >= 1 && p <= totalPages.value) currentPage.value = p
}

watch(() => [props.searchQuery, props.filterType], () => {
  currentPage.value = 1
})
</script>

<template>
  <div class="card table-list-card shadow-sm border rounded-3 bg-white mb-4">
    <div class="card-body p-4">
      <!-- Filter Bar -->
      <div class="table-top d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4">
        <!-- Search Input -->
        <div class="search-set d-flex align-items-center gap-2 flex-wrap">
          <div class="search-input position-relative">
            <div class="input-group">
              <span class="input-group-text bg-light border-end-0">
                <FeatherIcon name="search" size="14" class="text-muted" />
              </span>
              <input
                :value="searchQuery"
                type="text"
                class="form-control border-start-0"
                placeholder="Search customer ID, name, email, or phone..."
                @input="emit('update:searchQuery', ($event.target as HTMLInputElement).value)"
              />
            </div>
          </div>
        </div>

        <!-- Filter Right -->
        <div class="filters d-flex align-items-center gap-2 flex-wrap">
          <!-- Type Filter -->
          <select
            :value="filterType"
            class="form-select form-select-sm"
            style="min-width: 160px;"
            @change="emit('update:filterType', ($event.target as HTMLSelectElement).value)"
          >
            <option value="">All Customer Types</option>
            <option value="Corporate">Corporate</option>
            <option value="General">General</option>
            <option value="VIP">VIP</option>
            <option value="Reseller">Reseller</option>
          </select>

          <!-- Add Customer Button -->
          <button
            type="button"
            class="btn btn-primary btn-sm px-3 d-inline-flex align-items-center gap-1"
            @click="emit('add-customer')"
          >
            <FeatherIcon name="plus-circle" size="14" />
            <span>Add Customer</span>
          </button>
        </div>
      </div>

      <!-- Data Table -->
      <div class="table-responsive">
        <table class="table datanew align-middle mb-0">
          <thead class="table-light">
            <tr>
              <th class="fw-bold">Customer ID</th>
              <th class="fw-bold">Name</th>
              <th class="fw-bold">Email</th>
              <th class="fw-bold">Customer Type</th>
              <th class="fw-bold text-end">Balance</th>
              <th class="fw-bold">Contact No</th>
              <th class="fw-bold">Join Channel</th>
              <th class="fw-bold">Date Join</th>
              <th class="fw-bold">Last Seen</th>
              <th class="fw-bold text-center no-sort" style="width: 170px;">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="paginatedList.length === 0">
              <td colspan="10" class="text-center py-4 text-muted">
                No customers found matching filter.
              </td>
            </tr>
            <tr v-for="cust in paginatedList" :key="cust.id">
              <td class="fw-bold text-primary font-monospace">{{ cust.customerId }}</td>
              <td class="fw-bold text-dark">{{ cust.name }}</td>
              <td class="small text-muted">{{ cust.email }}</td>
              <td>
                <span class="badge bg-light text-dark border">{{ cust.type }}</span>
              </td>
              <td class="text-end fw-semibold">Rp {{ formatNumber(cust.balance) }}</td>
              <td class="font-monospace small">{{ cust.phone }}</td>
              <td>
                <span
                  class="badge px-2 py-1"
                  :class="cust.channel === 'Website' ? 'bg-info bg-opacity-10 text-info' : 'bg-secondary bg-opacity-10 text-secondary'"
                >
                  {{ cust.channel }}
                </span>
              </td>
              <td class="small">{{ cust.dateJoin }}</td>
              <td class="small text-muted">{{ cust.lastSeen }}</td>
              <td class="text-center action-table-data">
                <div class="edit-delete-action d-inline-flex gap-1">
                  <!-- Flow link ke Add Address Modal -->
                  <button
                    type="button"
                    class="btn btn-sm btn-outline-warning p-1"
                    title="Add Address for this Customer"
                    @click="emit('add-address', cust)"
                  >
                    <FeatherIcon name="map-pin" size="14" />
                  </button>
                  <button
                    type="button"
                    class="btn btn-sm btn-outline-info p-1"
                    title="View Detail"
                    @click="emit('view-customer', cust)"
                  >
                    <FeatherIcon name="eye" size="14" />
                  </button>
                  <button
                    type="button"
                    class="btn btn-sm btn-outline-primary p-1"
                    title="Edit Customer"
                    @click="emit('edit-customer', cust)"
                  >
                    <FeatherIcon name="edit" size="14" />
                  </button>
                  <button
                    type="button"
                    class="btn btn-sm btn-outline-danger p-1"
                    title="Delete Customer"
                    @click="emit('delete-customer', cust.id)"
                  >
                    <FeatherIcon name="trash-2" size="14" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="d-flex align-items-center justify-content-between flex-wrap gap-2 pt-3 mt-3 border-top">
        <div class="text-muted small">
          Showing
          {{ customers.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1 }}
          to
          {{ Math.min(currentPage * itemsPerPage, customers.length) }}
          of {{ customers.length }} entries
        </div>
        <div class="d-flex align-items-center gap-1">
          <button
            type="button"
            class="btn btn-sm btn-outline-secondary px-2"
            :disabled="currentPage === 1"
            @click="changePage(currentPage - 1)"
          >
            Prev
          </button>
          <button
            v-for="p in totalPages"
            :key="p"
            type="button"
            class="btn btn-sm px-3"
            :class="currentPage === p ? 'btn-primary' : 'btn-outline-secondary'"
            @click="changePage(p)"
          >
            {{ p }}
          </button>
          <button
            type="button"
            class="btn btn-sm btn-outline-secondary px-2"
            :disabled="currentPage === totalPages"
            @click="changePage(currentPage + 1)"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.table.datanew th {
  font-size: 13px;
  color: #495057;
  padding: 12px 10px;
}

.table.datanew td {
  font-size: 13px;
  padding: 12px 10px;
}
</style>

