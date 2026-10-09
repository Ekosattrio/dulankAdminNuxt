<script setup lang="ts">
import FeatherIcon from '~/components/common/FeatherIcon.vue'
import ImageUploadGrid from '~/components/common/ImageUploadGrid.vue'
import ProductAttributeModal from '~/components/pages/create-product/ProductAttributeModal.vue'
import ProductCategoryModal from '~/components/pages/create-product/ProductCategoryModal.vue'
import ProductInfoSection from '~/components/pages/create-product/ProductInfoSection.vue'
import ProductPricingSection from '~/components/pages/create-product/ProductPricingSection.vue'
import ProductVariationModal from '~/components/pages/create-product/ProductVariationModal.vue'
import { useProductEditor } from '~/composables/useProductEditor'

const {
  isEdit,
  busy,
  errorMessage,
  openInfo,
  openPricing,
  openImages,
  form,
  stores,
  categoryNames,
  subCategoryNames,
  unitNames,
  isCategoryModalOpen,
  isSubCategoryModalOpen,
  isUnitModalOpen,
  isAttributeModalOpen,
  isVariationModalOpen,
  editingVariant,
  generateCode,
  handleAddCategoryModal,
  handleCategoryCreate,
  handleSubCategoryCreate,
  handleUnitCreate,
  handleAttributeCreate,
  handleOpenVariationModal,
  handleVariationSubmit,
  submitProduct
} = useProductEditor()
</script>

