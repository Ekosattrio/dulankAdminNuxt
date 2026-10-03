<script lang="ts">
export const DEFAULT_EMPLOYEE_OPTIONS = [
  'Adul',
  'Nurdin',
  'Admin',
  'Arif',
  'Galih',
  'Rapli',
  'Dadang',
  'Bagas',
  'Citra',
]

export const DEFAULT_DEPARTMENT_MEMBERS: Record<string, string[]> = {
  'tim-cutting': ['Rapli', 'Nurdin', 'Bagas'],
  'tim-printing': ['Adul', 'Arif', 'Galih'],
  'tim-design': ['Admin', 'Nurdin', 'Citra'],
}
</script>

<script setup lang="ts">
import { formControlClass } from '~/utils/salesUi'

const props = withDefaults(
  defineProps<{
    modelValue?: string | string[]
    employeeOptions?: string[]
    departmentMembers?: Record<string, string[]>
    disabled?: boolean
    placeholder?: string
  }>(),
  {
    modelValue: '',
    employeeOptions: () => [
      'Adul',
      'Nurdin',
      'Admin',
      'Arif',
      'Galih',
      'Rapli',
      'Dadang',
      'Bagas',
      'Citra',
    ],
    departmentMembers: () => ({
      'tim-cutting': ['Rapli', 'Nurdin', 'Bagas'],
      'tim-printing': ['Adul', 'Arif', 'Galih'],
      'tim-design': ['Admin', 'Nurdin', 'Citra'],
    }),
    disabled: false,
    placeholder: 'Select assignee name...',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
  change: [value: string]
}>()

const assigneeType = ref<'employee' | 'department'>('employee')
const selectedDepartment = ref('')
const selectedEmployees = ref<string[]>([])
const searchQuery = ref('')
const dropdownOpen = ref(false)

const assigneeBoxRef = ref<HTMLElement | null>(null)
const searchInputRef = ref<HTMLInputElement | null>(null)

function detectDepartment(employees: string[]): string {
  for (const [dept, members] of Object.entries(props.departmentMembers)) {
    if (
      members.length === employees.length &&
      members.every((m) => employees.includes(m))
    ) {
      return dept
    }
  }
  return ''
}

function parseModelValue(val?: string | string[]): string[] {
  if (Array.isArray(val)) return val.map((s) => s.trim()).filter(Boolean)
  if (typeof val === 'string') return val.split(',').map((s) => s.trim()).filter(Boolean)
  return []
}

watch(
  () => props.modelValue,
  (val) => {
    const list = parseModelValue(val)
    selectedEmployees.value = list
    const dept = detectDepartment(list)
    if (dept) {
      assigneeType.value = 'department'
      selectedDepartment.value = dept
    }
  },
  { immediate: true },
)

const filteredOptions = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) return props.employeeOptions
  return props.employeeOptions.filter((opt) => opt.toLowerCase().includes(query))
})

function emitValue() {
  const result = selectedEmployees.value.join(', ')
  emit('update:modelValue', result)
  emit('change', result)
}

function onAssigneeTypeChange() {
  if (assigneeType.value === 'department') {
    if (selectedDepartment.value && props.departmentMembers[selectedDepartment.value]) {
      selectedEmployees.value = [...props.departmentMembers[selectedDepartment.value]]
      emitValue()
    }
  } else {
    if (selectedEmployees.value.length === 0) {
      selectedEmployees.value = ['Adul', 'Nurdin']
      emitValue()
    }
  }
}

function onDepartmentSelect() {
  if (selectedDepartment.value && props.departmentMembers[selectedDepartment.value]) {
    selectedEmployees.value = [...props.departmentMembers[selectedDepartment.value]]
    emitValue()
  }
}

function toggleEmployee(name: string) {
  const index = selectedEmployees.value.indexOf(name)
  if (index === -1) {
    selectedEmployees.value.push(name)
  } else {
    selectedEmployees.value.splice(index, 1)
  }
  searchQuery.value = ''
  emitValue()
  searchInputRef.value?.focus()
}

function addCustomEmployee(name: string) {
  const val = name.trim()
  if (val && !selectedEmployees.value.includes(val)) {
    selectedEmployees.value.push(val)
    emitValue()
  }
  searchQuery.value = ''
  dropdownOpen.value = false
}

function addCurrentQuery() {
  const val = searchQuery.value.trim()
  if (!val) return
  if (!selectedEmployees.value.includes(val)) {
    selectedEmployees.value.push(val)
    emitValue()
  }
  searchQuery.value = ''
}

function onBackspace() {
  if (!searchQuery.value && selectedEmployees.value.length > 0) {
    selectedEmployees.value.pop()
    emitValue()
  }
}

function removeEmployee(name: string) {
  selectedEmployees.value = selectedEmployees.value.filter((n) => n !== name)
  emitValue()
}

function handleClickOutside(event: MouseEvent) {
  if (assigneeBoxRef.value && !assigneeBoxRef.value.contains(event.target as Node)) {
    dropdownOpen.value = false
  }
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    document.addEventListener('click', handleClickOutside)
  }
})

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    document.removeEventListener('click', handleClickOutside)
  }
})
</script>

