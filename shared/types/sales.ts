// sales.ts — type/interface untuk domain sales (auto-import shared/types)
// Dibuat oleh refactor Nuxt 4: interface dipisah dari halaman ke folder tersendiri.

export interface CartItem {
  id: number
  product: string
  image: string
  user: string
  category: string
  price: number
  qty: number
  totalPrice: number
  date: string
  status: 'Active' | 'Checkout' | 'Delete'
}

export interface CheckoutItem {
  id: number
  user: string
  date: string
  amount: number
  method: string
  status: 'Berhasil' | 'Gagal'
  voucher: string
  deliveryFee: number
  details: string
}

export interface DNItemRow {
  description: string;
  qty: number;
  unit: string;
  packingQty: string;
  weight: string;
}

export interface DeliveryNoteItem {
  id: string;
  dnNo: string;
  date: string;
  customer: string;
  noSales: string;
  shippingAddress: string;
  status: "Complete" | "Pending" | "Ordered" | "Received";
  dateStatus: string;
  po: string;
  shippingBy: string;
  reference: string;
  items: DNItemRow[];
}

export interface EditQuotationLineItem {
  productName: string;
  description?: string;
  moq: number;
  unitPrice: number;
  order: number;
  unit: string;
  amount: number;
}

export interface EditRFQLineItem {
  description: string;
  quantity: number;
  unit: string;
  eta: string;
}

export interface InvoiceItem {
  id: string;
  invoiceNo: string;
  customer: string;
  dueDate: string;
  amount: number;
  paid: number;
  amountDue: number;
  status: "Paid" | "Partial" | "Unpaid";
}

export interface OnlineOrder {
  id: number;
  customer: string;
  avatar: string;
  reference: string;
  date: string;
  status: "Complete" | "Pending";
  grandTotal: number;
  paid: number;
  due: number;
  paymentStatus: "Paid" | "Unpaid";
  biller: string;
}

export interface Order {
  id: number;
  orderNo: string;
  customer: string;
  date: string;
  status: "Complete" | "Processing" | "Waiting" | "Cancel";
  statusBy: string;
  salesChannel: string;
  shipping: string;
}

export interface OrderItem {
  id: number;
  name: string;
  description: string;
  qty: number;
  unit: string;
  price: number;
}

export interface POSCartItem {
  id: string;
  productId: string;
  code: string;
  name: string;
  category: string;
  price: number;
  qty: number;
  specs: string;
  jobTitle: string;
}

export interface POSProduct {
  id: string;
  code: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  image: string;
  specs?: string;
}

export interface PosOrder {
  id: number;
  customer: string;
  avatar: string;
  reference: string;
  date: string;
  status: "Complete" | "Pending";
  grandTotal: number;
  paid: number;
  due: number;
  paymentStatus: "Paid" | "Unpaid";
  biller: string;
}

export interface QuotationItem {
  id: string;
  noQuotation: string;
  date: string;
  customer: string;
  email: string;
  status: "Send" | "Complete" | "Pending" | "Ordered" | "Received";
  dateStatus: string;
  total: number;
  channel: "Online" | "Offline";
  dueDate: string;
}

export interface QuotationLineItem {
  productName: string
  description?: string
  moq: number
  unitPrice: number
  order: number
  unit: string
  amount: number
}

export interface RFQItem {
  id: string;
  noRequest: string;
  customer: string;
  email: string;
  telp: string;
  date: string;
  status: "Ordered" | "Complete" | "Pending" | "Received";
}

export interface RFQLineItem {
  description: string
  quantity: number
  unit: string
  eta: string
}

export interface ReturnItem {
  name: string;
  description: string;
  qtyOrder: number;
  qtyReturn: number;
  unit: string;
  price: number;
  returnAmount: number;
  reason: string;
}

export interface ReviewItem {
  id: number;
  user: string;
  productCode: string;
  product: string;
  date: string;
  rating: number;
  title: string;
  content: string;
  status: "Publish" | "Archived";
}

export interface SaleItem {
  id: string;
  customer: string;
  date: string;
  subTotal: string;
  deliveryFee: string;
  discount: string;
  tax: string;
  total: string;
  delivery: "Pick Up" | "Shipping";
  channel: "POS" | "Website";
  status: "Paid" | "Unpaid" | "Partial";
  method: "Cash" | "Bank Transfer" | "Debit Card";
}

export interface SalesReturn {
  id: number;
  returnNo: string;
  date: string;
  salesNo: string;
  customer: string;
  paymentStatus: "Paid" | "Unpaid";
  paymentDate: string;
  paymentMethod: string;
  total: number;
  items: ReturnItem[];
}

export interface WishlistItem {
  id: number;
  product: string;
  image: string;
  user: string;
  category: string;
  price: number;
  qty: number;
  totalPrice: number;
  date: string;
  status: "Active" | "Checkout" | "Delete";
}
