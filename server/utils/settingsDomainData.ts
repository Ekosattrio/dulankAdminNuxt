import type { BankSetting } from '~~/server/types/bank-setting'
import type { CurrencySetting } from '~~/server/types/currency-setting'
import type { PrinterSetting } from '~~/server/types/printer-setting'
import type { CompanySetting, CompanySettingUpdatePayload } from '#server/types/company-setting'
import type { PosSetting } from '#server/types/pos-setting'
import type { StorageSetting } from '~~/server/types/storage-setting'
import type { AppearanceSetting } from '~~/server/types/appearance-setting'
import type { CalendarConfig } from '#server/types/calendar-setting'
import type { EmailConfig, TestEmailPayload, TestEmailResult, LocalizationConfig, OtpConfig } from '#server/types/system-settings'
import type { GdprSetting } from '#server/types/gdpr-setting'
import type { InvoiceSetting } from '#server/types/invoice-setting'
import type { PaymentGatewaysRecord } from '#server/types/payment-gateway'
import type { PreferenceItem } from '#server/types/preference-setting'
import type { UserProfile } from '#server/types/profile'
import type { SecuritySettings } from '#server/types/security-settings'
import type { SocialAuthConfig } from '#server/types/social-auth'
import type { SystemIntegrations } from '#server/types/system-integrations'
import type { SmsGatewaysRecord } from '#server/types/sms-gateway'
import { readJSON, writeJSON } from './data'

// ----------------- Bank Settings -----------------

export async function getBankSettings(query?: { search?: string; status?: string }): Promise<BankSetting[]> {
  const items = await readJSON<BankSetting[]>('bank-settings.json', [])
  let filtered = items

  const search = (query?.search || '').toLowerCase().trim()
  const status = query?.status || ''

  if (search) {
    filtered = filtered.filter(item =>
      item.bankName.toLowerCase().includes(search) ||
      item.accountNumber.includes(search) ||
      item.accountName.toLowerCase().includes(search)
    )
  }

  if (status && status !== 'all') {
    filtered = filtered.filter(item => item.status === status)
  }

  return filtered
}

export async function saveBankSetting(body: Partial<BankSetting> & { id?: string }): Promise<BankSetting> {
  if (!body.bankName || !body.accountNumber) {
    throw createError({ statusCode: 400, statusMessage: 'Bank Name and Account Number are required' })
  }

  const items = await readJSON<BankSetting[]>('bank-settings.json', [])

  if (body.id) {
    const idx = items.findIndex(i => i.id === body.id)
    if (idx !== -1) {
      items[idx] = {
        ...items[idx],
        ...body,
      } as BankSetting
      await writeJSON('bank-settings.json', items)
      return items[idx]!
    }
  }

  const newId = `BANK${String(items.length + 1).padStart(3, '0')}`
  const now = new Date()
  const createdOn = `${String(now.getDate()).padStart(2, '0')} ${now.toLocaleString('en-US', { month: 'short' })} ${now.getFullYear()}`

  const newRecord: BankSetting = {
    id: newId,
    bankName: body.bankName,
    accountName: body.accountName || 'PT. DULANK SEMESTA CIDA',
    accountNumber: body.accountNumber,
    branch: body.branch || '',
    ifscCode: body.ifscCode || '',
    status: body.status || 'active',
    createdOn,
  }

  items.unshift(newRecord)
  await writeJSON('bank-settings.json', items)
  return newRecord
}

export async function deleteBankSetting(id: string): Promise<{ id: string }> {
  const items = await readJSON<BankSetting[]>('bank-settings.json', [])
  const newItems = items.filter(i => i.id !== id)

  if (items.length === newItems.length) {
    throw createError({ statusCode: 404, statusMessage: 'Bank setting not found' })
  }

  await writeJSON('bank-settings.json', newItems)
  return { id }
}

// ----------------- Currency Settings -----------------

