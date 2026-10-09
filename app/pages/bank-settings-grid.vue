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

    <!-- Toolbar -->
    <div class="flex flex-wrap items-center justify-between gap-4">
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

    <!-- Bank Account Cards Grid -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <div
        v-for="(bank, idx) in accounts"
        :key="idx"
        :class="[
          'relative flex flex-col rounded-xl border bg-white p-5 shadow-sm dark:bg-gray-900',
          bank.isDefault ? 'border-primary' : 'border-gray-200 dark:border-gray-800',
        ]"
      >
        <div class="mb-3 flex items-start justify-between">
          <div>
            <h5 class="mb-1 font-bold text-gray-900 dark:text-gray-100">{{ bank.bankName }}</h5>
            <p class="font-mono text-xs text-gray-500 dark:text-gray-400">{{ bank.accountNo }}</p>
          </div>
          <CommonStatusPill v-if="bank.isDefault" status="Default" tone="emerald" />
        </div>

        <div class="mt-auto flex items-center justify-between border-t border-gray-100 pt-3 dark:border-gray-800">
          <div>
            <span class="block text-xs text-gray-400">Holder Name</span>
            <h6 class="mb-0 font-semibold text-gray-800 dark:text-gray-200">{{ bank.holderName }}</h6>
          </div>
          <CommonRowActions :item="bank" @edit="openEditModal(bank)" @delete="deleteAccount(idx)" />
        </div>
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

<script setup lang="ts">import { ref } from 'vue'

useHead({
  title: 'Bank Settings Grid - Kacetak System'
})

const showModal = ref(false)
const isEditing = ref(false)

const { data: bankSettingsGridData } = await useFetch<BankAccountGrid[]>('/api/bank-settings-grid')
const accounts = ref<BankAccountGrid[]>(bankSettingsGridData.value ?? [])
useMockSync('bank-settings-grid', accounts)

const currentAccount = ref<BankAccountGrid>({
  bankName: '',
  accountNo: '',
  holderName: '',
  branch: '',
  isDefault: false
})

const openAddModal = () => {
  isEditing.value = false
  currentAccount.value = {
    bankName: '',
    accountNo: '',
    holderName: '',
    branch: '',
    isDefault: false
  }
  showModal.value = true
}

const openEditModal = (b: BankAccountGrid) => {
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
import BankSettingsGridWorkspace from '~/components/pages/setting/BankSettingsGridWorkspace.vue'

useLegacyPage({
  title: 'Bank Settings Grid',
  styles: ['/assets/css/style.css'],
  scripts: ['/assets/js/theme-script.js'],
  sweetAlert: true
})
</script>

<template>
  <div class="dulank-page dulank-page-bank-settings-grid">
    <BankSettingsGridWorkspace />
  </div>
</template>
>>>>>>> origin/eko
