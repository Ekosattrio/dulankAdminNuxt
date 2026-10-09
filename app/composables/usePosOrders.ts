import type { Sale } from '#server/types/sale'
import type { SalesPayment } from '#server/types/sales-document'

export interface PosOrderRecord {
  id: string
  saleNo: string
  customer: string
  avatar: string
  date: string
  status: 'Complete' | 'Pending'
  grandTotal: number
  paid: number
  due: number
  paymentStatus: 'Paid' | 'Unpaid' | 'Partial'
  biller: string
  method: string
  items?: any[]
  payments?: SalesPayment[]
  raw: Sale
}

export function usePosOrders() {
  const { data: response, pending, error, refresh } = useApiFetch<{ success: boolean; data: Sale[]; message?: string }>('/api/sales', {
    key: 'pos-orders-list',
    query: { channel: 'POS' },
    lazy: false
  })

  const orders = computed<PosOrderRecord[]>(() => {
    const rawSales = response.value?.data || []
    return rawSales.map((sale, index) => {
      const payments = sale.payments || []
      const totalPaid = payments.length > 0
        ? payments.reduce((sum, p) => sum + (p.amount || 0), 0)
        : (sale.status === 'Paid' ? sale.total : (sale.status === 'Partial' ? Math.round(sale.total / 2) : 0))

      const due = Math.max(0, sale.total - totalPaid)
      const paymentStatus: 'Paid' | 'Unpaid' | 'Partial' = due === 0 ? 'Paid' : (totalPaid > 0 ? 'Partial' : 'Unpaid')
      const orderStatus: 'Complete' | 'Pending' = due === 0 ? 'Complete' : 'Pending'

      return {
        id: sale.id,
        saleNo: sale.saleNo,
        customer: sale.customer || 'Walk-in Customer',
        avatar: `/assets/img/customer/customer${(index % 4) + 1}.jpg`,
        date: sale.date || 'Today',
        status: orderStatus,
        grandTotal: sale.total,
        paid: totalPaid,
        due,
        paymentStatus,
        biller: 'Admin',
        method: sale.method || 'Cash',
        items: sale.items || [],
        payments,
        raw: sale
      }
    })
  })

  async function recordPayment(saleId: string, amount: number, paymentType: string) {
    const res = await apiFetch(`/api/sales/${saleId}/payments`, {
      method: 'POST',
      body: {
        amount,
        paymentType,
        paymentDate: new Date().toLocaleDateString('en-GB'),
        reference: `PAY-${Date.now()}`
      }
    })
    await refresh()
    return res
  }

  async function deleteOrder(saleId: string) {
    const res = await apiFetch(`/api/sales/${saleId}`, {
      method: 'DELETE'
    })
    await refresh()
    return res
  }

  return {
    orders,
    pending,
    error,
    refresh,
    recordPayment,
    deleteOrder
  }
}

