<script setup lang="ts">
import SalesReturnRecordsTable from '~/components/Pages/SalesReturn/SalesReturnRecordsTable.vue'
import SalesReturnEditor from '~/components/Pages/SalesReturn/SalesReturnEditor.vue'
import SalesReturnDetails from '~/components/Pages/SalesReturn/SalesReturnDetails.vue'
import SalesReturnPayment from '~/components/Pages/SalesReturn/SalesReturnPayment.vue'
useLegacyPage({ title: 'Sales Return List', sweetAlert: false })
const {
  pending,
  error,
  refresh,
  filteredReturns,
  searchQuery,
  filterPaymentStatus,
  editorOpen,
  editData,
  selectedReturn,
  paymentReturn,
  deleting,
  busy,
  actionError,
  message,
  add,
  edit,
  save,
  pay,
  remove,
  printTable,
} = useSalesReturns()
</script>
<template>
  <div class="dulank-page dulank-page-sales-return">
    <SalesListHeader
      title="Sales Return List"
      subtitle="Manage your Returns"
      add-label="Add New Sales Return"
      :refreshing="pending"
      @add="add"
      @refresh="refresh()"
      @print="printTable"
    />
    <SalesFeedback
      :pending="pending"
      skeleton="table"
      :skeleton-cols="9"
      :skeleton-rows="6"
      :error="error ? 'Unable to load sales returns.' : ''"
      :message="message"
      @retry="refresh()"
      @dismiss="message = ''"
    />
    <SalesReturnRecordsTable
      v-if="!pending && !error"
      v-model:search="searchQuery"
      v-model:payment-status="filterPaymentStatus"
      :items="filteredReturns"
      @view="selectedReturn = $event"
      @edit="edit"
      @payment="
        (item) => {
          actionError = ''
          paymentReturn = item
        }
      "
      @delete="
        (item) => {
          actionError = ''
          deleting = item
        }
      "
      @print="printTable"
    />
    <SalesReturnEditor
      :open="editorOpen"
      :record="editData"
      :busy="busy"
      :error="actionError"
      @close="!busy && (editorOpen = false)"
      @submit="save"
    />
    <SalesReturnDetails :record="selectedReturn" @close="selectedReturn = null" />
    <SalesReturnPayment
      :record="paymentReturn"
      :busy="busy"
      :error="actionError"
      @close="!busy && (paymentReturn = null)"
      @submit="pay"
    />
    <SalesConfirmDelete
      :open="!!deleting"
      :busy="busy"
      :error="actionError"
      @close="deleting = null"
      @confirm="remove"
    />
  </div>
</template>
