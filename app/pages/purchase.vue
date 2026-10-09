<<<<<<< HEAD
<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <CommonPageHeader title="Purchase List" subtitle="Manage your purchases">
      <template #actions>
        <div class="flex flex-wrap items-center gap-2">
          <button
            type="button"
            class="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 hover:text-primary dark:border-gray-700 dark:hover:bg-gray-800"
            title="Export PDF"
            @click="exportPdf"
          >
            <CommonFeatherIcon name="file-text" size="18" />
          </button>
          <button
            type="button"
            class="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 hover:text-primary dark:border-gray-700 dark:hover:bg-gray-800"
            title="Print"
            @click="printList"
          >
            <CommonFeatherIcon name="printer" size="18" />
          </button>
          <NuxtLink
            to="/add-purchase"
            class="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-600 focus:outline-none"
          >
            <CommonFeatherIcon name="plus" size="18" />
            <span>Add New Purchase</span>
          </NuxtLink>
        </div>
      </template>
    </CommonPageHeader>

    <!-- Purchase List Card -->
    <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <!-- Toolbar -->
      <div class="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div class="flex flex-wrap items-center gap-3">
          <CommonSearchFilter v-model="searchQuery" placeholder="Search..." />

          <!-- Date Range Picker (custom) -->
          <div class="relative">
            <input
              type="text"
              readonly
              placeholder="Date"
              :value="selectedDateRangeLabel"
              class="w-full h-10 cursor-pointer rounded-lg border border-gray-200 bg-white px-3 pe-4 text-sm text-gray-700 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              @click="showDateDropdown = !showDateDropdown"
            />
            <div
              v-if="showDateDropdown"
              class="absolute z-20 mt-1 w-48 rounded-lg border border-gray-200 bg-white p-1.5 shadow-lg dark:border-gray-700 dark:bg-gray-800"
            >
              <div class="cursor-pointer rounded px-2.5 py-1.5 text-xs text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700" @click="setDateRange('kemarin')">Kemarin</div>
              <div class="cursor-pointer rounded px-2.5 py-1.5 text-xs text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700" @click="setDateRange('7hari')">7 Hari Terakhir</div>
              <div class="cursor-pointer rounded px-2.5 py-1.5 text-xs text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700" @click="setDateRange('bulanIni')">Bulan Ini</div>
              <div class="cursor-pointer rounded px-2.5 py-1.5 text-xs text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700" @click="setDateRange('bulanLalu')">Bulan Lalu</div>
              <div class="cursor-pointer rounded px-2.5 py-1.5 text-xs text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700" @click="setDateRange('tahunLalu')">Tahun Lalu</div>
              <div class="cursor-pointer rounded px-2.5 py-1.5 text-xs text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700" @click="setDateRange('semua')">Semua</div>
            </div>
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <CommonFilterSelect
            v-model="statusFilter"
            allLabel="Status: All"
            :options="[
              { value: 'Complete', label: 'Complete' },
              { value: 'Pending', label: 'Pending' },
              { value: 'Ordered', label: 'Ordered' },
              { value: 'Received', label: 'Received' },
            ]"
          />
          <CommonFilterSelect
            v-model="paymentFilter"
            allLabel="Payment Status: All"
            :options="[
              { value: 'Paid', label: 'Paid' },
              { value: 'Unpaid', label: 'Unpaid' },
              { value: 'Partial', label: 'Partial' },
            ]"
          />
        </div>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="w-full text-start text-xs text-gray-700 dark:text-gray-300">
          <thead
            class="bg-gray-50 text-[11px] font-semibold uppercase text-gray-500 border-b border-gray-200 dark:bg-gray-800/50 dark:border-gray-700 dark:text-gray-400"
          >
            <tr>
              <th class="px-2 py-3 text-center whitespace-nowrap">Aksi</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">No Purchase</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Date</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Created</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Supplier</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Product</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Status</th>
              <th class="px-4 py-3 text-end whitespace-nowrap">Amount (IDR)</th>
              <th class="px-4 py-3 text-end whitespace-nowrap">Paid (IDR)</th>
              <th class="px-4 py-3 text-end whitespace-nowrap">Due (IDR)</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Payment</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Notes</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <tr v-for="item in filteredPurchases" :key="item.id" class="transition-colors hover:bg-gray-50/75 dark:hover:bg-gray-800/40">
              <td class="px-2 py-3 whitespace-nowrap">
                <CommonRowActions :item="item" show-view @view="viewPurchase(item)" @edit="editPurchase(item)" @delete="deletePurchase(item)">
                  <template #extra>
                    <NuxtLink
                      to="/purchase-order"
                      title="Create Purchase Order"
                      class="rounded-lg p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-emerald-600 dark:hover:bg-gray-800"
                    >
                      <CommonFeatherIcon name="plus-circle" size="16" />
                    </NuxtLink>
                  </template>
                </CommonRowActions>
              </td>
              <td class="px-4 py-3 whitespace-nowrap font-bold text-gray-900 dark:text-gray-100">{{ item.noPurchase }}</td>
              <td class="px-4 py-3 whitespace-nowrap">{{ item.date }}</td>
              <td class="px-4 py-3 whitespace-nowrap">{{ item.created }}</td>
              <td class="px-4 py-3 whitespace-nowrap">{{ item.supplier }}</td>
              <td class="px-4 py-3 whitespace-nowrap">{{ item.product }}</td>
              <td class="px-4 py-3 whitespace-nowrap">
                <CommonStatusPill
                  :status="item.status"
                  :tone="item.status === 'Pending' ? 'rose' : item.status === 'Ordered' ? 'amber' : 'emerald'"
                />
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-end font-semibold">{{ formatNumber(item.amount) }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-end text-emerald-600 dark:text-emerald-400">{{ formatNumber(item.paid) }}</td>
              <td :class="item.due > 0 ? 'px-4 py-3 whitespace-nowrap text-end text-rose-600 dark:text-rose-400' : 'px-4 py-3 whitespace-nowrap text-end text-gray-400'">
                {{ formatNumber(item.due) }}
              </td>
              <td class="px-4 py-3 whitespace-nowrap">
                <CommonStatusPill :status="item.paymentStatus" />
              </td>
              <td class="max-w-[180px] truncate px-4 py-3 whitespace-nowrap text-gray-500 dark:text-gray-400">{{ item.notes || "-" }}</td>
            </tr>
            <tr v-if="filteredPurchases.length === 0">
              <td colspan="12" class="p-8 text-center text-gray-400">No purchase records found.</td>
            </tr>
          </tbody>
          <tfoot class="border-t-2 border-gray-200 bg-gray-50/75 font-semibold text-gray-800 dark:border-gray-700 dark:bg-gray-800/60 dark:text-white">
            <tr>
              <td class="px-2 py-3"></td>
              <td class="px-4 py-3 text-start font-bold">Total</td>
              <td class="px-4 py-3" colspan="5"></td>
              <td class="px-4 py-3 text-end font-bold text-gray-900 dark:text-gray-100">{{ formatNumber(totalAmount) }}</td>
              <td class="px-4 py-3 text-end font-bold text-emerald-600 dark:text-emerald-400">{{ formatNumber(totalPaid) }}</td>
              <td class="px-4 py-3 text-end font-bold text-rose-600 dark:text-rose-400">{{ formatNumber(totalDue) }}</td>
              <td class="px-4 py-3" colspan="2"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>

    <!-- View Purchase Modal -->
    <CommonBaseModal v-model="showViewModal" title="Purchase" maxWidth="2xl">
      <div id="section-to-print" class="space-y-4">
        <!-- Header actions -->
        <div class="flex items-center justify-end gap-2 border-b border-gray-100 pb-3 dark:border-gray-800">
          <button
            type="button"
            class="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 hover:text-primary dark:border-gray-700 dark:hover:bg-gray-800"
            title="Edit"
            @click="openEditFromView"
          >
            <CommonFeatherIcon name="edit" size="16" />
          </button>
          <button
            type="button"
            class="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 hover:text-primary dark:border-gray-700 dark:hover:bg-gray-800"
            title="PDF"
            @click="exportPdf"
          >
            <CommonFeatherIcon name="file-text" size="16" />
          </button>
          <button
            type="button"
            class="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 hover:text-primary dark:border-gray-700 dark:hover:bg-gray-800"
            title="Print"
            @click="printModal"
          >
            <CommonFeatherIcon name="printer" size="16" />
          </button>
        </div>

        <!-- Top Info -->
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <h6 class="mb-1 text-sm font-bold text-gray-800 dark:text-gray-200">Supplier :</h6>
            <p class="text-sm leading-6 text-gray-500 dark:text-gray-400">
              {{ activePurchase?.supplier || "PT Cipta Kreasi" }}<br />
              ciptakreasi@gmail.com<br />
              62819 0685 5554<br />
              Cyber 2 Tower, Lantai 29, Jalan HR Rasuna Said,<br />
              X5 No. 13, Jakarta Selatan, 12950
            </p>
          </div>
          <div class="space-y-1 text-sm">
            <div class="font-bold text-gray-800 dark:text-gray-200">Purchase Info</div>
            <div class="flex justify-between text-gray-500 dark:text-gray-400">
              <span>No. Purchase</span><span class="text-gray-800 dark:text-gray-200">{{ activePurchase?.noPurchase }}</span>
            </div>
            <div class="flex justify-between text-gray-500 dark:text-gray-400">
              <span>Date</span><span class="text-gray-800 dark:text-gray-200">{{ activePurchase?.date }}</span>
            </div>
            <div class="flex justify-between text-gray-500 dark:text-gray-400">
              <span>Created</span><span class="text-gray-800 dark:text-gray-200">{{ activePurchase?.created }}</span>
            </div>
            <div class="flex justify-between text-gray-500 dark:text-gray-400">
              <span>Payment Status</span><span class="text-gray-800 dark:text-gray-200">{{ activePurchase?.paymentStatus }}</span>
            </div>
          </div>
        </div>

        <!-- Order Summary -->
        <div>
          <h6 class="mb-2 text-sm font-bold text-gray-800 dark:text-gray-200">Order Summary</h6>
          <div class="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
            <table class="w-full text-start text-xs text-gray-700 dark:text-gray-300">
              <thead class="bg-gray-50 text-[11px] font-semibold uppercase text-gray-500 dark:bg-gray-800/50 dark:text-gray-400">
                <tr>
                  <th class="w-[40%] px-3 py-2 text-start">Product Name</th>
                  <th class="px-3 py-2 text-start">Qty</th>
                  <th class="px-3 py-2 text-start">Unit</th>
                  <th class="px-3 py-2 text-start">Price (IDR)</th>
                  <th class="px-3 py-2 text-start">Amount (IDR)</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                <tr v-for="(p, idx) in viewOrderItems" :key="idx">
                  <td class="px-3 py-2 font-semibold text-gray-900 dark:text-gray-100">{{ p.name }}</td>
                  <td class="px-3 py-2">{{ p.qty }}</td>
                  <td class="px-3 py-2">{{ p.unit }}</td>
                  <td class="px-3 py-2">{{ formatNumber(p.price) }}</td>
                  <td class="px-3 py-2">{{ formatNumber(p.qty * p.price) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Notes & Summary -->
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <p class="text-sm font-bold text-gray-800 dark:text-gray-200">Notes :</p>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ activePurchase?.notes || "Pembelian Rutin Bulanan" }}</p>
          </div>
          <div class="rounded-lg border border-gray-100 dark:border-gray-800">
            <div class="flex justify-between px-3 py-2 text-sm text-gray-600 dark:text-gray-300">
              <span>Sub Total</span><span>{{ formatNumber(viewSubTotal) }}</span>
            </div>
            <div class="flex justify-between px-3 py-2 text-sm text-gray-600 dark:text-gray-300">
              <span>Tax (Ppn 11%)</span><span>{{ formatNumber(viewTax) }}</span>
            </div>
            <div class="flex justify-between rounded-b-lg bg-gray-50 px-3 py-2 text-sm font-bold text-gray-900 dark:bg-gray-800/60 dark:text-white">
              <span>Total (IDR)</span><span>{{ formatNumber(viewSubTotal + viewTax) }}</span>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end gap-3">
          <button
            type="button"
            class="rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
            @click="showViewModal = false"
          >
            Cancel
          </button>
          <button
            type="button"
            class="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white shadow transition hover:bg-primary-600"
            @click="showViewModal = false"
          >
            Close
          </button>
        </div>
      </template>
    </CommonBaseModal>

    <!-- Edit Purchase Modal -->
    <CommonBaseModal v-model="showEditModal" title="Edit Purchase" maxWidth="2xl">
      <form @submit.prevent="saveEditPurchase" class="space-y-4">
        <!-- Top Info -->
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <h6 class="mb-1 text-sm font-bold text-gray-800 dark:text-gray-200">Customer / Supplier :</h6>
            <p class="text-sm leading-6 text-gray-500 dark:text-gray-400">
              {{ editData.supplier }}<br />
              ciptakreasi@gmail.com<br />
              62819 0685 5554<br />
              Cyber 2 Tower, Lantai 29, Jalan HR Rasuna Said,<br />
              X5 No. 13, Jakarta Selatan, 12950
            </p>
          </div>
          <div class="space-y-2 text-sm">
            <div class="font-bold text-gray-800 dark:text-gray-200">Purchase Info</div>
            <CommonFormField label="No. Purchase">
              <input
                v-model="editData.noPurchase"
                type="text"
                class="w-full h-9 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              />
            </CommonFormField>
            <CommonFormField label="Date">
              <input
                v-model="editData.date"
                type="text"
                class="w-full h-9 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              />
            </CommonFormField>
            <CommonFormField label="Created">
              <input
                v-model="editData.created"
                type="text"
                class="w-full h-9 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              />
            </CommonFormField>
            <CommonFormField label="Payment Status">
              <select
                v-model="editData.paymentStatus"
                class="w-full h-9 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              >
                <option>Paid</option>
                <option>Unpaid</option>
                <option>Partial</option>
                <option>Refunded</option>
                <option>Pending</option>
              </select>
            </CommonFormField>
          </div>
        </div>

        <!-- Order Summary -->
        <div>
          <h6 class="mb-2 text-sm font-bold text-gray-800 dark:text-gray-200">Order Summary</h6>
          <div class="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
            <table class="w-full text-start text-xs text-gray-700 dark:text-gray-300">
              <thead class="bg-gray-50 text-[11px] font-semibold uppercase text-gray-500 dark:bg-gray-800/50 dark:text-gray-400">
                <tr>
                  <th class="w-[40%] px-3 py-2 text-start">Product Name</th>
                  <th class="px-3 py-2 text-start">Qty</th>
                  <th class="px-3 py-2 text-start">Unit</th>
                  <th class="px-3 py-2 text-start">Price (IDR)</th>
                  <th class="px-3 py-2 text-start">Amount (IDR)</th>
                  <th class="w-10 px-3 py-2"></th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                <tr v-for="(item, idx) in editItems" :key="idx">
                  <td class="px-3 py-1.5">
                    <input
                      v-model="item.name"
                      type="text"
                      class="w-full h-8 rounded-md border border-gray-200 bg-white px-2.5 text-xs text-gray-800 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                    />
                  </td>
                  <td class="px-3 py-1.5">
                    <div class="flex items-center gap-1">
                      <button
                        type="button"
                        class="flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 text-gray-500 transition hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
                        @click="item.qty > 1 ? item.qty-- : 1"
                      >
                        -
                      </button>
                      <input
                        v-model.number="item.qty"
                        type="number"
                        class="w-14 h-8 rounded-md border border-gray-200 bg-white px-1 text-center text-xs text-gray-800 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                      />
                      <button
                        type="button"
                        class="flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 text-gray-500 transition hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
                        @click="item.qty++"
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td class="px-3 py-1.5">
                    <select
                      v-model="item.unit"
                      class="w-full h-8 rounded-md border border-gray-200 bg-white px-2 text-xs text-gray-700 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                    >
                      <option>Ream</option>
                      <option>Pcs</option>
                      <option>Box</option>
                      <option>Kg</option>
                    </select>
                  </td>
                  <td class="px-3 py-1.5">
                    <input
                      v-model.number="item.price"
                      type="number"
                      class="w-full h-8 rounded-md border border-gray-200 bg-white px-2 text-end text-xs text-gray-800 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                    />
                  </td>
                  <td class="px-3 py-1.5 text-end font-bold">{{ formatNumber(item.qty * item.price) }}</td>
                  <td class="px-3 py-1.5 text-center">
                    <button type="button" class="rounded p-1 text-rose-500 transition hover:bg-rose-50 dark:hover:bg-rose-950" @click="removeEditItem(idx)">
                      <CommonFeatherIcon name="trash-2" size="14" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <button
            type="button"
            class="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-primary px-3 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary hover:text-white"
            @click="addEditItem"
          >
            <CommonFeatherIcon name="plus" size="14" />
            Add Product
          </button>
        </div>

        <!-- Notes & Summary -->
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <CommonFormField label="Notes">
            <textarea
              v-model="editData.notes"
              rows="3"
              class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            ></textarea>
          </CommonFormField>
          <div class="rounded-lg border border-gray-100 dark:border-gray-800">
            <div class="flex justify-between px-3 py-2 text-sm text-gray-600 dark:text-gray-300">
              <span>Sub Total</span><span>{{ formatNumber(editSubTotal) }}</span>
            </div>
            <div class="flex items-center justify-between px-3 py-2 text-sm text-gray-600 dark:text-gray-300">
              <span>Shipping Costs</span>
              <input
                v-model.number="editShipping"
                type="number"
                class="w-28 h-8 rounded-md border border-gray-200 bg-white px-2 text-end text-xs text-gray-800 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              />
            </div>
            <div class="flex justify-between px-3 py-2 text-sm text-gray-600 dark:text-gray-300">
              <span>Tax (Ppn 11%)</span><span>{{ formatNumber(editTax) }}</span>
            </div>
            <div class="flex justify-between rounded-b-lg bg-gray-50 px-3 py-2 text-sm font-bold text-gray-900 dark:bg-gray-800/60 dark:text-white">
              <span>Grand Total (IDR)</span><span>{{ formatNumber(editGrandTotal) }}</span>
            </div>
          </div>
        </div>

        <CommonModalFooter submitLabel="Save Changes" @cancel="showEditModal = false" />
      </form>
    </CommonBaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { formatNumber } from "~/composables/useFormatters";

