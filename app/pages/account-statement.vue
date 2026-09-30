<template>
  <div class="content">
    <div class="page-header">
      <div class="add-item d-flex">
        <div class="page-title">
          <h4>Account Statement</h4>
          <h6>Manage your financial transaction account statements</h6>
        </div>
      </div>
      <ul class="table-top-head">
        <li>
          <a data-bs-toggle="tooltip" data-bs-placement="top" title="Pdf" @click.prevent="printStatement">
            <img src="/assets/img/icons/pdf.svg" alt="img" />
          </a>
        </li>
        <li>
          <a data-bs-toggle="tooltip" data-bs-placement="top" title="Print" @click.prevent="printStatement">
            <i class="feather-printer"></i>
          </a>
        </li>
        <li>
          <a data-bs-toggle="tooltip" data-bs-placement="top" title="Collapse" id="collapse-header" @click.prevent="toggleHeader">
            <i class="feather-chevron-up"></i>
          </a>
        </li>
      </ul>
    </div>

    <!-- Table Card -->
    <div class="card table-list-card">
      <div class="card-body">
        <div class="table-top d-flex align-items-center justify-content-between flex-wrap gap-2">
          <div class="search-set d-block d-md-flex align-items-center gap-2">
            <div class="search-input">
              <input v-model="searchQuery" type="text" placeholder="Search transaction..." class="form-control form-control-sm" />
            </div>
            <div class="account-select">
              <select class="form-select form-select-sm" v-model="selectedAccount">
                <option value="">All Accounts</option>
                <option value="zephyria">Zephyria</option>
                <option value="linda">Linda</option>
                <option value="eko">Eko</option>
              </select>
            </div>
          </div>
        </div>

        <div class="table-responsive">
          <table class="table datanew list">
            <thead>
              <tr>
                <th style="width: 50px">No</th>
                <th>Date</th>
                <th>Category</th>
                <th>Description</th>
                <th class="text-end">Amount (IDR)</th>
                <th class="text-center">Transaction Type</th>
                <th class="text-end">Running Balance (IDR)</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, idx) in filteredTransactions" :key="item.id">
                <td>{{ idx + 1 }}</td>
                <td>{{ item.date }}</td>
                <td>
                  <span class="badge bg-light text-dark border">{{ item.category }}</span>
                </td>
                <td class="fw-semibold">{{ item.description }}</td>
                <td class="text-end fw-bold">{{ formatNumber(item.amount) }}</td>
                <td class="text-center">
                  <span class="badge" :class="item.type === 'Credit' ? 'bg-outline-success' : 'bg-outline-danger'">
                    {{ item.type }}
                  </span>
                </td>
                <td class="text-end fw-bold text-primary">{{ formatNumber(item.balance) }}</td>
              </tr>
              <tr v-if="filteredTransactions.length === 0">
                <td colspan="7" class="text-center py-4 text-muted">No transactions found.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { formatNumber } from "~/composables/useFormatters";

const { data: accountStatementData } = await useFetch<any[]>('/api/account-statement')
const transactions = ref(accountStatementData.value ?? []);

const searchQuery = ref("");
const selectedAccount = ref("");

const filteredTransactions = computed(() => {
  return transactions.value.filter((t) => {
    const q = searchQuery.value.toLowerCase();
    const matchesSearch = !q || t.category.toLowerCase().includes(q) || t.description.toLowerCase().includes(q);

    const matchesAccount = !selectedAccount.value || t.account === selectedAccount.value;
    return matchesSearch && matchesAccount;
  });
});

const printStatement = () => {
  window.print();
};

const toggleHeader = () => {
  // toggle
};
</script>

useMockSync('account-statement', transactions);
