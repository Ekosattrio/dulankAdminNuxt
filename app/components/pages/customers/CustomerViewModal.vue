<script setup lang="ts">
import type { Customer } from '#server/types/customer'
import SalesDialog from '~/components/sales/SalesDialog.vue'
import CurrencyDisplay from '~/components/common/CurrencyDisplay.vue'
import FeatherIcon from '~/components/common/FeatherIcon.vue'

const props = defineProps<{
  open: boolean
  customer: Customer | null
}>()

defineEmits<{
  close: []
}>()

const activeTab = ref<'details' | 'address'>('details')
const customerAddresses = ref<any[]>([])
const loadingAddresses = ref(false)

watch(
  () => [props.open, props.customer],
  async ([isOpen, cust]) => {
    if (isOpen && cust) {
      activeTab.value = 'details'
      loadingAddresses.value = true
      try {
        const res = await $fetch<any>('/api/address')
        const allCustAddresses = res?.data?.customers || []
        customerAddresses.value = allCustAddresses.filter(
          (a: any) => a.customerId === (cust as Customer).customerId || a.customerId === (cust as Customer).id
        )
      } catch (err) {
        customerAddresses.value = []
      } finally {
        loadingAddresses.value = false
      }
    }
  },
  { immediate: true },
)
</script>

<template>
  <SalesDialog
    :open="open"
    title="View Customer"
    medium
    @close="$emit('close')"
  >
    <div v-if="customer" class="p-6">
      <!-- Tabs Header -->
      <div class="flex border-b border-gray-200 dark:border-gray-800 mb-6">
        <button
          type="button"
          :class="[
            'flex-1 py-2.5 text-center text-xs font-semibold border-b-2 transition-colors',
            activeTab === 'details'
              ? 'border-primary text-primary dark:text-primary-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          ]"
          @click="activeTab = 'details'"
        >
          Customer Details
        </button>
        <button
          type="button"
          :class="[
            'flex-1 py-2.5 text-center text-xs font-semibold border-b-2 transition-colors',
            activeTab === 'address'
              ? 'border-primary text-primary dark:text-primary-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          ]"
          @click="activeTab = 'address'"
        >
          Address ({{ customerAddresses.length }})
        </button>
      </div>

      <!-- Tab Content: Details -->
      <div v-if="activeTab === 'details'" class="space-y-3">
        <div class="grid grid-cols-12 gap-2 py-1.5 border-b border-gray-100 dark:border-gray-800 text-xs">
          <div class="col-span-5 font-semibold text-gray-500 dark:text-gray-400">Customer ID</div>
          <div class="col-span-7 font-semibold text-primary dark:text-primary-400">{{ customer.customerId }}</div>
        </div>
        <div class="grid grid-cols-12 gap-2 py-1.5 border-b border-gray-100 dark:border-gray-800 text-xs">
          <div class="col-span-5 font-semibold text-gray-500 dark:text-gray-400">Customer Type</div>
          <div class="col-span-7 font-medium text-gray-800 dark:text-gray-200">{{ customer.type }}</div>
        </div>
        <div class="grid grid-cols-12 gap-2 py-1.5 border-b border-gray-100 dark:border-gray-800 text-xs">
          <div class="col-span-5 font-semibold text-gray-500 dark:text-gray-400">Customer Name</div>
          <div class="col-span-7 font-medium text-gray-900 dark:text-gray-100">{{ customer.name }}</div>
        </div>
        <div class="grid grid-cols-12 gap-2 py-1.5 border-b border-gray-100 dark:border-gray-800 text-xs">
          <div class="col-span-5 font-semibold text-gray-500 dark:text-gray-400">Email</div>
          <div class="col-span-7 font-medium text-gray-800 dark:text-gray-200">{{ customer.email }}</div>
        </div>
        <div class="grid grid-cols-12 gap-2 py-1.5 border-b border-gray-100 dark:border-gray-800 text-xs">
          <div class="col-span-5 font-semibold text-gray-500 dark:text-gray-400">Balance</div>
          <div class="col-span-7 font-bold text-gray-900 dark:text-gray-100">
            <CurrencyDisplay :value="customer.balance" />
          </div>
        </div>
        <div class="grid grid-cols-12 gap-2 py-1.5 border-b border-gray-100 dark:border-gray-800 text-xs">
          <div class="col-span-5 font-semibold text-gray-500 dark:text-gray-400">Contact Number</div>
          <div class="col-span-7 font-medium text-gray-800 dark:text-gray-200">{{ customer.phone }}</div>
        </div>
        <div class="grid grid-cols-12 gap-2 py-1.5 border-b border-gray-100 dark:border-gray-800 text-xs">
          <div class="col-span-5 font-semibold text-gray-500 dark:text-gray-400">Join Channel</div>
          <div class="col-span-7 font-medium text-gray-800 dark:text-gray-200">{{ customer.channel }}</div>
        </div>
        <div class="grid grid-cols-12 gap-2 py-1.5 border-b border-gray-100 dark:border-gray-800 text-xs">
          <div class="col-span-5 font-semibold text-gray-500 dark:text-gray-400">Date Join</div>
          <div class="col-span-7 font-medium text-gray-600 dark:text-gray-300">{{ customer.dateJoin }}</div>
        </div>
        <div class="grid grid-cols-12 gap-2 py-1.5 text-xs">
          <div class="col-span-5 font-semibold text-gray-500 dark:text-gray-400">Last Seen</div>
          <div class="col-span-7 font-medium text-gray-600 dark:text-gray-300">{{ customer.lastSeen }}</div>
        </div>
      </div>

      <!-- Tab Content: Address -->
      <div v-else class="space-y-3">
        <div v-if="loadingAddresses" class="py-6 text-center text-xs text-gray-500">
          Loading addresses...
        </div>
        <div v-else-if="customerAddresses.length === 0" class="py-8 text-center text-xs text-gray-400">
          No address found for this customer.
        </div>
        <div
          v-for="addr in customerAddresses"
          :key="addr.id"
          class="rounded-lg border border-gray-200 p-4 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/40 space-y-1.5"
        >
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-gray-900 dark:text-gray-100">
              {{ addr.name }} / <span class="text-gray-500">{{ addr.contact }}</span>
            </span>
            <span class="text-[11px] text-gray-400">{{ addr.date }}</span>
          </div>
          <div class="text-xs text-gray-600 dark:text-gray-300">
            {{ addr.province }}, {{ addr.city }}, {{ addr.district }}, {{ addr.detailAddress }}
          </div>
          <div v-if="addr.otherDetail" class="text-xs text-gray-500 dark:text-gray-400">
            <span class="font-semibold">Detail:</span> {{ addr.otherDetail }}
          </div>
          <div class="flex items-center gap-2 pt-1">
            <span class="inline-flex items-center rounded bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
              {{ addr.status || 'Home' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Action Footer -->
      <div class="flex justify-end pt-6 border-t border-gray-100 dark:border-gray-800 mt-6">
        <button
          type="button"
          class="rounded-md border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
          @click="$emit('close')"
        >
          Close
        </button>
      </div>
    </div>
  </SalesDialog>
</template>
