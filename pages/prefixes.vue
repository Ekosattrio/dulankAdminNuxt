<template>
  <div class="page-wrapper mt-3">
    <div class="content settings-content">
      <div class="page-header settings-pg-header">
        <div class="add-item d-flex">
          <div class="page-title">
            <h4>Settings</h4>
            <h6>Manage your settings on portal</h6>
          </div>
        </div>
        <ul class="table-top-head">
          <li>
            <a title="Refresh" href="javascript:void(0);" @click="refresh"><i class="ti ti-rotate"></i></a>
          </li>
          <li>
            <a title="Collapse" href="javascript:void(0);" @click="toggleCollapse"><i class="ti ti-chevron-up"></i></a>
          </li>
        </ul>
      </div>

      <div class="row">
        <div class="col-xl-12">
          <div class="settings-wrapper d-flex">
            <div class="settings-page-wrap w-100">
              <form @submit.prevent="savePrefixes">
                <div class="setting-title mb-4">
                  <h4 class="fs-18 fw-bold">Prefixes</h4>
                </div>

                <div class="bg-white p-4 rounded border shadow-sm mb-4">
                  <div class="row g-4">
                    <div v-for="(val, key) in prefixes" :key="key" class="col-xl-3 col-lg-4 col-md-6 col-sm-6">
                      <div class="mb-0">
                        <label class="form-label fw-semibold text-capitalize">{{ formatLabel(key) }}</label>
                        <input v-model="prefixes[key]" type="text" class="form-control" />
                      </div>
                    </div>
                  </div>
                </div>

                <div class="prefix-settings d-flex justify-content-end">
                  <button type="button" class="btn btn-secondary me-2" @click="resetPrefixes">Cancel</button>
                  <button type="submit" class="btn btn-warning text-white">Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

useHead({
  title: "Prefix Settings - Kacetak System",
});

const defaultPrefixes: Record<string, string> = {
  productSku: "SKU -",
  supplier: "SUP -",
  purchase: "PU -",
  purchaseReturn: "PR -",
  sales: "SA -",
  salesReturn: "SR -",
  customer: "CT -",
  expense: "EX -",
  stockTransfer: "ST -",
  stockAdjustment: "SA -",
  salesOrder: "SO -",
  posInvoice: "PINV -",
  estimation: "EST -",
  transaction: "TRN -",
  employee: "EMP -",
};

const prefixes = ref<Record<string, string>>({ ...defaultPrefixes });

const formatLabel = (key: string) => {
  switch (key) {
    case "productSku":
      return "Product (SKU)";
    case "supplier":
      return "Supplier";
    case "purchase":
      return "Purchase";
    case "purchaseReturn":
      return "Purchase Return";
    case "sales":
      return "Sales";
    case "salesReturn":
      return "Sales Return";
    case "customer":
      return "Customer";
    case "expense":
      return "Expense";
    case "stockTransfer":
      return "Stock Transfer";
    case "stockAdjustment":
      return "Stock Adjustment";
    case "salesOrder":
      return "Sales Order";
    case "posInvoice":
      return "POS Invoice";
    case "estimation":
      return "Estimation";
    case "transaction":
      return "Transaction";
    case "employee":
      return "Employee";
    default:
      return key;
  }
};

const savePrefixes = () => {
  alert("Transaction prefixes saved successfully!");
};

const resetPrefixes = () => {
  prefixes.value = { ...defaultPrefixes };
};

const refresh = () => {
  // refresh
};

const toggleCollapse = () => {
  // collapse
};
</script>
