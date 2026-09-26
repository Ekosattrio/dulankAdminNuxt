<script setup lang="ts">
import type { PaperPrice } from '~/types/paper-price'
import { formatNumber } from '~/composables/useFormatters'
import FeatherIcon from '~/components/common/FeatherIcon.vue'

defineProps<{
  prices: PaperPrice[]
}>()

const emit = defineEmits<{
  (e: 'edit', price: PaperPrice): void
  (e: 'delete', id: string): void
}>()
</script>

<template>
  <div class="table-responsive">
    <table class="table datanew align-middle">
      <thead class="thead-light">
        <tr>
          <th>Nama Kertas</th>
          <th>Group Kertas</th>
          <th>Merk</th>
          <th>Ukuran</th>
          <th>Satuan</th>
          <th class="text-center">GSM</th>
          <th>Min Order</th>
          <th>Kelipatan</th>
          <th class="text-end">Harga Kertas</th>
          <th>Last Update</th>
          <th>Status</th>
          <th class="text-center" style="width: 100px">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="p in prices" :key="p.id">
          <td class="fw-bold text-dark">{{ p.nama }}</td>
          <td>{{ p.group }}</td>
          <td>{{ p.merk }}</td>
          <td>{{ p.ukuran }}</td>
          <td>{{ p.satuan }}</td>
          <td class="text-center fw-bold">{{ p.gramatur }}</td>
          <td>{{ p.minOrder }}</td>
          <td>{{ p.kelipatan }}</td>
          <td class="text-end fw-bold text-dark">
            Rp {{ formatNumber(p.harga) }} / {{ p.satuan }}
          </td>
          <td class="small text-muted">{{ p.update }}</td>
          <td>
            <span
              class="badge rounded"
              :class="p.status === 'Active' ? 'badge-success' : 'badge-secondary'"
            >
              • {{ p.status }}
            </span>
          </td>
          <td class="text-center">
            <div class="d-inline-flex gap-1">
              <button
                type="button"
                class="btn btn-sm btn-outline-primary p-1"
                title="Edit Price"
                @click="emit('edit', p)"
              >
                <FeatherIcon name="edit" size="14" />
              </button>
              <button
                type="button"
                class="btn btn-sm btn-outline-danger p-1"
                title="Delete Price"
                @click="emit('delete', p.id)"
              >
                <FeatherIcon name="trash-2" size="14" />
              </button>
            </div>
          </td>
        </tr>
        <tr v-if="prices.length === 0">
          <td colspan="12" class="text-center py-4 text-muted">
            Tidak ada konfigurasi harga kertas yang ditemukan.
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

