<script setup lang="ts">
import FeatherIcon from '~/components/common/FeatherIcon.vue'

interface TopStat {
  title: string
  value: string
  change: string
  changeType: 'up' | 'down'
  period: string
  icon: string
  iconColor: string
  bgColor: string
}

withDefaults(
  defineProps<{
    stats?: TopStat[]
  }>(),
  {
    stats: () => [
      {
        title: 'Page View',
        value: '13,647',
        change: '+2.3%',
        changeType: 'up',
        period: 'Last Month',
        icon: 'feather',
        iconColor: 'text-[#28C76F]',
        bgColor: 'bg-[#28C76F]/10'
      },
      {
        title: 'Clicks',
        value: '9,526',
        change: '+8.1%',
        changeType: 'up',
        period: 'Last Month',
        icon: 'mouse-pointer',
        iconColor: 'text-[#00CFDD]',
        bgColor: 'bg-[#00CFDD]/10'
      },
      {
        title: 'Conversions',
        value: '976',
        change: '-0.3%',
        changeType: 'down',
        period: 'Last Month',
        icon: 'layers',
        iconColor: 'text-primary',
        bgColor: 'bg-primary/10'
      },
      {
        title: 'New Users',
        value: '$123.6k',
        change: '-10.6%',
        changeType: 'down',
        period: 'Last Month',
        icon: 'user-plus',
        iconColor: 'text-[#00CFDD]',
        bgColor: 'bg-[#00CFDD]/10'
      }
    ]
  }
)

const emit = defineEmits<{
  (e: 'viewDetail', title: string, desc: string): void
}>()
</script>

<template>
  <div class="mb-5 mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
    <div
      v-for="(card, idx) in stats"
      :key="idx"
      class="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
    >
      <div class="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl" :class="card.bgColor">
        <FeatherIcon :name="card.icon" size="26" :class="card.iconColor" />
      </div>

      <div class="min-w-0 flex-1">
        <h5 class="mb-1 text-2xl font-bold leading-none text-gray-900 dark:text-white">
          {{ card.value }}
        </h5>
        <h6 class="mb-1 text-xs font-semibold text-gray-500 dark:text-gray-400">
          {{ card.title }}
        </h6>
        <div class="flex items-center gap-1 text-[11px] font-semibold">
          <span :class="['inline-flex items-center', card.changeType === 'up' ? 'text-emerald-600' : 'text-rose-600']">
            <FeatherIcon :name="card.changeType === 'up' ? 'arrow-up' : 'arrow-down'" size="12" class="me-0.5" />
            {{ card.change }}
          </span>
          <span class="font-normal text-gray-400">{{ card.period }}</span>
        </div>
        <button
          type="button"
          class="mt-1 block text-[11px] font-semibold text-primary hover:underline"
          @click="emit('viewDetail', card.title, `Displaying comprehensive log and trajectory for ${card.title}. Current total stands at ${card.value}.`)"
        >
          View More
        </button>
      </div>
    </div>
  </div>
</template>