export async function getCurrencySettings(query?: { search?: string; status?: string }): Promise<CurrencySetting[]> {
  const items = await readJSON<CurrencySetting[]>('currency-settings.json', [])
  let filtered = items

  const search = (query?.search || '').toLowerCase().trim()
  const status = query?.status || ''

  if (search) {
    filtered = filtered.filter(item =>
      item.name.toLowerCase().includes(search) ||
      item.code.toLowerCase().includes(search)
    )
  }

  if (status && status !== 'all') {
    filtered = filtered.filter(item => item.status === status)
  }

  return filtered
}

export async function saveCurrencySetting(body: Partial<CurrencySetting> & { id?: string }): Promise<CurrencySetting> {
  if (!body.name || !body.code) {
    throw createError({ statusCode: 400, statusMessage: 'Name and Code are required' })
  }

  const items = await readJSON<CurrencySetting[]>('currency-settings.json', [])

  if (body.id) {
    const idx = items.findIndex(i => i.id === body.id)
    if (idx !== -1) {
      items[idx] = {
        ...items[idx],
        ...body,
        exchangeRate: typeof body.exchangeRate === 'number' ? body.exchangeRate : Number(body.exchangeRate) || 1,
      } as CurrencySetting
      await writeJSON('currency-settings.json', items)
      return items[idx]!
    }
  }

  const newId = `CURR${String(items.length + 1).padStart(3, '0')}`
  const now = new Date()
  const createdOn = `${String(now.getDate()).padStart(2, '0')} ${now.toLocaleString('en-US', { month: 'short' })} ${now.getFullYear()}`

  const newRecord: CurrencySetting = {
    id: newId,
    name: body.name,
    code: body.code.toUpperCase(),
    symbol: body.symbol || body.code,
    exchangeRate: typeof body.exchangeRate === 'number' ? body.exchangeRate : Number(body.exchangeRate) || 1,
    isDefault: !!body.isDefault,
    status: body.status || 'active',
    createdOn,
  }

  items.unshift(newRecord)
  await writeJSON('currency-settings.json', items)
  return newRecord
}

export async function deleteCurrencySetting(id: string): Promise<{ id: string }> {
  const items = await readJSON<CurrencySetting[]>('currency-settings.json', [])
  const newItems = items.filter(i => i.id !== id)

  if (items.length === newItems.length) {
    throw createError({ statusCode: 404, statusMessage: 'Currency setting not found' })
  }

  await writeJSON('currency-settings.json', newItems)
  return { id }
}

// ----------------- Printer Settings -----------------

export async function getPrinterSettings(query?: { search?: string; status?: string }): Promise<PrinterSetting[]> {
  const items = await readJSON<PrinterSetting[]>('printer-settings.json', [])
  let filtered = items

  const search = (query?.search || '').toLowerCase().trim()
  const status = query?.status || ''

  if (search) {
    filtered = filtered.filter(item =>
      item.printerName.toLowerCase().includes(search) ||
      Boolean(item.ipAddress && item.ipAddress.includes(search))
    )
  }

  if (status && status !== 'all') {
    filtered = filtered.filter(item => item.status === status)
  }

  return filtered
}

export async function savePrinterSetting(body: Partial<PrinterSetting> & { id?: string }): Promise<PrinterSetting> {
  if (!body.printerName) {
    throw createError({ statusCode: 400, statusMessage: 'Printer Name is required' })
  }

  const items = await readJSON<PrinterSetting[]>('printer-settings.json', [])

  if (body.id) {
    const idx = items.findIndex((i) => i.id === body.id)
    if (idx !== -1) {
      items[idx] = {
        ...items[idx],
        ...body,
        port: body.port ? Number(body.port) : 9100,
      } as PrinterSetting
      await writeJSON('printer-settings.json', items)
      return items[idx]!
    }
  }

  const newId = `PRN${String(items.length + 1).padStart(3, '0')}`
  const now = new Date()
  const createdOn = `${String(now.getDate()).padStart(2, '0')} ${now.toLocaleString('en-US', { month: 'short' })} ${now.getFullYear()}`

  const newRecord: PrinterSetting = {
    id: newId,
    printerName: body.printerName,
    connectionType: body.connectionType || 'Network',
    ipAddress: body.ipAddress || '',
    port: body.port ? Number(body.port) : 9100,
    status: body.status || 'active',
    createdOn,
  }

  items.unshift(newRecord)
  await writeJSON('printer-settings.json', items)
  return newRecord
}

