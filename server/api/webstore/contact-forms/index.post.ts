import { createContactForm } from '~~/server/utils/webstoreDomainData'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const newContact = await createContactForm(body)

  return {
    success: true,
    data: newContact,
    message: 'Contact form message submitted successfully',
  }
})
