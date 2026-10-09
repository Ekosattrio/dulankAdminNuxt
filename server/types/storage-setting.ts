export interface StorageSetting {
  local: {
    enabled: boolean
  }
  aws: {
    enabled: boolean
    accessKey: string
    secretKey: string
    bucketName: string
    region: string
    baseUrl: string
  }
}