export async function deletePrinterSetting(id: string): Promise<{ id: string }> {
  const items = await readJSON<PrinterSetting[]>('printer-settings.json', [])
  const newItems = items.filter(i => i.id !== id)

  if (items.length === newItems.length) {
    throw createError({ statusCode: 404, statusMessage: 'Printer setting not found' })
  }

  await writeJSON('printer-settings.json', newItems)
  return { id }
}

// ----------------- Company Setting -----------------

export async function getCompanySetting(): Promise<CompanySetting> {
  return await readJSON<CompanySetting>('company-setting.json', {
    id: 'COMP-DLK-001',
    companyName: 'PT. Dulank Semesta Cida',
    tagline: 'Pusat Solusi Percetakan Offset & Digital Printing Berkualitas Tinggi',
    email: 'kontak@dulanksemesta.com',
    phone: '+62 21 4256 7890',
    fax: '+62 21 4256 7891',
    website: 'https://dulanksemesta.com',
    npwp: '01.345.678.9-012.000',
    currency: 'IDR',
    address: 'Kawasan Percetakan Industri Modern, Blok D2 No. 14, Jl. Daan Mogot KM 19',
    country: 'Indonesia',
    province: 'DKI Jakarta',
    city: 'Jakarta Barat',
    postalCode: '11840',
    images: {
      logo: '/assets/img/logo-small.png',
      icon: '/assets/img/logo-small.png',
      favicon: '/assets/img/kacetak.jpeg',
      darkLogo: '/assets/img/logo-small.png',
    },
  })
}

export async function updateCompanySetting(body: CompanySettingUpdatePayload): Promise<CompanySetting> {
  if (!body) throw createError({ statusCode: 400, statusMessage: 'Data pengaturan perusahaan tidak boleh kosong' })
  if (!body.companyName?.trim()) throw createError({ statusCode: 400, statusMessage: 'Nama perusahaan wajib diisi' })

  const current = await getCompanySetting()
  const updated: CompanySetting = {
    ...current,
    companyName: body.companyName.trim(),
    tagline: body.tagline !== undefined ? body.tagline.trim() : current.tagline,
    email: body.email !== undefined ? body.email.trim() : current.email,
    phone: body.phone !== undefined ? body.phone.trim() : current.phone,
    fax: body.fax !== undefined ? body.fax.trim() : current.fax,
    website: body.website !== undefined ? body.website.trim() : current.website,
    npwp: body.npwp !== undefined ? body.npwp.trim() : current.npwp,
    currency: body.currency !== undefined ? body.currency.trim() : current.currency,
    address: body.address !== undefined ? body.address.trim() : current.address,
    country: body.country !== undefined ? body.country.trim() : current.country,
    province: body.province !== undefined ? body.province.trim() : current.province,
    city: body.city !== undefined ? body.city.trim() : current.city,
    postalCode: body.postalCode !== undefined ? body.postalCode.trim() : current.postalCode,
    images: {
      ...current.images,
      ...(body.images || {}),
    },
  }

  await writeJSON('company-setting.json', updated)
  return updated
}

// ----------------- POS Setting -----------------

