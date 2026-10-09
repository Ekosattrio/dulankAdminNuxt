<template>
<<<<<<< HEAD
  <div class="space-y-6">
    <!-- Page Header -->
    <CommonPageHeader title="Discount" subtitle="Manage your discount">
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
            @click="printTable"
          >
            <CommonFeatherIcon name="printer" size="18" />
          </button>
          <button
            type="button"
            class="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 hover:text-primary dark:border-gray-700 dark:hover:bg-gray-800"
            title="Refresh"
            @click="refresh"
          >
            <CommonFeatherIcon name="rotate-ccw" size="18" />
          </button>
          <button
            type="button"
            class="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-600 focus:outline-none"
            @click="openAddModal"
          >
            <CommonFeatherIcon name="plus" size="18" />
            <span>Add Discount</span>
          </button>
        </div>
      </template>
    </CommonPageHeader>

    <!-- Table List Card -->
    <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <!-- Toolbar -->
      <div class="mb-5 flex flex-wrap items-center justify-between gap-4">
        <CommonSearchFilter v-model="searchQuery" placeholder="Search discount name..." />
        <div class="flex flex-wrap items-center gap-3">
          <CommonFilterSelect
            v-model="filterPlan"
            allLabel="All Plans"
            :options="[
              { value: 'Standard', label: 'Standard' },
              { value: 'Membership', label: 'Membership' },
            ]"
          />
          <CommonFilterSelect
            v-model="filterStatus"
            allLabel="All Status"
            :options="[
              { value: 'Active', label: 'Active' },
              { value: 'Inactive', label: 'Inactive' },
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
              <th class="px-4 py-3 text-start whitespace-nowrap">Name</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Value</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Discount Plan</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Validity</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Days</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Products</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Used</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Status</th>
              <th class="px-4 py-3 text-end whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <tr v-for="item in filteredDiscounts" :key="item.id" class="transition-colors hover:bg-gray-50/75 dark:hover:bg-gray-800/40">
              <td class="px-4 py-3 whitespace-nowrap font-medium text-gray-900 dark:text-gray-100">{{ item.name }}</td>
              <td class="px-4 py-3 whitespace-nowrap">{{ item.valueText }}</td>
              <td class="px-4 py-3 whitespace-nowrap">{{ item.plan }}</td>
              <td class="px-4 py-3 whitespace-nowrap">{{ item.validity }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-gray-500 dark:text-gray-400">{{ item.days.join(', ') }}</td>
              <td class="px-4 py-3 whitespace-nowrap">{{ item.products }}</td>
              <td class="px-4 py-3 whitespace-nowrap">{{ item.used }}</td>
              <td class="px-4 py-3 whitespace-nowrap">
                <CommonStatusPill :status="item.status" />
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-end">
                <CommonRowActions :item="item" @edit="openEditModal(item)" @delete="deleteItem(item.id)" />
              </td>
            </tr>
            <tr v-if="filteredDiscounts.length === 0">
              <td colspan="9" class="p-8 text-center text-gray-400">No discounts found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add Discount Modal -->
    <CommonBaseModal v-model="showAddModal" title="Add Discount" maxWidth="lg">
      <form @submit.prevent="saveDiscount" class="space-y-4">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <CommonFormField label="Discount Name" required>
            <input
              v-model="formData.name"
              type="text"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              required
              placeholder="e.g. Weekend Deal"
            />
          </CommonFormField>
          <CommonFormField label="Discount Plan" required>
            <select
              v-model="formData.plan"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              required
            >
              <option value="">Select</option>
              <option value="Standard">Standard</option>
              <option value="Membership">Membership</option>
            </select>
          </CommonFormField>
          <CommonFormField label="Applicable For" required>
            <select
              v-model="formData.products"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              required
            >
              <option value="All Products">All Products</option>
              <option value="Specific Products">Specific Products</option>
            </select>
          </CommonFormField>
        </div>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <CommonFormField label="Valid From" required>
            <input
              v-model="formData.validFrom"
              type="date"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              required
            />
          </CommonFormField>
          <CommonFormField label="Valid Till" required>
            <input
              v-model="formData.validTill"
              type="date"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              required
            />
          </CommonFormField>
          <CommonFormField label="Discount Type" required>
            <div class="flex gap-2">
              <select
                v-model="formData.type"
                class="w-32 h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              >
                <option value="Percentage">Percentage</option>
                <option value="Flat">Flat</option>
              </select>
              <input
                v-model.number="formData.value"
                type="number"
                class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                placeholder="Value"
                required
                min="1"
              />
            </div>
          </CommonFormField>
        </div>
        <CommonFormField label="Valid on Following Days" required>
          <div class="flex flex-wrap gap-2">
            <label
              v-for="day in daysOfWeek"
              :key="day"
              class="flex cursor-pointer items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <input v-model="formData.days" type="checkbox" :value="day" class="h-3.5 w-3.5 accent-primary" />
              {{ day }}
            </label>
          </div>
        </CommonFormField>
        <CommonModalFooter @cancel="closeModal" />
      </form>
    </CommonBaseModal>

    <!-- Edit Discount Modal -->
    <CommonBaseModal v-model="showEditModal" title="Edit Discount" maxWidth="lg">
      <form @submit.prevent="updateDiscount" class="space-y-4">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <CommonFormField label="Discount Name" required>
            <input
              v-model="formData.name"
              type="text"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              required
            />
          </CommonFormField>
          <CommonFormField label="Discount Plan" required>
            <select
              v-model="formData.plan"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              required
            >
              <option value="Standard">Standard</option>
              <option value="Membership">Membership</option>
            </select>
          </CommonFormField>
          <CommonFormField label="Applicable For" required>
            <select
              v-model="formData.products"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              required
            >
              <option value="All Products">All Products</option>
              <option value="Specific Products">Specific Products</option>
            </select>
          </CommonFormField>
        </div>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <CommonFormField label="Valid From" required>
            <input
              v-model="formData.validFrom"
              type="text"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              required
            />
          </CommonFormField>
          <CommonFormField label="Valid Till" required>
            <input
              v-model="formData.validTill"
              type="text"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              required
            />
          </CommonFormField>
          <CommonFormField label="Discount Type" required>
            <div class="flex gap-2">
              <select
                v-model="formData.type"
                class="w-32 h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              >
                <option value="Percentage">Percentage</option>
                <option value="Flat">Flat</option>
              </select>
              <input
                v-model.number="formData.value"
                type="number"
                class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                required
                min="1"
              />
            </div>
          </CommonFormField>
        </div>
        <CommonFormField label="Valid on Following Days" required>
          <div class="flex flex-wrap gap-2">
            <label
              v-for="day in daysOfWeek"
              :key="day"
              class="flex cursor-pointer items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <input v-model="formData.days" type="checkbox" :value="day" class="h-3.5 w-3.5 accent-primary" />
              {{ day }}
            </label>
          </div>
        </CommonFormField>
        <CommonModalFooter @cancel="closeModal" />
      </form>
    </CommonBaseModal>
  </div>
</template>

<script setup lang="ts">import { ref, computed } from 'vue'

useHead({
  title: 'Discount - Kacetak System'
})

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const { data: discountData } = await useFetch<DiscountItem[]>('/api/discount')
const discounts = ref<DiscountItem[]>(discountData.value ?? [])
useMockSync('discount', discounts)
=======
  <div class="page-wrapper mt-3">
    <div class="content">
      <div class="page-header">
        <div class="add-item d-flex">
          <div class="page-title">
            <h4>Discount</h4>
            <h6>Manage your discount</h6>
          </div>
        </div>
        <ul class="table-top-head">
          <li>
            <a title="Pdf" href="javascript:void(0);" @click="exportPdf"><img src="/assets/img/icons/pdf.svg" alt="img" /></a>
          </li>
          <li>
            <a title="Print" href="javascript:void(0);" @click="printTable"><i class="ti ti-printer"></i></a>
          </li>
          <li>
            <a title="Refresh" href="javascript:void(0);" @click="refresh"><i class="ti ti-rotate"></i></a>
          </li>
          <li>
            <a title="Collapse" href="javascript:void(0);" @click="toggleCollapse"><i class="ti ti-chevron-up"></i></a>
          </li>
        </ul>
        <div class="page-btn">
          <button type="button" class="btn btn-primary" @click="openAddModal">
            <i class="ti ti-circle-plus me-1"></i>Add Discount
          </button>
        </div>
      </div>

      <!-- Table List Card -->
      <div class="card table-list-card">
        <div class="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
          <div class="search-set">
            <div class="search-input">
              <span class="btn-searchset"><i class="ti ti-search fs-14"></i></span>
              <input v-model="searchQuery" type="text" class="form-control" placeholder="Search discount name..." />
            </div>
          </div>
          <div class="d-flex table-dropdown my-xl-auto right-content align-items-center flex-wrap row-gap-3">
            <div class="dropdown me-2">
              <button
                type="button"
                class="dropdown-toggle btn btn-white d-inline-flex align-items-center"
                data-bs-toggle="dropdown"
              >
                {{ filterPlan || 'Discount Plan' }}
                <i class="ti ti-chevron-down ms-1"></i>
              </button>
              <ul class="dropdown-menu dropdown-menu-end p-2">
                <li><a href="javascript:void(0);" class="dropdown-item rounded-1" @click="filterPlan = ''">All Plans</a></li>
                <li><a href="javascript:void(0);" class="dropdown-item rounded-1" @click="filterPlan = 'Standard'">Standard</a></li>
                <li><a href="javascript:void(0);" class="dropdown-item rounded-1" @click="filterPlan = 'Membership'">Membership</a></li>
              </ul>
            </div>
            <div class="dropdown">
              <button
                type="button"
                class="dropdown-toggle btn btn-white d-inline-flex align-items-center"
                data-bs-toggle="dropdown"
              >
                {{ filterStatus || 'Status' }}
                <i class="ti ti-chevron-down ms-1"></i>
              </button>
              <ul class="dropdown-menu dropdown-menu-end p-2">
                <li><a href="javascript:void(0);" class="dropdown-item rounded-1" @click="filterStatus = ''">All Status</a></li>
                <li><a href="javascript:void(0);" class="dropdown-item rounded-1" @click="filterStatus = 'Active'">Active</a></li>
                <li><a href="javascript:void(0);" class="dropdown-item rounded-1" @click="filterStatus = 'Inactive'">Inactive</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table datanew">
              <thead class="thead-light">
                <tr>
                  <th>Name</th>
                  <th>Value</th>
                  <th>Discount Plan</th>
                  <th>Validity</th>
                  <th>Days</th>
                  <th>Products</th>
                  <th>Used</th>
                  <th>Status</th>
                  <th class="no-sort text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in filteredDiscounts" :key="item.id">
                  <td class="text-gray-9 fw-medium">{{ item.name }}</td>
                  <td>{{ item.valueText }}</td>
                  <td>{{ item.plan }}</td>
                  <td>{{ item.validity }}</td>
                  <td>{{ item.days.join(', ') }}</td>
                  <td>{{ item.products }}</td>
                  <td>{{ item.used }}</td>
                  <td>
                    <span class="badge table-badge fw-medium fs-10" :class="item.status === 'Active' ? 'bg-success' : 'bg-danger'">
                      {{ item.status }}
                    </span>
                  </td>
                  <td class="action-table-data text-end">
                    <div class="edit-delete-action justify-content-end">
                      <a class="me-2 p-2" href="javascript:void(0);" @click="openEditModal(item)">
                        <i class="ti ti-edit"></i>
                      </a>
                      <a class="confirm-text p-2 align-center text-danger" href="javascript:void(0);" @click="deleteItem(item.id)">
                        <i class="ti ti-trash"></i>
                      </a>
                    </div>
                  </td>
                </tr>
                <tr v-if="filteredDiscounts.length === 0">
                  <td colspan="9" class="text-center py-4 text-muted">No discounts found.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Add Discount Modal -->
      <div v-if="showAddModal" class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
        <div class="modal-dialog modal-dialog-centered modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <div class="page-title">
                <h4>Add Discount</h4>
              </div>
              <button type="button" class="close bg-danger text-white fs-16 border-0 rounded-circle" @click="closeModal">
                <span>&times;</span>
              </button>
            </div>
            <form @submit.prevent="saveDiscount">
              <div class="modal-body">
                <div class="row">
                  <div class="col-lg-4">
                    <div class="mb-3">
                      <label class="form-label">Discount Name <span class="text-danger">*</span></label>
                      <input v-model="formData.name" type="text" class="form-control" required placeholder="e.g. Weekend Deal" />
                    </div>
                  </div>
                  <div class="col-lg-4">
                    <div class="mb-3">
                      <label class="form-label">Discount Plan <span class="text-danger">*</span></label>
                      <select v-model="formData.plan" class="form-select" required>
                        <option value="">Select</option>
                        <option value="Standard">Standard</option>
                        <option value="Membership">Membership</option>
                      </select>
                    </div>
                  </div>
                  <div class="col-lg-4">
                    <div class="mb-3">
                      <label class="form-label">Applicable For <span class="text-danger">*</span></label>
                      <select v-model="formData.products" class="form-select" required>
                        <option value="All Products">All Products</option>
                        <option value="Specific Products">Specific Products</option>
                      </select>
                    </div>
                  </div>
                  <div class="col-lg-4">
                    <div class="mb-3">
                      <label class="form-label">Valid From <span class="text-danger">*</span></label>
                      <input v-model="formData.validFrom" type="date" class="form-control" required />
                    </div>
                  </div>
                  <div class="col-lg-4">
                    <div class="mb-3">
                      <label class="form-label">Valid Till <span class="text-danger">*</span></label>
                      <input v-model="formData.validTill" type="date" class="form-control" required />
                    </div>
                  </div>
                  <div class="col-lg-4">
                    <div class="mb-3">
                      <label class="form-label">Discount Type <span class="text-danger">*</span></label>
                      <div class="input-group">
                        <select v-model="formData.type" class="form-select" style="max-width: 140px;">
                          <option value="Percentage">Percentage</option>
                          <option value="Flat">Flat</option>
                        </select>
                        <input v-model.number="formData.value" type="number" class="form-control" placeholder="Value" required min="1" />
                      </div>
                    </div>
                  </div>
                  <div class="col-md-12">
                    <div>
                      <label class="form-label">Valid on Following Days <span class="text-danger">*</span></label>
                      <div class="d-flex align-items-center flex-wrap gap-3">
                        <div v-for="day in daysOfWeek" :key="day" class="form-check form-check-md d-flex align-items-center">
                          <input
                            :id="'day-' + day"
                            v-model="formData.days"
                            class="form-check-input me-1"
                            type="checkbox"
                            :value="day"
                          />
                          <label class="form-check-label" :for="'day-' + day">{{ day }}</label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-12 mt-3">
                    <div class="form-check form-switch d-flex align-items-center gap-2">
                      <input id="discountStatus" v-model="formData.isActive" class="form-check-input" type="checkbox" role="switch" />
                      <label class="form-check-label" for="discountStatus">Active Status</label>
                    </div>
                  </div>
                </div>
              </div>
              <div class="modal-footer modal-action-footer justify-content-end">
                <button type="button" class="btn btn-dark modal-action-cancel" @click="closeModal">Cancel</button>
                <button type="submit" class="btn btn-warning modal-action-submit text-white">Submit</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Edit Discount Modal -->
      <div v-if="showEditModal" class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
        <div class="modal-dialog modal-dialog-centered modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <div class="page-title">
                <h4>Edit Discount</h4>
              </div>
              <button type="button" class="close bg-danger text-white fs-16 border-0 rounded-circle" @click="closeModal">
                <span>&times;</span>
              </button>
            </div>
            <form @submit.prevent="updateDiscount">
              <div class="modal-body">
                <div class="row">
                  <div class="col-lg-4">
                    <div class="mb-3">
                      <label class="form-label">Discount Name <span class="text-danger">*</span></label>
                      <input v-model="formData.name" type="text" class="form-control" required />
                    </div>
                  </div>
                  <div class="col-lg-4">
                    <div class="mb-3">
                      <label class="form-label">Discount Plan <span class="text-danger">*</span></label>
                      <select v-model="formData.plan" class="form-select" required>
                        <option value="Standard">Standard</option>
                        <option value="Membership">Membership</option>
                      </select>
                    </div>
                  </div>
                  <div class="col-lg-4">
                    <div class="mb-3">
                      <label class="form-label">Applicable For <span class="text-danger">*</span></label>
                      <select v-model="formData.products" class="form-select" required>
                        <option value="All Products">All Products</option>
                        <option value="Specific Products">Specific Products</option>
                      </select>
                    </div>
                  </div>
                  <div class="col-lg-4">
                    <div class="mb-3">
                      <label class="form-label">Valid From <span class="text-danger">*</span></label>
                      <input v-model="formData.validFrom" type="text" class="form-control" required />
                    </div>
                  </div>
                  <div class="col-lg-4">
                    <div class="mb-3">
                      <label class="form-label">Valid Till <span class="text-danger">*</span></label>
                      <input v-model="formData.validTill" type="text" class="form-control" required />
                    </div>
                  </div>
                  <div class="col-lg-4">
                    <div class="mb-3">
                      <label class="form-label">Discount Type <span class="text-danger">*</span></label>
                      <div class="input-group">
                        <select v-model="formData.type" class="form-select" style="max-width: 140px;">
                          <option value="Percentage">Percentage</option>
                          <option value="Flat">Flat</option>
                        </select>
                        <input v-model.number="formData.value" type="number" class="form-control" required min="1" />
                      </div>
                    </div>
                  </div>
                  <div class="col-md-12">
                    <div>
                      <label class="form-label">Valid on Following Days <span class="text-danger">*</span></label>
                      <div class="d-flex align-items-center flex-wrap gap-3">
                        <div v-for="day in daysOfWeek" :key="day" class="form-check form-check-md d-flex align-items-center">
                          <input
                            :id="'edit-day-' + day"
                            v-model="formData.days"
                            class="form-check-input me-1"
                            type="checkbox"
                            :value="day"
                          />
                          <label class="form-check-label" :for="'edit-day-' + day">{{ day }}</label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-12 mt-3">
                    <div class="form-check form-switch d-flex align-items-center gap-2">
                      <input id="editDiscountStatus" v-model="formData.isActive" class="form-check-input" type="checkbox" role="switch" />
                      <label class="form-check-label" for="editDiscountStatus">Active Status</label>
                    </div>
                  </div>
                </div>
              </div>
              <div class="modal-footer modal-action-footer justify-content-end">
                <button type="button" class="btn btn-dark modal-action-cancel" @click="closeModal">Cancel</button>
                <button type="submit" class="btn btn-warning modal-action-submit text-white">Submit</button>
              </div>
            </form>
          </div>
        </div>
      </div>

    </div>
    <!-- Confirm Delete Modal -->
    <SalesConfirmDelete
      :open="isDeleteConfirmOpen"
      title="Delete Discount"
      message="Are you sure you want to delete this discount? This action cannot be undone."
      @cancel="isDeleteConfirmOpen = false"
      @confirm="confirmDelete"
    />
    <DocumentPrintModal
      :open="print.isPrintModalOpen.value"
      :title="print.printTitle.value"
      :subtitle="print.printSubtitle.value"
      :columns="print.printColumns.value"
      :rows="print.printRows.value"
      :default-action="print.defaultPrintAction.value"
      date-field="validTill"
      @close="print.closePrintModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import SalesConfirmDelete from '~/components/sales/SalesConfirmDelete.vue'

useLegacyPage({
  title: 'Discount',
  styles: ['/assets/css/style.css'],
  scripts: ['/assets/js/theme-script.js'],
  sweetAlert: true
})

interface DiscountItem {
  id: number
  name: string
  value: number
  type: 'Percentage' | 'Flat'
  valueText: string
  plan: string
  validity: string
  validFrom: string
  validTill: string
  days: string[]
  products: string
  used: number
  status: 'Active' | 'Inactive'
}

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const discounts = ref<DiscountItem[]>([
  {
    id: 1,
    name: 'Weekend Deal',
    value: 70,
    type: 'Percentage',
    valueText: '70 (Percentage)',
    plan: 'Standard',
    validity: '22 May 2025 - 24 Jun 2025',
    validFrom: '22/05/2025',
    validTill: '24/06/2025',
    days: ['Sat', 'Sun'],
    products: 'All Products',
    used: 7,
    status: 'Active'
  },
  {
    id: 2,
    name: 'Loyalty Reward',
    value: 40,
    type: 'Flat',
    valueText: '40 (Flat)',
    plan: 'Membership',
    validity: '16 Apr 2025 - 16 May 2025',
    validFrom: '16/04/2025',
    validTill: '16/05/2025',
    days: ['Mon', 'Tue', 'Thu', 'Fri'],
    products: 'Specific Products',
    used: 7,
    status: 'Active'
  },
  {
    id: 3,
    name: 'Flash Sale',
    value: 60,
    type: 'Percentage',
    valueText: '60 (Percentage)',
    plan: 'Standard',
    validity: '20 Mar 2025 - 20 Apr 2025',
    validFrom: '20/03/2025',
    validTill: '20/04/2025',
    days: ['Thu', 'Fri', 'Sat', 'Sun'],
    products: 'All Products',
    used: 7,
    status: 'Active'
  },
  {
    id: 4,
    name: 'Super Saver',
    value: 80,
    type: 'Percentage',
    valueText: '80 (Percentage)',
    plan: 'Standard',
    validity: '15 Feb 2025 - 15 Apr 2025',
    validFrom: '15/02/2025',
    validTill: '15/04/2025',
    days: ['Mon', 'Tue', 'Wed'],
    products: 'All Products',
    used: 7,
    status: 'Active'
  },
  {
    id: 5,
    name: 'Surprise Savings',
    value: 50,
    type: 'Flat',
    valueText: '50 (Flat)',
    plan: 'Standard',
    validity: '24 Jan 2025 - 24 Mar 2025',
    validFrom: '24/01/2025',
    validTill: '24/03/2025',
    days: ['Mon', 'Tue', 'Thu', 'Sat'],
    products: 'Specific Products',
    used: 7,
    status: 'Active'
  }
])
>>>>>>> origin/eko

const searchQuery = ref('')
const filterPlan = ref('')
const filterStatus = ref('')

const filteredDiscounts = computed(() => {
  return discounts.value.filter(item => {
    const matchSearch = searchQuery.value === '' || item.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchPlan = !filterPlan.value || item.plan === filterPlan.value
    const matchStatus = !filterStatus.value || item.status === filterStatus.value
    return matchSearch && matchPlan && matchStatus
  })
})

<<<<<<< HEAD
=======
const print = useTablePrint()
const printColumns = [
  { key: 'name', label: 'Name' },
  { key: 'valueText', label: 'Value' },
  { key: 'plan', label: 'Discount Plan' },
  { key: 'validity', label: 'Validity' },
  { key: 'days', label: 'Days', format: (value: string[]) => value.join(', ') },
  { key: 'products', label: 'Products' },
  { key: 'used', label: 'Used', align: 'right' as const },
  { key: 'status', label: 'Status' }
]

const openDiscountPrint = (action: 'print' | 'pdf') => {
  print.openPrintModal({
    title: 'Discount Report',
    subtitle: 'Daftar program diskon',
    columns: printColumns,
    rows: filteredDiscounts.value,
    action
  })
}

>>>>>>> origin/eko
const showAddModal = ref(false)
const showEditModal = ref(false)
const editingId = ref<number | null>(null)

const defaultFormData = () => ({
  name: '',
  plan: 'Standard',
  products: 'All Products',
  validFrom: '',
  validTill: '',
  type: 'Percentage' as 'Percentage' | 'Flat',
  value: 10,
  days: ['Monday'] as string[],
  isActive: true
})

const formData = ref(defaultFormData())

const openAddModal = () => {
  formData.value = defaultFormData()
  showAddModal.value = true
}

const openEditModal = (item: DiscountItem) => {
  editingId.value = item.id
  formData.value = {
    name: item.name,
    plan: item.plan,
    products: item.products,
    validFrom: item.validFrom,
    validTill: item.validTill,
    type: item.type,
    value: item.value,
    days: item.days.length ? item.days : ['Monday'],
    isActive: item.status === 'Active'
  }
  showEditModal.value = true
}

const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  editingId.value = null
}

