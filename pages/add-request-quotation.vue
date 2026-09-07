<script setup lang="ts">
const router = useRouter()

useHead({
  title: 'Add Request For Quotation (RFQ) - Kacetak System'
})

interface RFQLineItem {
  description: string
  quantity: number
  unit: string
  eta: string
}

const form = ref({
  to: 'DULANK SEMESTA CIDA, PT',
  rfqNo: 'RFQ' + String(Date.now()).slice(-5),
  att: 'CECEP',
  date: new Date().toISOString().substring(0, 10),
  telp: '+62877 8813 1400',
  email: 'setting.percetakan.dulank@gmail.com',
  dueDate: '2025-12-15',
  paymentTerm: '30 days',
  items: [
    { description: 'SAFETY SIGN, STIKER, @MUDAH TERBAKAR', quantity: 50, unit: 'PC', eta: '2025-12-15' },
    { description: 'SAFETY SIGN, @AWAS BAHAYA ALIRAN LISTRIK', quantity: 50, unit: 'PC', eta: '2025-12-15' }
  ] as RFQLineItem[]
})

const addItem = () => {
  form.value.items.push({
    description: '',
    quantity: 1,
    unit: 'PC',
    eta: form.value.dueDate
  })
}

const removeItem = (index: number) => {
  form.value.items.splice(index, 1)
}

const isSubmitting = ref(false)
const handleSubmit = () => {
  isSubmitting.value = true
  setTimeout(() => {
    isSubmitting.value = false
    router.push('/request-quotation')
  }, 600)
}
</script>

