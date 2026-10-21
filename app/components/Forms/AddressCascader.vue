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

const { provinces, regencies, districts, pending, error } = useLocationOptions()
const provinsiData = computed(() => Object.fromEntries(provinces.value.filter(item => item.status === 'Active').map(item => [item.id, item.name])))
const selectedProv = ref<{ id: string; name: string } | null>(null)
const selectedKota = ref<{ id: string; name: string } | null>(null)
const selectedKec = ref<{ name: string; kodepos: string } | null>(null)
const availableKotArray = computed(() => regencies.value.filter(item => item.provinceId === selectedProv.value?.id && item.status === 'Active').map(item => ({ id: item.id, nama: item.name })))
const availableKecArray = computed(() => districts.value.filter(item => item.regencyId === selectedKota.value?.id && item.status === 'Active').map(item => ({ nama: item.name, kodepos: item.postalCode || '' })))

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

      <p v-if="pending" class="p-3 text-xs">Memuat wilayah...</p>
      <p v-else-if="error" role="alert" class="p-3 text-xs text-red-600">Gagal memuat master wilayah.</p>
      <p v-else-if="!provinces.length" class="p-3 text-xs">Master wilayah belum tersedia.</p>
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
          <span v-if="item.kodepos" class="text-gray-400 text-xs">{{ item.kodepos }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

