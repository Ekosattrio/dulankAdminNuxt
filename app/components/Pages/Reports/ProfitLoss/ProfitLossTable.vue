<script setup lang="ts">
defineProps<{
  revenueCore: number
  revenueNonCore: number
  totalGrossRevenue: number
  cogsRawMaterial: number
  cogsLabor: number
  cogsMaintenance: number
  totalCogs: number
  cogsPercentage: string
  grossProfit: number
  grossProfitMargin: string
  opexSalaries: number
  opexRent: number
  opexMarketing: number
  opexShipping: number
  opexSupplies: number
  totalOpex: number
  opexPercentage: string
  ebt: number
  ebtPercentage: string
  taxExpense: number
  netProfit: number
  netProfitMargin: string
  formatNumber: (num: number) => string
}>()
</script>

<template>
  <div class="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
    <div class="overflow-x-auto">
      <table class="w-full text-start text-xs sm:text-sm">
        <!-- Table Header -->
        <thead class="border-b border-gray-200 bg-gray-50/75 dark:border-gray-800 dark:bg-gray-800/60 font-semibold text-gray-700 dark:text-gray-300">
          <tr>
            <th class="px-5 py-3 text-start font-medium">Description</th>
            <th class="px-5 py-3 text-start sm:text-end font-medium">Value (IDR)</th>
            <th class="px-5 py-3 text-end font-medium">Percentage (%)</th>
          </tr>
        </thead>

        <!-- Table Body -->
        <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
          <!-- SECTION 1: REVENUE -->
          <tr class="bg-white dark:bg-gray-900">
            <td colspan="3" class="px-5 pt-4 pb-2 text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white">
              REVENUE
            </td>
          </tr>

          <tr class="hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
            <td class="px-5 py-2.5 text-gray-600 dark:text-gray-300">
              Core Product Sales (Digital Print, Banners, etc.)
            </td>
            <td class="px-5 py-2.5 text-start sm:text-end font-mono text-gray-900 dark:text-white">
              {{ formatNumber(revenueCore) }}
            </td>
            <td class="px-5 py-2.5 text-end"></td>
          </tr>

          <tr class="hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
            <td class="px-5 py-2.5 text-gray-600 dark:text-gray-300">
              Non-Core Income (Waste Sales, Layout Services, etc.)
            </td>
            <td class="px-5 py-2.5 text-start sm:text-end font-mono text-gray-900 dark:text-white">
              {{ formatNumber(revenueNonCore) }}
            </td>
            <td class="px-5 py-2.5 text-end"></td>
          </tr>

          <!-- Subtotal: Total Gross Revenue -->
          <tr class="bg-gray-50/80 font-bold text-gray-900 dark:bg-gray-800/60 dark:text-white">
            <td class="px-5 py-3">Total Gross Revenue</td>
            <td class="px-5 py-3 text-start sm:text-end font-mono">
              {{ formatNumber(totalGrossRevenue) }}
            </td>
            <td class="px-5 py-3 text-end font-mono">100%</td>
          </tr>

          <!-- Blank Spacer -->
          <tr class="h-4 border-0 bg-white dark:bg-gray-900">
            <td colspan="3" class="py-1 border-0"></td>
          </tr>

          <!-- SECTION 2: COST OF GOODS SOLD (COGS) -->
          <tr class="hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
            <td class="px-5 py-2.5 text-gray-600 dark:text-gray-300">
              Raw Material Purchases (Paper, Ink, Plates)
            </td>
            <td class="px-5 py-2.5 text-start sm:text-end font-mono text-gray-900 dark:text-white">
              - {{ formatNumber(cogsRawMaterial) }}
            </td>
            <td class="px-5 py-2.5 text-end"></td>
          </tr>

          <tr class="hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
            <td class="px-5 py-2.5 text-gray-600 dark:text-gray-300">
              Direct Labor Costs (Machine Operators)
            </td>
            <td class="px-5 py-2.5 text-start sm:text-end font-mono text-gray-900 dark:text-white">
              - {{ formatNumber(cogsLabor) }}
            </td>
            <td class="px-5 py-2.5 text-end"></td>
          </tr>

          <tr class="hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
            <td class="px-5 py-2.5 text-gray-600 dark:text-gray-300">
              Electricity & Machine Maintenance
            </td>
            <td class="px-5 py-2.5 text-start sm:text-end font-mono text-gray-900 dark:text-white">
              - {{ formatNumber(cogsMaintenance) }}
            </td>
            <td class="px-5 py-2.5 text-end"></td>
          </tr>

          <!-- Subtotal: Total COGS -->
          <tr class="bg-gray-50/80 font-bold text-gray-900 dark:bg-gray-800/60 dark:text-white">
            <td class="px-5 py-3">Total COGS</td>
            <td class="px-5 py-3 text-start sm:text-end font-mono">
              - {{ formatNumber(totalCogs) }}
            </td>
            <td class="px-5 py-3 text-end font-mono">
              {{ cogsPercentage }}
            </td>
          </tr>

          <!-- Blank Spacer -->
          <tr class="h-4 border-0 bg-white dark:bg-gray-900">
            <td colspan="3" class="py-1 border-0"></td>
          </tr>

          <!-- SECTION 3: GROSS PROFIT -->
          <tr class="bg-gray-50/80 font-bold text-gray-900 dark:bg-gray-800/60 dark:text-white">
            <td class="px-5 py-3 uppercase">GROSS PROFIT</td>
            <td class="px-5 py-3 text-start sm:text-end font-mono">
              {{ formatNumber(grossProfit) }}
            </td>
            <td class="px-5 py-3 text-end font-mono">
              {{ grossProfitMargin }}
            </td>
          </tr>

          <!-- Blank Spacer -->
          <tr class="h-4 border-0 bg-white dark:bg-gray-900">
            <td colspan="3" class="py-1 border-0"></td>
          </tr>

          <!-- SECTION 4: OPERATING EXPENSES (OPEX) -->
          <tr class="bg-white dark:bg-gray-900">
            <td colspan="3" class="px-5 pt-4 pb-2 text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white">
              OPERATING EXPENSES
            </td>
          </tr>

          <tr class="hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
            <td class="px-5 py-2.5 text-gray-600 dark:text-gray-300">
              Staff & Office Salaries
            </td>
            <td class="px-5 py-2.5 text-start sm:text-end font-mono text-gray-900 dark:text-white">
              - {{ formatNumber(opexSalaries) }}
            </td>
            <td class="px-5 py-2.5 text-end"></td>
          </tr>

          <tr class="hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
            <td class="px-5 py-2.5 text-gray-600 dark:text-gray-300">
              Workshop & Office Rent
            </td>
            <td class="px-5 py-2.5 text-start sm:text-end font-mono text-gray-900 dark:text-white">
              - {{ formatNumber(opexRent) }}
            </td>
            <td class="px-5 py-2.5 text-end"></td>
          </tr>

          <tr class="hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
            <td class="px-5 py-2.5 text-gray-600 dark:text-gray-300">
              Sales, Marketing & Promo
            </td>
            <td class="px-5 py-2.5 text-start sm:text-end font-mono text-gray-900 dark:text-white">
              - {{ formatNumber(opexMarketing) }}
            </td>
            <td class="px-5 py-2.5 text-end"></td>
          </tr>

          <tr class="hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
            <td class="px-5 py-2.5 text-gray-600 dark:text-gray-300">
              Shipping & Delivery
            </td>
            <td class="px-5 py-2.5 text-start sm:text-end font-mono text-gray-900 dark:text-white">
              - {{ formatNumber(opexShipping) }}
            </td>
            <td class="px-5 py-2.5 text-end"></td>
          </tr>

          <tr class="hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
            <td class="px-5 py-2.5 text-gray-600 dark:text-gray-300">
              Stationery & Workshop Supplies
            </td>
            <td class="px-5 py-2.5 text-start sm:text-end font-mono text-gray-900 dark:text-white">
              - {{ formatNumber(opexSupplies) }}
            </td>
            <td class="px-5 py-2.5 text-end"></td>
          </tr>

          <!-- Subtotal: Total OPEX -->
          <tr class="bg-gray-50/80 font-bold text-gray-900 dark:bg-gray-800/60 dark:text-white">
            <td class="px-5 py-3">Total Operating Expenses</td>
            <td class="px-5 py-3 text-start sm:text-end font-mono">
              - {{ formatNumber(totalOpex) }}
            </td>
            <td class="px-5 py-3 text-end font-mono">
              {{ opexPercentage }}
            </td>
          </tr>

          <!-- Blank Spacer -->
          <tr class="h-4 border-0 bg-white dark:bg-gray-900">
            <td colspan="3" class="py-1 border-0"></td>
          </tr>

          <!-- SECTION 5: EBT -->
          <tr class="bg-gray-50/80 font-bold text-gray-900 dark:bg-gray-800/60 dark:text-white">
            <td class="px-5 py-3 uppercase">EARNINGS BEFORE TAX (EBT)</td>
            <td class="px-5 py-3 text-start sm:text-end font-mono">
              {{ formatNumber(ebt) }}
            </td>
            <td class="px-5 py-3 text-end font-mono">
              {{ ebtPercentage }}
            </td>
          </tr>

          <!-- SECTION 6: TAX -->
          <tr class="hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
            <td class="px-5 py-2.5 text-gray-600 dark:text-gray-300">
              Income Tax (PPH Final 0.5% UMKM)
            </td>
            <td class="px-5 py-2.5 text-start sm:text-end font-mono text-gray-900 dark:text-white">
              - {{ formatNumber(taxExpense) }}
            </td>
            <td class="px-5 py-2.5 text-end font-mono text-gray-500">
              0,50%
            </td>
          </tr>

          <!-- SECTION 7: NET PROFIT -->
          <tr class="bg-emerald-50/80 font-black text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300 text-sm sm:text-base border-t-2 border-emerald-500">
            <td class="px-5 py-3.5 uppercase">NET PROFIT (LABA BERSIH)</td>
            <td class="px-5 py-3.5 text-start sm:text-end font-mono">
              {{ formatNumber(netProfit) }}
            </td>
            <td class="px-5 py-3.5 text-end font-mono">
              {{ netProfitMargin }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

