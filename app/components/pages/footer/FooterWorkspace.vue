<script setup lang="ts">
import { ref, watch } from 'vue'
import type { FooterConfig } from '#server/types/footer'
import { useFooterConfig } from '~/composables/useFooterConfig'
import FooterLinksSection from '~/components/pages/footer/FooterLinksSection.vue'
import FooterContactSection from '~/components/pages/footer/FooterContactSection.vue'
import FooterSocialsSection from '~/components/pages/footer/FooterSocialsSection.vue'
import FooterLivePreview from '~/components/pages/footer/FooterLivePreview.vue'
import FeatherIcon from '~/components/common/FeatherIcon.vue'

const { config, pending, error, refresh, saveConfig } = useFooterConfig()

const form = ref<FooterConfig>({
  judul: '',
  desc: '',
  copyright: '',
  infoKami: [],
  panduan: [],
  alamat: '',
  telepon: '',
  email: '',
  socials: {
    facebook: '',
    instagram: '',
    twitter: '',
    linkedin: '',
    youtube: '',
  },
})

// Sync with fetched data
watch(
  config,
  (val) => {
    if (val) {
      form.value = {
        judul: val.judul || '',
        desc: val.desc || '',
        copyright: val.copyright || `© ${new Date().getFullYear()} Nama Perusahaan — Semua hak dilindungi`,
        infoKami: val.infoKami ? JSON.parse(JSON.stringify(val.infoKami)) : [],
        panduan: val.panduan ? JSON.parse(JSON.stringify(val.panduan)) : [],
        alamat: val.alamat || '',
        telepon: val.telepon || '',
        email: val.email || '',
        socials: {
          facebook: val.socials?.facebook || '',
          instagram: val.socials?.instagram || '',
          twitter: val.socials?.twitter || '',
          linkedin: val.socials?.linkedin || '',
          youtube: val.socials?.youtube || '',
        },
      }
    }
  },
  { immediate: true },
)

const isBusy = ref(false)
const toastMessage = ref('')

function showToast(msg: string) {
  toastMessage.value = msg
  setTimeout(() => {
    toastMessage.value = ''
  }, 3500)
}

function handleAddInfoKami(item: { text: string; href: string }) {
  form.value.infoKami.push(item)
}

function handleRemoveInfoKami(idx: number) {
  form.value.infoKami.splice(idx, 1)
}

function handleAddPanduan(item: { text: string; href: string }) {
  form.value.panduan.push(item)
}

function handleRemovePanduan(idx: number) {
  form.value.panduan.splice(idx, 1)
}

async function handleSave() {
  isBusy.value = true
  try {
    const res = await saveConfig(form.value)
    showToast(res?.message || 'Pengaturan footer berhasil disimpan')
  } catch (err: any) {
    showToast(err?.data?.message || err?.message || 'Gagal menyimpan pengaturan footer')
  } finally {
    isBusy.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Toast Notification -->
    <div
      v-if="toastMessage"
      class="fixed top-5 right-5 z-50 flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-3 text-xs font-semibold text-white shadow-xl transition-all"
    >
      <FeatherIcon name="check-circle" size="16" />
      <span>{{ toastMessage }}</span>
    </div>

    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h3 class="text-xl font-bold text-gray-900 dark:text-gray-100">Footer</h3>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Konfigurasi konten, navigasi tautan, dan kontak footer website</p>
      </div>

      <div class="flex items-center gap-2">
        <button
          type="button"
          class="inline-flex h-9 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 transition"
          :disabled="isBusy"
          @click="refresh"
        >
          <FeatherIcon name="refresh-cw" size="13" />
          <span>Reset Form</span>
        </button>
        <button
          type="button"
          class="inline-flex h-9 items-center gap-1.5 rounded-lg bg-emerald-600 px-5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50 transition"
          :disabled="isBusy"
          @click="handleSave"
        >
          <FeatherIcon name="save" size="14" />
          <span>Save Footer</span>
        </button>
      </div>
    </div>

    <!-- Skeleton Loader when fetching config -->
    <div v-if="pending" class="space-y-6">
      <div
        v-for="i in 4"
        :key="`footer-skel-${i}`"
        class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 animate-pulse space-y-4"
      >
        <div class="h-4 w-36 rounded bg-gray-200 dark:bg-gray-800" />
        <div class="h-9 w-full rounded-xl bg-gray-200 dark:bg-gray-800" />
        <div class="h-16 w-full rounded-xl bg-gray-200 dark:bg-gray-800" />
      </div>
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-xs text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400"
    >
      <p class="font-semibold mb-2">{{ error ? (error.message || 'Gagal memuat pengaturan footer') : '' }}</p>
      <button
        type="button"
        class="rounded-md bg-red-600 px-3 py-1.5 text-xs text-white hover:bg-red-700"
        @click="refresh"
      >
        Coba Lagi
      </button>
    </div>

    <!-- Form Sections -->
    <div v-else class="space-y-6">
      <!-- 1. Konten Utama -->
      <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <h5 class="text-sm font-bold text-gray-900 dark:text-gray-100 mb-4 pb-2 border-b border-gray-100 dark:border-gray-800">
          Konten Utama
        </h5>

        <div class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Judul</label>
            <input
              v-model="form.judul"
              type="text"
              placeholder="Judul"
              class="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs font-medium text-gray-800 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Teks singkat (deskripsi)</label>
            <textarea
              v-model="form.desc"
              rows="3"
              placeholder="Deskripsi perusahaan atau tagline"
              class="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs font-medium text-gray-800 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            ></textarea>
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Copyright</label>
            <input
              v-model="form.copyright"
              type="text"
              placeholder="© 2026 Nama Perusahaan — Semua hak dilindungi"
              class="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs font-medium text-gray-800 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            />
          </div>
        </div>
      </div>

      <!-- 2. Info Kami (Quick Links) -->
      <FooterLinksSection
        title="Info Kami"
        subtitle="Tambahkan link yang sering tampil di footer. Urutan akan mengikuti daftar."
        placeholder-text="Judul link (mis. Tentang Kami)"
        :items="form.infoKami"
        @add="handleAddInfoKami"
        @remove="handleRemoveInfoKami"
        @error="showToast"
      />

      <!-- 3. Panduan Pelanggan Baru -->
      <FooterLinksSection
        title="Panduan Pelanggan Baru"
        subtitle="Tambahkan link panduan atau manual untuk pelanggan baru."
        placeholder-text="Judul panduan (mis. Cara Pembelian)"
        :items="form.panduan"
        @add="handleAddPanduan"
        @remove="handleRemovePanduan"
        @error="showToast"
      />

      <!-- 4. Kontak & Alamat -->
      <FooterContactSection :form="form" />

      <!-- 5. Social Media -->
      <FooterSocialsSection :socials="form.socials" />

      <!-- Save Button Footer -->
      <div class="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          class="inline-flex h-10 items-center gap-2 rounded-xl bg-emerald-600 px-7 text-xs font-bold text-white shadow-md hover:bg-emerald-700 disabled:opacity-50 transition"
          :disabled="isBusy"
          @click="handleSave"
        >
          <FeatherIcon name="save" size="15" />
          <span>Save</span>
        </button>
      </div>

      <!-- Live Footer Preview Component -->
      <FooterLivePreview :form="form" />
    </div>
  </div>
</template>
