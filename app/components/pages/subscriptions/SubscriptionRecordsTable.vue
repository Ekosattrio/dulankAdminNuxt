<script setup lang="ts">
import type { SubscriptionItem } from '#server/types/subscription'
import FeatherIcon from '~/components/common/FeatherIcon.vue'
import { formatIDR } from '~/utils/currency'
import { tableFilterControlClass } from '~/utils/salesUi'

const props = defineProps<{
  subscriptions: SubscriptionItem[]
  searchQuery: string
  filterPlan: string
  filterPayment: string
  filterStatus: string
}>()

const emit = defineEmits<{
  (e: 'update:searchQuery', value: string): void
  (e: 'update:filterPlan', value: string): void
  (e: 'update:filterPayment', value: string): void
  (e: 'update:filterStatus', value: string): void
  (e: 'view', item: SubscriptionItem): void
  (e: 'edit', item: SubscriptionItem): void
  (e: 'delete', item: SubscriptionItem): void
}>()

type SortField = 'subscriber' | 'plan' | 'billingCycle' | 'method' | 'amount' | 'createdDate' | 'expiringOn' | 'status'
const sortField = ref<SortField>('subscriber')
const sortOrder = ref<'asc' | 'desc'>('asc')

const handleSort = (field: SortField) => {
  if (sortField.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortOrder.value = 'asc'
  }
}

const filteredList = computed(() => {
  let list = props.subscriptions.filter((item) => {
    const q = props.searchQuery.toLowerCase().trim()
    const matchSearch =
      !q ||
      item.subscriber.toLowerCase().includes(q) ||
      item.plan.toLowerCase().includes(q) ||
      item.method.toLowerCase().includes(q)

    const matchPlan = !props.filterPlan || item.plan.toLowerCase().includes(props.filterPlan.toLowerCase())
    const matchPayment = !props.filterPayment || item.method === props.filterPayment
    const matchStatus = !props.filterStatus || item.status === props.filterStatus

    return matchSearch && matchPlan && matchPayment && matchStatus
  })

  if (sortField.value) {
    list = [...list].sort((a: any, b: any) => {
      const valA = a[sortField.value]
      const valB = b[sortField.value]
      if (typeof valA === 'number') {
        return sortOrder.value === 'asc' ? valA - valB : valB - valA
      }
      return sortOrder.value === 'asc' ? String(valA).localeCompare(String(valB)) : String(valB).localeCompare(String(valA))
    })
  }

  return list
})
</script>