export async function getPosSetting(): Promise<PosSetting> {
  return await readJSON<PosSetting>('pos-settings.json', {
    id: 'pos-setting-1',
    defaultCustomerId: 'ID000002',
    defaultCustomerName: 'Siti Aminah (General / Walk-in)',
    defaultWarehouseId: '1',
    defaultWarehouseName: 'Kacetak Pusat Karawang Barat',
    printerType: 'Thermal 80mm',
    autoPrintReceipt: true,
    enableSoundEffect: true,
    barcodeScannerMode: 'instant_add',
    allowedPaymentMethods: ['Cash', 'QRIS', 'Card / EDC', 'Bank Transfer'],
    receiptHeaderNotes: 'SELAMAT DATANG DI KACETAK POS',
    receiptFooterNotes: 'Barang yang sudah dibeli tidak dapat ditukar atau dikembalikan kecuali cacat produksi. Terima kasih atas kunjungan Anda!',
    showTaxOnReceipt: true,
    showCashierName: true,
    showCustomerDetails: true,
    updatedAt: '2026-10-08T08:00:00.000Z',
  })
}

export async function updatePosSetting(body: PosSetting): Promise<PosSetting> {
  if (!body) throw createError({ statusCode: 400, statusMessage: 'Payload POS configuration is required' })
  const updated: PosSetting = {
    ...body,
    updatedAt: new Date().toISOString(),
  }
  await writeJSON('pos-settings.json', updated)
  return updated
}

// ----------------- Storage Setting -----------------

export async function getStorageSetting(): Promise<StorageSetting> {
  return await readJSON<StorageSetting>('storage-settings.json', {
    local: {
      enabled: true,
    },
    aws: {
      enabled: true,
      accessKey: 'AKIAIOSFODNN7EXAMPLE',
      secretKey: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
      bucketName: 'kacetak-storage',
      region: 'ap-southeast-1',
      baseUrl: 'https://s3.ap-southeast-1.amazonaws.com/kacetak-storage',
    },
  })
}

export async function updateStorageSetting(body: StorageSetting): Promise<StorageSetting> {
  await writeJSON('storage-settings.json', body)
  return body
}

// ----------------- Appearance Setting -----------------

export async function getAppearanceSetting(): Promise<AppearanceSetting> {
  return await readJSON<AppearanceSetting>('appearance-settings.json', {
    theme: 'Light',
    accent: 'orange',
    expandSidebar: true,
    sidebarSize: 'Large - 250px',
    fontFamily: 'Nunito',
  })
}

export async function updateAppearanceSetting(body: AppearanceSetting): Promise<AppearanceSetting> {
  await writeJSON('appearance-settings.json', body)
  return body
}

// ----------------- Calendar Setting -----------------

export async function getCalendarConfig(): Promise<CalendarConfig> {
  return await readJSON<CalendarConfig>('calendar-settings.json')
}

export async function updateCalendarConfig(body: Partial<CalendarConfig>): Promise<CalendarConfig> {
  const current = await getCalendarConfig()
  const updated: CalendarConfig = {
    ...current,
    ...body,
    calendarLogs: current.calendarLogs,
  }

  const requiredArrays: Array<keyof CalendarConfig> = [
    'calendarProducts', 'sheetOptions', 'calendarSizes', 'papers', 'machines', 'printTypes',
    'laminates', 'hangers', 'components', 'profitTiers', 'calendarLogs',
  ]
  for (const key of requiredArrays) {
    if (!Array.isArray(updated[key])) {
      throw createError({ statusCode: 400, statusMessage: `${key} must be an array` })
    }
  }
  for (const tier of updated.profitTiers) {
    if (tier.minQty < 0 || tier.maxQty < tier.minQty || tier.profitPosPercent < 0 || tier.profitWebstorePercent < 0) {
      throw createError({ statusCode: 400, statusMessage: 'Invalid profit tier range or percentage' })
    }
  }
  const monetaryValues = [
    ...updated.papers.map(item => item.price),
    ...updated.machines.flatMap(item => [item.minimumPrice, item.druckPrice]),
    ...updated.laminates.map(item => item.price),
    ...updated.hangers.map(item => item.price),
    ...updated.components.map(item => item.price),
    ...updated.calendarLogs.flatMap(item => [item.productionCost, item.sellingPrice]),
  ]
  if (monetaryValues.some(value => !Number.isFinite(value) || value < 0)) {
    throw createError({ statusCode: 400, statusMessage: 'Monetary values must be non-negative numbers' })
  }

  await writeJSON('calendar-settings.json', updated)
  return updated
}

