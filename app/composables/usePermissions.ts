import type { PermissionAction, PermissionGroup } from '~~/server/types/user-management'

export interface PermissionMenuGroupItem {
  group: string
  pages: string[]
}

interface PermissionRow {
  id: string
  name: string
}

interface RoleRow {
  id: string
  name: string
  permissions: string[]
}

interface RolesResponse {
  success: boolean
  data: RoleRow[]
}

interface PermissionsResponse {
  success: boolean
  data: PermissionRow[]
}

const groupedPermissions = (names: string[]): PermissionMenuGroupItem[] => {
  const map = new Map<string, string[]>()

  for (const name of names) {
    const group = name.includes('.') ? (name.split('.')[0] ?? 'umum') : 'umum'
    const pages = map.get(group) ?? []
    pages.push(name)
    map.set(group, pages)
  }

  return [...map.entries()].map(([group, pages]) => ({ group, pages }))
}

const derivedAction = (allowed: boolean): PermissionAction => ({
  create: allowed,
  edit: allowed,
  delete: allowed,
  view: allowed,
  allowAll: allowed,
})

/**
 * Matrix permission — backend Laravel `/api/v1/admin/roles` (permission datar
 * per role). Kolom tambah/ubah/hapus/lihat dicerminkan dari kepemilikan
 * permission (mengikuti struktur datar backend).
 */
export function usePermissions() {
  const rolesRequest = useApiFetch<RolesResponse>('/api/v1/admin/roles', {
    key: 'system-roles-matrix',
  })
  const permissionsRequest = useApiFetch<PermissionsResponse>('/api/v1/admin/permissions', {
    key: 'system-permissions-list',
  })

  const pending = computed(() => rolesRequest.pending.value || permissionsRequest.pending.value)
  const error = computed(() => rolesRequest.error.value || permissionsRequest.error.value)

  const groups = computed<PermissionMenuGroupItem[]>(() =>
    groupedPermissions(permissionsRequest.data.value?.data?.map(permission => permission.name) ?? []),
  )

  const modules = computed<string[]>(() => groups.value.flatMap(group => group.pages))

  const roles = computed<string[]>(() =>
    (rolesRequest.data.value?.data ?? []).filter(role => role.name !== 'super-admin').map(role => role.name ?? ''),
  )

  const matrix = ref<Record<string, Record<string, PermissionAction>>>({})

  const refreshMatrix = () => {
    matrix.value = {}
    const permissions = new Set(permissionsRequest.data.value?.data?.map(item => item.name) ?? [])

    for (const role of rolesRequest.data.value?.data ?? []) {
      const has = new Set(role.permissions ?? [])
      for (const page of permissions) {
        const allowed = has.has(page)
        matrix.value[page] = matrix.value[page] ?? {}
        matrix.value[page][role.name] = derivedAction(allowed)
      }
    }
  }

  watch(
    () => [rolesRequest.data.value, permissionsRequest.data.value],
    () => refreshMatrix(),
    { immediate: true },
  )

  const ensurePermissionItem = (page: string, role: string): PermissionAction => {
    if (!matrix.value[page]) {
      matrix.value[page] = {}
    }
    if (!matrix.value[page][role]) {
      matrix.value[page][role] = derivedAction(false)
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
    value: boolean,
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
    return groupPages.every((page) => {
      const item = matrix.value[page]?.[role]
      return !!(item?.allowAll || (item?.create && item?.edit && item?.delete && item?.view))
    })
  }

  const savePermissions = async (matrixPayload: Record<string, Record<string, PermissionAction>>) => {
    const roleRows = rolesRequest.data.value?.data ?? []

    for (const roleRow of roleRows) {
      if (roleRow.name === 'super-admin') continue

      const allowedPages = Object.entries(matrixPayload)
        .filter(([, actions]) => (actions[roleRow.name]?.allowAll ?? false))
        .map(([page]) => page)

      if (!roleRow.permissions || allowedPages.sort().join('|') !== [...(roleRow.permissions ?? [])].sort().join('|')) {
        await apiFetch(`/api/v1/admin/roles/${encodeURIComponent(roleRow.id)}`, {
          method: 'PUT',
          body: { name: roleRow.name, permissions: allowedPages },
        })
      }
    }

    await Promise.all([rolesRequest.refresh(), permissionsRequest.refresh()])
  }

  const refresh = async () => {
    await Promise.all([rolesRequest.refresh(), permissionsRequest.refresh()])
    refreshMatrix()
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