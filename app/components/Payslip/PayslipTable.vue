<script setup lang="ts">
import type { PayslipItem } from '~/types/payslip'
import { formatRupiah } from '~/composables/useFormatters'
import FeatherIcon from '~/components/Common/FeatherIcon.vue'

defineProps<{
  payslips: PayslipItem[]
}>()

const emit = defineEmits<{
  (e: 'view', item: PayslipItem): void
  (e: 'edit', item: PayslipItem): void
  (e: 'delete', id: string): void
}>()
</script>

<template>
  <div class="table-responsive">
    <table class="table datanew align-middle">
      <thead class="thead-light">
        <tr>
          <th># Slip</th>
          <th>Employee Name</th>
          <th>Period</th>
          <th class="text-center">Days Worked</th>
          <th class="text-end">Allowances</th>
          <th class="text-end">Overtime</th>
          <th class="text-end">Net Salary (Total)</th>
          <th class="text-center">Status</th>
          <th>Paid Date</th>
          <th class="text-center" style="width: 110px">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="p in payslips" :key="p.id">
          <td class="fw-bold text-primary">{{ p.slipNo }}</td>
          <td class="fw-semibold text-dark">{{ p.name }}</td>
          <td class="small">{{ p.period }}</td>
          <td class="text-center fw-bold">{{ p.dayWorked }} Hari</td>
          <td class="text-end font-monospace text-muted">{{ formatRupiah(p.allowance) }}</td>
          <td class="text-end font-monospace text-muted">{{ formatRupiah(p.overtime) }}</td>
          <td class="text-end font-monospace fw-bold text-success fs-6">
            {{ formatRupiah(p.total) }}
          </td>
          <td class="text-center">
            <span
              :class="[
                'badge',
                p.status === 'Paid' ? 'bg-success' : 'bg-warning text-dark'
              ]"
            >
              {{ p.status }}
            </span>
          </td>
          <td class="small text-muted">{{ p.paidDate }}</td>
          <td class="text-center">
            <div class="d-inline-flex gap-1">
              <button
                type="button"
                class="btn btn-sm btn-outline-info p-1"
                title="View Payslip"
                @click="emit('view', p)"
              >
                <FeatherIcon name="eye" size="14" />
              </button>
              <button
                type="button"
                class="btn btn-sm btn-outline-primary p-1"
                title="Edit Payslip"
                @click="emit('edit', p)"
              >
                <FeatherIcon name="edit" size="14" />
              </button>
              <button
                type="button"
                class="btn btn-sm btn-outline-danger p-1"
                title="Delete"
                @click="emit('delete', p.id)"
              >
                <FeatherIcon name="trash-2" size="14" />
              </button>
            </div>
          </td>
        </tr>
        <tr v-if="payslips.length === 0">
          <td colspan="10" class="text-center py-4 text-muted">
            Tidak ada data slip gaji yang ditemukan.
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

