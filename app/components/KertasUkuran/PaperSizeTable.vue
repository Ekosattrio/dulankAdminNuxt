<script setup lang="ts">
import type { PaperSize } from '~/types/paper-size'
import FeatherIcon from '~/components/Common/FeatherIcon.vue'

defineProps<{
  sizes: PaperSize[]
}>()

const emit = defineEmits<{
  (e: 'edit', size: PaperSize): void
  (e: 'delete', id: string): void
}>()
</script>

<template>
  <div class="table-responsive">
    <table class="table datanew align-middle">
      <thead class="thead-light">
        <tr>
          <th>Format / Ukuran</th>
          <th>Dimensi (P x L)</th>
          <th>Unit</th>
          <th>Last Update</th>
          <th>Status</th>
          <th class="text-center" style="width: 100px">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="s in sizes" :key="s.id">
          <td class="fw-bold text-dark">{{ s.name }}</td>
          <td>
            <span class="badge bg-light text-dark font-monospace border">{{ s.dimension }}</span>
          </td>
          <td>{{ s.unit }}</td>
          <td class="small text-muted">{{ s.update }}</td>
          <td>
            <span
              class="badge rounded"
              :class="s.status === 'Active' ? 'badge-success' : 'badge-secondary'"
            >
              • {{ s.status }}
            </span>
          </td>
          <td class="text-center">
            <div class="d-inline-flex gap-1">
              <button
                type="button"
                class="btn btn-sm btn-outline-primary p-1"
                title="Edit Size"
                @click="emit('edit', s)"
              >
                <FeatherIcon name="edit" size="14" />
              </button>
              <button
                type="button"
                class="btn btn-sm btn-outline-danger p-1"
                title="Delete Size"
                @click="emit('delete', s.id)"
              >
                <FeatherIcon name="trash-2" size="14" />
              </button>
            </div>
          </td>
        </tr>
        <tr v-if="sizes.length === 0">
          <td colspan="6" class="text-center py-4 text-muted">
            Tidak ada format / ukuran kertas yang ditemukan.
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

