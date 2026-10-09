<script setup lang="ts">
import type { Supplier } from '~/types/supplier'
import FeatherIcon from '~/components/common/FeatherIcon.vue'

const props = defineProps<{
  suppliers: Supplier[]
  searchQuery: string
  filterStatus: string
}>()

const emit = defineEmits<{
  (e: 'update:searchQuery', val: string): void
  (e: 'update:filterStatus', val: string): void
  (e: 'add-supplier'): void
  (e: 'add-address', supplier: Supplier): void
  (e: 'edit-supplier', supplier: Supplier): void
  (e: 'delete-supplier', id: string): void
  (e: 'export-pdf'): void
  (e: 'print-table'): void
  (e: 'refresh'): void
}>()

// Pagination
const currentPage = ref(1)
const itemsPerPage = ref(10)

const paginatedList = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return props.suppliers.slice(start, start + itemsPerPage.value)
})

const totalPages = computed(() => {
  return Math.ceil(props.suppliers.length / itemsPerPage.value) || 1
})

const changePage = (p: number) => {
  if (p >= 1 && p <= totalPages.value) currentPage.value = p
}

watch(() => [props.searchQuery, props.filterStatus], () => {
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
                placeholder="Search Supplier ID, name, email, or PIC..."
                @input="emit('update:searchQuery', ($event.target as HTMLInputElement).value)"
              />
            </div>
          </div>
        </div>

        <!-- Filter Right -->
        <div class="filters d-flex align-items-center gap-2 flex-wrap">
          <!-- Status Filter -->
          <select
            :value="filterStatus"
            class="form-select form-select-sm"
            style="min-width: 140px;"
            @change="emit('update:filterStatus', ($event.target as HTMLSelectElement).value)"
          >
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          <!-- Add Supplier Button -->
          <button
            type="button"
            class="btn btn-primary btn-sm px-3 d-inline-flex align-items-center gap-1"
            @click="emit('add-supplier')"
          >
            <FeatherIcon name="plus-circle" size="14" />
            <span>Add Supplier</span>
          </button>
        </div>
      </div>

      <!-- Data Table -->
      <div class="table-responsive">
        <table class="table datanew align-middle mb-0">
          <thead class="table-light">
            <tr>
              <th class="fw-bold">ID Supplier</th>
              <th class="fw-bold">Supplier Name</th>
              <th class="fw-bold">Email</th>
              <th class="fw-bold">Contact</th>
              <th class="fw-bold">PIC Name</th>
              <th class="fw-bold">Status</th>
              <th class="fw-bold">Date</th>
              <th class="fw-bold text-center no-sort" style="width: 150px;">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="paginatedList.length === 0">
              <td colspan="8" class="text-center py-4 text-muted">
                No suppliers found matching filter.
              </td>
            </tr>
            <tr v-for="sup in paginatedList" :key="sup.id">
              <td class="fw-bold text-primary font-monospace">{{ sup.supplierId }}</td>
              <td class="fw-bold text-dark">{{ sup.name }}</td>
              <td class="small text-muted">{{ sup.email }}</td>
              <td class="font-monospace small">{{ sup.contact }}</td>
              <td class="fw-semibold text-secondary">{{ sup.picName }}</td>
              <td>
                <span
                  class="badge px-2 py-1"
                  :class="sup.status === 'Active' ? 'bg-success' : 'bg-secondary'"
                >
                  {{ sup.status }}
                </span>
              </td>
              <td class="small text-muted">{{ sup.date }}</td>
              <td class="text-center action-table-data">
                <div class="edit-delete-action d-inline-flex gap-1">
                  <!-- Flow link ke Add Address Modal -->
                  <button
                    type="button"
                    class="btn btn-sm btn-outline-warning p-1"
                    title="Add Address for this Supplier"
                    @click="emit('add-address', sup)"
                  >
                    <FeatherIcon name="map-pin" size="14" />
                  </button>
                  <button
                    type="button"
                    class="btn btn-sm btn-outline-primary p-1"
                    title="Edit Supplier"
                    @click="emit('edit-supplier', sup)"
                  >
                    <FeatherIcon name="edit" size="14" />
                  </button>
                  <button
                    type="button"
                    class="btn btn-sm btn-outline-danger p-1"
                    title="Delete Supplier"
                    @click="emit('delete-supplier', sup.id)"
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
          {{ suppliers.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1 }}
          to
          {{ Math.min(currentPage * itemsPerPage, suppliers.length) }}
          of {{ suppliers.length }} entries
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

