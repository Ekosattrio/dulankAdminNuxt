<script setup lang="ts">
import type { SupportTicketStats } from '#server/types/support-ticket'
import { formatMoney } from '~/utils/currency'

interface Props {
  stats: SupportTicketStats
}

defineProps<Props>()
</script>

<template>
  <div class="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
    <div
      class="app-stat-card"
    >
      <div
        class="w-12 h-12 rounded-full bg-[rgba(249,110,111,0.12)] flex items-center justify-center shrink-0"
      >
        <img
          src="/assets/img/icons/dash1.svg"
          alt="Total Tickets"
          class="w-6 h-6 object-contain"
        />
      </div>
      <div class="min-w-0 flex-1">
        <h6 class="text-sm font-normal text-gray-500 dark:text-gray-400 mb-1">
          Total Tickets
        </h6>
        <h5 class="text-2xl font-bold break-words text-gray-900 dark:text-white">
          {{ formatMoney(stats.totalTickets) }}
        </h5>
      </div>
    </div>

    <div
      class="app-stat-card"
    >
      <div
        class="w-12 h-12 rounded-full bg-[rgba(40,199,111,0.12)] flex items-center justify-center shrink-0"
      >
        <img
          src="/assets/img/icons/dash2.svg"
          alt="Total Pending Tickets"
          class="w-6 h-6 object-contain"
        />
      </div>
      <div class="min-w-0 flex-1">
        <h6 class="text-sm font-normal text-gray-500 dark:text-gray-400 mb-1">
          Total Pending Tickets
        </h6>
        <h5 class="text-2xl font-bold break-words text-gray-900 dark:text-white">
          {{ formatMoney(stats.totalPendingTickets) }}
        </h5>
      </div>
    </div>

    <div
      class="app-stat-card"
    >
      <div
        class="w-12 h-12 rounded-full bg-[rgba(0,207,232,0.12)] flex items-center justify-center shrink-0"
      >
        <img
          src="/assets/img/icons/dash3.svg"
          alt="Total Closed Tickets"
          class="w-6 h-6 object-contain"
        />
      </div>
      <div class="min-w-0 flex-1">
        <h6 class="text-sm font-normal text-gray-500 dark:text-gray-400 mb-1">
          Total Closed Tickets
        </h6>
        <h5 class="text-2xl font-bold break-words text-gray-900 dark:text-white">
          {{ formatMoney(stats.totalClosedTickets) }}
        </h5>
      </div>
    </div>

    <div
      class="app-stat-card"
    >
      <div
        class="w-12 h-12 rounded-full bg-[rgba(115,103,240,0.12)] flex items-center justify-center shrink-0"
      >
        <img
          src="/assets/img/icons/dash4.svg"
          alt="Total Delete Tickets"
          class="w-6 h-6 object-contain"
        />
      </div>
      <div class="min-w-0 flex-1">
        <h6 class="text-sm font-normal text-gray-500 dark:text-gray-400 mb-1">
          Total Delete Tickets
        </h6>
        <h5 class="text-2xl font-bold break-words text-gray-900 dark:text-white">
          {{ formatMoney(stats.totalDeleteTickets) }}
        </h5>
      </div>
    </div>
  </div>
</template>
