import type { ConfigurationColumn, ConfigurationField } from '~/types/configuration'
import type { SidebarTabItem } from '~/components/pages/products-services/SettingSidebarNav.vue'

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
  { id: 'profitTiers', label: 'Profit Setting', icon: 'percent' },
  { id: 'logTransactions', label: 'Log Transaction', icon: 'clipboard' },
]

const text = (key: string, label: string, required = true): ConfigurationField => ({ key, label, required })
const number = (key: string, label: string, min = 0): ConfigurationField => ({ key, label, type: 'number', required: true, min })
const money = (key: string, label: string): ConfigurationField => ({ key, label, type: 'currency', required: true, min: 0 })
const col = (key: string, label: string, align?: 'start' | 'center' | 'end'): ConfigurationColumn => ({ key, label, align })

export const cetakFullColorSizeColumns = [col('name', 'Size Name'), col('widthMm', 'Width (mm)', 'end'), col('heightMm', 'Height (mm)', 'end'), col('isStandard', 'Standard', 'center')]
export const cetakFullColorSizeFields = [text('name', 'Size Name'), number('widthMm', 'Width (mm)', 1), number('heightMm', 'Height (mm)', 1), { key: 'isStandard', label: 'Standard Size', type: 'boolean' as const }]

export const cetakFullColorMachineColumns = [col('name', 'Machine Name'), col('maxArea', 'Max Print Area'), col('plateCost', 'Plate Cost', 'end'), col('runChargeMin', 'Minimum Run Charge', 'end')]
export const cetakFullColorMachineFields = [text('name', 'Machine Name'), text('maxArea', 'Max Print Area'), money('plateCost', 'Plate Cost'), money('runChargeMin', 'Minimum Run Charge')]

export const cetakFullColorLaminateColumns = [col('name', 'Laminate Type'), col('costPerSide', 'Cost / Side', 'end')]
export const cetakFullColorLaminateFields = [text('name', 'Laminate Type'), money('costPerSide', 'Cost / Side')]

export const cetakFullColorFoldColumns = [col('name', 'Fold Type'), col('costPer1000', 'Cost / 1000', 'end')]
export const cetakFullColorFoldFields = [text('name', 'Fold Type'), money('costPer1000', 'Cost / 1000')]

export const cetakFullColorPrintSideColumns = [col('name', 'Print Side'), col('plateMultiplier', 'Plate Multiplier', 'end'), col('runMultiplier', 'Run Multiplier', 'end')]
export const cetakFullColorPrintSideFields = [text('name', 'Print Side'), number('plateMultiplier', 'Plate Multiplier'), number('runMultiplier', 'Run Multiplier')]

export const cetakFullColorComponentColumns = [col('name', 'Component Name'), col('type', 'Type')]
export const cetakFullColorComponentFields = [text('name', 'Component Name'), text('type', 'Type')]

export const cetakFullColorWorkflowStepColumns = [col('step', 'Step', 'end'), col('name', 'Flow Name'), col('department', 'Department')]
export const cetakFullColorWorkflowStepFields = [number('step', 'Step', 1), text('name', 'Flow Name'), text('department', 'Department')]