<template>
  <div class="w-full space-y-2">
    <!-- Radio selection -->
    <div class="flex items-center gap-5 pt-0.5">
      <label class="inline-flex cursor-pointer items-center gap-2 text-xs font-medium text-gray-700 dark:text-gray-300">
        <input
          v-model="assigneeType"
          type="radio"
          value="employee"
          :disabled="disabled"
          class="size-4 accent-primary"
          @change="onAssigneeTypeChange"
        />
        <span>Employees</span>
      </label>
      <label class="inline-flex cursor-pointer items-center gap-2 text-xs font-medium text-gray-700 dark:text-gray-300">
        <input
          v-model="assigneeType"
          type="radio"
          value="department"
          :disabled="disabled"
          class="size-4 accent-primary"
          @change="onAssigneeTypeChange"
        />
        <span>Department</span>
      </label>
    </div>

    <!-- Department Dropdown -->
    <div v-if="assigneeType === 'department'" class="w-full">
      <select
        v-model="selectedDepartment"
        :disabled="disabled"
        :class="formControlClass"
        @change="onDepartmentSelect"
      >
        <option value="">Select department</option>
        <option value="tim-cutting">Tim Cutting</option>
        <option value="tim-printing">Tim Printing</option>
        <option value="tim-design">Tim Design</option>
      </select>
    </div>

    <!-- Employees chips & dropdown picker -->
    <div ref="assigneeBoxRef" class="relative w-full">
      <div
        class="flex min-h-9 w-full flex-wrap items-center gap-1.5 rounded-md border border-gray-200 bg-white px-2.5 py-1 text-xs shadow-sm transition-colors hover:border-gray-300 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 dark:border-gray-700 dark:bg-gray-900"
        :class="{ 'opacity-60 cursor-not-allowed': disabled }"
        @click="!disabled && searchInputRef?.focus()"
      >
        <span
          v-for="emp in selectedEmployees"
          :key="emp"
          class="inline-flex items-center gap-1 rounded bg-[#ff9f43]/10 px-2 py-0.5 text-[11px] font-semibold text-[#c8701a] border border-[#ff9f43]/25 dark:bg-[#ff9f43]/20 dark:text-[#ffb766] dark:border-[#ff9f43]/30"
        >
          <span>{{ emp }}</span>
          <button
            v-if="!disabled"
            type="button"
            class="rounded p-0.5 text-[#c8701a]/70 hover:text-red-500 focus:outline-none transition-colors"
            @click.stop="removeEmployee(emp)"
          >
            <FeatherIcon name="x" :size="10" />
          </button>
        </span>

        <div class="flex min-w-[100px] flex-1 items-center">
          <input
            ref="searchInputRef"
            v-model="searchQuery"
            type="text"
            :disabled="disabled"
            :placeholder="selectedEmployees.length === 0 ? placeholder : ''"
            class="h-6 w-full bg-transparent text-xs text-gray-800 outline-none placeholder:text-gray-400 dark:text-gray-200 disabled:cursor-not-allowed"
            @focus="!disabled && (dropdownOpen = true)"
            @keydown.enter.prevent="addCurrentQuery"
            @keydown.backspace="onBackspace"
          />
        </div>

        <button
          type="button"
          :disabled="disabled"
          class="shrink-0 p-0.5 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors disabled:opacity-40"
          @click.stop="!disabled && (dropdownOpen = !dropdownOpen)"
        >
          <FeatherIcon :name="dropdownOpen ? 'chevron-up' : 'chevron-down'" :size="14" />
        </button>
      </div>

      <!-- Dropdown menu -->
      <div
        v-if="dropdownOpen && !disabled"
        class="absolute left-0 top-[calc(100%+4px)] z-50 max-h-52 w-full overflow-y-auto rounded-md border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800"
      >
        <div
          v-for="emp in filteredOptions"
          :key="emp"
          class="flex cursor-pointer items-center justify-between px-3 py-1.5 text-xs text-gray-700 hover:bg-primary/10 hover:text-primary transition-colors dark:text-gray-300 dark:hover:bg-primary/20"
          @click.stop="toggleEmployee(emp)"
        >
          <div class="flex items-center gap-2">
            <span class="inline-flex size-5 items-center justify-center rounded-full bg-gray-100 text-[10px] font-bold text-gray-600 dark:bg-gray-700 dark:text-gray-300">
              {{ emp.charAt(0) }}
            </span>
            <span>{{ emp }}</span>
          </div>
          <FeatherIcon
            v-if="selectedEmployees.includes(emp)"
            name="check"
            :size="14"
            class="font-bold text-primary"
          />
        </div>

        <div
          v-if="searchQuery.trim() && !props.employeeOptions.some(opt => opt.toLowerCase() === searchQuery.trim().toLowerCase())"
          class="flex cursor-pointer items-center gap-2 border-t border-gray-100 px-3 py-2 text-xs font-semibold text-primary hover:bg-primary/10 transition-colors dark:border-gray-700"
          @click.stop="addCustomEmployee(searchQuery.trim())"
        >
          <FeatherIcon name="plus" :size="14" />
          <span>Add "{{ searchQuery.trim() }}"</span>
        </div>

        <div
          v-if="filteredOptions.length === 0 && !searchQuery.trim()"
          class="px-3 py-2 text-center text-xs text-gray-400 italic"
        >
          No employees found
        </div>
      </div>
    </div>
  </div>
</template>
