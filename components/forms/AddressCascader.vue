<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue?: string
    placeholder?: string
  }>(),
  {
    modelValue: '',
    placeholder: 'Select address (Province, City, District, Postal Code)...'
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', val: string): void
}>()

const isOpen = ref(false)
const activeTab = ref<'prov' | 'kota' | 'kec'>('prov')

const provinsiData = ref<Record<string, string>>({})
const kotaData = ref<Record<string, Array<{ id: string; nama: string }>>>({})
const kecamatanList = ref<Array<{ bps: string; nama: string; kodepos?: string }>>([])

const selectedProv = ref<{ id: string; name: string } | null>(null)
const selectedKota = ref<{ id: string; name: string } | null>(null)
const selectedKec = ref<{ name: string; kodepos: string } | null>(null)

const isLoaded = ref(false)

const loadData = async () => {
  if (isLoaded.value) return
  try {
    const [provRes, kotaRes, kodeposRes] = await Promise.all([
      fetch('/assets/json/provinsi.json').then(r => r.json()),
      fetch('/assets/json/kota-kabupaten.json').then(r => r.json()),
      fetch('/assets/json/kodepos.json').then(r => r.json())
    ])
    provinsiData.value = provRes
    kotaData.value = kotaRes

    // Process unique kecamatans
    const kecMap: Record<string, { bps: string; nama: string; kodepos: string }> = {}
    Object.values(kodeposRes as Record<string, any>).forEach(item => {
      if (item.bps && item.nama) {
        const key = `${item.bps}|${item.nama}`
        if (!kecMap[key]) {
          kecMap[key] = { bps: item.bps, nama: item.nama, kodepos: item.kodepos || '' }
        }
      }
    })
    kecamatanList.value = Object.values(kecMap)
    isLoaded.value = true
  } catch (err) {
    console.error('Failed to load address data:', err)
  }
}

const availableKotArray = computed(() => {
  if (!selectedProv.value) return []
  return kotaData.value[selectedProv.value.id] || []
})

const availableKecArray = computed(() => {
  if (!selectedKota.value) return []
  return kecamatanList.value.filter(k => k.bps === selectedKota.value?.id)
})

const selectProvince = (id: string, name: string) => {
  selectedProv.value = { id, name }
  selectedKota.value = null
  selectedKec.value = null
  activeTab.value = 'kota'
}

const selectCity = (id: string, name: string) => {
  selectedKota.value = { id, name }
  selectedKec.value = null
  activeTab.value = 'kec'
}

const selectDistrict = (name: string, kodepos: string) => {
  selectedKec.value = { name, kodepos }
  isOpen.value = false
  const fullAddress = `${selectedKec.value.name}, ${selectedKota.value?.name}, ${selectedProv.value?.name} ${selectedKec.value.kodepos}`.trim()
  emit('update:modelValue', fullAddress)
}

const openDropdown = () => {
  isOpen.value = true
  loadData()
}
</script>

<template>
  <div class="relative w-full">
    <!-- Display Input -->
    <div class="relative">
      <input
        type="text"
        :value="modelValue"
        readonly
        :placeholder="placeholder"
        class="w-full h-9 cursor-pointer rounded-lg border border-gray-200 bg-white px-3 pe-8 text-xs text-gray-800 transition-colors focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
        @click="openDropdown"
      />
      <span class="pointer-events-none absolute inset-y-0 end-0 flex items-center pe-2.5 text-gray-400">
        <FeatherIcon name="map-pin" size="14" />
      </span>
    </div>

    <!-- Cascader Dropdown -->
    <div
      v-if="isOpen"
      class="absolute start-0 top-full z-50 mt-1 w-full rounded-xl border border-gray-200 bg-white p-3 shadow-lg dark:border-gray-700 dark:bg-gray-900"
    >
      <!-- Header Tabs -->
      <div class="flex items-center justify-between border-b border-gray-100 pb-2 dark:border-gray-800 text-xs">
        <div class="flex gap-2 font-medium">
          <button
            type="button"
            :class="['px-2.5 py-1 rounded-md transition-colors', activeTab === 'prov' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400']"
            @click="activeTab = 'prov'"
          >
            1. Provinsi
          </button>
          <button
            type="button"
            :disabled="!selectedProv"
            :class="['px-2.5 py-1 rounded-md transition-colors disabled:opacity-40', activeTab === 'kota' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400']"
            @click="activeTab = 'kota'"
          >
            2. Kota/Kab
          </button>
          <button
            type="button"
            :disabled="!selectedKota"
            :class="['px-2.5 py-1 rounded-md transition-colors disabled:opacity-40', activeTab === 'kec' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400']"
            @click="activeTab = 'kec'"
          >
            3. Kecamatan
          </button>
        </div>
        <button type="button" class="text-gray-400 hover:text-gray-600" @click="isOpen = false">
          <FeatherIcon name="x" size="14" />
        </button>
      </div>

      <!-- Tab 1: Provinsi List -->
      <div v-if="activeTab === 'prov'" class="mt-2 max-h-56 overflow-y-auto space-y-0.5 text-xs">
        <button
          v-for="(name, id) in provinsiData"
          :key="id"
          type="button"
          :class="[
            'w-full text-start px-2.5 py-1.5 rounded hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors',
            selectedProv?.id === id ? 'font-bold text-primary bg-primary-50 dark:bg-primary/10' : 'text-gray-700 dark:text-gray-300'
          ]"
          @click="selectProvince(String(id), name)"
        >
          {{ name }}
        </button>
      </div>

      <!-- Tab 2: Kota/Kabupaten List -->
      <div v-else-if="activeTab === 'kota'" class="mt-2 max-h-56 overflow-y-auto space-y-0.5 text-xs">
        <div v-if="availableKotArray.length === 0" class="p-3 text-center text-gray-400">
          Pilih provinsi terlebih dahulu
        </div>
        <button
          v-for="k in availableKotArray"
          :key="k.id"
          type="button"
          :class="[
            'w-full text-start px-2.5 py-1.5 rounded hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors',
            selectedKota?.id === k.id ? 'font-bold text-primary bg-primary-50 dark:bg-primary/10' : 'text-gray-700 dark:text-gray-300'
          ]"
          @click="selectCity(k.id, k.nama)"
        >
          {{ k.nama }}
        </button>
      </div>

      <!-- Tab 3: Kecamatan List -->
      <div v-else-if="activeTab === 'kec'" class="mt-2 max-h-56 overflow-y-auto space-y-0.5 text-xs">
        <div v-if="availableKecArray.length === 0" class="p-3 text-center text-gray-400">
          Tidak ada data kecamatan
        </div>
        <button
          v-for="item in availableKecArray"
          :key="item.nama"
          type="button"
          class="w-full text-start px-2.5 py-1.5 rounded hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 flex justify-between"
          @click="selectDistrict(item.nama, item.kodepos || '')"
        >
          <span>{{ item.nama }}</span>
          <span v-if="item.kodepos" class="text-gray-400 text-[10px]">{{ item.kodepos }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

