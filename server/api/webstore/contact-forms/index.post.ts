import type { ContactFormItem } from '~/types/contact-form'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const items = await readJSON<ContactFormItem[]>('contact-forms.json', [])

  const nextId = `CNT-${5000 + items.length + 1}`
  const now = new Date()
  const dd = String(now.getDate()).padStart(2, '0')
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const yyyy = now.getFullYear()
  const date = `${dd}/${mm}/${yyyy}`

  const newContact: ContactFormItem = {
    id: nextId,
    name: body.name || 'Anonymous',
    email: body.email || '',
    phone: body.phone || '',
    subject: body.subject || 'General Inquiry',
    message: body.message || '',
    date,
    status: 'Unread'
  }

  items.unshift(newContact)
  await writeJSON('contact-forms.json', items)

  return {
    success: true,
    data: newContact,
    message: 'Contact form message submitted successfully'
  }
})
