<script setup lang="ts">
import type { POSCustomer } from '#server/types/pos'
const props = defineProps<{ open: boolean; customer: POSCustomer }>()
const emit = defineEmits<{ close: []; select: [customer: POSCustomer] }>()
const form = ref<POSCustomer>({ ...props.customer })
watch(
  () => props.open,
  (value) => {
    if (value) form.value = { ...props.customer }
  },
)
const field =
  'mt-1 block w-full rounded border border-gray-200 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800'
</script>
<template>
  <SalesDialog :open="open" title="Customer Information" @close="$emit('close')">
    <CustomerLiveSearch @select="emit('select', $event)" />
    <form class="mt-5 space-y-4" @submit.prevent="emit('select', { ...form })">
      <label class="block text-sm"
        >Customer Name *<input v-model="form.name" :class="field" required
      /></label>
      <label class="block text-sm">Phone<input v-model="form.phone" :class="field" /></label>
      <label class="block text-sm">Email<input v-model="form.email" :class="field" /></label>
      <label class="block text-sm">Address<textarea v-model="form.address" :class="field" /></label>
      <div class="flex justify-between gap-3">
        <NuxtLink to="/customers" class="text-sm text-primary underline">Manage Customers</NuxtLink
        ><button type="submit" class="rounded bg-primary px-4 py-2 text-sm font-semibold text-white">
          Use Customer
        </button>
      </div>
    </form>
  </SalesDialog>
</template>
