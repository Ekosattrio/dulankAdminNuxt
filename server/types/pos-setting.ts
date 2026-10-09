export interface PosSetting {
  id?: string
  defaultCustomerId: string
  defaultCustomerName: string
  defaultWarehouseId: string
  defaultWarehouseName: string
  printerType: 'Thermal 80mm' | 'Thermal 58mm' | 'A4'
  autoPrintReceipt: boolean
  enableSoundEffect: boolean
  barcodeScannerMode: 'instant_add' | 'manual_add' | 'bulk_continuous'
  allowedPaymentMethods: string[]
  receiptHeaderNotes: string
  receiptFooterNotes: string
  showTaxOnReceipt: boolean
  showCashierName: boolean
  showCustomerDetails: boolean
  updatedAt?: string
}
