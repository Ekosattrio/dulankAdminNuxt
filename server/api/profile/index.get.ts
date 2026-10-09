import type { UserProfile } from '#server/types/profile'

export default defineEventHandler(async () => {
  const profile = await readJSON<UserProfile>('profile.json', {
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

  return createResponse(profile, 'Data profil berhasil dimuat')
})
