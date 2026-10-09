import type { SupportTicket, SupportTicketStats, SupportTicketFilterQuery } from '#server/types/support-ticket'

interface ResponseData {
  success: boolean
  data: SupportTicket[]
  stats?: SupportTicketStats
  message?: string
}

export function useSupportTickets(filterParams?: Ref<SupportTicketFilterQuery> | SupportTicketFilterQuery) {
  const params = isRef(filterParams) ? filterParams : ref(filterParams || {})

  const { data, pending, error, refresh } = useApiFetch<ResponseData>('/api/webstore/support-tickets', {
    key: 'webstore-support-tickets-list',
    query: params
  })

  const tickets = computed<SupportTicket[]>(() => data.value?.data ?? [])
  const stats = computed<SupportTicketStats>(() => data.value?.stats ?? {
    totalTickets: 0,
    totalPendingTickets: 0,
    totalClosedTickets: 0,
    totalDeleteTickets: 0
  })

  const createTicket = async (payload: Partial<SupportTicket> & { customerName?: string; email?: string; phone?: string; descriptions?: string }) => {
    const res = await apiFetch<{ success: boolean; data: SupportTicket; message?: string }>('/api/webstore/support-tickets', {
      method: 'POST',
      body: payload
    })
    await refresh()
    return res
  }

  const updateTicket = async (id: string, payload: Partial<SupportTicket> & { newMessage?: string; senderName?: string }) => {
    const res = await apiFetch<{ success: boolean; data: SupportTicket; message?: string }>(`/api/webstore/support-tickets/${id}`, {
      method: 'PUT',
      body: payload
    })
    await refresh()
    return res
  }

  const deleteTicket = async (id: string) => {
    const res = await apiFetch<{ success: boolean; message?: string }>(`/api/webstore/support-tickets/${id}`, {
      method: 'DELETE'
    })
    await refresh()
    return res
  }

  return {
    tickets,
    stats,
    pending,
    error,
    refresh,
    createTicket,
    updateTicket,
    deleteTicket
  }
}
