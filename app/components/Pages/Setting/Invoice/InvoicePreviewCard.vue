<script setup lang="ts">
import { computed } from 'vue'
import FeatherIcon from '~/components/Common/FeatherIcon.vue'
import type { InvoiceSetting } from '#server/types/invoice-setting'

const props = defineProps<{
  form: InvoiceSetting
  formattedInvoiceNumber: string
}>()

const previewIssueDate = computed(() => {
  const now = new Date()
  return now.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
})

const previewDueDate = computed(() => {
  const d = new Date()
  d.setDate(d.getDate() + (Number(props.form.dueDays) || 7))
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
})

const sampleItems = [
  { desc: 'Cetak Brosur A4 Full Color (1.000 Lembar)', qty: 1, price: 650000 },
  { desc: 'Roll Up Banner 60x160cm Albatros + Lamination', qty: 2, price: 185000 }
]

const previewSubtotal = computed(() => {
  return sampleItems.reduce((acc, it) => acc + it.qty * it.price, 0)
})

const previewTax = computed(() => {
  const pct = Number(props.form.taxPercentage) || 0
  return Math.round((previewSubtotal.value * pct) / 100)
})

const rawTotal = computed(() => previewSubtotal.value + previewTax.value)

const previewRoundOffAdjustment = computed(() => {
  if (!props.form.roundOffEnabled) return 0
  const total = rawTotal.value
  if (props.form.roundOffType === 'Round Off Up') {
    return Math.ceil(total / 1000) * 1000 - total
  } else if (props.form.roundOffType === 'Round Off Down') {
    return Math.floor(total / 1000) * 1000 - total
  } else if (props.form.roundOffType === 'Nearest 100') {
    return Math.round(total / 100) * 100 - total
  } else if (props.form.roundOffType === 'Nearest 1000') {
    return Math.round(total / 1000) * 1000 - total
  }
  return 0
})

const previewGrandTotal = computed(() => {
  return rawTotal.value + previewRoundOffAdjustment.value
})

function formatRupiah(val: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val)
}
</script>