// Sample Purchases Data
const { data: purchaseData } = await useFetch<Record<string, any[]>>('/api/purchase')
const purchases = ref(purchaseData.value?.purchases ?? []);

// Filter & Search
const searchQuery = ref("");
const statusFilter = ref("");
const paymentFilter = ref("");
const selectedDateRangeLabel = ref("");
const showDateDropdown = ref(false);

const setDateRange = (range: string) => {
  if (range === "kemarin") selectedDateRangeLabel.value = "Kemarin";
  else if (range === "7hari") selectedDateRangeLabel.value = "7 Hari Terakhir";
  else if (range === "bulanIni") selectedDateRangeLabel.value = "Bulan Ini";
  else if (range === "bulanLalu") selectedDateRangeLabel.value = "Bulan Lalu";
  else if (range === "tahunLalu") selectedDateRangeLabel.value = "Tahun Lalu";
  else selectedDateRangeLabel.value = "";
  showDateDropdown.value = false;
};

const filteredPurchases = computed(() => {
  return purchases.value.filter((p) => {
    const q = searchQuery.value.toLowerCase();
    const matchesSearch =
      !q ||
      p.noPurchase.toLowerCase().includes(q) ||
      p.supplier.toLowerCase().includes(q) ||
      p.product.toLowerCase().includes(q) ||
      p.created.toLowerCase().includes(q);

    const matchesStatus = !statusFilter.value || p.status.toLowerCase() === statusFilter.value.toLowerCase();
    const matchesPayment = !paymentFilter.value || p.paymentStatus.toLowerCase() === paymentFilter.value.toLowerCase();

    return matchesSearch && matchesStatus && matchesPayment;
  });
});

