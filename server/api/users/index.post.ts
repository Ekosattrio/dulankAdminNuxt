import { defineEventHandler, readBody } from 'h3'
import type { MemberUser } from '~~/server/types/user-management'
import { saveUser } from '~~/server/utils/usersData'

export default defineEventHandler(async (event) => {
  const body = await readBody<Partial<MemberUser>>(event)

  const { user, isNew } = saveUser(body)

  return {
    success: true,
    message: isNew ? 'Member created successfully' : 'Member updated successfully',
    data: user,
  }
})
