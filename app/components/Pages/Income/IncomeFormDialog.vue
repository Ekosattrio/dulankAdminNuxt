<script setup lang="ts">
import type { IncomeRecord, IncomeFormData } from '#server/types/income'
import { formControlClass, modalFormInputColClass, modalFormLabelClass, modalFormRowClass, salesPrimaryButton, salesSecondaryButton } from '~/utils/salesUi'

const props = defineProps<{
  open: boolean
  item: IncomeRecord | null
  categories: { label: string; value: string }[]
  bankAccounts: { label: string; value: string }[]
  busy?: boolean
}>()

const emit = defineEmits<{ close: []; submit: [payload: IncomeFormData] }>()

const PAYMENT_METHODS = ['Cash', 'Bank Transfer', 'Debit Card', 'E-Wallet', 'QRIS']

const form = reactive<IncomeFormData>({
  date: new Date().toISOString().slice(0, 10),
  name: '',
  category: '',
  notes: '',
  amount: 0,
  paymentMethod: 'Cash',
  bankAccountId: '',
})

const errorMessage = ref('')

watch(
  () => [props.open, props.item] as const,
  ([open, item]) => {
    if (!open) return
    Object.assign(form, item
      ? {
          id: item.id,
          date: item.date,
          name: item.name,
          category: item.category,
          notes: item.notes,
          amount: item.amount,
          paymentMethod: item.paymentMethod ?? 'Cash',
          bankAccountId: item.bankAccountId ?? '',
        }
      : {
          id: undefined,
          date: new Date().toISOString().slice(0, 10),
          name: '',
          category: '',
          notes: '',
          amount: 0,
          paymentMethod: 'Cash',
          bankAccountId: '',
        })
    errorMessage.value = ''
  },
  { immediate: true },
)

function submit() {
  if (!form.name.trim()) return void (errorMessage.value = 'Nama pendapatan wajib diisi')
  if (!form.amount || form.amount <= 0) return void (errorMessage.value = 'Nominal wajib lebih dari 0')
  errorMessage.value = ''
  emit('submit', { ...form, id: props.item?.id, name: form.name.trim() })
}
</script>

<template>
  <SalesDialog :open="open" :title="item ? 'Edit Income' : 'Add Income'" :busy="busy" @close="emit('close')">
    <form class="space-y-4" @submit.prevent="submit">
      <p v-if="errorMessage" role="alert" class="rounded-md bg-rose-50 p-3 text-sm text-rose-700 dark:bg-rose-950/30 dark:text-rose-300">{{ errorMessage }}</p>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Tanggal</label>
        <div :class="modalFormInputColClass"><input v-model="form.date" :class="formControlClass" type="date" /></div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Nama Pendapatan<span class="ml-1 text-rose-600">*</span></label>
        <div :class="modalFormInputColClass"><input v-model="form.name" :class="formControlClass" placeholder="mis. Penjualan Tunai" required /></div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Kategori</label>
        <div :class="modalFormInputColClass">
          <select v-model="form.category" :class="formControlClass">
            <option value="">Tanpa Kategori</option>
            <option v-for="category in categories" :key="category.value" :value="category.value">{{ category.label }}</option>
          </select>
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Nominal (Rp)<span class="ml-1 text-rose-600">*</span></label>
        <div :class="modalFormInputColClass"><input v-model.number="form.amount" :class="formControlClass" type="number" min="1" required /></div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Metode Pembayaran</label>
        <div :class="modalFormInputColClass">
          <select v-model="form.paymentMethod" :class="formControlClass">
            <option v-for="method in PAYMENT_METHODS" :key="method" :value="method">{{ method }}</option>
          </select>
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Rekening Bank</label>
        <div :class="modalFormInputColClass">
          <select v-model="form.bankAccountId" :class="formControlClass">
            <option value="">Tanpa Rekening</option>
            <option v-for="account in bankAccounts" :key="account.value" :value="account.value">{{ account.label }}</option>
          </select>
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Catatan</label>
        <div :class="modalFormInputColClass"><textarea v-model="form.notes" :class="formControlClass" rows="3" placeholder="Catatan pendapatan" /></div>
      </div>

      <div class="flex flex-wrap justify-end gap-2 border-t border-gray-100 pt-4 dark:border-gray-800">
        <button type="button" :class="salesSecondaryButton" :disabled="busy" @click="emit('close')">Cancel</button>
        <button type="submit" :class="salesPrimaryButton" :disabled="busy">{{ busy ? 'Saving...' : 'Submit' }}</button>
      </div>
    </form>
  </SalesDialog>
</template>