const totalAmount = computed(() => filteredPurchases.value.reduce((acc, curr) => acc + curr.amount, 0));
const totalPaid = computed(() => filteredPurchases.value.reduce((acc, curr) => acc + curr.paid, 0));
const totalDue = computed(() => filteredPurchases.value.reduce((acc, curr) => acc + curr.due, 0));

// View Modal
const showViewModal = ref(false);
const activePurchase = ref<any>(null);
const viewOrderItems = ref(purchaseData.value?.viewOrderItems ?? []);
const viewSubTotal = computed(() => viewOrderItems.value.reduce((acc, item) => acc + item.qty * item.price, 0));
const viewTax = computed(() => Math.round(viewSubTotal.value * 0.11));

const viewPurchase = (item: any) => {
  activePurchase.value = item;
  showViewModal.value = true;
};

// Edit Modal
const showEditModal = ref(false);
const editData = ref<any>({});
const editItems = ref<any[]>([]);
const editShipping = ref(125000);

const editSubTotal = computed(() => editItems.value.reduce((acc, item) => acc + (item.qty || 0) * (item.price || 0), 0));
const editTax = computed(() => Math.round((editSubTotal.value + editShipping.value) * 0.11));
const editGrandTotal = computed(() => editSubTotal.value + editShipping.value + editTax.value);