// ----------------- Email Settings -----------------

export function getEmailConfig(): EmailConfig {
  return readJSON<EmailConfig>('email-settings.json', {
    mailHost: 'smtp.gmail.com',
    mailPort: 587,
    mailUsername: 'admin@kacetak.com',
    mailPassword: '',
    mailEncryption: 'tls',
    fromEmail: 'noreply@kacetak.com',
    fromName: 'Kacetak POS & Printing System',
    mailEngine: 'smtp',
    status: true,
  })
}

export function saveEmailConfig(body: Partial<EmailConfig>): EmailConfig {
  const current = getEmailConfig()
  const updated: EmailConfig = {
    ...current,
    ...body,
    updatedAt: new Date().toISOString(),
  }
  writeJSON('email-settings.json', updated)
  return updated
}

export function testEmailConfig(targetEmail?: string): TestEmailResult {
  if (!targetEmail || !targetEmail.includes('@')) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Harap masukkan alamat email tujuan yang valid.',
    })
  }

  const currentConfig = getEmailConfig()
  return {
    success: true,
    simulated: true,
    message: `Simulasi konfigurasi email berhasil untuk ${targetEmail} via ${currentConfig?.mailHost || 'SMTP Server'} (Port ${currentConfig?.mailPort || 587}). Belum ada email yang dikirim.`,
    sentTo: targetEmail,
    timestamp: new Date().toISOString(),
  }
}

// ----------------- GDPR Settings -----------------

export function getGdprSetting(): GdprSetting {
  return readJSON<GdprSetting>('gdpr-settings.json', {
    consentText: 'We use cookies to improve your user experience and analyze website traffic.',
    position: 'Right',
    agreeText: 'Agree',
    declineText: 'Decline',
    showDecline: true,
    policyLink: 'https://kacetak.com/privacy-policy',
  })
}

export function saveGdprSetting(body: GdprSetting): GdprSetting {
  writeJSON('gdpr-settings.json', body)
  return body
}

// ----------------- Invoice Settings -----------------

export function getInvoiceSettings(): InvoiceSetting {
  const defaultSettings: InvoiceSetting = {
    id: 'inv-setting-1',
    logoUrl: '/assets/img/logo.png',
    companyName: 'PT. Dulank Semesta Cida',
    companyEmail: 'billing@dulanksemesta.com',
    companyPhone: '+62 21 4256 7890',
    companyAddress: 'Jl. Percetakan Negara No. 88, Jakarta Pusat, DKI Jakarta 10560',
    prefix: 'INV-',
    numberPadding: 4,
    nextNumber: 1042,
    dueDays: 7,
    roundOffEnabled: true,
    roundOffType: 'Round Off Up',
    showCompanyDetails: true,
    headerTerms: 'Terima kasih atas pesanan Anda di Percetakan Kacetak Dulank System.',
    footerTerms: 'Pembayaran wajib ditransfer ke rekening resmi sebelum tanggal jatuh tempo. Harap simpan bukti pembayaran ini sebagai bukti transaksi sah.',
    bankDetails: {
      bankName: 'Bank Central Asia (BCA)',
      accountNumber: '8830-1928-3341',
      accountHolder: 'PT DULANK SEMESTA CIDA',
    },
    taxPercentage: 11,
    updatedAt: new Date().toISOString(),
  }

  return readJSON<InvoiceSetting>('invoice-settings.json', defaultSettings)
}

