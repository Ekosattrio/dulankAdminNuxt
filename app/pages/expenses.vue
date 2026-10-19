<script setup lang="ts">
import ExpenseWorkspace from '~/components/Pages/Expense/ExpenseWorkspace.vue'

useLegacyPage({ title: 'Expenses - Pengeluaran Keuangan', sweetAlert: false })
</script>

<template>
  <div class="dulank-page dulank-page-expenses"><ExpenseWorkspace /></div>
</template>