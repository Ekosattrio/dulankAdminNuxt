export interface BankSetting {
  id: string
  bankName: string
  accountName: string
  accountNumber: string
  branch: string
  ifscCode: string
  status: 'active' | 'inactive'
  createdOn: string
}

export type BankSettingFormData = Omit<BankSetting, 'id' | 'createdOn'>

