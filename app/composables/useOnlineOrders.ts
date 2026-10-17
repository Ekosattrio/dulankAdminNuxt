import type { Ref } from 'vue'
import type { OnlineOrderItem, OnlineOrderQuery } from '#server/types/online-order'

interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

const defaultOnlineOrders: OnlineOrderItem[] = [
  {
    id: '1',
    customer: 'Joko Widodo',
    avatar: '/assets/img/customer/customer1.jpg',
    reference: 'ONL001',
    date: '24 Dec 2024',
    status: 'Complete',
    grandTotal: 450000,
    paid: 450000,
    due: 0,
    paymentStatus: 'Paid',
    biller: 'Webstore',
    items: [
      {
        product: 'Nike Jordan',
        qty: 2,
        price: 200000,
        discount: 50000,
        tax: 0,
        taxAmount: 0,
        unitCost: 150000,
        totalCost: 300000,
      },
      {
        product: 'Apple Series 5 Watch',
        qty: 1,
        price: 150000,
        discount: 0,
        tax: 0,
        taxAmount: 0,
        unitCost: 150000,
        totalCost: 150000,
      },
    ],
    payments: [
      {
        date: '24 Dec 2024',
        reference: 'INV/ONL001',
        amount: 450000,
        paidBy: 'Midtrans VA',
      },
    ],
  },
  {
    id: '2',
    customer: 'Carl Evans',
    avatar: '/assets/img/customer/customer2.jpg',
    reference: 'ONL002',
    date: '23 Dec 2024',
    status: 'Pending',
    grandTotal: 1250000,
    paid: 500000,
    due: 750000,
    paymentStatus: 'Unpaid',
    biller: 'Marketplace',
    items: [
      {
        product: 'Kertas Art Paper 150gr',
        qty: 2,
        price: 625000,
        discount: 0,
        tax: 0,
        taxAmount: 0,
        unitCost: 625000,
        totalCost: 1250000,
      },
    ],
    payments: [
      {
        date: '23 Dec 2024',
        reference: 'INV/ONL002',
        amount: 500000,
        paidBy: 'Direct Bank Transfer',
      },
    ],
  },
  {
    id: '3',
    customer: 'Minerva Davis',
    avatar: '/assets/img/customer/customer3.jpg',
    reference: 'ONL003',
    date: '22 Dec 2024',
    status: 'Complete',
    grandTotal: 890000,
    paid: 890000,
    due: 0,
    paymentStatus: 'Paid',
    biller: 'Webstore',
    items: [
      {
        product: 'Tinta Neotex 1Kg Cyan',
        qty: 2,
        price: 445000,
        discount: 0,
        tax: 0,
        taxAmount: 0,
        unitCost: 445000,
        totalCost: 890000,
      },
    ],
    payments: [
      {
        date: '22 Dec 2024',
        reference: 'INV/ONL003',
        amount: 890000,
        paidBy: 'Xendit QRIS',
      },
    ],
  },
  {
    id: '4',
    customer: 'Anthony Lewis',
    avatar: '/assets/img/customer/customer4.jpg',
    reference: 'ONL004',
    date: '20 Dec 2024',
    status: 'Complete',
    grandTotal: 350000,
    paid: 350000,
    due: 0,
    paymentStatus: 'Paid',
    biller: 'Webstore',
    items: [
      {
        product: 'Sticker Vinyl Putih',
        qty: 2,
        price: 175000,
        discount: 0,
        tax: 0,
        taxAmount: 0,
        unitCost: 175000,
        totalCost: 350000,
      },
    ],
    payments: [
      {
        date: '20 Dec 2024',
        reference: 'INV/ONL004',
        amount: 350000,
        paidBy: 'Credit Card',
      },
    ],
  },
]

export function useOnlineOrders(query?: Ref<OnlineOrderQuery | undefined>) {
  const localOrders = ref<OnlineOrderItem[]>([...defaultOnlineOrders])

  const { data, pending, error, refresh } = useApiFetch<ApiResponse<any[]>>(
    '/api/v1/admin/orders',
    {
      key: 'online-orders-list',
      query: computed(() => ({
        channel: 'webstore',
        search: query?.value?.search,
        status: query?.value?.status,
        limit: 100,
      })),
      default: () => ({ success: true, data: [] }),
    },
  )

  const orders = computed<OnlineOrderItem[]>(() => {
    let items = localOrders.value

    if (!query?.value) return items

    const q = query.value
    return items.filter((order) => {
      if (q.search) {
        const needle = q.search.toLowerCase()
        const matchesCustomer = order.customer.toLowerCase().includes(needle)
        const matchesRef = order.reference.toLowerCase().includes(needle)
        const matchesBiller = order.biller.toLowerCase().includes(needle)
        if (!matchesCustomer && !matchesRef && !matchesBiller) return false
      }
      if (q.status && order.status !== q.status) {
        return false
      }
      if (q.paymentStatus && order.paymentStatus !== q.paymentStatus) {
        return false
      }
      return true
    })
  })

  async function recordPayment(orderId: string, amount: number, method: string) {
    const idx = localOrders.value.findIndex((o) => o.id === orderId)
    if (idx !== -1) {
      const order = localOrders.value[idx]!
      const newPaid = order.paid + amount
      const newDue = Math.max(0, order.grandTotal - newPaid)
      const newPayStatus: 'Paid' | 'Unpaid' = newDue === 0 ? 'Paid' : 'Unpaid'

      const paymentRecord = {
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        reference: `INV/${order.reference}`,
        amount,
        paidBy: method,
      }

      localOrders.value[idx] = {
        ...order,
        paid: newPaid,
        due: newDue,
        paymentStatus: newPayStatus,
        payments: [...(order.payments || []), paymentRecord],
      }
    }

    return {
      success: true,
      message: 'Payment recorded successfully.',
    }
  }

  async function deleteOrder(id: string) {
    localOrders.value = localOrders.value.filter((o) => o.id !== id)
    return {
      success: true,
      message: 'Order deleted successfully.',
    }
  }

  return {
    orders,
    pending,
    error,
    refresh,
    recordPayment,
    deleteOrder,
  }
}

