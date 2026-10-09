<template>
<<<<<<< HEAD
  <div class="space-y-6">
    <!-- Page Header -->
    <CommonPageHeader title="Coupons" subtitle="Manage Your Coupons">
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
            <span>Add New Coupons</span>
          </button>
        </div>
      </template>
    </CommonPageHeader>

    <!-- Table Card -->
    <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <!-- Toolbar -->
      <div class="mb-5 flex flex-wrap items-center justify-between gap-4">
        <CommonSearchFilter v-model="searchQuery" placeholder="Search coupon name or code..." />
        <button
          type="button"
          :class="[
            'flex h-10 items-center gap-2 rounded-lg border px-3 text-sm font-medium transition',
            showFilters
              ? 'border-primary bg-primary/5 text-primary'
              : 'border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800',
          ]"
          @click="showFilters = !showFilters"
        >
          <CommonFeatherIcon name="filter" size="16" />
          Filters
        </button>
      </div>

      <!-- Filter Section -->
      <div v-if="showFilters" class="mb-5 rounded-lg border border-gray-100 bg-gray-50/60 p-4 dark:border-gray-800 dark:bg-gray-800/30">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Coupon Type</label>
            <select
              v-model="filterType"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            >
              <option value="">All Types</option>
              <option value="Fixed">Fixed</option>
              <option value="Percentage">Percentage</option>
            </select>
          </div>
          <div>
            <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Status</label>
            <select
              v-model="filterStatus"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            >
              <option value="">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div>
            <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Store Filter</label>
            <select
              v-model="filterStore"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            >
              <option value="">All Stores</option>
              <option value="Ellectro Mart">Ellectro Mart</option>
              <option value="Ekos Mart">Ekos Mart</option>
            </select>
          </div>
          <div class="flex items-end">
            <button
              type="button"
              class="w-full h-10 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              @click="resetFilters"
            >
              Reset Filters
            </button>
=======
  <div class="page-wrapper mt-3">
    <div class="content">
      <div class="page-header">
        <div class="add-item d-flex">
          <div class="page-title">
            <h4>Coupons</h4>
            <h6>Manage Your Coupons</h6>
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
          <button type="button" class="btn btn-added btn-primary" @click="openAddModal">
            <i class="ti ti-circle-plus me-2"></i>Add New Coupons
          </button>
        </div>
      </div>

      <!-- Table List Card -->
      <div class="card table-list-card">
        <div class="card-body">
          <div class="table-top d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
            <div class="search-set">
              <div class="search-input">
                <span class="btn-searchset"><i class="ti ti-search"></i></span>
                <input v-model="searchQuery" type="text" class="form-control" placeholder="Search coupon name or code..." />
              </div>
            </div>
            <div class="search-path">
              <div class="d-flex align-items-center gap-2">
                <button type="button" class="btn btn-filter" :class="{ active: showFilters }" @click="showFilters = !showFilters">
                  <i class="ti ti-filter"></i>
                  <span v-if="showFilters"><img src="/assets/img/icons/closes.svg" alt="close" /></span>
                </button>
              </div>
            </div>
          </div>

          <!-- Filter Section -->
          <div v-if="showFilters" class="filter-collapse mb-4 p-3 bg-light rounded">
            <div class="row g-3">
              <div class="col-lg-3 col-sm-6 col-12">
                <label class="form-label fs-12 text-muted mb-1">Coupon Type</label>
                <select v-model="filterType" class="form-select form-select-sm">
                  <option value="">All Types</option>
                  <option value="Fixed">Fixed</option>
                  <option value="Percentage">Percentage</option>
                </select>
              </div>
              <div class="col-lg-3 col-sm-6 col-12">
                <label class="form-label fs-12 text-muted mb-1">Status</label>
                <select v-model="filterStatus" class="form-select form-select-sm">
                  <option value="">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div class="col-lg-3 col-sm-6 col-12">
                <label class="form-label fs-12 text-muted mb-1">Store Filter</label>
                <select v-model="filterStore" class="form-select form-select-sm">
                  <option value="">All Stores</option>
                  <option value="Ellectro Mart">Ellectro Mart</option>
                  <option value="Ekos Mart">Ekos Mart</option>
                </select>
              </div>
              <div class="col-lg-3 col-sm-6 col-12 d-flex align-items-end">
                <button type="button" class="btn btn-sm btn-outline-secondary w-100" @click="resetFilters">Reset Filters</button>
              </div>
            </div>
          </div>

          <!-- Table -->
          <div class="table-responsive">
            <table class="table datanew">
              <thead class="thead-light">
                <tr>
                  <th>Name</th>
                  <th>Code</th>
                  <th>Type</th>
                  <th>Discount</th>
                  <th>Limit</th>
                  <th>Used</th>
                  <th>Valid</th>
                  <th>Status</th>
                  <th class="no-sort text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in filteredCoupons" :key="item.id">
                  <td class="fw-medium text-dark">{{ item.name }}</td>
                  <td>
                    <span class="badge bg-outline-info text-info border border-info px-2 py-1">{{ item.code }}</span>
                  </td>
                  <td>{{ item.type }}</td>
                  <td>{{ item.discountDisplay }}</td>
                  <td>{{ item.limit === 0 ? "Unlimited" : String(item.limit).padStart(2, "0") }}</td>
                  <td>{{ String(item.used).padStart(2, "0") }}</td>
                  <td>{{ item.validDate }}</td>
                  <td>
                    <span class="badge" :class="item.status === 'Active' ? 'bg-success' : 'bg-danger'">
                      {{ item.status }}
                    </span>
                  </td>
                  <td class="action-table-data text-end">
                    <div class="edit-delete-action justify-content-end">
                      <a class="me-2 p-2" href="javascript:void(0);" @click="openEditModal(item)">
                        <i class="ti ti-edit"></i>
                      </a>
                      <a
                        class="confirm-text p-2 align-center text-danger"
                        href="javascript:void(0);"
                        @click="deleteItem(item.id)"
                      >
                        <i class="ti ti-trash"></i>
                      </a>
                    </div>
                  </td>
                </tr>
                <tr v-if="filteredCoupons.length === 0">
                  <td colspan="9" class="text-center py-4 text-muted">No vouchers or coupons found.</td>
                </tr>
              </tbody>
            </table>
