<script setup lang="ts">
import type { WorkFlow } from '~/types/work-flow'
import FeatherIcon from '~/components/Common/FeatherIcon.vue'

const props = defineProps<{
  workflows: WorkFlow[]
  categories: string[]
  searchQuery: string
  selectedCategory: string
}>()

const emit = defineEmits<{
  (e: 'update:searchQuery', val: string): void
  (e: 'update:selectedCategory', val: string): void
  (e: 'add-workflow'): void
  (e: 'edit-workflow', item: WorkFlow): void
  (e: 'delete-workflow', id: string): void
  (e: 'export-pdf'): void
  (e: 'print-table'): void
  (e: 'refresh'): void
}>()

// Pagination
const currentPage = ref(1)
const itemsPerPage = ref(10)

const paginatedList = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return props.workflows.slice(start, start + itemsPerPage.value)
})

const totalPages = computed(() => {
  return Math.ceil(props.workflows.length / itemsPerPage.value) || 1
})

const changePage = (p: number) => {
  if (p >= 1 && p <= totalPages.value) currentPage.value = p
}

watch(() => [props.searchQuery, props.selectedCategory], () => {
  currentPage.value = 1
})
</script>

<template>
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
                placeholder="Search workflow no, product, steps..."
                @input="emit('update:searchQuery', ($event.target as HTMLInputElement).value)"
              />
            </div>
          </div>
        </div>

        <div class="filters d-flex align-items-center gap-2 flex-wrap">
          <select
            :value="selectedCategory"
            class="form-select form-select-sm"
            style="min-width: 160px;"
            @change="emit('update:selectedCategory', ($event.target as HTMLSelectElement).value)"
          >
            <option value="">All Categories</option>
            <option v-for="cat in categories" :key="cat" :value="cat">
              {{ cat }}
            </option>
          </select>

          <button
            type="button"
            class="btn btn-primary btn-sm px-3 d-inline-flex align-items-center gap-1"
            @click="emit('add-workflow')"
          >
            <FeatherIcon name="plus-circle" size="14" />
            <span>Add Work Flow</span>
          </button>
        </div>
      </div>

      <!-- Data Table -->
      <div class="table-responsive">
        <table class="table datanew align-middle mb-0">
          <thead class="table-light">
            <tr>
              <th class="fw-bold">No</th>
              <th class="fw-bold">Product Category</th>
              <th class="fw-bold">Product</th>
              <th class="fw-bold">Work Flow Steps</th>
              <th class="fw-bold text-center no-sort" style="width: 120px;">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="paginatedList.length === 0">
              <td colspan="5" class="text-center py-4 text-muted">
                No workflow templates found matching filter.
              </td>
            </tr>
            <tr v-for="wf in paginatedList" :key="wf.id">
              <td class="fw-bold text-primary font-monospace">{{ wf.no }}</td>
              <td class="fw-semibold text-secondary">{{ wf.category }}</td>
              <td class="fw-bold text-dark">{{ wf.product }}</td>
              <td>
                <div class="d-flex flex-wrap gap-1">
                  <span
                    v-for="(step, idx) in wf.workflowSteps.split(',')"
                    :key="idx"
                    class="badge bg-light text-dark border"
                  >
                    {{ step.trim() }}
                  </span>
                </div>
              </td>
              <td class="text-center action-table-data">
                <div class="edit-delete-action d-inline-flex gap-1">
                  <button
                    type="button"
                    class="btn btn-sm btn-outline-primary p-1"
                    title="Edit Workflow"
                    @click="emit('edit-workflow', wf)"
                  >
                    <FeatherIcon name="edit" size="14" />
                  </button>
                  <button
                    type="button"
                    class="btn btn-sm btn-outline-danger p-1"
                    title="Delete Workflow"
                    @click="emit('delete-workflow', wf.id)"
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
          {{ workflows.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1 }}
          to
          {{ Math.min(currentPage * itemsPerPage, workflows.length) }}
          of {{ workflows.length }} entries
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

