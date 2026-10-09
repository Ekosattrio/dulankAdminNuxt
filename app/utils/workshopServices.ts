import type { WorkshopServiceCategory } from '#server/types/workshop-service'

export const workshopServiceConfig: Record<WorkshopServiceCategory, {
  title: string
  subtitle: string
  addLabel: string
  reportTitle: string
}> = {
  printing: { title: 'Mesin Cetak List', subtitle: 'Manage your Mesin Cetak', addLabel: 'Add New Printing Machine', reportTitle: 'Mesin Cetak Internal Report' },
  laminate: { title: 'Mesin Laminasi List', subtitle: 'Manage your Mesin Laminasi', addLabel: 'Add New Laminate Type', reportTitle: 'Mesin Laminasi Internal Report' },
  die_cutting: { title: 'Mesin Pond List', subtitle: 'Manage your Mesin Pond', addLabel: 'Add New Pond', reportTitle: 'Mesin Pond Internal Report' },
  hot_print: { title: 'Mesin Poli List', subtitle: 'Manage your Mesin Poli', addLabel: 'Add New Poli', reportTitle: 'Mesin Poli Internal Report' },
}

export function formatWorkshopDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).format(date).replace(',', '')
}
