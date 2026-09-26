<script setup lang="ts">
const router = useRouter()
const route = useRoute()

const form = reactive({
  store: 'Main Store',
  itemCode: '455454478844',
  name: '',
  category: 'Large Format',
  subCategory: 'Print Outdoor',
  unit: 'Meter',
  sellingType: 'Size Calculation',
  description: '',
  productType: 'Single Product',
  quantity: 100,
  price: 15000,
  tax: 0,
  discountType: 'Percentage',
  discountValue: 0,
  quantityAlert: 10
})

const generateCode = () => {
  form.itemCode = String(Math.floor(100000000000 + Math.random() * 900000000000))
}

const submitProduct = () => {
  if (!form.name.trim()) {
    alert('Please enter a product name')
    return
  }
  alert('Product saved successfully!')
  router.push('/product-list')
}

// Categories & units options
const categories = ['Large Format', 'Digital Print', 'Offset Print', 'Finishing & Merchandise', 'Merchandise', 'Display Promo', 'Sablon & Tekstil']
const subCategories = ['Print Outdoor', 'Cetak A3+', 'Brosur', 'Sticker & Label', 'Kalender', 'Mug & Botol', 'Roll Up Banner', 'Kaos']
const units = ['Meter', 'Box', 'Rim', 'Pcs', 'Buku', 'Lembar', 'Kg']
</script>

<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <CommonPageHeader title="New Product" subtitle="Create new product">
      <template #actions>
        <NuxtLink
          to="/product-list"
          class="inline-flex items-center gap-2 rounded-lg bg-gray-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-700"
        >
          <FeatherIcon name="arrow-left" size="18" />
          <span>Back to Product</span>
        </NuxtLink>
      </template>
    </CommonPageHeader>

    <form @submit.prevent="submitProduct">
      <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 space-y-8">
        <!-- 1. Product Information -->
        <div class="space-y-4">
          <div class="flex items-center gap-2 border-b border-gray-200 pb-3 dark:border-gray-800">
            <FeatherIcon name="info" size="18" class="text-primary" />
            <h6 class="text-base font-bold text-gray-900 dark:text-gray-100">Product Information</h6>
          </div>

          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Store</label>
              <select
                v-model="form.store"
                class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              >
                <option value="Main Store">Main Store</option>
                <option value="Branch 1">Branch 1</option>
                <option value="Branch 2">Branch 2</option>
              </select>
            </div>

            <div>
              <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Item Code</label>
              <div class="flex gap-2">
                <input
                  v-model="form.itemCode"
                  type="text"
                  required
                  class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 font-mono text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                />
                <button
                  type="button"
                  class="rounded-lg bg-gray-100 px-3 text-xs font-semibold text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 whitespace-nowrap"
                  @click="generateCode"
                >
                  Generate
                </button>
              </div>
            </div>

            <div class="sm:col-span-2 lg:col-span-1">
              <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Product Name *</label>
              <input
                v-model="form.name"
                type="text"
                required
                placeholder="e.g. Flexy Banner 280gr"
                class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              />
            </div>

            <div>
              <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Category</label>
              <select
                v-model="form.category"
                class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              >
                <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
              </select>
            </div>

            <div>
              <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Sub Category</label>
              <select
                v-model="form.subCategory"
                class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              >
                <option v-for="s in subCategories" :key="s" :value="s">{{ s }}</option>
              </select>
            </div>

            <div>
              <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Unit</label>
              <select
                v-model="form.unit"
                class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              >
                <option v-for="u in units" :key="u" :value="u">{{ u }}</option>
              </select>
            </div>

            <div>
              <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Selling Type</label>
              <select
                v-model="form.sellingType"
                class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              >
                <option value="Single Price">Single Price</option>
                <option value="Size Calculation">Size Calculation</option>
                <option value="Quantity Tier">Quantity Tier</option>
              </select>
            </div>

            <div class="sm:col-span-2">
              <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Description</label>
              <textarea
                v-model="form.description"
                rows="3"
                placeholder="Enter product description..."
                class="w-full rounded-lg border border-gray-200 bg-white p-3 text-xs text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- 2. Pricing & Stocks -->
        <div class="space-y-4">
          <div class="flex items-center gap-2 border-b border-gray-200 pb-3 dark:border-gray-800">
            <FeatherIcon name="dollar-sign" size="18" class="text-primary" />
            <h6 class="text-base font-bold text-gray-900 dark:text-gray-100">Pricing & Stocks</h6>
          </div>

          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Product Type</label>
              <select
                v-model="form.productType"
                class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              >
                <option value="Single Product">Single Product</option>
                <option value="Variable Product">Variable Product</option>
              </select>
            </div>

            <div>
              <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Quantity Stock</label>
              <FormsNumberInput v-model="form.quantity" />
            </div>

            <div>
              <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Price (IDR)</label>
              <FormsNumberInput v-model="form.price" />
            </div>

            <div>
              <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Tax (%)</label>
              <FormsNumberInput v-model="form.tax" />
            </div>

            <div>
              <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Discount Type</label>
              <select
                v-model="form.discountType"
                class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              >
                <option value="Percentage">Percentage</option>
                <option value="Fixed">Fixed Amount</option>
              </select>
            </div>

            <div>
              <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Quantity Alert</label>
              <FormsNumberInput v-model="form.quantityAlert" />
            </div>
          </div>
        </div>

        <!-- 3. Images -->
        <div class="space-y-4">
          <div class="flex items-center gap-2 border-b border-gray-200 pb-3 dark:border-gray-800">
            <FeatherIcon name="image" size="18" class="text-primary" />
            <h6 class="text-base font-bold text-gray-900 dark:text-gray-100">Product Images</h6>
          </div>

          <div class="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 p-8 text-center hover:border-primary transition dark:border-gray-700">
            <div class="mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-orange-100 text-primary dark:bg-orange-950/40">
              <FeatherIcon name="upload-cloud" size="24" />
            </div>
            <p class="text-xs font-semibold text-gray-700 dark:text-gray-200">Drag and drop a file to upload or browse</p>
            <p class="mt-1 text-[11px] text-gray-400">Supports PNG, JPG, JPEG up to 5MB</p>
            <input type="file" accept="image/*" class="hidden" />
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
          <NuxtLink
            to="/product-list"
            class="rounded-lg bg-gray-100 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 transition"
          >
            Cancel
          </NuxtLink>
          <button
            type="submit"
            class="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow hover:bg-primary-600 transition"
          >
            Save Product
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

