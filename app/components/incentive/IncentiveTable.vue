<script setup lang="ts">
import type { IncentiveItem } from '~/types/incentive'
import { formatRupiah } from '~/composables/useFormatters'
import FeatherIcon from '~/components/common/FeatherIcon.vue'

defineProps<{
  incentives: IncentiveItem[]
}>()

const emit = defineEmits<{
  (e: 'edit', item: IncentiveItem): void
  (e: 'delete', id: string): void
}>()
</script>

<template>
  <div class="table-responsive">
    <table class="table datanew align-middle">
      <thead class="thead-light">
        <tr>
          <th># Incentive</th>
          <th>Employee Name</th>
          <th>Periode</th>
          <th class="text-center">Qty Selesai</th>
          <th class="text-end">Total Amount</th>
          <th class="text-center">Status</th>
          <th class="text-center" style="width: 100px">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="inc in incentives" :key="inc.id">
          <td class="fw-bold text-primary">{{ inc.code }}</td>
          <td class="fw-semibold text-dark">{{ inc.employee }}</td>
          <td>
            <span class="badge bg-light text-dark border">{{ inc.period }}</span>
          </td>
          <td class="text-center fw-bold">{{ inc.qtyComplete }}</td>
          <td class="text-end font-monospace fw-bold text-success fs-6">
            {{ formatRupiah(inc.totalAmount) }}
          </td>
          <td class="text-center">
            <span
              :class="[
                'badge',
                inc.status === 'Paid' ? 'bg-success' : 'bg-warning text-dark'
              ]"
            >
              {{ inc.status }}
            </span>
          </td>
          <td class="text-center">
            <div class="d-inline-flex gap-1">
              <button
                type="button"
                class="btn btn-sm btn-outline-primary p-1"
                title="Edit"
                @click="emit('edit', inc)"
              >
                <FeatherIcon name="edit" size="14" />
              </button>
              <button
                type="button"
                class="btn btn-sm btn-outline-danger p-1"
                title="Delete"
                @click="emit('delete', inc.id)"
              >
                <FeatherIcon name="trash-2" size="14" />
              </button>
            </div>
          </td>
        </tr>
        <tr v-if="incentives.length === 0">
          <td colspan="7" class="text-center py-4 text-muted">
            Tidak ada data insentif karyawan yang ditemukan.
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