<template>
  <div class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
    <!-- Filter Toolbar -->
    <div class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div class="relative w-full max-w-sm">
        <FeatherIcon name="search" size="14" class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          :value="searchQuery"
          type="text"
          placeholder="Search subscriber, plan, method..."
          class="h-9 w-full rounded-lg border border-gray-300 bg-white pl-9 pr-3 text-sm text-gray-900 focus:border-primary-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          @input="emit('update:searchQuery', ($event.target as HTMLInputElement).value)"
        />
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <select
          :value="filterPlan"
          :class="tableFilterControlClass"
          @change="emit('update:filterPlan', ($event.target as HTMLSelectElement).value)"
        >
          <option value="">All Plans</option>
          <option value="Basic">Basic</option>
          <option value="Advanced">Advanced</option>
          <option value="Enterprise">Enterprise</option>
        </select>
        <select
          :value="filterPayment"
          :class="tableFilterControlClass"
          @change="emit('update:filterPayment', ($event.target as HTMLSelectElement).value)"
        >
          <option value="">All Payment Methods</option>
          <option value="Credit Card">Credit Card</option>
          <option value="Paypal">Paypal</option>
          <option value="Debit Card">Debit Card</option>
        </select>
        <select
          :value="filterStatus"
          :class="tableFilterControlClass"
          @change="emit('update:filterStatus', ($event.target as HTMLSelectElement).value)"
        >
          <option value="">All Statuses</option>
          <option value="Paid">Paid</option>
          <option value="Unpaid">Unpaid</option>
        </select>
      </div>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="w-full text-start text-sm">
        <thead class="bg-gray-50 text-xs font-semibold uppercase text-gray-500 dark:bg-gray-800/50 dark:text-gray-400">
          <tr>
            <th class="cursor-pointer px-3 py-2.5 text-start" @click="handleSort('subscriber')">
              Subscriber
            </th>
            <th class="cursor-pointer px-3 py-2.5 text-start" @click="handleSort('plan')">
              Plan
            </th>
            <th class="cursor-pointer px-3 py-2.5 text-start" @click="handleSort('billingCycle')">
              Billing Cycle
            </th>
            <th class="cursor-pointer px-3 py-2.5 text-start" @click="handleSort('method')">
              Payment Method
            </th>
            <th class="cursor-pointer px-3 py-2.5 text-end" @click="handleSort('amount')">
              Amount
            </th>
            <th class="cursor-pointer px-3 py-2.5 text-start" @click="handleSort('createdDate')">
              Created Date
            </th>
            <th class="cursor-pointer px-3 py-2.5 text-start" @click="handleSort('expiringOn')">
              Expiring On
            </th>
            <th class="cursor-pointer px-3 py-2.5 text-center" @click="handleSort('status')">
              Status
            </th>
            <th class="px-3 py-2.5 text-end">Action</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
          <tr v-for="item in filteredList" :key="item.id" class="hover:bg-gray-50/50 dark:hover:bg-gray-800/40">
            <td class="px-3 py-3 font-medium text-gray-900 dark:text-white">{{ item.subscriber }}</td>
            <td class="px-3 py-3">
              <span class="inline-block rounded-md border border-gray-200 bg-gray-50 px-2 py-0.5 text-xs text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
                {{ item.plan }}
              </span>
            </td>
            <td class="px-3 py-3 text-xs text-gray-500">{{ item.billingCycle }}</td>
            <td class="px-3 py-3 text-xs text-gray-700 dark:text-gray-300">{{ item.method }}</td>
            <td class="px-3 py-3 text-end tabular-nums font-semibold text-gray-900 dark:text-white">{{ formatIDR(item.amount) }}</td>
            <td class="px-3 py-3 text-xs text-gray-500">{{ item.createdDate }}</td>
            <td class="px-3 py-3 text-xs text-gray-500">{{ item.expiringOn }}</td>
            <td class="px-3 py-3 text-center">
              <span
                :class="[
                  'inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold',
                  item.status === 'Paid'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                ]"
              >
                {{ item.status }}
              </span>
            </td>
            <td class="px-3 py-3 text-end">
              <div class="flex items-center justify-end gap-1.5">
                <button
                  type="button"
                  class="rounded-lg p-1 text-gray-500 hover:bg-gray-100 hover:text-primary dark:text-gray-400 dark:hover:bg-gray-800"
                  title="View Invoice"
                  @click="emit('view', item)"
                >
                  <FeatherIcon name="eye" size="14" />
                </button>
                <button
                  type="button"
                  class="rounded-lg p-1 text-gray-500 hover:bg-gray-100 hover:text-emerald-600 dark:text-gray-400 dark:hover:bg-gray-800"
                  title="Edit Subscription"
                  @click="emit('edit', item)"
                >
                  <FeatherIcon name="edit-2" size="14" />
                </button>
                <button
                  type="button"
                  class="rounded-lg p-1 text-gray-500 hover:bg-gray-100 hover:text-rose-600 dark:text-gray-400 dark:hover:bg-gray-800"
                  title="Delete"
                  @click="emit('delete', item)"
                >
                  <FeatherIcon name="trash-2" size="14" />
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="filteredList.length === 0">
            <td colspan="9" class="py-8 text-center text-sm text-gray-400">No subscriptions found.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

