import type { CompanySetting, CompanySettingUpdatePayload } from '#server/types/company-setting'

export default defineEventHandler(async (event) => {
  const body = await readBody<CompanySettingUpdatePayload>(event)

  if (!body) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Data pengaturan perusahaan tidak boleh kosong'
    })
  }

  if (!body.companyName?.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Nama perusahaan wajib diisi'
    })
  }

  const currentSettings = await readJSON<CompanySetting>('company-setting.json', {
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
      darkLogo: '/assets/img/logo-small.png'
    }
  })

  const updatedSettings: CompanySetting = {
    ...currentSettings,
    companyName: body.companyName.trim(),
    tagline: body.tagline !== undefined ? body.tagline.trim() : currentSettings.tagline,
    email: body.email !== undefined ? body.email.trim() : currentSettings.email,
    phone: body.phone !== undefined ? body.phone.trim() : currentSettings.phone,
    fax: body.fax !== undefined ? body.fax.trim() : currentSettings.fax,
    website: body.website !== undefined ? body.website.trim() : currentSettings.website,
    npwp: body.npwp !== undefined ? body.npwp.trim() : currentSettings.npwp,
    currency: body.currency !== undefined ? body.currency.trim() : currentSettings.currency,
    address: body.address !== undefined ? body.address.trim() : currentSettings.address,
    country: body.country !== undefined ? body.country.trim() : currentSettings.country,
    province: body.province !== undefined ? body.province.trim() : currentSettings.province,
    city: body.city !== undefined ? body.city.trim() : currentSettings.city,
    postalCode: body.postalCode !== undefined ? body.postalCode.trim() : currentSettings.postalCode,
    images: {
      ...currentSettings.images,
      ...(body.images || {})
    }
  }

  await writeJSON('company-setting.json', updatedSettings)

  return createResponse(updatedSettings, 'Pengaturan perusahaan berhasil disimpan')
})
