import type { SupportTicket, SupportTicketCommand, SupportTicketUpdateCommand } from '#server/types/support-ticket'

interface TicketResponse {
  success: boolean
  data: SupportTicket
  message?: string
}

export function useSupportTicketDetail(id: Ref<string>) {
  const endpoint = `/api/webstore/support-tickets/${encodeURIComponent(id.value)}`
  const { data, pending, error, refresh } = useApiFetch<TicketResponse>(endpoint, {
    key: `support-ticket-detail-${id.value}`,
  })
  const ticket = computed(() => data.value?.data ?? null)
  const busy = ref(false)
  const message = ref('')
  const mutationError = ref('')

  async function update(payload: SupportTicketUpdateCommand) {
    busy.value = true
    message.value = ''
    mutationError.value = ''
    try {
      const response = await apiFetch<TicketResponse>(`/api/webstore/support-tickets/${encodeURIComponent(id.value)}`, {
        method: 'PUT',
        body: payload,
      })
      data.value = response
      message.value = response.message || 'Support ticket updated successfully'
      return response.data
    } catch (error) {
      mutationError.value = error instanceof Error ? error.message : 'Failed to update support ticket'
      throw error
    } finally {
      busy.value = false
    }
  }

  function saveEditor(command: SupportTicketCommand) {
    return update({
      requestedBy: command.customerName,
      customerEmail: command.email,
      customerPhone: command.phone,
      avatar: command.avatar,
      address: command.address,
      city: command.city,
      country: command.country,
      description: command.descriptions,
    })
  }

  function sendReply(value: string) {
    return update({ newMessage: value, senderName: 'Admin' })
  }

  function setStatus(status: SupportTicket['status']) {
    return update({ status, senderName: 'Admin' })
  }

  return { ticket, pending, error, busy, message, mutationError, refresh, saveEditor, sendReply, setStatus }
}
