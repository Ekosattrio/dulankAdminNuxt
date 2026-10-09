export interface GoogleCaptchaConfig {
  enabled: boolean
  siteKey: string
  secretKey: string
}

export interface GoogleAnalyticsConfig {
  enabled: boolean
  trackingId: string
}

export interface GoogleAdsenseConfig {
  enabled: boolean
  code: string
}

export interface GoogleMapConfig {
  enabled: boolean
  mapId: string
}

export interface SystemIntegrations {
  captcha: GoogleCaptchaConfig
  analytics: GoogleAnalyticsConfig
  adsense: GoogleAdsenseConfig
  map: GoogleMapConfig
}

export type IntegrationKey = 'captcha' | 'analytics' | 'adsense' | 'map'

export interface SystemIntegrationsResponse {
  success: boolean
  data: SystemIntegrations
  message?: string
}

