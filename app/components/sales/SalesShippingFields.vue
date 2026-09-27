<script setup lang="ts">
import type { SalesShipping } from '#server/types/sales-document'
const shipping = defineModel<SalesShipping>({ required: true })
const id = useId()
const editing = ref(false)
const { data: stores } = useFetch<{
  data: { name?: string; storeName?: string; address?: string; phone?: string }[]
}>('/api/stores', { key: 'sales-pickup-stores' })
const pickups = computed(() => stores.value?.data ?? [])
function switchMethod(method: SalesShipping['method']) {
  const value = shipping.value
  if (method === value.method) return
  if (value.method === 'Shipping') {
    value.deliveryAddress = value.address
    value.deliveryPhone = value.phone
  } else {
    value.pickupAddress = value.address
    value.pickupPhone = value.phone
  }
  value.method = method
  value.address = (method === 'Shipping' ? value.deliveryAddress : value.pickupAddress) || ''
  value.phone = (method === 'Shipping' ? value.deliveryPhone : value.pickupPhone) || ''
}
function choosePickup(event: Event) {
  const name = (event.target as HTMLSelectElement).value
  const store = pickups.value.find((s) => (s.name || s.storeName) === name)
  shipping.value.pickup = name
  if (store) {
    shipping.value.address = store.address || ''
    shipping.value.phone = store.phone || ''
  }
}
</script>
<template>
  <div class="space-y-3 text-xs text-gray-700 dark:text-gray-300">
    <p class="font-medium">Shiping Method:</p>
    <div class="flex gap-5">
      <label class="flex items-center gap-2"
        ><input
          :checked="shipping.method === 'Shipping'"
          :name="id"
          type="radio"
          value="Shipping"
          class="accent-primary"
          @change="switchMethod('Shipping')"
        />Shipping</label
      ><label class="flex items-center gap-2"
        ><input
          :checked="shipping.method === 'Pick Up'"
          :name="id"
          type="radio"
          value="Pick Up"
          class="accent-primary"
          @change="switchMethod('Pick Up')"
        />Pickup</label
      >
    </div>
    <div class="space-y-2 rounded-md border border-gray-200 p-3 leading-5 dark:border-gray-700">
      <p class="font-medium">
        {{
          shipping.method === 'Pick Up'
            ? shipping.pickup || 'Select pickup address'
            : shipping.recipient || 'Shipping address'
        }}
        {{ shipping.phone }}
      </p>
      <p class="whitespace-pre-line">{{ shipping.address || '-' }}</p>
      <button
        type="button"
        class="text-primary underline-offset-2 hover:underline"
        @click="editing = !editing"
      >
        {{ shipping.method === 'Shipping' ? 'Ubah Alamat' : 'Pilih Alamat Pickup' }}
      </button>
      <div v-if="editing" class="space-y-2 border-t border-gray-200 pt-3 dark:border-gray-700">
        <template v-if="shipping.method === 'Pick Up'"
          ><select
            v-if="pickups.length"
            :class="salesField"
            aria-label="Pickup location"
            @change="choosePickup"
          >
            <option value="">Pilih Alamat Pickup</option>
            <option v-for="store in pickups" :key="store.name || store.storeName">
              {{ store.name || store.storeName }}
            </option></select
          ><label :class="salesLabel"
            >Pickup location<input v-model="shipping.pickup" :class="salesField" /></label
        ></template>
        <label v-else :class="salesLabel"
          >Recipient<input v-model="shipping.recipient" :class="salesField"
        /></label>
        <label :class="salesLabel">Phone<input v-model="shipping.phone" :class="salesField" /></label
        ><label :class="salesLabel"
          >Address<textarea v-model="shipping.address" :class="salesField" rows="3" />
        </label>
        <button type="button" :class="salesSecondaryButton" @click="editing = false">Apply</button>
      </div>
    </div>
  </div>
</template>
