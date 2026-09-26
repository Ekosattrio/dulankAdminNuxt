<script setup lang="ts">
import type { JobOrder } from '~/types/job-order'
import FeatherIcon from '~/components/common/FeatherIcon.vue'

const props = defineProps<{
  jobOrders: JobOrder[]
  searchQuery: string
  filterStatus: string
  filterCategory: string
  selectedType: string
}>()

const emit = defineEmits<{
  (e: 'update:searchQuery', val: string): void
  (e: 'update:filterStatus', val: string): void
  (e: 'update:filterCategory', val: string): void
  (e: 'select-type', type: string): void
  (e: 'add-job'): void
  (e: 'edit-job', item: JobOrder): void
  (e: 'delete-job', id: string): void
  (e: 'view-progress', item: JobOrder): void
  (e: 'export-pdf'): void
  (e: 'print-table'): void
  (e: 'refresh'): void
}>()

// Pagination
const currentPage = ref(1)
const itemsPerPage = ref(10)

const paginatedList = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return props.jobOrders.slice(start, start + itemsPerPage.value)
})

const totalPages = computed(() => {
  return Math.ceil(props.jobOrders.length / itemsPerPage.value) || 1
})

const changePage = (p: number) => {
  if (p >= 1 && p <= totalPages.value) currentPage.value = p
}

watch(() => [props.searchQuery, props.filterStatus, props.filterCategory, props.selectedType], () => {
  currentPage.value = 1
})

const getPriorityBadge = (p: string) => {
  switch (p) {
    case 'High':
      return 'bg-danger bg-opacity-10 text-danger border border-danger'
    case 'Medium':
      return 'bg-warning bg-opacity-10 text-warning border border-warning'
    default:
      return 'bg-secondary bg-opacity-10 text-secondary border border-secondary'
  }
}

const getStatusBadge = (s: string) => {
  switch (s) {
    case 'Completed':
      return 'bg-success bg-opacity-10 text-success border border-success'
    case 'On Process':
      return 'bg-info bg-opacity-10 text-info border border-info'
    default:
      return 'bg-warning bg-opacity-10 text-warning border border-warning'
  }
}
</script>

