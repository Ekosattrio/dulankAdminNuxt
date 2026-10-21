<script setup lang="ts">
const props = defineProps<{ modelValue: string[]; employees: { id: string | number; name: string }[]; disabled?: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [value: string[]] }>()
const search = ref('')
const open = ref(false)
const highlighted = ref(0)
const input = ref<HTMLInputElement | null>(null)
const listId = useId()
const selected = computed(() => props.modelValue.map(id => ({ id, name: props.employees.find(employee => String(employee.id) === id)?.name || `Karyawan #${id}` })))
const matches = computed(() => {
  const query = search.value.trim().toLocaleLowerCase()
  return query ? props.employees.filter(employee => !props.modelValue.includes(String(employee.id)) && employee.name.toLocaleLowerCase().includes(query)).slice(0, 30) : []
})
watch(search, () => { highlighted.value = 0; open.value = true })
function choose(id: string) {
  if (props.disabled) return
  emit('update:modelValue', [...new Set([...props.modelValue, id])])
  search.value = ''; open.value = false; input.value?.focus()
}
function remove(id: string) { if (!props.disabled) emit('update:modelValue', props.modelValue.filter(value => value !== id)) }
function keydown(event: KeyboardEvent) {
  if (event.key === 'Escape') { open.value = false; event.preventDefault() }
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault(); open.value = true
    highlighted.value = Math.max(0, Math.min(matches.value.length - 1, highlighted.value + (event.key === 'ArrowDown' ? 1 : -1)))
  }
  if (event.key === 'Enter') { event.preventDefault(); const employee = open.value && matches.value[highlighted.value]; if (employee) choose(String(employee.id)) }
  if (event.key === 'Backspace' && !search.value && props.modelValue.length) remove(props.modelValue[props.modelValue.length - 1]!)
}
</script>
<template>
  <div class="relative" @focusout="event => { if (!(event.currentTarget as HTMLElement).contains(event.relatedTarget as Node | null)) open = false }">
    <div class="flex min-h-10 flex-wrap items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 py-2 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15 dark:border-gray-700 dark:bg-gray-800" :class="disabled ? 'opacity-60' : ''" @click="input?.focus()">
      <span v-for="employee in selected" :key="employee.id" class="inline-flex max-w-full items-center gap-1 rounded-md border border-primary/20 bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
        <span class="truncate">{{ employee.name }}</span>
        <button type="button" :disabled="disabled" :aria-label="`Hapus ${employee.name}`" class="rounded hover:bg-primary/15 disabled:opacity-40" @click.stop="remove(employee.id)"><FeatherIcon name="x" :size="14" /></button>
      </span>
      <input :id="`${listId}-input`" ref="input" v-model="search" role="combobox" aria-label="Cari anggota" aria-autocomplete="list" :aria-expanded="open && !!search.trim()" :aria-controls="listId" :aria-activedescendant="matches[highlighted] ? `${listId}-${highlighted}` : undefined" :disabled="disabled" type="text" autocomplete="off" placeholder="Ketik nama karyawan..." class="min-w-32 flex-1 border-0 bg-transparent p-0 text-sm outline-none focus:ring-0" @focus="open = true" @keydown="keydown" />
    </div>
    <ul v-if="open && search.trim() && !disabled" :id="listId" role="listbox" class="absolute left-0 right-0 z-50 mt-1 max-h-52 overflow-y-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-900">
      <li v-for="(employee, index) in matches" :id="`${listId}-${index}`" :key="employee.id" role="option" :aria-selected="index === highlighted" class="cursor-pointer px-3 py-2 text-sm" :class="index === highlighted ? 'bg-primary/10 text-primary' : 'text-gray-700 dark:text-gray-200'" @mousedown.prevent @mouseenter="highlighted = index" @click="choose(String(employee.id))">{{ employee.name }} <span class="text-xs text-gray-400">#{{ employee.id }}</span></li>
      <li v-if="!matches.length" class="px-3 py-2 text-sm text-gray-500" role="status">Tidak ada karyawan yang cocok.</li>
    </ul>
  </div>
</template>
