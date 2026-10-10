<script setup lang="ts">
import type { Designation } from '~/types/designation'
import FeatherIcon from '~/components/Common/FeatherIcon.vue'

defineProps<{
  designations: Designation[]
}>()

const emit = defineEmits<{
  (e: 'edit', designation: Designation): void
  (e: 'delete', id: string): void
}>()
</script>

<template>
  <div class="table-responsive">
    <table class="table datanew align-middle">
      <thead class="thead-light">
        <tr>
          <th>Designation / Jabatan</th>
          <th>Members</th>
          <th class="text-center">Total Members</th>
          <th>Created On</th>
          <th>Status</th>
          <th class="text-center" style="width: 100px">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="d in designations" :key="d.id">
          <td class="fw-bold text-dark">{{ d.name }}</td>
          <td>
            <div class="avatar-group d-flex align-items-center">
              <span
                v-for="(img, idx) in d.members.slice(0, 4)"
                :key="idx"
                class="badge bg-light text-primary border rounded-circle p-2 me-1 font-monospace"
                style="width: 28px; height: 28px; display: inline-flex; justify-content: center; align-items: center;"
              >
                {{ idx + 1 }}
              </span>
              <span v-if="d.members.length > 4" class="badge bg-secondary rounded-circle">
                +{{ d.members.length - 4 }}
              </span>
            </div>
          </td>
          <td class="text-center fw-bold">{{ d.totalMembers }}</td>
          <td class="small">{{ d.createdOn }}</td>
          <td>
            <span
              class="badge rounded"
              :class="d.status === 'Active' ? 'badge-success' : 'badge-secondary'"
            >
              • {{ d.status }}
            </span>
          </td>
          <td class="text-center">
            <div class="d-inline-flex gap-1">
              <button
                type="button"
                class="btn btn-sm btn-outline-primary p-1"
                title="Edit Designation"
                @click="emit('edit', d)"
              >
                <FeatherIcon name="edit" size="14" />
              </button>
              <button
                type="button"
                class="btn btn-sm btn-outline-danger p-1"
                title="Delete Designation"
                @click="emit('delete', d.id)"
              >
                <FeatherIcon name="trash-2" size="14" />
              </button>
            </div>
          </td>
        </tr>
        <tr v-if="designations.length === 0">
          <td colspan="6" class="text-center py-4 text-muted">
            Tidak ada jabatan yang ditemukan.
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

