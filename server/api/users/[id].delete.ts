import { defineEventHandler, getRouterParam, createError } from 'h3'
import type { MemberUser } from '~~/server/types/user-management'
import { readJSON, writeJSON } from '~~/server/utils/data'

export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')
  const members = readJSON<MemberUser[]>('users.json', [])
  const idx = members.findIndex((m) => m.id === id)

  if (idx === -1) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Member not found',
    })
  }

  const removed = members.splice(idx, 1)[0]
  writeJSON('users.json', members)
  return {
    success: true,
    message: 'Member deleted successfully',
    data: removed,
  }
})
