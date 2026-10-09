import type { UserProfile, PasswordChangePayload } from '#server/types/profile'

interface ProfilePostBody extends Partial<UserProfile> {
  action?: 'update-profile' | 'change-password'
  passwordData?: PasswordChangePayload
}

export default defineEventHandler(async (event) => {
  const body = await readBody<ProfilePostBody>(event)

  if (!body) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Data permintaan profil tidak boleh kosong'
    })
  }

  // Handle password change request
  if (body.action === 'change-password' || body.passwordData) {
    const pw = body.passwordData
    if (!pw || !pw.currentPassword || !pw.newPassword || !pw.confirmPassword) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Semua bidang kata sandi wajib diisi'
      })
    }

    if (pw.newPassword.length < 6) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Kata sandi baru minimal harus 6 karakter'
      })
    }

    if (pw.newPassword !== pw.confirmPassword) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Konfirmasi kata sandi baru tidak cocok'
      })
    }

    return createResponse({ success: true }, 'Kata sandi akun Anda berhasil diperbarui')
  }

  // Handle profile update
  const currentProfile = await readJSON<UserProfile>('profile.json', {
    id: 'USR-DLK-001',
    firstName: 'Rian',
    lastName: 'Dharmawan',
    userName: 'rian.admin',
    phoneNumber: '+62 812-8765-4321',
    email: 'rian.dharmawan@dulanksemesta.com',
    role: 'Super Admin & Head of Production',
    avatarUrl: '/assets/img/users/user-01.jpg',
    address: 'Jl. Percetakan Negara No. 88, Johar Baru',
    country: 'Indonesia',
    province: 'DKI Jakarta',
    city: 'Jakarta Pusat',
    postalCode: '10560'
  })

  const updatedProfile: UserProfile = {
    ...currentProfile,
    firstName: body.firstName?.trim() || currentProfile.firstName,
    lastName: body.lastName !== undefined ? body.lastName.trim() : currentProfile.lastName,
    userName: body.userName?.trim() || currentProfile.userName,
    phoneNumber: body.phoneNumber?.trim() || currentProfile.phoneNumber,
    email: body.email?.trim() || currentProfile.email,
    role: body.role?.trim() || currentProfile.role,
    avatarUrl: body.avatarUrl || currentProfile.avatarUrl,
    address: body.address !== undefined ? body.address.trim() : currentProfile.address,
    country: body.country?.trim() || currentProfile.country,
    province: body.province?.trim() || currentProfile.province,
    city: body.city?.trim() || currentProfile.city,
    postalCode: body.postalCode?.trim() || currentProfile.postalCode
  }

  await writeJSON('profile.json', updatedProfile)

  return createResponse(updatedProfile, 'Data profil berhasil diperbarui')
})
