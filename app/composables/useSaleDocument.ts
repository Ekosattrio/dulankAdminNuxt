export function useSaleDocument() {
  const route = useRoute()
  const { sales, pending, error } = useSales()
  const record = computed(() =>
    sales.value.find((sale) => sale.id === route.query.id || sale.saleNo === route.query.no),
  )
  const message = computed(() =>
    error.value
      ? 'Unable to load the sale.'
      : !pending.value && !record.value
        ? 'Select a sale from the Sales menu.'
        : '',
  )
  return { record, pending, message }
}
