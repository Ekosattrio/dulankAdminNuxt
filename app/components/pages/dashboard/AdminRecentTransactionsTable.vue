<script setup lang="ts">
import FeatherIcon from '~/components/common/FeatherIcon.vue'

interface RecentTx {
  id: string
  customer: string
  date: string
  total: string
  status: string
}

withDefaults(
  defineProps<{
    transactions?: RecentTx[]
  }>(),
  {
    transactions: () => [
      { id: 'PT001', customer: 'PT. Nusantara Teknologi', date: '07/09/2026', total: 'Rp1.250.000', status: 'Complete' },
      { id: 'PT002', customer: 'Eko Satrio', date: '06/09/2026', total: 'Rp899.500', status: 'Pending' },
      { id: 'PT003', customer: 'CV Maju Jaya', date: '05/09/2026', total: 'Rp3.420.000', status: 'Approved' },
      { id: 'PT004', customer: 'Rama Nusa', date: '04/09/2026', total: 'Rp550.000', status: 'Complete' },
      { id: 'PT005', customer: 'PT. Sinar Abadi', date: '03/09/2026', total: 'Rp2.100.000', status: 'Need Approval' }
    ]
  }
)
</script>

<template>
  <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
    <div class="flex items-center justify-between border-b border-gray-100 pb-3 dark:border-gray-800 mb-4">
      <h5 class="text-sm font-bold text-gray-900 dark:text-white">Recent Transactions</h5>
      <NuxtLink to="/sales" class="text-xs font-semibold text-primary hover:underline">View All Sales</NuxtLink>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full text-start text-xs">
        <thead class="bg-gray-50 text-xs font-semibold uppercase text-gray-500 dark:bg-gray-800/50 dark:text-gray-400">
          <tr>
            <th class="px-4 py-2.5 text-start">Invoice / Sales No</th>
            <th class="px-4 py-2.5 text-start">Customer</th>
            <th class="px-4 py-2.5 text-start">Date</th>
            <th class="px-4 py-2.5 text-start">Total Amount</th>
            <th class="px-4 py-2.5 text-start">Status</th>
            <th class="px-4 py-2.5 text-end">Action</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
          <tr v-for="t in transactions" :key="t.id" class="hover:bg-gray-50/50 dark:hover:bg-gray-800/40">
            <td class="px-4 py-3 font-semibold text-primary">
              <NuxtLink :to="`/sales-note?id=${t.id}`">{{ t.id }}</NuxtLink>
            </td>
            <td class="px-4 py-3 font-medium text-gray-900 dark:text-white">{{ t.customer }}</td>
            <td class="px-4 py-3 text-gray-500">{{ t.date }}</td>
            <td class="px-4 py-3 font-semibold text-gray-800 dark:text-gray-200">{{ t.total }}</td>
            <td class="px-4 py-3">
              <span
                :class="[
                  'inline-block px-2 py-0.5 rounded-full text-xs font-bold',
                  t.status === 'Complete'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : t.status === 'Pending'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      : t.status === 'Approved'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                ]"
              >
                {{ t.status }}
              </span>
            </td>
            <td class="px-4 py-3 text-end">
              <div class="flex items-center justify-end gap-2">
                <NuxtLink :to="`/sales-note?id=${t.id}`" class="rounded p-1 text-gray-400 hover:text-primary" title="View Note">
                  <FeatherIcon name="eye" size="14" />
                </NuxtLink>
                <NuxtLink
                  :to="`/sales-receipt?id=${t.id}`"
                  class="rounded p-1 text-gray-400 hover:text-primary"
                  title="Print Receipt"
                >
                  <FeatherIcon name="printer" size="14" />
                </NuxtLink>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

