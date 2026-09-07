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

const transactions = ref([
  {
    id: 1,
    account: "zephyria",
    date: "01/12/25",
    category: "Sale",
    description: "Pelunasan Cetak Brosur (Invoice #001)",
    amount: 2500000,
    type: "Credit",
    balance: 18250000,
  },
  {
    id: 2,
    account: "zephyria",
    date: "03/12/25",
    category: "Purchase",
    description: "Pembelian Kertas Art Paper 230gr",
    amount: 4200000,
    type: "Debit",
    balance: 14050000,
  },
  {
    id: 3,
    account: "eko",
    date: "05/12/25",
    category: "Expense",
    description: "Pembayaran Listrik Workshop",
    amount: 1200000,
    type: "Debit",
    balance: 12850000,
  },
  {
    id: 4,
    account: "linda",
    date: "08/12/25",
    category: "Sale",
    description: "DP Cetak Banner Pilkada",
    amount: 5000000,
    type: "Credit",
    balance: 17850000,
  },
  {
    id: 5,
    account: "zephyria",
    date: "10/12/25",
    category: "Sales Refund",
    description: "Refund Salah Ukuran Cetak (Ref #002)",
    amount: 500000,
    type: "Debit",
    balance: 17350000,
  },
  {
    id: 6,
    account: "eko",
    date: "12/12/25",
    category: "Expense",
    description: "Service Mesin Plotter Utama",
    amount: 850000,
    type: "Debit",
    balance: 16500000,
  },
  {
    id: 7,
    account: "linda",
    date: "15/12/25",
    category: "Purchase Refund",
    description: "Retur Tinta Kadaluarsa",
    amount: 750000,
    type: "Credit",
    balance: 17250000,
  },
  {
    id: 8,
    account: "zephyria",
    date: "18/12/25",
    category: "Sale",
    description: "Cetak Kartu Nama 10 Box",
    amount: 450000,
    type: "Credit",
    balance: 17700000,
  },
  {
    id: 9,
    account: "eko",
    date: "20/12/25",
    category: "Expense",
    description: "Pembelian Alat Tulis Kantor (ATK)",
    amount: 150000,
    type: "Debit",
    balance: 17550000,
  },
  {
    id: 10,
    account: "zephyria",
    date: "24/12/25",
    category: "Purchase",
    description: "Pembelian Tinta CMYK 4 Set",
    amount: 3200000,
    type: "Debit",
    balance: 14350000,
  },
]);

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