<template>
  <div class="sticky top-6 space-y-4">
    <!-- Preview Banner Header -->
    <div class="flex items-center justify-between px-4 py-2.5 rounded-xl bg-gray-900 text-white shadow-md dark:bg-gray-800">
      <div class="flex items-center gap-2 text-xs font-bold">
        <span class="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
        <span>Live Invoice Preview</span>
      </div>
      <span class="text-[10px] uppercase font-semibold tracking-wider text-gray-300 bg-gray-800 dark:bg-gray-700 px-2 py-0.5 rounded">
        Auto-Update
      </span>
    </div>

    <!-- Document Preview Canvas -->
    <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-800 dark:bg-gray-900 text-gray-800 dark:text-gray-100 font-sans text-xs space-y-5 transition-all">
      <!-- Document Header -->
      <div class="flex items-start justify-between border-b pb-4 border-gray-100 dark:border-gray-800">
        <div>
          <div class="h-10 flex items-center mb-1">
            <img
              :src="form.logoUrl || '/assets/img/logo.png'"
              alt="Invoice Logo"
              class="max-h-9 object-contain"
            />
          </div>
          <h4 class="font-bold text-sm text-gray-900 dark:text-gray-100">{{ form.companyName || 'Nama Perusahaan' }}</h4>
          <div v-if="form.showCompanyDetails" class="text-[10px] text-gray-500 dark:text-gray-400 space-y-0.5 mt-1 max-w-[210px]">
            <p class="leading-relaxed">{{ form.companyAddress || '-' }}</p>
            <p>Telp: {{ form.companyPhone || '-' }}</p>
            <p>Email: {{ form.companyEmail || '-' }}</p>
          </div>
        </div>

        <div class="text-right">
          <span class="inline-block px-2.5 py-1 text-[11px] font-black uppercase tracking-wider bg-amber-500 text-white rounded">
            INVOICE
          </span>
          <div class="mt-2 font-mono font-bold text-gray-900 dark:text-gray-100 text-xs">
            #{{ formattedInvoiceNumber }}
          </div>
          <div class="text-[10px] text-gray-500 dark:text-gray-400 mt-1">
            <div>Tanggal: <span class="font-medium text-gray-700 dark:text-gray-300">{{ previewIssueDate }}</span></div>
            <div>Jatuh Tempo: <span class="font-semibold text-red-600 dark:text-red-400">{{ previewDueDate }}</span></div>
          </div>
        </div>
      </div>

      <!-- Greeting Header Terms -->
      <div v-if="form.headerTerms" class="p-2.5 rounded-lg bg-amber-50/60 dark:bg-amber-950/20 text-[11px] text-amber-900 dark:text-amber-200 italic border-l-2 border-amber-500">
        "{{ form.headerTerms }}"
      </div>

      <!-- Customer Info Mock -->
      <div class="p-2.5 rounded-lg bg-gray-50 dark:bg-gray-800/60 text-[11px] flex justify-between items-center">
        <div>
          <span class="text-gray-400 uppercase text-[9px] font-bold block">Ditagihkan Kepada:</span>
          <span class="font-bold text-gray-900 dark:text-gray-100">PT Kreasi Nusantara Mandiri</span>
          <span class="text-gray-500 block text-[10px]">Attn: Bpk. Budi Santoso</span>
        </div>
        <span class="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-medium">Menunggu Pelunasan</span>
      </div>

      <!-- Line Items Table -->
      <div class="border border-gray-100 dark:border-gray-800 rounded-lg overflow-hidden">
        <table class="w-full text-left border-collapse text-[11px]">
          <thead class="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 uppercase text-[9px] tracking-wider">
            <tr>
              <th class="py-2 px-3 font-semibold">Deskripsi Layanan</th>
              <th class="py-2 px-2 text-center font-semibold">Qty</th>
              <th class="py-2 px-2 text-right font-semibold">Harga</th>
              <th class="py-2 px-3 text-right font-semibold">Total</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <tr v-for="(it, idx) in sampleItems" :key="idx" class="hover:bg-gray-50/50 dark:hover:bg-gray-800/40">
              <td class="py-2 px-3 text-gray-800 dark:text-gray-200 font-medium">{{ it.desc }}</td>
              <td class="py-2 px-2 text-center text-gray-500">{{ it.qty }}</td>
              <td class="py-2 px-2 text-right text-gray-600 dark:text-gray-400">{{ formatRupiah(it.price) }}</td>
              <td class="py-2 px-3 text-right font-semibold text-gray-800 dark:text-gray-100">{{ formatRupiah(it.qty * it.price) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Calculation Summary -->
      <div class="space-y-1.5 pt-2 border-t border-gray-100 dark:border-gray-800 text-xs">
        <div class="flex justify-between text-gray-600 dark:text-gray-400">
          <span>Subtotal</span>
          <span class="font-medium text-gray-800 dark:text-gray-200">{{ formatRupiah(previewSubtotal) }}</span>
        </div>
        <div class="flex justify-between text-gray-600 dark:text-gray-400">
          <span>PPN ({{ form.taxPercentage || 0 }}%)</span>
          <span class="font-medium text-gray-800 dark:text-gray-200">{{ formatRupiah(previewTax) }}</span>
        </div>
        <div v-if="form.roundOffEnabled && previewRoundOffAdjustment !== 0" class="flex justify-between text-amber-600 dark:text-amber-400">
          <span>Pembulatan (Round Off)</span>
          <span class="font-medium">{{ previewRoundOffAdjustment > 0 ? '+' : '' }}{{ formatRupiah(previewRoundOffAdjustment) }}</span>
        </div>
        <div class="flex justify-between text-sm font-bold pt-2 border-t border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white">
          <span>Total Tagihan</span>
          <span class="text-amber-600 dark:text-amber-400 text-base font-black">{{ formatRupiah(previewGrandTotal) }}</span>
        </div>
      </div>

      <!-- Payment Info Box -->
      <div class="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/70 border border-gray-200/80 dark:border-gray-700/80 space-y-1">
        <div class="flex items-center gap-1.5 text-xs font-bold text-gray-800 dark:text-gray-200">
          <FeatherIcon name="info" size="13" class="text-amber-500" />
          <span>Instruksi Pembayaran:</span>
        </div>
        <div class="text-[11px] text-gray-600 dark:text-gray-300">
          <div>Bank: <strong class="text-gray-800 dark:text-gray-100">{{ form.bankDetails.bankName || 'BCA' }}</strong></div>
          <div>No. Rek: <strong class="font-mono text-gray-800 dark:text-gray-100">{{ form.bankDetails.accountNumber || '-' }}</strong></div>
          <div>Atas Nama: <strong class="text-gray-800 dark:text-gray-100">{{ form.bankDetails.accountHolder || '-' }}</strong></div>
        </div>
      </div>

      <!-- Footer Notes -->
      <div v-if="form.footerTerms" class="text-[10px] text-gray-400 dark:text-gray-400 text-center border-t pt-3 border-gray-100 dark:border-gray-800 leading-relaxed">
        {{ form.footerTerms }}
      </div>
    </div>
  </div>
</template>

