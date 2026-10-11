import { getAdminDashboard } from '#server/utils/adminDashboard'

export default defineEventHandler(() => ({ success: true, data: getAdminDashboard() }))
