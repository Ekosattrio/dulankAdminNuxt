export interface SocialProviderConfig {
  enabled: boolean
  clientId: string
  clientSecret: string
  redirectUrl: string
}

export type SocialProviderKey = 'facebook' | 'twitter' | 'google' | 'linkedin'

export type SocialAuthConfig = Record<SocialProviderKey, SocialProviderConfig>

export interface SocialAuthResponse {
  success: boolean
  data: SocialAuthConfig
  message?: string
}

