import { getPermissionsMatrix } from '~~/server/utils/rolesData'

export default defineEventHandler(() => {
  const result = getPermissionsMatrix()
  return {
    success: true,
    data: result,
  }
})
