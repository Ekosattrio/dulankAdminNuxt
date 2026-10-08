export interface UserProfile {
  id: string
  firstName: string
  lastName: string
  userName: string
  phoneNumber: string
  email: string
  role: string
  avatarUrl: string
  address: string
  country: string
  province: string
  city: string
  postalCode: string
}

export interface PasswordChangePayload {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export interface ProfileUpdatePayload extends Partial<UserProfile> {
  passwordData?: PasswordChangePayload
}