const editPurchase = (item: any) => {
  activePurchase.value = item;
  editData.value = { ...item };
  editItems.value = [{ name: "Brosur PPDB SMAN 1 Bandung", qty: 2, unit: "Ream", price: 450000 }];
  showEditModal.value = true;
};

const openEditFromView = () => {
  showViewModal.value = false;
  if (activePurchase.value) editPurchase(activePurchase.value);
};

const addEditItem = () => {
  editItems.value.push({ name: "", qty: 1, unit: "Pcs", price: 0 });
};

const removeEditItem = (idx: number) => {
  editItems.value.splice(idx, 1);
};

const saveEditPurchase = () => {
  if (!editData.value.id) return;
  const idx = purchases.value.findIndex((p) => p.id === editData.value.id);
  if (idx !== -1) {
    purchases.value[idx] = {
      ...purchases.value[idx],
      noPurchase: editData.value.noPurchase,
      date: editData.value.date,
      created: editData.value.created,
      paymentStatus: editData.value.paymentStatus,
      notes: editData.value.notes,
      amount: editGrandTotal.value,
    };
  }
  showEditModal.value = false;
};

const deletePurchase = (item: any) => {
  if (confirm(`Are you sure you want to delete purchase ${item.noPurchase}?`)) {
    purchases.value = purchases.value.filter((p) => p.id !== item.id);
  }
};

