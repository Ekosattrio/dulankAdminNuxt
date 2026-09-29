<script setup lang="ts">
import { formatRupiah } from "~/composables/useFormatters";

const product = reactive({
  name: "Flexy 280gr Banner",
  category: "Large Format",
  subCategory: "Print Outdoor",
  priceType: "Size Calculation",
  unit: "Meter",
  sku: "PT0001",
  minQty: 1,
  quantity: 500,
  tax: 11,
  discountType: "Percentage",
  price: 15000,
  status: "Active",
  description:
    "Bahan spanduk flexy standard 280gr dengan ketahanan outdoor tahan air dan panas cuaca hingga 6 bulan. Cocok untuk spanduk event, promosi, dan baliho.",
  barcodeImg: "/assets/img/barcode/barcode1.png",
  images: ["/assets/img/products/product69.jpg"],
});
</script>

<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <CommonPageHeader title="Product Details" subtitle="Full details of a product">
      <template #actions>
        <div class="flex items-center gap-2">
          <NuxtLink
            to="/product-list"
            class="inline-flex items-center gap-2 rounded-lg bg-gray-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-700"
          >
            <FeatherIcon name="arrow-left" size="18" />
            <span>Back to Product List</span>
          </NuxtLink>
          <NuxtLink
            to="/create-product"
            class="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-600"
          >
            <FeatherIcon name="edit" size="18" />
            <span>Edit Product</span>
          </NuxtLink>
        </div>
      </template>
    </CommonPageHeader>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <!-- Main Details (Left 2 cols) -->
      <div class="lg:col-span-2 space-y-6">
        <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <!-- Barcode section -->
          <div class="mb-6 flex items-center justify-between border-b border-gray-100 pb-4 dark:border-gray-800">
            <div class="flex items-center gap-3">
              <img :src="product.barcodeImg" alt="Barcode" class="h-10 object-contain" />
              <span class="font-mono text-xs font-bold text-gray-700 dark:text-gray-300">{{ product.sku }}</span>
            </div>
            <button
              type="button"
              class="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              onclick="window.print()"
            >
              <FeatherIcon name="printer" size="14" />
              <span>Print Barcode</span>
            </button>
          </div>

          <!-- Product Specification List -->
          <div class="divide-y divide-gray-100 text-xs dark:divide-gray-800">
            <div class="grid grid-cols-3 py-2.5">
              <span class="font-semibold text-gray-500">Product</span>
              <span class="col-span-2 font-bold text-gray-900 dark:text-gray-100">{{ product.name }}</span>
            </div>

            <div class="grid grid-cols-3 py-2.5">
              <span class="font-semibold text-gray-500">Category</span>
              <span class="col-span-2 text-gray-800 dark:text-gray-200">{{ product.category }}</span>
            </div>

            <div class="grid grid-cols-3 py-2.5">
              <span class="font-semibold text-gray-500">Sub Category</span>
              <span class="col-span-2 text-gray-800 dark:text-gray-200">{{ product.subCategory }}</span>
            </div>

            <div class="grid grid-cols-3 py-2.5">
              <span class="font-semibold text-gray-500">Price Type</span>
              <span class="col-span-2 text-gray-800 dark:text-gray-200">{{ product.priceType }}</span>
            </div>

            <div class="grid grid-cols-3 py-2.5">
              <span class="font-semibold text-gray-500">Unit</span>
              <span class="col-span-2 text-gray-800 dark:text-gray-200">{{ product.unit }}</span>
            </div>

            <div class="grid grid-cols-3 py-2.5">
              <span class="font-semibold text-gray-500">SKU</span>
              <span class="col-span-2 font-mono text-gray-800 dark:text-gray-200">{{ product.sku }}</span>
            </div>

            <div class="grid grid-cols-3 py-2.5">
              <span class="font-semibold text-gray-500">Minimum Qty</span>
              <span class="col-span-2 text-gray-800 dark:text-gray-200">{{ product.minQty }}</span>
            </div>

            <div class="grid grid-cols-3 py-2.5">
              <span class="font-semibold text-gray-500">Quantity</span>
              <span class="col-span-2 font-semibold text-gray-800 dark:text-gray-200">{{ product.quantity }}</span>
            </div>

            <div class="grid grid-cols-3 py-2.5">
              <span class="font-semibold text-gray-500">Tax</span>
              <span class="col-span-2 text-gray-800 dark:text-gray-200">{{ product.tax }} %</span>
            </div>

            <div class="grid grid-cols-3 py-2.5">
              <span class="font-semibold text-gray-500">Discount Type</span>
              <span class="col-span-2 text-gray-800 dark:text-gray-200">{{ product.discountType }}</span>
            </div>

            <div class="grid grid-cols-3 py-2.5">
              <span class="font-semibold text-gray-500">Price</span>
              <span class="col-span-2 font-mono font-bold text-base text-primary">{{ formatRupiah(product.price) }}</span>
            </div>

            <div class="grid grid-cols-3 py-2.5">
              <span class="font-semibold text-gray-500">Status</span>
              <div class="col-span-2">
                <span
                  class="inline-flex rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                >
                  {{ product.status }}
                </span>
              </div>
            </div>

            <div class="grid grid-cols-3 py-2.5">
              <span class="font-semibold text-gray-500">Description</span>
              <span class="col-span-2 text-gray-700 dark:text-gray-300 leading-relaxed">{{ product.description }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Media & Images (Right 1 col) -->
      <div class="space-y-6">
        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h6 class="mb-4 text-xs font-bold uppercase tracking-wider text-gray-400">Product Image</h6>
          <div
            class="overflow-hidden rounded-xl border border-gray-100 bg-gray-50 p-4 text-center dark:border-gray-800 dark:bg-gray-800"
          >
            <img
              :src="product.images[0]"
              alt="Product photo"
              class="mx-auto h-48 rounded-lg object-cover"
              onerror="this.src = '/assets/img/product/product1.jpg'"
            />
            <p class="mt-3 text-xs font-semibold text-gray-800 dark:text-gray-200">{{ product.name }}.jpg</p>
            <p class="text-[10px] text-gray-400">Main Product Image</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