>>>>>>> origin/eko
          </div>
        </div>
      </div>

<<<<<<< HEAD
      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="w-full text-start text-xs text-gray-700 dark:text-gray-300">
          <thead
            class="bg-gray-50 text-[11px] font-semibold uppercase text-gray-500 border-b border-gray-200 dark:bg-gray-800/50 dark:border-gray-700 dark:text-gray-400"
          >
            <tr>
              <th class="px-4 py-3 text-start whitespace-nowrap">Name</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Code</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Type</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Discount</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Limit</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Used</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Valid</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Status</th>
              <th class="px-4 py-3 text-end whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <tr v-for="item in filteredCoupons" :key="item.id" class="transition-colors hover:bg-gray-50/75 dark:hover:bg-gray-800/40">
              <td class="px-4 py-3 whitespace-nowrap font-medium text-gray-900 dark:text-gray-100">{{ item.name }}</td>
              <td class="px-4 py-3 whitespace-nowrap">
                <span class="inline-flex rounded-md border border-sky-200 bg-sky-50 px-2 py-0.5 font-mono text-[11px] text-sky-700 dark:border-sky-900 dark:bg-sky-950 dark:text-sky-300">
                  {{ item.code }}
                </span>
              </td>
              <td class="px-4 py-3 whitespace-nowrap">{{ item.type }}</td>
              <td class="px-4 py-3 whitespace-nowrap font-medium">{{ item.discountDisplay }}</td>
              <td class="px-4 py-3 whitespace-nowrap">{{ item.limit === 0 ? "Unlimited" : String(item.limit).padStart(2, "0") }}</td>
              <td class="px-4 py-3 whitespace-nowrap">{{ String(item.used).padStart(2, "0") }}</td>
              <td class="px-4 py-3 whitespace-nowrap">{{ item.validDate }}</td>
              <td class="px-4 py-3 whitespace-nowrap">
                <CommonStatusPill :status="item.status" />
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-end">
                <CommonRowActions :item="item" @edit="openEditModal(item)" @delete="deleteItem(item.id)" />
              </td>
            </tr>
            <tr v-if="filteredCoupons.length === 0">
              <td colspan="9" class="p-8 text-center text-gray-400">No vouchers or coupons found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add Coupon Modal -->
    <CommonBaseModal v-model="showAddModal" title="Add Coupons" maxWidth="lg">
      <form @submit.prevent="saveCoupon" class="space-y-4">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <CommonFormField label="Name" required>
            <input
              v-model="formData.name"
              type="text"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              required
              placeholder="e.g. Coupons 21"
            />
          </CommonFormField>
          <CommonFormField label="Code" required>
            <input
              v-model="formData.code"
              type="text"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              required
              placeholder="e.g. CHRISTMAS20"
            />
          </CommonFormField>
        </div>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <CommonFormField label="Type" required>
            <select
              v-model="formData.type"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              required
            >
              <option value="Fixed">Fixed</option>
              <option value="Percentage">Percentage</option>
            </select>
          </CommonFormField>
          <CommonFormField label="Discount Value" required>
            <input
              v-model.number="formData.discount"
              type="number"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              required
              min="1"
              placeholder="Amount or %"
            />
          </CommonFormField>
        </div>
        <CommonFormField label="Limit" hint="0 for Unlimited">
          <input
            v-model.number="formData.limit"
            type="number"
            class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            min="0"
            placeholder="Limit"
          />
        </CommonFormField>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <CommonFormField label="Start Date">
            <input
              v-model="formData.startDate"
              type="date"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            />
          </CommonFormField>
          <CommonFormField label="End Date">
            <input
              v-model="formData.endDate"
              type="date"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            />
          </CommonFormField>
        </div>

        <!-- Switches -->
        <div class="space-y-2.5 rounded-lg border border-gray-100 p-3.5 dark:border-gray-800">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-gray-700 dark:text-gray-300">Applicable to All Products</span>
            <button
              type="button"
              :class="[
                'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none',
                formData.allProducts ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-700',
              ]"
              @click="formData.allProducts = !formData.allProducts"
            >
              <span :class="['pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out', formData.allProducts ? 'translate-x-5' : 'translate-x-0']" />
            </button>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-gray-700 dark:text-gray-300">Once Per Customer</span>
            <button
              type="button"
              :class="[
                'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none',
                formData.oncePerCustomer ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-700',
              ]"
              @click="formData.oncePerCustomer = !formData.oncePerCustomer"
            >
              <span :class="['pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out', formData.oncePerCustomer ? 'translate-x-5' : 'translate-x-0']" />
            </button>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-gray-700 dark:text-gray-300">Active Status</span>
            <button
              type="button"
              :class="[
                'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none',
                formData.isActive ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-700',
              ]"
              @click="formData.isActive = !formData.isActive"
            >
              <span :class="['pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out', formData.isActive ? 'translate-x-5' : 'translate-x-0']" />
            </button>
          </div>
        </div>

        <CommonModalFooter @cancel="closeModal" />
      </form>
    </CommonBaseModal>

    <!-- Edit Coupon Modal -->
    <CommonBaseModal v-model="showEditModal" title="Edit Coupons" maxWidth="lg">
      <form @submit.prevent="updateCoupon" class="space-y-4">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <CommonFormField label="Name" required>
            <input
              v-model="formData.name"
              type="text"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              required
            />
          </CommonFormField>
          <CommonFormField label="Code" required>
            <input
              v-model="formData.code"
              type="text"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              required
            />
          </CommonFormField>
        </div>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <CommonFormField label="Type" required>
            <select
              v-model="formData.type"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              required
            >
              <option value="Fixed">Fixed</option>
              <option value="Percentage">Percentage</option>
            </select>
          </CommonFormField>
          <CommonFormField label="Discount Value" required>
            <input
              v-model.number="formData.discount"
              type="number"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              required
              min="1"
            />
          </CommonFormField>
        </div>
        <CommonFormField label="Limit" hint="0 for Unlimited">
          <input
            v-model.number="formData.limit"
            type="number"
            class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            min="0"
          />
        </CommonFormField>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <CommonFormField label="Start Date">
            <input
              v-model="formData.startDate"
              type="date"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            />
          </CommonFormField>
          <CommonFormField label="End Date">
            <input
              v-model="formData.endDate"
              type="date"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            />
          </CommonFormField>
        </div>

        <!-- Switches -->
        <div class="space-y-2.5 rounded-lg border border-gray-100 p-3.5 dark:border-gray-800">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-gray-700 dark:text-gray-300">Applicable to All Products</span>
            <button
              type="button"
              :class="[
                'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none',
                formData.allProducts ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-700',
              ]"
              @click="formData.allProducts = !formData.allProducts"
            >
              <span :class="['pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out', formData.allProducts ? 'translate-x-5' : 'translate-x-0']" />
            </button>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-gray-700 dark:text-gray-300">Once Per Customer</span>
            <button
              type="button"
              :class="[
                'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none',
                formData.oncePerCustomer ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-700',
              ]"
              @click="formData.oncePerCustomer = !formData.oncePerCustomer"
            >
              <span :class="['pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out', formData.oncePerCustomer ? 'translate-x-5' : 'translate-x-0']" />
            </button>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-gray-700 dark:text-gray-300">Active Status</span>
            <button
              type="button"
              :class="[
                'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none',
                formData.isActive ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-700',
              ]"
              @click="formData.isActive = !formData.isActive"
            >
              <span :class="['pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out', formData.isActive ? 'translate-x-5' : 'translate-x-0']" />
            </button>
          </div>
        </div>

        <CommonModalFooter @cancel="closeModal" />
      </form>
    </CommonBaseModal>
  </div>
