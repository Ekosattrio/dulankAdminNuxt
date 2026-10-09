<<<<<<< HEAD
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
          <span>Add New Account</span>
        </button>
      </template>
    </CommonPageHeader>

    <!-- Table Card -->
    <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <!-- Toolbar -->
      <div class="mb-5 flex flex-wrap items-center justify-between gap-4">
        <CommonSearchFilter v-model="searchQuery" placeholder="Search Bank or Holder Name..." />

        <div class="flex items-center gap-2">
          <NuxtLink
            to="/bank-settings-list"
            title="List View"
            class="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 hover:text-primary dark:border-gray-700 dark:hover:bg-gray-800"
          >
            <CommonFeatherIcon name="list" size="18" />
          </NuxtLink>
          <NuxtLink
            to="/bank-settings-grid"
            title="Grid View"
            class="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 hover:text-primary dark:border-gray-700 dark:hover:bg-gray-800"
          >
            <CommonFeatherIcon name="grid" size="18" />
          </NuxtLink>
        </div>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="w-full text-start text-xs text-gray-700 dark:text-gray-300">
          <thead
            class="bg-gray-50 text-[11px] font-semibold uppercase text-gray-500 border-b border-gray-200 dark:bg-gray-800/50 dark:border-gray-700 dark:text-gray-400"
          >
            <tr>
              <th class="px-4 py-3 text-start whitespace-nowrap">Name</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Bank</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Branch</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Account No</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Status</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Created On</th>
              <th class="px-4 py-3 text-end whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <tr v-for="(b, idx) in filteredAccounts" :key="idx" class="transition-colors hover:bg-gray-50/75 dark:hover:bg-gray-800/40">
              <td class="px-4 py-3 whitespace-nowrap font-semibold text-gray-900 dark:text-gray-100">{{ b.holderName }}</td>
              <td class="px-4 py-3 whitespace-nowrap">{{ b.bankName }}</td>
              <td class="px-4 py-3 whitespace-nowrap">{{ b.branch }}</td>
              <td class="px-4 py-3 whitespace-nowrap font-mono">{{ b.accountNo }}</td>
              <td class="px-4 py-3 whitespace-nowrap">
                <CommonStatusPill v-if="b.isDefault" status="Default" tone="emerald" />
                <CommonStatusPill v-else status="Secondary" tone="slate" />
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-gray-500 dark:text-gray-400">{{ b.createdOn }}</td>
              <td class="px-4 py-3 whitespace-nowrap">
                <CommonRowActions :item="b" @edit="openEditModal(b)" @delete="deleteAccount(idx)" />
              </td>
            </tr>
            <tr v-if="filteredAccounts.length === 0">
              <td colspan="7" class="p-8 text-center text-gray-400">No accounts found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <CommonBaseModal v-model="showModal" :title="isEditing ? 'Edit Bank Account' : 'Add Bank Account'" maxWidth="md">
      <form @submit.prevent="saveAccount" class="space-y-4">
        <CommonFormField label="Bank Name" required>
          <input
            v-model="currentAccount.bankName"
            type="text"
            class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            required
            placeholder="e.g. Bank Central Asia (BCA)"
          />
        </CommonFormField>
        <CommonFormField label="Account Number" required>
          <input
            v-model="currentAccount.accountNo"
            type="text"
            class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            required
            placeholder="e.g. 1234567890"
          />
        </CommonFormField>
        <CommonFormField label="Account Holder Name" required>
          <input
            v-model="currentAccount.holderName"
            type="text"
            class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            required
            placeholder="e.g. John Doe"
          />
        </CommonFormField>
        <CommonFormField label="Branch">
          <input
            v-model="currentAccount.branch"
            type="text"
            class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            placeholder="e.g. KCU Sudirman"
          />
        </CommonFormField>

        <!-- Default toggle -->
        <div class="flex items-center justify-between rounded-lg border border-gray-100 p-3 dark:border-gray-800">
          <span class="text-xs font-semibold text-gray-700 dark:text-gray-300">Make as default account</span>
          <button
            type="button"
            :class="[
              'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none',
              currentAccount.isDefault ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-700',
            ]"
            @click="currentAccount.isDefault = !currentAccount.isDefault"
          >
            <span
              :class="[
                'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                currentAccount.isDefault ? 'translate-x-5' : 'translate-x-0',
              ]"
            />
          </button>
        </div>

        <CommonModalFooter submitLabel="Save Changes" @cancel="showModal = false" />
      </form>
    </CommonBaseModal>
  </div>
</template>

<script setup lang="ts">import { ref, computed } from 'vue'

useHead({
  title: 'Bank Settings List - Kacetak System'
})

const searchQuery = ref('')
const showModal = ref(false)
const isEditing = ref(false)

const { data: bankSettingsListData } = await useFetch<BankAccount[]>('/api/bank-settings-list')
const accounts = ref<BankAccount[]>(bankSettingsListData.value ?? [])
useMockSync('bank-settings-list', accounts)

const currentAccount = ref<BankAccount>({
  bankName: '',
  accountNo: '',
  holderName: '',
  branch: '',
  isDefault: false,
  createdOn: ''
})

const filteredAccounts = computed(() => {
  return accounts.value.filter(a => {
    const q = searchQuery.value.toLowerCase()
    return a.bankName.toLowerCase().includes(q) || a.holderName.toLowerCase().includes(q)
  })
})

const openAddModal = () => {
  isEditing.value = false
  currentAccount.value = {
    bankName: '',
    accountNo: '',
    holderName: '',
    branch: '',
    isDefault: false,
    createdOn: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  }
  showModal.value = true
}

const openEditModal = (b: BankAccount) => {
  isEditing.value = true
  currentAccount.value = { ...b }
  showModal.value = true
}

const saveAccount = () => {
  if (currentAccount.value.isDefault) {
    accounts.value.forEach(a => a.isDefault = false)
  }
  if (isEditing.value) {
    const idx = accounts.value.findIndex(a => a.id === currentAccount.value.id)
    if (idx !== -1) {
      accounts.value[idx] = { ...currentAccount.value }
    }
  } else {
    accounts.value.unshift({
      id: Date.now(),
      ...currentAccount.value
    })
  }
  showModal.value = false
}

const deleteAccount = (idx: number) => {
  if (confirm('Are you sure you want to delete this bank account?')) {
    accounts.value.splice(idx, 1)
  }
}</script>
=======
<script setup lang="ts">
import BankSettingsListWorkspace from '~/components/pages/setting/BankSettingsListWorkspace.vue'

useLegacyPage({
  title: 'Bank Settings List',
  styles: ['/assets/css/style.css'],
  scripts: ['/assets/js/theme-script.js'],
  sweetAlert: true
})
</script>

<template>
  <div class="dulank-page dulank-page-bank-settings-list">
    <BankSettingsListWorkspace />
  </div>
</template>
>>>>>>> origin/eko
