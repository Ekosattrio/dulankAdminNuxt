<script setup lang="ts">
import type { ExpenseCategory } from '~/types/expense-category'
import FeatherIcon from '~/components/common/FeatherIcon.vue'

const props = withDefaults(
  defineProps<{
    categories?: ExpenseCategory[]
    expenseCategories?: ExpenseCategory[]
  }>(),
  {
    categories: () => [],
    expenseCategories: () => []
  }
)

const items = computed(() => {
  if (props.expenseCategories && props.expenseCategories.length) return props.expenseCategories
  return props.categories || []
})

const emit = defineEmits<{
  (e: 'edit', category: ExpenseCategory): void
  (e: 'delete', id: string): void
}>()
</script>

<template>
  <div class="table-responsive">
    <table class="table datanew align-middle">
      <thead class="thead-light">
        <tr>
          <th>Category Name</th>
          <th>Description</th>
          <th>Created Date</th>
          <th>Status</th>
          <th class="text-center" style="width: 100px">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="cat in items" :key="cat.id">
          <td class="fw-bold text-dark">{{ cat.categoryName }}</td>
          <td class="text-muted" style="max-width: 300px">{{ cat.description }}</td>
          <td>{{ cat.date }}</td>
          <td>
            <span
              class="badge rounded"
              :class="cat.status === 'Active' ? 'badge-success' : 'badge-secondary'"
            >
              • {{ cat.status }}
            </span>
          </td>
          <td class="text-center">
            <div class="d-inline-flex gap-1">
              <button
                type="button"
                class="btn btn-sm btn-outline-primary p-1"
                title="Edit Category"
                @click="emit('edit', cat)"
              >
                <FeatherIcon name="edit" size="14" />
              </button>
              <button
                type="button"
                class="btn btn-sm btn-outline-danger p-1"
                title="Delete Category"
                @click="emit('delete', cat.id)"
              >
                <FeatherIcon name="trash-2" size="14" />
              </button>
            </div>
          </td>
        </tr>
        <tr v-if="items.length === 0">
          <td colspan="5" class="text-center py-4 text-muted">
            Tidak ada kategori pengeluaran yang ditemukan.
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

