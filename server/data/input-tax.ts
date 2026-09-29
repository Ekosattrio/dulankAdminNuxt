// Mock data untuk halaman /input-tax (dipindah dari app/pages/input-tax.vue)
// Dikonsumsi oleh server/api/input-tax.ts

export const invoices = [
  { id: 1, purchaseNo: 'PO-001', invoiceDate: '02-02-2026', fakturNo: 'INV-KN-2026-01', supplierName: 'PT. Kertas Nusantara', dpp: 35000000, vat: 3850000, credited: 'Yes' },
  { id: 2, purchaseNo: 'PO-002', invoiceDate: '03-02-2026', fakturNo: 'FKT-TP-2026-05', supplierName: 'CV. Tinta Pelangi', dpp: 12000000, vat: 1320000, credited: 'Yes' },
  { id: 3, purchaseNo: 'PO-003', invoiceDate: '04-02-2026', fakturNo: 'GS-SERV-882', supplierName: 'Global Sparepart', dpp: 4500000, vat: 495000, credited: 'Yes' },
  { id: 4, purchaseNo: 'PO-004', invoiceDate: '05-02-2026', fakturNo: 'MM-LAM-102', supplierName: 'Master Laminating', dpp: 2800000, vat: 308000, credited: 'Yes' },
  { id: 5, purchaseNo: 'PO-005', invoiceDate: '06-02-2026', fakturNo: 'SURYA-OFF-03', supplierName: 'Surya Offset Supplier', dpp: 15000000, vat: 1650000, credited: 'Yes' }
]
