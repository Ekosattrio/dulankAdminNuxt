<script setup lang="ts">
import type { EmployeeItem } from '~/types/employee'
import FeatherIcon from '~/components/Common/FeatherIcon.vue'

defineProps<{
  employees: EmployeeItem[]
}>()

const emit = defineEmits<{
  (e: 'view', item: EmployeeItem): void
  (e: 'edit', item: EmployeeItem): void
  (e: 'delete', id: string): void
}>()

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'Active':
      return 'badge-success'
    case 'Resign':
      return 'badge-danger'
    case 'Inactive':
    default:
      return 'badge-secondary'
  }
}
</script>

<template>
  <div class="table-responsive">
    <table class="table datanew align-middle">
      <thead class="thead-light">
        <tr>
          <th>ID</th>
          <th>Employee Name</th>
          <th>Department</th>
          <th>Phone</th>
          <th>Join Date</th>
          <th>Status</th>
          <th class="text-center" style="width: 110px">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="emp in employees" :key="emp.id">
          <td class="fw-bold text-primary">{{ emp.id }}</td>
          <td>
            <div class="d-flex flex-column">
              <span class="fw-bold text-dark">{{ emp.name }}</span>
              <span v-if="emp.email" class="text-muted small">{{ emp.email }}</span>
            </div>
          </td>
          <td>
            <span class="badge bg-light text-dark border">{{ emp.department }}</span>
          </td>
          <td class="small">{{ emp.phone }}</td>
          <td class="small text-muted">{{ emp.joinDate }}</td>
          <td>
            <span class="badge rounded" :class="getStatusBadge(emp.status)">
              • {{ emp.status }}
            </span>
          </td>
          <td class="text-center">
            <div class="d-inline-flex gap-1">
              <button
                type="button"
                class="btn btn-sm btn-outline-info p-1"
                title="View"
                @click="emit('view', emp)"
              >
                <FeatherIcon name="eye" size="14" />
              </button>
              <button
                type="button"
                class="btn btn-sm btn-outline-primary p-1"
                title="Edit"
                @click="emit('edit', emp)"
              >
                <FeatherIcon name="edit" size="14" />
              </button>
              <button
                type="button"
                class="btn btn-sm btn-outline-danger p-1"
                title="Delete"
                @click="emit('delete', emp.id)"
              >
                <FeatherIcon name="trash-2" size="14" />
              </button>
            </div>
          </td>
        </tr>
        <tr v-if="employees.length === 0">
          <td colspan="7" class="text-center py-4 text-muted">
            Tidak ada data karyawan yang ditemukan.
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

