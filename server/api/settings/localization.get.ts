import { defineEventHandler } from 'h3'
import { readJSON } from '#server/utils/data'
import type { LocalizationConfig } from '#server/types/system-settings'

const FILE_NAME = 'localization-settings.json'

export default defineEventHandler(async () => {
  const config = readJSON<LocalizationConfig>(FILE_NAME, {
    language: 'Indonesian',
    languageSwitcher: true,
    timezone: 'Asia/Jakarta',
    dateFormat: 'DD MMM YYYY',
    timeFormat: '24 Hours',
    financialYear: '2026',
    startingMonth: 'January',
    currency: 'IDR',
    currencySymbol: 'Rp',
    currencyPosition: 'before',
    decimalSeparator: ',',
    thousandSeparator: '.',
    countriesRestriction: 'Allow All Countries',
    allowedFiles: 'JPG, GIF, PNG, PDF, ZIP, SVG',
    maxFileSize: 5000
  })

  return {
    success: true,
    data: config
  }
})