<template>
  <div class="space-y-6">
    <!-- Page Header (Netlify style with Back to Product button) -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h4 class="text-lg font-bold text-gray-900 dark:text-gray-100">{{ isEdit ? 'Edit Product' : 'New Product' }}</h4>
        <p class="text-xs text-gray-500 dark:text-gray-400">{{ isEdit ? 'Update existing product' : 'Create new product' }}</p>
      </div>

      <div class="flex items-center gap-2">
        <NuxtLink
          to="/product-list"
          class="inline-flex h-9 items-center gap-2 rounded-md border border-gray-200 bg-white px-3.5 text-xs font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
        >
          <FeatherIcon name="arrow-left" :size="14" />
          <span>Back to Product</span>
        </NuxtLink>
      </div>
    </div>

    <!-- Error Alert -->
    <div
      v-if="errorMessage"
      class="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400"
    >
      <FeatherIcon name="alert-circle" :size="16" class="shrink-0" />
      <span>{{ errorMessage }}</span>
    </div>

    <form class="space-y-6" @submit.prevent="submitProduct">
      <!-- Card 1: Product Information -->
      <div class="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div
          class="flex cursor-pointer items-center justify-between border-b border-gray-100 px-5 py-3.5 transition hover:bg-gray-50/50 dark:border-gray-800 dark:hover:bg-gray-800/40"
          @click="openInfo = !openInfo"
        >
          <div class="flex items-center gap-2.5">
            <div class="flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary dark:bg-primary/20">
              <FeatherIcon name="info" :size="14" />
            </div>
            <h5 class="text-sm font-bold text-gray-900 dark:text-gray-100">Product Information</h5>
          </div>

          <button
            type="button"
            class="text-gray-400 transition hover:text-gray-600 focus:outline-none dark:hover:text-gray-200"
            :aria-expanded="openInfo"
          >
            <FeatherIcon :name="openInfo ? 'chevron-up' : 'chevron-down'" :size="16" />
          </button>
        </div>

        <div v-show="openInfo" class="p-5">
          <ProductInfoSection
            v-model:store="form.store"
            v-model:item-code="form.itemCode"
            v-model:name="form.name"
            v-model:category="form.category"
            v-model:sub-category="form.subCategory"
            v-model:unit="form.unit"
            v-model:selling-type="form.sellingType"
            v-model:description="form.description"
            :categories="categoryNames"
            :sub-categories="subCategoryNames"
            :units="unitNames"
            :stores="stores"
            :disabled="busy"
            @generate-code="generateCode"
            @add-category="handleAddCategoryModal"
            @add-sub-category="isSubCategoryModalOpen = true"
            @add-unit="isUnitModalOpen = true"
          />
        </div>
      </div>

      <!-- Card 2: Pricing Type -->
      <div class="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div
          class="flex cursor-pointer items-center justify-between border-b border-gray-100 px-5 py-3.5 transition hover:bg-gray-50/50 dark:border-gray-800 dark:hover:bg-gray-800/40"
          @click="openPricing = !openPricing"
        >
          <div class="flex items-center gap-2.5">
            <div class="flex size-7 items-center justify-center rounded-md bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
              <FeatherIcon name="life-buoy" :size="14" />
            </div>
            <h5 class="text-sm font-bold text-gray-900 dark:text-gray-100">Pricing Type</h5>
          </div>

          <button
            type="button"
            class="text-gray-400 transition hover:text-gray-600 focus:outline-none dark:hover:text-gray-200"
            :aria-expanded="openPricing"
          >
            <FeatherIcon :name="openPricing ? 'chevron-up' : 'chevron-down'" :size="16" />
          </button>
        </div>

        <div v-show="openPricing" class="p-5">
          <ProductPricingSection
            v-model:price-type="form.priceType"
            v-model:quantity="form.quantity"
            v-model:price="form.price"
            v-model:min-order-qty="form.minOrderQty"
            v-model:discount-type="form.discountType"
            v-model:discount-value="form.discountValue"
            v-model:tax-type="form.taxType"
            v-model:quantity-alert="form.quantityAlert"
            v-model:min-price="form.minPrice"
            v-model:druck-price="form.druckPrice"
            v-model:min-length="form.minLength"
            v-model:min-width="form.minWidth"
            v-model:variants="form.variants"
            v-model:selected-attribute="form.selectedAttribute"
            v-model:attribute-tags="form.attributeTags"
            :disabled="busy"
            @open-attribute-modal="isAttributeModalOpen = true"
            @open-variation-modal="handleOpenVariationModal"
          />
        </div>
      </div>

      <!-- Card 3: Images -->
      <div class="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div
          class="flex cursor-pointer items-center justify-between border-b border-gray-100 px-5 py-3.5 transition hover:bg-gray-50/50 dark:border-gray-800 dark:hover:bg-gray-800/40"
          @click="openImages = !openImages"
        >
          <div class="flex items-center gap-2.5">
            <div class="flex size-7 items-center justify-center rounded-md bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
              <FeatherIcon name="image" :size="14" />
            </div>
            <h5 class="text-sm font-bold text-gray-900 dark:text-gray-100">Images</h5>
          </div>

          <button
            type="button"
            class="text-gray-400 transition hover:text-gray-600 focus:outline-none dark:hover:text-gray-200"
            :aria-expanded="openImages"
          >
            <FeatherIcon :name="openImages ? 'chevron-up' : 'chevron-down'" :size="16" />
          </button>
        </div>

        <div v-show="openImages" class="p-5">
          <ImageUploadGrid
            v-model="form.images"
            :disabled="busy"
          />
        </div>
      </div>

      <!-- Footer Action Buttons -->
      <div class="flex items-center justify-end gap-3 pb-8 pt-2">
        <NuxtLink
          to="/product-list"
          class="min-w-28 rounded-md bg-[#212b36] px-5 py-2.5 text-center text-xs font-semibold text-white shadow-sm transition hover:bg-[#092c4c] focus:outline-none"
        >
          Cancel
        </NuxtLink>
        <button
          type="submit"
          :disabled="busy"
          class="min-w-32 rounded-md bg-[#ff9f43] px-6 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#f39334] focus:outline-none disabled:opacity-50"
        >
          {{ busy ? 'Saving Product...' : isEdit ? 'Update Product' : 'Save Product' }}
        </button>
      </div>
    </form>

    <!-- Modals -->
    <ProductCategoryModal
      :open="isCategoryModalOpen"
      :busy="busy"
      @close="isCategoryModalOpen = false"
      @submit="handleCategoryCreate"
    />

    <ProductCategoryModal
      :open="isSubCategoryModalOpen"
      :busy="busy"
      title="Add New Sub Category"
      label="Sub Category Name"
      placeholder="e.g. Brosur & Flyer"
      @close="isSubCategoryModalOpen = false"
      @submit="handleSubCategoryCreate"
    />

    <ProductCategoryModal
      :open="isUnitModalOpen"
      :busy="busy"
      title="Add New Unit"
      label="Unit Name"
      placeholder="e.g. Sheet"
      @close="isUnitModalOpen = false"
      @submit="handleUnitCreate"
    />

    <ProductAttributeModal
      :open="isAttributeModalOpen"
      :busy="busy"
      @close="isAttributeModalOpen = false"
      @submit="handleAttributeCreate"
    />

    <ProductVariationModal
      :open="isVariationModalOpen"
      :variant="editingVariant"
      :busy="busy"
      @close="
        isVariationModalOpen = false;
        editingVariant = null;
      "
      @submit="handleVariationSubmit"
    />
  </div>
</template>

