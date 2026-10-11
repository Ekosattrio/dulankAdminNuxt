export type BillingStatus = 'Berhasil' | 'Gagal'
export type BillingPaymentMethod = 'Kartu Kredit' | 'Transfer Bank' | 'E-Wallet' | 'Virtual Account'
export interface BillingRecord { id: string; transactionId: string; userId: string; userEmail: string; billingId: string; transactionNo: string; billingDate: string; subtotal: number; discount: number; tax: number; shipping: number; total: number; status: BillingStatus; paymentMethod: BillingPaymentMethod; createdAt: string; updatedAt: string }
export interface BillingSummary { totalTransaction: number; totalSuccess: number; totalFailed: number }
export interface BillingStore { summary: BillingSummary; records: BillingRecord[] }
export interface BillingQuery { search?: string; paymentMethod?: string; status?: string; startDate?: string; endDate?: string }
