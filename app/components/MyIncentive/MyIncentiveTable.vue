<script setup lang="ts">
import type { MyIncentive } from '~/types/my-incentive'
import { formatRupiah } from '~/composables/useFormatters'
import FeatherIcon from '~/components/Common/FeatherIcon.vue'

defineProps<{
  items: MyIncentive[]
}>()

const emit = defineEmits<{
  (e: 'edit', item: MyIncentive): void
  (e: 'delete', id: string): void
}>()
</script>

<template>
  <div class="table-responsive">
    <table class="table table-hover align-middle mb-0">
      <thead class="table-light">
        <tr>
          <th># Incentive</th>
          <th>Name Of Process</th>
          <th>Date</th>
          <th class="text-center">Qty</th>
          <th class="text-end">Amount</th>
          <th class="text-center">Status</th>
          <th class="text-end">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in items" :key="row.id">
          <td>
            <span class="fw-bold text-primary">{{ row.code }}</span>
          </td>
          <td>
            <span class="badge bg-light text-dark border">{{ row.process }}</span>
          </td>
          <td>
            <span class="text-muted small">{{ row.date }}</span>
          </td>
          <td class="text-center">
            <span class="fw-bold">{{ row.qty }}</span>
          </td>
          <td class="text-end font-monospace fw-semibold text-dark">
            {{ formatRupiah(row.amount) }}
          </td>
          <td class="text-center">
            <span
              :class="[
                'badge',
                row.status === 'Paid' ? 'bg-success' : 'bg-warning text-dark'
              ]"
            >
              {{ row.status }}
            </span>
          </td>
          <td class="text-end">
            <div class="d-inline-flex gap-1">
              <button
                type="button"
                class="btn btn-sm btn-outline-primary p-1"
                title="Edit"
                @click="emit('edit', row)"
              >
                <FeatherIcon name="edit" size="14" />
              </button>
              <button
                type="button"
                class="btn btn-sm btn-outline-danger p-1"
                title="Hapus"
                @click="emit('delete', row.id)"
              >
                <FeatherIcon name="trash-2" size="14" />
              </button>
            </div>
          </td>
        </tr>
        <tr v-if="items.length === 0">
          <td colspan="7" class="text-center py-4 text-muted">
            Tidak ada data insentif yang cocok dengan kriteria.
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

