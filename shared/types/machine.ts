// machine.ts — type/interface untuk domain machine (auto-import shared/types)
// Dibuat oleh refactor Nuxt 4: interface dipisah dari halaman ke folder tersendiri.

export interface SelfLaminate {
  id: number;
  name: string;
  minSize: string;
  maxSize: string;
  rateCm: number;
  minim: number;
  update: string;
  status: "Active" | "Deactive";
}

export interface SelfPoli {
  id: number;
  name: string;
  maxSize: string;
  rateCm: number;
  minim: number;
  update: string;
  status: "Active" | "Deactive";
}

export interface SelfPond {
  id: number;
  name: string;
  maxSize: string;
  putusRate: number;
  putusMinim: number;
  kissRate: number;
  kissMinim: number;
  update: string;
  status: "Active" | "Deactive";
}

export interface SelfPress {
  id: number
  type: 'Offset' | 'Digital Printing'
  name: string
  colors: number
  maxArea: string
  plateCost: number
  minim: number
  druck: number
  update: string
  status: 'Active' | 'Inactive'
}

export interface VendorLaminate {
  id: number;
  sumber: string;
  lokasi: string;
  avatar: string;
  name: string;
  maxSize: string;
  rateCm: number;
  minim: number;
  update: string;
}

export interface VendorPoli {
  id: number;
  sumber: string;
  lokasi: string;
  avatar: string;
  name: string;
  maxSize: string;
  rateCm: number;
  minim: number;
  update: string;
}

export interface VendorPond {
  id: number;
  sumber: string;
  lokasi: string;
  avatar: string;
  name: string;
  maxSize: string;
  putusRate: number;
  putusMinim: number;
  kissRate: number;
  kissMinim: number;
  update: string;
}

export interface VendorPress {
  id: number;
  sumber: string;
  lokasi: string;
  avatar: string;
  name: string;
  colors: number;
  minim: number;
  druck: number;
  update: string;
}
