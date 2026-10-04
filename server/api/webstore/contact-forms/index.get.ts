import type { ContactFormItem, ContactFormStats } from '~/types/contact-form'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const items = await readJSON<ContactFormItem[]>('contact-forms.json', [])

  const totalContact = items.length

  let filtered = [...items]

  if (query.search) {
    const s = String(query.search).toLowerCase().trim()
    filtered = filtered.filter(item =>
      (item.name && item.name.toLowerCase().includes(s)) ||
      (item.email && item.email.toLowerCase().includes(s)) ||
      (item.phone && item.phone.toLowerCase().includes(s)) ||
      (item.subject && item.subject.toLowerCase().includes(s)) ||
      (item.message && item.message.toLowerCase().includes(s))
    )
  }

  if (query.startDate && query.endDate) {
    filtered = filtered.filter(item => isDateInRange(item.date, String(query.startDate), String(query.endDate)))
  }

  return {
    success: true,
    data: filtered,
    stats: {
      totalContact
    } satisfies ContactFormStats
  }
})
