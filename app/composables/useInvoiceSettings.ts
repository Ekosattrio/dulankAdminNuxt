import type { InvoiceSetting } from '#server/types/invoice-setting'

interface InvoiceSettingsResponse {
  success: boolean
  data: InvoiceSetting
  message?: string
}

const defaultInvoiceSetting: InvoiceSetting = {
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
    accountHolder: 'PT DULANK SEMESTA CIDA'
  },
  taxPercentage: 11
}

export function useInvoiceSettings() {
  const { data, pending, error, refresh } = useApiFetch<InvoiceSettingsResponse>('/api/invoice-settings', {
    key: 'invoice-settings-data'
  })

  const settings = computed<InvoiceSetting>(() => {
    return data.value?.data ?? defaultInvoiceSetting
  })

  const saveSettings = async (payload: InvoiceSetting) => {
    const res = await apiFetch<InvoiceSettingsResponse>('/api/invoice-settings', {
      method: 'POST',
      body: payload
    })
    await refresh()
    return res
  }

  return {
    settings,
    pending,
    error,
    refresh,
    saveSettings
  }
}
