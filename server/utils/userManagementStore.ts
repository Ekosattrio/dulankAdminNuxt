import type { MemberUser, UserAdmin, SystemRole, ModulePermission, DeleteAccountRequest, PermissionMenuGroup, PermissionAction } from '~~/server/types/user-management'

export const initialMembers: MemberUser[] = [
  {
    id: 'mem-1',
    customerId: 'ID000001',
    name: 'Budi Santoso',
    email: 'budi.santoso@email.com',
    verifiedEmail: true,
    subscription: true,
    status: 'Active Member',
    phone: '081234567890',
    avatar: '/assets/img/users/user-01.jpg',
    createdAt: '2024-01-10',
  },
  {
    id: 'mem-2',
    customerId: 'ID000002',
    name: 'PT Maju Jaya',
    email: 'info@majujaya.co.id',
    verifiedEmail: true,
    subscription: true,
    status: 'Active Member',
    phone: '0215551234',
    avatar: '/assets/img/users/user-02.jpg',
    createdAt: '2024-01-15',
  },
  {
    id: 'mem-3',
    customerId: 'ID000003',
    name: 'Siti Aminah',
    email: 'siti.aminah@email.com',
    verifiedEmail: true,
    subscription: false,
    status: 'Active Member',
    phone: '081398765432',
    avatar: '/assets/img/users/user-03.jpg',
    createdAt: '2024-02-01',
  },
  {
    id: 'mem-4',
    customerId: 'ID000004',
    name: 'Toko Berkah',
    email: 'toko.berkah@email.com',
    verifiedEmail: false,
    subscription: false,
    status: 'Active Member',
    phone: '085712345678',
    avatar: '/assets/img/users/user-04.jpg',
    createdAt: '2024-02-12',
  },
  {
    id: 'mem-5',
    customerId: 'ID000005',
    name: 'CV Creative Design',
    email: 'admin@creativedesign.com',
    verifiedEmail: true,
    subscription: true,
    status: 'Active Member',
    phone: '0227891234',
    avatar: '/assets/img/users/user-05.jpg',
    createdAt: '2024-03-05',
  },
  {
    id: 'mem-6',
    customerId: 'ID000006',
    name: 'Ahmad Fauzi',
    email: 'ahmad.fauzi@email.com',
    verifiedEmail: true,
    subscription: false,
    status: 'Suspended',
    phone: '081987654321',
    avatar: '/assets/img/users/user-06.jpg',
    createdAt: '2024-03-18',
  },
]

export const initialUserAdmins: UserAdmin[] = [
  {
    id: 'adm-1',
    userId: 'U001',
    name: 'Budi Santoso',
    email: 'budi.santoso@email.com',
    role: 'Admin',
    stores: ['Toko Pusat', 'Toko Cabang 1'],
    status: 'Active',
    phone: '081234567890',
    avatar: '/assets/img/users/user-01.jpg',
    descriptions: 'Super administrator toko',
    createdAt: '2024-01-01',
  },
  {
    id: 'adm-2',
    userId: 'U002',
    name: 'Siti Aminah',
    email: 'siti.aminah@email.com',
    role: 'Manager',
    stores: ['Toko Cabang 2'],
    status: 'Active',
    phone: '081398765432',
    avatar: '/assets/img/users/user-02.jpg',
    descriptions: 'Operational Store Manager',
    createdAt: '2024-01-15',
  },
  {
    id: 'adm-3',
    userId: 'U003',
    name: 'Ahmad Fauzi',
    email: 'ahmad.fauzi@email.com',
    role: 'Supervisor',
    stores: ['Toko Pusat', 'Toko Cabang 1', 'Toko Cabang 3'],
    status: 'Active',
    phone: '081987654321',
    avatar: '/assets/img/users/user-03.jpg',
    descriptions: 'Head Production Supervisor',
    createdAt: '2024-02-01',
  },
  {
    id: 'adm-4',
    userId: 'U004',
    name: 'Diana Putri',
    email: 'diana.putri@email.com',
    role: 'Staff',
    stores: ['Toko Cabang 2'],
    status: 'Inactive',
    phone: '085712349999',
    avatar: '/assets/img/users/user-04.jpg',
    descriptions: 'Customer Service & Kasir',
    createdAt: '2024-02-20',
  },
]

export const initialRoles: SystemRole[] = [
  { id: 'role-1', name: 'Admin', createdOn: '25 May 2023', description: 'Full system privileges' },
  { id: 'role-2', name: 'Customer', createdOn: '30 May 2023', description: 'Public webstore customer account' },
  { id: 'role-3', name: 'Shop Owner', createdOn: '15 Jun 2023', description: 'Store branch owner & reports access' },
  { id: 'role-4', name: 'Manager', createdOn: '20 Jul 2023', description: 'Branch operation & order management' },
  { id: 'role-5', name: 'Supervisor', createdOn: '12 Aug 2023', description: 'Production & job management' },
  { id: 'role-6', name: 'Staff', createdOn: '05 Sep 2023', description: 'Cashier & data entry' },
]

