import { defineEventHandler, getQuery } from 'h3'
import { createResponse } from '../../utils/data'
import { listProducts } from '../../utils/products'

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const search = String(query.search || '').toLowerCase().trim()
  const category = String(query.category || '')
  const status = String(query.status || '')
  let records = listProducts()
  if (search) records = records.filter(item => [item.name, item.code, item.subCategory].some(value => value.toLowerCase().includes(search)))
  if (category) records = records.filter(item => item.categoryId === category || item.category === category)
  if (status) records = records.filter(item => item.status === status)
  return createResponse(records, { total: records.length })
})