<template>
  <div class="row">
    <!-- Left Sidebar: Workflow Types -->
    <div class="col-xl-3 col-lg-4 mb-4">
      <div class="card shadow-sm border rounded-3 bg-white p-3">
        <h6 class="fw-bold mb-3 text-dark">Workflow Categories</h6>
        <div class="list-group list-group-flush">
          <button
            type="button"
            class="list-group-item list-group-item-action d-flex justify-content-between align-items-center rounded-2 mb-1"
            :class="selectedType === 'all' ? 'active' : ''"
            @click="emit('select-type', 'all')"
          >
            <span><FeatherIcon name="grid" size="14" class="me-2" />All Workflows</span>
            <span class="badge rounded-pill" :class="selectedType === 'all' ? 'bg-light text-dark' : 'bg-secondary'">
              {{ jobOrders.length }}
            </span>
          </button>
          <button
            type="button"
            class="list-group-item list-group-item-action d-flex justify-content-between align-items-center rounded-2 mb-1"
            :class="selectedType === 'sm52' ? 'active' : ''"
            @click="emit('select-type', 'sm52')"
          >
            <span><FeatherIcon name="printer" size="14" class="me-2" />Mesin SM52</span>
            <span class="badge rounded-pill bg-light text-dark">Offset</span>
          </button>
          <button
            type="button"
            class="list-group-item list-group-item-action d-flex justify-content-between align-items-center rounded-2 mb-1"
            :class="selectedType === 'ctp' ? 'active' : ''"
            @click="emit('select-type', 'ctp')"
          >
            <span><FeatherIcon name="layers" size="14" class="me-2" />Plate CTP</span>
            <span class="badge rounded-pill bg-light text-dark">Pracetak</span>
          </button>
          <button
            type="button"
            class="list-group-item list-group-item-action d-flex justify-content-between align-items-center rounded-2 mb-1"
            :class="selectedType === 'potong' ? 'active' : ''"
            @click="emit('select-type', 'potong')"
          >
            <span><FeatherIcon name="scissors" size="14" class="me-2" />Potong & Finishing</span>
            <span class="badge rounded-pill bg-light text-dark">Finishing</span>
          </button>
          <button
            type="button"
            class="list-group-item list-group-item-action d-flex justify-content-between align-items-center rounded-2 mb-1"
            :class="selectedType === 'design' ? 'active' : ''"
            @click="emit('select-type', 'design')"
          >
            <span><FeatherIcon name="layout" size="14" class="me-2" />Design Approval</span>
            <span class="badge rounded-pill bg-light text-dark">Design</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Right Side: Table -->
    <div class="col-xl-9 col-lg-8">
      <div class="card table-list-card shadow-sm border rounded-3 bg-white mb-4">
        <div class="card-body p-4">
          <!-- Filter Bar -->
          <div class="table-top d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4">
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
                    placeholder="Search JO no, customer, product..."
                    @input="emit('update:searchQuery', ($event.target as HTMLInputElement).value)"
                  />
                </div>
              </div>
            </div>

            <div class="filters d-flex align-items-center gap-2 flex-wrap">
              <select
                :value="filterCategory"
                class="form-select form-select-sm"
                style="min-width: 140px;"
                @change="emit('update:filterCategory', ($event.target as HTMLSelectElement).value)"
              >
                <option value="">All Categories</option>
                <option value="Design">Design</option>
                <option value="Pracetak">Pracetak</option>
                <option value="Cetak">Cetak</option>
                <option value="Finishing">Finishing</option>
              </select>

              <select
                :value="filterStatus"
                class="form-select form-select-sm"
                style="min-width: 130px;"
                @change="emit('update:filterStatus', ($event.target as HTMLSelectElement).value)"
              >
                <option value="">All Statuses</option>
                <option value="Waiting">Waiting</option>
                <option value="On Process">On Process</option>
                <option value="Completed">Completed</option>
              </select>

              <button
                type="button"
                class="btn btn-primary btn-sm px-3 d-inline-flex align-items-center gap-1"
                @click="emit('add-job')"
              >
                <FeatherIcon name="plus-circle" size="14" />
                <span>Add Job Order</span>
              </button>
            </div>
          </div>

          <!-- Table -->
          <div class="table-responsive">
            <table class="table datanew align-middle mb-0">
              <thead class="table-light">
                <tr>
                  <th class="fw-bold">No</th>
                  <th class="fw-bold">Due Date</th>
                  <th class="fw-bold">Customer</th>
                  <th class="fw-bold">Product</th>
                  <th class="fw-bold">Job Title</th>
                  <th class="fw-bold text-center">Priority</th>
                  <th class="fw-bold text-center">Status</th>
                  <th class="fw-bold text-center no-sort" style="width: 130px;">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="paginatedList.length === 0">
                  <td colspan="8" class="text-center py-4 text-muted">
                    No job orders found matching filter.
                  </td>
                </tr>
                <tr v-for="jo in paginatedList" :key="jo.id">
                  <td class="fw-bold text-primary font-monospace">{{ jo.no }}</td>
                  <td class="small text-muted">{{ jo.dueDate }}</td>
                  <td class="fw-bold text-dark">{{ jo.customer }}</td>
                  <td>{{ jo.product }}</td>
                  <td class="fw-semibold text-secondary">{{ jo.jobTitle }}</td>
                  <td class="text-center">
                    <span class="badge px-2 py-1" :class="getPriorityBadge(jo.priority)">
                      {{ jo.priority }}
                    </span>
                  </td>
                  <td class="text-center">
                    <span class="badge px-2 py-1" :class="getStatusBadge(jo.status)">
                      {{ jo.status }}
                    </span>
                  </td>
                  <td class="text-center action-table-data">
                    <div class="edit-delete-action d-inline-flex gap-1">
                      <button
                        type="button"
                        class="btn btn-sm btn-outline-info p-1"
                        title="View Progress Steps"
                        @click="emit('view-progress', jo)"
                      >
                        <FeatherIcon name="eye" size="14" />
                      </button>
                      <button
                        type="button"
                        class="btn btn-sm btn-outline-primary p-1"
                        title="Edit Job"
                        @click="emit('edit-job', jo)"
                      >
                        <FeatherIcon name="edit" size="14" />
                      </button>
                      <button
                        type="button"
                        class="btn btn-sm btn-outline-danger p-1"
                        title="Delete Job"
                        @click="emit('delete-job', jo.id)"
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
              {{ jobOrders.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1 }}
              to
              {{ Math.min(currentPage * itemsPerPage, jobOrders.length) }}
              of {{ jobOrders.length }} entries
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

