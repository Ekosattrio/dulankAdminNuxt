import type { ConfigurationColumn, ConfigurationField, SidebarTabItem } from '../types/configuration'

export const cetakFullColorTabs: SidebarTabItem[] = [
  { id: 'products', label: 'Product Custom Default', icon: 'box' },
  { id: 'sizes', label: 'Product Size', icon: 'maximize' },
  { id: 'papers', label: 'Paper Type', icon: 'file-text' },
  { id: 'machines', label: 'Machine Type', icon: 'printer' },
  { id: 'laminates', label: 'Laminate', icon: 'layers' },
  { id: 'folds', label: 'Fold', icon: 'layers' },
  { id: 'printSides', label: 'Print Side', icon: 'copy' },
  { id: 'components', label: 'Components', icon: 'grid' },
  { id: 'workflowSteps', label: 'Work Flow', icon: 'git-branch' },
  { id: 'profitSettings', label: 'Profit Setting', icon: 'percent' },
  { id: 'logTransactions', label: 'Log Transaction', icon: 'clipboard' },
]

const text = (key: string, label: string, required = true): ConfigurationField => ({ key, label, required })
const number = (key: string, label: string, min = 0): ConfigurationField => ({ key, label, type: 'number', required: true, min })
const visibility = (key = 'status'): ConfigurationField => ({ key, label: 'Status', type: 'select', required: true, options: ['Show', 'Hide'] })
const col = (key: string, label: string, align?: 'start' | 'center' | 'end'): ConfigurationColumn => ({ key, label, align })

export const cetakFullColorSizeColumns = [col('name', 'Size Name'), col('size', 'size'), col('status', 'Status')]
export const cetakFullColorSizeFields = [text('name', 'Size Name'), text('size', 'size'), visibility()]

export const cetakFullColorMachineColumns = [
  col('printingType', 'Printing Type'),
  col('printingName', 'Printing Name'),
  col('unitColor', 'Unit Color'),
  col('paperArea', 'Paper Area'),
  col('status', 'Status'),
]
export const cetakFullColorMachineFields = [
  text('printingType', 'Printing Type'),
  text('printingName', 'Printing Name'),
  text('unitColor', 'Unit Color'),
  text('paperArea', 'Paper Area'),
  visibility(),
]

export const cetakFullColorLaminateColumns = [col('name', 'Name'), col('status', 'Status')]
export const cetakFullColorLaminateFields = [text('name', 'Name'), visibility()]

export const cetakFullColorFoldColumns = [col('name', 'Fold Type'), col('status', 'Status')]
export const cetakFullColorFoldFields = [text('name', 'Fold Type'), visibility()]

export const cetakFullColorPrintSideColumns = [col('name', 'Print Side'), col('status', 'Status')]
export const cetakFullColorPrintSideFields = [text('name', 'Print Side'), visibility()]

export const cetakFullColorComponentColumns = [col('name', 'Component'), col('value', 'Value', 'end'), col('unit', 'Unit Value')]
export const cetakFullColorComponentFields = [text('name', 'Component'), number('value', 'Value'), text('unit', 'Unit Value')]

export const cetakFullColorWorkflowStepColumns = [col('step', 'No', 'end'), col('category', 'Flow Category'), col('name', 'Flow Name')]
export const cetakFullColorWorkflowStepFields = [number('step', 'No', 1), text('category', 'Flow Category'), text('name', 'Flow Name')]
