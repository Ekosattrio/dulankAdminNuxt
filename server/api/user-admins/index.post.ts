import { initialUserAdmins } from '~~/server/utils/userManagementStore'
import type { UserAdmin } from '~~/server/types/user-management'

export default defineEventHandler(async (event) => {
  const body = await readBody<Partial<UserAdmin>>(event)

  if (!body.name || !body.email || !body.role) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Name, Email, and Role are required',
    })
  }

  const existingIdx = initialUserAdmins.findIndex((a) => a.id === body.id)

  if (existingIdx !== -1) {
    initialUserAdmins[existingIdx] = {
      ...initialUserAdmins[existingIdx],
      ...body,
    } as UserAdmin
    return {
      success: true,
      message: 'User Admin updated successfully',
      data: initialUserAdmins[existingIdx],
    }
  } else {
    const newAdmin: UserAdmin = {
      id: `adm-${Date.now()}`,
      userId: body.userId || `U${String(initialUserAdmins.length + 1).padStart(3, '0')}`,
      name: body.name,
      email: body.email,
      role: body.role as any,
      stores: body.stores && body.stores.length > 0 ? body.stores : ['Toko Pusat'],
      status: body.status || 'Active',
      phone: body.phone || '',
      avatar: body.avatar || '/assets/img/users/user-01.jpg',
      descriptions: body.descriptions || '',
      createdAt: new Date().toISOString().slice(0, 10),
    }
    initialUserAdmins.unshift(newAdmin)
    return {
      success: true,
      message: 'User Admin created successfully',
      data: newAdmin,
    }
  }
})
