<script setup lang="ts">
defineProps<{ delivery?: boolean }>()
</script>
<template>
  <div
    class="mb-6 flex flex-wrap items-start justify-between gap-5 border-b border-gray-200 pb-5 dark:border-gray-700"
  >
    <div
      class="flex h-28 w-44 shrink-0 items-center justify-center border border-gray-200 text-sm font-semibold text-gray-700 dark:border-gray-700 dark:text-gray-300"
    >
      Logo
    </div>
    <div class="text-xs leading-6 text-gray-600 dark:text-gray-400">
      <h3 :class="delivery ? 'text-base font-semibold' : 'text-xl'" class="text-gray-800 dark:text-gray-100">
        PT. DULANK SEMESTA CIDA
      </h3>
      <p>Jl. Arif Rahman Hakim / Niaga (depan stasiun) Karawang</p>
      <p>Kel. Nagasari Kec.Karawang Barat Kab. Karawang Jawa Barat</p>
      <p>ptdulanksemestacida@gmail.com</p>
      <template v-if="delivery"
        ><p>Website : www.percetakan-dulank.com</p>
        <p>WhatsApp : 0877 8813 1400</p></template
      >
    </div>
  </div>
</template>
