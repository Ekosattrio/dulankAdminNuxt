import { defineEventHandler } from 'h3'
import { readJSON } from '~~/server/utils/data'
import type { StorageSetting } from '~~/server/types/storage-setting'

export default defineEventHandler(async () => {
  try {
    const data = await readJSON<StorageSetting>('storage-settings.json', {
      local: { enabled: true },
      aws: {
        enabled: true,
        accessKey: 'AKIAIOSFODNN7EXAMPLE',
        secretKey: '••••••••••••',
        bucketName: 'kacetak-storage',
        region: 'ap-southeast-1',
        baseUrl: 'https://s3.ap-southeast-1.amazonaws.com/kacetak-storage'
      }
    })
    return {
      success: true,
      data
    }
  } catch (err: any) {
    return {
      success: false,
      message: err.message || 'Failed to load storage settings'
    }
  }
})

