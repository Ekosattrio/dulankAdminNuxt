<script setup lang="ts">
import { computed } from 'vue'
import type { PosSetting } from '#server/types/pos-setting'

const props = defineProps<{
  form: PosSetting
}>()

const receiptSampleItems = [
  { name: 'Cetak Art Paper A3+', qty: 10, price: 6000, total: 60000 },
  { name: 'Finishing Jilid Spiral', qty: 2, price: 15000, total: 30000 },
  { name: 'Laminasi Doff A3+', qty: 10, price: 3000, total: 30000 }
]

const receiptSubtotal = computed(() => {
  return receiptSampleItems.reduce((acc, it) => acc + it.total, 0)
})

const receiptTax = computed(() => {
  return props.form.showTaxOnReceipt ? Math.round(receiptSubtotal.value * 0.11) : 0
})

const receiptTotal = computed(() => {
  return receiptSubtotal.value + receiptTax.value
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
        <span>Live Receipt Preview</span>
      </div>
      <span class="text-[10px] uppercase font-semibold tracking-wider text-emerald-400 bg-gray-800 dark:bg-gray-700 px-2.5 py-0.5 rounded">
        Format: {{ form.printerType }}
      </span>
    </div>

    <!-- Receipt Wrapper / Thermal Paper Simulation -->
    <div class="flex justify-center">
      <div
        class="rounded-xl border border-gray-300 bg-white p-5 shadow-2xl text-gray-900 font-mono transition-all overflow-hidden"
        :class="{
          'w-full max-w-[340px] text-xs': form.printerType === 'Thermal 80mm',
          'w-full max-w-[280px] text-[11px]': form.printerType === 'Thermal 58mm',
          'w-full max-w-[420px] text-xs': form.printerType === 'A4'
        }"
        style="background: #fafaf8; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.06);"
      >
        <!-- Receipt Header -->
        <div class="text-center space-y-1 pb-3 border-b border-dashed border-gray-400">
          <div class="font-black text-sm uppercase tracking-wide">
            {{ form.defaultWarehouseName || 'KACETAK SYSTEM' }}
          </div>
          <div class="text-[10px] text-gray-600 leading-tight">
            Jl. Percetakan Negara No. 88, Jakarta Pusat<br />
            Telp: +62 21 4256 7890
          </div>
          <div v-if="form.receiptHeaderNotes" class="text-[10px] font-bold text-gray-700 pt-1 tracking-wider uppercase">
            *** {{ form.receiptHeaderNotes }} ***
          </div>
        </div>

        <!-- Receipt Metadata -->
        <div class="py-2.5 border-b border-dashed border-gray-400 text-[10px] space-y-0.5">
          <div class="flex justify-between">
            <span>No: #POS-202610-0082</span>
            <span>{{ new Date().toLocaleDateString('id-ID') }}</span>
          </div>
          <div v-if="form.showCashierName" class="flex justify-between">
            <span>Kasir: Thomas (Register 01)</span>
            <span>{{ new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) }}</span>
          </div>
          <div v-if="form.showCustomerDetails" class="flex justify-between">
            <span>Pelanggan:</span>
            <span class="font-semibold">{{ form.defaultCustomerName || 'Pelanggan Umum' }}</span>
          </div>
        </div>

        <!-- Itemized Table -->
        <div class="py-3 border-b border-dashed border-gray-400 space-y-2">
          <div v-for="(it, idx) in receiptSampleItems" :key="idx" class="space-y-0.5">
            <div class="font-bold truncate">{{ it.name }}</div>
            <div class="flex justify-between text-[11px] text-gray-700">
              <span>{{ it.qty }} x {{ formatRupiah(it.price) }}</span>
              <span class="font-semibold">{{ formatRupiah(it.total) }}</span>
            </div>
          </div>
        </div>

        <!-- Total Calculation -->
        <div class="py-2.5 border-b border-dashed border-gray-400 space-y-1 text-[11px]">
          <div class="flex justify-between">
            <span>SUBTOTAL:</span>
            <span>{{ formatRupiah(receiptSubtotal) }}</span>
          </div>
          <div v-if="form.showTaxOnReceipt" class="flex justify-between">
            <span>PPN 11%:</span>
            <span>{{ formatRupiah(receiptTax) }}</span>
          </div>
          <div class="flex justify-between font-black text-sm pt-1 border-t border-dotted border-gray-400">
            <span>TOTAL:</span>
            <span>{{ formatRupiah(receiptTotal) }}</span>
          </div>
          <div class="flex justify-between text-gray-700 pt-0.5">
            <span>BAYAR (TUNAI):</span>
            <span>Rp 150.000</span>
          </div>
          <div class="flex justify-between text-gray-700">
            <span>KEMBALIAN:</span>
            <span>{{ formatRupiah(150000 - receiptTotal) }}</span>
          </div>
        </div>

        <!-- Payment Methods Info -->
        <div class="py-2 text-[10px] text-gray-500 border-b border-dashed border-gray-400">
          <div class="text-[9px] font-bold uppercase text-gray-400">Metode Tersedia:</div>
          <div class="flex flex-wrap gap-1 mt-0.5">
            <span
              v-for="pm in form.allowedPaymentMethods"
              :key="pm"
              class="px-1.5 py-0.5 rounded bg-gray-200 text-gray-700 font-semibold text-[9px]"
            >
              {{ pm }}
            </span>
          </div>
        </div>

        <!-- Footer Message / Barcode Simulation -->
        <div class="text-center pt-3 space-y-2">
          <p v-if="form.receiptFooterNotes" class="text-[10px] text-gray-600 leading-snug">
            {{ form.receiptFooterNotes }}
          </p>

          <div class="pt-1 flex flex-col items-center">
            <div class="flex items-center justify-center gap-[2px] h-8 w-44">
              <span class="h-full w-[2px] bg-black"></span>
              <span class="h-full w-[1px] bg-black"></span>
              <span class="h-full w-[3px] bg-black"></span>
              <span class="h-full w-[1px] bg-black"></span>
              <span class="h-full w-[2px] bg-black"></span>
              <span class="h-full w-[4px] bg-black"></span>
              <span class="h-full w-[1px] bg-black"></span>
              <span class="h-full w-[2px] bg-black"></span>
              <span class="h-full w-[3px] bg-black"></span>
              <span class="h-full w-[1px] bg-black"></span>
              <span class="h-full w-[2px] bg-black"></span>
              <span class="h-full w-[1px] bg-black"></span>
              <span class="h-full w-[4px] bg-black"></span>
              <span class="h-full w-[2px] bg-black"></span>
              <span class="h-full w-[1px] bg-black"></span>
              <span class="h-full w-[3px] bg-black"></span>
              <span class="h-full w-[2px] bg-black"></span>
              <span class="h-full w-[1px] bg-black"></span>
            </div>
            <span class="text-[9px] tracking-widest text-gray-600 mt-0.5">POS-202610-0082</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

