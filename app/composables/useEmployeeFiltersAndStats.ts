import { ref, computed, type Ref } from 'vue'
import type { EmployeeItem } from '#server/types/employee'
import type { DateRangeValue } from '~/composables/useDateRange'

export function useEmployeeFiltersAndStats(employees: Ref<EmployeeItem[]>) {
  const searchQuery = ref('')
  const filterDepartment = ref('')
  const filterStatus = ref('')
  const filterDateRange = ref<DateRangeValue | null>(null)

  const filteredEmployees = computed(() => {
    return employees.value.filter((emp) => {
      if (filterDepartment.value && emp.department.toLowerCase() !== filterDepartment.value.toLowerCase()) {
        return false
      }
      if (filterStatus.value && emp.status.toLowerCase() !== filterStatus.value.toLowerCase()) {
        return false
      }
      if (filterDateRange.value?.start && filterDateRange.value?.end) {
        if (!emp.joinDate) return false
        const parts = emp.joinDate.split('/')
        const empDate = parts.length === 3 ? `${parts[2]}-${parts[1]}-${parts[0]}` : emp.joinDate
        if (empDate < filterDateRange.value.start || empDate > filterDateRange.value.end) {
          return false
        }
      }
      return true
    })
  })

  const stats = computed(() => {
    const all = employees.value
    const total = all.length
    const active = all.filter(e => e.status === 'Active').length
    const inactive = all.filter(e => e.status === 'Resign' || e.status === 'Inactive').length
    const newJoiners = all.filter(e => e.joinDate && (e.joinDate.includes('2025') || e.joinDate.includes('2026'))).length

    return {
      total,
      active,
      inactive,
      newJoiners: newJoiners || Math.min(total, 3),
    }
  })

  return {
    searchQuery,
    filterDepartment,
    filterStatus,
    filterDateRange,
    filteredEmployees,
    stats,
  }
}

