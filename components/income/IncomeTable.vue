<script setup lang="ts">
import type { IncomeRecord } from '~/types/income'
import { formatNumber } from '~/composables/useFormatters'
import FeatherIcon from '~/components/common/FeatherIcon.vue'

const props = defineProps<{
  incomes: IncomeRecord[]
}>()

const emit = defineEmits<{
  (e: 'view', item: IncomeRecord): void
  (e: 'edit', item: IncomeRecord): void
  (e: 'delete', id: string): void
}>()

const totalAmount = computed(() => {
  return props.incomes.reduce((acc, curr) => acc + (curr.amount || 0), 0)
})
</script>

<template>
  <div class="table-responsive">
    <table class="table datanew align-middle">
      <thead class="thead-light">
        <tr>
          <th>Date</th>
          <th>No Income</th>
          <th>Name / Client</th>
          <th>Category</th>
          <th>Notes</th>
          <th class="text-end">Amount (IDR)</th>
          <th class="text-center" style="width: 110px">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in incomes" :key="item.id">
          <td class="small">{{ item.date }}</td>
          <td class="fw-semibold text-primary">{{ item.no }}</td>
          <td class="fw-medium text-dark">{{ item.name }}</td>
          <td>
            <span class="badge bg-light text-dark border">{{ item.category }}</span>
          </td>
          <td class="text-muted small text-truncate" style="max-width: 250px">
            {{ item.notes }}
          </td>
          <td class="text-end fw-bold text-dark">Rp {{ formatNumber(item.amount) }}</td>
          <td class="text-center">
            <div class="d-inline-flex gap-1">
              <button
                type="button"
                class="btn btn-sm btn-outline-info p-1"
                title="View"
                @click="emit('view', item)"
              >
                <FeatherIcon name="eye" size="14" />
              </button>
              <button
                type="button"
                class="btn btn-sm btn-outline-primary p-1"
                title="Edit"
                @click="emit('edit', item)"
              >
                <FeatherIcon name="edit" size="14" />
              </button>
              <button
                type="button"
                class="btn btn-sm btn-outline-danger p-1"
                title="Delete"
                @click="emit('delete', item.id)"
              >
                <FeatherIcon name="trash-2" size="14" />
              </button>
            </div>
          </td>
        </tr>
        <tr v-if="incomes.length === 0">
          <td colspan="7" class="text-center py-4 text-muted">
            Tidak ada catatan pemasukan yang ditemukan.
          </td>
        </tr>
      </tbody>
      <tfoot v-if="incomes.length > 0">
        <tr class="fw-bold bg-light">
          <td class="text-start">Total</td>
          <td colspan="4"></td>
          <td class="text-end text-success fs-6">Rp {{ formatNumber(totalAmount) }}</td>
          <td></td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