</template>

<script setup lang="ts">import { ref, computed } from "vue";

useHead({
  title: "Voucher - Kacetak System",
});

const { data: voucherData } = await useFetch<VoucherItem[]>('/api/voucher')
const coupons = ref<VoucherItem[]>(voucherData.value ?? [])
useMockSync('voucher', coupons);
=======
      <!-- Add Coupon Modal -->
      <div v-if="showAddModal" class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0, 0, 0, 0.5)">
        <div class="modal-dialog modal-dialog-centered custom-modal-two modal-lg">
          <div class="modal-content">
            <div class="modal-header border-0 custom-modal-header">
              <div class="page-title">
                <h4>Add Coupons</h4>
              </div>
              <button type="button" class="close bg-danger text-white fs-16 border-0 rounded-circle" @click="closeModal">
                <span>&times;</span>
              </button>
            </div>
            <form @submit.prevent="saveCoupon">
              <div class="modal-body custom-modal-body">
                <div class="row g-3">
                  <div class="col-lg-6">
                    <div>
                      <label class="form-label">Name <span class="text-danger">*</span></label>
                      <input v-model="formData.name" type="text" class="form-control" required placeholder="e.g. Coupons 21" />
                    </div>
                  </div>
                  <div class="col-lg-6">
                    <div>
                      <label class="form-label">Code <span class="text-danger">*</span></label>
                      <input v-model="formData.code" type="text" class="form-control" required placeholder="e.g. CHRISTMAS20" />
                    </div>
                  </div>
                  <div class="col-lg-6">
                    <div>
                      <label class="form-label">Type <span class="text-danger">*</span></label>
                      <select v-model="formData.type" class="form-select" required>
                        <option value="Fixed">Fixed</option>
                        <option value="Percentage">Percentage</option>
                      </select>
                    </div>
                  </div>
                  <div class="col-lg-6">
                    <div>
                      <label class="form-label">Discount Value <span class="text-danger">*</span></label>
                      <input
                        v-model.number="formData.discount"
                        type="number"
                        class="form-control"
                        required
                        min="1"
                        placeholder="Amount or %"
                      />
                    </div>
                  </div>
                  <div class="col-lg-12">
                    <div>
                      <label class="form-label">Limit</label>
                      <input v-model.number="formData.limit" type="number" class="form-control" min="0" placeholder="Limit" />
                      <span class="text-muted fs-12">0 for Unlimited</span>
                    </div>
                  </div>
                  <div class="col-lg-6">
                    <div>
                      <label class="form-label">Start Date</label>
                      <input v-model="formData.startDate" type="date" class="form-control" />
                    </div>
                  </div>
                  <div class="col-lg-6">
                    <div>
                      <label class="form-label">End Date</label>
                      <input v-model="formData.endDate" type="date" class="form-control" />
                    </div>
                  </div>
                  <div class="col-12">
                    <div class="border rounded p-3">
                      <div class="form-check form-switch d-flex align-items-center justify-content-between mb-2">
                        <label class="form-check-label" for="allProducts">Applicable to All Products</label>
                        <input
                          id="allProducts"
                          v-model="formData.allProducts"
                          class="form-check-input"
                          type="checkbox"
                          role="switch"
                        />
                      </div>
                      <div class="form-check form-switch d-flex align-items-center justify-content-between">
                        <label class="form-check-label" for="oncePerCustomer">Once Per Customer</label>
                        <input
                          id="oncePerCustomer"
                          v-model="formData.oncePerCustomer"
                          class="form-check-input"
                          type="checkbox"
                          role="switch"
                        />
                      </div>
                    </div>
                  </div>
                  <div class="col-12">
                    <div class="form-check form-switch d-flex align-items-center gap-2">
                      <input
                        id="couponStatus"
                        v-model="formData.isActive"
                        class="form-check-input"
                        type="checkbox"
                        role="switch"
                      />
                      <label class="form-check-label" for="couponStatus">Active Status</label>
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

      <!-- Edit Coupon Modal -->
      <div v-if="showEditModal" class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0, 0, 0, 0.5)">
        <div class="modal-dialog modal-dialog-centered custom-modal-two modal-lg">
          <div class="modal-content">
            <div class="modal-header border-0 custom-modal-header">
              <div class="page-title">
                <h4>Edit Coupons</h4>
              </div>
              <button type="button" class="close bg-danger text-white fs-16 border-0 rounded-circle" @click="closeModal">
                <span>&times;</span>
              </button>
            </div>
            <form @submit.prevent="updateCoupon">
              <div class="modal-body custom-modal-body">
                <div class="row g-3">
                  <div class="col-lg-6">
                    <div>
                      <label class="form-label">Name <span class="text-danger">*</span></label>
                      <input v-model="formData.name" type="text" class="form-control" required />
                    </div>
                  </div>
                  <div class="col-lg-6">
                    <div>
                      <label class="form-label">Code <span class="text-danger">*</span></label>
                      <input v-model="formData.code" type="text" class="form-control" required />
                    </div>
                  </div>
                  <div class="col-lg-6">
                    <div>
                      <label class="form-label">Type <span class="text-danger">*</span></label>
                      <select v-model="formData.type" class="form-select" required>
                        <option value="Fixed">Fixed</option>
                        <option value="Percentage">Percentage</option>
                      </select>
                    </div>
                  </div>
                  <div class="col-lg-6">
                    <div>
                      <label class="form-label">Discount Value <span class="text-danger">*</span></label>
                      <input v-model.number="formData.discount" type="number" class="form-control" required min="1" />
                    </div>
                  </div>
                  <div class="col-lg-12">
                    <div>
                      <label class="form-label">Limit</label>
                      <input v-model.number="formData.limit" type="number" class="form-control" min="0" />
                      <span class="text-muted fs-12">0 for Unlimited</span>
                    </div>
                  </div>
                  <div class="col-lg-6">
                    <div>
                      <label class="form-label">Start Date</label>
                      <input v-model="formData.startDate" type="text" class="form-control" />
                    </div>
                  </div>
                  <div class="col-lg-6">
                    <div>
                      <label class="form-label">End Date</label>
                      <input v-model="formData.endDate" type="text" class="form-control" />
                    </div>
                  </div>
                  <div class="col-12">
                    <div class="border rounded p-3">
                      <div class="form-check form-switch d-flex align-items-center justify-content-between mb-2">
                        <label class="form-check-label" for="editAllProducts">Applicable to All Products</label>
                        <input
                          id="editAllProducts"
                          v-model="formData.allProducts"
                          class="form-check-input"
                          type="checkbox"
                          role="switch"
                        />
                      </div>
                      <div class="form-check form-switch d-flex align-items-center justify-content-between">
                        <label class="form-check-label" for="editOncePerCustomer">Once Per Customer</label>
                        <input
                          id="editOncePerCustomer"
                          v-model="formData.oncePerCustomer"
                          class="form-check-input"
                          type="checkbox"
                          role="switch"
                        />
                      </div>
                    </div>
                  </div>
                  <div class="col-12">
                    <div class="form-check form-switch d-flex align-items-center gap-2">
                      <input
                        id="editCouponStatus"
                        v-model="formData.isActive"
                        class="form-check-input"
                        type="checkbox"
                        role="switch"
                      />
                      <label class="form-check-label" for="editCouponStatus">Active Status</label>
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
      title="Delete Voucher"
      message="Are you sure you want to delete this coupon/voucher? This action cannot be undone."
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
      date-field="endDate"
      @close="print.closePrintModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import SalesConfirmDelete from "~/components/sales/SalesConfirmDelete.vue";

