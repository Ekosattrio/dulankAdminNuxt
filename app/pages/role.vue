<template>
  <div class="page-wrapper">
    <div class="content container-fluid">
      <div class="page-header mt-3">
        <div class="add-item d-flex">
          <div class="page-title">
            <h4>Permission</h4>
            <h6>Manage your Permissions</h6>
          </div>
        </div>
        <ul class="table-top-head">
          <li>
            <a title="Refresh" href="javascript:void(0);" @click="refresh"><i class="ti ti-rotate"></i></a>
          </li>
          <li>
            <a title="Collapse" href="javascript:void(0);" @click="toggleCollapse"><i class="ti ti-chevron-up"></i></a>
          </li>
        </ul>
      </div>

      <div class="card table-list-card">
        <div class="card-body">
          <div class="table-responsive">
            <table class="table permission-table">
              <thead>
                <tr>
                  <th style="width: 40%">Pages</th>
                  <th class="text-center" style="width: 15%">Owner</th>
                  <th class="text-center" style="width: 15%">Super Admin</th>
                  <th class="text-center" style="width: 15%">Admin</th>
                  <th class="text-center" style="width: 15%">Designer</th>
                </tr>
                <tr class="bg-light">
                  <th style="width: 40%">
                    <label class="checkboxs mb-0 d-inline-flex align-items-center cursor-pointer">
                      <input type="checkbox" :checked="allExpanded" @change="toggleAllExpanded" />
                      <span class="ms-2 fw-semibold" style="font-size: 13px">Show All</span>
                    </label>
                  </th>
                  <th v-for="(role, colIdx) in roles" :key="colIdx" class="text-center" style="width: 15%">
                    <label class="checkboxs mb-0 d-inline-flex align-items-center cursor-pointer">
                      <input type="checkbox" :checked="isColumnAllSelected(colIdx)" @change="toggleColumnSelection(colIdx)" />
                      <span class="ms-2 fw-semibold" style="font-size: 13px">Select All</span>
                    </label>
                  </th>
                </tr>
              </thead>
              <tbody>
                <template v-for="group in groups" :key="group.id">
                  <!-- Group Header -->
                  <tr class="group-header bg-light cursor-pointer border-top" @click="toggleGroup(group.id)">
                    <td>
                      <div class="d-flex align-items-center gap-2 py-1">
                        <span class="toggle-btn text-muted">
                          <i :class="expandedGroups.includes(group.id) ? 'ti ti-chevron-down' : 'ti ti-chevron-right'"></i>
                        </span>
                        <strong class="text-dark">{{ group.title }}</strong>
                        <span class="badge bg-secondary ms-2" style="font-size: 11px">
                          {{ group.children.length }}
                        </span>
                      </div>
                    </td>
                    <td class="text-center"></td>
                    <td class="text-center"></td>
                    <td class="text-center"></td>
                    <td class="text-center"></td>
                  </tr>

                  <!-- Child Rows -->
                  <tr
                    v-for="child in group.children"
                    v-show="expandedGroups.includes(group.id)"
                    :key="child"
                    class="child-row border-bottom"
                  >
                    <td class="ps-5 text-secondary">{{ child }}</td>
                    <td v-for="(role, colIdx) in roles" :key="colIdx" class="text-center">
                      <input
                        type="checkbox"
                        class="form-check-input"
                        :checked="permissions[getPermissionKey(child, colIdx)]"
                        @change="togglePermission(child, colIdx)"
                      />
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>

          <div class="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
            <button type="button" class="btn btn-light" @click="resetDefaults">Reset</button>
            <button type="button" class="btn btn-warning text-white" @click="savePermissions">Save Permissions</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

useHead({
  title: "Role Permissions - Kacetak System",
});

const roles = ["Owner", "Super Admin", "Admin", "Designer"];

interface PermissionGroup {
  id: string;
  title: string;
  children: string[];
}

