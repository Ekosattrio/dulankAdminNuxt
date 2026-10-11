import type { SupportTicket, SupportTicketCommand, SupportTicketFilterQuery } from '#server/types/support-ticket'
import type { DateRangeValue } from '~/composables/useDateRange'
import { useSupportTickets } from '~/composables/useSupportTickets'

export function useSupportTicketPage() {
  const searchQuery = ref('')
  const filterPriority = ref('')
  const filterStatus = ref('')
  const filterDateRange = ref<DateRangeValue | null>(null)

  const filterParams = computed<SupportTicketFilterQuery>(() => ({
    search: searchQuery.value || undefined,
    priority: filterPriority.value || undefined,
    status: filterStatus.value || undefined,
    startDate: filterDateRange.value?.start || undefined,
    endDate: filterDateRange.value?.end || undefined
  }))

  const {
    tickets,
    stats,
    pending,
    error,
    refresh,
    createTicket,
    deleteTicket
  } = useSupportTickets(filterParams)

  const showAddModal = ref(false)
  const showDeleteConfirm = ref(false)
  const ticketToDelete = ref<SupportTicket | null>(null)
  const isBusy = ref(false)
  const mutationError = ref('')
  const message = ref('')

  const openDetail = (ticket: SupportTicket) => {
    return navigateTo({ path: '/support-ticket-detail', query: { id: ticket.id } })
  }

  const confirmDelete = (ticket: SupportTicket) => {
    ticketToDelete.value = ticket
    showDeleteConfirm.value = true
  }

  const handleDeleteTicket = async () => {
    if (!ticketToDelete.value) return
    isBusy.value = true
    mutationError.value = ''
    try {
      await deleteTicket(ticketToDelete.value.id)
      message.value = 'Support ticket deleted successfully'
      showDeleteConfirm.value = false
      ticketToDelete.value = null
    } catch (err) {
      mutationError.value = err instanceof Error ? err.message : 'Failed to delete ticket'
    } finally {
      isBusy.value = false
    }
  }

  const handleAddTicket = async (formData: SupportTicketCommand) => {
    isBusy.value = true
    mutationError.value = ''
    try {
      await createTicket(formData)
      showAddModal.value = false
      message.value = 'Support ticket successfully created'
    } catch (err) {
      mutationError.value = err instanceof Error ? err.message : 'Failed to create ticket'
    } finally {
      isBusy.value = false
    }
  }

  return {
    tickets,
    stats,
    pending,
    error,
    refresh,
    searchQuery,
    filterPriority,
    filterStatus,
    filterDateRange,
    showAddModal,
    showDeleteConfirm,
    ticketToDelete,
    isBusy,
    mutationError,
    message,
    openDetail,
    confirmDelete,
    handleDeleteTicket,
    handleAddTicket,
  }
}

