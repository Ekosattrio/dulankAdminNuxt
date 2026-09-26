<script setup lang="ts">
import type { DeliveryNote } from '~/types/delivery-note'
import FeatherIcon from '~/components/common/FeatherIcon.vue'

const props = defineProps<{
  deliveryNotes: DeliveryNote[]
  searchQuery: string
  filterStatus: string
}>()

const emit = defineEmits<{
  (e: 'update:searchQuery', val: string): void
  (e: 'update:filterStatus', val: string): void
  (e: 'add-note'): void
  (e: 'edit-note', item: DeliveryNote): void
  (e: 'delete-note', id: string): void
  (e: 'export-pdf'): void
  (e: 'print-table'): void
  (e: 'refresh'): void
}>()

// Pagination
const currentPage = ref(1)
const itemsPerPage = ref(10)

const paginatedList = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return props.deliveryNotes.slice(start, start + itemsPerPage.value)
})

const totalPages = computed(() => {
  return Math.ceil(props.deliveryNotes.length / itemsPerPage.value) || 1
})

const changePage = (p: number) => {
  if (p >= 1 && p <= totalPages.value) currentPage.value = p
}

watch(() => [props.searchQuery, props.filterStatus], () => {
  currentPage.value = 1
})

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'Complete':
      return 'bg-success bg-opacity-10 text-success border border-success'
    case 'Ordered':
      return 'bg-info bg-opacity-10 text-info border border-info'
    case 'Pending':
      return 'bg-warning bg-opacity-10 text-warning border border-warning'
    case 'Received':
      return 'bg-primary bg-opacity-10 text-primary border border-primary'
    default:
      return 'bg-secondary bg-opacity-10 text-secondary border border-secondary'
  }
}
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
                placeholder="Search DN no, customer, sales no..."
                @input="emit('update:searchQuery', ($event.target as HTMLInputElement).value)"
              />
            </div>
          </div>
        </div>

        <!-- Filter Right -->
        <div class="filters d-flex align-items-center gap-2 flex-wrap">
          <select
            :value="filterStatus"
            class="form-select form-select-sm"
            style="min-width: 140px;"
            @change="emit('update:filterStatus', ($event.target as HTMLSelectElement).value)"
          >
            <option value="">All Statuses</option>
            <option value="Complete">Complete</option>
            <option value="Ordered">Ordered</option>
            <option value="Pending">Pending</option>
            <option value="Received">Received</option>
          </select>

          <button
            type="button"
            class="btn btn-primary btn-sm px-3 d-inline-flex align-items-center gap-1"
            @click="emit('add-note')"
          >
            <FeatherIcon name="plus-circle" size="14" />
            <span>Add Delivery Note</span>
          </button>
        </div>
      </div>

      <!-- Data Table -->
      <div class="table-responsive">
        <table class="table datanew align-middle mb-0">
          <thead class="table-light">
            <tr>
              <th class="fw-bold">No. DN</th>
              <th class="fw-bold">Date</th>
              <th class="fw-bold">Customer</th>
              <th class="fw-bold">No Sales</th>
              <th class="fw-bold">Shipping Address</th>
              <th class="fw-bold text-center">Status</th>
              <th class="fw-bold">Date Status</th>
              <th class="fw-bold text-center no-sort" style="width: 120px;">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="paginatedList.length === 0">
              <td colspan="8" class="text-center py-4 text-muted">
                No delivery notes found matching filter.
              </td>
            </tr>
            <tr v-for="dn in paginatedList" :key="dn.id">
              <td class="fw-bold text-primary font-monospace">{{ dn.dnNo }}</td>
              <td class="small text-muted">{{ dn.date }}</td>
              <td class="fw-bold text-dark">{{ dn.customer }}</td>
              <td class="font-monospace text-secondary">{{ dn.noSales }}</td>
              <td class="small text-muted text-truncate" style="max-width: 250px;">{{ dn.shippingAddress }}</td>
              <td class="text-center">
                <span class="badge px-2 py-1" :class="getStatusBadge(dn.status)">
                  {{ dn.status }}
                </span>
              </td>
              <td class="small text-muted">{{ dn.dateStatus }}</td>
              <td class="text-center action-table-data">
                <div class="edit-delete-action d-inline-flex gap-1">
                  <NuxtLink
                    to="/delivery-note-detail"
                    class="btn btn-sm btn-outline-info p-1"
                    title="View Details"
                  >
                    <FeatherIcon name="eye" size="14" />
                  </NuxtLink>
                  <button
                    type="button"
                    class="btn btn-sm btn-outline-primary p-1"
                    title="Edit Delivery Note"
                    @click="emit('edit-note', dn)"
                  >
                    <FeatherIcon name="edit" size="14" />
                  </button>
                  <button
                    type="button"
                    class="btn btn-sm btn-outline-danger p-1"
                    title="Delete Delivery Note"
                    @click="emit('delete-note', dn.id)"
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
          {{ deliveryNotes.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1 }}
          to
          {{ Math.min(currentPage * itemsPerPage, deliveryNotes.length) }}
          of {{ deliveryNotes.length }} entries
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