useLegacyPage({
  title: 'Voucher',
  styles: ['/assets/css/style.css'],
  scripts: ['/assets/js/theme-script.js'],
  sweetAlert: true
});

interface CouponItem {
  id: number;
  name: string;
  code: string;
  type: "Fixed" | "Percentage";
  discount: number;
  discountDisplay: string;
  limit: number;
  used: number;
  validDate: string;
  startDate: string;
  endDate: string;
  allProducts: boolean;
  oncePerCustomer: boolean;
  status: "Active" | "Inactive";
}

const coupons = ref<CouponItem[]>([
  {
    id: 1,
    name: "Coupons 21",
    code: "Christmas",
    type: "Fixed",
    discount: 20000,
    discountDisplay: "Rp20.000",
    limit: 4,
    used: 1,
    validDate: "04 Jan 2023",
    startDate: "2023-01-01",
    endDate: "2023-01-04",
    allProducts: true,
    oncePerCustomer: false,
    status: "Active",
  },
  {
    id: 2,
    name: "First Offer",
    code: "First Offer",
    type: "Percentage",
    discount: 10,
    discountDisplay: "10%",
    limit: 47,
    used: 10,
    validDate: "15 Feb 2023",
    startDate: "2023-02-01",
    endDate: "2023-02-15",
    allProducts: true,
    oncePerCustomer: true,
    status: "Active",
  },
  {
    id: 3,
    name: "Offer 40",
    code: "40% Offer",
    type: "Fixed",
    discount: 20000,
    discountDisplay: "Rp20.000",
    limit: 21,
    used: 14,
    validDate: "08 Apr 2023",
    startDate: "2023-04-01",
    endDate: "2023-04-08",
    allProducts: false,
    oncePerCustomer: false,
    status: "Active",
  },
  {
    id: 4,
    name: "Subscription",
    code: "FirstSub01",
    type: "Fixed",
    discount: 20000,
    discountDisplay: "Rp20.000",
    limit: 9,
    used: 7,
    validDate: "12 Aug 2023",
    startDate: "2023-08-01",
    endDate: "2023-08-12",
    allProducts: true,
    oncePerCustomer: true,
    status: "Inactive",
  },
]);
>>>>>>> origin/eko

