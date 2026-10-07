import type { PermissionAction, PermissionGroup } from '~~/server/types/user-management'

export interface PermissionMenuGroupItem {
  group: string
  pages: string[]
}

export function usePermissions() {
  const { data, pending, error, refresh } = useFetch<{
    success: boolean
    data: {
      groups: { group: string; pages: string[] }[]
      modules?: string[]
      roles: string[]
      matrix: Record<string, Record<string, PermissionAction>>
    }
  }>('/api/permissions', {
    key: 'system-permissions-matrix',
  })

  const matrix = ref<Record<string, Record<string, PermissionAction>>>({})

  watchEffect(() => {
    if (data.value?.data?.matrix) {
      matrix.value = JSON.parse(JSON.stringify(data.value.data.matrix))
    }
  })

  const groups = computed<{ group: string; pages: string[] }[]>(() => {
    return data.value?.data?.groups || []
  })

  const modules = computed<string[]>(() => {
    if (data.value?.data?.modules && data.value.data.modules.length > 0) {
      return data.value.data.modules
    }
    return groups.value.flatMap((g) => g.pages)
  })

  const roles = computed<string[]>(() => data.value?.data?.roles || [])

  const ensurePermissionItem = (page: string, role: string): PermissionAction => {
    if (!matrix.value[page]) {
      matrix.value[page] = {}
    }
    if (!matrix.value[page][role]) {
      matrix.value[page][role] = {
        create: false,
        edit: false,
        delete: false,
        view: false,
        allowAll: false,
      }
    }
    return matrix.value[page][role]
  }

  const toggleAllowAll = (page: string, role: string, value: boolean) => {
    const item = ensurePermissionItem(page, role)
    item.allowAll = value
    item.create = value
    item.edit = value
    item.delete = value
    item.view = value
  }

  const toggleField = (
    page: string,
    role: string,
    field: 'create' | 'edit' | 'delete' | 'view',
    value: boolean
  ) => {
    const item = ensurePermissionItem(page, role)
    item[field] = value
    item.allowAll = item.create && item.edit && item.delete && item.view
  }

  const toggleGroupAll = (groupPages: string[], role: string, value: boolean) => {
    for (const page of groupPages) {
      toggleAllowAll(page, role, value)
    }
  }

  const isGroupAllAllowed = (groupPages: string[], role: string): boolean => {
    if (!groupPages.length) return false
    return groupPages.every((p) => {
      const item = matrix.value[p]?.[role]
      return !!(item?.allowAll || (item?.create && item?.edit && item?.delete && item?.view))
    })
  }

  const savePermissions = async (matrixPayload: Record<string, Record<string, PermissionAction>>) => {
    await $fetch('/api/permissions', {
      method: 'POST',
      body: { matrix: matrixPayload },
    })
    await refresh()
  }

  return {
    matrix,
    groups,
    modules,
    roles,
    pending,
    error,
    refresh,
    toggleAllowAll,
    toggleField,
    toggleGroupAll,
    isGroupAllAllowed,
    savePermissions,
  }
}