const groups = ref<PermissionGroup[]>([
  {
    id: "dashboard",
    title: "Dashboard",
    children: ["Super Admin", "Sales Dashboard", "Kalkulator Dashboard", "Analytics Dashboard"],
  },
  {
    id: "orders",
    title: "Orders",
    children: ["Workflow", "Flow Category", "Flow Name", "Flow Arrange", "Orders", "Job Orders", "Job Task", "My Incentive"],
  },
  {
    id: "webstore",
    title: "Webstore",
    children: [
      "Customers",
      "Cart",
      "Checkout",
      "Wishlist",
      "Reviews",
      "Support Ticket",
      "Contact Form",
      "CALCULATOR APPS",
      "All Printing Shop",
      "All Machine",
      "All Paper Shop",
      "All Papers",
    ],
  },
  {
    id: "inventory",
    title: "Inventory",
    children: [
      "Products",
      "Create Product",
      "Category",
      "Sub Category",
      "Unit",
      "Variant",
      "All Papers",
      "All Machine",
      "Components",
    ],
  },
  {
    id: "sales",
    title: "Sales",
    children: ["Sales", "Invoice", "Delivery Note", "Sales Return", "Quotation", "Request For Quotation", "POS"],
  },
  {
    id: "purchases",
    title: "Purchases",
    children: ["Purchase", "Purchase Order", "Purchase Return", "Purchase Item", "Purchase Category"],
  },
  {
    id: "payment",
    title: "Payment",
    children: ["Payment-IN", "Payment-OUT"],
  },
  {
    id: "promo",
    title: "Promo",
    children: [
      "Voucher",
      "Discount",
      "Expense",
      "Income",
      "Bank Account",
      "Money Transfer",
      "Balance Sheet",
      "Cash Flow",
      "Account Statement",
      "Cash Advance",
      "Incentive",
      "Tax",
    ],
  },
  {
    id: "peoples",
    title: "Peoples",
    children: ["Customers", "Customer Types", "Address", "Supplier", "Branch Store"],
  },
  {
    id: "hrm",
    title: "HRM",
    children: ["Employees", "Department", "Payroll"],
  },
  {
    id: "report",
    title: "Report",
    children: [
      "Sales Report",
      "Purchase Report",
      "Invoice Report",
      "Supplier Report",
      "Customers Report",
      "Product Report",
      "Expense Report",
      "Income Report",
      "Tax Report",
      "Profit & Loss",
      "Annual Report",
    ],
  },
  {
    id: "content",
    title: "Content",
    children: [
      "All Blog",
      "Blog Tag",
      "Blog Category",
      "Blog Comment",
      "FAQ",
      "Our Client",
      "Download Files",
      "Footer",
      "Banner",
      "User",
      "Role",
      "Permissions",
      "Delete Account Request",
    ],
  },
  {
    id: "setting",
    title: "Setting",
    children: ["Webstore Setting", "Locations", "App Setting", "System Setting", "Prefixes"],
  },
]);

const expandedGroups = ref<string[]>(["dashboard", "orders"]);

const toggleGroup = (groupId: string) => {
  const idx = expandedGroups.value.indexOf(groupId);
  if (idx === -1) {
    expandedGroups.value.push(groupId);
  } else {
    expandedGroups.value.splice(idx, 1);
  }
};

const allExpanded = computed(() => {
  return expandedGroups.value.length === groups.value.length;
});

const toggleAllExpanded = () => {
  if (allExpanded.value) {
    expandedGroups.value = [];
  } else {
    expandedGroups.value = groups.value.map((g) => g.id);
  }
};

// Permissions map: `${childName}_${colIdx}` -> boolean
const permissions = ref<Record<string, boolean>>({});

const getPermissionKey = (child: string, colIdx: number) => `${child}_${colIdx}`;

// Initialize Owner and Super Admin checked by default
groups.value.forEach((g) => {
  g.children.forEach((c) => {
    permissions.value[getPermissionKey(c, 0)] = true; // Owner
    permissions.value[getPermissionKey(c, 1)] = true; // Super Admin
    permissions.value[getPermissionKey(c, 2)] = true; // Admin
    permissions.value[getPermissionKey(c, 3)] = false; // Designer
  });
});

const togglePermission = (child: string, colIdx: number) => {
  const key = getPermissionKey(child, colIdx);
  permissions.value[key] = !permissions.value[key];
};

const allChildren = computed(() => {
  return groups.value.flatMap((g) => g.children);
});

const isColumnAllSelected = (colIdx: number) => {
  return allChildren.value.every((child) => permissions.value[getPermissionKey(child, colIdx)]);
};

const toggleColumnSelection = (colIdx: number) => {
  const selectAll = !isColumnAllSelected(colIdx);
  allChildren.value.forEach((child) => {
    permissions.value[getPermissionKey(child, colIdx)] = selectAll;
  });
};

const resetDefaults = () => {
  groups.value.forEach((g) => {
    g.children.forEach((c) => {
      permissions.value[getPermissionKey(c, 0)] = true;
      permissions.value[getPermissionKey(c, 1)] = true;
      permissions.value[getPermissionKey(c, 2)] = true;
      permissions.value[getPermissionKey(c, 3)] = false;
    });
  });
};

const savePermissions = () => {
  alert("Permissions saved successfully!");
};

const refresh = () => {
  // refresh
};

const toggleCollapse = () => {
  // collapse
};
</script>

<style scoped>
.permission-table .group-header {
  background-color: #f8f9fa;
  transition: background-color 0.2s ease;
}
.permission-table .group-header:hover {
  background-color: #e9ecef;
}
.permission-table .child-row td:first-child {
  padding-left: 45px !important;
  color: #6c757d;
}
</style>