const printModal = () => {
  window.print();
};

const printList = () => {
  window.print();
};

const exportPdf = () => {
  window.print();
};

const toggleHeader = () => {
  // collapse header utility
};
useMockSync('purchase', purchases);
useMockSync('purchase', viewOrderItems);
</script>
=======
<script setup lang="ts">
import type { Purchase, PurchaseFormData } from '#server/types/purchase'
import { usePurchases } from '~/composables/usePurchases'
import { useSuppliers } from '~/composables/useSuppliers'
import { usePurchaseItems } from '~/composables/usePurchaseItems'
import { useTablePrint } from '~/composables/useTablePrint'
import { formatNumber } from '~/composables/useFormatters'
import SalesListHeader from '~/components/sales/SalesListHeader.vue'
import SalesFeedback from '~/components/sales/SalesFeedback.vue'
import SalesConfirmDelete from '~/components/sales/SalesConfirmDelete.vue'
import DocumentPrintModal from '~/components/common/DocumentPrintModal.vue'
import PurchaseStatsWidgets from '~/components/pages/purchase/PurchaseStatsWidgets.vue'
import PurchaseRecordsTable from '~/components/pages/purchase/PurchaseRecordsTable.vue'
import PurchaseDetailModal from '~/components/pages/purchase/PurchaseDetailModal.vue'
import PurchaseFormModal from '~/components/pages/purchase/PurchaseFormModal.vue'

