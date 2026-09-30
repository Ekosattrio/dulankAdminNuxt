// printing.ts — type/interface untuk domain printing (auto-import shared/types)
// Dibuat oleh refactor Nuxt 4: interface dipisah dari halaman ke folder tersendiri.

export interface CalculatorItem {
  id: number;
  user: string;
  calculate: number;
  request: number;
  usage: number; // percentage
  status: "Active" | "Disabled";
  role?: string;
  lastActive?: string;
}

export interface FixedComponent {
  id: number
  name: string
  value: number
  unit: string
  used: number
  update: string
}

export interface JasaLain {
  id: number
  name: string
  harga: number
  minimHarga: number
  satuan: string
}

export interface MinimumComponent {
  id: number
  name: string
  rate: number
  minim: number
  unit: string
  used: number
  update: string
}

export interface PercetakanVendor {
  id: number;
  name: string;
  avatar: string;
  address: string;
  joinDate: string;
  subscribed: boolean;
  whatsapp: string;
  counts: {
    kertas: number;
    cetak: number;
    laminasi: number;
    pond: number;
    poli: number;
  };
  capabilities: string[];
}

export interface TokoKertas {
  id: number;
  name: string;
  avatar: string;
  address: string;
  joinDate: string;
  subscribed: boolean;
  counts: {
    kertas: number;
    group: number;
    ukuran: number;
    jenis: number;
  };
}
export interface MachineSpec {
  name: string
  minCutWidthMm: number
  minCutHeightMm: number
  maxCutWidthMm: number
  maxCutHeightMm: number
  plateCostPerColor: number
  runChargePer1000: number
  minRunCharge: number
}

export interface PaperSpec {
  name: string
  grammage: number
  planoWidthMm: number
  planoHeightMm: number
  pricePerSheet: number
}

export interface ProfitTier {
  id: string
  minQty: number
  maxQty: number
  profitPosPercent: number
  profitWebstorePercent: number
}

