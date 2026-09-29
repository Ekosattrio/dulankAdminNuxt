// settings.ts — type/interface untuk domain settings (auto-import shared/types)
// Dibuat oleh refactor Nuxt 4: interface dipisah dari halaman ke folder tersendiri.

export interface BanIp {
  id: number
  ip: string
  reason: string
  date: string
  status: boolean
}

export interface CustomField {
  id: number
  module: string
  label: string
  type: string
  defaultValue: string
  required: boolean
  disabled: boolean
  status: 'Active' | 'Inactive'
}

export interface FileItem {
  id: number
  name: string
  type: 'pdf' | 'excel' | 'image' | 'file'
  size: string
  date: string
}

export interface GatewayConfig {
  name: string;
  desc: string;
  enabled: boolean;
  apiKey: string;
  apiSecret: string;
  senderId: string;
}

export type IntegrationKey = "captcha" | "analytics" | "adsense" | "map";

export interface LanguageItem {
  name: string
  code: string
  flag: string
  rtl: boolean
  total: number
  done: number
  progress: number
  status: 'Active' | 'Inactive'
}

export interface ModulePerm {
  name: string;
  create: boolean;
  edit: boolean;
  delete: boolean;
  view: boolean;
}

export interface PaymentGatewayItem {
  name: string;
  desc: string;
  enabled: boolean;
  clientKey: string;
  secretKey: string;
  mode: "sandbox" | "production";
}

export type PaymentGatewayKey = "midtrans" | "xendit" | "paypal" | "stripe" | "braintree" | "wise";

export interface PermissionGroup {
  id: string;
  title: string;
  children: string[];
}

export interface PreferenceItem {
  key: string;
  label: string;
  icon: string;
  enabled: boolean;
}

export interface PrinterItem {
  id?: number;
  name: string;
  connectionType: string;
  ipAddress: string;
  port: string;
}

export type ProviderKey = "facebook" | "twitter" | "google" | "linkedin";

export interface RoleItem {
  id?: number;
  name: string;
  createdOn: string;
}

export type SmsGatewayKey = "nexmo" | "twoFactor" | "twilio" | "zenziva";

export type SortField = "subscriber" | "plan" | "billingCycle" | "method" | "amount" | "createdDate" | "expiringOn" | "status";

export interface SubscriptionItem {
  id: number;
  subscriber: string;
  plan: string;
  billingCycle: string;
  method: string;
  amount: number;
  createdDate: string;
  expiringOn: string;
  status: "Paid" | "Unpaid";
}
