<script setup lang="ts">
import type { RFQDocument } from '#server/types/request-quotation'
const form = defineModel<RFQDocument>({ required: true })
defineProps<{ isSubmitting: boolean }>()
defineEmits<{ submit: [] }>()
const { contacts } = useSalesContacts()
const contactList = useId()
function selectContact() {
  const c = contacts.value.find((c) => c.name === form.value.to)
  if (c) {
    form.value.email = c.email
    form.value.telp = c.phone
  }
}
function addItem() {
  form.value.items.push({ description: '', quantity: 1, unit: 'Ream', eta: '' })
}
function addRecipient() {
  ;(form.value.requestedTo ??= []).push({ department: '', attn: '', email: '', telp: '' })
}
</script>
<template>
  <form @submit.prevent="$emit('submit')">
    <fieldset :disabled="isSubmitting" class="min-w-0 space-y-6 disabled:opacity-60">
      <div
        class="space-y-6 rounded-lg border border-gray-200 bg-white p-5 text-xs leading-6 text-gray-700 shadow-sm sm:p-12 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
      >
        <SalesCompanyHeader />
        <datalist :id="contactList">
          <option v-for="contact in contacts" :key="contact.name" :value="contact.name" />
        </datalist>
        <div class="grid gap-6 sm:grid-cols-2">
          <div
            class="space-y-2 [&>label]:grid [&>label]:grid-cols-[minmax(80px,1fr)_minmax(0,2fr)] [&>label]:items-center [&>label]:gap-3"
          >
            <label :class="salesLabel"
              >To<input
                v-model="form.to"
                :list="contactList"
                :class="salesField"
                placeholder="Search"
                required
                @input="selectContact"
                @change="selectContact" /></label
            ><label :class="salesLabel">Att<input v-model="form.att" :class="salesField" /></label
            ><label :class="salesLabel">No. Telp<input v-model="form.telp" :class="salesField" /></label>
          </div>
          <div
            class="space-y-2 [&>label]:grid [&>label]:grid-cols-[minmax(80px,1fr)_minmax(0,2fr)] [&>label]:items-center [&>label]:gap-3"
          >
            <label :class="salesLabel"
              >No. RFQ<input
                :value="form.rfqNo"
                :class="salesField"
                placeholder="Generated when saved"
                readonly /></label
            ><label :class="salesLabel"
              >Date<input v-model="form.date" type="date" :class="salesField" required /></label
            ><label :class="salesLabel"
              >Email<input v-model="form.email" type="email" :class="salesField"
            /></label>
          </div>
        </div>
        <p>
          Yours faithfully,<br />Please provide an offer for the provision of the following goods/services
          with the best quality, price, and delivery time via fax or email.
        </p>
        <div class="overflow-x-auto">
          <table :class="salesDocumentTable" class="min-w-[700px]">
            <thead>
              <tr>
                <th>Description</th>
                <th>Quantity</th>
                <th>Unit</th>
                <th>ETA</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in form.items" :key="index">
                <td class="min-w-64">
                  <textarea
                    v-model="item.description"
                    aria-label="Description"
                    :class="salesField"
                    rows="2"
                    required
                  />
                </td>
                <td class="w-28">
                  <input
                    v-model.number="item.quantity"
                    aria-label="Quantity"
                    type="number"
                    min="1"
                    :class="salesField"
                    required
                  />
                </td>
                <td class="w-28">
                  <select v-model="item.unit" aria-label="Unit" :class="salesField">
                    <option>Ream</option>
                    <option>Pieces</option>
                    <option>Pcs</option>
                    <option>Box</option>
                    <option>Set</option>
                    <option v-if="!['Ream', 'Pieces', 'Pcs', 'Box', 'Set'].includes(item.unit)">
                      {{ item.unit }}
                    </option>
                  </select>
                </td>
                <td class="w-44">
                  <input v-model="item.eta" aria-label="ETA" type="date" :class="salesField" />
                </td>
                <td>
                  <SalesActionButton
                    icon="trash-2"
                    label="Remove item"
                    @click="form.items.splice(index, 1)"
                  />
                </td>
              </tr>
              <tr v-if="!form.items.length">
                <td colspan="5" class="text-center text-gray-500">No items added</td>
              </tr>
            </tbody>
          </table>
        </div>
        <button type="button" class="inline-flex items-center gap-2 text-primary" @click="addItem">
          <FeatherIcon name="plus-circle" :size="14" />add New blank
        </button>
        <div class="space-y-3 [&>label]:grid [&>label]:items-center [&>label]:gap-3 sm:[&>label]:grid-cols-2">
          <label :class="salesLabel"
            >Due Date<input
              v-model="form.dueDate"
              type="date"
              :min="form.date"
              :class="salesField"
              required /></label
          ><label :class="salesLabel"
            >Payment Term<select aria-label="Payment Term" v-model="form.paymentTerm" :class="salesField">
              <option>Cash on Delivery</option>
              <option>15 Days</option>
              <option>30 Days</option>
              <option v-if="!['Cash on Delivery', '15 Days', '30 Days'].includes(form.paymentTerm)">
                {{ form.paymentTerm }}
              </option>
            </select></label
          >
        </div>
        <div class="space-y-4">
          <h3 class="font-semibold">Quotation requested to:</h3>
          <div
            v-for="(recipient, index) in form.requestedTo"
            :key="index"
            class="flex max-w-lg items-start gap-4"
          >
            <div
              class="flex-1 space-y-3 [&>label]:grid [&>label]:grid-cols-[90px_minmax(0,1fr)] [&>label]:items-center [&>label]:gap-3"
            >
              <label :class="salesLabel"
                >Department:<input v-model="recipient.department" :class="salesField" /></label
              ><label :class="salesLabel">Attn:<input v-model="recipient.attn" :class="salesField" /></label
              ><label :class="salesLabel"
                >Email:<input v-model="recipient.email" type="email" :class="salesField" /></label
              ><label :class="salesLabel">Telp:<input v-model="recipient.telp" :class="salesField" /></label>
            </div>
            <SalesActionButton
              icon="trash-2"
              label="Remove requested contact"
              @click="form.requestedTo?.splice(index, 1)"
            />
          </div>
          <button type="button" class="inline-flex items-center gap-2 text-primary" @click="addRecipient">
            <FeatherIcon name="plus-circle" :size="14" />add New blank
          </button>
        </div>
        <p>
          All quotations must include the RFQ number above as a reference.<br />All quotations and procurement
          of goods must adhere to the terms and conditions of purchase for goods/services of PT. Dulank
          Semesta Cida. Thank you for your attention and cooperation.
        </p>
        <div class="w-full max-w-64 space-y-8 py-4">
          <p>Hormat kami,</p>
          <label :class="salesLabel"
            ><span class="sr-only">Name</span
            ><input v-model="form.signature" :class="salesField" placeholder="Name"
          /></label>
        </div>
      </div>
      <div class="flex justify-end gap-3">
        <NuxtLink to="/request-quotation" :class="salesSecondaryButton">Cancel</NuxtLink
        ><button type="submit" :class="salesPrimaryButton">
          {{ isSubmitting ? 'Saving...' : 'Save Changes' }}
        </button>
      </div>
    </fieldset>
  </form>
</template>