const saveDiscount = () => {
  const newId = Math.max(0, ...discounts.value.map(d => d.id)) + 1
  discounts.value.unshift({
    id: newId,
    name: formData.value.name,
    value: formData.value.value,
    type: formData.value.type,
    valueText: `${formData.value.value} (${formData.value.type})`,
    plan: formData.value.plan,
    validity: `${formData.value.validFrom} - ${formData.value.validTill}`,
    validFrom: formData.value.validFrom,
    validTill: formData.value.validTill,
    days: [...formData.value.days],
    products: formData.value.products,
    used: 0,
    status: formData.value.isActive ? 'Active' : 'Inactive'
  })
  closeModal()
}

const updateDiscount = () => {
  if (editingId.value === null) return
  const idx = discounts.value.findIndex(d => d.id === editingId.value)
  if (idx !== -1) {
    discounts.value[idx] = {
      ...discounts.value[idx],
      name: formData.value.name,
      value: formData.value.value,
      type: formData.value.type,
      valueText: `${formData.value.value} (${formData.value.type})`,
      plan: formData.value.plan,
      validity: `${formData.value.validFrom} - ${formData.value.validTill}`,
      validFrom: formData.value.validFrom,
      validTill: formData.value.validTill,
      days: [...formData.value.days],
      products: formData.value.products,
      status: formData.value.isActive ? 'Active' : 'Inactive'
    }
  }
  closeModal()
}

<<<<<<< HEAD
const deleteItem = (id: number) => {
  if (confirm('Are you sure you want to delete this discount?')) {
    discounts.value = discounts.value.filter(d => d.id !== id)
=======
const isDeleteConfirmOpen = ref(false)
const deleteTargetId = ref<number | null>(null)

const deleteItem = (id: number) => {
  deleteTargetId.value = id
  isDeleteConfirmOpen.value = true
}

const confirmDelete = () => {
  if (deleteTargetId.value !== null) {
    discounts.value = discounts.value.filter(d => d.id !== deleteTargetId.value)
    isDeleteConfirmOpen.value = false
    deleteTargetId.value = null
>>>>>>> origin/eko
  }
}

const exportPdf = () => {
<<<<<<< HEAD
  window.print()
}

const printTable = () => {
  window.print()
=======
  openDiscountPrint('pdf')
}

const printTable = () => {
  openDiscountPrint('print')
>>>>>>> origin/eko
}

const refresh = () => {
  searchQuery.value = ''
  filterPlan.value = ''
  filterStatus.value = ''
}

const toggleCollapse = () => {
  // collapsible header trigger
<<<<<<< HEAD
}</script>
=======
}
</script>

>>>>>>> origin/eko