definePageMeta({
  layout: 'default'
})

useLegacyPage({
  title: 'Purchase List - Transaksi Pembelian',
  sweetAlert: false
})

// Filter states
const searchQuery = ref('')
const filterStatus = ref('')
const filterPaymentStatus = ref('')

const filterParams = computed(() => ({
  search: searchQuery.value,
  status: filterStatus.value,
  paymentStatus: filterPaymentStatus.value,
}))

const { purchases, pending, error, refresh, savePurchase, deletePurchase } = usePurchases(filterParams)
const { suppliers } = useSuppliers()
const { items: catalogItems } = usePurchaseItems()

const supplierOptions = computed(() => {
  if (suppliers.value && suppliers.value.length > 0) {
    return suppliers.value.map(s => s.name)
  }
  return ['PT Kertas Jaya', 'CV Kimia Prima', 'Global Inkindo', 'PT Sinar Grafika']
})

// KPI stats calculation
const stats = computed(() => {
  const all = purchases.value
  const totalPurchases = all.length
  const totalAmount = all.reduce((sum, p) => sum + (Number(p.amount) || 0), 0)
  const totalPaid = all.reduce((sum, p) => sum + (Number(p.paid) || 0), 0)
  const totalDue = all.reduce((sum, p) => sum + (Number(p.due) || 0), 0)

  return {
    totalPurchases,
    totalAmount,
    totalPaid,
    totalDue,
  }
})

