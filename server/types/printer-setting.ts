export interface PrinterSetting {
  id: string
  printerName: string
  connectionType: 'Network' | 'USB' | 'Bluetooth'
  ipAddress?: string
  port?: number
  status: 'active' | 'inactive'
  createdOn: string
}

export type PrinterSettingFormData = Omit<PrinterSetting, 'id' | 'createdOn'>