export const initialDeleteRequests: DeleteAccountRequest[] = [
  {
    id: 'del-1',
    email: 'steven@example.com',
    userName: 'Steven',
    avatar: '/assets/img/users/user-01.jpg',
    requisitionDate: '25 Sep 2023',
    deleteRequestDate: '01 Oct 2023',
  },
  {
    id: 'del-2',
    email: 'susan.lopez@example.com',
    userName: 'Susan Lopez',
    avatar: '/assets/img/users/user-02.jpg',
    requisitionDate: '30 Sep 2023',
    deleteRequestDate: '05 Oct 2023',
  },
  {
    id: 'del-3',
    email: 'robert.grossman@example.com',
    userName: 'Robert Grossman',
    avatar: '/assets/img/users/user-03.jpg',
    requisitionDate: '10 Sep 2023',
    deleteRequestDate: '25 Sep 2023',
  },
  {
    id: 'del-4',
    email: 'janet.perry@example.com',
    userName: 'Janet Perry',
    avatar: '/assets/img/users/user-04.jpg',
    requisitionDate: '15 Sep 2023',
    deleteRequestDate: '28 Sep 2023',
  },
]

export const permissionMenuGroups: PermissionMenuGroup[] = [
  {
    group: 'DASHBOARD',
    pages: ['Dashboard Admin', 'Subscriptions', 'Sales Dashboard', 'Kalkulator Dashboard', 'Analytics Dashboard'],
  },
  {
    group: 'SALES',
    pages: ['Sales', 'Invoice', 'Delivery Note', 'Sales Return', 'Quotation', 'Request For Quotation', 'POS'],
  },
  {
    group: 'PAYMENT',
    pages: ['Payment-IN', 'Payment-OUT'],
  },
  {
    group: 'WORKFLOW',
    pages: ['Flow Category', 'Flow Name', 'Flow Template', 'Work Flow'],
  },
  {
    group: 'ORDERS',
    pages: ['Orders', 'Job Orders', 'Job List', 'Job Branch', 'My Job', 'My Incentive'],
  },
  {
    group: 'PURCHASES',
    pages: ['Purchase', 'Purchase Order', 'Purchase Return', 'Purchase Item', 'Purchase Category'],
  },
  {
    group: 'PROMO',
    pages: ['Voucher', 'Discount plan', 'Discount'],
  },
  {
    group: 'FINANCE & ACCOUNT',
    pages: [
      'Expense',
      'Expense category',
      'Income',
      'Income category',
      'Payments',
      'Balance Account',
      'Bank Account',
      'Money Transfer',
      'Balance Sheet',
      'Cash Flow',
      'Account Statement',
      'Cash Advance',
      'Incentive',
      'Tax',
    ],
  },
  {
    group: 'PEOPLES',
    pages: ['Customers', 'Customer Types', 'Address', 'Supplier', 'Branch Store'],
  },
  {
    group: 'HRM',
    pages: ['Employees', 'Department', 'Employee salary', 'Payslip'],
  },
  {
    group: 'REPORT',
    pages: [
      'Sales Report',
      'Best Seller',
      'Purchase Report',
      'Invoice Report',
      'Supplier Report',
      'Supplier Due Report',
      'Customer Report',
      'Customer Due Report',
      'Customer Subscription',
      'Product Report',
      'Expense Report',
      'Income Report',
      'Tax Report',
      'Profit & Loss',
      'Annual Report',
    ],
  },
  {
    group: 'CONTENT',
    pages: ['All Blog', 'Blog Tag', 'Blog Category', 'Blog Comment', 'FAQ', 'Our Client', 'Download Files', 'Footer', 'Banner'],
  },
  {
    group: 'USER MANAGEMENT',
    pages: ['All Members', 'User Admin', 'Role', 'Permissions', 'Delete Account Request'],
  },
  {
    group: 'SETTING',
    pages: [
      'General Settings',
      'Security Settings',
      'Notification',
      'Connected Apps',
      'System Settings',
      'Company Settings',
      'Localization',
      'Prefixes',
      'Preference',
      'Appearance',
      'Language',
      'Authentication',
      'AI Settings',
    ],
  },
]

export const permissionPages: string[] = permissionMenuGroups.flatMap((g) => g.pages)

export function getDefaultPermissionAction(roleName: string): PermissionAction {
  const isOwnerOrAdmin = roleName === 'Admin' || roleName === 'Shop Owner'
  if (isOwnerOrAdmin) {
    return {
      create: true,
      edit: true,
      delete: true,
      view: true,
      allowAll: true,
    }
  }

  if (roleName === 'Manager' || roleName === 'Supervisor') {
    return {
      create: true,
      edit: true,
      delete: false,
      view: true,
      allowAll: false,
    }
  }

  // Staff, Customer, and other roles default to view-only
  return {
    create: false,
    edit: false,
    delete: false,
    view: true,
    allowAll: false,
  }
}

export const initialPermissionsModules: string[] = permissionPages

export const permissionsState: Record<string, Record<string, PermissionAction>> = {}

for (const page of permissionPages) {
  permissionsState[page] = {}
  for (const role of initialRoles) {
    permissionsState[page][role.name] = getDefaultPermissionAction(role.name)
  }
}

