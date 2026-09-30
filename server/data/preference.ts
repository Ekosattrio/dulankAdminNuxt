// Mock data untuk halaman /preference (dipindah dari app/pages/preference.vue)
// Dilayani generic CRUD: server/api/[...mock].ts (catch-all)

export const preferences = [
  { key: "maintenance", label: "Maintenance Mode", icon: "ti ti-alert-triangle", enabled: false },
  { key: "coupon", label: "Coupon", icon: "ti ti-ticket", enabled: true },
  { key: "offers", label: "Offers", icon: "ti ti-gift", enabled: true },
  { key: "multilanguage", label: "MultiLanguage", icon: "ti ti-language", enabled: true },
  { key: "multicurrency", label: "Multicurrency", icon: "ti ti-currency-dollar", enabled: true },
  { key: "sms", label: "SMS Notifications", icon: "ti ti-message", enabled: true },
  { key: "stores", label: "Stores Multi-branch", icon: "ti ti-building-store", enabled: true },
  { key: "warehouses", label: "Warehouses", icon: "ti ti-archive", enabled: true },
  { key: "barcode", label: "Barcode Scanner", icon: "ti ti-barcode", enabled: true },
  { key: "qrcode", label: "QR Code Engine", icon: "ti ti-qrcode", enabled: true },
  { key: "hrms", label: "HRMS Module", icon: "ti ti-users", enabled: true },
]
