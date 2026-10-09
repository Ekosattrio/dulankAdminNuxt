import type { ProfitTier } from '~/composables/useProfitCalculation'

export interface CalendarProduct {
  id: string
  name: string
  defaultSize: string
  sheets: string
  paper: string
  binding: string
  active: boolean
  image: string
  images?: string[]
}
export interface CalendarSheetOption { id: string; name: string; sheets: number; description: string; active: boolean }
export interface CalendarSize { id: string; name: string; widthMm: number; heightMm: number; type: string }
export interface CalendarPaper { id: string; name: string; grammage: number; plano: string; price: number }
export interface CalendarMachine { id: string; name: string; maxArea: string; minimumPrice: number; druckPrice: number }
export interface CalendarPrintType { id: string; name: string; sides: number; plateMultiplier: number; runMultiplier: number }
export interface CalendarLaminate { id: string; name: string; price: number }
export interface CalendarHanger { id: string; name: string; size: string; price: number }
export interface CalendarComponent { id: string; name: string; type: string; price: number }
export interface CalendarLog { id: string; date: string; customerId?: string | null; client: string; desc: string; qty: number; productionCost: number; sellingPrice: number; status: string }

export interface CalendarConfig {
  calendarProducts: CalendarProduct[]
  sheetOptions: CalendarSheetOption[]
  calendarSizes: CalendarSize[]
  papers: CalendarPaper[]
  machines: CalendarMachine[]
  printTypes: CalendarPrintType[]
  laminates: CalendarLaminate[]
  hangers: CalendarHanger[]
  components: CalendarComponent[]
  profitTiers: ProfitTier[]
  calendarLogs: CalendarLog[]
}
