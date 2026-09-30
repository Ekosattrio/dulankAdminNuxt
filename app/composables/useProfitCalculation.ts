/**
 * Composable for Offset & Digital Printing calculation formulas and profit margin settings
 */

// Tipe dipisah ke shared/types/printing.ts (auto-import di app & server).
// Re-export untuk kompatibilitas dengan halaman yang mengimpor tipe dari composable ini.
export type { ProfitTier, PaperSpec, MachineSpec } from '../../shared/types/printing'

export const useProfitCalculation = () => {
  // Default tiered profit settings
  const defaultProfitTiers = ref<ProfitTier[]>([
    { id: '1', minQty: 1, maxQty: 500, profitPosPercent: 40, profitWebstorePercent: 35 },
    { id: '2', minQty: 501, maxQty: 1000, profitPosPercent: 35, profitWebstorePercent: 30 },
    { id: '3', minQty: 1001, maxQty: 2500, profitPosPercent: 30, profitWebstorePercent: 25 },
    { id: '4', minQty: 2501, maxQty: 5000, profitPosPercent: 25, profitWebstorePercent: 20 },
    { id: '5', minQty: 5001, maxQty: 100000, profitPosPercent: 20, profitWebstorePercent: 18 }
  ])

  /**
   * Calculate how many finished items fit on a machine-cut paper sheet (imposition)
   */
  const calculateItemsPerSheet = (
    sheetWidth: number,
    sheetHeight: number,
    itemWidth: number,
    itemHeight: number
  ): number => {
    if (!sheetWidth || !sheetHeight || !itemWidth || !itemHeight) return 1

    // Normal orientation
    const fitA = Math.floor(sheetWidth / itemWidth) * Math.floor(sheetHeight / itemHeight)
    // Rotated 90 deg orientation
    const fitB = Math.floor(sheetWidth / itemHeight) * Math.floor(sheetHeight / itemWidth)

    return Math.max(1, Math.max(fitA, fitB))
  }

  /**
   * Get applicable profit percentage based on quantity and channel
   */
  const getProfitMargin = (qty: number, channel: 'pos' | 'webstore' = 'pos', tiers = defaultProfitTiers.value): number => {
    const tier = tiers.find(t => qty >= t.minQty && qty <= t.maxQty)
    if (!tier) return 25
    return channel === 'pos' ? tier.profitPosPercent : tier.profitWebstorePercent
  }

  /**
   * Estimate total production cost
   */
  const calculateProductionCost = (params: {
    qty: number
    paperCostPerItem: number
    plateCost: number
    printRunCost: number
    laminateCostPerItem: number
    foldCostPerItem: number
    finishingCost: number
  }) => {
    const totalPaperCost = params.qty * params.paperCostPerItem
    const totalLaminateCost = params.qty * params.laminateCostPerItem
    const totalFoldCost = params.qty * params.foldCostPerItem
    const totalCostOfGoods =
      totalPaperCost +
      params.plateCost +
      params.printRunCost +
      totalLaminateCost +
      totalFoldCost +
      params.finishingCost

    const costPerPiece = params.qty > 0 ? Math.round(totalCostOfGoods / params.qty) : 0

    return {
      totalCostOfGoods,
      costPerPiece,
      totalPaperCost,
      totalLaminateCost,
      totalFoldCost
    }
  }

  /**
   * Calculate final selling price including profit margin
   */
  const calculateSellingPrice = (
    costOfGoods: number,
    profitPercent: number
  ) => {
    const profitAmount = Math.round((costOfGoods * profitPercent) / 100)
    const sellingPrice = costOfGoods + profitAmount
    return {
      profitAmount,
      sellingPrice
    }
  }

  return {
    defaultProfitTiers,
    calculateItemsPerSheet,
    getProfitMargin,
    calculateProductionCost,
    calculateSellingPrice
  }
}