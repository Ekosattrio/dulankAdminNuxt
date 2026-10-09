<script setup lang="ts">
import BankAccountFormModal from './BankAccountFormModal.vue'
import BankAccountRecordsTable from './BankAccountRecordsTable.vue'
import BankAccountSummary from './BankAccountSummary.vue'
import BankAccountTypeFormModal from './BankAccountTypeFormModal.vue'
import BankAccountTypeRecordsTable from './BankAccountTypeRecordsTable.vue'
import DocumentPrintModal from '~/components/common/DocumentPrintModal.vue'
import SalesConfirmDelete from '~/components/sales/SalesConfirmDelete.vue'
import SalesFeedback from '~/components/sales/SalesFeedback.vue'
import SalesListHeader from '~/components/sales/SalesListHeader.vue'
import { useBankAccountManager } from '~/composables/useBankAccountManager'
import { useTablePrint } from '~/composables/useTablePrint'

const manager = useBankAccountManager()
const print = useTablePrint()
const printColumns = computed(() => manager.activeTab.value === 'accounts'
  ? [
      { key: 'accountName', label: 'Account Name' }, { key: 'bankName', label: 'Bank Name' },
      { key: 'accountNo', label: 'Account No' }, { key: 'accountTypeName', label: 'Type' },
      { key: 'openingBalance', label: 'Opening Balance', align: 'right' as const },
      { key: 'currentBalance', label: 'Current Balance', align: 'right' as const },
      { key: 'status', label: 'Status', align: 'center' as const },
    ]
  : [
      { key: 'name', label: 'Type' }, { key: 'createdDate', label: 'Create Date' },
      { key: 'accountCount', label: 'Accounts', align: 'center' as const },
      { key: 'status', label: 'Status', align: 'center' as const },
    ])
const printItems = computed(() => manager.activeTab.value === 'accounts' ? manager.filteredAccounts.value : manager.filteredTypes.value)
const currentPrintItems = computed(() => manager.activeTab.value === 'accounts' ? manager.currentPageAccounts.value : manager.currentPageTypes.value)
const deleteTitle = computed(() => manager.accountDeleteTarget.value ? 'Delete Bank Account' : 'Delete Account Type')
const deleteMessage = computed(() => manager.accountDeleteTarget.value
  ? `Delete account '${manager.accountDeleteTarget.value.accountName}'?`
  : `Delete account type '${manager.typeDeleteTarget.value?.name ?? ''}'?`)
</script>

<template>
  <div class="space-y-6">
    <SalesListHeader title="Bank Accounts" subtitle="Manage your company bank accounts" :add-label="manager.activeTab.value === 'accounts' ? 'Add Account' : 'Add Type'" :refreshing="manager.pending.value" @add="manager.activeTab.value === 'accounts' ? manager.showAccountForm() : manager.showTypeForm()" @refresh="manager.resetFilters" @print="print.openPrintModal('print')" @pdf="print.openPrintModal('pdf')">
      <button type="button" class="inline-flex h-9 items-center gap-2 rounded-md border border-gray-200 bg-white px-3 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200" @click="manager.activeTab.value === 'accounts' ? manager.showTypeForm() : manager.showAccountForm()">
        <FeatherIcon name="plus-circle" :size="16" />{{ manager.activeTab.value === 'accounts' ? 'Add Type' : 'Add Account' }}
      </button>
    </SalesListHeader>

    <BankAccountSummary v-if="!manager.pending.value" :stats="manager.stats.value" />
    <SalesFeedback :pending="manager.pending.value" :error="manager.error.value ? 'Unable to load bank accounts. Please try again.' : ''" :message="manager.message.value" skeleton="table" :skeleton-cols="8" @retry="manager.refresh" @dismiss="manager.message.value = ''" />

    <div v-if="!manager.pending.value && !manager.error.value" class="space-y-4">
      <div class="inline-flex rounded-md border border-gray-200 bg-white p-1 shadow-sm dark:border-gray-700 dark:bg-gray-900" role="tablist" aria-label="Bank account views">
        <button v-for="tab in [{ id: 'accounts', label: 'Bank Accounts' }, { id: 'types', label: 'Account Type' }]" :key="tab.id" type="button" role="tab" :aria-selected="manager.activeTab.value === tab.id" :class="['h-9 rounded px-4 text-sm font-semibold', manager.activeTab.value === tab.id ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800']" @click="manager.activeTab.value = tab.id as 'accounts' | 'types'; manager.search.value = ''; manager.status.value = ''">{{ tab.label }}</button>
      </div>

      <BankAccountRecordsTable v-if="manager.activeTab.value === 'accounts'" :items="manager.filteredAccounts.value" :account-types="manager.accountTypes.value" :search="manager.search.value" :status="manager.status.value" :account-type-id="manager.accountTypeId.value" @update:search="manager.search.value = $event" @update:status="manager.status.value = $event" @update:account-type-id="manager.accountTypeId.value = $event" @update:current-page-items="manager.currentPageAccounts.value = $event" @edit="manager.showAccountForm" @delete="manager.accountDeleteTarget.value = $event" />
      <BankAccountTypeRecordsTable v-else :items="manager.filteredTypes.value" :search="manager.search.value" :status="manager.status.value" @update:search="manager.search.value = $event" @update:status="manager.status.value = $event" @update:current-page-items="manager.currentPageTypes.value = $event" @edit="manager.showTypeForm" @delete="manager.typeDeleteTarget.value = $event" />
    </div>

    <BankAccountFormModal :open="manager.accountFormOpen.value" :item="manager.accountFormTarget.value" :account-types="manager.accountTypes.value" :busy="manager.busy.value" :error="manager.mutationError.value" @close="manager.accountFormOpen.value = false" @submit="manager.saveAccount" />
    <BankAccountTypeFormModal :open="manager.typeFormOpen.value" :item="manager.typeFormTarget.value" :busy="manager.busy.value" :error="manager.mutationError.value" @close="manager.typeFormOpen.value = false" @submit="manager.saveType" />
    <SalesConfirmDelete :open="!!manager.accountDeleteTarget.value || !!manager.typeDeleteTarget.value" :title="deleteTitle" :message="deleteMessage" :busy="manager.busy.value" :error="manager.mutationError.value" @close="manager.closeDelete" @confirm="manager.confirmDelete" />
    <DocumentPrintModal :open="print.isPrintModalOpen.value" :title="manager.activeTab.value === 'accounts' ? 'Bank Accounts Report' : 'Account Types Report'" :columns="printColumns" :items="printItems" :current-page-items="currentPrintItems" :default-action="print.defaultPrintAction.value" :show-date-range="false" @close="print.closePrintModal" />
  </div>
</template>