export function saveInvoiceSettings(body: InvoiceSetting): InvoiceSetting {
  if (!body) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Payload invoice configuration is required',
    })
  }

  const updatedSetting: InvoiceSetting = {
    ...body,
    updatedAt: new Date().toISOString(),
  }

  writeJSON('invoice-settings.json', updatedSetting)
  return updatedSetting
}

// ----------------- OTP Settings -----------------

export function getOtpConfig(): OtpConfig {
  return readJSON<OtpConfig>('otp-settings.json', {
    isEnabled: true,
    provider: 'whatsapp',
    otpType: 'numeric',
    digitLimit: 6,
    expireMinutes: 5,
    resendDelaySeconds: 60,
  })
}

export function saveOtpConfig(body: Partial<OtpConfig>): OtpConfig {
  const current = getOtpConfig()
  const updated: OtpConfig = {
    ...current,
    ...body,
    updatedAt: new Date().toISOString(),
  }
  writeJSON('otp-settings.json', updated)
  return updated
}

// ----------------- Payment Gateways -----------------

export function getPaymentGateways(): PaymentGatewaysRecord {
  return readJSON<PaymentGatewaysRecord>('payment-gateways.json', {
    midtrans: { name: 'Midtrans SNAP', desc: 'Indonesian gateway', enabled: true, clientKey: '', secretKey: '', mode: 'sandbox' },
    xendit: { name: 'Xendit Payment', desc: 'Accept direct debit', enabled: true, clientKey: '', secretKey: '', mode: 'sandbox' },
    paypal: { name: 'PayPal', desc: 'Worldwide payment gateway', enabled: true, clientKey: '', secretKey: '', mode: 'production' },
    stripe: { name: 'Stripe', desc: 'APIs for credit cards', enabled: false, clientKey: '', secretKey: '', mode: 'sandbox' },
    braintree: { name: 'Braintree', desc: 'Enterprise card processing', enabled: false, clientKey: '', secretKey: '', mode: 'sandbox' },
    wise: { name: 'Wise', desc: 'Multi-currency payouts', enabled: false, clientKey: '', secretKey: '', mode: 'sandbox' },
  })
}

export function savePaymentGateways(body: PaymentGatewaysRecord): PaymentGatewaysRecord {
  writeJSON('payment-gateways.json', body)
  return body
}

// ----------------- Preferences -----------------

export function getPreferences(): PreferenceItem[] {
  return readJSON<PreferenceItem[]>('preference-settings.json', [])
}

export function savePreferences(body: PreferenceItem[]): PreferenceItem[] {
  writeJSON('preference-settings.json', body)
  return body
}

// ----------------- User Profile -----------------

export function getUserProfile(): UserProfile {
  return readJSON<UserProfile>('profile.json', {
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
    postalCode: '10560',
  })
}

export function saveUserProfile(body: Partial<UserProfile>): UserProfile {
  if (!body) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Data profil wajib diisi',
    })
  }

  const currentProfile = getUserProfile()
  const updatedProfile: UserProfile = {
    ...currentProfile,
    firstName: body.firstName?.trim() || currentProfile.firstName,
    lastName: body.lastName !== undefined ? body.lastName.trim() : currentProfile.lastName,
    userName: body.userName?.trim() || currentProfile.userName,
    phoneNumber: body.phoneNumber !== undefined ? body.phoneNumber.trim() : currentProfile.phoneNumber,
    email: body.email?.trim() || currentProfile.email,
    avatarUrl: body.avatarUrl !== undefined ? body.avatarUrl.trim() : currentProfile.avatarUrl,
    address: body.address !== undefined ? body.address.trim() : currentProfile.address,
    country: body.country?.trim() || currentProfile.country,
    province: body.province?.trim() || currentProfile.province,
    city: body.city?.trim() || currentProfile.city,
    postalCode: body.postalCode?.trim() || currentProfile.postalCode,
  }

  writeJSON('profile.json', updatedProfile)
  return updatedProfile
}

