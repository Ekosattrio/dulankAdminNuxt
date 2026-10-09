import { defineEventHandler } from 'h3'
import { getCalculatorDashboardData } from '#server/utils/calculatorDashboardData'

export default defineEventHandler(async () => {
  const data = getCalculatorDashboardData()
  return {
    success: true,
    data
  }
})