// Modal states
const isFormModalOpen = ref(false)
const isDetailModalOpen = ref(false)
const isEditMode = ref(false)
const activePurchaseForEdit = ref<Purchase | null>(null)
const activePurchaseForDetail = ref<Purchase | null>(null)
const purchaseToDelete = ref<Purchase | null>(null)
const isBusy = ref(false)

// Toast feedback
const toastMessage = ref('')

function showToast(msg: string) {
  toastMessage.value = msg
}

// Handlers
function handleAdd() {
  isEditMode.value = false
  activePurchaseForEdit.value = null
  isFormModalOpen.value = true
}

function handleView(purchase: Purchase) {
  activePurchaseForDetail.value = purchase
  isDetailModalOpen.value = true
}

function handleEdit(purchase: Purchase) {
  isDetailModalOpen.value = false
  isEditMode.value = true
  activePurchaseForEdit.value = purchase
  isFormModalOpen.value = true
}

function handleDeleteRequest(purchase: Purchase) {
  purchaseToDelete.value = purchase
}

async function handleFormSubmit(formData: PurchaseFormData) {
  isBusy.value = true
  try {
    const res = await savePurchase(formData)
    isFormModalOpen.value = false
    showToast(res.message || (isEditMode.value ? 'Purchase updated successfully' : 'Purchase created successfully'))
  } catch (err: any) {
    showToast(err?.data?.message || err?.message || 'Failed to save purchase')
  } finally {
    isBusy.value = false
  }
}

async function confirmDelete() {
  if (!purchaseToDelete.value) return
  isBusy.value = true
  try {
    await deletePurchase(purchaseToDelete.value.id)
    showToast(`Purchase '${purchaseToDelete.value.noPurchase}' deleted successfully`)
    purchaseToDelete.value = null
  } catch (err: any) {
    showToast(err?.data?.message || err?.message || 'Failed to delete purchase')
  } finally {
    isBusy.value = false
  }
}

// Print & Export
const { isPrintModalOpen, defaultPrintAction, openPrintModal, closePrintModal } = useTablePrint()

const printColumns = [
  { key: 'noPurchase', label: 'No Purchase' },
  { key: 'date', label: 'Date' },
  { key: 'supplier', label: 'Supplier' },
  { key: 'product', label: 'Product' },
  { key: 'status', label: 'Status', align: 'center' as const },
  { key: 'amountFormatted', label: 'Amount (IDR)', align: 'right' as const },
  { key: 'paidFormatted', label: 'Paid (IDR)', align: 'right' as const },
  { key: 'dueFormatted', label: 'Due (IDR)', align: 'right' as const },
  { key: 'paymentStatus', label: 'Payment', align: 'center' as const },
]

const printablePurchases = computed(() =>
  purchases.value.map(p => ({
    ...p,
    amountFormatted: `Rp ${formatNumber(p.amount)}`,
    paidFormatted: `Rp ${formatNumber(p.paid)}`,
    dueFormatted: `Rp ${formatNumber(p.due)}`,
  }))
)

