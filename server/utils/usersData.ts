import type { MemberUser } from '~~/server/types/user-management'
import { readJSON, writeJSON } from './data'
import { isDateWithinRange } from './dateRange'

const USERS_FILE = 'users.json'

export function getUsers(filter?: {
  search?: string
  status?: string
  startDate?: string | null
  endDate?: string | null
}): MemberUser[] {
  let result = readJSON<MemberUser[]>(USERS_FILE, [])

  if (filter?.search) {
    const q = filter.search.trim().toLowerCase()
    result = result.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.customerId.toLowerCase().includes(q) ||
        (m.phone && m.phone.toLowerCase().includes(q))
    )
  }

  if (filter?.status && filter.status !== 'All Statuses' && filter.status !== 'All') {
    result = result.filter((m) => m.status === filter.status)
  }

  if (filter?.startDate || filter?.endDate) {
    result = result.filter((m) => {
      const dateVal = m.createdAt || ''
      return isDateWithinRange(dateVal, filter.startDate || null, filter.endDate || null)
    })
  }

  return result
}

export function saveUser(payload: Partial<MemberUser>): { user: MemberUser; isNew: boolean } {
  if (!payload.name?.trim() || !payload.email?.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Name and Email are required',
    })
  }

  const members = readJSON<MemberUser[]>(USERS_FILE, [])
  const existingIdx = payload.id ? members.findIndex((m) => m.id === payload.id) : -1

  if (existingIdx !== -1) {
    const current = members[existingIdx]
    if (!current) throw createError({ statusCode: 404, statusMessage: 'Member not found' })
    const updated: MemberUser = {
      ...current,
      ...payload,
      name: payload.name.trim(),
      email: payload.email.trim(),
    }
    members[existingIdx] = updated
    writeJSON(USERS_FILE, members)
    return { user: updated, isNew: false }
  } else {
    const newMember: MemberUser = {
      id: payload.id || `mem-${Date.now()}`,
      customerId: payload.customerId || `ID${String(members.length + 1).padStart(6, '0')}`,
      name: payload.name.trim(),
      email: payload.email.trim(),
      phone: payload.phone || '',
      verifiedEmail: payload.verifiedEmail ?? true,
      subscription: payload.subscription ?? false,
      status: payload.status || 'Active Member',
      avatar: payload.avatar || '/assets/img/users/user-01.jpg',
      createdAt: payload.createdAt || new Date().toISOString().slice(0, 10),
    }
    members.unshift(newMember)
    writeJSON(USERS_FILE, members)
    return { user: newMember, isNew: true }
  }
}

export function deleteUser(id: string): MemberUser {
  const members = readJSON<MemberUser[]>(USERS_FILE, [])
  const idx = members.findIndex((m) => m.id === id)

  if (idx === -1) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Member not found',
    })
  }

  const removed = members.splice(idx, 1)[0]
  if (!removed) throw createError({ statusCode: 404, statusMessage: 'Member not found' })
  writeJSON(USERS_FILE, members)
  return removed
}

