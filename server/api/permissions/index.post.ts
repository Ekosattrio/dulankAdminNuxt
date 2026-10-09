import { savePermissionsMatrix } from '~~/server/utils/rolesData'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const matrix = savePermissionsMatrix(body)

  return {
    success: true,
    message: 'Permissions saved successfully',
    data: matrix,
  }
})