function handleExportExcel() {
  const header = ['No Purchase', 'Date', 'Supplier', 'Product', 'Status', 'Amount', 'Paid', 'Due', 'Payment Status', 'Notes']
  const rows = purchases.value.map(p => [
    `"${p.noPurchase}"`,
    `"${p.date}"`,
    `"${p.supplier}"`,
    `"${(p.product || '').replace(/"/g, '""')}"`,
    `"${p.status}"`,
    `"${p.amount}"`,
    `"${p.paid}"`,
    `"${p.due}"`,
    `"${p.paymentStatus}"`,
    `"${(p.notes || '').replace(/"/g, '""')}"`,
  ])

  const csvContent = 'data:text/csv;charset=utf-8,' + [header.join(','), ...rows.map(r => r.join(','))].join('\n')
  const encodedUri = encodeURI(csvContent)
  const link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', `purchases_export_${new Date().toISOString().slice(0, 10)}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  showToast('Purchases data exported to CSV successfully')
}
</script>

<template>
  <div class="space-y-4 p-4 md:p-6">
    <!-- Header -->
    <SalesListHeader
      title="Purchase List"
      subtitle="Manage your purchases and supplier bills"
      add-label="Add New Purchase"
      @add="handleAdd"
      @refresh="refresh"
      @print="openPrintModal('print')"
      @export-pdf="openPrintModal('pdf')"
      @export-excel="handleExportExcel"
    />

    <!-- KPI Stats Widgets -->
    <PurchaseStatsWidgets :stats="stats" />

    <!-- Feedback Toast -->
    <SalesFeedback
      v-if="toastMessage"
      :message="toastMessage"
      @dismiss="toastMessage = ''"
    />

    <!-- Skeleton & Error Feedback -->
    <SalesFeedback
      :pending="pending"
      skeleton="table"
      :skeleton-cols="10"
      :skeleton-rows="6"
      :error="error ? (error.message || 'Failed to load purchases. Please try again.') : ''"
      @retry="refresh"
    />

    <!-- Records Table -->
    <PurchaseRecordsTable
      v-if="!pending && !error"
      :purchases="purchases"
      :search-query="searchQuery"
      :filter-status="filterStatus"
      :filter-payment-status="filterPaymentStatus"
      @update:search-query="searchQuery = $event"
      @update:filter-status="filterStatus = $event"
      @update:filter-payment-status="filterPaymentStatus = $event"
      @view="handleView"
      @edit="handleEdit"
      @delete="handleDeleteRequest"
    />

    <!-- Purchase Detail Modal -->
    <PurchaseDetailModal
      :open="isDetailModalOpen"
      :purchase="activePurchaseForDetail"
      @close="isDetailModalOpen = false"
      @edit="handleEdit"
    />

    <!-- Add / Edit Modal -->
    <PurchaseFormModal
      :open="isFormModalOpen"
      :is-edit="isEditMode"
      :purchase-data="activePurchaseForEdit"
      :supplier-options="supplierOptions"
      :catalog-items="catalogItems"
      :busy="isBusy"
      @close="isFormModalOpen = false"
      @submit="handleFormSubmit"
    />

    <!-- Delete Confirmation Modal -->
    <SalesConfirmDelete
      :open="!!purchaseToDelete"
      title="Delete Purchase"
      :message="`Are you sure you want to delete purchase '${purchaseToDelete?.noPurchase}' from supplier ${purchaseToDelete?.supplier}? This action cannot be undone.`"
      :busy="isBusy"
      @close="purchaseToDelete = null"
      @confirm="confirmDelete"
    />

    <!-- Table Print / PDF Preview Modal -->
    <DocumentPrintModal
      v-if="isPrintModalOpen"
      :open="isPrintModalOpen"
      title="Laporan Transaksi Pembelian (Purchase List)"
      :columns="printColumns"
      :items="printablePurchases"
      date-field="date"
      :default-action="defaultPrintAction"
      @close="closePrintModal"
    />
  </div>
</template>
>>>>>>> origin/eko
