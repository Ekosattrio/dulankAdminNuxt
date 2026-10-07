import { defineEventHandler, readBody, createError } from 'h3'
import type { MemberUser } from '~~/server/types/user-management'
import { readJSON, writeJSON } from '~~/server/utils/data'

export default defineEventHandler(async (event) => {
  const body = await readBody<Partial<MemberUser>>(event)

  if (!body.name || !body.email) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Name and Email are required',
    })
  }

  const members = readJSON<MemberUser[]>('users.json', [])
  const existingIdx = body.id ? members.findIndex((m) => m.id === body.id) : -1

  if (existingIdx !== -1) {
    members[existingIdx] = {
      ...members[existingIdx],
      ...body,
    } as MemberUser
    writeJSON('users.json', members)
    return {
      success: true,
      message: 'Member updated successfully',
      data: members[existingIdx],
    }
  } else {
    const newMember: MemberUser = {
      id: `mem-${Date.now()}`,
      customerId: body.customerId || `ID${String(members.length + 1).padStart(6, '0')}`,
      name: body.name,
      email: body.email,
      phone: body.phone || '',
      verifiedEmail: body.verifiedEmail ?? true,
      subscription: body.subscription ?? false,
      status: body.status || 'Active Member',
      avatar: body.avatar || '/assets/img/users/user-01.jpg',
      createdAt: body.createdAt || new Date().toISOString().slice(0, 10),
    }
    members.unshift(newMember)
    writeJSON('users.json', members)
    return {
      success: true,
      message: 'Member created successfully',
      data: newMember,
    }
  }
})
