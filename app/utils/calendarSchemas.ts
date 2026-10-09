import type { ConfigurationColumn, ConfigurationField, SidebarTabItem } from '../types/configuration'

export const calendarTabs: SidebarTabItem[] = [
  { id: 'calendarProducts', label: 'Calender Type', icon: 'box' },
  { id: 'sheetOptions', label: 'Number of Sheet', icon: 'maximize' },
  { id: 'calendarSizes', label: 'Product Size', icon: 'file-text' },
  { id: 'papers', label: 'Paper Type', icon: 'printer' },
  { id: 'machines', label: 'Machine Type', icon: 'layers' },
  { id: 'printTypes', label: 'Print Type', icon: 'layers' },
  { id: 'laminates', label: 'Laminate', icon: 'copy' },
  { id: 'hangers', label: 'Hanger', icon: 'grid' },
  { id: 'components', label: 'Component', icon: 'git-branch' },
  { id: 'profitTiers', label: 'Profit Setting', icon: 'percent' },
  { id: 'calendarLogs', label: 'Log Transaction', icon: 'clipboard' },
]

const text = (key: string, label: string, required = true): ConfigurationField => ({ key, label, required })
const number = (key: string, label: string, min = 0): ConfigurationField => ({ key, label, type: 'number', required: true, min })
const money = (key: string, label: string): ConfigurationField => ({ key, label, type: 'currency', required: true, min: 0 })
const col = (key: string, label: string, align?: 'start' | 'center' | 'end'): ConfigurationColumn => ({ key, label, align })

export const calendarSizeColumns = [col('name', 'Size Name'), col('widthMm', 'Width (mm)', 'end'), col('heightMm', 'Height (mm)', 'end'), col('type', 'Type')]
export const calendarSizeFields = [text('name', 'Size Name'), number('widthMm', 'Width (mm)', 1), number('heightMm', 'Height (mm)', 1), text('type', 'Type')]

export const calendarMachineColumns = [col('name', 'Machine Name'), col('maxArea', 'Max Print Area'), col('minimumPrice', 'Minimum Price', 'end'), col('druckPrice', 'Druck Price', 'end')]
export const calendarMachineFields = [text('name', 'Machine Name'), text('maxArea', 'Max Print Area'), money('minimumPrice', 'Minimum Price'), money('druckPrice', 'Druck Price')]

export const calendarPrintTypeColumns = [col('name', 'Print Type'), col('sides', 'Sides', 'end'), col('plateMultiplier', 'Plate Multiplier', 'end'), col('runMultiplier', 'Run Multiplier', 'end')]
export const calendarPrintTypeFields = [text('name', 'Print Type'), number('sides', 'Sides', 1), number('plateMultiplier', 'Plate Multiplier'), number('runMultiplier', 'Run Multiplier')]

export const calendarLaminateColumns = [col('name', 'Laminate'), col('price', 'Cost / Unit', 'end')]
export const calendarLaminateFields = [text('name', 'Laminate'), money('price', 'Cost / Unit')]

export const calendarHangerColumns = [col('name', 'Hanger / Binding'), col('size', 'Size'), col('price', 'Price', 'end')]
export const calendarHangerFields = [text('name', 'Hanger / Binding'), text('size', 'Size'), money('price', 'Price')]

export const calendarComponentColumns = [col('name', 'Component Name'), col('type', 'Type'), col('price', 'Price', 'end')]
export const calendarComponentFields = [text('name', 'Component Name'), text('type', 'Type'), money('price', 'Price')]

export const machineWorkflowItems = [
  { id: 'm-wf-1', category: 'Cetak', name: 'Setting Pelat & Tinta Mesin', assignee: 'Yanto', incentive: '10.000 per Job', targets: ['Offset SM52', 'SM74'] },
  { id: 'm-wf-2', category: 'Cetak', name: 'Jalankan Cetak Offset', assignee: 'Bambang', incentive: '15.000 per Job', targets: ['Semua Mesin'] },
]

export const hangerWorkflowItems = [
  { id: 'h-wf-1', category: 'Finishing', name: 'Pemasangan Spiral / Klemseng', assignee: 'Rudi', incentive: '5.000 per 100 Pcs', targets: ['Spiral Kawat', 'Klemseng'] },
]

