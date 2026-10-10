<script setup lang="ts">
import type { SubCategory } from '~/types/sub-category'
import FeatherIcon from '~/components/Common/FeatherIcon.vue'

const props = defineProps<{
  subCategories: SubCategory[]
  categories: string[]
  searchQuery: string
  selectedCategory: string
  filterStatus: string
}>()

const emit = defineEmits<{
  (e: 'update:searchQuery', val: string): void
  (e: 'update:selectedCategory', val: string): void
  (e: 'update:filterStatus', val: string): void
  (e: 'add-sub-category'): void
  (e: 'edit-sub-category', item: SubCategory): void
  (e: 'delete-sub-category', id: string): void
  (e: 'export-pdf'): void
  (e: 'print-table'): void
  (e: 'refresh'): void
}>()

// Pagination
const currentPage = ref(1)
const itemsPerPage = ref(10)

const paginatedList = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return props.subCategories.slice(start, start + itemsPerPage.value)
})

const totalPages = computed(() => {
  return Math.ceil(props.subCategories.length / itemsPerPage.value) || 1
})

const changePage = (p: number) => {
  if (p >= 1 && p <= totalPages.value) currentPage.value = p
}

watch(() => [props.searchQuery, props.selectedCategory, props.filterStatus], () => {
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
                placeholder="Search sub category or description..."
                @input="emit('update:searchQuery', ($event.target as HTMLInputElement).value)"
              />
            </div>
          </div>
        </div>

        <!-- Filter Right -->
        <div class="filters d-flex align-items-center gap-2 flex-wrap">
          <select
            :value="selectedCategory"
            class="form-select form-select-sm"
            style="min-width: 170px;"
            @change="emit('update:selectedCategory', ($event.target as HTMLSelectElement).value)"
          >
            <option value="">All Categories</option>
            <option v-for="cat in categories" :key="cat" :value="cat">
              {{ cat }}
            </option>
          </select>

          <select
            :value="filterStatus"
            class="form-select form-select-sm"
            style="min-width: 130px;"
            @change="emit('update:filterStatus', ($event.target as HTMLSelectElement).value)"
          >
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          <button
            type="button"
            class="btn btn-primary btn-sm px-3 d-inline-flex align-items-center gap-1"
            @click="emit('add-sub-category')"
          >
            <FeatherIcon name="plus-circle" size="14" />
            <span>Add Sub Category</span>
          </button>
        </div>
      </div>

      <!-- Data Table -->
      <div class="table-responsive">
        <table class="table datanew align-middle mb-0">
          <thead class="table-light">
            <tr>
              <th class="fw-bold">Sub Category</th>
              <th class="fw-bold">Category</th>
              <th class="fw-bold">Category Code</th>
              <th class="fw-bold">Description</th>
              <th class="fw-bold text-center">Item Used</th>
              <th class="fw-bold">Created By</th>
              <th class="fw-bold">Status</th>
              <th class="fw-bold text-center no-sort" style="width: 120px;">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="paginatedList.length === 0">
              <td colspan="8" class="text-center py-4 text-muted">
                No sub-categories found matching filter.
              </td>
            </tr>
            <tr v-for="sub in paginatedList" :key="sub.id">
              <td class="fw-bold text-dark">{{ sub.name }}</td>
              <td>{{ sub.category }}</td>
              <td class="font-monospace text-primary fw-semibold">{{ sub.categoryCode }}</td>
              <td class="small text-muted">{{ sub.description }}</td>
              <td class="text-center">
                <span class="badge bg-light text-dark border">{{ sub.itemUsed }}</span>
              </td>
              <td>{{ sub.createdBy || 'Admin' }}</td>
              <td>
                <span
                  class="badge px-2 py-1"
                  :class="sub.status === 'Active' ? 'bg-success' : 'bg-secondary'"
                >
                  {{ sub.status }}
                </span>
              </td>
              <td class="text-center action-table-data">
                <div class="edit-delete-action d-inline-flex gap-1">
                  <button
                    type="button"
                    class="btn btn-sm btn-outline-primary p-1"
                    title="Edit Sub Category"
                    @click="emit('edit-sub-category', sub)"
                  >
                    <FeatherIcon name="edit" size="14" />
                  </button>
                  <button
                    type="button"
                    class="btn btn-sm btn-outline-danger p-1"
                    title="Delete Sub Category"
                    @click="emit('delete-sub-category', sub.id)"
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
          {{ subCategories.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1 }}
          to
          {{ Math.min(currentPage * itemsPerPage, subCategories.length) }}
          of {{ subCategories.length }} entries
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

