<script setup lang="ts">
import { ref, watch } from 'vue'
import type { FooterConfig } from '#server/types/footer'
import { useFooterConfig } from '~/composables/useFooterConfig'
import FeatherIcon from '~/components/Common/FeatherIcon.vue'

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

// Add New Quick Link state
const newQlText = ref('')
const newQlHref = ref('')

function addInfoKami() {
  if (!newQlText.value.trim() || !newQlHref.value.trim()) {
    showToast('Isi judul dan URL quick link.')
    return
  }
  form.value.infoKami.push({
    text: newQlText.value.trim(),
    href: newQlHref.value.trim(),
  })
  newQlText.value = ''
  newQlHref.value = ''
}

function removeInfoKami(idx: number) {
  form.value.infoKami.splice(idx, 1)
}

// Add New Guide state
const newPdText = ref('')
const newPdHref = ref('')

function addPanduan() {
  if (!newPdText.value.trim() || !newPdHref.value.trim()) {
    showToast('Isi judul dan URL panduan.')
    return
  }
  form.value.panduan.push({
    text: newPdText.value.trim(),
    href: newPdHref.value.trim(),
  })
  newPdText.value = ''
  newPdHref.value = ''
}

function removePanduan(idx: number) {
  form.value.panduan.splice(idx, 1)
}

// Save action
const isBusy = ref(false)
const toastMessage = ref('')

