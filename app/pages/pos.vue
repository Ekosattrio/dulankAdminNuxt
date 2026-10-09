<script setup lang="ts">
definePageMeta({ layout: 'pos' })
useLegacyPage({ title: 'POS', sweetAlert: false })
const pos = reactive(usePos())
</script>

<template>
  <div
    class="dulank-page dulank-page-pos flex min-h-dvh flex-col bg-gray-100 dark:bg-gray-950 lg:h-dvh lg:overflow-hidden"
  >
    <PosNavigation
      :held-count="pos.holdOrders.length"
      @orders="pos.ordersModalOpen = true"
      @reset="pos.clearCart"
      @transactions="() => { pos.refreshSales(); pos.transactionsModalOpen = true }"
    />
    <SalesFeedback
      :pending="false"
      :error="pos.error ? 'Unable to load products.' : pos.actionError"
      @retry="pos.refresh()"
    />
    <div class="flex min-h-0 flex-1 flex-col lg:flex-row">
      <PosProductCatalog
        v-model:category="pos.selectedCategory"
        v-model:search="pos.productSearchQuery"
        :categories="pos.categories"
        :filtered-products="pos.filteredProducts"
        :pending="pos.pending"
        @add="pos.addToCart"
      />
      <PosOrderSummary
        :cart="pos.cart"
        :customer="pos.customer"
        :discount-amount="pos.discountAmount"
        :shipping-cost="pos.shippingCost"
        :tax-rate="pos.taxRate"
        :subtotal="pos.subtotal"
        :tax-amount="pos.taxAmount"
        :total-payable="pos.totalPayable"
        @customer="pos.addCustomerModalOpen = true"
        @clear="pos.clearCart"
        @hold="pos.holdModalOpen = true"
        @tax="pos.taxModalOpen = true"
        @shipping="pos.shippingModalOpen = true"
        @discount="pos.discountModalOpen = true"
        @payment="pos.openPaymentModal"
        @quantity="pos.updateQty"
        @set-quantity="pos.setQty"
        @edit="pos.openEditItem"
        @remove="pos.removeCartItem"
      />
    </div>
    <PosOrderAdjustments
      v-model:tax-open="pos.taxModalOpen"
      v-model:shipping-open="pos.shippingModalOpen"
      v-model:discount-open="pos.discountModalOpen"
      v-model:tax="pos.taxRate"
      v-model:shipping="pos.shippingCost"
      v-model:discount="pos.discountAmount"
    />
    <PosHeldOrders
      v-model:hold-open="pos.holdModalOpen"
      v-model:orders-open="pos.ordersModalOpen"
      v-model:reference="pos.holdReference"
      :hold-orders="pos.holdOrders"
      :total-payable="pos.totalPayable"
      @hold="pos.confirmHold"
      @resume="pos.restoreHold"
    />
    <PosPaymentCheckout
      v-model:open="pos.paymentModalOpen"
      v-model:method="pos.paymentMethod"
      v-model:received="pos.cashReceived"
      :total-payable="pos.totalPayable"
      :change-due="pos.changeDue"
      :busy="pos.busy"
      :error="pos.actionError"
      @pay="pos.completePayment"
    />
    <PosReceiptPreview
      v-model:open="pos.receiptModalOpen"
      :receipt="pos.receipt"
      @new-sale="pos.resetAll"
      @print="pos.printThermalReceipt"
    />
    <PosCustomerPicker
      :open="pos.addCustomerModalOpen"
      :customer="pos.customer"
      @close="pos.addCustomerModalOpen = false"
      @select="pos.selectCustomer"
    />
    <PosCartItemEditor
      :open="pos.editItemModalOpen"
      :item="pos.editingItem"
      @close="pos.editItemModalOpen = false"
      @save="pos.saveEditingItem"
    />
    <PosRecentTransactions
      :open="pos.transactionsModalOpen"
      :sales="pos.sales"
      @close="pos.transactionsModalOpen = false"
    />
  </div>
</template>