const searchQuery = ref("");
const showFilters = ref(false);
const filterType = ref("");
const filterStatus = ref("");
const filterStore = ref("");

const filteredCoupons = computed(() => {
  return coupons.value.filter((item) => {
    const matchSearch =
      searchQuery.value === "" ||
      item.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.code.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchType = !filterType.value || item.type === filterType.value;
    const matchStatus = !filterStatus.value || item.status === filterStatus.value;
    return matchSearch && matchType && matchStatus;
  });
});

<<<<<<< HEAD
=======
const print = useTablePrint();
const printColumns = [
  { key: 'name', label: 'Name' },
  { key: 'code', label: 'Code' },
  { key: 'type', label: 'Type' },
  { key: 'discountDisplay', label: 'Discount' },
  { key: 'limit', label: 'Limit', align: 'right' as const },
  { key: 'used', label: 'Used', align: 'right' as const },
  { key: 'validDate', label: 'Valid Date' },
  { key: 'status', label: 'Status' }
];

const openVoucherPrint = (action: 'print' | 'pdf') => {
  print.openPrintModal({
    title: 'Voucher and Coupon Report',
    subtitle: 'Daftar voucher, kupon, dan masa berlakunya',
    columns: printColumns,
    rows: filteredCoupons.value,
    action
  });
};

