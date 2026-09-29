<script setup lang="ts">
export interface Employee {
  id: string
  name: string
  department: string
  phone: string
  email: string
  address: string
  salary: number
  system: string
  ovtRate: number
  status: string
}

const props = withDefaults(
  defineProps<{
    modelValue?: string
    placeholder?: string
  }>(),
  {
    modelValue: '',
    placeholder: 'Search Employee'
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'select', employee: Employee): void
}>()

const query = ref(props.modelValue)
const isOpen = ref(false)

const employees = ref<Employee[]>([
  {
    id: 'ST001',
    name: 'Budi Setiadi',
    department: 'Produksi',
    phone: '+6281234567001',
    email: 'budi2548@gmail.com',
    address: 'Jawa Barat, Kab. Karawang, Karawang Barat, Perum Griya Indah Blok E2 No.55',
    salary: 4500000,
    system: 'Daily',
    ovtRate: 20000,
    status: 'Active'
  },
  {
    id: 'ST002',
    name: 'Siti Nurhaliza',
    department: 'Administrasi & Keuangan',
    phone: '+6281398765002',
    email: 'siti.nurhaliza@gmail.com',
    address: 'DKI Jakarta, Jakarta Selatan, Tebet, Jl. Tebet Barat Raya No.12',
    salary: 4200000,
    system: 'Monthly',
    ovtRate: 15000,
    status: 'Active'
  },
  {
    id: 'ST003',
    name: 'Agus Rahardjo',
    department: 'Desain Grafis',
    phone: '+62852112223003',
    email: 'agus.rahardjo@gmail.com',
    address: 'Banten, Kota Tangerang, Cipondoh, Komplek Garuda Blok B No.10',
    salary: 4000000,
    system: 'Monthly',
    ovtRate: 15000,
    status: 'Active'
  },
  {
    id: 'ST004',
    name: 'Rina Permata',
    department: 'Marketing',
    phone: '+6281155667004',
    email: 'rina.permata@gmail.com',
    address: 'Jawa Barat, Kota Bekasi, Bekasi Timur, Perumahan Jaya Blok A3 No.4',
    salary: 3800000,
    system: 'Monthly',
    ovtRate: 15000,
    status: 'Resign'
  },
  {
    id: 'ST005',
    name: 'Dedi Kurniawan',
    department: 'Produksi',
    phone: '+6282199001005',
    email: 'dedi.kurniawan@gmail.com',
    address: 'Jawa Tengah, Kota Semarang, Gayamsari, Kp. Sawah Besar RT 02/RW 03',
    salary: 4500000,
    system: 'Daily',
    ovtRate: 20000,
    status: 'Active'
  },
  {
    id: 'ST006',
    name: 'Maya Sartika',
    department: 'Produksi',
    phone: '+6281933445006',
    email: 'maya.sartika@gmail.com',
    address: 'Jawa Timur, Kota Surabaya, Gubeng, Jl. Dharmawangsa No.45',
    salary: 4500000,
    system: 'Daily',
    ovtRate: 20000,
    status: 'Active'
  },
  {
    id: 'ST007',
    name: 'Hendra Wijaya',
    department: 'Desain Grafis',
    phone: '+62857778889007',
    email: 'hendra.wijaya@gmail.com',
    address: 'Jawa Barat, Kota Bandung, Coblong, Jl. Dago Pojok No.102',
    salary: 4200000,
    system: 'Monthly',
    ovtRate: 15000,
    status: 'Active'
  },
  {
    id: 'ST008',
    name: 'Andi Pratama',
    department: 'Marketing',
    phone: '+6281288776008',
    email: 'andi.pratama@gmail.com',
    address: 'DI Yogyakarta, Kab. Sleman, Depok, Perum Condongcatur Blok G-8',
    salary: 3800000,
    system: 'Monthly',
    ovtRate: 15000,
    status: 'Active'
  },
  {
    id: 'ST009',
    name: 'Larasati Putri',
    department: 'Produksi',
    phone: '+6281311223009',
    email: 'larasati.putri@gmail.com',
    address: 'Jawa Barat, Kab. Bogor, Cibinong, Kp. Parung Jati Desa Sukahati',
    salary: 4500000,
    system: 'Daily',
    ovtRate: 20000,
    status: 'Resign'
  },
  {
    id: 'ST010',
    name: 'Fajar Ramadhan',
    department: 'Produksi',
    phone: '+6281144556010',
    email: 'fajar.ramadhan@gmail.com',
    address: 'Jawa Timur, Kota Malang, Lowokwaru, Jl. Soekarno Hatta No.22',
    salary: 4500000,
    system: 'Daily',
    ovtRate: 20000,
    status: 'Active'
  }
])

watch(
  () => props.modelValue,
  (val) => {
    query.value = val
  }
)

const filteredList = computed(() => {
  if (!query.value || query.value.trim() === '') return employees.value.slice(0, 5)
  const q = query.value.toLowerCase()
  return employees.value.filter(
    (e) =>
      e.name.toLowerCase().includes(q) ||
      e.id.toLowerCase().includes(q) ||
      e.department.toLowerCase().includes(q)
  ).slice(0, 8)
})

const handleInput = (e: Event) => {
  const val = (e.target as HTMLInputElement).value
  query.value = val
  emit('update:modelValue', val)
  isOpen.value = true
}

const selectEmployee = (emp: Employee) => {
  query.value = emp.name
  emit('update:modelValue', emp.name)
  emit('select', emp)
  isOpen.value = false
}

const root = ref<HTMLElement | null>(null)
onMounted(() => {
  document.addEventListener('click', (e) => {
    if (root.value && !root.value.contains(e.target as Node)) {
      isOpen.value = false
    }
  })
})
</script>

<template>
  <div ref="root" class="relative w-full">
    <div class="relative">
      <input
        type="text"
        :value="query"
        :placeholder="placeholder"
        class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 pe-8 text-sm text-gray-800 transition-colors focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
        @input="handleInput"
        @focus="isOpen = true"
      />
      <span class="pointer-events-none absolute inset-y-0 end-0 flex items-center pe-2.5 text-gray-400">
        <FeatherIcon name="search" size="16" />
      </span>
    </div>

    <!-- Autocomplete Dropdown List -->
    <div
      v-if="isOpen && filteredList.length > 0"
      class="absolute start-0 top-full z-50 mt-1 w-full rounded-xl border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-900 max-h-60 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800"
    >
      <button
        v-for="emp in filteredList"
        :key="emp.id"
        type="button"
        class="w-full px-3 py-2 text-start transition hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center justify-between"
        @click="selectEmployee(emp)"
      >
        <div>
          <div class="text-sm font-semibold text-gray-800 dark:text-gray-100">{{ emp.name }}</div>
          <div class="text-xs text-gray-500 dark:text-gray-400">
            <span class="font-medium text-primary">{{ emp.id }}</span> &bull; {{ emp.department }}
          </div>
        </div>
        <div class="text-end text-xs">
          <span
            :class="[
              'px-2 py-0.5 rounded-full font-medium text-[10px]',
              emp.status === 'Active' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
            ]"
          >
            {{ emp.status }}
          </span>
        </div>
      </button>
    </div>
  </div>
</template>

