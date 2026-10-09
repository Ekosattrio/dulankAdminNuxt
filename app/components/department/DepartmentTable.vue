<script setup lang="ts">
import type { Department } from '~/types/department'
import FeatherIcon from '~/components/common/FeatherIcon.vue'

defineProps<{
  departments: Department[]
}>()

const emit = defineEmits<{
  (e: 'edit', department: Department): void
  (e: 'delete', id: string): void
}>()
</script>

<template>
  <div class="table-responsive">
    <table class="table datanew align-middle">
      <thead class="thead-light">
        <tr>
          <th>Department</th>
          <th>Members</th>
          <th class="text-center">Total Member</th>
          <th>Created Date</th>
          <th>Status</th>
          <th class="text-center" style="width: 100px">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="d in departments" :key="d.id">
          <td class="fw-bold text-dark">{{ d.name }}</td>
          <td>
            <div class="d-flex flex-wrap gap-1">
              <span
                v-for="m in d.members"
                :key="m"
                class="badge bg-light text-dark border rounded-pill"
              >
                {{ m }}
              </span>
              <span v-if="d.members.length === 0" class="text-muted small fst-italic">No members</span>
            </div>
          </td>
          <td class="text-center fw-bold">{{ d.totalMembers }}</td>
          <td class="small">{{ d.createdDate }}</td>
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
                title="Edit Department"
                @click="emit('edit', d)"
              >
                <FeatherIcon name="edit" size="14" />
              </button>
              <button
                type="button"
                class="btn btn-sm btn-outline-danger p-1"
                title="Delete Department"
                @click="emit('delete', d.id)"
              >
                <FeatherIcon name="trash-2" size="14" />
              </button>
            </div>
          </td>
        </tr>
        <tr v-if="departments.length === 0">
          <td colspan="6" class="text-center py-4 text-muted">
            Tidak ada departemen yang ditemukan.
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

