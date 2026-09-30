
// supplier.ts — type/interface untuk domain supplier (auto-import shared/types)
// Dibuat oleh refactor Nuxt 4: interface dipisah dari halaman ke folder tersendiri.

export 
interface SupplierItem {
  id: number;
  code: string;
  name: string;
  email: string;
  contact: string;
  picName: string;
  status: "Active" | "Inactive";
  date: string;
}

