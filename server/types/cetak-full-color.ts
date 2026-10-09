import type { ProfitTier } from '~/composables/useProfitCalculation'

export interface ProductCustom {
  id: string
  name: string
  defaultSize: string
  paperTypes: string
  machine: string
  active: boolean
  image: string
  images?: string[]
}

export interface SizePreset {
  id: string
  name: string
  widthMm: number
  heightMm: number
  isStandard: boolean
}

export interface PaperTypePreset {
  id: string
  name: string
  plano: string
  pricePlano: number
}

export interface MachineTypePreset {
  id: string
  name: string
  maxArea: string
  plateCost: number
  runChargeMin: number
}

export interface LaminatePreset {
  id: string
  name: string
  costPerSide: number
}

export interface FoldPreset {
  id: string
  name: string
  costPer1000: number
}

export interface PrintSidePreset {
  id: string
  name: string
  plateMultiplier: number
  runMultiplier: number
}

export interface ComponentPreset {
  id: string
  name: string
  type: string
}

export interface WorkflowStepPreset {
  step: number
  name: string
  department: string
}

export interface CalculationLogTransaction {
  id: string
  customerId?: string | null
  date: string
  customer: string
  product: string
  qty: number
  totalCost: number
  sellingPrice: number
  status: string
}

export interface CetakFullColorConfig {
  products: ProductCustom[]
  sizes: SizePreset[]
  papers: PaperTypePreset[]
  machines: MachineTypePreset[]
  laminates: LaminatePreset[]
  folds: FoldPreset[]
  printSides: PrintSidePreset[]
  components: ComponentPreset[]
  workflowSteps: WorkflowStepPreset[]
  profitTiers: ProfitTier[]
  logTransactions: CalculationLogTransaction[]
}

