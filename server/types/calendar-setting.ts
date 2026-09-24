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
}

export interface CalendarSize {
  id: string
  name: string
  widthMm: number
  heightMm: number
  type: string
}

export interface CalendarFinishing {
  id: string
  name: string
  costPerUnit: number
}

export interface CalendarBoard {
  id: string
  name: string
  price: number
}

export interface CalendarLog {
  id: string
  date: string
  client: string
  desc: string
  qty: number
  price: number
}

export interface CalendarConfig {
  calendarProducts: CalendarProduct[]
  calendarSizes: CalendarSize[]
  finishings: CalendarFinishing[]
  boards: CalendarBoard[]
  profitTiers: ProfitTier[]
  calendarLogs: CalendarLog[]
}

