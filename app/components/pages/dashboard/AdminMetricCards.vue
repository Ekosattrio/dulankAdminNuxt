<script setup lang="ts">
import FeatherIcon from '~/components/common/FeatherIcon.vue'

interface PrimaryMetric {
  title: string
  amount: string
  change: string
  icon: string
  bgColor: string
  textColor: string
}

interface SecondaryMetric {
  title: string
  amount: string
  change: string
  changeType: 'increase' | 'decrease'
  link: string
  icon: string
}

withDefaults(
  defineProps<{
    primaryMetrics?: PrimaryMetric[]
    secondaryMetrics?: SecondaryMetric[]
  }>(),
  {
    primaryMetrics: () => [
      {
        title: 'Total Sales',
        amount: 'Rp48.988.078',
        change: '+2.2%',
        icon: 'trending-up',
        bgColor: 'bg-[#ffb56b]',
        textColor: 'text-white'
      },
      {
        title: 'Total Sales Return',
        amount: 'Rp16.478.145',
        change: '-2.2%',
        icon: 'rotate-ccw',
        bgColor: 'bg-[#052938]',
        textColor: 'text-white'
      },
      {
        title: 'Total Purchase',
        amount: 'Rp24.145.789',
        change: '+3.2%',
        icon: 'shopping-bag',
        bgColor: 'bg-[#18b39b]',
        textColor: 'text-white'
      },
      {
        title: 'Total Purchase Return',
        amount: 'Rp18.458.747',
        change: '+1.2%',
        icon: 'file-minus',
        bgColor: 'bg-[#2f7ff5]',
        textColor: 'text-white'
      }
    ],
    secondaryMetrics: () => [
      {
        title: 'Profit',
        amount: 'Rp8.458.798',
        change: '+35%',
        changeType: 'increase',
        link: '/profit-and-loss',
        icon: 'layers'
      },
      {
        title: 'Invoice Due',
        amount: 'Rp48.988.78',
        change: '+35%',
        changeType: 'increase',
        link: '/invoice-report',
        icon: 'pie-chart'
      },
      {
        title: 'Total Expenses',
        amount: 'Rp8.980.097',
        change: '+41%',
        changeType: 'increase',
        link: '/expenses',
        icon: 'activity'
      },
      {
        title: 'Total Payment Returns',
        amount: 'Rp78.458.798',
        change: '-20%',
        changeType: 'decrease',
        link: '/sales-report',
        icon: 'hash'
      }
    ]
  }
)
</script>

<template>
  <div class="space-y-5">
    <!-- Top Primary Metric Cards (4 cards) -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <div
        v-for="(metric, idx) in primaryMetrics"
        :key="idx"
        :class="['rounded-xl p-4 shadow-sm transition-transform hover:-translate-y-0.5', metric.bgColor, metric.textColor]"
      >
        <div class="flex items-center gap-3">
          <div class="flex h-11 w-11 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
            <FeatherIcon :name="metric.icon" size="22" class="text-white" />
          </div>
          <div class="min-w-0">
            <span class="block text-xs font-medium text-white/80">{{ metric.title }}</span>
            <h5 class="text-lg font-bold leading-tight tracking-tight text-white">{{ metric.amount }}</h5>
            <span class="text-xs text-white/70">{{ metric.change }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Secondary Metric Cards (Profit, Invoice Due, Expenses, Returns) -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <div
        v-for="(card, idx) in secondaryMetrics"
        :key="idx"
        class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >
        <div class="flex items-center justify-between border-b border-gray-100 pb-3 dark:border-gray-800">
          <div>
            <h4 class="text-base font-bold text-gray-900 dark:text-white">{{ card.amount }}</h4>
            <p class="text-xs text-gray-500 dark:text-gray-400">{{ card.title }}</p>
          </div>
          <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 text-primary dark:bg-primary/20">
            <FeatherIcon :name="card.icon" size="18" />
          </div>
        </div>
        <div class="mt-2.5 flex items-center justify-between text-xs">
          <p class="text-gray-500 dark:text-gray-400">
            <span :class="['font-bold', card.changeType === 'increase' ? 'text-emerald-600' : 'text-rose-600']">{{ card.change }}</span>
            vs Last Month
          </p>
          <NuxtLink :to="card.link" class="font-medium text-primary hover:underline">View All</NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

