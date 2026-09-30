// Mock data untuk halaman /printer-settings (dipindah dari app/pages/printer-settings.vue)
// Dilayani generic CRUD: server/api/[...mock].ts (catch-all)

export const printers = [
  { id: 1, name: "HP LaserJet Pro MFP", connectionType: "Network", ipAddress: "192.168.1.22", port: "9100" },
  { id: 2, name: "Epson TM-T82 Thermal POS", connectionType: "Network", ipAddress: "192.168.1.25", port: "9100" },
  { id: 3, name: "Canon imagePRESS C650", connectionType: "Network", ipAddress: "192.168.1.50", port: "9100" },
]