>>>>>>> origin/eko
const showAddModal = ref(false);
const showEditModal = ref(false);
const editingId = ref<number | null>(null);

const defaultFormData = () => ({
  name: "",
  code: "",
  type: "Fixed" as "Fixed" | "Percentage",
  discount: 20000,
  limit: 10,
  startDate: "",
  endDate: "",
  allProducts: true,
  oncePerCustomer: false,
  isActive: true,
});

const formData = ref(defaultFormData());

const openAddModal = () => {
  formData.value = defaultFormData();
  showAddModal.value = true;
};

<<<<<<< HEAD
const openEditModal = (item: VoucherItem) => {
=======
const openEditModal = (item: CouponItem) => {
>>>>>>> origin/eko
  editingId.value = item.id;
  formData.value = {
    name: item.name,
    code: item.code,
    type: item.type,
    discount: item.discount,
    limit: item.limit,
    startDate: item.startDate,
    endDate: item.endDate,
    allProducts: item.allProducts,
    oncePerCustomer: item.oncePerCustomer,
    isActive: item.status === "Active",
  };
  showEditModal.value = true;
};

const closeModal = () => {
  showAddModal.value = false;
  showEditModal.value = false;
  editingId.value = null;
};

const formatDiscountDisplay = (val: number, type: "Fixed" | "Percentage") => {
  if (type === "Percentage") return `${val}%`;
  return `Rp${new Intl.NumberFormat("id-ID").format(val)}`;
};

const saveCoupon = () => {
  const newId = Math.max(0, ...coupons.value.map((c) => c.id)) + 1;
  coupons.value.unshift({
    id: newId,
    name: formData.value.name,
    code: formData.value.code,
    type: formData.value.type,
    discount: formData.value.discount,
    discountDisplay: formatDiscountDisplay(formData.value.discount, formData.value.type),
    limit: formData.value.limit,
    used: 0,
    validDate: formData.value.endDate || "Ongoing",
    startDate: formData.value.startDate,
    endDate: formData.value.endDate,
    allProducts: formData.value.allProducts,
    oncePerCustomer: formData.value.oncePerCustomer,
    status: formData.value.isActive ? "Active" : "Inactive",
  });
  closeModal();
};

const updateCoupon = () => {
  if (editingId.value === null) return;
  const idx = coupons.value.findIndex((c) => c.id === editingId.value);
  if (idx !== -1) {
    coupons.value[idx] = {
      ...coupons.value[idx],
      name: formData.value.name,
      code: formData.value.code,
      type: formData.value.type,
      discount: formData.value.discount,
      discountDisplay: formatDiscountDisplay(formData.value.discount, formData.value.type),
      limit: formData.value.limit,
      startDate: formData.value.startDate,
      endDate: formData.value.endDate,
      validDate: formData.value.endDate || coupons.value[idx].validDate,
      allProducts: formData.value.allProducts,
      oncePerCustomer: formData.value.oncePerCustomer,
      status: formData.value.isActive ? "Active" : "Inactive",
    };
  }
  closeModal();
};

<<<<<<< HEAD
const deleteItem = (id: number) => {
  if (confirm("Are you sure you want to delete this coupon?")) {
    coupons.value = coupons.value.filter((c) => c.id !== id);
=======
const isDeleteConfirmOpen = ref(false);
const deleteTargetId = ref<number | null>(null);

const deleteItem = (id: number) => {
  deleteTargetId.value = id;
  isDeleteConfirmOpen.value = true;
};

const confirmDelete = () => {
  if (deleteTargetId.value !== null) {
    coupons.value = coupons.value.filter((c) => c.id !== deleteTargetId.value);
    isDeleteConfirmOpen.value = false;
    deleteTargetId.value = null;
>>>>>>> origin/eko
  }
};

const resetFilters = () => {
  searchQuery.value = "";
  filterType.value = "";
  filterStatus.value = "";
  filterStore.value = "";
};

const exportPdf = () => {
<<<<<<< HEAD
  window.print();
};

const printTable = () => {
  window.print();
=======
  openVoucherPrint('pdf');
};

const printTable = () => {
  openVoucherPrint('print');
>>>>>>> origin/eko
};

const refresh = () => {
  resetFilters();
<<<<<<< HEAD
};</script>
=======
};

const toggleCollapse = () => {
  // collapsible header
};
</script>
>>>>>>> origin/eko
