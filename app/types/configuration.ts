export interface ConfigurationField {
  key: string
  label: string
  type?: 'text' | 'number' | 'currency' | 'boolean' | 'select'
  required?: boolean
  min?: number
  options?: string[]
}

export interface ConfigurationColumn {
  key: string
  label: string
  align?: 'start' | 'center' | 'end'
  sortable?: boolean
}

export interface SidebarTabItem {
  id: string
  label: string
  icon: string
}
