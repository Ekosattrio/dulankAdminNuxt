import type { PosSetting } from '#server/types/pos-setting'

interface PosSettingsResponse {
  success: boolean
  data: PosSetting
  message?: string
}

const defaultPosSetting: PosSetting = {
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
  showCustomerDetails: true
}

export function usePosSettings() {
  const { data, pending, error, refresh } = useApiFetch<PosSettingsResponse>('/api/pos-settings', {
    key: 'pos-settings-data'
  })

  const settings = computed<PosSetting>(() => {
    return data.value?.data ?? defaultPosSetting
  })

  const saveSettings = async (payload: PosSetting) => {
    const res = await apiFetch<PosSettingsResponse>('/api/pos-settings', {
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
