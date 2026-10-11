export type VisibilityStatus = 'Show' | 'Hide'

export interface ProductCustom {
  id: string
  name: string
  defaultSize: string
  paperTypes: string
  laminates?: string | null
  printSides: string
  folds?: string | null
  description: string
  displayPos: boolean
  displayWebsite: boolean
  active: boolean
  image: string
  images?: string[]
  createdAt: string
  updatedAt: string
}

export interface SizePreset {
  id: string
  name: string
  size: string
  status: VisibilityStatus
}

export interface PaperGramature {
  id: string
  label: string
  enabled: boolean
}

export interface PaperGroupPreset {
  id: string
  name: string
  gramatures: PaperGramature[]
}

export interface MachineTypePreset {
  id: string
  printingType: string
  printingName: string
  unitColor: string
  paperArea: string
  status: VisibilityStatus
}

export interface NamedVisibilityPreset {
  id: string
  name: string
  status: VisibilityStatus
}

export type LaminatePreset = NamedVisibilityPreset
export type FoldPreset = NamedVisibilityPreset
export type PrintSidePreset = NamedVisibilityPreset

export interface ComponentPreset {
  id: string
  name: string
  value: number
  unit: string
}

export interface WorkflowStepPreset {
  id: string
  step: number
  category: string
  name: string
}

export interface CetakFullColorWorkflow {
  id: string
  category: string
  name: string
  assignee: string
  incentiveAmount: number
  incentiveUnit: string
  targets: string[]
}

export interface ProfitRange {
  id: string
  from: number | null
  to: number | null
  posPercent: number | null
  webstorePercent: number | null
}

export interface AdditionalFee {
  id: string
  name: string
  amount: number | null
  unit: string
}

export interface TaxCharge {
  id: string
  name: string
  percent: number | null
}

export interface CetakFullColorProfitSettings {
  updatedLabel: string
  mode: 'production-cost' | 'production-cost-range'
  productionCostPosPercent: number | null
  productionCostWebstorePercent: number | null
  ranges: ProfitRange[]
  additionalFees: AdditionalFee[]
  taxes: TaxCharge[]
}

export interface CalculationLogTransaction {
  id: string
  noSales: string
  customerId?: string | null
  customer: string
  date: string
  channel: 'POS' | 'Webstore'
  productName: string
  price: number
}

export interface CetakFullColorConfig {
  schemaVersion: 2
  products: ProductCustom[]
  sizes: SizePreset[]
  customSizeEnabled: boolean
  paperGroups: PaperGroupPreset[]
  machines: MachineTypePreset[]
  laminates: LaminatePreset[]
  folds: FoldPreset[]
  printSides: PrintSidePreset[]
  components: ComponentPreset[]
  workflowSteps: WorkflowStepPreset[]
  paperWorkflows: CetakFullColorWorkflow[]
  machineWorkflows: CetakFullColorWorkflow[]
  laminateWorkflows: CetakFullColorWorkflow[]
  foldWorkflows: CetakFullColorWorkflow[]
  printSideWorkflows: CetakFullColorWorkflow[]
  componentWorkflows: CetakFullColorWorkflow[]
  profitSettings: CetakFullColorProfitSettings
  logTransactions: CalculationLogTransaction[]
}
