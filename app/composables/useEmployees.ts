import type { EmployeeItem, EmployeeFormData, EmployeeFilterParams } from '#server/types/employee'

interface ResponseData {
  success: boolean
  data: EmployeeItem[]
  message?: string
}

export function useEmployees() {
  const { departments } = useDepartments()
  const { data, pending, error, refresh } = useApiFetch<ResponseData>('/api/v1/admin/employees', {
    key: 'employees-list'
  })

  const employees = computed<EmployeeItem[]>(() => data.value?.data ?? [])

  const saveEmployee = async (payload: EmployeeFormData) => {
    const { id, ...body } = payload
    for (const field of ['avatar', 'photoId'] as const) {
      const value = body[field]
      if (value?.startsWith('data:image/')) {
        const match = value.match(/^data:(image\/(?:jpeg|png|webp));base64,(.+)$/)
        if (!match) throw new Error('Gunakan gambar JPG, PNG, atau WebP.')
        const bytes = Uint8Array.from(atob(match[2]!), character => character.charCodeAt(0))
        const upload = new FormData()
        upload.append('file', new Blob([bytes], { type: match[1] }), `employee.${match[1]!.split('/')[1]}`)
        upload.append('folder', 'employees')
        const result = await apiFetch<{ data: { url: string } }>('/api/v1/admin/uploads/image', { method: 'POST', body: upload })
        body[field] = result.data.url
      }
    }
    body.departmentId ||= departments.value.find(item => item.name === body.department)?.id
    const res = await apiFetch<{ success: boolean; data: EmployeeItem; message?: string }>(id ? `/api/v1/admin/employees/${encodeURIComponent(id)}` : '/api/v1/admin/employees', {
      method: id ? 'PUT' : 'POST',
      body
    })
    await refresh()
    return res
  }

  const deleteEmployee = async (id: string) => {
    const res = await apiFetch<{ success: boolean; message?: string }>(`/api/v1/admin/employees/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    })
    await refresh()
    return res
  }

  return {
    employees,
    pending,
    error,
    refresh,
    saveEmployee,
    deleteEmployee
  }
}