// ----------------- Localization Settings -----------------

export function getLocalizationSettings(): LocalizationConfig {
  return readJSON<LocalizationConfig>('localization-settings.json', {
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
    maxFileSize: 5000,
  })
}

export function saveLocalizationSettings(body: LocalizationConfig): LocalizationConfig {
  writeJSON('localization-settings.json', body)
  return body
}

// ----------------- Security Settings -----------------

export function getSecuritySettings(): SecuritySettings {
  return readJSON<SecuritySettings>('security-settings.json', {
    passwordLastChanged: '22 July 2023, 10:30 AM',
    twoFactor: true,
    googleAuth: true,
    phone: '+6281234567890',
    email: 'admin@dulank.com',
    devices: [],
    activities: [],
  })
}

export function saveSecuritySettings(body: Partial<SecuritySettings>): SecuritySettings {
  const current = getSecuritySettings()
  const merged: SecuritySettings = {
    ...current,
    ...body,
  }
  writeJSON('security-settings.json', merged)
  return merged
}

// ----------------- Social Auth Settings -----------------

export function getSocialAuthSettings(): SocialAuthConfig {
  return readJSON<SocialAuthConfig>('social-auth.json', {
    facebook: { enabled: false, clientId: '', clientSecret: '', redirectUrl: '' },
    twitter: { enabled: false, clientId: '', clientSecret: '', redirectUrl: '' },
    google: { enabled: false, clientId: '', clientSecret: '', redirectUrl: '' },
    linkedin: { enabled: false, clientId: '', clientSecret: '', redirectUrl: '' },
  })
}

export function saveSocialAuthSettings(body: Partial<SocialAuthConfig>): SocialAuthConfig {
  const current = getSocialAuthSettings()
  const merged: SocialAuthConfig = {
    ...current,
    ...body,
  }
  writeJSON('social-auth.json', merged)
  return merged
}

// ----------------- System Integrations -----------------

export function getSystemIntegrations(): SystemIntegrations {
  return readJSON<SystemIntegrations>('system-integrations.json', {
    captcha: { enabled: true, siteKey: '', secretKey: '' },
    analytics: { enabled: true, trackingId: '' },
    adsense: { enabled: false, code: '' },
    map: { enabled: true, mapId: '' },
  })
}

export function saveSystemIntegrations(body: Partial<SystemIntegrations>): SystemIntegrations {
  const current = getSystemIntegrations()
  const merged: SystemIntegrations = {
    ...current,
    ...body,
  }
  writeJSON('system-integrations.json', merged)
  return merged
}

// ----------------- SMS Gateways -----------------

export function getSmsGateways(): SmsGatewaysRecord {
  return readJSON<SmsGatewaysRecord>('sms-gateways.json', {
    nexmo: { name: 'Nexmo (Vonage)', desc: 'Global SMS & OTP API provider', enabled: true, apiKey: 'nx_live_89823472', apiSecret: '••••••••••••', senderId: 'KACETAK' },
    twoFactor: { name: '2Factor SMS', desc: 'High speed transactional SMS service', enabled: false, apiKey: '', apiSecret: '', senderId: 'KACETAK' },
    twilio: { name: 'Twilio SMS', desc: 'Enterprise communications platform', enabled: false, apiKey: '', apiSecret: '', senderId: '+1234567890' },
    zenziva: { name: 'Zenziva SMS / WhatsApp', desc: 'Indonesian local SMS & WA Gateway', enabled: true, apiKey: 'zen_live_091823', apiSecret: '••••••••••••', senderId: 'KACETAK' },
  })
}

export function saveSmsGateways(body: SmsGatewaysRecord): SmsGatewaysRecord {
  writeJSON('sms-gateways.json', body)
  return body
}

