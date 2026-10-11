import customerSource from '../../legacy/static-source/assets/json/customer.json'
import companySource from '../../legacy/static-source/assets/json/company.json'
import type { CustomerRecord } from '#server/types/customer'
import type { SalesContact } from '#server/types/sales-document'
import { readJSON } from './data'

export function listSalesContacts(): SalesContact[] {
  const saved = readJSON<CustomerRecord[]>('customers.json', [])
  const contacts: SalesContact[] = [
    ...customerSource.customer,
    ...companySource.company,
    ...saved.map((customer) => ({
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
      address: '',
    })),
  ]

  return [
    ...new Map(
      contacts.map((contact) => [contact.name, { ...contact, address: contact.address || '' }]),
    ).values(),
  ]
}