function showToast(msg: string) {
  toastMessage.value = msg
  setTimeout(() => {
    toastMessage.value = ''
  }, 3500)
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
          @click="refresh()"
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
        @click="refresh()"
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
      <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <h5 class="text-sm font-bold text-gray-900 dark:text-gray-100 mb-1">
          Info Kami
        </h5>
        <p class="text-xs text-gray-500 dark:text-gray-400 mb-4 pb-2 border-b border-gray-100 dark:border-gray-800">
          Tambahkan link yang sering tampil di footer. Urutan akan mengikuti daftar.
        </p>

        <!-- Dynamic List -->
        <div class="space-y-2 mb-3">
          <div
            v-for="(ql, idx) in form.infoKami"
            :key="idx"
            class="flex items-center gap-2"
          >
            <input
              v-model="ql.text"
              type="text"
              placeholder="Judul link"
              class="flex-1 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-800 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            />
            <input
              v-model="ql.href"
              type="text"
              placeholder="URL (https://...)"
              class="flex-1 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-800 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            />
            <button
              type="button"
              class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-400 transition"
              title="Hapus"
              @click="removeInfoKami(idx)"
            >
              <FeatherIcon name="trash-2" size="14" />
            </button>
          </div>
        </div>

        <!-- Add New Row -->
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-2 border-t border-dashed border-gray-200 dark:border-gray-800">
          <input
            v-model="newQlText"
            type="text"
            placeholder="Judul link (mis. Tentang Kami)"
            class="flex-1 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-800 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            @keyup.enter="addInfoKami"
          />
          <input
            v-model="newQlHref"
            type="text"
            placeholder="URL (https://...)"
            class="flex-1 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-800 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            @keyup.enter="addInfoKami"
          />
          <button
            type="button"
            class="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg bg-primary px-4 text-xs font-semibold text-white shadow-sm hover:bg-primary/90 transition"
            @click="addInfoKami"
          >
            <FeatherIcon name="plus" size="14" />
            <span>Tambah</span>
          </button>
        </div>
      </div>

      <!-- 3. Panduan Pelanggan Baru -->
      <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <h5 class="text-sm font-bold text-gray-900 dark:text-gray-100 mb-1">
          Panduan Pelanggan Baru
        </h5>
        <p class="text-xs text-gray-500 dark:text-gray-400 mb-4 pb-2 border-b border-gray-100 dark:border-gray-800">
          Tambahkan link panduan atau manual untuk pelanggan baru.
        </p>

        <!-- Dynamic List -->
        <div class="space-y-2 mb-3">
          <div
            v-for="(pd, idx) in form.panduan"
            :key="idx"
            class="flex items-center gap-2"
          >
            <input
              v-model="pd.text"
              type="text"
              placeholder="Judul panduan"
              class="flex-1 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-800 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            />
            <input
              v-model="pd.href"
              type="text"
              placeholder="URL (https://...)"
              class="flex-1 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-800 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            />
            <button
              type="button"
              class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-400 transition"
              title="Hapus"
              @click="removePanduan(idx)"
            >
              <FeatherIcon name="trash-2" size="14" />
            </button>
          </div>
        </div>

        <!-- Add New Row -->
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-2 border-t border-dashed border-gray-200 dark:border-gray-800">
          <input
            v-model="newPdText"
            type="text"
            placeholder="Judul panduan (mis. Cara Pembelian)"
            class="flex-1 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-800 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            @keyup.enter="addPanduan"
          />
          <input
            v-model="newPdHref"
            type="text"
            placeholder="URL (https://...)"
            class="flex-1 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-800 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            @keyup.enter="addPanduan"
          />
          <button
            type="button"
            class="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg bg-primary px-4 text-xs font-semibold text-white shadow-sm hover:bg-primary/90 transition"
            @click="addPanduan"
          >
            <FeatherIcon name="plus" size="14" />
            <span>Tambah</span>
          </button>
        </div>
      </div>

      <!-- 4. Kontak & Alamat -->
      <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <h5 class="text-sm font-bold text-gray-900 dark:text-gray-100 mb-4 pb-2 border-b border-gray-100 dark:border-gray-800">
          Kontak & Alamat
        </h5>

        <div class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Alamat</label>
            <textarea
              v-model="form.alamat"
              rows="2"
              placeholder="Alamat kantor / workshop..."
              class="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs font-medium text-gray-800 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            ></textarea>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Telepon</label>
              <input
                v-model="form.telepon"
                type="text"
                placeholder="+62 21 ..."
                class="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs font-medium text-gray-800 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              />
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
              <input
                v-model="form.email"
                type="text"
                placeholder="info@..."
                class="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs font-medium text-gray-800 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- 5. Social Media -->
      <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <h5 class="text-sm font-bold text-gray-900 dark:text-gray-100 mb-1">
          Social Media
        </h5>
        <p class="text-xs text-gray-500 dark:text-gray-400 mb-4 pb-2 border-b border-gray-100 dark:border-gray-800">
          Masukan URL lengkap (https://...)
        </p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Facebook</label>
            <input
              v-model="form.socials.facebook"
              type="url"
              placeholder="https://facebook.com/..."
              class="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs font-medium text-gray-800 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Instagram</label>
            <input
              v-model="form.socials.instagram"
              type="url"
              placeholder="https://instagram.com/..."
              class="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs font-medium text-gray-800 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Twitter / X</label>
            <input
              v-model="form.socials.twitter"
              type="url"
              placeholder="https://twitter.com/..."
              class="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs font-medium text-gray-800 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">LinkedIn</label>
            <input
              v-model="form.socials.linkedin"
              type="url"
              placeholder="https://linkedin.com/..."
              class="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs font-medium text-gray-800 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            />
          </div>

          <div class="md:col-span-2">
            <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">YouTube</label>
            <input
              v-model="form.socials.youtube"
              type="url"
              placeholder="https://youtube.com/..."
              class="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs font-medium text-gray-800 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            />
          </div>
        </div>
      </div>

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

      <!-- Live Footer Preview -->
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
              <p class="text-gray-500 dark:text-gray-400 text-[11px] leading-relaxed">
                {{ form.desc || 'Deskripsi perusahaan...' }}
              </p>
            </div>

            <!-- Col 2: Info Kami -->
            <div class="space-y-2">
              <h5 class="font-bold text-gray-900 dark:text-gray-100">Info Kami</h5>
              <ul class="space-y-1.5 text-gray-600 dark:text-gray-300 text-[11px]">
                <li v-for="(ql, i) in form.infoKami" :key="i">
                  <a :href="ql.href" class="hover:text-primary transition">{{ ql.text }}</a>
                </li>
                <li v-if="form.infoKami.length === 0" class="text-gray-400 italic">Belum ada link</li>
              </ul>
            </div>

            <!-- Col 3: Panduan -->
            <div class="space-y-2">
              <h5 class="font-bold text-gray-900 dark:text-gray-100">Panduan Pelanggan</h5>
              <ul class="space-y-1.5 text-gray-600 dark:text-gray-300 text-[11px]">
                <li v-for="(pd, i) in form.panduan" :key="i">
                  <a :href="pd.href" class="hover:text-primary transition">{{ pd.text }}</a>
                </li>
                <li v-if="form.panduan.length === 0" class="text-gray-400 italic">Belum ada link</li>
              </ul>
            </div>

            <!-- Col 4: Kontak & Socials -->
            <div class="space-y-2">
              <h5 class="font-bold text-gray-900 dark:text-gray-100">Kontak Kami</h5>
              <p v-if="form.alamat" class="text-gray-500 dark:text-gray-400 text-[11px]">{{ form.alamat }}</p>
              <p v-if="form.telepon" class="text-gray-600 dark:text-gray-300 text-[11px] font-medium">📞 {{ form.telepon }}</p>
              <p v-if="form.email" class="text-gray-600 dark:text-gray-300 text-[11px] font-medium">✉️ {{ form.email }}</p>

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
          <div class="mt-6 border-t border-gray-100 pt-4 text-center text-[11px] text-gray-400 dark:border-gray-700">
            {{ form.copyright }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

