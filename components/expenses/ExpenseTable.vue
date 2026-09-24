<script setup lang="ts">
import type { Expense } from '~/types/expense'
import { formatNumber } from '~/composables/useFormatters'
import FeatherIcon from '~/components/common/FeatherIcon.vue'

defineProps<{
  expenses: Expense[]
}>()

const emit = defineEmits<{
  (e: 'view', expense: Expense): void
  (e: 'edit', expense: Expense): void
  (e: 'delete', id: string): void
}>()

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'Paid':
      return 'badge-success'
    case 'Unpaid':
      return 'badge-danger'
    case 'Partial':
      return 'badge-warning'
    case 'Canceled':
      return 'badge-secondary'
    default:
      return 'badge-light'
  }
}
</script>

<template>
  <div class="table-responsive">
    <table class="table datanew align-middle">
      <thead class="thead-light">
        <tr>
          <th>No Expense</th>
          <th>Date</th>
          <th>Expense Category</th>
          <th>Vendor / Recipient</th>
          <th>Status</th>
          <th class="text-end">Amount</th>
          <th class="text-end">Paid</th>
          <th class="text-end">Due</th>
          <th>Description</th>
          <th class="text-center" style="width: 110px">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="e in expenses" :key="e.id">
          <td class="fw-bold text-primary">{{ e.noExpense }}</td>
          <td class="small">{{ e.date }}</td>
          <td>
            <span class="badge bg-light text-dark border">{{ e.category }}</span>
          </td>
          <td class="fw-semibold text-dark">{{ e.name }}</td>
          <td>
            <span class="badge rounded" :class="getStatusBadge(e.status)">
              • {{ e.status }}
            </span>
          </td>
          <td class="text-end fw-bold text-dark">Rp {{ formatNumber(e.amount) }}</td>
          <td class="text-end text-success">Rp {{ formatNumber(e.paid) }}</td>
          <td class="text-end text-danger">Rp {{ formatNumber(e.due) }}</td>
          <td class="text-muted small text-truncate" style="max-width: 200px">{{ e.description }}</td>
          <td class="text-center">
            <div class="d-inline-flex gap-1">
              <button
                type="button"
                class="btn btn-sm btn-outline-info p-1"
                title="View"
                @click="emit('view', e)"
              >
                <FeatherIcon name="eye" size="14" />
              </button>
              <button
                type="button"
                class="btn btn-sm btn-outline-primary p-1"
                title="Edit"
                @click="emit('edit', e)"
              >
                <FeatherIcon name="edit" size="14" />
              </button>
              <button
                type="button"
                class="btn btn-sm btn-outline-danger p-1"
                title="Delete"
                @click="emit('delete', e.id)"
              >
                <FeatherIcon name="trash-2" size="14" />
              </button>
            </div>
          </td>
        </tr>
        <tr v-if="expenses.length === 0">
          <td colspan="10" class="text-center py-4 text-muted">
            Tidak ada data pengeluaran yang ditemukan.
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

