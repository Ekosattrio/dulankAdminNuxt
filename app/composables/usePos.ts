import type {
  CartItem,
  POSProduct,
  POSCustomer,
  POSCategory,
  HeldOrder,
  POSPaymentMethod,
  POSReceipt,
} from '#server/types/pos'

export function usePos() {
  const catalog = useApiFetch<{ success: boolean; data: POSProduct[] }>('/api/pos-products', {
    key: 'pos-catalog',
  })
  const { products: serverProducts } = useProducts()
  const { sales, saveSale, refresh: refreshSales } = useSales()
  const selectedCategory = ref('all')
  const productSearchQuery = ref('')
  const products = computed<POSProduct[]>(() => {
    const items = [...(catalog.data.value?.data ?? [])]
    for (const product of serverProducts.value) {
      if (!items.some((item) => item.code === product.code))
        items.push({
          id: product.id,
          code: product.code,
          name: product.name,
          category: product.category.toLowerCase().includes('cetak') ? 'cetak' : 'other',
          price: product.price,
          stock: 50,
          image: '/assets/img/products/brosur.png',
          specs: `${product.subCategory}, ${product.unit}`,
        })
    }
    return items
  })
  const categories = computed<POSCategory[]>(() =>
    [
      ['all', 'All Categories'],
      ['cetak', 'Cetak Full Color'],
      ['headphones', 'Headphones'],
      ['shoes', 'Shoes'],
      ['mobiles', 'Mobiles'],
      ['watches', 'Watches'],
      ['laptops', 'Laptops'],
      ['other', 'Other'],
    ].map(([id, name], index) => ({
      id: id!,
      name: name!,
      count: products.value.filter((item) => id === 'all' || item.category === id).length,
      icon: `/assets/img/categories/category-0${Math.min(index + 1, 6)}.png`,
    })),
  )
  const filteredProducts = computed(() =>
    products.value.filter(
      (item) =>
        (selectedCategory.value === 'all' || item.category === selectedCategory.value) &&
        `${item.name} ${item.code}`.toLowerCase().includes(productSearchQuery.value.trim().toLowerCase()),
    ),
  )
  const cart = ref<CartItem[]>([])
  const customer = ref<POSCustomer>({ name: 'Walk-in Customer', phone: '-', email: '-', address: '-' })
  const discountAmount = ref(0),
    shippingCost = ref(0),
    taxRate = ref(0)
  const subtotal = computed(() => cart.value.reduce((sum, item) => sum + item.price * item.qty, 0))
  const taxAmount = computed(() =>
    Math.round((Math.max(0, subtotal.value - discountAmount.value) * taxRate.value) / 100),
  )
  const totalPayable = computed(
    () => Math.max(0, subtotal.value - discountAmount.value) + shippingCost.value + taxAmount.value,
  )
  const taxModalOpen = ref(false),
    shippingModalOpen = ref(false),
    discountModalOpen = ref(false),
    holdModalOpen = ref(false),
    paymentModalOpen = ref(false),
    receiptModalOpen = ref(false),
    ordersModalOpen = ref(false),
    transactionsModalOpen = ref(false),
    addCustomerModalOpen = ref(false),
    editItemModalOpen = ref(false)
  const editingItem = ref<CartItem | null>(null)
  const holdOrders = ref<HeldOrder[]>([]),
    holdReference = ref('')
  const paymentMethod = ref<POSPaymentMethod>('cash'),
    cashReceived = ref(0)
  const receipt = ref<POSReceipt | null>(null)
  const changeDue = computed(() => Math.max(0, cashReceived.value - totalPayable.value))
  const busy = ref(false),
    actionError = ref('')
  function addToCart(product: POSProduct) {
    const existing = cart.value.find((item) => item.productId === product.id)
    if (existing) {
      setQty(existing, existing.qty + 1)
      return
    }
    if (product.stock <= 0) return
    cart.value.push({
      id: crypto.randomUUID(),
      productId: product.id,
      code: product.code,
      name: product.name,
      category: product.category,
      price: product.price,
      qty: 1,
      specs: product.specs || 'Standard Specification',
      jobTitle: product.name,
    })
  }
  function setQty(item: CartItem, qty: number) {
    if (!Number.isFinite(qty) || qty <= 0) return
    item.qty = Math.min(
      Math.floor(qty),
      products.value.find((product) => product.id === item.productId)?.stock ?? Number.MAX_SAFE_INTEGER,
    )
  }
  function updateQty(item: CartItem, delta: number) {
    if (item.qty + delta <= 0) removeCartItem(item.id)
    else setQty(item, item.qty + delta)
  }
  function removeCartItem(id: string) {
    cart.value = cart.value.filter((item) => item.id !== id)
  }
  function clearCart() {
    cart.value = []
    discountAmount.value = 0
    shippingCost.value = 0
    taxRate.value = 0
  }
  function openEditItem(item: CartItem) {
    editingItem.value = { ...item }
    editItemModalOpen.value = true
  }
  function saveEditingItem(item: CartItem) {
    if (!Number.isFinite(item.price) || item.price < 0 || !Number.isInteger(item.qty) || item.qty <= 0) return
    const index = cart.value.findIndex((value) => value.id === item.id)
    if (index >= 0) {
      cart.value[index] = { ...item }
      setQty(cart.value[index]!, item.qty)
    }
    editItemModalOpen.value = false
  }
  function confirmHold() {
    if (!cart.value.length) return
    holdOrders.value.push({
      id: crypto.randomUUID(),
      ref: holdReference.value || `HOLD-${Date.now()}`,
      total: totalPayable.value,
      time: new Date().toLocaleTimeString(),
      items: JSON.parse(JSON.stringify(cart.value)),
      customer: { ...customer.value },
      discount: discountAmount.value,
      shipping: shippingCost.value,
      taxRate: taxRate.value,
    })
    clearCart()
    holdReference.value = ''
    holdModalOpen.value = false
  }
  function restoreHold(order: HeldOrder) {
    // Preserve an in-progress cart before resuming another order.
    if (cart.value.length) confirmHold()
    cart.value = JSON.parse(JSON.stringify(order.items))
    customer.value = { ...order.customer }
    discountAmount.value = order.discount
    shippingCost.value = order.shipping
    taxRate.value = order.taxRate
    holdOrders.value = holdOrders.value.filter((item) => item.id !== order.id)
    ordersModalOpen.value = false
  }
  onMounted(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('dulank-pos-held-orders') || '[]')
      if (Array.isArray(saved))
        holdOrders.value = saved.filter(
          (item) =>
            item &&
            typeof item.id === 'string' &&
            Array.isArray(item.items) &&
            item.customer &&
            Number.isFinite(item.total) &&
            Number.isFinite(item.discount) &&
            Number.isFinite(item.shipping) &&
            Number.isFinite(item.taxRate),
        )
    } catch {
      /* Keep the current session usable if local storage is unavailable. */
    }
  })
  watch(
    holdOrders,
    (value) => {
      try {
        localStorage.setItem('dulank-pos-held-orders', JSON.stringify(value))
      } catch {
        actionError.value = 'Held orders are available in this session only; browser storage is unavailable.'
      }
    },
    { deep: true },
  )
  function openPaymentModal() {
    if (!cart.value.length) return
    actionError.value = ''
    cashReceived.value = totalPayable.value
    paymentModalOpen.value = true
  }
  async function completePayment() {
    if (busy.value || !cart.value.length) return
    actionError.value = ''
    if (
      ![discountAmount.value, shippingCost.value, taxRate.value, cashReceived.value].every(
        (value) => Number.isFinite(value) && value >= 0,
      ) ||
      discountAmount.value > subtotal.value ||
      taxRate.value > 100
    ) {
      actionError.value = 'Check discount, shipping, tax and payment amounts.'
      return
    }
    if (paymentMethod.value === 'cash' && cashReceived.value < totalPayable.value) {
      actionError.value = 'Cash received is less than the total due.'
      return
    }
    busy.value = true
    try {
      const result = await saveSale({
        customer: customer.value.name || 'Walk-in Customer',
        subTotal: subtotal.value,
        deliveryFee: shippingCost.value,
        discount: discountAmount.value,
        tax: taxAmount.value,
        delivery: shippingCost.value > 0 ? 'Shipping' : 'Pick Up',
        channel: 'POS',
        status: 'Paid',
        method:
          paymentMethod.value === 'cash'
            ? 'Cash'
            : paymentMethod.value === 'card'
              ? 'Debit Card'
              : 'Bank Transfer',
        items: cart.value.map((item) => ({ ...item })),
      })
      if (!result.success) throw new Error(result.message || 'Unable to save this order.')
      receipt.value = {
        saleNo: result.data.saleNo,
        items: cart.value.map((item) => ({ ...item })),
        customer: { ...customer.value },
        total: totalPayable.value,
        paid: paymentMethod.value === 'cash' ? cashReceived.value : totalPayable.value,
        change: paymentMethod.value === 'cash' ? changeDue.value : 0,
        method: paymentMethod.value,
      }
      paymentModalOpen.value = false
      receiptModalOpen.value = true
      clearCart()
    } catch (error) {
      actionError.value = salesErrorMessage(error)
    } finally {
      busy.value = false
    }
  }
  function printThermalReceipt() {
    if (!receipt.value) return
    printSalesRows(
      `Receipt ${receipt.value.saleNo} — ${receipt.value.customer.name}`,
      ['Product', 'Quantity', 'Price', 'Amount'],
      [
        ...receipt.value.items.map((item) => [item.name, item.qty, item.price, item.price * item.qty]),
        ['TOTAL', '', '', receipt.value.total],
        ['PAID', '', '', receipt.value.paid],
        ['CHANGE', '', '', receipt.value.change],
      ],
    )
  }
  function resetAll() {
    clearCart()
    receiptModalOpen.value = false
    receipt.value = null
  }
  function selectCustomer(value: POSCustomer) {
    customer.value = value
    addCustomerModalOpen.value = false
  }
  return {
    pending: catalog.pending,
    error: catalog.error,
    refresh: catalog.refresh,
    sales,
    refreshSales,
    categories,
    selectedCategory,
    productSearchQuery,
    filteredProducts,
    cart,
    customer,
    discountAmount,
    shippingCost,
    taxRate,
    subtotal,
    taxAmount,
    totalPayable,
    taxModalOpen,
    shippingModalOpen,
    discountModalOpen,
    holdModalOpen,
    paymentModalOpen,
    receiptModalOpen,
    ordersModalOpen,
    transactionsModalOpen,
    addCustomerModalOpen,
    editItemModalOpen,
    editingItem,
    holdOrders,
    holdReference,
    paymentMethod,
    cashReceived,
    changeDue,
    receipt,
    busy,
    actionError,
    addToCart,
    updateQty,
    setQty,
    removeCartItem,
    clearCart,
    openEditItem,
    saveEditingItem,
    confirmHold,
    restoreHold,
    openPaymentModal,
    completePayment,
    printThermalReceipt,
    resetAll,
    selectCustomer,
  }
}
