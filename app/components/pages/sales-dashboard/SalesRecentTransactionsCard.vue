<script setup lang="ts">
import FeatherIcon from '~/components/common/FeatherIcon.vue'

export interface TransactionItem {
  id: number
  name: string
  time: string
  paymentMethod: string
  reference: string
  status: 'Success' | 'Canceled' | 'Pending'
  amount: number
  image: string
  date: string
}

withDefaults(
  defineProps<{
    transactions?: TransactionItem[]
  }>(),
  {
    transactions: () => [
      {
        id: 1,
        name: 'Lobar Handy',
        time: '15 Mins',
        paymentMethod: 'Paypal',
        reference: '#416645453773',
        status: 'Success',
        amount: 1099.0,
        image: '/assets/img/products/stock-img-05.png',
        date: '07 Sep 2026, 14:45'
      },
      {
        id: 2,
        name: 'Red Premium Handy',
        time: '10 Mins',
        paymentMethod: 'Apple Pay',
        reference: '#147784454554',
        status: 'Canceled',
        amount: 600.55,
        image: '/assets/img/products/expire-product-01.png',
        date: '07 Sep 2026, 14:50'
      },
      {
        id: 3,
        name: 'Iphone 14 Pro',
        time: '10 Mins',
        paymentMethod: 'Stripe',
        reference: '#147784454554',
        status: 'Pending',
        amount: 1099.0,
        image: '/assets/img/products/expire-product-02.png',
        date: '07 Sep 2026, 14:50'
      },
      {
        id: 4,
        name: 'Black Slim 200',
        time: '10 Mins',
        paymentMethod: 'PayU',
        reference: '#147784454554',
        status: 'Success',
        amount: 1569.0,
        image: '/assets/img/products/expire-product-03.png',
        date: '07 Sep 2026, 14:50'
      },
      {
        id: 5,
        name: 'Woodcraft Sandal',
        time: '15 Mins',
        paymentMethod: 'Paytm',
        reference: '#147784454554',
        status: 'Success',
        amount: 1478.0,
        image: '/assets/img/products/expire-product-04.png',
        date: '07 Sep 2026, 14:45'
      }
    ]
  }
)

const emit = defineEmits<{
  (e: 'viewTransaction', tx: TransactionItem): void
}>()
</script>

<template>
  <div class="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 xl:col-span-8">
    <div class="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-gray-800">
      <h4 class="text-sm font-bold text-gray-900 sm:text-base dark:text-white">Recent Transactions</h4>
      <NuxtLink
        to="/sales"
        class="view-all flex items-center text-xs font-semibold text-primary transition hover:text-primary-hover"
      >
        View All
        <span class="flex items-center ps-1.5"><FeatherIcon name="arrow-right" size="14" /></span>
      </NuxtLink>
    </div>

    <div class="flex-1 overflow-x-auto">
      <table class="w-full border-collapse text-left">
        <thead>
          <tr class="border-b border-gray-100 bg-gray-50/50 text-xs font-bold uppercase text-gray-400 dark:border-gray-800 dark:bg-gray-800/30">
            <th class="w-10 py-3.5 pe-2 ps-5">#</th>
            <th class="min-w-[200px] px-4 py-3.5">Order Details</th>
            <th class="min-w-[150px] px-4 py-3.5">Payment</th>
            <th class="min-w-[110px] px-4 py-3.5">Status</th>
            <th class="min-w-[110px] pe-5 ps-4 py-3.5 text-end">Amount</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50 text-xs dark:divide-gray-800/60">
          <tr
            v-for="tx in transactions"
            :key="tx.id"
            class="cursor-pointer transition hover:bg-gray-50/80 dark:hover:bg-gray-800/40"
            @click="emit('viewTransaction', tx)"
          >
            <td class="py-3.5 pe-2 ps-5 font-medium text-gray-400">{{ tx.id }}</td>
            <td class="px-4 py-3.5">
              <div class="flex items-center gap-3">
                <div class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-gray-100 bg-gray-50 p-1 dark:border-gray-700 dark:bg-gray-800">
                  <img :src="tx.image" :alt="tx.name" class="h-8 w-8 object-contain" />
                </div>
                <div class="min-w-0">
                  <p class="truncate font-bold text-gray-900 hover:text-primary dark:text-gray-100">{{ tx.name }}</p>
                  <span class="mt-0.5 flex items-center gap-1 text-xs text-gray-400">
                    <FeatherIcon name="clock" size="12" />
                    {{ tx.time }}
                  </span>
                </div>
              </div>
            </td>
            <td class="px-4 py-3.5">
              <p class="font-bold text-gray-900 dark:text-gray-200">{{ tx.paymentMethod }}</p>
              <span class="text-xs font-medium text-[#1B5A90] dark:text-blue-400">{{ tx.reference }}</span>
            </td>
            <td class="px-4 py-3.5">
              <span
                v-if="tx.status === 'Success'"
                class="inline-block rounded border border-[#28C76F] bg-[#28C76F]/10 px-2.5 py-0.5 text-xs font-semibold text-[#28C76F]"
              >
                Success
              </span>
              <span
                v-else-if="tx.status === 'Canceled'"
                class="inline-block rounded border border-[#EA5455] bg-[#EA5455]/10 px-2.5 py-0.5 text-xs font-semibold text-[#EA5455]"
              >
                Canceled
              </span>
              <span
                v-else
                class="inline-block rounded border border-primary bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary"
              >
                Pending
              </span>
            </td>
            <td class="pe-5 ps-4 py-3.5 text-end font-bold text-gray-900 dark:text-white">
              ${{ tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
