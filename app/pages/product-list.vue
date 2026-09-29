<script setup lang="ts">import { formatRupiah } from "~/composables/useFormatters";

const { data: productListData } = await useFetch<ProductListRecord[]>('/api/product-list')
const products = ref<ProductListRecord[]>(productListData.value ?? []);

const searchQuery = ref("");
const selectedCategory = ref("");

const filteredProducts = computed(() => {
  return products.value.filter((p) => {
    const matchSearch =
      !searchQuery.value ||
      p.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      p.code.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      p.subCategory.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchCat = !selectedCategory.value || p.category === selectedCategory.value;
    return matchSearch && matchCat;
  });
});

const columns = [
  { key: "code", label: "Item Code" },
  { key: "name", label: "Product" },
  { key: "category", label: "Category" },
  { key: "subCategory", label: "Sub Category" },
  { key: "unit", label: "Unit" },
  { key: "price", label: "Price (IDR)" },
  { key: "priceType", label: "Price Type" },
  { key: "created", label: "Created" },
  { key: "action", label: "Action", class: "text-end no-sort" },
];

// Modal Import
const isImportModalOpen = ref(false);

const deleteProduct = (id: string) => {
  if (confirm("Are you sure you want to delete this product?")) {
    products.value = products.value.filter((p) => p.id !== id);
  }
};</script>

<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <CommonPageHeader title="Product List" subtitle="Manage your products">
      <template #actions>
        <div class="flex items-center gap-2">
          <button
            type="button"
            class="inline-flex items-center gap-2 rounded-lg bg-gray-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-700"
            @click="isImportModalOpen = true"
          >
            <CommonFeatherIcon name="download" size="18" />
            <span>Import Product</span>
          </button>
          <NuxtLink
            to="/create-product"
            class="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-600 focus:outline-none"
          >
            <CommonFeatherIcon name="plus-circle" size="18" />
            <span>Add New Product</span>
          </NuxtLink>
        </div>
      </template>
    </CommonPageHeader>

    <!-- Table Card -->
    <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div class="relative w-64">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search product..."
            class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 pe-8 text-sm text-gray-800 placeholder-gray-400 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          />
          <span class="pointer-events-none absolute inset-y-0 end-0 flex items-center pe-2.5 text-gray-400">
            <CommonFeatherIcon name="search" size="16" />
          </span>
        </div>

        <div class="flex items-center gap-3">
          <select
            v-model="selectedCategory"
            class="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          >
            <option value="">Category: All</option>
            <option value="Large Format">Large Format</option>
            <option value="Digital Print">Digital Print</option>
            <option value="Offset Print">Offset Print</option>
            <option value="Finishing & Merchandise">Finishing & Merchandise</option>
            <option value="Merchandise">Merchandise</option>
            <option value="Display Promo">Display Promo</option>
            <option value="Sablon & Tekstil">Sablon & Tekstil</option>
          </select>
        </div>
      </div>

      <TableDataTable :columns="columns" :rows="filteredProducts">
        <template #cell(code)="{ row }">
          <span class="font-mono font-semibold text-primary">{{ row.code }}</span>
        </template>

        <template #cell(name)="{ row }">
          <span class="font-semibold text-gray-900 dark:text-gray-100">{{ row.name }}</span>
        </template>

        <template #cell(category)="{ row }">
          <span
            class="inline-flex rounded-full bg-orange-50 px-2.5 py-0.5 text-xs font-medium text-primary dark:bg-orange-950/40 dark:text-primary"
          >
            {{ row.category }}
          </span>
        </template>

        <template #cell(subCategory)="{ row }">
          <span class="text-xs text-gray-600 dark:text-gray-400">{{ row.subCategory }}</span>
        </template>

        <template #cell(unit)="{ row }">
          <span class="inline-flex rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-700 dark:bg-gray-800 dark:text-gray-300">
            {{ row.unit }}
          </span>
        </template>

        <template #cell(price)="{ row }">
          <span class="font-mono font-medium text-gray-900 dark:text-gray-100">{{ formatRupiah(row.price) }}</span>
        </template>

        <template #cell(priceType)="{ row }">
          <span class="text-xs text-gray-500">{{ row.priceType }}</span>
        </template>

        <template #cell(created)="{ row }">
          <span class="text-[11px] text-gray-500">{{ row.created }}</span>
        </template>

        <template #cell(action)="{ row }">
          <div class="flex items-center justify-end gap-2">
            <NuxtLink
              :to="`/product-details?id=${row.id}`"
              class="rounded-lg p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-primary dark:hover:bg-gray-800"
              title="View"
            >
              <CommonFeatherIcon name="eye" size="16" />
            </NuxtLink>
            <NuxtLink
              :to="`/create-product?id=${row.id}`"
              class="rounded-lg p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-amber-500 dark:hover:bg-gray-800"
              title="Edit"
            >
              <CommonFeatherIcon name="edit" size="16" />
            </NuxtLink>
            <button
              type="button"
              class="rounded-lg p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-rose-600 dark:hover:bg-gray-800"
              title="Delete"
              @click="deleteProduct(row.id)"
            >
              <CommonFeatherIcon name="trash-2" size="16" />
            </button>
          </div>
        </template>
      </TableDataTable>
    </div>

    <!-- Modal Import Product -->
    <ModalBaseModal v-model="isImportModalOpen" title="Import Product" size="md">
      <div class="space-y-4">
        <p class="text-xs text-gray-600 dark:text-gray-400">Upload an Excel (.xlsx) or CSV file containing product list.</p>

        <div
          class="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 p-8 text-center hover:border-primary transition dark:border-gray-700"
        >
          <CommonFeatherIcon name="upload-cloud" size="32" class="text-gray-400 mb-2" />
          <p class="text-xs font-semibold text-gray-700 dark:text-gray-200">Drag & drop files or click to browse</p>
          <input type="file" accept=".xlsx,.csv" class="hidden" />
        </div>

        <div class="flex justify-end gap-3 pt-3 border-t border-gray-200 dark:border-gray-800">
          <button
            type="button"
            class="rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
            @click="isImportModalOpen = false"
          >
            Cancel
          </button>
          <button
            type="button"
            class="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white shadow hover:bg-primary-600 transition"
            @click="isImportModalOpen = false"
          >
            Upload
          </button>
        </div>
      </div>
    </ModalBaseModal>
  </div>
</template>