<template>
  <div>
    <!-- Page Header -->
    <PageHeader title="Add New Request For Quotation (RFQ)" subtitle="Create and submit RFQ to supplier">
      <template #actions>
        <NuxtLink
          to="/request-quotation"
          class="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
        >
          <FeatherIcon name="arrow-left" size="14" />
          <span>Back to RFQ List</span>
        </NuxtLink>
      </template>
    </PageHeader>

    <form @submit.prevent="handleSubmit">
      <div class="mx-auto max-w-4xl rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <!-- Company Header -->
        <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between border-b border-gray-100 pb-6 dark:border-gray-800">
          <div class="flex h-20 w-36 items-center justify-center rounded border border-dashed border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
            <span class="text-xs font-bold text-gray-400">Logo</span>
          </div>
          <div class="text-xs text-gray-600 dark:text-gray-400 sm:text-end">
            <h2 class="text-base font-bold text-gray-900 dark:text-white">PT. DULANK SEMESTA CIDA</h2>
            <p>Jl. Arif Rahman Hakim / Niaga (depan stasiun) Karawang</p>
            <p>Kel. Nagasari Kec. Karawang Barat Kab. Karawang Jawa Barat</p>
            <p class="font-medium text-gray-800 dark:text-gray-300">ptdulanksemestacida@gmail.com</p>
          </div>
        </div>

        <!-- RFQ Metadata Form -->
        <div class="my-6 grid grid-cols-1 gap-4 sm:grid-cols-2 text-xs">
          <div class="space-y-3">
            <div>
              <label class="font-semibold text-gray-700 dark:text-gray-300">To (Supplier / Vendor)</label>
              <input
                v-model="form.to"
                type="text"
                class="mt-1 w-full rounded-lg border border-gray-200 bg-gray-50 p-2 text-xs focus:border-primary focus:bg-white focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                required
              />
            </div>
            <div>
              <label class="font-semibold text-gray-700 dark:text-gray-300">Att (Attention Person)</label>
              <input
                v-model="form.att"
                type="text"
                class="mt-1 w-full rounded-lg border border-gray-200 bg-gray-50 p-2 text-xs focus:border-primary focus:bg-white focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>
            <div>
              <label class="font-semibold text-gray-700 dark:text-gray-300">No. Telp</label>
              <input
                v-model="form.telp"
                type="text"
                class="mt-1 w-full rounded-lg border border-gray-200 bg-gray-50 p-2 text-xs focus:border-primary focus:bg-white focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>

          <div class="space-y-3">
            <div>
              <label class="font-semibold text-gray-700 dark:text-gray-300">No. RFQ</label>
              <input
                v-model="form.rfqNo"
                type="text"
                class="mt-1 w-full rounded-lg border border-gray-200 bg-gray-50 p-2 text-xs font-mono focus:border-primary focus:bg-white focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                required
              />
            </div>
            <div>
              <label class="font-semibold text-gray-700 dark:text-gray-300">Date</label>
              <input
                v-model="form.date"
                type="date"
                class="mt-1 w-full rounded-lg border border-gray-200 bg-gray-50 p-2 text-xs focus:border-primary focus:bg-white focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                required
              />
            </div>
            <div>
              <label class="font-semibold text-gray-700 dark:text-gray-300">Email</label>
              <input
                v-model="form.email"
                type="email"
                class="mt-1 w-full rounded-lg border border-gray-200 bg-gray-50 p-2 text-xs focus:border-primary focus:bg-white focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>
        </div>

        <p class="mb-4 text-xs italic text-gray-600 dark:text-gray-400">
          Yours faithfully,<br />
          Please provide an offer for the provision of the following goods/services with the best quality, price, and delivery time via fax or email.
        </p>

        <!-- Line Items Table -->
        <div class="mb-6 overflow-x-auto">
          <table class="w-full border-collapse text-xs">
            <thead>
              <tr class="border-y border-gray-200 bg-gray-50 text-[11px] font-semibold uppercase text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
                <th class="p-3 text-start">Descriptions</th>
                <th class="p-3 text-end" style="width: 100px">Quantity</th>
                <th class="p-3 text-center" style="width: 120px">Unit</th>
                <th class="p-3 text-start" style="width: 140px">ETA</th>
                <th class="p-3 text-center" style="width: 50px">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
              <tr v-for="(item, idx) in form.items" :key="idx">
                <td class="p-2">
                  <input
                    v-model="item.description"
                    type="text"
                    placeholder="Description of item..."
                    class="w-full rounded border border-gray-200 bg-gray-50 p-1.5 text-xs focus:border-primary focus:bg-white focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    required
                  />
                </td>
                <td class="p-2">
                  <input
                    v-model.number="item.quantity"
                    type="number"
                    min="1"
                    class="w-full rounded border border-gray-200 bg-gray-50 p-1.5 text-end text-xs dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </td>
                <td class="p-2">
                  <input
                    v-model="item.unit"
                    type="text"
                    placeholder="e.g. PC, Ream"
                    class="w-full rounded border border-gray-200 bg-gray-50 p-1.5 text-center text-xs dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </td>
                <td class="p-2">
                  <input
                    v-model="item.eta"
                    type="date"
                    class="w-full rounded border border-gray-200 bg-gray-50 p-1.5 text-xs dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </td>
                <td class="p-2 text-center">
                  <button
                    type="button"
                    class="text-gray-400 hover:text-danger"
                    title="Remove item"
                    @click="removeItem(idx)"
                  >
                    <FeatherIcon name="trash-2" size="14" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          <button
            type="button"
            class="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
            @click="addItem"
          >
            <FeatherIcon name="plus-circle" size="13" />
            <span>Add Item Row</span>
          </button>
        </div>

        <!-- Terms & Details -->
        <div class="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 text-xs border-t border-gray-100 pt-4 dark:border-gray-800">
          <div>
            <label class="font-semibold text-gray-700 dark:text-gray-300">Due Date</label>
            <input
              v-model="form.dueDate"
              type="date"
              class="mt-1 w-full rounded border border-gray-200 bg-gray-50 p-2 text-xs dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>
          <div>
            <label class="font-semibold text-gray-700 dark:text-gray-300">Payment Term</label>
            <input
              v-model="form.paymentTerm"
              type="text"
              placeholder="e.g. 30 days"
              class="mt-1 w-full rounded border border-gray-200 bg-gray-50 p-2 text-xs dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>
        </div>

        <!-- Submit Controls -->
        <div class="flex justify-end gap-3 border-t border-gray-100 pt-4 dark:border-gray-800">
          <NuxtLink
            to="/request-quotation"
            class="rounded-lg border border-gray-200 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Cancel
          </NuxtLink>
          <button
            type="submit"
            :disabled="isSubmitting"
            class="inline-flex items-center gap-1.5 rounded-lg bg-primary px-6 py-2 text-xs font-semibold text-white hover:bg-primary/90 disabled:opacity-50"
          >
            <FeatherIcon v-if="!isSubmitting" name="check" size="14" />
            <span>{{ isSubmitting ? 'Submitting...' : 'Save & Submit RFQ' }}</span>
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

