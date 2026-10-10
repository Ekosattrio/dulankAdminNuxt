<script setup lang="ts">
import FeatherIcon from '~/components/Common/FeatherIcon.vue'

defineProps<{
  name: string
  description: string
  icon: string
  enabled: boolean
}>()

const emit = defineEmits<{
  toggle: []
  configure: []
}>()
</script>

<template>
  <div class="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-xs transition hover:border-gray-300 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700">
    <div>
      <div class="mb-3 flex items-start justify-between">
        <div class="flex items-center gap-3">
          <div class="flex h-11 w-11 items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-800">
            <img :src="icon" :alt="name" class="h-8 w-8 object-contain" />
          </div>
          <div>
            <h4 class="text-sm font-bold text-gray-900 dark:text-white">{{ name }}</h4>
            <span
              class="inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold"
              :class="enabled ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'"
            >
              {{ enabled ? 'Connected' : 'Not Connected' }}
            </span>
          </div>
        </div>

        <button
          type="button"
          role="switch"
          :aria-checked="enabled"
          :class="[
            'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary/20',
            enabled ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'
          ]"
          @click="emit('toggle')"
        >
          <span
            :class="[
              'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
              enabled ? 'translate-x-5' : 'translate-x-0'
            ]"
          />
        </button>
      </div>

      <p class="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-4">
        {{ description }}
      </p>
    </div>

    <div class="border-t border-gray-100 pt-3 dark:border-gray-800">
      <button
        type="button"
        class="inline-flex h-8 items-center gap-1.5 rounded-md border border-gray-200 bg-white px-3 text-xs font-semibold text-primary transition hover:bg-primary/5 dark:border-gray-700 dark:bg-gray-800"
        @click="emit('configure')"
      >
        <FeatherIcon name="link-2" :size="13" />
        <span>{{ enabled ? 'Lihat Konfigurasi' : 'Hubungkan Akun' }}</span>
      </button>
    </div>
  </div>
</template>

