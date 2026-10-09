<script setup lang="ts">
import type { FooterConfig } from '#server/types/footer'
import FeatherIcon from '~/components/common/FeatherIcon.vue'

defineProps<{
  form: FooterConfig
}>()
</script>

<template>
  <div class="rounded-2xl border border-gray-200 bg-gray-50/70 p-6 shadow-inner dark:border-gray-800 dark:bg-gray-900/50 mt-8">
    <div class="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider mb-5">
      <FeatherIcon name="eye" size="14" />
      <span>Live Footer Preview (Tampilan Publik Toko)</span>
    </div>

    <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 text-xs">
        <!-- Col 1: Brand & Desc -->
        <div class="space-y-2 md:col-span-1">
          <h4 class="font-bold text-gray-900 dark:text-gray-100 text-sm">{{ form.judul || 'Nama Perusahaan' }}</h4>
          <p class="text-gray-500 dark:text-gray-400 text-xs leading-relaxed">
            {{ form.desc || 'Deskripsi perusahaan...' }}
          </p>
        </div>

        <!-- Col 2: Info Kami -->
        <div class="space-y-2">
          <h5 class="font-bold text-gray-900 dark:text-gray-100">Info Kami</h5>
          <ul class="space-y-1.5 text-gray-600 dark:text-gray-300 text-xs">
            <li v-for="(ql, i) in form.infoKami" :key="i">
              <a :href="ql.href" class="hover:text-primary transition">{{ ql.text }}</a>
            </li>
            <li v-if="form.infoKami.length === 0" class="text-gray-400 italic">Belum ada link</li>
          </ul>
        </div>

        <!-- Col 3: Panduan -->
        <div class="space-y-2">
          <h5 class="font-bold text-gray-900 dark:text-gray-100">Panduan Pelanggan</h5>
          <ul class="space-y-1.5 text-gray-600 dark:text-gray-300 text-xs">
            <li v-for="(pd, i) in form.panduan" :key="i">
              <a :href="pd.href" class="hover:text-primary transition">{{ pd.text }}</a>
            </li>
            <li v-if="form.panduan.length === 0" class="text-gray-400 italic">Belum ada link</li>
          </ul>
        </div>

        <!-- Col 4: Kontak & Socials -->
        <div class="space-y-2">
          <h5 class="font-bold text-gray-900 dark:text-gray-100">Kontak Kami</h5>
          <p v-if="form.alamat" class="text-gray-500 dark:text-gray-400 text-xs">{{ form.alamat }}</p>
          <p v-if="form.telepon" class="text-gray-600 dark:text-gray-300 text-xs font-medium">📞 {{ form.telepon }}</p>
          <p v-if="form.email" class="text-gray-600 dark:text-gray-300 text-xs font-medium">✉️ {{ form.email }}</p>

          <!-- Social links -->
          <div class="flex items-center gap-2 pt-2 text-gray-500">
            <a v-if="form.socials.facebook" :href="form.socials.facebook" target="_blank" class="hover:text-primary"><FeatherIcon name="facebook" size="14" /></a>
            <a v-if="form.socials.instagram" :href="form.socials.instagram" target="_blank" class="hover:text-primary"><FeatherIcon name="instagram" size="14" /></a>
            <a v-if="form.socials.twitter" :href="form.socials.twitter" target="_blank" class="hover:text-primary"><FeatherIcon name="twitter" size="14" /></a>
            <a v-if="form.socials.linkedin" :href="form.socials.linkedin" target="_blank" class="hover:text-primary"><FeatherIcon name="linkedin" size="14" /></a>
            <a v-if="form.socials.youtube" :href="form.socials.youtube" target="_blank" class="hover:text-primary"><FeatherIcon name="youtube" size="14" /></a>
          </div>
        </div>
      </div>

      <!-- Bottom Copyright -->
      <div class="mt-6 border-t border-gray-100 pt-4 text-center text-xs text-gray-400 dark:border-gray-700">
        {{ form.copyright }}
      </div>
    </div>
  </div>
</template>

