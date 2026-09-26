<script setup lang="ts">
import type { Invoice } from '~/types/invoice'
import FeatherIcon from '~/components/common/FeatherIcon.vue'
import { formatRupiah } from '~/composables/useFormatters'

const props = defineProps<{
  invoices: Invoice[]
  searchQuery: string
  filterStatus: string
}>()

const emit = defineEmits<{
  (e: 'update:searchQuery', val: string): void
  (e: 'update:filterStatus', val: string): void
  (e: 'add-invoice'): void
  (e: 'edit-invoice', item: Invoice): void
  (e: 'delete-invoice', id: string): void
  (e: 'export-pdf'): void
  (e: 'print-table'): void
  (e: 'refresh'): void
}>()

// Pagination
const currentPage = ref(1)
const itemsPerPage = ref(10)

const paginatedList = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return props.invoices.slice(start, start + itemsPerPage.value)
})

const totalPages = computed(() => {
  return Math.ceil(props.invoices.length / itemsPerPage.value) || 1
})

const changePage = (p: number) => {
  if (p >= 1 && p <= totalPages.value) currentPage.value = p
}

watch(() => [props.searchQuery, props.filterStatus], () => {
  currentPage.value = 1
})

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'Paid':
      return 'bg-success bg-opacity-10 text-success border border-success'
    case 'Partial':
      return 'bg-warning bg-opacity-10 text-warning border border-warning'
    case 'Unpaid':
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
                placeholder="Search invoice no or customer..."
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
            <option value="Paid">Paid</option>
            <option value="Partial">Partial</option>
            <option value="Unpaid">Unpaid</option>
          </select>

          <button
            type="button"
            class="btn btn-primary btn-sm px-3 d-inline-flex align-items-center gap-1"
            @click="emit('add-invoice')"
          >
            <FeatherIcon name="plus-circle" size="14" />
            <span>Add Invoice</span>
          </button>
        </div>
      </div>

      <!-- Data Table -->
      <div class="table-responsive">
        <table class="table datanew align-middle mb-0">
          <thead class="table-light">
            <tr>
              <th class="fw-bold">Invoice No</th>
              <th class="fw-bold">Customer</th>
              <th class="fw-bold">Due Date</th>
              <th class="fw-bold text-end">Amount</th>
              <th class="fw-bold text-end">Paid</th>
              <th class="fw-bold text-end">Amount Due</th>
              <th class="fw-bold text-center">Status</th>
              <th class="fw-bold text-center no-sort" style="width: 120px;">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="paginatedList.length === 0">
              <td colspan="8" class="text-center py-4 text-muted">
                No invoices found matching filter.
              </td>
            </tr>
            <tr v-for="inv in paginatedList" :key="inv.id">
              <td class="fw-bold text-primary font-monospace">{{ inv.invoiceNo }}</td>
              <td class="fw-bold text-dark">{{ inv.customer }}</td>
              <td class="small text-muted">{{ inv.dueDate }}</td>
              <td class="text-end font-monospace">{{ formatRupiah(inv.amount) }}</td>
              <td class="text-end font-monospace text-success">{{ formatRupiah(inv.paid) }}</td>
              <td class="text-end font-monospace" :class="inv.amountDue > 0 ? 'text-danger fw-semibold' : 'text-muted'">
                {{ formatRupiah(inv.amountDue) }}
              </td>
              <td class="text-center">
                <span class="badge px-2 py-1" :class="getStatusBadge(inv.status)">
                  {{ inv.status }}
                </span>
              </td>
              <td class="text-center action-table-data">
                <div class="edit-delete-action d-inline-flex gap-1">
                  <NuxtLink
                    to="/invoice-details"
                    class="btn btn-sm btn-outline-info p-1"
                    title="View Invoice"
                  >
                    <FeatherIcon name="eye" size="14" />
                  </NuxtLink>
                  <button
                    type="button"
                    class="btn btn-sm btn-outline-primary p-1"
                    title="Edit Invoice"
                    @click="emit('edit-invoice', inv)"
                  >
                    <FeatherIcon name="edit" size="14" />
                  </button>
                  <button
                    type="button"
                    class="btn btn-sm btn-outline-danger p-1"
                    title="Delete Invoice"
                    @click="emit('delete-invoice', inv.id)"
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
          {{ invoices.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1 }}
          to
          {{ Math.min(currentPage * itemsPerPage, invoices.length) }}
          of {{ invoices.length }} entries
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

