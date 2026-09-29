// product.ts — type/interface untuk domain product (auto-import shared/types)
// Dibuat oleh refactor Nuxt 4: interface dipisah dari halaman ke folder tersendiri.

export interface BannerItem {
  id: string
  src: string
  title: string
  desc: string
  start: string
  end: string
  created: string
}

export interface BestsellerItem {
  rank: number
  category: string
  product: string
  sold: number
  unit: string
  total: number
}

export interface CategoryItem {
  id: string
  name: string
  code: string
  createdDate: string
  status: 'Active' | 'Deactive'
}

export interface ClientLogo {
  id: number;
  name: string;
  logoUrl: string;
}

export interface CouponItem {
  id: number
  name: string
  code: string
  type: 'Fixed' | 'Percentage'
  discount: number
  limit: number
  used: number
  valid: string
  status: 'Active' | 'Inactive'
}

export interface DiscountItem {
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

export interface DiscountPlan {
  id: number
  name: string
  customers: string
  status: 'Active' | 'Inactive'
}

export interface ProductCustom {
  id: string
  name: string
  defaultSize: string
  paperTypes: string
  machine: string
  active: boolean
  image: string
}

export interface ProductItem {
  name: string
  code: string
  category: string
}

export interface ProductListRecord {
  id: string;
  code: string;
  name: string;
  category: string;
  subCategory: string;
  unit: string;
  price: number;
  priceType: string;
  created: string;
}

export interface ProductProcess {
  id: number;
  code: string;
  product: string;
  image: string;
  processName: string;
  createDate: string;
}

export interface StoreItem {
  id: number;
  storeName: string;
  userName: string;
  address: string;
  phone: string;
  email: string;
  status: "Active" | "Inactive";
}

export interface SubCategoryItem {
  id: string;
  name: string;
  category: string;
  categoryCode: string;
  description: string;
  itemUsed: number;
  createdBy: string;
  status: "Active" | "Deactive";
}

export interface UnitItem {
  id: string;
  name: string;
  shortName: string;
  itemUsed: number;
  createdOn: string;
  status: "Active" | "Deactive";
}

export interface VariantItem {
  id: string;
  name: string;
  values: string[];
  itemUsed: number;
  createdOn: string;
  status: "Active" | "Deactive";
}

export interface VoucherItem {
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
