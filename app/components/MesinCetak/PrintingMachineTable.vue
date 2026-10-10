<script setup lang="ts">
import type { PrintingMachine } from '~/types/printing-machine'
import { formatNumber } from '~/composables/useFormatters'
import FeatherIcon from '~/components/Common/FeatherIcon.vue'

defineProps<{
  machines: PrintingMachine[]
}>()

const emit = defineEmits<{
  (e: 'edit', machine: PrintingMachine): void
  (e: 'delete', id: string): void
}>()
</script>

<template>
  <div class="table-responsive">
    <table class="table datanew align-middle">
      <thead class="thead-light">
        <tr>
          <th>Machine Type</th>
          <th>Machine Name</th>
          <th>Color / Spec</th>
          <th>Max Area</th>
          <th class="text-end">Base Minim</th>
          <th class="text-end">Druck / Click</th>
          <th class="text-end">Cost Plate</th>
          <th>Last Update</th>
          <th>Status</th>
          <th class="text-center" style="width: 100px">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="m in machines" :key="m.id">
          <td>
            <span
              class="badge rounded-pill"
              :class="m.type === 'Offset' ? 'bg-primary' : 'bg-info text-dark'"
            >
              {{ m.type }}
            </span>
          </td>
          <td class="fw-bold text-dark">{{ m.name }}</td>
          <td>{{ m.colors }} Color</td>
          <td>
            <span class="badge bg-light text-dark font-monospace border">{{ m.maxArea }}</span>
          </td>
          <td class="text-end fw-bold text-dark">Rp {{ formatNumber(m.minim) }}</td>
          <td class="text-end fw-semibold text-secondary">Rp {{ formatNumber(m.druck) }}</td>
          <td class="text-end">
            <span v-if="m.plateCost > 0" class="text-dark">Rp {{ formatNumber(m.plateCost) }}</span>
            <span v-else class="text-muted fst-italic">No Plate</span>
          </td>
          <td class="small text-muted">{{ m.update }}</td>
          <td>
            <span
              class="badge rounded"
              :class="m.status === 'Active' ? 'badge-success' : 'badge-secondary'"
            >
              • {{ m.status }}
            </span>
          </td>
          <td class="text-center">
            <div class="d-inline-flex gap-1">
              <button
                type="button"
                class="btn btn-sm btn-outline-primary p-1"
                title="Edit Machine"
                @click="emit('edit', m)"
              >
                <FeatherIcon name="edit" size="14" />
              </button>
              <button
                type="button"
                class="btn btn-sm btn-outline-danger p-1"
                title="Delete Machine"
                @click="emit('delete', m.id)"
              >
                <FeatherIcon name="trash-2" size="14" />
              </button>
            </div>
          </td>
        </tr>
        <tr v-if="machines.length === 0">
          <td colspan="10" class="text-center py-4 text-muted">
            Tidak ada data mesin cetak yang ditemukan.
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

