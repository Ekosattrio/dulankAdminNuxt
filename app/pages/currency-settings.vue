<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <CommonPageHeader title="Settings" subtitle="Manage your settings on portal">
      <template #actions>
        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-600 focus:outline-none"
          @click="openAddModal"
        >
          <CommonFeatherIcon name="plus" size="18" />
          <span>Add New Currency</span>
        </button>
      </template>
    </CommonPageHeader>

    <!-- Table Card -->
    <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <!-- Toolbar -->
      <div class="mb-5 flex flex-wrap items-center justify-between gap-4">
        <CommonSearchFilter v-model="searchQuery" placeholder="Search Currency..." />
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="w-full text-start text-xs text-gray-700 dark:text-gray-300">
          <thead
            class="bg-gray-50 text-[11px] font-semibold uppercase text-gray-500 border-b border-gray-200 dark:bg-gray-800/50 dark:border-gray-700 dark:text-gray-400"
          >
            <tr>
              <th class="px-4 py-3 text-start whitespace-nowrap">Currency Name</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Code</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Symbol</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Exchange Rate</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Created On</th>
              <th class="px-4 py-3 text-end whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <tr v-for="(c, idx) in filteredCurrencies" :key="idx" class="transition-colors hover:bg-gray-50/75 dark:hover:bg-gray-800/40">
              <td class="px-4 py-3 whitespace-nowrap font-semibold text-gray-900 dark:text-gray-100">{{ c.name }}</td>
              <td class="px-4 py-3 whitespace-nowrap">
                <span class="inline-flex rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary dark:bg-primary/20">{{ c.code }}</span>
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-base font-bold">{{ c.symbol }}</td>
              <td class="px-4 py-3 whitespace-nowrap">{{ c.exchangeRate }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-gray-500 dark:text-gray-400">{{ c.createdOn }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-end">
                <CommonRowActions :item="c" @edit="openEditModal(c)" @delete="deleteCurrency(idx)" />
              </td>
            </tr>
            <tr v-if="filteredCurrencies.length === 0">
              <td colspan="6" class="p-8 text-center text-gray-400">No currencies found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <CommonBaseModal v-model="showModal" :title="isEditing ? 'Edit Currency' : 'Add Currency'" maxWidth="md">
      <form @submit.prevent="saveCurrency" class="space-y-4">
        <CommonFormField label="Currency Name" required>
          <input
            v-model="currentCurrency.name"
            type="text"
            class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            required
            placeholder="e.g. Indonesian Rupiah"
          />
        </CommonFormField>
        <CommonFormField label="Currency Code" required>
          <input
            v-model="currentCurrency.code"
            type="text"
            class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            required
            placeholder="e.g. IDR"
          />
        </CommonFormField>
        <CommonFormField label="Currency Symbol" required>
          <input
            v-model="currentCurrency.symbol"
            type="text"
            class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            required
            placeholder="e.g. Rp"
          />
        </CommonFormField>
        <CommonFormField label="Exchange Rate">
          <input
            v-model="currentCurrency.exchangeRate"
            type="text"
            class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            placeholder="Default or 15,500"
          />
        </CommonFormField>
        <CommonModalFooter submitLabel="Save Changes" @cancel="showModal = false" />
      </form>
    </CommonBaseModal>
  </div>
</template>

<script setup lang="ts">import { ref, computed } from 'vue'

useHead({
  title: 'Currency Settings - Kacetak System'
})

const searchQuery = ref('')
const showModal = ref(false)
const isEditing = ref(false)

const { data: currencySettingsData } = await useFetch<CurrencyItem[]>('/api/currency-settings')
const currencies = ref<CurrencyItem[]>(currencySettingsData.value ?? [])
useMockSync('currency-settings', currencies)

const currentCurrency = ref<CurrencyItem>({
  name: '',
  code: '',
  symbol: '',
  exchangeRate: '1.0',
  createdOn: ''
})

const filteredCurrencies = computed(() => {
  return currencies.value.filter(c => {
    const q = searchQuery.value.toLowerCase()
    return c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q)
  })
})

const openAddModal = () => {
  isEditing.value = false
  currentCurrency.value = {
    name: '',
    code: '',
    symbol: '',
    exchangeRate: '1.0',
    createdOn: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  }
  showModal.value = true
}

const openEditModal = (c: CurrencyItem) => {
  isEditing.value = true
  currentCurrency.value = { ...c }
  showModal.value = true
}

const saveCurrency = () => {
  if (isEditing.value) {
    const idx = currencies.value.findIndex(c => c.id === currentCurrency.value.id)
    if (idx !== -1) {
      currencies.value[idx] = { ...currentCurrency.value }
    }
  } else {
    currencies.value.unshift({
      id: Date.now(),
      ...currentCurrency.value
    })
  }
  showModal.value = false
}

const deleteCurrency = (idx: number) => {
  if (confirm('Are you sure you want to delete this currency?')) {
    currencies.value.splice(idx, 1)
  }
}

const refresh = () => {
  // refresh
}

const toggleCollapse = () => {
  // collapse
}
</script>