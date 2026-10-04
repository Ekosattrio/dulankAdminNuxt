import type { ContactFormItem } from '~/types/contact-form'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const items = await readJSON<ContactFormItem[]>('contact-forms.json', [])

  const initialLength = items.length
  const filtered = items.filter(c => c.id !== id)

  if (filtered.length === initialLength) {
    throw createError({ statusCode: 404, statusMessage: 'Contact entry not found' })
  }

  await writeJSON('contact-forms.json', filtered)

  return {
    success: true,
    message: 'Contact form entry deleted successfully'
  }
})
