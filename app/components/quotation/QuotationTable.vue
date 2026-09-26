<script setup lang="ts">
import type { Quotation } from '~/types/quotation'
import FeatherIcon from '~/components/common/FeatherIcon.vue'
import { formatRupiah } from '~/composables/useFormatters'

const props = defineProps<{
  quotations: Quotation[]
  searchQuery: string
  filterStatus: string
}>()

const emit = defineEmits<{
  (e: 'update:searchQuery', val: string): void
  (e: 'update:filterStatus', val: string): void
  (e: 'add-quotation'): void
  (e: 'edit-quotation', item: Quotation): void
  (e: 'delete-quotation', id: string): void
  (e: 'export-pdf'): void
  (e: 'print-table'): void
  (e: 'refresh'): void
}>()

// Pagination
const currentPage = ref(1)
const itemsPerPage = ref(10)

const paginatedList = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return props.quotations.slice(start, start + itemsPerPage.value)
})

const totalPages = computed(() => {
  return Math.ceil(props.quotations.length / itemsPerPage.value) || 1
})

const changePage = (p: number) => {
  if (p >= 1 && p <= totalPages.value) currentPage.value = p
}

watch(() => [props.searchQuery, props.filterStatus], () => {
  currentPage.value = 1
})

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'Ordered':
    case 'Complete':
      return 'bg-success bg-opacity-10 text-success border border-success'
    case 'Send':
    case 'Pending':
      return 'bg-warning bg-opacity-10 text-warning border border-warning'
    case 'Rejected':
      return 'bg-danger bg-opacity-10 text-danger border border-danger'
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
                placeholder="Search quotation no, customer, email..."
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
            <option value="Send">Send</option>
            <option value="Ordered">Ordered</option>
            <option value="Complete">Complete</option>
            <option value="Pending">Pending</option>
            <option value="Rejected">Rejected</option>
          </select>

          <button
            type="button"
            class="btn btn-primary btn-sm px-3 d-inline-flex align-items-center gap-1"
            @click="emit('add-quotation')"
          >
            <FeatherIcon name="plus-circle" size="14" />
            <span>Add Quotation</span>
          </button>
        </div>
      </div>

      <!-- Data Table -->
      <div class="table-responsive">
        <table class="table datanew align-middle mb-0">
          <thead class="table-light">
            <tr>
              <th class="fw-bold">No Quotation</th>
              <th class="fw-bold">Date</th>
              <th class="fw-bold">Customer</th>
              <th class="fw-bold">Email</th>
              <th class="fw-bold text-center">Status</th>
              <th class="fw-bold">Date Status</th>
              <th class="fw-bold text-end">Total (IDR)</th>
              <th class="fw-bold text-center">Channel</th>
              <th class="fw-bold">Due Date</th>
              <th class="fw-bold text-center no-sort" style="width: 120px;">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="paginatedList.length === 0">
              <td colspan="10" class="text-center py-4 text-muted">
                No quotations found matching filter.
              </td>
            </tr>
            <tr v-for="q in paginatedList" :key="q.id">
              <td class="fw-bold text-primary font-monospace">{{ q.noQuotation }}</td>
              <td class="small text-muted">{{ q.date }}</td>
              <td class="fw-bold text-dark">{{ q.customer }}</td>
              <td class="small text-muted">{{ q.email }}</td>
              <td class="text-center">
                <span class="badge px-2 py-1" :class="getStatusBadge(q.status)">
                  {{ q.status }}
                </span>
              </td>
              <td class="small text-muted">{{ q.dateStatus }}</td>
              <td class="text-end fw-semibold font-monospace text-dark">{{ formatRupiah(q.total) }}</td>
              <td class="text-center">
                <span class="badge bg-light text-dark border">{{ q.channel }}</span>
              </td>
              <td class="small text-muted">{{ q.dueDate }}</td>
              <td class="text-center action-table-data">
                <div class="edit-delete-action d-inline-flex gap-1">
                  <button
                    type="button"
                    class="btn btn-sm btn-outline-primary p-1"
                    title="Edit Quotation"
                    @click="emit('edit-quotation', q)"
                  >
                    <FeatherIcon name="edit" size="14" />
                  </button>
                  <button
                    type="button"
                    class="btn btn-sm btn-outline-danger p-1"
                    title="Delete Quotation"
                    @click="emit('delete-quotation', q.id)"
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
          {{ quotations.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1 }}
          to
          {{ Math.min(currentPage * itemsPerPage, quotations.length) }}
          of {{ quotations.length }} entries
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

