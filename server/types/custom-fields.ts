export interface CustomField {
  id: number
  module: string
  label: string
  type: string
  defaultValue: string
  required: boolean
  disabled: boolean
  status: 'Active' | 'Inactive'
}

export type CustomFieldInput = Omit<CustomField, 'id'>

export interface CustomFieldResponse {
  success: boolean
  data: CustomField[]
  message?: string
}

