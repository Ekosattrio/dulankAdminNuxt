export interface ConfigurationField {
  key: string
  label: string
  type?: 'text' | 'number' | 'currency' | 'boolean'
  required?: boolean
  min?: number
}

export interface ConfigurationColumn {
  key: string
  label: string
  align?: 'start' | 'center' | 'end'
  sortable?: boolean
}
