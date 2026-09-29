// report.ts — type/interface untuk domain report (auto-import shared/types)
// Dibuat oleh refactor Nuxt 4: interface dipisah dari halaman ke folder tersendiri.

export interface BrowserStat {
  name: string;
  percent: number;
  count: string;
  color: string;
}

export interface CountryData {
  id: string;
  name: string;
  sales: string;
  percentage: number;
  x: number; // SVG coordinates percent
  y: number;
}

export interface SalesBestSellerItem {
  id: number;
  name: string;
  price: number;
  sales: number;
  image: string;
  category: string;
  stock: number;
}

export interface TopPage {
  path: string;
  views: number;
  avgTime: string;
  exitRate: string;
  badgeColor: string;
}

export interface TransactionItem {
  id: number;
  name: string;
  time: string;
  paymentMethod: string;
  reference: string;
  status: "Success" | "Canceled" | "Pending";
  amount: number;
  image: string;
  date: string;
}
